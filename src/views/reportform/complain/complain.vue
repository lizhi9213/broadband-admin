<style lang="less">
// @import url('./complain.less');
// .el-table__expanded-cell[class*='cell'] {
//   padding: 10px 50px;
// }
</style>

<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="ios-browsers"></Icon>
        地市投诉率分析报表
      </p>
      <div>
        <Row class="filed">
          <Col span="24">
          <Form :model="searchform" :rules="rulessearchform" ref="searchform" label-width="80px" class="demo-ruleForm" style="display:flex;flex-wrap:wrap;">
            <FormItem label="日期" prop="date">
              <DatePicker v-model="searchform.date" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
              </DatePicker>
            </FormItem>
            <FormItem label="平台" prop="platformId">
              <Select v-model="searchform.platformId" placeholder="请选择平台">
                <Option v-for="item in platformOption" :key="item.value" :label="item.label" :value="item.value"></Option>
              </Select>
            </FormItem>
            <FormItem label="地市" prop="city">
              <Input v-model="searchform.city"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="getTableData">筛选</Button>
              <Button @click="resetsearchform('searchform')">重置</Button>
            </FormItem>
          </Form>
          <el-tabs v-model="activeName2" type="border-card">
            <el-tab-pane label="报表分析" name="first">
              <el-table :border="true" :default-expand-all="true" stripe v-loading="tloading" height="560" :data="tableData.data" style="margin-bottom: 30px;">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item v-for="(item,index) in props.row.tableDetail" :key="item.value">
                        <span slot="label">{{item.city}}</span>
                        <span>{{item.num}}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column label="日期" prop="date">
                </el-table-column>
                <el-table-column label="归属平台" prop="platform">
                </el-table-column>
                <el-table-column label="营销成功量" prop="marketing">
                </el-table-column>
                <el-table-column label="投诉总量" prop="complain">
                </el-table-column>
                <el-table-column label="投诉率" prop="complaintrate">
                </el-table-column>
              </el-table>
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="curnPage" background :page-sizes="[30, 50]" :page-size="sizePage" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
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
  name: 'complain',
  data() {
    return {
      activeName2: 'first', //table切换
      searchform: {
        //筛选信息表单
        date: [],
        platformId: '-1',
        city: ''
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
      tableData: {
        data: [], // table 数据
        total: 0
      }, //table 表头
      tloading: false, // 表格的loading
      curnPage: 1, // 当前页码
      sizePage: 30, // 当前一页多少条数
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
      var number = 0
      for (var i = 0; i < nameList.length; i++) {
        const name = nameList[i].date || '无'
        const num = nameList[i].complain
        const index = legendData.indexOf(name)
        if (index == -1) {
          legendData.push(name)
          seriesData.push({
            name: name,
            value: num
          })
          selected[name] = number < 6
          number++
        } else {
          seriesData[index].value = seriesData[index].value + num
        }
      }
      console.log(selected)
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
            name: '投诉量',
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
      var number = 0
      for (var i = 0; i < nameList.length; i++) {
        const name = nameList[i].platform || '无'
        const num = nameList[i].complain
        const index = legendData.indexOf(name)
        if (index == -1) {
          legendData.push(name)
          seriesData.push({
            name: name,
            value: num
          })
          selected[name] = number < 6
          number++
        } else {
          seriesData[index].value = seriesData[index].value + num
        }
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
            name: '投诉量',
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
      var number = 0
      for (var i = 0; i < nameList.length; i++) {
        for (var j = 0; j < nameList[i].tableDetail.length; j++) {
          const name = nameList[i].tableDetail[j].city
          const num = nameList[i].tableDetail[j].num
          const index = legendData.indexOf(name)
          if (index == -1) {
            legendData.push(name)
            seriesData.push({
              name: name,
              value: num
            })
            selected[name] = number < 6
            number++
          } else {
            seriesData[index].value = seriesData[index].value + num
          }
        }
      }
      console.log(legendData)
      console.log(seriesData)
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
            name: '投诉量',
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
    getTableData() {
      this.tloading = true
      this.axios
        .get('/apiweb/daily_report/CityComplaint', {
          params: {
            starttime: moment(this.searchform.date[0]).format('YYYY-MM-DD'),
            endtime: moment(this.searchform.date[1]).format('YYYY-MM-DD'),
            businessId: this.searchform.businessId,
            city: this.searchform.city
          }
        })
        .then(res => {
          this.tableData.data = res.data.data
          this.tableData.total = this.tableData.data.length
          this.tloading = false
          this.changgeplatform()
        })
        .catch(err => {
          console.log(err)
        })
    },
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

