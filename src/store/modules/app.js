import {
  otherRouter,
  menurouter,
  page404
} from '@/router/router'
import Util from '@/libs/util'
import Cookies from 'js-cookie'
import Vue from 'vue'
import {
  router
} from '@/router/index'

const app = {
  state: {
    avator: localStorage.avatorImgPath, // 记录当前是否更改了头像
    isLoading: false, // 控制loading动画显示开关
    showView: false, // 控制动画上下翻转效果
    cachePage: [],
    lang: '',
    isFullScreen: false,
    openedSubmenuArr: [], // 要展开的菜单数组
    menuTheme: 'dark', // 主题
    themeColor: 'y', // 颜色样式
    pageOpenedList: [{
      title: '首页',
      path: '/home',
      name: 'home_index'
    }],
    currentPageName: '',
    currentPath: [{
      title: '首页',
      path: '',
      name: 'home_index'
    }], // 面包屑数组
    menuList: [],
    routers: [otherRouter],
    tagsList: [...otherRouter.children],
    messageCount: 0,
    dontCache: ['text-editor', 'artical-publish'], // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
    routerList: [],
    sysRouter: [],
    popView: false,
    popData: {}
  },
  mutations: {
    setPopData(state, data) {
      state.popData = data
    },
    setPopView(state, data) {
      state.popView = data
    },
    setLoading(state, status) {
      state.isLoading = status
    },
    setShowView(state, status) {
      state.showView = status
    },
    setTagsList(state, list) {
      state.tagsList.push(...list)
    },
    setRouterList(state, list) {
      state.routerList = list
    },
    setSysRouter(state, list) {
      state.sysRouter = list
    },
    clearMenuList(state) {
      state.menuList = []
    },
    updateMenulist(state) {
      // let accessCode = parseInt(Cookies.get('access'));
      let accessCode = state.routerList
      let menuList = []
      // appRouter.forEach((item, index) => {
      //     if (item.access !== undefined) {
      //         if (Util.showThisRoute(item.access, accessCode)) {
      //             if (item.children.length === 1) {
      //                 menuList.push(item);
      //             } else {
      //                 let len = menuList.push(item);
      //                 let childrenArr = [];
      //                 childrenArr = item.children.filter(child => {
      //                     if (child.access !== undefined) {
      //                         if (child.access === accessCode) {
      //                             return child;
      //                         }
      //                     } else {
      //                         return child;
      //                     }
      //                 });
      //                 menuList[len - 1].children = childrenArr;
      //             }
      //         }
      //     } else {
      //         if (item.children.length === 1 && Util.showThisRoute(item.children[0].access, accessCode)) {
      //             menuList.push(item);
      //         } else {
      //             let len = menuList.push(item);
      //             let childrenArr = [];
      //             childrenArr = item.children.filter(child => {
      //                 if (child.access !== undefined) {
      //                     if (Util.showThisRoute(child.access, accessCode)) {
      //                         return child;
      //                     }
      //                 } else {
      //                     return child;
      //                 }
      //             });
      //             if (childrenArr === undefined || childrenArr.length === 0) {
      //                 menuList.splice(len - 1, 1);
      //             } else {
      //                 let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]));
      //                 handledItem.children = childrenArr;
      //                 menuList.splice(len - 1, 1, handledItem);
      //             }
      //         }
      //     }
      // });
      state.menuList = menuList
    },
    updateMenulist1(state) {
      let accessCode = parseInt(Cookies.get('access'))
      let menuList = []
      let sysRouterList = [...state.sysRouter]
      let tempsysRouter = JSON.parse(JSON.stringify(state.sysRouter))
      sysRouterList.forEach((item, index) => {
        if (item.access !== undefined) {
          if (Util.showThisRoute(item.access, accessCode)) {
            if (item.children.length === 1 || item.children.length === 0) {
              menuList.push(item)
            } else {
              let len = menuList.push(item)
              let childrenArr = []
              childrenArr = item.children.filter(child => {
                if (child.access !== undefined) {
                  if (child.access === accessCode) {
                    return child
                  }
                } else {
                  return child
                }
              })
              menuList[len - 1].children = childrenArr
            }
          }
        } else {
          if (item.children.length === 1 || item.children.length === 0) {
            menuList.push(item)
          } else {
            let len = menuList.push(item)
            let childrenArr = []
            childrenArr = item.children.filter(child => {
              if (child.access !== undefined) {
                if (Util.showThisRoute(child.access, accessCode)) {
                  return child
                }
              } else {
                return child
              }
            })
            if (childrenArr === undefined || childrenArr.length === 0) {
              menuList.splice(len - 1, 1)
            } else {
              let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]))
              handledItem.children = childrenArr
              menuList.splice(len - 1, 1, handledItem)
            }
          }
        }
      })
      for (let i = 0; i < sysRouterList.length; i++) {
        let item = menurouter.find(n => n.name == sysRouterList[i].component)
        if (!!item) {
          sysRouterList[i].component = item.component
        }

        if (sysRouterList[i].children && sysRouterList[i].children.length > 0) {
          for (let j = 0; j < sysRouterList[i].children.length; j++) {
            let item = menurouter.find(
              n => n.name == sysRouterList[i].children[j].component
            )
            if (!!item) {
              sysRouterList[i].children[j].component = item.component
            }
          }
        }
      }
      let tagsList = []
      tempsysRouter.map(item => {
        if (item.children.length <= 1) {
          tagsList.push(item.children[0])
        } else {
          tagsList.push(...item.children)
        }
        state.routers.push(item)
      })
      let tempRouter = []
      tempRouter = sysRouterList.filter(item => {
        if (typeof item.component != 'string') {
          let tempchild = []
          tempchild = item.children.filter(item => {
            if (typeof item.component != 'string') {
              return item
            }
          })
          item.children = tempchild
          return item
        }
      })
      state.menuList = menuList
      state.tagsList.push(...tagsList)
      router.addRoutes(tempRouter)
      // router.addRoutes(tempRouter.concat(page404))
      // 动态路由添加完成，启用上下翻转效果
      setTimeout(() => {
        state.showView = true
      }, 500)
    },
    changeMenuTheme(state, theme) {
      state.menuTheme = theme
    },
    changeMainTheme(state, mainTheme) {
      state.themeColor = mainTheme
    },
    addOpenSubmenu(state, name) {
      let hasThisName = false
      let isEmpty = false
      if (name.length === 0) {
        isEmpty = true
      }
      if (state.openedSubmenuArr.indexOf(name) > -1) {
        hasThisName = true
      }
      if (!hasThisName && !isEmpty) {
        state.openedSubmenuArr.push(name)
      }
    },
    closePage(state, name) {
      state.cachePage.forEach((item, index) => {
        if (item === name) {
          state.cachePage.splice(index, 1)
        }
      })
    },
    initCachepage(state) {
      if (localStorage.cachePage) {
        state.cachePage = JSON.parse(localStorage.cachePage)
      }
    },
    removeTag(state, name) {
      state.pageOpenedList.map((item, index) => {
        if (item.name === name) {
          state.pageOpenedList.splice(index, 1)
        }
      })
    },
    pageOpenedList(state, get) {
      let openedPage = state.pageOpenedList[get.index]
      if (get.argu) {
        openedPage.argu = get.argu
      }
      if (get.query) {
        openedPage.query = get.query
      }
      state.pageOpenedList.splice(get.index, 1, openedPage)
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
    },
    clearAllTags(state) {
      state.pageOpenedList.splice(1)
      state.cachePage.length = 0
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
    },
    clearOtherTags(state, vm) {
      let currentName = vm.$route.name
      let currentIndex = 0
      state.pageOpenedList.forEach((item, index) => {
        if (item.name === currentName) {
          currentIndex = index
        }
      })
      if (currentIndex === 0) {
        state.pageOpenedList.splice(1)
      } else {
        state.pageOpenedList.splice(currentIndex + 1)
        state.pageOpenedList.splice(1, currentIndex - 1)
      }
      let newCachepage = state.cachePage.filter(item => {
        return item === currentName
      })
      state.cachePage = newCachepage
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
    },
    setOpenedList(state) {
      state.pageOpenedList = localStorage.pageOpenedList ?
        JSON.parse(localStorage.pageOpenedList) :
        [otherRouter.children[0]]
    },
    setCurrentPath(state, pathArr) {
      state.currentPath = pathArr
    },
    setCurrentPageName(state, name) {
      state.currentPageName = name
    },
    setAvator(state, path) {
      state.avator = path
      localStorage.avatorImgPath = path
    },
    switchLang(state, lang) {
      state.lang = lang
      Vue.config.lang = lang
    },
    clearOpenedSubmenu(state) {
      state.openedSubmenuArr.length = 0
    },
    setMessageCount(state, count) {
      state.messageCount = count
    },
    increateTag(state, tagObj) {
      if (!Util.oneOf(tagObj.name, state.dontCache)) {
        state.cachePage.push(tagObj.name)
        localStorage.cachePage = JSON.stringify(state.cachePage)
      }
      state.pageOpenedList.push(tagObj)
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
    }
  }
}

export default app