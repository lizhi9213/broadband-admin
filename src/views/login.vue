<style lang="less">
@import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-logo-box"><img src="../images/logo.png" alt=""></div>
        <div class="login-left-img"><img src="../images/login_left.png" alt=""></div>
        <div class="login-con">
            <div class="login-mascot">
                <img v-show="showImg == 1" src="../images/login-normal.png" alt="亲，欢迎您登陆">
                <img v-show="showImg == 2" src="../images/login-uname.png" alt="亲，请输入用户名">
                <img v-show="showImg == 3" src="../images/login-pword.png" alt="亲，请输入密码">
            </div>
            <Card :bordered="false" class="login-body">
                <p slot="title" class="login-header">
                    <Icon :size="20" type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <el-input placeholder="请输入用户名" @focus="nameFocus" @blur="showNomal" v-model="form.userName">
                                <Icon :size="18" slot="prepend" type="person"></Icon>
                            </el-input>
                        </FormItem>
                        <FormItem prop="password">
                            <el-input type="password" placeholder="请输入密码" @focus="pwordFocus" @blur="showNomal" v-model="form.password">
                                <Icon :size="18" slot="prepend" type="locked"></Icon>
                            </el-input>
                        </FormItem>
                        <FormItem>
                            <el-button @click="handleSubmit" style="width:100%;" type="primary">立即登录</el-button>
                        </FormItem>
                        <!-- <FormItem>
              <span style="color:#F56C6C">请点击允许安全链接</span>
              <el-tag>
                <a href="https://39.106.196.77:17443" target="_blank">链接一</a>
              </el-tag>
              <el-tag>
                <a href="https://kejiyuan.xierxinxi.cn:1443" target="_blank">链接二</a>
              </el-tag>
            </FormItem> -->
                    </Form>
                </div>
            </Card>
            <div class="login-shadow"><img src="../images/login_shadow.png" alt=""></div>
        </div>
        <p class="login-fotter">Copyright<span class="copy">&copy;</span>2018&nbsp;郑州希尔信息技术有限公司技术部出品</p>
    </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      showImg: 1,
      form: {
        userName: '',
        password: ''
      },
      rules: {
        userName: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    nameFocus() {
      this.showImg = 2
    },
    pwordFocus() {
      this.showImg = 3
    },
    showNomal() {
      this.showImg = 1
    },
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loginAccount()
        }
      })
    },
    loginAccount() {
      let that = this
      this.axios
        .get('/apiweb/login/CheckUserLogin', {
          params: {
            UserName: that.form.userName, //用户名(可输入手机号或者邮箱进行登录)
            PassWord: that.form.password //密码
          }
        })
        .then(res => {
          this.$store.commit('setUserId')
          if (res.data.ok == 'true') {
            // 设置头像
            this.$store.commit(
              'setAvator',
              Cookies.get('yh_web_UserImage')
                ? Cookies.get('yh_web_UserImage')
                : '/static/img/default_img.jpg'
            )
            // 打开加载loading
            that.$store.commit('setLoading', false) // 设置loading
            that.$store.commit('setShowView', false)
            that.$store.commit('setLoading', true) // 设置loading
            that.$message({
              message: '登录成功！',
              type: 'success'
            })
            this.$socket.emit('login', {
              id: this.$store.state.user.userId
            })

            // let list = res.data.userPower.split(",");
            // console.log(list);
            // 设置权限列表并跳转到home页面
            that.form.userName = '' // 清空用户名
            that.form.password = '' // 清空密码
            // that.$store.commit("setRouterList", list);
            that.$router.push({
              name: 'home_index'
            })
          } else if (res.data.ok == 'false1' || res.data.ok == 'false2') {
            that.$message({
              message: res.data.msg,
              showClose: true,
              type: 'error',
              duration: 5000
            })
          } else {
            that.$message.error('账号或密码输入不正确，请重新输入！')
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    }
  }
}
</script>

<style>
</style>
