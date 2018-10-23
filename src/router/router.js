import Main from '@/views/Main.vue'

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录'
  },
  component: () => import('@/views/login.vue')
}

export const page404 = {
  path: '/404',
  name: 'error-404',
  meta: {
    title: '404-页面不存在'
  },
  component: () => import('@/views/error-page/404.vue')
}

export const page403 = {
  path: '/403',
  meta: {
    title: '403-权限不足'
  },
  name: 'error-403',
  component: () => import('@//views/error-page/403.vue')
}

export const page500 = {
  path: '/500',
  meta: {
    title: '500-服务端错误'
  },
  name: 'error-500',
  component: () => import('@/views/error-page/500.vue')
}

export const preview = {
  path: '/preview',
  name: 'preview',
  component: () => import('@/views/form/article-publish/preview.vue')
}

export const locking = {
  path: '/locking',
  name: 'locking',
  component: () =>
    import('@/views/main-components/lockscreen/components/locking-page.vue')
}

//roobing,myworklist,workrecord,workdetail为微信操作界面
export const robbing = {
  path: '/robbing/:id',
  name: 'robbing',
  component: () => import('@/views/weapp/robbing/robbing.vue')
}
export const myworklist = {
  path: '/myworklist',
  name: 'myworklist',
  component: () => import('@/views/weapp/myworklist/myworklist.vue')
}

export const workrecord = {
  path: '/workrecord/:type',
  name: 'workrecord',
  component: () => import('@/views/weapp/workrecord/workrecord.vue')
}
export const workdetail = {
  path: '/workdetail/:id',
  name: 'workdetail',
  component: () => import('@/views/weapp/workdetail/workdetail.vue')
}
export const handleworks = {
  path: '/handleworks/:id',
  name: 'handleworks',
  component: () => import('@/views/weapp/handleworks/handleworks.vue')
}

export const wechatlogin = {
  path: '/wechatlogin',
  name: 'wechatlogin',
  component: () => import('@/views/weapp/login')
}

export const binding = {
  path: '/binding',
  name: 'binding',
  component: () => import('@/views/weapp/binding/index.vue')
}
export const success = {
  path: '/success',
  name: 'success',
  component: () => import('@/views/weapp/binding/success.vue')
}

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  redirect: '/home',
  component: Main,
  children: [{
      path: 'home',
      title: {
        i18n: 'home'
      },
      name: 'home_index',
      component: () => import('@/views/home/home.vue')
    },
    {
      path: 'hotline/:number',
      title: '热线受理',
      name: 'hotline',
      component: () => import('@/views/worksheet/hotline/hotline.vue')
    },
    {
      path: 'hotlineEasy/:number',
      title: '热线受理',
      name: 'hotlineEasy',
      component: () => import('@/views/worksheet/hotline/hotlineEasy.vue')
    },
    {
      path: 'workorder',
      title: '新建工单',
      name: 'workorder',
      component: () => import('@/views/worksheet/workorder/workorder.vue')
    },
    {
      // 临时使用
      path: 'monitor',
      title: '坐席监控',
      name: 'monitor',
      component: () => import('@/views/worksheet/monitor/monitor.vue')
    },
    // {
    //   // 临时使用
    //   path: 'listing',
    //   title: '工单列表',
    //   name: 'listing',
    //   component: () =>
    //     import('@/views/worksheet/orderlist/orderlist.vue')
    // },
    {
      // 临时使用
      path: 'report',
      title: '报表管理',
      name: 'report',
      component: () => import('@/views/report/index.vue')
    },
    {
      // 临时使用
      path: 'orderdetail/:phone',
      title: '工单详情',
      name: 'orderdetail',
      component: () => import('@/views/worksheet/orderdetail/orderdetail.vue')
    },
    {
      // 临时使用
      path: 'fumble',
      title: '漏接来电',
      name: 'fumble',
      component: () => import('@/views/worksheet/fumble/fumble.vue')
    },
    {
      // 临时使用
      path: 'callrecord',
      title: '通话录音',
      name: 'callrecord',
      component: () => import('@/views/worksheet/callrecord/callrecord.vue')
    },
    {
      // 临时使用
      path: 'record',
      title: '沟通记录',
      name: 'record',
      component: () => import('@/views/worksheet/record/record.vue')
    },
    {
      // 临时使用
      path: 'customerList',
      title: '客户列表',
      name: 'customerList',
      component: () =>
        import('@/views/setting/worksheet/customerList/customerList.vue')
    },
    // {
    //   path: 'region',
    //   title: '区域管理',
    //   name: 'region',
    //   component: () => import('@/views/setting/worksheet/region/region.vue')
    // },
    // {
    //   path: 'repair',
    //   title: '组织管理',
    //   name: 'repair',
    //   component: () => import('@/views/setting/worksheet/repair/repair.vue')
    // },
    {
      path: 'myself',
      title: '个人中心',
      name: 'myself_index',
      component: () => import('@/views/myself/myself.vue')
    },
    {
      path: 'order/:order_id',
      title: '订单详情',
      name: 'order-info',
      component: () =>
        import('@/views/advanced-router/component/order-info.vue')
    }, // 用于展示动态路由
    {
      path: 'shopping',
      title: '购物详情',
      name: 'shopping',
      component: () =>
        import('@/views/advanced-router/component/shopping-info.vue')
    }, // 用于展示带参路由
    {
      path: 'message',
      title: '消息中心',
      name: 'message_index',
      component: () => import('@/views/message/message.vue')
    },
    {
      path: '/worksheet/workview/view/:id',
      icon: 'android-laptop',
      name: 'view',
      title: '修改视图',
      meta: {
        FlagId: 1
      },
      component: () => import('@/views/worksheet/view/view.vue')
    },
    {
      path: '/worksheet/workoper/workoper/:id',
      name: 'worksheetoper',
      title: '工单操作',
      component: () => import('@/views/worksheet/workoper/workoper.vue')
    }
  ]
}

