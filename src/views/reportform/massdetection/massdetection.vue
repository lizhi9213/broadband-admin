<style lang="less">
@import url('./massdetection.less');
</style>

<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="ios-browsers"></Icon>
        质检通报报表
      </p>
      <div>
        <Row class="field">
          <Col span="24">
          <Form :model="searchform" :rules="rulessearchform" ref="searchform" label-width="80px" class="demo-ruleForm" style="display:flex;flex-wrap:wrap;">
            <FormItem label="日期" prop="date">
              <DatePicker v-model="searchform.date" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
              </DatePicker>
            </FormItem>
            <FormItem label="平台" prop="platformId">
              <Select v-model="searchform.platformId" placeholder="请选择平台">
                <el-option v-for="item in platformOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </Select>
            </FormItem>
            <FormItem label="质检员工" prop="staff">
              <Input v-model="searchform.staff"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="getTableData">筛选</Button>
              <Button @click="resetsearchform('searchform')">重置</Button>
            </FormItem>

          </Form>
          <el-tabs v-model="activeName2" type="border-card">
            <el-tab-pane label="报表分析" name="first">
              <Table :border="true" stripe :columns="columns1" v-loading="tloading" height="400" :data="tableData.data" style="margin-bottom: 30px;">
              </Table>
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="curnPage" background :page-sizes="[30, 50]" :page-size="sizePage" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
              </el-pagination>
            </el-tab-pane>
          </el-tabs>

          </Col>
        </Row>
      </div>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'massdetection',
  data() {
    return {
      activeName2: 'first', //table切换
      searchform: {
        //筛选信息表单
        date: [],
        platformId: '-1',
        staff: ''
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
          title: '日期',
          key: 'date'
        },
        {
          title: '归属平台',
          key: 'platform'
        },
        {
          title: '成功总量',
          key: 'succount'
        },
        {
          title: '抽听条数',
          key: 'extract'
        },
        {
          title: '抽听率',
          key: 'extractratio'
        },
        {
          title: '合格条数',
          key: 'qualifiedcount'
        },
        {
          title: '合格率',
          key: 'qualifiedratio'
        },
        {
          title: '业务差错',
          key: 'mistake'
        },
        {
          title: '差错比例',
          key: 'mistakeratio'
        },
        {
          title: '私开条数',
          key: 'privately'
        },
        {
          title: '私开比例',
          key: 'privatelyratio'
        },
        {
          title: '服务差错',
          key: 'sermistake'
        },
        {
          title: '服务比例',
          key: 'serratio'
        }
      ],
      tableData: {
        data: [
          {
            date: '2018-08-30',
            platform: '移动',
            succount: '123456',
            extract: '12',
            extractratio: '0.5',
            qualifiedcount: '30',
            qualifiedratio: '0.8',
            mistake: '12',
            mistakeratio: '0.5',
            privately: '30',
            privatelyratio: '0.3',
            sermistake: '88',
            serratio: '0.5'
          }
        ], // table 数据
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
        .get('/apiweb/daily_report/SelectCityDily', {
          params: {
            starttime: moment(this.searchform.date[0]).format('YYYY-MM-DD'),
            endtime: moment(this.searchform.date[1]).format('YYYY-MM-DD'),
            businessId: this.searchform.businessId,
            platformId: this.searchform.platformId,
            staff: this.searchform.staff
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
    // this.getTableData()
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

