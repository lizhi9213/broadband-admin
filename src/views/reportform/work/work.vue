<style lang="less">
@import url('./work.less');
</style>

<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="ios-browsers"></Icon>
        工单明细
      </p>
      <div>
        <Row class="field">
          <Col span="24">
          <Form :model="searchform" :rules="rulessearchform" ref="searchform" label-width="80px" class="demo-ruleForm" style="display:flex; flex-wrap:wrap;">
            <FormItem label="日期" prop="date">
              <DatePicker v-model="searchform.date" :clearable="false" value-format="yyyy-MM-dd" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
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
            <FormItem label="类型">
              <Select v-model="searchform.businessId" prop="businessId" placeholder="请选择类型">
                <Option v-for="item in businessOption" :key="item.value" :label="item.label" :value="item.value"></Option>
              </Select>
            </FormItem>
            <FormItem label="状态">
              <Select v-model="searchform.stateId" prop="stateId">
                <Option v-for="item in stateOption" :key="item.value" :label="item.label" :value="item.value"></Option>
              </Select>
            </FormItem>
            <FormItem label="关键字" prop="keyword">
              <Input v-model="searchform.keyword"></Input>
            </FormItem>
            <FormItem label="是否赔费" prop="payfor" style="width:240px;">
              <RadioGroup v-model="searchform.payfor">
                <Radio v-for="item in payforOption" :key="item.value" :label="item.label">{{item.name}}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="是否反馈" prop="feedback" style="width:240px;">
              <RadioGroup v-model="searchform.feedback">
                <Radio v-for="item in feedbackOption" :key="item.value" :label="item.label">{{item.name}}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="是否登记" prop="register" style="width:240px;">
              <RadioGroup v-model="searchform.register">
                <Radio v-for="item in registerOption" :key="item.value" :label="item.label">{{item.name}}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="是否充值" prop="recharge" style="width:240px;">
              <RadioGroup v-model="searchform.recharge">
                <Radio v-for="item in rechargeOption" :key="item.value" :label="item.label">{{item.name}}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="getTableData">筛选</Button>
              <Button @click="resetsearchform('searchform')">重置</Button>
            </FormItem>
          </Form>
          <el-tabs v-model="activeName2" type="border-card">
            <el-tab-pane label="报表分析" name="first">
              <el-table :border="true" stripe v-loading="tloading" height="560" :data="tableData.data" style="margin-bottom: 30px;">
                <template v-for="(col ,index) in cols">
                  <el-table-column v-if="col.type==='normal'" :prop="col.prop" :label="col.label"></el-table-column>
                </template>
              </el-table>
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="curnPage" background :page-sizes="[5, 10]" :page-size="sizePage" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
              </el-pagination>
            </el-tab-pane>
            <el-tab-pane label="图表分析" name="second">
              <el-button type="primary" @click="">日期</el-button>
              <el-button type="primary" @click="">平台</el-button>
              <el-button type="primary" @click="">地市</el-button>
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
  data() {
    return {
      activeName2: 'first', //table切换
      searchform: {
        //筛选信息表单
        date: '',
        platformId: '-1',
        city: '',
        businessId: '1',
        stateId: '1',
        payfor: '1',
        feedback: '1',
        register: '1',
        recharge: '1',
        keyword: ''
      },
      rulessearchform: {
        //筛选信息验证表单
        businessId: [
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
        { value: '1', label: '流量' },
        { value: '2', label: '套餐' }
      ], //取消类型下拉
      stateOption: [
        { value: '1', label: '完成' },
        { value: '0', label: '未完成' }
      ], //状态下拉
      payforOption: [{ name: '是', label: '1' }, { name: '否', label: '2' }], //是否赔费radio
      feedbackOption: [{ name: '是', label: '1' }, { name: '否', label: '2' }], //是否反馈radio
      registerOption: [{ name: '是', label: '1' }, { name: '否', label: '2' }], //是否登记radio
      rechargeOption: [{ name: '是', label: '1' }, { name: '否', label: '2' }], //是否充值radio
      cols: [
        { label: '日期', prop: 'date', type: 'normal' },
        { label: '平台', prop: 'platformId', type: 'normal' },
        { label: '地市', prop: 'city', type: 'normal' }
      ],
      tableData: {
        data: [
          {
            date: '2018-08-21',
            platformId: ' 科技园办事处',
            city: '开封'
          },
          {
            date: '2018-08-21',
            platformId: ' 科技园办事处',
            city: '郑州'
          },
          {
            date: '2018-08-21',
            platformId: ' 科技园办事处',
            city: '焦作'
          },
          {
            date: '2018-08-21',
            platformId: ' 科技园办事处',
            city: '洛阳'
          },
          {
            date: '2018-08-21',
            platformId: ' 科技园办事处',
            city: '新乡'
          },
          {
            date: '2018-08-21',
            platformId: ' 科技园办事处',
            city: '商丘'
          }
        ],
        total: 0
      },
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
          this.platformOption = res.data
          this.platformOption = [{ value: '-1', label: '全部' }].concat(
            this.platformOption
          )
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
    getTableHead() {
      this.axios
        .get('', {
          params: {}
        })
        .then(res => {
          this.cols = res.data
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getTableData() {
      this.tloading = true
      this.axios
        .get('/apiweb/daily_report/WorkDetails', {
          params: {
            starttime: moment(this.searchform.date[0]).format('YYYY-MM-DD'),
            endtime: moment(this.searchform.date[1]).format('YYYY-MM-DD'),
            businessId: this.searchform.businessId,
            platformId: this.searchform.platformId,
            city: this.searchform.city,
            stateId: this.searchform.stateId,
            payfor: this.searchform.payfor,
            feedback: this.searchform.feedback,
            register: this.searchform.register,
            recharge: this.searchform.recharge,
            keyword: this.searchform.keyword
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
    this.getTableHead()
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