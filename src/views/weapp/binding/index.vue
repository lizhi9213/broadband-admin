<style lang="less" scoped>
::-webkit-scrollbar {
  width: 0px;
}
.item-cell {
  margin-top: 10px;
  position: relative;
  .label {
    width: 60px;
    position: absolute;
    left: 0;
    top: 0;
    font-size: 13px;
    line-height: 32px;
  }
  .item-cell-bd {
    flex: 1;
    outline: none;
    font-size: 13px;
    padding: 5px 5px 5px 60px;
    width: 100%;
    display: block;
    border: 1px solid transparent;
    &:focus {
      border-bottom: 1px solid #ff6060;
    }
  }
}
.btn {
  margin-top: 20px;
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
    <div style="padding:1rem;height:100%; background-color:#FFF; font-size:1rem">
        <div style="text-align:center">账号绑定</div>
        <div v-if="!openid">
            <div class="ewm-box" style="position:relative;padding:80px 20px;">
                <img src="/static/images/children.png" style="position:absolute;top:20px;left:50%;margin-left:-50px;" />
                <img :src="src" style="width:100%;border:1px solid #eee;" />
                <p style="font-size:13px;text-align:center;margin-top:10px;">扫描二维码，添加关注公众号</p>
            </div>
        </div>
        <div v-else style="padding:40px 0;">
            <div style="display:flex;width:240px;margin:0 auto;color:#ff6060;padding:40px 0;">
                <i class=" iconfont icon-emizhifeiji " style="font-size:36px;"></i>
                <p style="flex:1;font-size:16px;margin-left:10px;">如当前微信或账号已经被绑定将自动解绑</p>
            </div>
            <!-- <el-alert type="warning " title="如当前微信或账号已经被绑定将自动解绑 " :closable="false "></el-alert> -->
            <div class="item-cell ">
                <sapn class="label ">手机号:</sapn>
                <input class="item-cell-bd " v-model="phone "></input>
            </div>
            <div class="item-cell ">
                <sapn class="label ">密码:</sapn>
                <input class="item-cell-bd " v-model="pwd" type="password"></input>
            </div>
            <el-button class="btn " @click="binding " :loading="loading " style="width:100%; ">提交</el-button>
        </div>
    </div>
</template>
<script>
import md5 from 'md5'
export default {
  name: 'binding',
  data() {
    return {
      src: '/static/images/qrcode.jpg',
      openid: '',
      phone: '',
      pwd: '',
      loading: false,
      qcodeShow: false
    }
  },
  created() {
    if (this.getUrlParam('code')) {
      this.axios
        .get('/apiweb/wechat/openid', {
          params: {
            url: 'http://' + location.host + '/binding',
            lopenid: this.getUrlParam('lopenid'),
            code: this.getUrlParam('code')
          }
        })
        .then(data => {
          const res = data.data
          if (res.url) {
            location.href = res.url
          } else if (res.openid) {
            this.axios
              .post('/apiweb/wechat/isfollow/' + res.openid)
              .then(() => {
                this.openid = res.openid
              })
              .catch(err => {
                if (err.response.data.msg) {
                  alert(JSON.stringify(err.response.data.msg))
                } else {
                  alert('鉴权失败，请确认已经关注公众号，稍后重试')
                }
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
            url: 'http://' + location.host + '/binding'
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
    },
    binding() {
      const vm = this
      if (!this.openid) {
        alert('无法获取用户信息，请重试')
      } else {
        this.loading = true
        this.axios
          .post('/apiweb/wechat/binding', {
            phone: this.phone,
            pwd: md5(this.pwd),
            openid: this.openid
          })
          .then(res => {
            this.loading = false
            this.$message.success(res.data.msg)
            this.$router.push('/success')
          })
          .catch(err => {
            this.loading = false
            if (err.response.data.msg) {
              this.$message.error(err.response.data.msg)
            } else {
              this.$message.error('操作失败，请确认已经关注公众号，稍后重试')
            }
            vm.qcodeShow = true
          })
      }
    }
  }
}
</script>
