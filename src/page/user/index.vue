<style lang="less">
.tuishou-content {
  .h24 {
    width: 180px;
    display: inline-block;
  }
  .tab {
    position: relative;
  }
  .cards {
    width: 400px;
    text-align: left;
    .upload {
      width: 50%;
      height: 100px;
      border: 1px dashed #dddddd;
      margin-right: 10px;
      line-height: 100px;
      text-align: center;
      border-radius: 5px;
      cursor: pointer;
      position: relative;
      input {
        position: absolute;
        left: 0;
        right: 0;
        width: 100%;
        opacity: 0;
        height: 100%;
      }
    }
  }
  .showall {
    height: 39px;
    margin-bottom: 10px;
    text-align: right;
  }
  .input-width {
    width: 220px;
  }
  .dia-log {
    height: calc(100% - 20vh);
    overflow: hidden;
    .el-dialog__header {
      text-align: center;
    }
    .el-dialog__body {
      height: calc(100% - 54px);
    }
    .handler {
      text-align: right;
    }
    .table {
      height: calc(100% - 80px);
      overflow: auto;
    }
  }
}
</style>
<template>
  <div class="tuishou-content">
    <div class="search">
      <el-form :model="input" :inline="true" size="mini" label-width="100px">
        <el-form-item label="推手姓名">
          <el-input class="input-width" placeholder="请输入推手姓名" v-model="input.username"></el-input>
        </el-form-item>
        <el-form-item label="推手手机">
          <el-input class="input-width" placeholder="请输入推手手机号" v-model="input.mobile"></el-input>
        </el-form-item>
        <el-form-item label="加入时间">
          <el-date-picker
            class="input-width"
            v-model="input.bind_mobile_time"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="推荐人手机">
          <el-input class="input-width" placeholder="请输入推荐人手机" v-model="input.inviter_mobile"></el-input>
        </el-form-item>

        <el-form-item label="实名状态">
          <el-select
            class="input-width"
            v-model="input.id_card_auth_status"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in authStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="激活时间">
          <el-date-picker
            class="input-width"
            v-model="input.active_time"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" @click="searchData">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="showall">
      <el-button type="primary" @click="getLog()">查看全部操作日志</el-button>
    </div>
    <div class="tab">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="全部氧乐享用户" name="0">
          <tables
            v-loading="loading"
            :data="tableData"
            @getList="handleCurrentChange"
            :total="total"
            ref="child"
            @log="getLog"
            @update="update"
          ></tables>
        </el-tab-pane>
        <el-tab-pane label="已激活" name="1">
          <tables
            :data="tableData"
            v-loading="loading"
            @getList="handleCurrentChange"
            :total="total"
            ref="child"
            @log="getLog"
            @update="update"
          ></tables>
        </el-tab-pane>
        <el-tab-pane label="已冻结" name="2">
          <tables
            :data="tableData"
            v-loading="loading"
            @getList="handleCurrentChange"
            :total="total"
            ref="child"
            @log="getLog"
            @update="update"
          ></tables>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="操作日志" custom-class="dia-log" :visible="logVisible" :before-close="cancelLog">
      <div class="handler">
        <el-button size="mini" @click="exportLog">导出</el-button>
      </div>
      <el-table
        class="table"
        size="mini"
        :data="logData"
        v-loading="logLoading"
        border
        empty-text="该推手暂无操作日志"
        style="width: 100%"
      >
        <el-table-column width="100" prop="create_time" label="时间"></el-table-column>
        <el-table-column width="100" prop="admin_name" label="操作人"></el-table-column>
        <el-table-column prop="obj" label="操作对象(推手id)" width="130"></el-table-column>
        <el-table-column prop="operation" label="操作动作"></el-table-column>
      </el-table>
      <div class="page" style="text-align:center;margin-top:20px">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="+logForm.page_size"
          :current-page="+logForm.page"
          :total="+logForm.total"
          @current-change="handleLogPageChange"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
