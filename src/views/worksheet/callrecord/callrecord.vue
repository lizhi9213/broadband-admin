<style lang="less">
@import url('./callrecord.less');
</style>

<template>
    <div class="container">
        <Card dis-hover>
            <Row :gutter="10" class="handle-box" style="margin-top:10px;">
                <Col span="24" class="filter-input" style="display: flex; align-items: center;">
                <el-date-picker type="daterange" v-model="timedate" format="yyyy-MM-dd" size="small" style="width: 240px;" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2"></el-date-picker>
                <!-- <DatePicker type=" daterange" placement="bottom-start" placeholder="Select date">
                    </DatePicker> -->
                <Input v-model="KeyWord" icon="ios-search" placeholder="请输入关键字" style="width: 240px; margin: 0 12px;"></Input>
                <el-select v-model="selType" placeholder="请选择" size='small' style="margin:0 12px;">
                    <el-option :key="0" :label="'全部'" :value="0">
                    </el-option>
                    <el-option :key="1" :label="'呼入'" :value="1">
                    </el-option>
                    <el-option :key="2" :label="'呼出'" :value="2">
                    </el-option>
                </el-select>
                </el-switch>
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
        <Modal v-model="startPlayer" title="播放录音" width="620" class-name="none-footer-order">
            <aplayer @canplay="playAplayer" :music="songList" :mini="false" repeat="no-repeat" ref="player" theme="#b7daff" />
        </Modal>
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
import Aplayer from 'vue-aplayer'
export default {
  name: 'fumble',
  components: {
    Aplayer
  },
  watch: {
    startPlayer(val) {
      if (!val) {
        this.$refs.player.pause()
      }
    }
  },
  data() {
    return {
      startPlayer: false, // 开始播放
      songList: {
        src: 'https://moeplayer.b0.upaiyun.com/aplayer/snowmoonflowers',
        title: '暂无',
        artist: '暂无',
        pic: '/static/img/td_icon.ico'
      }, // 录音播放列表
      selType: 0,
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
          title: '号码',
          width: 150,
          key: 'phone'
        },
        {
          title: '类型',
          width: 100,
          key: 'calltype',
          render: (h, params) => {
            let type = ''
            switch (params.row.calltype) {
              case 'callIn':
                type = '呼入'
                break
              case 'callOut':
                type = '呼出'
                break
            }
            return h('span', type)
          }
        },
        {
          title: '呼叫时间',
          width: 200,
          key: 'createtime'
        },
        {
          title: '客服',
          width: 120,
          key: 'username'
        },
        {
          title: '操作',
          width: 120,
          key: 'operTime',
          render: (h, params) => {
            const _this = this
            if (
              params.row.recordfile !== '' &&
              params.row.recordfile !== null
            ) {
              const filename = params.row.recordfile.substring(
                params.row.recordfile.lastIndexOf('/') + 1
              )
              return h('div', [
                h('div', {
                  class: {
                    iconfont: true,
                    'icon-bofang': true
                  },
                  style: {
                    marginRight: '14px',
                    cursor: 'pointer',
                    fontSize: '22px',
                    fontWeight: '600'
                  },
                  on: {
                    click() {
                      // console.log(params.row) // 单行数据
                      _this.playMp3(params.row.recordfile, '焦作中移铁通')
                    }
                  }
                }),
                h('a', {
                  class: {
                    iconfont: true,
                    'icon-Group-': true
                  },
                  style: {
                    marginRight: '14px',
                    cursor: 'pointer',
                    fontSize: '22px',
                    fontWeight: '600'
                  },
                  attrs: {
                    href: params.row.recordfile,
                    download: filename
                  }
                })
              ])
            } else {
              return h('span', '无')
            }
          }
        }
      ],
      data1: [],
      currentPage: 1, // 当前页码
      sumTotal: 0, // 总条数
      nowSize: 30 // 当前一页显示多少条
    }
  },
  methods: {
    playAplayer() {
      this.$refs.player.play()
    },
    playMp3(file, user) {
      // 播放录音
      // console.log(file)
      if (file) {
        const last = file.lastIndexOf('/')
        const name = file.substring(last + 1)
        const obj = {
          title: name, // 歌曲名称
          artist: user, // 演唱者
          src: file, // 音频文件的 URL 必填
          pic: '/static/img/td_icon.ico' // 封面图片 URL
        }
        this.songList = obj // 播放文件加载到播放列表
        this.startPlayer = true // 显示播放器
      }
    },
    initTable() {
      // 初始化table表格
      const _this = this
      //   console.log(_this.dateTime)
      let start, end
      if (!_this.timedate) {
        start = _this.dateTime[0].format('yyyy-MM-dd')
        end = _this.dateTime[1].format('yyyy-MM-dd')
      } else {
        start = _this.timedate[0].format('yyyy-MM-dd')
        end = _this.timedate[1].format('yyyy-MM-dd')
      }
      this.axios
        .get('/apiweb/work/workorder/callrecord', {
          params: {
            start: start, // 开始时间
            end: end, // 结束时间
            index: _this.currentPage, // 分页
            limit: _this.nowSize, // 显示数
            keyWord: _this.KeyWord, // 关键字
            selType: _this.selType // 呼叫类型
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

