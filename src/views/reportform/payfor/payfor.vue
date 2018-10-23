<style lang="less">
@import url('./payfor.less');
</style>
<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="ios-browsers"></Icon>
        工单陪费明细
      </p>
      <div>
        <Row class="field">
          <Col span="24">
          <Form :model="searchform" ref="searchform" label-width="80px" style="display:flex;flex-wrap:wrap;">
            <FormItem label="日期" prop="date">
              <DatePicker v-model="searchform.date" :clearable="false" value-format="yyyy-MM-dd" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
              </DatePicker>
            </FormItem>
            <FormItem label="平台" prop="platformId">
              <Select v-model="searchform.platformId" placeholder="请选择平台">
                <Option v-for="item in platformOption" :key="item.value" :label="item.label" :value="item.value"></Option>
              </Select>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="getTableData">筛选</Button>
              <Button @click="resetsearchform('searchform')">重置</Button>
            </FormItem>
          </Form>
          <el-tabs v-model="activeName2" type="border-card">
            <el-tab-pane label="报表分析" name="first">
              <Table :border="true" stripe :columns="columns1" :loading="tloading" height="400" :data="tableData.data" style="margin-bottom: 30px;">
              </Table>
            </el-tab-pane>
            <el-tab-pane label="图表分析" name="second">
              <Button type="primary" @click="changedate">日期</Button>
              <Button type="primary" @click="changgeplatform">平台</Button>
              <Button type="primary" @click="changecity">地市</Button>
              <div style="width:800px;height:400px;" id="data_source"></div>
            </el-tab-pane>
          </el-tabs>
          </Col>
        </Row>
      </div>
    </Card>
  </div>
