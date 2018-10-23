<style lang="less">
@import url('./record.less');
</style>

<template>
    <div class="container">
        <Card dis-hover>
            <Row :gutter="10" class="handle-box" style="min-height: 76px;">
                <Col span="12" class="filter-input" style="display: flex; align-items: center; padding-top: 20px;">
                <DatePicker v-model="timedate" format="yyyy-MM-dd" type="daterange" placement="bottom-start" placeholder="Select date" style="width: 240px;" :clearable="false"></DatePicker>
                <Input v-model="KeyWord" placeholder="请输入关键字" style="width: 240px; margin: 0 12px;"></Input>
                <Button type="primary" @click="initTable">
                    <Icon type="ios-search"></Icon> 查询
                </Button>
                </Col>
                <Col span="12">
                <aplayer @canplay="playAplayer" v-show="showPlayer" :music="songList" :mini="false" ref="player" theme="#b7daff" />
                </Col>
            </Row>
            <Table :height="cardHeight" :columns="columns1" :data="data1"></Table>
            <div style="text-align: right; padding-right: 14px;">
                <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[30, 60, 90, 120]" :page-size="nowSize" layout="total, sizes, prev, pager, next, jumper" :total="sumTotal">
                </el-pagination>
            </div>
        </Card>
    </div>
</template>

<script>
import Aplayer from 'vue-aplayer'
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
  name: 'record',
  components: {
    Aplayer
  },
  data() {
    const _this = this
    return {
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
          title: '来电类型',
          width: 150,
          key: 'calltype'
        },
        {
          title: '呼入时间',
          width: 200,
          key: 'createtime'
        },
        {
          title: '接线人',
          width: 200,
          key: 'createuser'
        },
        {
          title: '备注信息',
          minWidth: 300,
          key: 'memo'
        },
        {
          title: '操作',
          align: 'center',
          key: 'setting',
          fixed: 'right',
          width: 120,
          render: (h, params) => {
            return h('div', [
              h('span', {
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
                    _this.playMp3(params.row.recordfile, params.row.createuser)
                  }
                }
              }),
              h('span', {
                class: {
                  iconfont: true,
                  'icon-Group-': true
                },
                style: {
                  cursor: 'pointer',
                  fontSize: '22px',
                  fontWeight: '600'
                },
                on: {
                  click() {
                    // console.log(params.row) // 单行数据
                    _this.downloadFile(params.row.recordfile)
                  }
                }
              })
            ])
          }
        }
      ],
      data1: [],
      currentPage: 1, // 当前页码
      sumTotal: 0, // 总条数
      nowSize: 30, // 当前一页显示多少条
      showPlayer: false,
      songList: {
        src: 'https://moeplayer.b0.upaiyun.com/aplayer/snowmoonflowers',
        title: '暂无',
        artist: '暂无',
        pic: '/static/img/td_icon.ico'
      } // 录音播放列表
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
        .get('/apiwss/system/resultlist', {
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
    },
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
        this.showPlayer = true // 显示播放器
      }
    },
    downloadFile(file) {
      // 下载文件
      const last = file.lastIndexOf('/')
      const name = file.substring(last + 1)
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = file
      link.setAttribute('download', name)
      document.body.appendChild(link)
      link.click()
      link.remove()
    }
  },
  mounted() {
    const _this = this
    this.cardHeight = window.innerHeight - 250
    // 浏览器窗口发生改变
    window.onresize = function() {
      _this.cardHeight = window.innerHeight - 250
    }
    // 初始化
    this.initTable()
  }
}
</script>

