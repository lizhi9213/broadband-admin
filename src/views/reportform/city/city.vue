 <style lang="less">
// @import url('./city.less');
//
</style>

<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="ios-browsers"></Icon>
        地市日报表
      </p>
      <div>
        <Row class="field">
          <Col span="24">
          <Form :model="searchform" :rules="rulessearchform" ref="searchform" label-width="80px" class="demo-ruleForm" style="display:flex;">
            <FormItem label="日期" prop="date">
              <DatePicker v-model="searchform.date" :clearable="false" value-format="yyyy-MM-dd" type="daterange" placement="bottom-end">
              </DatePicker>
            </FormItem>
            <FormItem label="平台" prop="platformId">
              <Select v-model="searchform.platformId" placeholder="请选择平台">
                <Option v-for="item in platformOption" :key="item.value" :label="item.label" :value="item.value"></Option>
              </Select>
            </FormItem>
            <FormItem label="取消类型">
              <Select v-model="searchform.businessId" prop="businessId" placeholder="请选择取消类型">
                <Option v-for="item in businessOption" :key="item.value" :label="item.label" :value="item.value"></Option>
              </Select>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="getTableData">筛选</Button>
              <Button @click="resetsearchform('searchform')">重置</Button>
            </FormItem>

          </Form>
          <el-tabs v-model="activeName2" type="border-card">
            <el-tab-pane label="报表分析" name="first">
              <el-table :border="true" stripe v-loading="tloading" height="400" :data="tableData.data" style="margin-bottom: 30px;">
                <template v-for="(col ,index) in columns1">
                  <el-table-column v-if="col.type==='normal'" :prop="col.prop" :label="col.label"></el-table-column>
                </template>
              </el-table>
              <!-- <Table :border="true" stripe :columns="columns1" v-loading="tloading" height="400" :data="tableData.data" style="margin-bottom: 30px;">
              </Table> -->
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="curnPage" background :page-sizes="[5, 10]" :page-size="sizePage" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
              </el-pagination>
            </el-tab-pane>
            <el-tab-pane label="图表分析" name="second">
              <Button type="primary" @click="changedate">日期</Button>
              <Button type="primary" @click="changgeplatform">平台</Button>
              <Button type="primary" @click="changecity">地市</Button>
              <div style="width:800px;height:400px;" id="data_source_con"></div>
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
  name: 'city',
  data() {
    return {
      activeName2: 'first', //table切换
      searchform: {
        //筛选信息表单
        date: '',
        platformId: '-1',
        businessId: '1'
      },
      rulessearchform: {
        //筛选信息验证表单
        business: [
          {
            type: 'array',
            required: true,
            message: '请选择取消类型',
            trigger: 'change'
          }
        ]
      },
      platformOption: [], //平台类型下拉
      businessOption: [
        {
          value: '1',
          label: '流量'
        },
        {
          value: '2',
          label: '套餐'
        }
      ], //取消类型下拉
      columns1: [
        // thead数据
        {
          label: '日期',
          prop: 'date',
          type: 'normal'
        },
        {
          label: '归属平台',
          prop: 'platform',
          type: 'normal'
        },
        {
          label: '用户号码',
          prop: 'usernum',
          type: 'normal'
        },
        {
          label: '参与活动',
          prop: 'activity',
          type: 'normal'
        },
        {
          label: '取消业务',
          prop: 'business',
          type: 'normal'
        },
        {
          label: '地市',
          prop: 'city',
          type: 'normal'
        },
        {
          label: '处理人',
          prop: 'user',
          type: 'normal'
        }
      ],
      tableData: {
        data: [
          {
            date: '2018-08-30',
            platform: '移动',
            usernum: '123456',
            activity: '业务名称',
            business: '30元流量包',
            city: '科技园',
            user: '张三'
          }
        ], // table 数据
        total: 0
      }, //table 表头
      tloading: false, // 表格的loading
      curnPage: 1, // 当前页码
      sizePage: 5, // 当前一页多少条数
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
          console.log(res.data)
          this.platformOption = res.data
          this.platformOption = [{ value: '-1', label: '全部' }].concat(
            this.platformOption
          )
          console.log(this.platformOption)
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    changgeplatform() {
      //平台图表
      var nameList = this.tableData.data
      var legendData = []
      var seriesData = []
      var selected = {}
      var platformDate = []
      for (var i = 0; i < nameList.length; i++) {
        var count = 0
        name = nameList[i].platform
        for (var j = 0; j < nameList.length; j++) {
          if (nameList[i].platform === nameList[j].platform) {
            count++
          }
        }
        if (legendData.indexOf(name) == -1) {
          legendData.push(name)
          seriesData.push({
            name: name,
            value: count
          })
        }
        selected[name] = i < 6
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
            name: 'count量',
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
    changedate() {
      //日期图表
      var nameList = this.tableData.data
      var legendData = []
      var seriesData = []
      var selected = {}
      for (var i = 0; i < nameList.length; i++) {
        var count = 0
        name = nameList[i].date
        for (var j = 0; j < nameList.length; j++) {
          if (nameList[i].date === nameList[j].date) {
            count++
          }
        }
        if (legendData.indexOf(name) == -1) {
          legendData.push(name)
          seriesData.push({
            name: name,
            value: count
          })
        }
        selected[name] = i < 6
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
            name: 'count量',
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
      var legendData = []
      var seriesData = []
      var selected = {}
      for (var i = 0; i < nameList.length; i++) {
        var count = 0
        name = nameList[i].city
        for (var j = 0; j < nameList.length; j++) {
          if (nameList[i].city === nameList[j].city) {
            count++
          }
        }
        if (legendData.indexOf(name) == -1) {
          legendData.push(name)
          seriesData.push({
            name: name,
            value: count
          })
        }
        selected[name] = i < 6
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
            name: 'count量',
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
      this.axios
        .get('/apiweb/daily_report/SelectCityDily', {
          params: {
            starttime: moment(this.searchform.date[0]).format('YYYY-MM-DD'),
            endtime: moment(this.searchform.date[1]).format('YYYY-MM-DD'),
            businessId: this.searchform.businessId,
            platformId: this.searchform.platformId
          }
        })
        .then(res => {
          this.tableData.data = res.data.data
          this.tableData.total = this.tableData.data.length
          this.tloading = false
          this.changedate()
        })
        .catch(err => {
          console.log(err)
        })
    },
    /*页数*/
    handleSizeChange(val) {
      this.sizePage = val
    },
    /*页码*/
    handleCurrentChange(val) {
      this.curnPage = val
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
      this.dataSourcePie = echarts.init(
        document.getElementById('data_source_con')
      )
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


