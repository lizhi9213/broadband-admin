<style lang="less">
@import url('./complainnorm.less');
</style>

<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="ios-browsers"></Icon>
        投诉指标通报报表
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
              <el-table :summary-method="getSummaries" show-summary :border="true" stripe v-loading="tloading" height="400" :data="tableData.data" style="margin-bottom: 30px;">
                <el-table-column prop="date" label="日期" width="180">
                </el-table-column>
                <el-table-column prop="marketcount" label="营销成功量">
                </el-table-column>
                <el-table-column prop="complaincount" label="投诉总量">
                </el-table-column>
                <el-table-column prop="payforcount" label="赔费数量">
                </el-table-column>
                <el-table-column prop="payformoney" label="赔费金额">
                </el-table-column>
                <el-table-column prop="marketratio" label="营销投诉率">
                </el-table-column>
                <el-table-column prop="payforcost" label="赔费成本">
                </el-table-column>
                <el-table-column prop="payforratio" label="赔费率">
                </el-table-column>
                <el-table-column prop="echocomplaincount" label="重复投诉量">
                </el-table-column>
                <el-table-column prop="echocomplainratio" label="重复投诉率">
                </el-table-column>
              </el-table>
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
  name: 'complainnorm',
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
        data: [
          {
            date: '2018-8-21',
            marketcount: '234',
            complaincount: '3.2',
            payforcount: 10,
            payformoney: '10',
            marketratio: '12',
            payforcost: '15',
            payforratio: '51',
            echocomplaincount: '456',
            echocomplainratio: '45'
          },
          {
            date: '2018-8-21',
            marketcount: '234',
            complaincount: '3.2',
            payforcount: 10,
            payformoney: '10',
            marketratio: '12',
            payforcost: '15',
            payforratio: '51',
            echocomplaincount: '456',
            echocomplainratio: '45'
          },
          {
            date: '2018-8-21',
            marketcount: '234',
            complaincount: '3.2',
            payforcount: 10,
            payformoney: '10',
            marketratio: '12',
            payforcost: '15',
            payforratio: '51',
            echocomplaincount: '456',
            echocomplainratio: '45'
          },
          {
            date: '2018-8-21',
            marketcount: '234',
            complaincount: '3.2',
            payforcount: 10,
            payformoney: '10',
            marketratio: '12',
            payforcost: '15',
            payforratio: '51',
            echocomplaincount: '456',
            echocomplainratio: '45'
          }
        ]
      },
      tloading: false //表格的loading
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
        .get('/apiweb/daily_report/ComplaintBulletin', {
          params: {
            starttime: moment(this.searchform.date[0]).format('YYYY-MM-DD'),
            endtime: moment(this.searchform.date[1]).format('YYYY-MM-DD'),
            businessId: this.searchform.businessId,
            platformId: this.searchform.platformId,
            city: this.searchform.city
          }
        })
        .then(res => {
          this.tableData.data = res.data.data
          this.tloading = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ''
        } else {
          sums[index] = 'N/A'
        }
      })
      console.log(sums)
      sums[5] = sums[2] / sums[1] * 100
      sums[5] = sums[5].toFixed(2) + '%'
      sums[7] = sums[3] / sums[1] * 100
      sums[7] = sums[7].toFixed(2) + '%'
      sums[9] = sums[8] / sums[1] * 100
      sums[9] = sums[9].toFixed(2) + '%'
      return sums
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
      // this.dataSourcePie = echarts.init(
      //   document.getElementById('data_source_con')
      // )
      // window.addEventListener('resize', function() {
      //   dataSourcePie.resize()
      // })
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

