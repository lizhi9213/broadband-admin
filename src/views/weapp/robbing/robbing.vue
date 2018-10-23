<style lang="less" scoped>
::-webkit-scrollbar {
  width: 0px;
}
.container {
  background: #ffffff;
  height: 100%;
  .header {
    position: relative;
    height: 40px;
    background: #228ee6;
    color: #fff;
    z-index: 2;
    .icon-fanhui {
      position: absolute;
      top: 10px;
      left: 10px;
      line-height: 20px;
    }
    .header-text {
      padding: 0 32px;
      font-size: 16px;
      line-height: 40px;
      text-align: center;
    }
  }
  .icon-bg {
    padding: 10px;
    .icon-round {
      width: 40px;
      height: 40px;
      color: #fff;
      border-radius: 20px;
      text-align: center;
      line-height: 40px;
    }
  }
  .item-cells {
    background-color: #ffffff;
    line-height: 1.47058824;
    font-size: 14px;
    overflow: hidden;
    position: relative;
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
      z-index: 2;
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
      z-index: 2;
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
      &::after {
        content: ' ';
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 1px;
        border-top: 1px solid #e5e5e5;
        margin: 0 10px;
        color: #e5e5e5;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        z-index: 2;
      }
    }
  }
  .breathe-btn-error {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    width: 70px;
    height: 70px;
    line-height: 40px;
    border: 5px solid rgba(201, 201, 201, 0.3);
    border-radius: 35px;
    color: #fff;
    font-size: 20px;
    text-align: center;
    cursor: pointer;
    overflow: hidden;

    -webkit-animation-timing-function: ease-in-out;
    -webkit-animation-name: breathe;
    -webkit-animation-duration: 1600ms;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-direction: alternate;
    .btn-border {
      height: 50px;
      width: 50px;
      border: 5px solid rgba(201, 201, 201, 0.6);
      border-radius: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      .btn {
        height: 40px;
        width: 40px;
        background: #c9c9c9;
        border-radius: 20px;
      }
    }
  }
  .breathe-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    width: 70px;
    height: 70px;
    line-height: 40px;
    border: 5px solid rgba(255, 96, 96, 0.2);
    border-radius: 35px;
    color: #fff;
    font-size: 20px;
    text-align: center;
    cursor: pointer;
    overflow: hidden;

    -webkit-animation-timing-function: ease-in-out;
    -webkit-animation-name: breathe;
    -webkit-animation-duration: 1400ms;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-direction: alternate;
    .btn-border {
      height: 50px;
      width: 50px;
      border: 5px solid rgba(255, 96, 96, 0.6);
      border-radius: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      .btn {
        height: 40px;
        width: 40px;
        background: #ff6060;
        border-radius: 20px;
      }
    }
  }
  @-webkit-keyframes breathe {
    0% {
      opacity: 0.6;
    }
    100% {
      opacity: 1;
    }
  }
}
</style>

<template>
  <div class="container">
    <div>
      <div class="header">
        <i class="iconfont icon-fanhui" @click="routeBack"></i>
        <div class="header-text">接单</div>
      </div>
      <div class="icon-bg">
        <div class="icon-round" :style="badge==1?'background:#ff6060;': 'background:#c9c9c9;'">
          <i class="iconfont icon-lingdang" style="font-size:24px;"></i>
        </div>
      </div>
      <div class="item-cells">
        <div class="item-cell">
          <div class="item-cell-hd">
            <i class="iconfont icon-wenzi"></i>
          </div>
          <div class="item-cell-bd">工单编号:</div>
          <div class="item-cell-ft">{{workData.code}}</div>
        </div>
        <div class="item-cell">
          <div class="item-cell-hd">
            <i class="iconfont icon-2"></i>
          </div>
          <div class="item-cell-bd">故障类型</div>
          <div class="item-cell-ft">{{workData.faultType}}</div>
        </div>
        <div class="item-cell">
          <div class="item-cell-hd">
            <i class="iconfont icon-edit"></i>
          </div>
          <div class="item-cell-bd">故障现象</div>
          <div class="item-cell-ft">{{workData.faultMemo}}</div>
        </div>
        <div class="item-cell">
          <div class="item-cell-hd">
            <i class="iconfont icon-jigou"></i>
          </div>
          <div class="item-cell-bd">派单机构</div>
          <div class="item-cell-ft">{{workData.area}}</div>
        </div>
        <div class="item-cell">
          <div class="item-cell-hd">
            <i class="iconfont icon-shijian"></i>
          </div>
          <div class="item-cell-bd">完工时限</div>
          <div class="item-cell-ft">{{comDealLine(workData.dealLine)}}</div>
        </div>

      </div>
      <div style="display: flex;align-items: center;justify-content: center;text-align:center;height:200px;">
        <div style="width:200px;" v-if="badge === 1">
          <div class="breathe-btn" @click="getorder">
            <div class="btn-border">
              <div class="btn">
              </div>
            </div>
          </div>
          <p style="margin-top:10px;font-size:20px;color:#ff6060;">立即接单</p>
        </div>
        <div style="width:200px;" v-else>
          <div class="breathe-btn-error">
            <div class="btn-border">
              <div class="btn">
              </div>
            </div>
          </div>
          <p style="margin-top:10px;font-size:20px;color:#999;">立即接单</p>
          <p style="margin-top:20px;color:#999;">{{errmsg}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      errmsg: '',
      id: 0,
      badge: 1,
      workData: {
        webAccount: '',
        dealLine: '',
        installAddr: '',
        operTime: '',
        faultMemo: ''
      }
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
    routeBack() {
      this.$router ? this.$router.back() : window.history.back()
    },
    getorder() {
      const vm = this
      vm.axios
        .patch('/apiweb/work/wechat/' + vm.id + '/change/orders/', {})
        .then(res => {
          vm.$message.success(res.data.msg)
          vm.$router.push('/workdetail/' + vm.id)
        })
        .catch(function(err) {
          vm.$message.error(err.response.data.msg)
          vm.getData()
        })
    },
    getData() {
      const vm = this
      vm.axios
        .get('/apiweb/work/wechat/' + vm.id + '/', {})
        .then(res => {
          vm.workData = res.data
          if (res.data.ordersId == Cookies.get('workerId')) {
            // 跳转工单页
            // vm.$router.push('/workrecord/3')
            vm.badge = 0
            vm.errmsg = '您已受理该工单'
          } else if (res.data.status !== '已派单') {
            // 显示已受理
            vm.badge = 0
            vm.errmsg = '该工单已被受理'
          }
        })
        .catch(function(err) {
          console.log(err)
          vm.badge = 0
          vm.errmsg = '该工单不存在'
        })
    }
  },
  mounted() {
    this.id = this.$route.params.id || ''
    this.getData()
  }
}
</script>
