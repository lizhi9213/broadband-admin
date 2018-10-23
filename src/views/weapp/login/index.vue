<template>
    <div></div>
</template>
<script>
import Cookies from 'js-cookie'
export default {
  name: 'wechatlogin',
  data() {
    return {
      openid: ''
    }
  },
  created() {
    if (this.getUrlParam('code')) {
      this.axios
        .get('/apiweb/wechat/openid', {
          params: {
            url: 'http://' + location.host + '/wechatlogin' + location.search,
            lopenid: this.getUrlParam('lopenid'),
            code: this.getUrlParam('code')
          }
        })
        .then(data => {
          const res = data.data
          if (res.url) {
            location.href = res.url
          } else if (res.openid) {
            this.openid = data.data.openid
            this.axios
              .post('/apiweb/wechat/login/' + this.openid)
              .then(res => {
                Cookies.set('head', res.data.head, { expires: 3 })
                Cookies.set('workerId', res.data.workerId, { expires: 3 })
                Cookies.set('workerName', res.data.workerName, { expires: 3 })
                this.$router.push({
                  name: this.getUrlParam('path'),
                  params: this.getUrlParam('params')
                    ? JSON.parse(this.getUrlParam('params'))
                    : {}
                })
              })
              .catch(err => {
                alert(err.response.data.msg || err)
                this.$router.push({ name: 'binding' })
              })
          } else {
            alert('微信鉴权失败，无法获取用户信息')
          }
        })
        .catch(err => {
          if (err.response.data.msg) {
            alert(JSON.stringify(err.response.data.msg))
          } else {
            alert('鉴权失败，请确认已经关注公众号，稍后重试')
          }
        })
    } else {
      this.axios
        .get('/apiweb/wechat/code', {
          params: {
            url: 'http://' + location.host + '/wechatlogin' + location.search
          }
        })
        .then(data => {
          location.href = data.data.data
        })
        .catch(err => {
          alert(err)
        })
    }
  },
  methods: {
    getUrlParam(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)') // 构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg) // 匹配目标参数
      if (r != null) return unescape(r[2])
      return null // 返回参数值
    }
    // binding() {
    //   if (!this.openid) {
    //     alert('无法获取用户信息，请重试')
    //   } else {
    //     this.loading = true
    //     this.axios
    //       .post('/apiweb/wechat/binding', {
    //         phone: this.phone,
    //         pwd: md5(this.pwd),
    //         openid: this.openid
    //       })
    //       .then(res => {
    //         this.loading = false
    //         this.$message.success(res.data.msg)
    //         this.$router.push('/success')
    //       })
    //       .catch(err => {
    //         this.loading = false
    //         if (err.response.data.msg) {
    //           this.$message.error(err.response.data.msg)
    //         } else {
    //           this.$message.error('操作失败，请确认已经关注公众号，稍后重试')
    //         }
    //       })
    //   }
    // }
  }
}
</script>
