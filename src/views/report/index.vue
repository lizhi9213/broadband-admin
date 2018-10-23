<style lang="less" scoped>
@import './report.less';
</style>

<template>
    <div class="container">
        <div class="body-msg" :style="{height: cardHeight + 'px'}">
            <img src="/src/images/no_data.png" alt="">
            <div class="tips-msg">
                <h1>404 not found</h1>
                <p>抱歉，您访问的页面暂无数据</p>
                <Button type="primary" @click="backHome">返回首页</Button>
            </div>
        </div>
        <p class="fotter">Copyright<span class="copy">&copy;</span>2018&nbsp;郑州希尔信息技术有限公司技术部出品</p>
    </div>
</template>

<script>
export default {
  name: 'report',
  data() {
    return {
      cardHeight: 500
    }
  },
  methods: {
    backHome() {
      this.$store.commit('removeTag', 'report')
      this.$router.push('/')
    }
  },
  mounted() {
    const _this = this
    this.cardHeight = window.innerHeight - 120
    // 浏览器窗口发生改变
    window.onresize = function() {
      _this.cardHeight = window.innerHeight - 120
    }
  }
}
</script>
