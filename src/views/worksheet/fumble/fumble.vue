<style lang="less">
@import url('./fumble.less');
</style>

<template>
    <div class="container">
        <Card dis-hover>
            <Row :gutter="10" class="handle-box" style="margin-top:10px;">
                <Col span="24" class="filter-input" style="display: flex; align-items: center;">
                <el-date-picker type="daterange" v-model="timedate" format="yyyy-MM-dd" size="small" style="width: 240px;" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2"></el-date-picker>
                <!-- <DatePicker type="daterange" placement="bottom-start" placeholder="Select date"></DatePicker> -->
                <Input v-model="KeyWord" icon="ios-search" placeholder="请输入关键字" style="width: 240px; margin: 0 12px;"></Input>
                <Button type="primary" @click="initTable">
                    <i class="iconfont icon-shaixuan" style="line-height:15px;vertical-align:middle;"></i> 筛选
                </Button>
                </Col>
                </Col>
            </Row>
            <Table :height="tableHeight" :columns="columns1" :data="data1" style="margin-bottom:30px;"></Table>
            <div style="text-align:right;padding-right:14px;">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" background :page-sizes="[30, 60, 90, 120]" :page-size="nowSize" layout="total, sizes, prev, pager, next, jumper" :total="sumTotal">
                </el-pagination>
            </div>
        </Card>
    </div>
</template>

<script>
// 处理用户编辑后的数据
// 在Date原型上绑定一个格式化日期函数
Date.prototype.format = function(fmt) {
  var o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
  // yyyy-MM-dd hh:mm:ss 或者 yyyy-MM-dd
}
export default {
  name: 'fumble',
  data() {
    return {
      pickerOptions2: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      tableHeight: 0,
      cardHeight: 500,
      dateTime: [new Date(), new Date()],
      timedate: [new Date(), new Date()],
      KeyWord: '',
      orderModal: false,
      formOrder: { user: '', password: '' },
      ruleOrder: {},
      columns1: [
        {
          title: '呼入号码',
          width: 150,
          key: 'phonenum'
        },
        {
          title: '呼入时间',
          width: 200,
          key: 'createtime'
        }
      ],
      data1: [],
      currentPage: 1, // 当前页码
      sumTotal: 0, // 总条数
      nowSize: 30 // 当前一页显示多少条
    }
  },
  methods: {
    initTable() {
      // 初始化table表格
      const _this = this
      console.log(_this.dateTime)
      let start, end
      if (!_this.timedate) {
        start = _this.dateTime[0].format('yyyy-MM-dd')
        end = _this.dateTime[1].format('yyyy-MM-dd')
      } else {
        start = _this.timedate[0].format('yyyy-MM-dd')
        end = _this.timedate[1].format('yyyy-MM-dd')
      }
      this.axios
        .get('/apiwss/system/misslist', {
          params: {
            start: start,
            end: end,
            index: _this.currentPage,
            limit: _this.nowSize,
            keyWord: _this.KeyWord
          }
        })
        .then(res => {
          console.log(res.data)
          _this.data1 = res.data.data
          _this.sumTotal = res.data.count
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.nowSize = val
      this.initTable()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.currentPage = val
      this.initTable()
    }
  },
  mounted() {
    const _this = this
    this.tableHeight = window.innerHeight - 280
    // 浏览器窗口发生改变
    window.onresize = function() {
      _this.tableHeight = window.innerHeight - 280
    }
    this.initTable()
  }
}
</script>

