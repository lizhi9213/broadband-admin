<template>
  <div style="width:100%;height:100%;" id="analyze_bar"></div>
</template>

<script>
import echarts from 'echarts'
import '@/utils/macarons'
export default {
  name: 'analyzeBar',
  props: {
    chartData: {
      type: Object,
      default: () => {
        return {
          vData: [],
          xData: []
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
    refreshData(data) {
      if (!this.myChart) {
        return
      }

      //更新数据
      var option = this.myChart.getOption()
      option.xAxis[0].data = data.xData
      option.series[0].data = data.vData
      this.myChart.setOption(option)
    }
  },
  mounted() {
    const _this = this
    const option = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: this.chartData.xData,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '故障',
          type: 'bar',
          barWidth: '20',
          data: this.chartData.vData,
          itemStyle: {
            //通常情况下：
            normal: {
              label: {
                show: true, //开启显示
                position: 'top', //在上方显示
                textStyle: {
                  //数值样式
                  fontSize: 13
                }
              },
              //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
              color: function(params) {
                var colorList = [
                  '#37a2da',
                  '#67e0e3',
                  '#ffdb5c',
                  '#ff9f7f',
                  '#fb7293',
                  '#e7bcf3',
                  '#8378ea'
                ]
                return colorList[params.dataIndex]
              }
            },
            //鼠标悬停时：
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    this.myChart = echarts.init(
      document.getElementById('analyze_bar'),
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