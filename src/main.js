// 主要组件优先加载
import Vue from 'vue'
import App from './app.vue'
import { router } from './router/index'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'

// UI组件和自定义组件
import iView from 'iview'
import VueI18n from 'vue-i18n'
import util from './libs/util'
import ElementUI from 'element-ui'
import Cookies from 'js-cookie'

// 静态文件引入，样式等
import '@/locale'
import 'element-ui/lib/theme-chalk/index.css'
import 'iview/dist/styles/iview.css'
import './fonts/iconfont.css'
import '../static/css/site.css' // 全局自定义样式
import VueSocketio from 'vue-socket.io'

Vue.use(VueSocketio, 'http://117.158.216.158:7001')

import Calendar from 'vue-mobile-calendar'
import vueiInfinite from 'vue-infinite-scroll'
Vue.use(vueiInfinite)
Vue.use(Calendar)
// 挂载到vue中
Vue.use(VueAxios, axios)
Vue.use(VueI18n)
Vue.use(iView)
Vue.use(ElementUI)
new Vue({
  el: '#app',
  router: router,
  store: store,
  render: h => h(App),
  data: {
    currentPageName: ''
  },
  mounted() {
    const _this = this
    this.currentPageName = this.$route.name
    // 显示打开的页面的列表
    this.$store.commit('setOpenedList')
    this.$store.commit('initCachepage')
    // 权限菜单过滤相关
    this.$store.commit('updateMenulist1')
    // iview-admin检查更新
    // util.checkUpdate(this);
    // 热线来电全局提醒，需要websocketio服务器推送
  },
  beforeUpdate() {
    let that = this
    let nowNum = parseInt(Cookies.get('reload_num'))
    if (Cookies.get('reload_num') == undefined) {
      console.log('未设置cooke:reload_num')
      Cookies.set('reload_num', nowNum)
    }
    if (nowNum == 4) {
      console.log('刷新次数达到阀值')
      that.$message({
        showClose: true,
        message: '…(⊙_⊙;)…  数据被狗狗叼走了，请您重新登录！',
        type: 'error'
      })
      that.$store.commit('logout', that)
      that.$store.commit('clearOpenedSubmenu')
      //   that.$router.push({
      //     name: 'login'
      //   })
      Cookies.set('reload_num', 1)
      return
    }
    if (this.$store.state.app.routerList.length == 0 && nowNum < 4) {
      console.log('无法获取到权限列表,路由正在重载...')
      that.$message({
        showClose: true,
        message: '无法获取到页面，正在为您重新加载...'
      })
      // 重载路由
      location.reload()
      Cookies.set('reload_num', nowNum + 1)
    }
    // 超时检测
    window.setTimeout(function() {
      if (
        that.$store.state.app.routerList.length == 0 &&
        parseInt(Cookies.get('reload_num')) < 4
      ) {
        that.$message({
          showClose: true,
          message: '请求超时，请重新登录！',
          type: 'error'
        })
        // that.$store.commit('logout', that)
        that.$store.commit('clearOpenedSubmenu')
        // that.$router.push({
        //   name: 'login'
        // })
        Cookies.set('reload_num', 1)
      }
    }, 5000)
  },
  created() {
    let that = this
    //  加载页面时执行
    //
    if (that.$store.state.app.menuList.length === 0) {
      that.axios
        .get('/apiweb/login/UserPagePowerList', {
          params: {}
        })
        .then(res => {
          let routerList = JSON.parse(JSON.stringify(res.data))
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
          that.$store.commit('setUserId')
        })
        .catch(function(err) {
          console.log(err)
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
    // 这里用来请求后台权限列表，防止用户刷新页面菜单加载不上,判断是否有cooke,如果有，则请求一次权限并设置，如果没有则返回login
    // Cookies.get(''yh_web_UserId)
    // 判断是否有存储到cookies中有list
    if (Cookies.get('reload_list')) {
      let nwoList = Cookies.get('reload_list').split(',')
      that.$store.commit('setRouterList', nwoList)
      // 销毁reload_list
      Cookies.remove('reload_list')
      // 请求到数据，复位标记
      Cookies.set('reload_num', 1)
      return
    }

    if (Cookies.get('yh_web_UserId')) {
      that.axios
        .get('/apiweb/login/GetPageList', {
          params: {
            UserId: Cookies.get('yh_web_UserId') //用户id
          }
        })
        .then(res => {
          console.log('重新加载了当前页面！')
          // console.log(res.data);
          // //将数据填充到store中
          // let list = res.data.split(',')
          // // console.log(list);
          // // 由于异步，此时请求到数据设置到store中也有极大可能被重置给刷新掉
          // that.$store.commit('setRouterList', list)
          // console.log(list)
          // // 先放到cooke中缓存,并在满足上面条件和updated钩子中销毁
          // Cookies.set('reload_list', res.data)
        })
        .catch(function(err) {
          console.log(err)
        })
    } else {
      console.log('当前没有Cooke,请登录！')
      //   that.$router.push({
      //     name: '/login'
      //   })
    }
  },
  updated() {
    // vue生命周期函数，更新渲染完成
    // if (this.$store.state.app.routerList.length != 0) {
    //     // 如果有路由表了就删除
    //     Cookies.remove('reload_list');
    //     // 请求到数据，复位标记
    //     Cookies.set('reload_num', 1);
    // }
  }
})

// // 添加请求拦截器
// axios.interceptors.request.use(
//     config => {
//         config.headers
//         // console.log(config);
//         // config.url = 'http://171.8.5.209:19000/data/' + config.url;
//         config.url='http://192.168.20.112:19000'+config.url.replace('/api','');
//         return config;
//     },
//     err => {
//         return Promise.reject(err);
//     });
