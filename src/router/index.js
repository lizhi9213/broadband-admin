import Vue from 'vue'
import iView from 'iview'
import Util from '../libs/util'
import VueRouter from 'vue-router'
import Cookies from 'js-cookie'
import {
  routers,
  otherRouter
} from './router'
import {
  resolve
} from 'url'
import axios from 'axios'
import store from '../store'

Vue.use(VueRouter)

// 路由配置
const RouterConfig = {
  mode: 'history',
  routes: routers
}

export const router = new VueRouter(RouterConfig)

router.beforeEach((to, from, next) => {
  /*
    1.安全性考虑，后台传回的权限列表不能存储到cooke中，防止被篡改，所以只能存储于vuex中。
    2.但是vuex存在重载或刷新页面state的数据也被刷新,权限列表获取处于异步的原因(路由总是最先执行被挂载)，所以路由自身的权限判定会出现bug
    */
  let allow = true
  const wechats = [
    'handleworks',
    'workdetail',
    'workrecord',
    'myworklist',
    'robbing'
  ] //

  if (wechats.indexOf(to.name) > -1) {
    if (Cookies.get('workerId')) {
      next()
      return
    } else {
      next({
        name: 'wechatlogin',
        query: {
          path: to.name,
          params: to.params != {} ? JSON.stringify(to.params) : ''
        }
      })
      return
    }
  }
  if (Cookies.get('url')) {
    // 如果有
    if (Cookies.get('url') == to.name) {
      // 说明只是重载或者刷新或者地址栏输入相同地址，不做二级页面权限判定操作
      allow = false
    }
    Cookies.set('url', to.name)
  } else {
    // 如果没有只做存储操作
    Cookies.set('url', to.name)
  }

  iView.LoadingBar.start()
  Util.title(to.meta.title)
  if (Cookies.get('locking') === '1' && to.name !== 'locking') {
    // 判断当前是否是锁定状态
    next({
      replace: true,
      name: 'locking'
    })
  } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
    next(false)
  } else {
    const page = routers.find(item => {
      return item.name === to.name
    })
    if (page) {
      next()
      return
    }
    if (!Cookies.get('yh_web_UserId') && to.name !== 'login') {
      // 判断是否已经登录且前往的页面不是登录页
      next({
        name: 'login'
      })
    } else if (Cookies.get('yh_web_UserId') && to.name === 'login') {
      // 判断是否已经登录且前往的是登录页
      Util.title()
      next({
        name: 'home_index'
      })
    } else {
      const curRouterObj = Util.getRouterObjByName([otherRouter], to.name)
      if (curRouterObj && curRouterObj.access !== undefined && allow) {
        // 需要判断权限的路由
        // if (curRouterObj.access === parseInt(Cookies.get('access'))) {
        //     Util.toDefaultPage([otherRouter], to.name, router, next); // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
        // } else {
        //
        // }next({
        //         replace: true,
        //         name: 'error-403'
        //     });
        Util.toDefaultPage([otherRouter], to.name, router, next)
      } else {
        // 没有配置权限的路由, 直接通过
        Util.toDefaultPage([...routers], to.name, router, next)
      }
    }
  }
})

router.afterEach(to => {
  Util.openNewPage(router.app, to.name, to.params, to.query)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})