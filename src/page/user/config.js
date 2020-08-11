export const authStatus = [{
    label: "全部",
    value: ""
  }, {
    label: "未提交",
    value: "0"
  },
  {
    label: "待审核",
    value: "1"
  },
  {
    label: "已驳回",
    value: "2"
  },
  {
    label: "已认证",
    value: "3"
  }
];

export const authMap = {
  0: {
    label: '未提交',
    icon: ''
  },
  1: {
    label: "待审核",
    icon: 'warning'
  },
  2: {
    label: "已驳回",
    icon: 'danger'
  },
  3: {
    label: "已认证",
    icon: 'success'
  }
}
