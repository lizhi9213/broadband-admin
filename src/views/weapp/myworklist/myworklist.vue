<style lang="less" scoped>
::-webkit-scrollbar {
  width: 0px;
}
.container {
  background: #fff;
  height: 100%;
  .header {
    height: 200px;
    width: 100%;
    background: #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .blur {
      width: 100%;
      height: 100%;
      -webkit-filter: blur(10px);
      filter: blur(10px);
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }
    .img-box {
      z-index: 2;
      width: 100px;
      height: 100px;
      border-radius: 50px;
      overflow: hidden;
    }
  }
  .item-cells {
    background-color: #ffffff;
    line-height: 1.47058824;
    font-size: 14px;
    padding: 10px;
    overflow: hidden;
    position: relative;
    .item-cell {
      padding: 10px 15px;
      margin-bottom: 20px;
      position: relative;
      display: flex;
      align-items: center;
      border: 1px solid #eee;
      border-radius: 5px;
      .item-cell-hd {
        margin-right: 10px;
      }
      .item-cell-bd {
        margin-right: 10px;
      }
      .item-cell-ft {
        flex: 1;
        text-align: right;
        color: #808080;
      }
    }
  }
}
</style>

<template>
    <div class="container">
        <div class="header">
            <img class="blur" :src="userimg" />
            <div class="img-box">
                <img :src="userimg" style="width:100%;" />
            </div>
        </div>
        <div class="item-cells">
            <div class="item-cell" v-for="(item,index) in workData" :key="index" @click="menuLinkTo(item.path)">
                <div class="item-cell-hd">
                    <i class="iconfont" :class="item.icon"></i>
                </div>
                <div class="item-cell-bd">{{item.title}}</div>
                <div class="item-cell-ft">{{item.check}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      userimg: '/static/images/default_img.jpg',
      workData: [
        {
          icon: 'icon-dingwei-',
          title: '工单记录',
          check: '查看',
          path: '/workrecord/0'
        },
        {
          icon: 'icon-chulizhong',
          title: '处理中',
          check: '查看',
          path: '/workrecord/1'
        },
        {
          icon: 'icon-yiwancheng',
          title: '已完成',
          check: '查看',
          path: '/workrecord/2'
        },
        {
          icon: 'icon-935caidan_daiban',
          title: '待办工单',
          check: '查看',
          path: '/workrecord/3'
        }
      ]
    }
  },
  methods: {
    menuLinkTo(i) {
      //   console.log(i)
      if (i) {
        this.$router.push(i)
      }
    }
  },
  created() {
    // document.cookie = 'workerId=1'
    // document.cookie =
    //   'head=http://thirdwx.qlogo.cn/mmopen/OVOLQargwOxJJ07A6sXjuQwwcJC3gfLcw7IX0QRTRqutTbnDM9f72chumYo2m2SeJ9lOCXgAbM4spdqOQ4TicSbml7238ypdx/132'
    const head = Cookies.get('head')
    if (head) {
      this.userimg = head
    }
  }
}
</script>

