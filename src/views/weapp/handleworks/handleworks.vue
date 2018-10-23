<style lang="less" scoped>
::-webkit-scrollbar {
  width: 0px;
}
.container {
  height: 100%;
  overflow-y: auto;
  .item-cells {
    background-color: #ffffff;
    font-size: 14px;
    overflow: hidden;
    position: relative;
    margin-bottom: 10px;
    &::before {
      content: ' ';
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 1px;
      border-top: 1px solid #e5e5e5;
      color: #e5e5e5;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
    &::after {
      content: ' ';
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 1px;
      border-bottom: 1px solid #e5e5e5;
      color: #e5e5e5;
      -webkit-transform-origin: 0 100%;
      transform-origin: 0 100%;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
    .item-title {
      padding: 10px 0 10px 10px;
      font-size: 16px;
      line-height: 20px;
    }
    .item-cell {
      padding: 10px 15px;
      position: relative;
      display: flex;
      align-items: center;
      .item-cell-hd {
        margin-right: 10px;
      }
      .item-cell-bd {
        margin-right: 10px;
      }
      .item-cell-ft {
        flex: 1;
        text-align: left;
        color: #808080;
      }
      &:before {
        border-top: none;
      }
      &::after {
        content: ' ';
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        border-top: 1px solid #e5e5e5;
        margin: 0 10px;
        color: #e5e5e5;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
    }
    .work-handle {
      padding: 15px 15px 30px 15px;
      position: relative;
      z-index: 1;
      &::before {
        content: '';
        position: absolute;
        left: 32px;
        top: 20px;
        bottom: 22px;
        width: 1px;
        background: red;
        z-index: -1;
      }
      .work-cell {
        padding: 0 0 10px 0;
        &:last-child {
          padding: 0;
        }
        .date {
          color: #666;
          margin-left: 30px;
          margin-bottom: 10px;
          position: relative;
          display: flex;
          line-height: 24px;
          &::after {
            content: '';
            position: absolute;
            top: 6px;
            left: -16px;
            height: 8px;
            width: 8px;
            border-radius: 4px;
            border: 2px solid #fff;
            background: red;
            box-shadow: 0 0 0px 1px red;
          }
        }
        .textarea {
          width: 100%;
          outline: none;
          border-radius: 5px;
          padding: 5px;
          box-shadow: 0 0 10px 2px #eee;
          border: 1px solid #eee;
          display: block;
        }
      }
      .icon-tianjia1 {
        position: absolute;
        bottom: -10px;
        left: 19px;
        font-size: 28px;
        color: #1c9ad2;
      }
    }
    .btn-box {
      margin: 10px;
      box-sizing: content-box;
      .btn {
        width: 100%;
        padding: 5px;
        text-align: center;
        outline: none;
        border: none;
        background: rgb(28, 154, 210);
        color: #fff;
        border-radius: 5px;
      }
    }
  }
}
.modal[data-v-e895ea78] {
  position: fixed;
}
</style>

<template>
    <div class="container">
        <div class="item-cells">
            <div class="item-title">客户信息</div>
            <div class="item-cell">
                <div class="item-cell-bd">宽带账号:</div>
                <div class="item-cell-ft">{{workData.title}}</div>
            </div>
            <div class="item-cell">
                <div class="item-cell-bd">宽带编号:</div>
                <div class="item-cell-ft">{{workData.date}}</div>
            </div>
            <div class="item-cell">
                <div class="item-cell-bd">联系人:</div>
                <div class="item-cell-ft">{{workData.note}}</div>
            </div>
            <div class="item-cell">
                <div class="item-cell-bd">联系电话:</div>
                <div class="item-cell-ft">{{workData.address}}</div>
            </div>
            <div class="item-cell">
                <div class="item-cell-bd">安装地址:</div>
                <div class="item-cell-ft">{{workData.address}}</div>
            </div>
            <div class="item-cell">
                <div class="item-cell-bd">宽带使用年限:</div>
                <div class="item-cell-ft">{{workData.address}}</div>
            </div>
            <div class="item-cell">
                <div class="item-cell-bd">所属机构:</div>
                <div class="item-cell-ft">{{workData.address}}</div>
            </div>
            <div class="item-cell">
                <div class="item-cell-bd">安装客户经理:</div>
                <div class="item-cell-ft">{{workData.address}}</div>
            </div>
            <div class="item-cell">
                <div class="item-cell-bd">联系方式:</div>
                <div class="item-cell-ft">{{workData.address}}</div>
            </div>
        </div>
        <div class="item-cells">
            <div class="item-title">工单信息</div>
            <div class="item-cell">
                <div class="item-cell-bd">来源:</div>
                <div class="item-cell-ft">{{workData.title}}</div>
            </div>
            <div class="item-cell">
                <div class="item-cell-bd">服务类型:</div>
                <div class="item-cell-ft">{{workData.date}}</div>
            </div>
            <div class="item-cell">
                <div class="item-cell-bd">问题现象:</div>
                <div class="item-cell-ft">{{workData.note}}</div>
            </div>
            <div class="item-cell">
                <div class="item-cell-bd">基本诉求:</div>
                <div class="item-cell-ft">{{workData.address}}</div>
            </div>
            <div class="item-cell">
                <div class="item-cell-bd">备注:</div>
                <div class="item-cell-ft">{{workData.address}}</div>
            </div>
        </div>
        <div class="item-cells" style="padding-bottom:10px;">
            <div class="item-title">工单处理</div>
            <div class="work-handle">
                <div class="work-cell" v-for="(item,index) in handleList" :key="index">
                    <div class="date">
                        <span style="flex:1;">
                            选择日期{{ item.selectedDate }}
                        </span>
                        <i class="iconfont icon-rili" @click="dateClick(index)"></i>
                    </div>
                    <textarea v-model="item.textarea" class="textarea"></textarea>
                    <calendar v-model="item.calendarShow" :default-date="item.defaultDate" @change="dateChange">
                    </calendar>
                </div>
                <i class="iconfont icon-tianjia1" @click="addhandle"></i>
            </div>
            <div class="btn-box">
                <button class="btn" @click="submit">提交</button>
            </div>
        </div>

    </div>
</template>
<script>
export default {
  data() {
    return {
      dateIndex: 0,
      workData: {
        title: '工单标题',
        date: '工单派送时间',
        note: '工单备注说明',
        address: '工单地址'
      },
      handleList: [
        {
          calendarShow: false,
          defaultDate: new Date(),
          selectedDate: dateFormat(new Date(), 'yyyy-MM-dd'),
          textarea: ''
        },
        {
          calendarShow: false,
          defaultDate: new Date(),
          selectedDate: dateFormat(new Date(), 'yyyy-MM-dd'),
          textarea: ''
        }
      ]
    }
  },
  methods: {
    getworkData() {
      this.axios
        .get('', {
          params: {}
        })
        .then(res => {
          this.workData = res.data
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    addhandle() {
      var obj = {
        calendarShow: false,
        defaultDate: new Date(),
        selectedDate: dateFormat(new Date(), 'yyyy-MM-dd'),
        textarea: ''
      }
      this.handleList.push(obj)
    },
    dateClick(index) {
      console.log(index)
      this.handleList[index].calendarShow = true
      this.dateIndex = index
    },
    dateChange(date, formatDate) {
      console.log(this.formatDate)
      console.log(this.dateIndex)
      this.handleList[this.dateIndex].selectedDate = formatDate
    },
    submit() {
      this.axios
        .post('', {
          params: {}
        })
        .then(res => {
          this.$message.success(res.data.msg)
        })
        .catch(function(err) {
          console.log(err)
        })
    }
  },
  mounted() {
    this.id = this.$route.params.id || ''
    // this.getworkData()
  }
}
function dateFormat(date, fmt) {
  var o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate()
  }
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
  return fmt
}
</script>