export const menurouter = [{
    name: 'Main',
    component: Main
  },
  {
    title: '企业信息',
    name: 'information',
    component: () => import('@/views/enterprise/information/information.vue')
  },
  {
    title: '角色管理',
    name: 'role',
    component: () => import('@/views/enterprise/role/role.vue')
  },
  {
    title: '组织架构',
    name: 'organization',
    component: () => import('@/views/enterprise/organization/organization.vue')
  },
  {
    title: '用户设置',
    name: 'userset',
    component: () => import('@/views/enterprise/userset/userset.vue')
  },
  {
    title: '服务目录',
    name: 'servicedir',
    component: () => import('@/views/enterprise/servicedir/servicedir.vue')
  },
  {
    title: '客户字段',
    name: 'cfield',
    component: () => import('@/views/customer/cfield/cfield.vue')
  },
  {
    title: '宽带字段',
    name: 'kfield',
    component: () => import('@/views/customer/kfield/kfield.vue')
  },
  {
    title: '装维经理',
    name: 'maintain',
    component: () => import('@/views/maintain/maintain.vue')
  },
  {
    title: '客户视图',
    name: 'cview',
    component: () => import('@/views/customer/cview/cview.vue')
  },
  {
    title: '客户视图',
    name: 'kview',
    component: () => import('@/views/customer/kview/kview.vue')
  },
  {
    title: '客户标签',
    name: 'the_labels',
    component: () => import('@/views/customer/label/label.vue')
  },
  {
    title: '主叫管理',
    name: 'calling',
    component: () => import('@/views/voice/calling/calling.vue')
  },
  {
    title: '分机管理',
    name: 'extension',
    component: () => import('@/views/call/calluser.vue')
  },
  {
    title: '中继管理',
    name: 'relay',
    component: () => import('@/views/call/callgateway.vue')
  },
  {
    title: 'IVR设置',
    name: 'ivr',
    component: () => import('@/views/voice/ivr/ivr.vue')
  },
  {
    title: '话术问卷',
    name: 'term',
    component: () => import('@/views/proadmin/term/term.vue')
  },
  {
    title: '项目设置',
    name: 'proset',
    component: () => import('@/views/proadmin/proset/proset.vue')
  },
  {
    title: '报表管理',
    name: 'report',
    component: () => import('@/views/report/index.vue')
  },
  {
    title: '资料管理',
    name: 'proreso',
    component: () => import('@/views/proadmin/proreso/proreso.vue')
  },
  {
    title: '客户管理',
    name: 'promoni',
    component: () => import('@/views/proadmin/promoni/promoni.vue')
  },
  {
    title: '公海预测营销',
    name: 'forecast',
    component: () => import('@/views/sale/forecast/forecast.vue')
  },
  {
    title: '公海预览营销',
    name: 'preview',
    component: () => import('@/views/sale/preview/preview.vue')
  },
  {
    title: '客户管理',
    name: 'custadmi',
    component: () => import('@/views/sale/custadmi/custadmi.vue')
  },
  {
    title: '录音管理',
    name: 'recordadmi',
    component: () => import('@/views/sale/recordadmi/recordadmi.vue')
  },
  {
    title: '客户管理',
    name: 'clientlist',
    component: () => import('@/views/client/clientlist/clientlist.vue')
  },
  {
    title: '用户组',
    name: 'custgroup',
    component: () => import('@/views/client/custgroup/custgroup.vue')
  },
  {
    title: '新建工单',
    name: 'neworder',
    component: () => import('@/views/worksheet/neworder/neworder.vue')
  },
  {
    title: '工单操作',
    name: 'workoper',
    component: () => import('@/views/worksheet/workoper/workoper.vue')
  },
  {
    title: '个人中心',
    name: 'myself_index',
    component: () => import('@/views/myself/myself.vue')
  },
  {
    title: '知识库',
    name: 'repository_index',
    component: () => import('@/views/repository/repository.vue')
  },
  {
    title: '报表分析',
    name: 'journaling_index',
    component: () => import('@/views/journaling/journaling.vue')
  },
  {
    title: '工单字段',
    name: 'field',
    component: () => import('@/views/workset/field/field.vue')
  },
  {
    title: '工单视图',
    name: 'ordershow',
    component: () => import('@/views/workset/ordershow/ordershow.vue')
  },
  {
    title: '工单列表',
    name: 'orderlist',
    component: () =>
      import('@/views/worksheet/orderlist/orderlist.vue')
  },
  {
    title: '营销记录',
    name: 'markloglist',
    component: () => import('@/views/worksheet/markloglist/markloglist.vue')
  },
  {
    title: '地市日报表',
    name: 'city',
    component: () => import('@/views/reportform/city/city.vue')
  },
  {
    title: '地市投诉率分析报表',
    name: 'complain',
    component: () => import('@/views/reportform/complain/complain.vue')
  },
  {
    title: '质检通报',
    name: 'massdetection',
    component: () =>
      import('@/views/reportform/massdetection/massdetection.vue')
  },
  {
    title: '投诉指标通报',
    name: 'complainnorm',
    component: () => import('@/views/reportform/complainnorm/complainnorm.vue')
  },
  {
    title: '工单明细',
    name: 'work',
    component: () => import('@/views/reportform/work/work.vue')
  },
  {
    title: '工单赔费明细',
    name: 'payfor',
    component: () => import('@/views/reportform/payfor/payfor.vue')
  },
  {
    title: '区域管理',
    name: 'region',
    component: () => import('@/views/setting/worksheet/region/region.vue')
  },
  {
    title: '组织管理',
    name: 'repair',
    component: () => import('@/views/setting/worksheet/repair/repair.vue')
  },
  {
    title: '组织管理',
    name: 'community',
    component: () => import('@/views/setting/worksheet/community/community.vue')
  }
]

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  loginRouter,
  otherRouter,
  preview,
  locking,
  page500,
  page403,
  robbing,
  myworklist,
  workrecord,
  workdetail,
  handleworks,
  binding,
  success,
  wechatlogin
  // page404
]