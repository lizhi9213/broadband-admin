<style lang="less" scoped>
::-webkit-scrollbar {
  width: 0px;
}
.icon-duihao {
  font-size: 60px;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  display: block;
  border: 2px solid #ff6060;
  border-radius: 50px;
  color: #ff6060;
  margin: 50px auto 0;
}
.text {
  font-size: 13px;
  text-align: center;
  margin-top: 10px;
}
.btn {
  margin-top: 50px;
  font-size: 13px;
  padding: 10px;
  background: #ff6060;
  border: none;
  color: #fff;
  outline: none;
  border-radius: 5px;
}
</style>

<template>
    <div class="container" style="padding:1rem;height:100%; background-color:#FFF; font-size:1rem">
        <i class="iconfont icon-duihao" style=""></i>
        <p class="text">账号绑定成功</p>
        <el-button class="btn" style="width:100%; " @click="toworkList">完成</el-button>
    </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    toworkList() {
      try {
        if (WeixinJSBridge) {
          WeixinJSBridge.call('closeWindow')
        } else {
          window.close()
        }
      } catch (e) {
        window.close()
      }
      //this.$router.push('myworklist')
    }
  },
  mounted() {
    // setTimeout(() => {
    //   this.$router.push('myworklist')
    // }, 3000)
  }
}
</script>
