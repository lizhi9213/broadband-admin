<style lang="less">
@import url('./monitor.less');
</style>

<template>
  <div class="container">
    <Card dis-hover :style="{minHeight: cardHeight + 'px'}">
      <Tabs value="name1">
        <TabPane label="实时监控" name="name1">
          <Row :gutter="10" class="seat-box">
            <Col span="24">
            <div class="statistical">
              <div class="items">空闲
                <span class="color-bolck color1">{{free}}</span>
              </div>
              <div class="items">通话
                <span class="color-bolck color2">{{call}}</span>
              </div>
              <div class="items">离线
                <span class="color-bolck color3">{{offline}}</span>
              </div>
            </div>
            </Col>
            <Col span="4" v-for="(item, index) in seatList" :key="index">
            <div class="seat-card" :class="'bg-color' + item.status">
              <div class="user">
                <i class="iconfont icon-kefu"></i>{{item.name}}</div>
              <div class="status">
                <p>工号：{{item.jobnumber}}</p>
                <p>状态：{{item.stustr}}</p>
                <p>时长：30:42</p>
              </div>
            </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane label="图表监控" name="name2">
          <div class="chart-box">
            <div id="line_chart"></div>
            <div id="bar_chart"></div>
          </div>
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script>
// 引入 ECharts 主模块
import * as echarts from 'echarts/lib/echarts'
// 引入柱状图
import 'echarts/lib/chart/bar'
// 引入折线图
import 'echarts/lib/chart/line'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
// echarts 主题
import '@/libs/macarons'

export default {
  name: 'monitor',
  data() {
    return {
      cardHeight: 500,
      free: 3,
      call: 6,
      offline: 3,
      seatList: [],
      myChart1: {}, // 柱状图表1
      myChart2: {}, // 线形图表2
      firstLoading: false
    }
  },
  methods: {
    getSeatData() {
      // this.axios
      //     .get('https://kejiyuan.xierxinxi.cn:1443/data/Report.ashx', {
      //       params: {
      //         Action: 'GetAllImportResult',
      //         fileName: res.file_name
      //       }
      //     })
      //     .then(result => {
      //       console.log(result)
      //     })
      //     .catch(err => {
      //       this.$message.error('发生错误')
      //     })
      this.seatList = [
        { status: 1, name: '小明小明', jobnumber: 'kf001', stustr: '空闲' },
        { status: 2, name: '小何', jobnumber: 'kf002', stustr: '通话' },
        { status: 3, name: '小月', jobnumber: 'kf003', stustr: '离线' },
        { status: 1, name: '小蓝', jobnumber: 'kf004', stustr: '空闲' },
        { status: 2, name: '小熊', jobnumber: 'kf005', stustr: '通话' },
        { status: 2, name: '小方', jobnumber: 'kf006', stustr: '通话' },
        { status: 2, name: '小明小明', jobnumber: 'kf001', stustr: '通话' },
        { status: 1, name: '小何', jobnumber: 'kf002', stustr: '空闲' },
        { status: 3, name: '小月', jobnumber: 'kf003', stustr: '离线' },
        { status: 2, name: '小蓝', jobnumber: 'kf004', stustr: '通话' },
        { status: 3, name: '小熊', jobnumber: 'kf005', stustr: '离线' },
        { status: 2, name: '小方', jobnumber: 'kf006', stustr: '通话' }
      ]
    },
    getChartData() {
      const _this = this
      // 图表隐藏loading, 次方法只能调用一次
      if (!this.firstLoading) {
        this.myChart1.hideLoading()
        this.myChart2.hideLoading()
      }

      // 后台假数据
      const chart1Data = [
        { name: '空闲', number: 5, color: '#f2f2f2' },
        { name: '通话', number: 20, color: '#0cbc83' },
        { name: '离线', number: 36, color: '#cccc66' }
      ]
      const chart2Data = [
        {
          DateTime: '14:36',
          Inbound: 6, // 呼入量
          BreatheOut: 10 // 呼出量
        },
        {
          DateTime: '14:42',
          Inbound: 13, // 呼入量
          BreatheOut: 6 // 呼出量
        },
        {
          DateTime: '14:48',
          Inbound: 10, // 呼入量
          BreatheOut: 26 // 呼出量
        },
        {
          DateTime: '14:52',
          Inbound: 22, // 呼入量
          BreatheOut: 32 // 呼出量
        },
        {
          DateTime: '15:04',
          Inbound: 8, // 呼入量
          BreatheOut: 28 // 呼出量
        },
        {
          DateTime: '15:10',
          Inbound: 36, // 呼入量
          BreatheOut: 30 // 呼出量
        }
      ]

      // 处理后台传输的数据
      const xtext1 = []
      const colorArr = []
      const data1 = []
      chart1Data.forEach(item => {
        xtext1.push(item.name)
        colorArr.push(item.color)
        data1.push(item.number)
      })
      const xtext2 = []
      const inData = []
      const outData = []
      chart2Data.forEach(info => {
        xtext2.push(info.DateTime)
        inData.push(info.Inbound)
        outData.push(info.BreatheOut)
      })

      // 异步加载的图表更新
      this.myChart1.setOption({
        xAxis: {
          data: xtext1
        },
        series: {
          name: 'barChart',
          data: data1,
          itemStyle: {
            //通常情况下：
            normal: {
              //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
              color: function(params) {
                var colorList = colorArr
                return colorList[params.dataIndex]
              }
            }
          }
        }
      })
      this.myChart2.setOption({
        xAxis: { data: xtext2 },
        series: [
          {
            name: '呼出量',
            data: inData,
            type: 'line'
          },
          {
            name: '呼入量',
            type: 'line',
            data: outData
          }
        ]
      })
      this.firstLoading = true
    },
    chartInit() {
      // 基于准备好的dom，初始化echarts实例
      this.myChart1 = echarts.init(document.getElementById('bar_chart'))
      this.myChart2 = echarts.init(document.getElementById('line_chart'))
      // 绘制图表
      this.myChart1.setOption({
        tooltip: {},
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [
          {
            type: 'bar',
            name: 'barChart',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            data: []
          }
        ]
      })
      this.myChart2.setOption({
        calculable: true,
        legend: {
          data: ['呼出量', '呼入量']
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value} 次'
            }
          }
        ],
        series: [
          {
            name: '呼出量',
            data: [],
            type: 'line'
          },
          {
            name: '呼入量',
            type: 'line',
            data: []
          }
        ]
      })
      // 显示loading遮罩层
      this.myChart1.showLoading()
      this.myChart2.showLoading()
    }
  },
  mounted() {
    const _this = this
    this.cardHeight = window.innerHeight - 120
    // 浏览器窗口发生改变
    window.onresize = function() {
      _this.cardHeight = window.innerHeight - 120
    }
    this.chartInit()
    this.getSeatData()
    setTimeout(function() {
      _this.getChartData()
    }, 2000)
  }
}
</script>