import { getUserInfo, updateUser, getAdminLog } from "@/api/user";
import { apiUpload } from "@/api/source";
import tables from "./table.vue";
import { authStatus } from "./config";
import qs from "qs";
export default {
  data() {
    return {
      input: {
        status: 0,
        username: "",
        mobile: "",
        bind_mobile_time: "",
        inviter_uid: "",
        id_card_auth_status: "",
        active_time: "",
        page: 1,
        page_size: 12
      },
      loading: false,
      logForm: {
        type: 4,
        page: 1,
        page_size: 20,
        total: 0
      },
      logLoading: false,
      logData: [],
      logVisible: false,
      authStatus,
      activeName: "0",
      tableData: [],
      userSetting: false,
      userInfo: false,
      setting: {
        id_card_pic_before: "",
        id_card_pic_after: ""
      },
      choseItem: [],
      vset: {},
      total: 0,
      infoDis: true
    };
  },
  computed: {},
  watch: {},
  components: {
    tables
  },
  methods: {
    getLog(form) {
      this.logForm = form || {
        type: 4,
        page: 1,
        page_size: 20,
        total: 0
      };
      this.logVisible = true;
      this.getLogData();
    },
    cancelLog() {
      this.logForm = {
        type: 4,
        page: 1,
        page_size: 20,
        total: 0
      };
      this.logData = [];
      this.logVisible = false;
    },
    handleLogPageChange(current) {
      this.logForm.page = current;
      this.getLogData();
    },
    async getLogData() {
      this.logLoading = true;
      const res = await getAdminLog(this.logForm);
      const result = res.responseData;
      this.logForm.total = result.total;
      this.logData = result.data;
      this.logLoading = false;
    },
    exportLog() {
      const data = qs.stringify({
        ...this.logForm,
        export: 1
      });
      window.open(`/syshare/adminLog/getAdminLog?${data}`);
    },
    uploadImg(e, id) {
      const file = e.target.files[0];
      let param = new FormData();
      param.append("file", file);
      apiUpload(param).then(response => {
        if (response.code === 200) {
          if (id === 1) {
            this.setting.id_card_pic_before = response.data.url;
          } else {
            this.setting.id_card_pic_after = response.data.url;
          }
        }
      });
    },
    handleCurrentChange(form) {
      this.input = {
        ...this.input,
        ...form
      };
      this.getList();
    },
    handleSelectionChange(item) {
      this.choseItem = item;
      console.log(item);
    },
    handleClick(tab, event) {
      this.input.status = this.activeName;
      this.input.page = 1;
      this.tableData = [];
      this.getList();
    },
    async getList() {
      this.loading = true;
      try {
        const res = await getUserInfo(this.input);
        if (res.errorCode != 200) {
          throw res;
        }
        this.tableData = res.responseData.data;
        this.total = res.responseData.total;
      } catch (error) {
        this.$message.error(error.errorMsg);
      }
      this.loading = false;
    },
    tabSetting(row) {
      this.vset = {
        role_id: row.role_id,
        uid: row.uid,
        rate_commission: row.rate_commission,
        inviter_name: row.inviter_name,
        id: row.id
      };
      console.log(this.vset);
      this.userSetting = !this.userSetting;
    },
    tabInfo(row) {
      this.setting = {
        real_name: row.real_name,
        gender: row.gender,
        mobile: row.mobile,
        wechat_card: row.wechat_card,
        alipay_account: row.alipay_account,
        //id_card_pic_before: row.id_card_pic_before,
        //id_card_pic_after: row.id_card_pic_after,
        uid: row.uid,
        id: row.id,
        id_card: row.id_card
      };
      console.log(this.setting);
      this.userInfo = !this.userInfo;
    },
    searchData() {
      this.input.page = 1;
      this.getList();
    },
    editUserInfo() {
      this.updateRows(this.setting, () => {
        this.userInfo = false;
        this.getList();
      });
    },
    htSetting() {
      this.updateRows(this.vset, () => {
        this.userSetting = false;
        this.getList();
      });
    },
    update() {
      console.log(`update`);
      this.getList();
    }
  },
  created() {
    this.getList();
  }
};
</script>
