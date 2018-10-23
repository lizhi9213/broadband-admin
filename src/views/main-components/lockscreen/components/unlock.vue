<style lang="less">
@import '../styles/unlock.less';
</style>

<template>
  <transition name="show-unlock">
    <div class="unlock-body-con" v-if="showUnlock" @keydown.enter="handleUnlock">
      <div @click="handleClickAvator" class="unlock-avator-con" :style="{marginLeft: avatorLeft}">
        <img class="unlock-avator-img" :src="avatorPath">
        <div class="unlock-avator-cover">
          <span>
            <Icon type="unlocked" :size="30"></Icon>
          </span>
          <p>解锁</p>
        </div>
      </div>
      <div class="unlock-avator-under-back" :style="{marginLeft: avatorLeft}"></div>
      <div class="unlock-input-con">
        <div class="unlock-input-overflow-con">
          <div class="unlock-overflow-body" :style="{right: inputLeft}">
            <input ref="inputEle" v-model="password" class="unlock-input" type="password" placeholder="密码同登录密码" />
            <button ref="unlockBtn" @mousedown="unlockMousedown" @mouseup="unlockMouseup" @click="handleUnlock" class="unlock-btn">
              <Icon color="white" type="key"></Icon>
            </button>
          </div>
        </div>
      </div>
      <div class="unlock-locking-tip-con">已锁定</div>
    </div>
  </transition>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: 'Unlock',
  data() {
    return {
      avatorLeft: '0px',
      inputLeft: '400px',
      password: '',
      check: null,
      count: 0 // 输入错误3次重新登录
    }
  },
  props: {
    showUnlock: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    avatorPath() {
      return localStorage.avatorImgPath
    }
  },
  methods: {
    validator() {
      let that = this
      // 判断是否输入错误3次
      // console.log(Cookies.get("yh_web_UserMail"));
      // console.log(that.password);
      // 你可以在这里写密码验证方式，如发起ajax请求将用户输入的密码this.password与数据库用户密码对比
      this.axios
        .get('/apiweb/login/CheckUserLogin', {
          params: {
            UserName: Cookies.get('yh_web_UserPhone'), //用户名(可输入手机号或者邮箱进行登录)
            PassWord: that.password //密码
          }
        })
        .then(res => {
          // console.log(res.data);
          if (res.data.ok == 'true') {
            that.$message({
              message: '欢迎回来！',
              type: 'success'
            })

            that.avatorLeft = '0px'
            that.inputLeft = '400px'
            that.password = ''
            Cookies.set('locking', '0')
            that.$emit('on-unlock')
          } else {
            that.count = that.count + 1
            if (that.count >= 3) {
              that.$message.error('您已经3次输入不正确密码了，请重新登录！')
              // 清除锁定
              that.avatorLeft = '0px'
              that.inputLeft = '400px'
              that.password = ''
              Cookies.set('locking', '0')
              that.$emit('on-unlock')
              // 重新登录
              that.$store.commit('logout', that)
              // that.$store.commit("clearOpenedSubmenu"); 清除打开的列表
              that.$router.push({
                name: 'login'
              })
            } else {
              that.$message({
                showClose: true,
                duration: 5000,
                message: '密码输入不正确，请重新输入！',
                type: 'error'
              })
            }
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    handleClickAvator() {
      this.avatorLeft = '-180px'
      this.inputLeft = '0px'
      this.$refs.inputEle.focus()
    },
    handleUnlock() {
      this.validator()
      //   if (this.validator()) {
      //     this.avatorLeft = "0px";
      //     this.inputLeft = "400px";
      //     this.password = "";
      //     Cookies.set("locking", "0");
      //     this.$emit("on-unlock");
      //   } else {
      //     this.$Message.error(
      //       "密码错误,请重新输入。如果忘了密码，清除浏览器缓存重新登录即可，这里没有做后端验证"
      //     );
      //   }
    },
    unlockMousedown() {
      this.$refs.unlockBtn.className = 'unlock-btn click-unlock-btn'
    },
    unlockMouseup() {
      this.$refs.unlockBtn.className = 'unlock-btn'
    }
  }
}
</script>