</template>
<script>
import echarts from 'echarts'
import moment from 'moment'
export default {
  name: 'payfor',
  data() {
    return {
      activeName2: 'first', //table切换
      searchform: {
        //筛选信息表单
        date: '',
        starttime: '',
        endtime: '',
        platformId: '-1'
      },
      platformOption: [], //平台类型下拉
      columns1: [
        // thead数据
        {
          title: '日期',
          key: 'date'
        },
        {
          title: '归属平台',
          key: 'platform'
        },
        {
          title: '客户号码',
          key: 'usernum'
        },
        {
          title: '赔费金额',
          key: 'money'
        },
        {
          title: '处理人',
          key: 'user'
        },
        {
          title: '业务名称',
          key: 'businessname'
        },
        {
          title: '营业时间',
          key: 'time'
        },
        {
          title: '营销工号',
          key: 'number'
        },
        {
          title: '营销姓名',
          key: 'marketname'
        },
        {
          title: '平台',
          key: 'platform'
        },
        {
          title: '城市',
          key: 'city'
        },
        {
          title: '定责类型',
          key: 'responsibility'
        },
        {
          title: '是否已充钱',
          key: 'ifpay'
        },
        {
          title: '结果说明',
          key: 'statement'
        }
      ],
      tableData: {
        data: [] // table 数据
      }, //table 表头
      tloading: false, // 表格的loading
      dataSourcePie: null
    }
  },
  methods: {
    init() {
      this.setplatformCombo() // 设置部门下拉框
    },
    setplatformCombo() {
      // 平台下拉
      this.axios
        .get('/apiweb/daily_report/PlatFrom', {
          params: {}
        })
        .then(res => {
          this.platformOption = res.data
          this.platformOption = [{ value: '-1', label: '全部' }].concat(
            this.platformOption
          )
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    changedate() {
      //日期图表
      var nameList = this.tableData.data
      var legendData = []
      var seriesData = []
      var selected = {}
      for (var i = 0; i < nameList.length; i++) {
        var count = 0
        name = nameList[i].date
        if (legendData.indexOf(name) > -1) {
          continue
        }
        for (var j = 0; j < nameList.length; j++) {
          if (nameList[i].date === nameList[j].date) {
            count += nameList[j].money
          }
        }
        legendData.push(name)
        seriesData.push({
          name: name,
          value: count
        })
        selected[name] = i < 8
      }
      this.seriesData = seriesData
      this.legendData = legendData
      this.selected = selected
      this.dataSourcePie.setOption({
        title: {
          text: '日期图表分析',
          subtext: '',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: this.legendData,
          selected: this.selected
        },
        series: [
          {
            name: 'sum金额',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.seriesData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },
    changgeplatform() {
      //平台图表
      var nameList = this.tableData.data
      var legendData = []
      var seriesData = []
      var selected = {}
      for (var i = 0; i < nameList.length; i++) {
        var count = 0
        name = nameList[i].platform
        if (legendData.indexOf(name) > -1) {
          continue
        }

        for (var j = 0; j < nameList.length; j++) {
          if (nameList[i].platform === nameList[j].platform) {
            count += nameList[j].money
          }
        }
        legendData.push(name)
        seriesData.push({
          name: name,
          value: count
        })
        selected[name] = i < 8
      }
      this.seriesData = seriesData
      this.legendData = legendData
      this.selected = selected
      this.dataSourcePie.setOption({
        title: {
          text: '平台图表分析',
          subtext: '',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: this.legendData,
          selected: this.selected
        },
        series: [
          {
            name: 'sum金额',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.seriesData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },
    changecity() {
      //地市图表
      var nameList = this.tableData.data
      console.log(nameList)
      var legendData = []
      var seriesData = []
      var selected = {}
      for (var i = 0; i < nameList.length; i++) {
        var count = 0
        name = nameList[i].city
        if (legendData.indexOf(name) > -1) {
          continue
        }
        for (var j = 0; j < nameList.length; j++) {
          if (nameList[i].city === nameList[j].city) {
            count += nameList[j].money
          }
        }
        legendData.push(name)
        seriesData.push({
          name: name,
          value: count
        })
        selected[name] = i < 8
      }
      this.seriesData = seriesData
      this.legendData = legendData
      this.selected = selected
      this.dataSourcePie.setOption({
        title: {
          text: '地市图表分析',
          subtext: '',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: this.legendData,
          selected: this.selected
        },
        series: [
          {
            name: 'sum金额',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.seriesData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },
    /*重置筛选操作*/
    resetsearchform(formName) {
      this.$refs[formName].resetFields()
      this.searchform.date = [
        new Date(
          new Date(
            new Date(new Date().setDate(new Date().getDate() - 7)).setHours(0)
          ).setMinutes(0)
        ),
        new Date(new Date(new Date().setHours(23)).setMinutes(59))
      ]
      this.getTableData()
    },
    getTableData() {
      this.tloading = true
      console.log(this.searchform.platformId)
      this.axios
        .get('/apiweb/daily_report/WorkPenalty', {
          params: {
            starttime: moment(this.searchform.date[0]).format('YYYY-MM-DD'),
            endtime: moment(this.searchform.date[1]).format('YYYY-MM-DD'),
            platformId: this.searchform.platformId
          }
        })
        .then(res => {
          this.tableData.data = res.data.data
          this.tableData.total = res.data.length
          this.changedate()
          this.tloading = false
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.searchform.date = [
      new Date(
        new Date(
          new Date(new Date().setDate(new Date().getDate() - 7)).setHours(0)
        ).setMinutes(0)
      ),
      new Date(new Date(new Date().setHours(23)).setMinutes(59))
    ]
    this.getTableData()
  },
  mounted() {
    this.init()
    this.$nextTick(() => {
      this.dataSourcePie = echarts.init(document.getElementById('data_source'))
      window.addEventListener('resize', function() {
        dataSourcePie.resize()
      })
    })
  }
}
</script>
<style lang="less" scoped>
.ivu-form-item {
  width: 20%;
  .ivu-form-item-content {
    padding-left: 80px;
    margin-right: 10px;
  }
}
</style>

