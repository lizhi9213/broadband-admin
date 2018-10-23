<style lang="less" scoped>
::-webkit-scrollbar {
  width: 0px;
}
.container {
  height: 100%;
  background: #fff;
  overflow-y: auto;
  .header {
    position: relative;
    height: 40px;
    background: #228ee6;
    color: #fff;
    z-index: 2;
    .icon-fanhui {
      position: absolute;
      top: 10px;
      left: 10px;
      line-height: 20px;
      z-index: 1000;
    }
    .header-text {
      padding: 0 32px;
      line-height: 40px;
      font-size: 16px;
      text-align: center;
    }
    .header-input {
      padding: 0 40px;
      line-height: 32px;
      text-align: center;
      position: absolute;
      top: 4px;
      width: 100%;
    }
    .icon-search {
      position: absolute;
      top: 10px;
      right: 10px;
      line-height: 20px;
    }
  }
  .checked-box {
    position: relative;
    width: 100%;
    height: 40px;
    background: #fff;
    text-align: center;
    border-bottom: 1px solid #eee;
    line-height: 40px;
    display: flex;
    z-index: 2;
    .screen-item {
      width: 50%;
      z-index: 2;
      &:first-child {
        box-shadow: 1px 0 0 0 #eee;
      }
      .iconfont {
        margin-right: 10px;
      }
    }
  }
  .search-box {
    position: relative;
    left: 0;
    width: 100%;
    background: #fff;
    z-index: 2;
    padding: 0 10px;
    .search-item {
      padding: 10px 0;
      display: flex;
      border-bottom: 1px solid #eee;
      .cell-right {
        position: relative;
        .active {
          color: #409eff !important;
        }
        .icon-xaingxia {
          position: absolute;
          bottom: -8px;
          right: 0;
          color: #ccc;
        }
        .icon-xiangshang {
          position: absolute;
          top: -8px;
          right: 0;
          color: #ccc;
        }
      }
    }
  }
  .screen-box {
    position: relative;
    left: 0;
    width: 100%;
    background: #fff;
    z-index: 2;
    padding: 10px 10px;
  }
  .item-cells {
    padding: 10px;
    .item-cell {
      padding: 10px;
      border: 1px solid #eee;
      border-radius: 5px;
      overflow: hidden;
      margin-bottom: 10px;
      position: relative;
      &:last-child {
        margin-bottom: 0;
      }
      .item-cell-hd {
        display: flex;
        height: 20px;
        line-height: 20px;
        margin-bottom: 10px;
        .state-round {
          height: 8px;
          width: 8px;
          position: absolute;
          top: 6px;
          left: 10px;
          border-radius: 4px;
          background: #409eff;
        }
        .state {
          margin-left: 24px;
        }
      }
      .item-cell-bd {
        display: flex;
        line-height: 20px;
        .title {
          flex: 1;
          font-size: 14px;
          padding-right: 10px;
        }
        .date {
          color: #999;
        }
      }
      .absolute {
        position: absolute;
        right: 20px;
        width: 52px;
        top: 0;
        .btn {
          background: #ff6060;
          border: none;
          outline: none;
          margin-top: 10px;
          border-radius: 5px;
          width: 50px;
          padding: 4px 0;
          color: #fff;
        }
        .tab-label {
          height: 22px;
          line-height: 25px;
          width: 40px;
          margin: 0 auto;
          color: #fff;
          text-align: center;
          position: relative;
          &::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: -16px;
            width: 0;
            height: 0;
            border-left: 20px solid transparent;
            border-right: 20px solid transparent;
          }
        }
        .tab-todo {
          background: #ff6060;
          &::after {
            border-top: 16px solid #ff6060;
          }
        }
        .tab-signin {
          background: #3dc99c;
          &::after {
            border-top: 16px solid #3dc99c;
          }
        }
        .tab-complete {
          background: #4e72b8;
          &::after {
            border-top: 16px solid #4e72b8;
          }
        }
        .tab-file {
          background: #7fb80e;
          &::after {
            border-top: 16px solid #7fb80e;
          }
        }
      }
    }
  }
  .maskbox {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
  }
}

