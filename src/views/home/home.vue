<style lang="less">
@import './home.less';
</style>
<template>
    <div class="home-main">
        <Row :gutter="10">
            <Col span="24">
            <Row :gutter="20">
                <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                <infor-card id-name="user_created_count" :end-val="count.today" iconType="icon-gongdan" color="#2d8cf0" intro-text="今日工单量"></infor-card>
                </Col>
                <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                <infor-card id-name="visit_count" :end-val="count.incoming" iconType="icon-huru" color="#64d572" intro-text="呼入量"></infor-card>
                </Col>
                <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                <infor-card id-name="collection_count" :end-val="count.answer" iconType="icon-dianhua2" color="#ffd572" intro-text="接听量"></infor-card>
                </Col>
                <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                <infor-card id-name="transfer_count" :end-val="count.answerRate" iconType="icon-xiaolv" unit="%" color="#f25e43" intro-text="接听率"></infor-card>
                </Col>
            </Row>
            </Col>
            <Col span="24">
            <Row>
                <Card :padding="0">
                    <p slot="title" class="card-title">
                        <Icon type="map"></Icon>
                        区域工单量当日分析
                    </p>
                    <div class="map-con">
                        <Col span="10">
                        <map-data-table :cityData="cityData" height="281" :style-obj="{margin: '12px 0 0 11px'}" :tloading="tableLoading"></map-data-table>
                        </Col>
                        <Col span="14" class="pic-content">
                        <pie-charts v-if="pieData.data.length !== 0 || pieData.pdata.length !== 0" :chartData="pieData"></pie-charts>
                        <p style="margin-top: 100px; text-align: center;" v-if="pieData.data.length === 0 && pieData.pdata.length === 0">{{pieLoading ? '加载中...' : '暂无数据'}}</p>
                        </Col>
                    </div>
                </Card>
            </Row>
            </Col>
            <Col span="24" style="margin-top: 14px;">
            <Card :padding="0">
                <p slot="title" class="card-title">
                    <Icon type="ios-pulse-strong"></Icon>
                    宽带区域故障分析
                </p>
                <div class="bar-content">
                    <analyze-bar :chart-data="faultData" v-if="faultData.vData.length !== 0 || faultData.xData.length !== 0"></analyze-bar>
                    <p style="margin-top: 60px; text-align: center;" v-if="faultData.vData.length === 0 && faultData.xData.length === 0">{{barLoading ? '加载中...' : '暂无数据'}}</p>
                </div>
            </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import inforCard from './components/inforCard.vue'
import mapDataTable from './components/mapDataTable.vue'
import analyzeBar from './components/analyzeBar.vue'
import pieCharts from './components/pieCharts.vue'
import Vue from 'vue'
export default {
  name: 'home02',
  components: {
    inforCard,
    mapDataTable,
    analyzeBar,
    pieCharts
  },
  data() {
    return {
      count: {
        today: 0,
        incoming: 0,
        answer: 0,
        answerRate: 0
      },
      barLoading: false,
      pieLoading: false,
      faultData: {
        vData: [],
        xData: []
      },
      cityData: [], // 中间table表格数据
      pieData: {
        data: [], // 外圈
        pdata: [] //内圈
      },
      tableLoading: false
    }
  },
  methods: {
    initStatistical() {
      this.axios
        .get('/apiweb/report/home/top')
        .then(res => {
          //   console.log(res.data)
          this.count = res.data
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    initAnalyze() {
      const _this = this
      this.barLoading = true
      this.axios
        .get('/apiweb/report/home/area')
        .then(res => {
          //   console.log(res.data)
          const obj = {
            vData: [],
            xData: []
          }
          res.data.forEach(item => {
            obj.xData.push(item.areaName)
            obj.vData.push(item.count)
          })
          // 将处理过的图表数据传入
          _this.$nextTick(() => {
            _this.faultData = obj
            _this.barLoading = false
          })
        })
        .catch(function(err) {
          console.log(err)
          _this.barLoading = false
        })
    },
    initAreaData() {
      // 区域data数据
      const _this = this
      this.tableLoading = true
      this.pieLoading = true
      this.axios
        .get('/apiweb/report/home/area/today')
        .then(res => {
          // console.log(res.data)
          res.data.data.forEach(item => {
            const obj1 = {
              name: item.areaName,
              value: item.count
            }
            _this.cityData.push(obj1)
          })
          //   res.data.pdata.forEach(item => {
          //     const obj2 = {
          //       name: item.areaName,
          //       value: item.count
          //     }
          //     _this.cityData.push(obj2)
          //   })
          _this.$nextTick(() => {
            _this.tableLoading = false
            _this.pieData = res.data
            _this.pieLoading = false
          })
        })
        .catch(function(err) {
          console.log(err)
          _this.$nextTick(() => {
            _this.tableLoading = false
            _this.pieLoading = false
          })
        })
    }
  },
  mounted() {
    // 顶部数据获取
    this.initStatistical()
    // 工单量分析初始化
    this.initAnalyze()
    // 当日工单量初始化
    this.initAreaData()
  }
}
</script>
