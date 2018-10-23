<style lang="less">
@import './main.less';
</style>
<template>
  <div class="main" :class="{'main-hide-text': shrink}">
    <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
      <scroll-bar ref="scrollBar">
        <shrinkable-menu :shrink="shrink" @on-change="handleSubmenuChange" :theme="menuTheme" :before-push="beforePush" :open-names="openedSubmenuArr" :menu-list="menuList">
          <div slot="top" class="logo-con">
            <a v-show="!shrink" href="http://www.chinatietong.com/" target="_blank" key="max-logo" class="long-logo-box"><img src="../images/logo.png" /></a>
            <img v-show="shrink" class="mini-logo" src="../images/logo-min.png" key="min-logo" />
          </div>
        </shrinkable-menu>
      </scroll-bar>
    </div>
    <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
      <div class="main-header">
        <div class="navicon-con">
          <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
            <Icon type="navicon" size="32"></Icon>
          </Button>
          <div style='margin-left:200px;top:15px;position:absolute;display:none;z-index: 10000;'>
            <el-button type="warning" icon="el-icon-remove-outline" plain size="mini" @click="upStatus(1)">正常</el-button>
            <el-button type="warning" icon="el-icon-remove-outline" plain size="mini" @click="upStatus(0)">禁用</el-button>
            <el-button type="warning" icon="el-icon-remove-outline" plain size="mini" @click="upStatus(-1)">删除</el-button>
          </div>
        </div>
        <div class="header-middle-con">
          <div class="main-breadcrumb">
            <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
          </div>
        </div>
        <div class="header-avator-con" style="width: 540px;">
          <el-tag v-if="ustutype === 1" style="margin-right: 12px;">
            {{ustatus}}&nbsp;[&nbsp;<span v-if="estutype === 0" style="color: #909399;">{{estatus}}</span><span v-if="estutype === 1" style="color: #409eff;">{{estatus}}</span><span v-if="estutype === 2" style="color: #f56c6c;">{{estatus}}</span><span v-if="estutype === 3" style="color: #67c23a;">{{estatus}}</span>&nbsp;]&nbsp;
          </el-tag>
          <el-tag v-if="ustutype === 2" type="danger" style="margin-right: 12px;">
            {{ustatus}}&nbsp;[&nbsp;<span v-if="estutype === 0" style="color: #909399;">{{estatus}}</span><span v-if="estutype === 1" style="color: #409eff;">{{estatus}}</span><span v-if="estutype === 2" style="color: #f56c6c;">{{estatus}}</span><span v-if="estutype === 3" style="color: #67c23a;">{{estatus}}</span>&nbsp;]&nbsp;
          </el-tag>
          <el-tag v-if="ustutype === 0" type="info" style="margin-right: 12px;">离线</el-tag>
          <Button @click="callIn()" type="primary" style="margin-right: 12px;">
            <i class="iconfont icon-ai226" style="position: relative; top: 1px; margin-right: 3px; color: #fff;"></i>签入</Button>
          <Button @click="callOut()" type="primary" style="margin-right: 12px;">
            <i class="iconfont icon-tuichu" style="position: relative; top: 1px; margin-right: 3px; color: #fff; font-size: 20px;"></i>签出</Button>
          <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
          <lock-screen></lock-screen>
          <message-tip v-model="mesCount"></message-tip>
          <!-- <theme-switch></theme-switch> -->
          <div class="user-dropdown-menu-con">
            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
              <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                <a href="javascript:void(0)">
                  <span class="main-user-name">{{ userName }}</span>
                  <Icon type="arrow-down-b"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="ownSpace">个人中心</DropdownItem>
                  <DropdownItem name="editpw" divided>修改密码</DropdownItem>
                  <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Avatar :src="avator" style="background: #619fe7;margin-left: 10px;"></Avatar>
            </Row>
          </div>
        </div>
      </div>
      <div class="tags-con">
        <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
      </div>
    </div>
    <div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
      <div class="single-page">
        <template v-if="$route.fullPath !== '/listing'">
          <!-- <h1>123</h1> -->
          <keep-alive :include="cachePage">
            <!--  -->
            <router-view></router-view>
          </keep-alive>
        </template>
        <template v-else>
          <router-view :key="$route.fullPath"></router-view>
        </template>
      </div>
    </div>
    <!-- 修改密码弹出层 -->
    <Modal v-model="editModal" :closable='false'>
      <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
      <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
        <FormItem label="原密码" prop="oldPass" :error="oldPassError">
          <Input v-model="editPasswordForm.oldPass" placeholder="请输入现在使用的密码"></Input>
        </FormItem>
        <FormItem label="新密码" prop="newPass" :error="newPassError">
          <Input v-model="editPasswordForm.newPass" placeholder="请输入新密码，至少6位字符"></Input>
        </FormItem>
        <FormItem label="确认新密码" prop="rePass">
          <Input v-model="editPasswordForm.rePass" placeholder="请再次输入新密码"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelEditPass">取消</Button>
        <Button type="primary" :loading="savePassLoading" @click="saveEditPass">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue'
