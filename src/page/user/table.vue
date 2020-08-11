<style lang="less" scoped>
.cards {
  margin-left: 80px;
  display: flex;
  .idcard {
    margin-right: 20px;
    border: 1px dashed #999;
    img {
      width: 150px;
      height: 150px;
      object-fit: contain;
      cursor: pointer;
    }
  }
}
.erji-title {
  font-weight: 700;
  font-size: 14px;
  margin-left: 20px;
}
.tip {
  font-size: 12px;
  line-height: 14px;
  color: #f00;
  margin-top: 3px;
}
.lover {
  display: flex;
  justify-content: space-between;
}
.dialog-footer {
  text-align: center;
  .el-button {
    margin: 0 10px;
  }
}
</style>
<template>
  <div class="content">
    <div class="uu-tab">
      <div class="top" style=" margin:10px 0px; cursor:pointer">
        <el-button type="primary" @click="activeAll(1)">批量激活</el-button>
        <span style="margin-right:10px"></span>
        <el-button type="danger" @click="activeAll(2)">批量冻结</el-button>
      </div>
      <el-table
        size="mini"
        :data="data"
        border
        style="width: 100%"
        @sort-change="sortChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="推手编号"></el-table-column>
        <el-table-column prop="real_name" label="推手姓名"></el-table-column>
        <el-table-column prop="wechat.nickname" label="微信昵称"></el-table-column>
        <el-table-column prop="gender" label="性别">
          <template slot-scope="{ row }">
            <div
              class="center"
              style="text-align:center; margin:0 auto"
            >{{ row.gender == "1" ? "男" : "女" }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="推手手机号"></el-table-column>
        <el-table-column sortable="custom" prop="create_time" label="加入时间"></el-table-column>
        <el-table-column prop="active_time" label="激活时间"></el-table-column>
        <el-table-column prop="last_login_time" label="最后活跃" sortable="custom"></el-table-column>
        <el-table-column prop="partner_num" label="伙伴人数"></el-table-column>
        <el-table-column prop="role_id" label="身份信息">
          <template slot-scope="scope">
            <div class="center" style="text-align:center; margin:0 auto">
              <el-button type="text" size="small" v-if="parseInt(scope.row.role_id) === 1">微商</el-button>
              <el-button type="text" size="small" v-if="parseInt(scope.row.role_id) === 2">高校大学生</el-button>
              <el-button type="text" size="small" v-if="parseInt(scope.row.role_id) === 0">普通</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="lover_mobile" width="120" label="推荐人手机"></el-table-column>
        <el-table-column prop="name" label="推手状态" width="80">
          <template slot-scope="scope">
            <div class="center" style="text-align:center; margin:0 auto">
              <el-tag v-if="parseInt(scope.row.status) === 1">激活</el-tag>
              <el-tag type="danger" v-else>冻结</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="实名状态">
          <template slot-scope="{ row }">
            <div class="center" style="text-align:center; margin:0 auto">
              <el-tag :type="authMap[row.id_card_auth_status].icon">
                {{
                authMap[row.id_card_auth_status].label
                }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template slot-scope="{ row }">
            <div class="center" style="text-align:center; margin:0 auto">
              <el-button
                type="text"
                size="small"
                @click="tabDz(row)"
              >{{ parseInt(row.status) === 1 ? "冻结" : "激活" }}</el-button>
              <el-button
                :disabled="row.id_card_auth_status == 0"
                type="text"
                size="small"
                @click="tabInfo(row)"
              >
                {{
                row.id_card_auth_status == 1 ? "审核" : "查看"
                }}资料
              </el-button>
              <el-button
                :disabled="row.status != 1"
                type="text"
                size="small"
                @click="tabSetting(row)"
              >佣金设置</el-button>
              <el-button type="text" size="small" @click="tabLog(row.id)">查看日志</el-button>
              <!-- <el-button type="text" size="small" @click="tabSetting(scope.row)">查看日志</el-button> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="page" style="text-align:center;margin-top:20px">
        <el-pagination
          @current-change="handleCurrentChange"
          layout="prev, pager, next, total"
          :total="total"
          :page-size="page_size"
        ></el-pagination>
      </div>
    </div>
    <div class="model">
      <el-dialog
        title="佣金设置"
        :visible="userSetting"
        @close="handlerCancel"
        :lock-scroll="false"
        width="50%"
      >
        <div class="form" v-if="vset">
          <el-form :rules="rules" ref="setting" :model="vset" label-width="140px">
            <template v-if="vset.wechat">
              <el-form-item label="微信昵称:">{{ vset.wechat.nickname }}</el-form-item>
            </template>
            <el-form-item label="推手手机:">{{ vset.mobile }}</el-form-item>
            <el-form-item label="激活时间:">{{ vset.active_time }}</el-form-item>

            <div class="lover" v-if="vset.lover">
              <el-form-item
                label-width="80px"
                label="推荐人:"
                prop="resource"
              >{{ vset.lover.mobile }} (ID:{{ vset.lover.uid }})</el-form-item>
              <el-form-item
                label-width="120px"
                label="推荐人返利比例:"
                prop="resource"
              >{{ vset.lover.rate_commission }}</el-form-item>
            </div>

            <el-form-item prop="rate_commission" label="订单返利比例:">
              <el-input-number
                v-model="vset.rate_commission"
                controls-position="right"
                :min="0"
                :step="0.1"
                @blur="rate_commission"
              ></el-input-number>
              <!-- <div class="tip"
                >请输入0-1之间的两位小数</div
              >-->
            </el-form-item>
            <el-form-item label="推手角色:" prop="resource">
              <el-radio-group v-model="vset.role_id">
                <el-radio label="0" value="0">普通</el-radio>
                <el-radio label="1" value="1">微商</el-radio>
                <el-radio label="2" value="2">高校大学生</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="推荐人">
              <el-input v-model="vset.inviter_name" :disabled="true"></el-input>
            </el-form-item>-->
            <div class="erji-title">二级设置</div>
            <el-form-item prop="lover_money" label="邀请激励金额(元):">
              <el-input-number
                v-model="vset.lover_money"
                controls-position="right"
                :min="0"
                :step="1"
              ></el-input-number>
              <!-- <div class="tip"
                >请输入0-100000之间的数字，支持两位小数</div
              >-->
            </el-form-item>
            <el-form-item prop="rate_partner" label="伙伴成单返利比例:">
              <el-input-number
                v-model="vset.rate_partner"
                controls-position="right"
                :min="0"
                :step="0.1"
              ></el-input-number>
              <!-- <div class="tip"
                >请输入0-1之间的两位小数</div
              >-->
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handlerCancel">取 消</el-button>
          <el-button type="primary" @click="htSetting">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :title="`${setting.id_card_auth_status == 1 ? '审核' : '查看'}资料`"
        :visible.sync="userInfo"
        :lock-scroll="false"
        width="50%"
      >
        <div class="form">
          <el-form ref="auth" :model="setting" label-width="80px">
            <div class="lover">
              <el-form-item label-width="80px" label="实名状态:">
                {{
                authMap[setting.id_card_auth_status] &&
                authMap[setting.id_card_auth_status].label
                }}
              </el-form-item>
              <el-form-item
                label-width="80px"
                label="认证来源:"
              >{{ sourceMap[setting.id_card_auth_source] }}</el-form-item>
            </div>
            <el-form-item label="姓名">
              <el-input v-model="setting.real_name" style="width:200px" readonly></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="setting.gender" :disabled="infoDis">
                <el-radio label="2" value="2">女</el-radio>
                <el-radio label="1" value="1">男</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="手机">
              <el-input v-model="setting.mobile" style="width:200px" readonly></el-input>
            </el-form-item>
            <!-- <el-form-item label="微信号">
              <el-input v-model="setting.wechat_card" style="width:200px" :disabled="infoDis"></el-input>
            </el-form-item>-->
            <el-form-item label="身份证">
              <el-input v-model="setting.id_card" style="width:200px" readonly></el-input>
            </el-form-item>
            <div
              class="cards"
              v-if="
                setting.id_card_auth_status != 0 &&
                  setting.id_card_auth_source != 2 &&
                  setting.id_card_auth_source != 3
              "
            >
              <div class="idcard">
                <img
                  @click="handlePictureCardPreview(setting.id_card_pic_front)"
                  :src="setting.id_card_pic_front"
                />
              </div>
              <div class="idcard">
                <img
                  @click="handlePictureCardPreview(setting.id_card_pic_reverse)"
                  :src="setting.id_card_pic_reverse"
                />
              </div>
            </div>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <div v-if="setting.id_card_auth_status == 1">
            <el-button size="medium" type="danger" @click="editUserInfo(2)">驳 回</el-button>
            <el-button size="medium" type="info" @click="userInfo = false">取 消</el-button>
            <el-button type="success" size="medium" @click="editUserInfo(3)">通过</el-button>
          </div>
          <div class="lat" v-else>
            <el-button type="primary" size="medium" @click="userInfo = false">知道了</el-button>
          </div>
        </span>
      </el-dialog>

      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>
    </div>
  </div>
</template>
<script type="text/javascript">
import { getUserInfo, updateUser, changeCommission } from "@/api/user";
import { apiUpload } from "@/api/source";
import { authMap } from "./config";
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      }
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    const validator = (rule, value, callback) => {
      const rate = this.vset.rate_commission;
      if (rate === "" || rate > 1 || rate < 0) {
        return callback("请输入0-1之间的两位小数");
      }
      const point = (rate || 0).toString().split(".")[1];
      if (point && point.length > 2) {
        return callback("请输入0-1之间的两位小数");
      }
      const lover = this.vset.lover ? this.vset.lover.rate_commission : 0;
      if (+lover + rate > 1) {
        return callback("订单返利比例不得高于（1-推荐人返利比例）");
      }
      callback();
    };
    const validator1 = (rule, value, callback) => {
      const rate = this.vset.lover_money;
      if (rate === "" || rate > 100000 || rate < 0) {
        return callback("请输入0-100000之间的数字，支持两位小数");
      }
      const point = (rate || 0).toString().split(".")[1];
      if (point && point.length > 2) {
        return callback("最多支持两位小数");
      }
      callback();
    };
    const validator2 = (rule, value, callback) => {
      const rate = this.vset.rate_partner;
      if (rate === "" || rate > 1 || rate < 0) {
        return callback("请输入0-1之前的两位小数");
      }
      const point = (rate || 0).toString().split(".")[1];
      if (point && point.length > 2) {
        return callback("请输入0-1之间的两位小数");
      }
      callback();
    };
    return {
      page_size: 12,
      dialogVisible: false,
      dialogImageUrl: "",
      input: {
        status: 0,
        username: "",
        mobile: "",
        bind_mobile_time: "",
        inviter_uid: "",
        page: 1,
        page_size: 12
      },
      sourceMap: {
        1: "氧乐享",
        2: "新氧平台",
        3: "新氧平台"
      },
      rules: {
        rate_commission: [
          {
            validator,
            required: true,
            trigger: "blur"
          }
        ],
        lover_money: [
          {
            validator: validator1,
            required: true,
            trigger: "blur"
          }
        ],
        rate_partner: [
          {
            validator: validator2,
            required: true,
            trigger: "blur"
          }
        ]
      },
      authMap,
      userSetting: false,
      userInfo: false,
      setting: {
        id_card_pic_before: "",
        id_card_pic_after: ""
      },
      choseItem: [],
      vset: null,
      infoDis: true
    };
  },
  computed: {},
  watch: {},
  components: {},
  methods: {
    tabLog(obj) {
      this.$emit("log", {
        type: 4,
        obj,
        page: 1,
        page_size: 20
      });
    },
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    rate_commission() {
      if (this.vset.rate_commission) {
      }
    },
    sortChange({ prop, order }) {
      this.$emit("getList", {
        sortBy: prop,
        sort: order === "descending" ? 1 : 0
      });
    },
    handleCurrentChange(page) {
      this.$emit("getList", { page });
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
    getList() {
      getUserInfo(this.input).then(res => {
        if (res.errorCode === 200) {
          this.tableData = res.responseData.data;
          this.total = res.responseData.total;
        }
      });
    },
    tabSetting(row) {
      this.vset = { ...row };
      this.userSetting = !this.userSetting;
    },
    tabInfo(row) {
      this.setting = row;
      this.userInfo = !this.userInfo;
    },
    tabDz(item) {
      const status = parseInt(item.status) === 2 ? 1 : 2;
      if (confirm(`您确定要操作吗`)) {
        this.updateRows({
          status: status,
          id: JSON.stringify([item.id])
        });
      }
    },
    activeAll(id) {
      if (this.choseItem.length > 0) {
        if (confirm(`确认要 ${id === 1 ? "批量激活" : "批量冻结"}吗?`)) {
          let idArr = [];
          this.choseItem.map(value => {
            idArr.push(value.id);
          });
          console.log(id);
          this.updateRows(
            {
              status: id,
              id: JSON.stringify(idArr)
            },
            () => {
              this.$emit("update", 1);
            }
          );
        }
      } else {
        alert(`抱歉,您还未选择用户`);
      }
    },
    updateRows(data, fn) {
      updateUser(data).then(res => {
        if (res.errorCode === 200) {
          alert("操作成功");
          this.$emit("update");
          fn && fn();
        } else {
          alert("操作失败");
        }
      });
    },
    editUserInfo(id_card_auth_status) {
      this.updateRows(
        {
          id: this.setting.id,
          id_card_auth_status
        },
        () => {
          this.userInfo = false;
          this.$emit("update");
        }
      );
    },
    htSetting() {
      this.$refs.setting.validate(valid => {
        if (valid) {
          this.$confirm("确认要提交吗?请认真核对之后再提交?", "提示", {
            lockScroll: false,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(async () => {
              try {
                const conf = this.vset;
                const res = await changeCommission({
                  id: conf.id,
                  role_id: conf.role_id,
                  rate_commission: conf.rate_commission,
                  lover_money: conf.lover_money,
                  rate_partner: conf.rate_partner
                });
                if (res.errorCode !== 0) {
                  throw res;
                }
                this.userSetting = false;
                this.$refs.setting.clearValidate();
                this.$message.success("修改成功");
                this.$emit("update");
              } catch (error) {
                this.$message.error(error.errorMsg);
              }
            })
            .catch(() => {});
        } else {
          return false;
        }
      });
    },

    handlerCancel() {
      if (!this.userSetting) return;
      this.$confirm("您填写的内容还未保存，是否放弃保存?", "提示", {
        lockScroll: false,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$refs.setting.clearValidate();
          this.userSetting = false;

          // this.handlerSubmit();
        })
        .catch(() => {});
    }
  },
  created() {}
};
</script>