.el-radio--mini.is-bordered {
  margin-right: 10px;
  .el-radio__input {
    display: none;
  }
}
.el-radio.is-bordered + .el-radio.is-bordered {
  margin-left: 0;
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>

<style lang="less">
.el-card {
  margin-bottom: 10px;
}
.el-card__body {
  padding: 10px;
  font-size: 14px;
}
.el-card__header {
  padding: 10px;
  font-size: 14px;
}
.el-step__head {
  .el-step__icon {
    height: 10px;
    width: 10px;
    align-items: flex-end;
  }
}
.el-step__main {
  .el-step__title {
    font-size: 13px;
    line-height: 20px;
  }
}
.popover {
  min-width: 80px;
  padding: 10px;
}
</style>

<template>
  <div class="container">
    <div class="header">
      <i class="iconfont icon-fanhui" @click="routeBack"></i>
      <div class="header-text" v-if="type==0">全部工单</div>
      <div class="header-text" v-else-if="type==1">处理中</div>
      <div class="header-text" v-else-if="type==2">已完成</div>
      <div class="header-text" v-else="type===3">接单</div>
      <div v-if="serachshow" class="header-input">
        <el-input id="cli" size="small" v-model="keyWord" placeholder="请输入内容" @blur="search">
        </el-input>
      </div>
      <i class="iconfont icon-search" @click="changesearch"></i>
    </div>
    <div class="checked-box">
      <div class="screen-item" @click="changepx(1)">
        <i class="iconfont icon-paixu"></i>排序</div>
      <div class="screen-item" @click="changepx(2)">
        <i class="iconfont icon-shaixuan"></i>筛选</div>
    </div>
    <ul class="search-box" v-if="sortshow">
      <li class="search-item" v-for="(item,index) in sortList" :key="index" @click="changeSort(index)">
        <div style="flex:1;">{{item.value}}</div>
        <div class="cell-right">
          <i class="iconfont icon-xaingxia" v-bind:class="{ active: item.isError }"></i>
          <i class="iconfont icon-xiangshang" v-bind:class="{ active: item.isActive }"></i>
        </div>
      </li>
    </ul>
    <div class="screen-box" v-if="screenshow">
      <el-form ref="form" :model="form" label-width="60px">
        <el-form-item label="状态:" v-if="type!=3">
          <el-radio-group v-model="form.state" size="mini">
            <el-radio label="0" border>全部</el-radio>
            <el-radio label="1" border>已接单</el-radio>
            <el-radio label="2" border>已签到</el-radio>
            <el-radio label="3" v-if="type!=1" border>已完成</el-radio>
            <el-radio label="4" v-if="type!=1" border>已归档</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="时限:">
          <el-radio-group v-model="form.scope" size="mini">
            <el-radio label="0" border>全部</el-radio>
            <el-radio label="2" border>近2小时</el-radio>
            <el-radio label="12" border>近12小时</el-radio>
            <el-radio label="24" border>近24小时</el-radio>
            <el-radio label="1000" border>更多</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="mini">确定</el-button>
          <el-button size="mini" @click="closemark">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class=" item-cells ">
      <div v-if="recordList.length===0" style="text-align:center;">
        <i class="iconfont icon-Null-data" style="font-size:48px;"></i>
        <p>暂无工单</p>
      </div>
      <div v-else>
        <el-card v-for="(item,index) in recordList" :key="item.id" @click.native="menuLinkTo(index)">
          <div slot="header">
            <span>{{item.code}}</span>
            <el-popover content="工作时限" trigger="click" popper-class="popover">
              <el-tag slot="reference" @click.native.stop="" v-if="item.status>2" type="success" size="mini" style="float:right">{{item.status===3?'已完工':'已归档'}}</el-tag>
              <el-tag slot="reference" @click.native.stop="" v-else :type="item.workLine>0?'danger':item.workLine>-3?'warning':'success'" size="mini" style="float:right"> {{item.workLine>0?'超时':'剩余' +Math.abs(item.workLine)+'小时'}}</el-tag>
            </el-popover>
          </div>
          <el-row>
            <el-col :span="20">
              <el-row>
                <el-col :span="8">联系人：</el-col>
                <el-col :span="16">{{item.custName}}</el-col>
                <el-col :span="8">联系方式：</el-col>
                <el-col :span="16">{{item.custPhone}}</el-col>
              </el-row>
            </el-col>
            <el-col :span="4">
              <el-button v-if="item.status===0" type="danger" icon="el-icon-bell" circle @click.stop="itemLinkTo(index)"></el-button>
              <el-button v-else type="primary" icon="el-icon-phone-outline" circle @click.stop="callPhone(item.custPhone)"></el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-tag type="info" size="mini">{{item.faultSource}}</el-tag>
              <el-tag type="info" size="mini">{{item.faultType}}</el-tag>
            </el-col>
          </el-row>
          <div style="padding-top:5px;">
            <el-popover content="完工时限" trigger="click" popper-class="popover">
              <span slot="reference" @click.stop="" v-if="item.status<3">{{item.dealLine>0?'超时':'剩余' +Math.abs(item.dealLine)+'小时'}}</span>
              <span slot="reference" @click.stop="" v-else>{{item.status===3?'已完工':'已归档'}}</span>
            </el-popover>
            <span style="float:right;color:#6f6f6f">{{item.orderTime}}</span>
          </div>
          <el-steps :active="item.status+1">
            <el-step title="">
              <div slot="icon"></div>
            </el-step>
            <el-step title="">
              <div slot="icon"></div>
            </el-step>
            <el-step title="">
              <div slot="icon"></div>
            </el-step>
            <el-step title="">
              <div slot="icon"></div>
            </el-step>
          </el-steps>
        </el-card>
      </div>
      <!-- <div v-else class="item-cell " v-for="(item,index) in recordList " :key="index " @click="menuLinkTo(index) ">
        <div class="item-cell-hd ">
          <span>完工时限:{{comDealLine(item.dealLine)}}</span>
          <div style="position:relative">
            <div class="state-round "></div>
            <span class="state ">{{item.faultType}}</span>
          </div>
        </div>
        <div class="item-cell-bd ">
          <div class="title ">{{item.faultMemo}}</div>
          <div class="date ">{{item.orderTime}}</div>
        </div>
        <div class="absolute ">
          <button class="btn " style="background:rgb(28, 154, 210);" v-if="item.status===0 " @click.stop="itemLinkTo(index) ">待办</button>
          <div class="tab-label tab-signin" v-else-if="item.status===1 ">已接单</div>
          <div class="tab-label tab-todo" v-else-if="item.status===2 ">处理中</div>
          <div class="tab-label tab-complete" v-else-if="item.status===3 ">已完成</div>
          <div class="tab-label tab-file" v-else="item.status===4 ">已归档</div>
        </div>
      </div> -->
    </div>
    <div v-if="recordList.length>30" style="display:flex;align-items:center;justify-content:center;width:100%; ">
      <el-pagination small @size-change="handleSizeChange " @current-change="handleCurrentChange " :total="total " :current-page.sync="page " background :page-size="pageSize " layout="prev, pager, next, jumper ">
      </el-pagination>
    </div>
    <div class="maskbox" v-if="markFlag1" @click="closemark"></div>
    <div class="maskbox" v-if="markFlag2" @click="closemark"></div>
  </div>
</template>
<script>
export default {
  computed: {},
  data() {
    return {
      form: {
        state: '0',
        scope: '0'
      },
      keyWord: '',
      markFlag1: false,
      markFlag2: false,
      screenshow: false,
      sortshow: false,
      serachshow: false,
      page: 1,
      pageSize: 30,
      total: 30,
      type: '',
      sort: 1,
      sortType: 1,
      sortList: [
        {
          key: 1,
          sorttype: 2,
          value: '派单时间',
          isActive: true,
          isError: false
        },
        {
          key: 2,
          value: '接单时间',
          isActive: false,
          isError: false
        },
        {
          key: 3,
          value: '签到时间',
          isActive: false,
          isError: false
        },
        {
          key: 4,
          value: '到期时长',
          isActive: false,
          isError: false
        }
      ],
      recordList: [
        // {
        //   faultType: '故障',
        //   faultMemo: '你是高级哦高当啊的感觉啊',
        //   orderTime: '2018-08-21',
        //   status: 0
        // },
        // {
        //   faultType: '故障',
        //   faultMemo: '你是高级哦高当啊的感觉啊',
        //   orderTime: '2018-08-21',
        //   status: 1
        // },
        // {
        //   faultType: '故障',
        //   faultMemo: '你是高级哦高当啊的感觉啊',
        //   orderTime: '2018-08-21',
        //   status: 2
        // },
        // {
        //   faultType: '故障',
        //   faultMemo: '你是高级哦高当啊的感觉啊',
        //   orderTime: '2018-08-21',
        //   status: 3
        // },
        // {
        //   faultType: '故障',
        //   faultMemo: '你是高级哦高当啊的感觉啊',
        //   orderTime: '2018-08-21',
        //   status: 4
        // }
      ]
    }
  },
  // directives: {
  //   focus: {
  //     // 当绑定元素插入到 DOM 中。
  //     inserted: function(el) {
  //       // 聚焦元素
  //       cli.focus()
  //     }
  //   }
  // },
  methods: {
    callPhone(phone) {
      if (phone) {
        window.location.href = 'tel:' + phone
      } else {
        this.$message.error('没有有效的联系方式')
      }
    },
    comDealLine(val) {
      if (val < 0) {
        return '剩余' + (0 - val) + '小时'
      } else {
        return '超时' + val + '小时'
      }
    },
    routeBack() {
      this.$router ? this.$router.back() : window.history.back()
    },
    onSubmit() {
      //   console.log(123)
      //   console.log(this.form)
      this.markFlag2 = false
      this.screenshow = false
      this.getList()
    },
    changeSort(index) {
      for (let i = 0; i < this.sortList.length; i++) {
        if (this.sortList[i].key !== this.sortList[index].key) {
          this.sortList[i].isActive = false
          this.sortList[i].isError = false
        }
      }
      if (this.sortList[index].key) {
        if (this.sortList[index].isActive) {
          this.sortList[index].isActive = false
          this.sortList[index].isError = true
          this.sorttype = 2
        } else {
          this.sortList[index].isActive = true
          this.sortList[index].isError = false
          this.sorttype = 1
        }
      }
      this.sort = this.sortList[index].key
      this.markFlag1 = false
      this.sortshow = false
      this.getList()
    },
    changepx(index) {
      if (index === 1) {
        this.sortshow = !this.sortshow
        this.markFlag1 = !this.markFlag1
        this.markFlag2 = false
        this.screenshow = false
      } else {
        this.screenshow = !this.screenshow
        this.markFlag2 = !this.markFlag2
        this.markFlag1 = false
        this.sortshow = false
      }
    },
    closemark() {
      this.sortshow = false
      this.screenshow = false
      this.markFlag1 = false
      this.markFlag2 = false
    },
    changesearch() {
      this.serachshow = !this.serachshow
    },
    search() {
      this.serachshow = false
      this.getList()
    },
    handleSizeChange(val) {
      this.sizePage = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.getList()
    },
    menuLinkTo(index) {
      //   console.log(index)
      this.$router.push('/workdetail/' + this.recordList[index].id)
    },
    itemLinkTo(index) {
      this.$router.push('/robbing/' + this.recordList[index].id)
    },
    getList() {
      this.axios
        .get('/apiweb/work/wechat', {
          params: {
            index: this.page,
            limit: this.pageSize,
            type: this.type,
            keyWord: this.keyWord,
            sort: this.sort,
            sorttype: this.sorttype,
            state: this.form.state,
            scope: this.form.scope
          }
        })
        .then(res => {
          this.recordList = res.data.data
          this.total = res.data.count
        })
        .catch(function(err) {
          console.log(err)
        })
    }
  },
  mounted() {
    this.type = this.$route.params.type || ''
    // console.log(this.type)
    // console.log(this.sortList)
    if (this.type === '3') {
      this.sortList = [
        {
          key: 1,
          sorttype: 2,
          value: '派单时间',
          isActive: true,
          isError: false
        }
      ]
    }
    this.getList()
  },
  created() {
    // document.cookie = 'workerId=1'
  }
}
</script>