import tagsPageOpened from './main-components/tags-page-opened.vue'
import breadcrumbNav from './main-components/breadcrumb-nav.vue'
import fullScreen from './main-components/fullscreen.vue'
import lockScreen from './main-components/lockscreen/lockscreen.vue'
import messageTip from './main-components/message-tip.vue'
import themeSwitch from './main-components/theme-switch/theme-switch.vue'
import Cookies from 'js-cookie'
import util from '@/libs/util.js'
import scrollBar from '@/views/my-components/scroll-bar/vue-scroller-bars'

export default {
  components: {
    shrinkableMenu,
    tagsPageOpened,
    breadcrumbNav,
    fullScreen,
    lockScreen,
    messageTip,
    themeSwitch,
    scrollBar
  },
  data() {
    const valideRePassword = (rule, value, callback) => {
      if (value !== this.editPasswordForm.newPass) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      shrink: false,
      userName: '',
      isFullScreen: false,
      openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
      editModal: false, // 控制修改密码弹出层
      savePassLoading: false, // 控制按钮loading
      oldPassError: '', // 控制原密码错误信息
      newPassError: '', // 控制新密码错误信息
      editPasswordForm: {
        // 表单集合
        oldPass: '',
        newPass: '',
        rePass: ''
      },
      passwordValidate: {
        // 表单验证集合
        oldPass: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        newPass: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
          { max: 32, message: '最多输入32个字符', trigger: 'blur' }
        ],
        rePass: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: valideRePassword, trigger: 'blur' }
        ]
      },
      reguser: '',
      regstatus: '',
      callstatus: '',
      ustatus: '',
      estatus: '',
      ustutype: 0,
      estutype: 0,
      id: null
    }
  },
  sockets: {
    //  websocket处理部分
    connect: function() {
      //  订阅成功时的事件
      //这里是监听connect事件
      this.id = this.$socket.id
      this.$socket.emit('login', {
        id: this.$store.state.user.userId,
        code: Cookies.get('yh_web_UserCode'),
        sid: this.id
      })
    },
    callstatus: function(data) {
      const vm = this
      if (data) {
        // console.log(data)
        const phone = vm.$store.state.app.popData.phone
        const extstatus = vm.$store.state.app.popData.extstatus

        const popData = {
          phone: data.phonenum,
          calldate: data.calldate,
          extdate: data.extdate,
          callstatus: data.userstatus,
          extstatus: data.extstatus,
          callcode: data.callcode,
          calltype: data.calltype
        }
        let ustr = ''
        let estr = ''
        if (data.userstatus == -1) {
          vm.ustutype = 0
        } else {
          if (data.status == 1) {
            if (data.userstatus == 2) {
              ustr = '示闲'
              vm.ustutype = 1
            } else {
              vm.ustutype = 2
              ustr = '示忙'
            }
            if (data.extstatus == 0) {
              estr = '空闲'
              vm.estutype = 1
            } else if (data.extstatus == 1) {
              estr = '振铃中'
              vm.estutype = 2
            } else if (data.extstatus == 2) {
              estr = '通话中'
              vm.estutype = 3
            } else {
              estr = '未知'
              vm.estutype = 0
            }
            vm.ustatus = ustr
            vm.estatus = estr
          } else {
            vm.ustutype = 0
          }
        }

        vm.$store.commit('setPopData', popData)

        if (data.phonenum) {
          if (data.phonenum && phone != data.phonenum && data.calltype == 1) {
            vm.$store.commit('setPopView', true)
            vm.$router.push('/hotline/' + data.phonenum)
          }
        } else {
          vm.$store.commit('setPopView', false)
        }
      }
    },
    //  服务器返回消息时的处理 -- 弹出
    server_response: function(val) {
      const _this = this
      const data = val
      if (data) {
        const notify = {
          type: data.icon || data.level,
          title: data.title,
          message: data.content
        }
        //  工单提醒时允许点击跳转
        if (data.type === 'order') {
          notify.onClick = function() {
            _this.$router.push({
              name: `worksheetoper`,
              params: { id: data.rid }
            })
            //  点击标记为已读
            _this.$socket.emit('read', {
              id: data.Id
            })
          }
        } else {
          notify.onClick = function() {
            //  点击标记为已读
            _this.$socket.emit('read', {
              id: data.Id
            })
          }
        }
        _this.$notify(notify)
        _this.$socket.emit('issend', {
          id: data.Id
        })
      }
    },
    //  是否有未读消息
    message_box: function(val) {
      this.messageCount = val
      this.$store.commit('setMessageCount', val)
    },
    msg: function(val) {
      if (val) {
        this.$message(val)
      }
    }
  },
  computed: {
    menuList() {
      return this.$store.state.app.menuList
    },
    pageTagsList() {
      return this.$store.state.app.pageOpenedList // 打开的页面的页面对象
    },
    currentPath() {
      return this.$store.state.app.currentPath // 当前面包屑数组
    },
    avatorPath() {
      return localStorage.avatorImgPath
    },
    avator() {
      return this.$store.state.app.avator // 当前头像路径
    },
    cachePage() {
      return this.$store.state.app.cachePage
    },
    lang() {
      return this.$store.state.app.lang
    },
    menuTheme() {
      return this.$store.state.app.menuTheme
    },
    mesCount() {
      return this.$store.state.app.messageCount
    }
  },
  methods: {
    init() {
      let pathArr = util.setCurrentPath(this, this.$route.name)
      if (pathArr.length >= 2) {
        this.$store.commit('addOpenSubmenu', pathArr[1].name)
      }
      this.userName = Cookies.get('yh_web_UserName')
      this.checkTag(this.$route.name)
    },
    toggleClick() {
      this.shrink = !this.shrink
    },
    handleClickUserDropdown(name) {
      if (name === 'ownSpace') {
        util.openNewPage(this, 'myself_index') // ownspace_index
        this.$router.push({
          name: 'myself_index'
        })
      } else if (name === 'loginout') {
        // 取消消息订阅
        this.$socket.emit('logout', {
          id: this.$store.state.user.userId,
          sid: this.id
        })
        // 退出登录
        this.$store.commit('logout', this)
        this.$store.commit('clearOpenedSubmenu')
        this.$store.commit('clearMenuList') // 清除路由菜单
        this.$store.commit('clearAllTags') // 清除tags列表
        this.$router.push({
          name: 'login'
        })
      } else if (name === 'editpw') {
        // 初始化表单
        this.oldPassError = ''
        this.newPassError = ''
        this.editPasswordForm = {
          // 表单集合
          oldPass: '',
          newPass: '',
          rePass: ''
        }
        this.editModal = true
      }
    },
    checkTag(name) {
      let openpageHasTag = this.pageTagsList.some(item => {
        if (item.name === name) {
          return true
        }
      })
      if (!openpageHasTag) {
        //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
        util.openNewPage(
          this,
          name,
          this.$route.params || {},
          this.$route.query || {}
        )
      }
    },
    handleSubmenuChange(val) {
      // console.log(val)
    },
    beforePush(name) {
      // if (name === 'accesstest_index') {
      //     return false;
      // } else {
      //     return true;
      // }
      return true
    },
    fullscreenChange(isFullScreen) {
      // console.log(isFullScreen);
    },
    scrollBarResize() {
      this.$refs.scrollBar.resize()
    },
    saveEditPass() {
      let that = this
      // 修改密码保存
      this.$refs['editPasswordForm'].validate(valid => {
        if (valid) {
          that.axios
            .get('/apiweb/user/UpdateUserPWD', {
              params: {
                UserName: Cookies.get('yh_web_UserId'), //用户姓名
                OldPWD: that.editPasswordForm.oldPass, // 原密码
                NewPWD: that.editPasswordForm.newPass // 修改后的密码
              }
            })
            .then(res => {
              // console.log(res.data)
              if (res.data.ok == 'true') {
                that.$message({
                  message: '保存成功！',
                  type: 'success'
                })
                that.editModal = false
              } else if (res.data.ok == 'false1') {
                that.oldPassError = res.data.msg
              } else if (res.data.ok == 'false2') {
                that.newPassError = res.data.msg
              } else {
                that.editModal = false
                that.$message.error(res.data.msg)
              }
            })
            .catch(function(err) {
              // console.log(err)
            })
        }
      })
    },
    cancelEditPass() {
      // 取消
      this.editModal = false
    },
    createWSS() {
      var skay = new skaySipStatus()

      this.$store.commit('setskay', skay)

      let that = this
      let wssuri = Cookies.get('yh_web_WSSUri')
      if (!!wssuri) {
        skay.sipInit(wssuri, function(msg) {
          if (skay.isInit()) {
            // skay初始化成功
            // console.log('skay初始化成功!')
            function regSip(data) {
              // console.log(data)
              //获取配置文件信息
              if (data.code == '200') {
                skay.oSipRegister(
                  data.data,
                  function(msg) {
                    // console.log('regstatus:' + msg)
                    that.reguser = skay.reguser()
                    // console.log(that.reguser)
                    // if (skay.isReg() == 1) {
                    //   that.regstatus = "已注册";
                    // } else {
                    //   that.regstatus = msg;//"离线";
                    //   console.log(msg);
                    // }
                    if (msg == '-1') {
                      that.regstatus = '离线'
                    } else if (msg == '0') {
                      that.regstatus = '已注册'
                    } else if (msg == '1') {
                      that.regstatus = '示忙'
                    } else if (msg == '2') {
                      that.regstatus = '示闲'
                    } else {
                      that.regstatus = msg
                    }
                    setTimeout(function() {
                      if (that.regstatus === '离线')
                        setTimeout(regSip(data), 5000)
                    }, 2000)
                  },
                  function(data) {
                    // console.log(data)
                    that.callstatus = data.msg
                    if (data.callcode) {
                      that.$store.commit('setcallcode', data.callcode)
                    } else {
                      that.$store.commit('setcallcode', '')
                    }
                  }
                )
                //读取配置文件成功
              } else {
                //读取失败
                alert(data.msg)
              }
            }
            skay.oSipGetConf(
              {
                id: Cookies.get('yh_web_UserCode'),
                comId: Cookies.get('yh_web_ComCode'),
                token: '123'
              },
              regSip
            )
          } else {
            // skay初始化失败
            alert('skay初始化失败!')
          }
        })
      } else {
        alert('未配置WSS注册地址,暂无法使用语音功能!')
      }
    },
    addRouters() {
      let that = this
      if (
        that.$store.state.app.menuList.length === 0 &&
        Cookies.get('yh_web_UserId')
      ) {
        that.axios
          .get('/apiweb/login/UserPagePowerList', {
            params: {}
          })
          .then(res => {
            let routerList = JSON.parse(JSON.stringify(res.data))
            // console.log(routerList)
            that.$store.commit('setSysRouter', routerList)
            //vm.init();
            that.$store.commit('updateMenulist1')
            that.$router.addRoutes([
              {
                name: 'errorpage404',
                meta: {
                  title: '404-页面不存在'
                },
                path: '/*',
                children: [],
                component: () => import('@/views/error-page/404.vue')
              }
            ])
            // console.log(that.$store)
          })
          .catch(function(err) {
            // console.log(err)
            that.$router.addRoutes([
              {
                name: 'errorpage404',
                meta: {
                  title: '404-页面不存在'
                },
                path: '/*',
                children: [],
                component: () => import('@/views/error-page/404.vue')
              }
            ])
          })
      }
    },
    callIn() {
      this.axios
        .post('/apiwss/system/signIn', {
          id: Cookies.get('yh_web_UserCode'),
          comId: Cookies.get('yh_web_ComCode')
        })
        .then(res => {
          if (res.data) {
            this.$message.success(res.data.msg)
          }
        })
        .catch(function(err) {
          // console.log(err)
        })
    },
    callOut() {
      this.axios
        .post('/apiwss/system/signOut', {
          id: Cookies.get('yh_web_UserCode'),
          comId: Cookies.get('yh_web_ComCode')
        })
        .then(res => {
          if (res.data) {
            this.$message.success(res.data.msg)
          }
        })
        .catch(function(err) {
          // console.log(err)
        })
    },
    signLogin() {
      this.axios
        .post('/apiwss/system/signLogin', {
          id: Cookies.get('yh_web_UserCode'),
          comId: Cookies.get('yh_web_ComCode')
        })
        .then(res => {
          if (res.data) {
          }
        })
        .catch(function(err) {
          // console.log(err)
        })
    },
    upStatus(status) {
      this.axios
        .post('/apiwss/user/upStatus', {
          id: Cookies.get('yh_web_UserCode'),
          comId: Cookies.get('yh_web_ComCode'),
          status: status,
          file:
            'http://kejiyuan.xierxinxi.cn:60000//2018/2018-08/17/xe8883-20180817-091858-15224465163.mp3'
        })
        .then(res => {
          // console.log(res.data)
        })
        .catch(function(err) {
          // console.log(err)
        })
    },
    test2() {
      this.axios
        .post('/apiwss/system/signOut', {
          id: Cookies.get('yh_web_UserCode'),
          comId: Cookies.get('yh_web_ComCode'),
          file:
            'http://kejiyuan.xierxinxi.cn:60000//2018/2018-08/17/xe8883-20180817-091858-15224465163.mp3'
        })
        .then(res => {
          // console.log(res.data)
        })
        .catch(function(err) {
          // console.log(err)
        })
    }
  },
  watch: {
    $route(to) {
      this.$store.commit('setCurrentPageName', to.name)
      let pathArr = util.setCurrentPath(this, to.name)
      if (pathArr.length > 2) {
        this.$store.commit('addOpenSubmenu', pathArr[1].name)
      }
      this.checkTag(to.name)
      localStorage.currentPageName = to.name
    },
    lang() {
      util.setCurrentPath(this, this.$route.name) // 在切换语言时用于刷新面包屑
    },
    openedSubmenuArr() {
      setTimeout(() => {
        this.scrollBarResize()
      }, 300)
    }
  },
  mounted() {
    this.$socket.emit('connect')
    window.addEventListener('resize', this.scrollBarResize)
  },
  created() {
    this.init()
    this.addRouters()
    // 显示打开的页面的列表
    this.$store.commit('setOpenedList')
    // this.createWSS()
    this.signLogin()
  },
  dispatch() {
    window.removeEventListener('resize', this.scrollBarResize)
  }
}
</script>
