<template>
  <div style="width:100%;height:100%; position: relative;" id="pie_charts">
  </div>
</template>

<script>
import echarts from 'echarts'
import '@/utils/macarons'
export default {
  name: 'pieCharts',
  props: {
    chartData: {
      type: Object,
      default: () => {
        return {
          data: [], // 外圈
          pdata: [] //内圈
        }
      }
    }
  },
  data() {
    return {
      myChart: {}
    }
  },
  methods: {
    dealData(result) {
      const legend = []
      const outRing = []
      const innerRing = []
      // 外圈
      result.data.forEach(item => {
        legend.push(item.areaName)
        const obj1 = { value: item.count, name: item.areaName }
        outRing.push(obj1)
      })
      // 内圈
      result.pdata.forEach(item => {
        legend.push(item.areaName)
        const obj2 = { value: item.count, name: item.areaName }
        innerRing.push(obj2)
      })
      return {
        legend: legend,
        outData: outRing,
        innerData: innerRing
      }
    },
    refreshData(data) {
      if (!this.myChart) {
        return
      }
      let nowData = {
        legend: [],
        outData: [],
        innerData: []
      }
      if (
        this.chartData.data.length !== 0 &&
        this.chartData.pdata.length !== 0
      ) {
        nowData = this.dealData(data)
        //更新数据
        var option = this.myChart.getOption()
        option.legend[0].data = nowData.legend
        option.series[0].data = nowData.innerData
        option.series[1].data = nowData.outData
        this.myChart.setOption(option)
      }
    }
  },
  mounted() {
    const _this = this
    let nowData1 = {
      legend: [],
      outData: [],
      innerData: []
    }
    if (this.chartData.data.length !== 0 && this.chartData.pdata.length !== 0) {
      nowData1 = this.dealData(this.chartData)
    }
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: nowData1.legend
      },
      series: [
        {
          name: '区域占比',
          type: 'pie',
          selectedMode: 'single',
          radius: [0, '30%'],

          label: {
            normal: {
              position: 'inner'
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: nowData1.innerData
        },
        {
          name: '区域占比',
          type: 'pie',
          radius: ['40%', '55%'],
          label: {
            normal: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#eee',
              borderColor: '#aaa',
              borderWidth: 1,
              borderRadius: 4,
              // shadowBlur:3,
              // shadowOffsetX: 2,
              // shadowOffsetY: 2,
              // shadowColor: '#999',
              // padding: [0, 7],
              rich: {
                a: {
                  color: '#999',
                  lineHeight: 22,
                  align: 'center'
                },
                // abg: {
                //     backgroundColor: '#333',
                //     width: '100%',
                //     align: 'right',
                //     height: 22,
                //     borderRadius: [4, 4, 0, 0]
                // },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  fontSize: 16,
                  lineHeight: 33
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [2, 4],
                  borderRadius: 2
                }
              }
            }
          },
          data: nowData1.outData
        }
      ]
    }
    this.myChart = echarts.init(
      document.getElementById('pie_charts'),
      'macarons'
    )
    this.myChart.setOption(option)

    window.addEventListener('resize', function() {
      _this.myChart.resize()
    })
  },
  watch: {
    chartData(val) {
      this.refreshData(val)
    }
  }
}
</script>