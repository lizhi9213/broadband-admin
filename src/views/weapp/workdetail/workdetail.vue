<style lang="less" scoped>
::-webkit-scrollbar {
  width: 0px;
}
.ivu-dropdown {
  display: inline-block;
  position: fixed;
  right: 10px;
  top: 40px;
}
.container {
  height: 100%;
  overflow-y: auto;
  .header {
    height: 40px;
    width: 100%;
    background: #228ee6;
    color: #fff;
    z-index: 2;
    position: relative;
    .icon-fanhui {
      position: absolute;
      top: 10px;
      left: 10px;
      line-height: 20px;
    }
    .header-text {
      padding: 0 32px;
      line-height: 40px;
      font-size: 16px;
      text-align: center;
    }
    .icon-caozuo {
      position: fixed;
      top: 10px;
      right: 10px;
      line-height: 20px;
    }
  }
  .nav-items {
    background: #228ee6;
    padding: 10px;
    color: #fff;
    .nav-item {
      display: flex;
      font-size: 14px;
      line-height: 30px;
      &:first-child {
        margin-bottom: 10px;
        font-size: 16px;
      }
      .flex-fl {
        display: flex;
        .item-fl {
          flex: 1;
          width: 80px;
          text-align: right;
          margin-right: 10px;
        }
      }
      .flex-fr {
        flex: 1;
        display: flex;
        text-align: right;
        justify-content: flex-end;
        margin-right: 20px;
        .item-fl {
          width: 80px;
          text-align: right;
          margin-right: 10px;
        }
      }
      .item-fl {
        width: 80px;
        text-align: right;
        margin-right: 10px;
      }
      .phone {
        margin-right: 20px;
        width: 30px;
        height: 30px;
        border-radius: 15px;
        background: rgb(78, 165, 235);
        text-align: center;
        line-height: 30px;
      }
    }
  }
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
      padding: 10px 0 10px 15px;
      font-size: 16px;
      line-height: 20px;
      position: relative;
      &::before {
        position: absolute;
        height: 20px;
        left: 7px;
        top: 10px;
        background: #228ee6;
        content: '';
        width: 2px;
      }
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
        color: #999;
        width: 120px;
      }
      .item-cell-ft {
        flex: 1;
        text-align: left;
        color: #333;
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
  }

  .tab-slider {
    .tab {
      display: flex;
      height: 40px;
      width: 100%;
      line-height: 39px;
      background: #fff;
      margin-bottom: 5px;
      .tab-items {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50%;
        text-align: center;
        &:first-child {
          box-shadow: 0 0 1px 0 #eee;
        }
        .tab-item {
          width: 80px;
          border-bottom: 1px solid transparent;
        }
        .active {
          color: #228ee6;
          border-bottom: 1px solid #228ee6;
        }
      }
    }
  }
  .tab-content {
    .record-items {
      margin-top: 10px;
      padding: 0 10px;
      position: relative;
      margin-bottom: 50px;
      &::after {
        content: '';
        position: absolute;
        left: 36px;
        top: 0;
        width: 1px;
        height: 100%;
        background: #ccc;
        z-index: -1;
      }
      .record-date {
        line-height: 24px;
        height: 24px;
        width: 50px;
        overflow: hidden;
        background: #e69a35;
        border-radius: 15px;
        text-align: center;
        margin: 10px 0;
        color: #fff;
      }
      .record-item {
        padding: 0 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        overflow: hidden;
        margin-bottom: 10px;
        position: relative;
        background: #fff;
        &:last-child {
          margin-bottom: 0;
        }
        .record-item-hd {
          position: relative;
          height: 30px;
          line-height: 30px;
          border-bottom: 1px solid #eee;
          .state-round {
            height: 8px;
            width: 8px;
            position: absolute;
            top: 6px;
            left: 10px;
            border-radius: 4px;
          }
          .type {
            margin-left: 24px;
          }
          .date {
            margin-left: 10px;
          }
        }
        .record-item-bd {
          padding: 10px 0;
        }
        .record-item-ft {
          height: 30px;
          line-height: 30px;
        }
      }
    }
    .input-box {
      position: fixed;
      height: 40px;
      left: 0;
      bottom: 0;
      width: 100%;
      .input-cell {
        width: 100%;
        height: 100%;
        background: #fff;
        position: relative;
        .icon-shezhi1 {
          position: absolute;
          line-height: 20px;
          top: 10px;
          left: 10px;
          font-size: 18px;
          z-index: 2;
        }
        .input {
          padding: 0 40px;
          width: 100%;
          margin-top: 6px;
        }
        .icon-send {
          position: absolute;
          line-height: 20px;
          top: 10px;
          right: 10px;
          color: #228ee6;
          font-size: 18px;
          z-index: 2;
        }
      }
    }
    .set-box {
      position: fixed;
      bottom: 0;
      width: 100%;
      z-index: 2;
      background: #fff;
      .set-cells {
        .set-cell {
          padding: 10px;
          text-align: center;
          border-bottom: 1px solid #eee;
          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
  }
}
.maskbox {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}
</style>

<template>
    <div class="container">
        <div class="header">
            <i class="iconfont icon-fanhui" @click="routeBack"></i>
            <div class="header-text">工单详情</div>
        </div>
        <div class="nav-items">
            <div class="nav-item">
                <div class="flex-fl">
                    <div class="item-fl">工单编号:</div>
                    <div class="item-fr">{{workData.code}}({{workData.status}})</div>
                </div>
                <!-- <div class="flex-fr">
                    <div class="item-fl">状态:</div>
                    <div class="item-fr">{{workData.status}}</div>
                </div> -->
            </div>
            <div class="nav-item">
                <div class="item-fl">联系电话:</div>
                <div class="item-fr" style="flex:1;">{{workData.custPhone}}</div>
                <div class="phone">
                    <a :href="'tel:'+workData.custPhone" style="color:#fff;">
                        <i class="iconfont icon-dianhua1"></i>
                    </a>
                </div>
            </div>
            <div class="nav-item">
                <div class="item-fl">故障类型:</div>
                <div class="item-fr">{{workData.faultType}}</div>
            </div>
            <div class="nav-item">
                <div class="item-fl">故障现象:</div>
                <div class="item-fr">{{workData.faultSource}}</div>
            </div>
            <!-- <div class="nav-item">
                <div class="item-fl">派单机构:</div>
                <div class="item-fr">{{workData.classId}}</div>
            </div> -->
        </div>
        <div class="tab-slider">
            <div class="tab">
                <span class="tab-items" v-for="(item, index) in items" @click="toggle(index)">
                    <div class="tab-item" v-bind:class="{active: actived == index}">{{item.tab}}</div>
                </span>
            </div>
            <div class="tab-content">
                <div class="wrapbox clearboth">
                    <div v-if="worktabshow">
                        <div v-if="recordList===''" style="text-align:center;padding:10px 0;">
                            <i class="iconfont icon-Null-data" style="font-size:48px;"></i>
                            <p>暂无处理记录</p>
                        </div>
                        <div v-else class="record-items">
                            <div v-for="(item,index) in recordList" :key="index">
                                <div class="record-date">{{item.date}}</div>
                                <template v-for="(dd,index) in item.data">
                                    <div class="record-item ">
                                        <div class="record-item-hd ">
                                            <div>来自: 【{{changeSource(dd.source)}}】</div>
                                        </div>
                                        <div class="record-item-bd">
                                            <div style="display:flex;">
                                                <img :src="changeImg(dd)" style="width:36px;height:36px;border-radius:5px;display:block;margin-right:5px;" />
                                                <div style="flex:1;">
                                                    <div>{{dd.name}}</div>
                                                    <div>{{dd.time}}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="record-item-ft ">
                                            <div>{{dd.content}}</div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div v-if="detailtabshow">
                        <div class="item-cells" v-show="workData.tetemplateData===''">
                            <div class="item-title ">工单信息</div>
                            <div class="item-cell " v-for="item in workData.templateData " :key="item.label ">
                                <div class="item-cell-bd ">{{item.label}}:</div>
                                <div class="item-cell-ft ">{{item.text}}</div>
                            </div>
                        </div>
                        <div class="item-cells ">
                            <div class="item-title ">工单信息</div>
                            <div class="item-cell ">
                                <div class="item-cell-bd ">故障来源:</div>
                                <div class="item-cell-ft ">{{workData.faultSource}}</div>
                            </div>
                            <div class="item-cell ">
                                <div class="item-cell-bd ">完工时限:</div>
                                <div class="item-cell-ft ">{{comDealLine(workData.dealLine)}}</div>
                            </div>
                            <div class="item-cell ">
                                <div class="item-cell-bd ">所属小区:</div>
                                <div class="item-cell-ft ">{{workData.communityName}}</div>
                            </div>
                            <div class="item-cell ">
                                <div class="item-cell-bd ">派单机构:</div>
                                <div class="item-cell-ft ">{{workData.classId}}<br />{{workData.groupId}}</div>
                            </div>
                            <div class="item-cell ">
                                <div class="item-cell-bd ">安装地址:</div>
                                <div class="item-cell-ft ">{{workData.installAddr}}</div>
                            </div>
                            <div class="item-cell ">
                                <div class="item-cell-bd ">故障开始时间:</div>
                                <div class="item-cell-ft ">{{workData.faultTime}}</div>
                            </div>
                            <div class="item-cell ">
                                <div class="item-cell-bd ">备注:</div>
                                <div class="item-cell-ft ">{{workData.memo}}</div>
                            </div>
                            <div class="item-cell ">
                                <div class="item-cell-bd ">回访结果:</div>
                                <div class="item-cell-ft ">{{workData.visitResult}}</div>
                            </div>
                            <div class="item-cell ">
                                <div class="item-cell-bd ">评价备注:</div>
                                <div class="item-cell-ft ">{{workData.remark}}</div>
                            </div>
                        </div>
                        <div class="item-cells " style="margin-bottom:50px;">
                            <div class="item-title ">宽带信息</div>
                            <template v-if="custShow">
                                <div class="item-cell ">
                                    <div class="item-cell-bd ">宽带账号:</div>
                                    <div class="item-cell-ft ">{{custData.kd_account}}</div>
                                </div>
                                <div class="item-cell ">
                                    <div class="item-cell-bd ">联系人:</div>
                                    <div class="item-cell-ft ">{{custData.kd_name}}</div>
                                </div>
                                <div class="item-cell ">
                                    <div class="item-cell-bd ">联系方式:</div>
                                    <div class="item-cell-ft "><a :href="'tel:'+custData.kd_phone">{{custData.kd_phone}}</a></div>
                                </div>
                                <div class="item-cell ">
                                    <div class="item-cell-bd ">所属区域:</div>
                                    <div class="item-cell-ft ">{{custData.kd_region}}</div>
                                </div>
                                <div class="item-cell ">
                                    <div class="item-cell-bd ">所属机构:</div>
                                    <div class="item-cell-ft ">{{custData.kd_org}}</div>
                                </div>
                                <div class="item-cell ">
                                    <div class="item-cell-bd ">所属小区:</div>
                                    <div class="item-cell-ft ">{{custData.kd_village}}</div>
                                </div>
                                <div class="item-cell ">
                                    <div class="item-cell-bd ">安装地址:</div>
                                    <div class="item-cell-ft ">{{custData.kd_addr}}</div>
                                </div>
                                <div class="item-cell ">
                                    <div class="item-cell-bd ">客户经理:</div>
                                    <div class="item-cell-ft ">{{custData.kd_mana}}</div>
                                </div>
                                <div class="item-cell ">
                                    <div class="item-cell-bd ">客户经理联系方式:</div>
                                    <div class="item-cell-ft ">{{custData.kd_manaphone}}</div>
                                </div>
                                <div class="item-cell ">
                                    <div class="item-cell-bd ">宽带安装时间:</div>
                                    <div class="item-cell-ft ">{{custData.kd_intime}}</div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="item-cell ">
                                    <div class="item-cell-bd ">暂无宽带数据</div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                <div v-if="inputShow">
                    <div class="input-box">
                        <div class="input-cell">
                            <i v-if='setList.length > 0' class="iconfont icon-shezhi1" @click="changebtn"></i>
                            <el-input size="mini" v-model="content" class="input" :style="setList.length > 0 ? '' : 'padding:0 40px 0 10px'" placeholder="录入内容"></el-input>
                            <i class="iconfont icon-send " @click="submit"></i>
                        </div>
                    </div>
                    <div class="set-box" v-if="changeshow">
                        <ul class="set-cells">
                            <li class="set-cell" v-for="(item,index) in setList" :key="index" @click="signin(index)">{{item.label}}</li>
                            <li class="set-cell" @click="closemark">取消</li>
                        </ul>
                    </div>
                    <div class="maskbox" v-if="markFlag" @click="closemark"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Cookies from 'js-cookie'
import { readCust } from '@/api/other'
export default {
  data() {
    return {
      today: '',
      yesterday: '',
      theTime: '2018-09-09',
      content: '',
      setList: [
        {
          label: '签到',
          value: 1
        },
        {
          label: '完结',
          value: 2
        }
      ],
      changeshow: false,
      markFlag: false,
      worktabshow: false,
      detailtabshow: true,
      actived: 0,
      items: [
        {
          tab: '详细信息'
        },
        {
          tab: '处理记录'
        }
      ],
      orderId: 0,
      id: 0,
      workData: {
        templateData: {}
      },
      recordList: [],
      custData: {},
      custShow: false,
      inputShow: false
    }
  },
  methods: {
    comDealLine(val) {
      if (val < 0) {
        return '剩余' + (0 - val) + '小时'
      } else {
        return '超时' + val + '小时'
      }
    },
    submit() {
      if (this.content != '') {
        this.axios
          .post('/apiweb/work/wechat/' + this.id + '/process', {
            theTime: this.theTime,
            content: this.content
          })
          .then(res => {
            this.$message.success(res.data.msg)
            this.content = ''
            this.getrecordList()
          })
          .catch(function(err) {
            console.log(err)
          })
      }
    },
    changebtn() {
      this.markFlag = true
      this.changeshow = true
    },
    closemark() {
      this.markFlag = false
      this.changeshow = false
    },
    signin(index) {
      const vm = this
      if (vm.setList[index].value === 1) {
        this.axios
          .patch('/apiweb/work/wechat/' + this.id + '/change/check/', {})
          .then(res => {
            vm.getworkData()
            vm.$message.success(res.data.msg)
            vm.closemark()
          })
          .catch(function(err) {
            vm.$message.error(err.response.data.msg)
            vm.closemark()
          })
      } else if (vm.setList[index].value === 2) {
        this.axios
          .patch('/apiweb/work/wechat/' + this.id + '/change/completed/', {})
          .then(res => {
            vm.getworkData()
            vm.$message.success(res.data.msg)
            vm.closemark()
          })
          .catch(function(err) {
            vm.$message.error(err.response.data.msg)
            vm.closemark()
          })
      }
    },
    toggle(index) {
      this.actived = index
      if (index === 0) {
        this.detailtabshow = true
        this.worktabshow = false
      } else {
        this.worktabshow = true
        this.detailtabshow = false
      }
    },
    routeBack() {
      this.$router ? this.$router.back() : window.history.back()
    },
    getworkData() {
      const vm = this
      vm.axios
        .get('/apiweb/work/wechat/' + vm.id + '/', {})
        .then(res => {
          vm.workData = res.data
          vm.workData.templateData = JSON.parse(vm.workData.templateData)
          vm.getrecordList()
          if (vm.workData.ordersId === Cookies.get('workerId')) {
            vm.inputShow = true
            if (vm.workData.status === '已接单') {
              vm.setList = [
                {
                  label: '签到',
                  value: 1
                }
              ]
            } else if (vm.workData.status === '已签到') {
              vm.setList = [
                {
                  label: '完结',
                  value: 2
                }
              ]
            } else {
              vm.setList = []
            }
          }
        })
        .catch(function(err) {
          console.log(err)
        })
      readCust(vm.id)
        .then(res => {
          if (res.data.length > 0) {
            const tempData = res.data[0]
            for (let i = 0; i < tempData.length; i++) {
              const key = tempData[i].key
              const value = tempData[i].value
              vm.custData[key] = value
            }
            vm.custShow = true
          } else {
            vm.custData = {}
            vm.custShow = false
          }
        })
        .catch(err => {})
    },
    formatDay(date) {
      const vm = this
      if (date === vm.today) {
        return '今天'
      } else if (date === vm.yesterday) {
        return '昨天'
      } else {
        return date
      }
    },
    changeSource(source) {
      switch (source) {
        case 0:
          return '工单处理'
        case 1:
          return '催单'
        case 2:
          return '派单'
        case 3:
          return '接单'
        case 4:
          return '签到'
        case 5:
          return '完工'
        case 6:
          return '归档'
        default:
          return '其他'
      }
    },
    changeImg(dd) {
      let img = '/static/images/default_img.jpg'
      if (
        dd.userType === 0 &&
        dd.workerId.toString() === Cookies.get('workerId')
      ) {
        img = Cookies.get('head')
      }
      return img
    },
    getrecordList() {
      const vm = this
      vm.axios
        .get('/apiweb/work/wechat/' + this.id + '/process', {
          orderId: vm.workData.orderId
        })
        .then(res => {
          let _data = res.data
          // 处理date日期格式
          _data = _data.map(res => {
            res.date = vm.formatDay(res.createTime.substring(5, 10))
            return res
          })
          let _textdata = []
          for (var i = 0; i < _data.length; i++) {
            const lists = {}
            const date = _data[i].date
            // filter 相同日期数据
            const rowdate = _data.filter(item => {
              return item.date === date
            })
            const existdate = _textdata.find(item => {
              if (item['date'] === date) {
                return item
              }
            })
            // 判断数据是否已存入
            if (!existdate) {
              lists['date'] = date
              lists['data'] = rowdate
              _textdata.push(lists)
            }
          }
          this.recordList = _textdata
        })
        .catch(function(err) {
          console.log(err)
        })
    }
  },
  mounted() {
    this.id = this.$route.params.id || ''
    var day1 = new Date()
    var day2 = new Date()
    day2.setDate(day2.getDate() - 1)
    this.today = day1.Format('MM-dd')
    this.yesterday = day2.Format('MM-dd')
    console.log(this.today)
    this.getworkData()
  }
}
Date.prototype.Format = function(fmt) {
  var o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds()
  }
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
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

