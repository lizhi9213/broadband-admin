<style lang="less">
@import './libs/loading.css';
@import './libs/animation.css';
</style>
<template>
    <!-- loading层 -->
    <div id="main" class="app-main pt-perspective">
        <div class="loading" v-if="haveAnima" :class="{'pt-page-rotatePushBottom': showView && haveAnima}">
            <div class="loader">
                <div class="pacman">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <p class="load-msg">loading...</p>
            </div>
        </div>
        <!-- loading层 -->
        <router-view :class="{'pt-page':haveAnima, 'pt-page-ontop':showView && haveAnima , 'pt-page-rotatePullTop':showView && haveAnima , 'pt-page-current':showView && haveAnima}"></router-view>
        <Modal v-model="hotline" width="810" class-name="none-footer" @on-cancel="popClose">
            <div class="hot-line">
                <p class="phone-number">{{showPopData.phone}}</p>
                <p class="appellation">
                    <span class="name">{{showPopData.name}}</span>
                    <span class="label">{{showPopData.type}}</span>
                </p>
                <p class="operator">
                </p>
                <p class="address">{{showPopData.addr}}</p>
                <div v-if="!showPopView">{{showPopView}}
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
  computed: {
    haveAnima: function() {
      // 在计算属性中使用haveAnima来实时更新store.app.isLoading的变化，而app页面依赖haveAnima属性来控制loading界面的显示。
      return this.$store.state.app.isLoading
    },
    showView: function() {
      // 计算上下翻转动画的开关效果
      return this.$store.state.app.showView
    },
    showPopData: function() {
      return this.$store.state.app.popData
    },
    showPopView: function() {
      this.hotline = this.$store.state.app.popView
      return this.$store.state.app.popView
    }
  },
  watch: {
    $route(to, from) {}
  },
  data() {
    return {
      theme: this.$store.state.app.themeColor,
      hotline: false,
      timing: '00:00', // 计时
      clock: 0, // 计时
      timerId: ''
    }
  },
  mounted() {
    const _this = this
    // setTimeout(function() {
    //   _this.hotline = true
    //   _this.$router.push('/hotline/' + '15226308956')
    // }, 3000)
  },
  beforeDestroy() {},
  methods: {
    popClose() {
      this.$store.commit('setPopView', false)
    }
  }
}
</script>

<style lang="less">
.hot-line {
  height: 358px;
  box-sizing: border-box;
  overflow: hidden;
  padding-top: 52px;
  p {
    text-align: center;
    color: #555555;
  }
  .phone-number {
    font-size: 46px;
    letter-spacing: 3px;
    color: #ff6060;
  }
  .appellation {
    margin-top: 20px;
    text-align: center;
    .name {
      font-size: 30px;
      display: inline-block;
      margin-right: 10px;
    }
    .label {
      color: #828282;
      font-size: 18px;
      display: inline-block;
    }
  }
  .operator {
    margin-top: 20px;
    font-size: 24px;
    .clock {
      display: inline-block;
      font-size: 24px;
      margin-left: 6px;
      color: #1890ff;
    }
  }
  .address {
    font-size: 24px;
    margin-top: 20px;
  }
}
html,
body {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  overflow: hidden;
}
.app-main {
  width: 100%;
  height: 100%;
}
.loading {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  background: rgba(233, 101, 0, 0.6);
}
.loading .loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(50%, 50%);
}
.load-msg {
  line-height: 4em;
  font-size: 2em;
  text-align: center;
  position: relative;
  left: -40px;
  color: #fff;
}
.pt-perspective {
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 1200px;
  transform-style: preserve-3d;
}

.pt-page {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
  overflow: hidden;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
}

.pt-page-current,
.no-js .pt-page {
  visibility: visible;
}

.pt-page-ontop {
  z-index: 999;
}
</style>
