<style lang="less">
@import url('./hotline.less');
</style>

<template>
    <div class="container">
        <Row :gutter="18">
            <Col span="5">
            <Card dis-hover :style="{minHeight: cardHeight + 'px'}" style="overflow: hidden; overflow-y: auto;">
                <ul class="customer">
                    <li class="cust-title"><span class="label">宽带信息</span></li>
                    <li class="cust-item" v-for="(item, index) in custData" :key="index+12" v-if="item.key !== 'id' && item.key !== 'workid' && item.key !== 'custid' && item.key !== 'kd_other'">
                        <span class="label">{{item.name}}：</span>
                        <span>{{item.value}}</span>
                    </li>
                    <li v-if="custData.length === 0" class="cust-item" :class="{'error': noMsg !== ''}">{{noMsg === '' ? '请通过宽带账号或手机号来查询显示宽带信息' : noMsg}}</li>
                </ul>
            </Card>
            </Col>
            <Col span="19">
            <Card dis-hover>
                <Row :gutter="18" class="head-card">
                    <Col span="12">
                    <h4 class="title">来电号码</h4>
                    <div class="phone-number">
                        <span class="number">{{inPhone}}</span>
                        <span class="timer">{{timing}}</span>
                    </div>
                    <div class="phone-btn"><Button size="large" icon="ios-telephone" @click="cutLine">挂断</Button></div>
                    </Col>
                    <Col span="12">
                    <h4 class="title">沟通内容</h4>
                    <div class="comm-content">
                        <Input v-model="matter" type="textarea" :rows="4" placeholder="请填写沟通内容"></Input>
                        <Button type="primary" @click="addRecord">提交</Button>
                    </div>
                    </Col>
                    <Col span="24">
                    <Tabs v-model="tabsVal">
                        <TabPane label="工单信息" name="tab1"></TabPane>
                        <TabPane label="历史工单" name="tab2"></TabPane>
                        <TabPane label="来电记录" name="tab3"></TabPane>
                    </Tabs>
                    </Col>
                </Row>
            </Card>
            <Card dis-hover style="margin-top: 16px;">
                <Tabs v-model="tabsVal" class="hide-tabsbar">
                    <TabPane label="工单信息" name="tab1">
                        <Form ref="orders" class="order-form" :model="formorder" :rules="ruleOrder" :label-width="120">
                            <Row>
                                <Col class="list-item" v-for="(n,i) in itemData" :key="i + 3.26" :span="(n.FieldType === 'group' || n.FieldType === 'textarea') ? 24 : 12">
                                <FormItem v-if="n.FieldType !== 'group'" :label="n.FieldName + '：'" :prop="n.FieldId">
                                    <Input v-if="n.FieldType == 'input' || n.FieldType == 'number'　|| n.FieldType == 'regular'　|| n.FieldType == 'url'　|| n.FieldType == 'tel'　|| n.FieldType == 'phone'　|| n.FieldType == 'ip'　|| n.FieldType == 'email'" :placeholder="'请填写' + n.FieldName" v-model="formorder[n.FieldId]">
                                    <Button v-if="n.SysField === 'webAccount' || n.SysField === 'custPhone'" slot="append" title="点击查询客户信息" icon="ios-search" :loading="searchLoading" @click="getCustDetail(n.FieldId)"></Button>
                                    </Input>
                                    <Input v-if="n.FieldType == 'textarea'" type="textarea" :autosize="{minRows: 4,maxRows: 20}" :placeholder="'请填写' + n.FieldName" v-model="formorder[n.FieldId]"></Input>
                                    <RadioGroup v-if="n.FieldType == 'radio'" v-model="formorder[n.FieldId]">
                                        <Radio v-for="(k,j) in n.options" :key="j + 2.56" :label="j + ''">{{k.value}}</Radio>
                                    </RadioGroup>
                                    <CheckboxGroup v-if="n.FieldType == 'checkbox'" v-model="formorder[n.FieldId]">
                                        <Checkbox v-for="(g,h) in n.options" :key="h + 6.26" :label="h + ''">{{g.value}}</Checkbox>
                                    </CheckboxGroup>
                                    <Select v-if="n.FieldType == 'select'" v-model="formorder[n.FieldId]" :placeholder="'请选择' + n.FieldName">
                                        <Option v-for="(d,f) in n.options" :key="f + 6.26" :value="f + ''">{{d.value}}</Option>
                                    </Select>
                                    <Select v-if="n.FieldType == 'multipleselect'" multiple v-model="formorder[n.FieldId]" :placeholder="'请选择' + n.FieldName">
                                        <Option v-for="(d,f) in n.options" :key="f + ''" :value="f + ''">{{d.value}}</Option>
                                    </Select>
                                    <Cascader v-if="n.FieldType == 'cascader'" :data="n.options" v-model="formorder[n.FieldId]"></Cascader>
                                    <DatePicker v-if="n.FieldType == 'time' ||　n.FieldType == 'timerange'　" :format="n.Checked === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm'" :type="n.Checked" :placeholder="'请选择' + n.FieldName" v-model="formorder[n.FieldId]" style="width: 100%;"></DatePicker>
                                    <span v-if="n.SysField === 'dealLine' || n.SysField === 'workLine'" style="width: 40px; padding-left: 10px;">小时</span>
                                    <Select v-if="n.FieldType == 'community'" v-model="formorder[n.FieldId]" filterable remote :remote-method="communityMethod" @on-change="communitySelDone" placeholder="请选择所属小区">
                                        <Option v-for="item in communityData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </FormItem>
                                <div v-if="n.FieldType === 'group'" class="item-group">
                                    <label class="group-label">{{n.FieldName}}：</label>
                                    <div class="group-content">
                                        <FormItem :error="orgError">
                                            <Select ref='classRef' v-model="formorder['176']" filterable @on-change="classSelDone" placeholder="请选择代维公司">
                                                <Option v-for="item in classData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                            </Select>
                                        </FormItem>
                                        <FormItem :error="orgError">
                                            <Select ref='groupRef' v-model="formorder['177']" filterable placeholder="请选择代维班组">
                                                <Option v-for="item in groupData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                            </Select>
                                        </FormItem>
                                    </div>
                                </div>
                                </Col>
                            </Row>
                            <FormItem>
                                <Button type="success" class="submit-form-btn" :loading="saveLoading" @click="submitForm">保存并提交</Button>
                            </FormItem>
                        </Form>
                    </TabPane>
                    <TabPane label="历史工单" name="tab2">
                        <Row :gutter="14" class="history-order">
                            <Col span="12" v-for="(item, index) in hisList" :key="index+2">
                            <Card class="box-card">
                                <ul class="order-item" @click="viewDetail(item.id)">
                                    <li class="item-li">工单编号：{{item.code}}</li>
                                    <li class="item-li">工单状态： {{item.status}}</li>
                                    <li class="item-li">宽带账号： {{item.webAccount}}</li>
                                    <li class="item-li">故障类型： {{item.faultType}}</li>
                                    <li class="item-li">故障现象： {{item.faultMemo}}</li>
                                    <li class="item-li" style="width: 100%;">派单机构： {{item.area}}</li>
                                    <li class="item-li" style="width: 100%;"><span>查看详情 >></span></li>
                                </ul>
                                <span class="label"><img src="/src/images/label.png" alt=""></span>
                            </Card>
                            </Col>
                            <Col span="24" class="loading-box" v-if="hisList.length === 0">
                            <p v-if="hisLoading" class="tips">加载中...</p>
                            <p v-if="!hisLoading" class="tips">暂无数据</p>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane label="来电记录" name="tab3">
                        <Table :columns="tableColumns" :data="recordData" height="420"></Table>
                        <div style="text-align: right; padding-right: 14px; padding-top: 20px;">
                            <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[30, 60, 90, 120]" :page-size="nowSize" layout="total, sizes, prev, pager, next, jumper" :total="sumTotal">
                            </el-pagination>
                        </div>
                    </TabPane>
                </Tabs>
            </Card>
            </Col>
        </Row>
        <Modal v-model="choseLine" title="请选择一条宽带信息" width="920" class-name="none-footer-order">
            <ul class="cust-list">
                <li class="list-item" v-for="(item, index) in custList" :key="index" :class="{checked: checkIndex === index}" @click="checkItem(index)">
                    <div class="cust-item" v-for="(info, list) in item" :key="list+12" v-if="info.key !== 'id' && info.key !== 'workid' && info.key !== 'custid' && info.key !== 'kd_other'">
                        <span class="label">{{info.name}}：</span>
                        <span>{{info.value}}</span>
                    </div>
                    <span class="item-label">
                        <Icon type="checkmark-round" size="16"></Icon>
                    </span>
                </li>
            </ul>
        </Modal>
        <Modal v-model="startPlayer" title="播放录音" width="620" class-name="none-footer-order">
            <aplayer @canplay="playAplayer" :music="songList" :mini="false" repeat="no-repeat" ref="player" theme="#b7daff" />
        </Modal>
        <div v-show="false">
            {{showPopData}}
        </div>
    </div>
</template>

<script>
import Aplayer from 'vue-aplayer'
const Cookies = require('js-cookie')
import { dealFrom, dealData } from '../workorder/tool.js'
import { getCust, saveCust, hangUp } from '@/api/other.js'
import {
  getClassCombo,
  getGroupCombo,
  getCommunityCombo,
  getCommunityDetail
} from '@/api/combox.js'
export default {
  name: 'hotline',
  computed: {
    showPopData: function() {
      this.popData = this.$store.state.app.popData
      return this.$store.state.app.popData
    }
  },
  watch: {
    popData(data) {
      console.log(data)
      const vm = this
      if (data.callcode) {
        if (vm.inCallCode != data.callcode) {
          // 切换号码
          vm.inPhone = data.phone
          vm.inCallCode = data.callcode
          vm.cansave = false
          vm.initRecord()
          vm.getHistoryOrder()
          const phonefield = vm.fieldData.find(v => v.SysField === 'custPhone')
          if (phonefield) {
            vm.formorder[phonefield.FieldId] = vm.inPhone
          }
        }
      }
      if (data.extstatus == 1) {
        // 振铃
        vm.startTimer(data.extdate)
        vm.cansave = false
      } else if (data.extstatus == 2) {
        // 通话中
        if (data.callstatus === 2) {
          vm.callOut()
        }
        vm.startTimer(data.extdate)
        vm.cansave = false
      } else {
        // 空闲
        vm.stopTimer()
        vm.cansave = true
      }
    },
    startPlayer(val) {
      if (!val) {
        this.$refs.player.pause()
      }
    }
  },
  components: {
    Aplayer
  },
  data() {
    return {
      cardHeight: 500, // card高度
      saveLoading: false, // 保存loading
      custData: [], // 展示的宽带数据
      custList: [], // 宽带列表
      noMsg: '', // 左侧宽带信息未获取到提示
      matter: '', // 沟通内容
      tabsVal: 'tab1', // tabs的modal切换
      formorder: {}, // 表单modal数据
      ruleOrder: {}, // 表单验证规则
      fieldData: [], // 工单表单字段列表
      itemData: [], // 处理完所属组织后的全部字段数据
      areaData: [], // 所属区域级联数据
      orgList: [], // 所属组织列表
      gridList: [], // 网格列表
      classData: [], // 代维公司信息
      groupData: [], // 代维班组信息
      communityData: [], // 小区信息
      AccountId: '', // 宽带账号在字段中的id
      PhoneId: '', // 宽带账号在字段中的id
      choseLine: false, // 选择宽带弹出开关
      checkIndex: -1, // 当前选择的序号
      searchLoading: false,
      timing: '00:00', // 页面计时
      clock: 0, // 程序计时
      timerId: '', // 间歇定时器id存放
      popData: {},
      orderId: '', // 工单id
      inCallCode: '',
      inPhone: '',
      tableColumns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '来电时间',
          key: 'createtime'
        },
        {
          title: '来电号码',
          key: 'phonenum'
        },
        {
          title: '来电录音',
          key: 'recordfile',
          align: 'center',
          width: 200,
          render: (h, params) => {
            const _this = this
            if (
              params.row.recordfile !== '' &&
              params.row.recordfile !== null
            ) {
              return h('div', [
                h('span', {
                  class: {
                    iconfont: true,
                    'icon-bofang': true
                  },
                  style: {
                    marginRight: '14px',
                    cursor: 'pointer',
                    fontSize: '22px',
                    fontWeight: '600'
                  },
                  on: {
                    click() {
                      // console.log(params.row) // 单行数据
                      _this.playMp3(params.row.recordfile, '焦作中移铁通')
                    }
                  }
                })
              ])
            } else {
              return h('span', '无')
            }
          }
        }
      ], // table表头
      recordData: [], // table数据
      cansave: false,
      currentPage: 1, // 当前页码
      sumTotal: 0, // 总条数
      nowSize: 30, // 当前一页显示多少条
      startPlayer: false, // 开始播放
      songList: {
        src: 'https://moeplayer.b0.upaiyun.com/aplayer/snowmoonflowers',
        title: '暂无',
        artist: '暂无',
        pic: '/static/img/td_icon.ico'
      }, // 录音播放列表
      hisList: [], // 历史工单列表
      hisLoading: false, // 历史工单loading
      orgError: '' // 派单机构错误信息
    }
  },
  methods: {
    callOut() {
      //  签出
      this.axios
        .post('/apiwss/system/signOut', {
          id: Cookies.get('yh_web_UserCode'),
          comId: Cookies.get('yh_web_ComCode')
        })
        .then(res => {})
        .catch(function(err) {
          console.log(err)
        })
    },
    callIn() {
      this.axios
        .post('/apiwss/system/signIn', {
          id: Cookies.get('yh_web_UserCode'),
          comId: Cookies.get('yh_web_ComCode')
        })
        .then(res => {
          if (res.data) {
            this.$message.success(res.data.msg)
          }
        })
        .catch(function(err) {
          // console.log(err)
        })
    },
    getCustDetail(id) {
      // keynum: 手机号码,或者宽带账号
      const _this = this
      this.searchLoading = true
      this.noMsg = ''
      this.checkIndex = -1
      // this.custData = []
      this.custList = []
      let keynum = this.formorder[id] // 测试号码
      keynum = keynum.replace(/\s+/g, '')
      this.$Spin.show({
        render: h => {
          return h('div', [
            h('Icon', {
              class: 'demo-spin-icon-load',
              props: {
                type: 'load-c',
                size: 18
              }
            }),
            h('div', '正在查询，请稍等...')
          ])
        }
      })
      // 获取所属区域列表
      getCust(keynum)
        .then(res => {
          console.log(res.data)
          const data = res.data
          let rows = [] // 宽带数据
          if (data.code === 0) {
            // 成功
            // 返回rows为数组,如果rows长度为1,取第一条数据,如rows长度大于1,弹出选框,选择宽带信息
            rows = data.data
            console.log(JSON.stringify(rows))
            _this.custList = data.data
            if (rows.length > 1) {
              // 多条数据，需要让用户选择
              _this.choseLine = true
              _this.searchLoading = false
            } else {
              // 单条数据，直接渲染用户信息
              _this.$nextTick(() => {
                _this.custData = rows[0]
                _this.formRepalce()
                _this.searchLoading = false
                _this.$Spin.hide()
              })
            }
            // _this.choseLine = true
          } else {
            // 没有客户信息
            _this.noMsg = '未获取到宽带信息'
            _this.searchLoading = false
            _this.$Spin.hide()
          }
        })
        .catch(function(err) {
          console.log(err)
          _this.searchLoading = false
          _this.noMsg = '未知错误'
          _this.$Spin.hide()
        })
    },
    saveCustDetail(workid, custdata) {
      // keynum: 手机号码,或者宽带账号
      const _this = this
      data.workid = workid // 工单保存的workid
      data.data = custdata // get获取的客户信息
      // 获取所属区域列表
      saveCust(data)
        .then(res => {
          console.log(res.data)
          const data = res.data
          if (data.code) {
            // 成功
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    initOrderForm() {
      // 初始化全部表单字段
      const _this = this
      this.axios
        .get('/apiweb/work/WorkListForm', {
          FlagId: 1
        })
        .then(res => {
          // console.log(JSON.stringify(res.data))
          _this.fieldData = res.data
          // 处理所属组织
          _this.extract()
          // 生成表单data数据和校验规则
          let nowFileData = JSON.parse(JSON.stringify(res.data))
          _this.formorder = dealFrom(nowFileData)[0]
          _this.ruleOrder = dealFrom(nowFileData)[1]
          if (_this.inPhone) {
            const phonefield = _this.fieldData.find(
              v => v.SysField === 'custPhone'
            )
            _this.formorder[phonefield.FieldId] = _this.inPhone
          }
          // 区域级联下拉初始化
          _this.getAreaList()
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getClassData() {
      // 获取代维公司信息
      const _this = this
      getClassCombo('concat', '')
        .then(res => {
          //   console.log(res.data)
          const data = res.data
          if (data) {
            // 成功
            _this.classData = data
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getGroupData(id, code) {
      // 获取代维班组信息
      const _this = this
      _this.groupData = []
      _this.formorder['177'] = ''
      getGroupCombo('concat', id, '')
        .then(res => {
          //   console.log(res.data)
          const data = res.data
          if (data) {
            // 成功
            _this.groupData = data
            if (code) {
              _this.formorder['177'] = code
            }
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getCommunityData() {
      // 获取小区信息
      const _this = this
      getCommunityCombo('', 10)
        .then(res => {
          //   console.log(res.data)
          const data = res.data
          if (data) {
            // 成功
            _this.communityData = data
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    classSelDone(val) {
      // 代维公司选择事件
      this.getGroupData(val)
    },
    communityMethod(val) {
      // 获取小区信息
      const _this = this
      getCommunityCombo(val)
        .then(res => {
          //   console.log(res.data)
          const data = res.data
          if (data) {
            // 成功
            _this.communityData = data
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    communitySelDone(val) {
      // 小区选择事件   获取小区详细信息--代维公司、班组、时限
      const _this = this
      getCommunityDetail(val)
        .then(res => {
          //   console.log(res.data)
          const data = res.data
          if (data) {
            // 成功
            _this.$refs.classRef[0].setQuery('')
            _this.formorder['176'] = data.ClassCode
            // _this.formorder['177'] = data.GroupCode
            this.getGroupData(data.ClassCode, data.GroupCode)
            if (data.Attributes === '城市' || data.Attributes === '主城区') {
              _this.formorder['180'] = '24'
              _this.formorder['185'] = '8'
            } else {
              _this.formorder['180'] = '48'
              _this.formorder['185'] = '12'
            }
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    initRecord() {
      // 获取来电记录数据
      const _this = this
      this.axios
        .get('/apiweb/work/callhis', {
          params: {
            phone: _this.inPhone,
            index: _this.currentPage,
            limit: _this.nowSize
          }
        })
        .then(res => {
          console.log(res.data)
          // console.log(JSON.stringify(res.data))
          _this.recordData = res.data.data
          _this.currentPage = 1 // 当前页码
          _this.sumTotal = 0 // 总条数
          _this.nowSize = 30
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getHistoryOrder() {
      // 获取历史工单
      const _this = this
      this.hisLoading = true
      // 获取所属区域列表
      this.axios
        .get('/apiweb/work/workorder/history', {
          params: {
            custPhone: _this.inPhone // 客户电话
            // custPhone: '13608631967' // 客户电话
          }
        })
        .then(res => {
          // console.log(JSON.stringify(res.data))
          _this.hisList = res.data
          _this.hisLoading = false
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    viewDetail(id) {
      // 查看详情
      this.$router.push('/orderdetail/' + id)
    },
    getAreaList() {
      const _this = this
      // 获取所属区域列表
      this.axios
        .get('/apiweb/area/combox/cascade/', {
          keyWord: ''
        })
        .then(res => {
          // console.log(JSON.stringify(res.data))
          _this.areaData = res.data
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getOrgList(id) {
      const _this = this
      // 先清空之前的数据
      this.orgList = []
      this.formorder['176'] = ''
      // 获取所属组织下拉列表
      this.axios
        .get('/apiweb/class/combox/select/', {
          params: {
            keyWord: '',
            areaId: id
          }
        })
        .then(res => {
          // console.log(JSON.stringify(res.data))
          _this.orgList = res.data
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getGridList(id) {
      const _this = this
      // 先清空之前的数据
      this.gridList = []
      this.formorder['177'] = ''
      // 获取所属组织下拉列表
      this.axios
        .get('/apiweb/class/group/combox/select/', {
          params: {
            keyWord: '',
            classId: id
          }
        })
        .then(res => {
          // console.log(JSON.stringify(res.data))
          _this.gridList = res.data
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    areaSelDone(val, data) {
      // 区域级联选择完毕回调
      // console.log(val)
      // console.log(data)
      const nowId = val[val.length - 1]
      this.getOrgList(nowId)
    },
    orgSelDone(val) {
      // 所属组织下拉选择完毕
      // console.log(val)
      this.getGridList(val)
    },
    gridDone(val) {
      // 检查是否三项都选择了
      this.checkOrg()
      if (this.checkOrg()) {
        this.orgError = ''
      }
    },
    checkOrg() {
      this.orgError = ''
      if (
        this.formorder['175'] !== '' &&
        this.formorder['176'] !== '' &&
        this.formorder['177'] !== ''
      ) {
        return true
      } else {
        this.orgError = '请将派单机构选择完整'
        return false
      }
    },
    checkItem(index) {
      // 选择客户信息
      const _this = this
      this.checkIndex = index
      this.custData = this.custList[index]
      this.formRepalce()
      // 将获取到的宽带账号和电话赋值给表单
      setTimeout(function() {
        _this.choseLine = false
      }, 500)
    },
    formRepalce() {
      //   const accData = this.custData.find(v => {
      //     return v.key === 'kd_account'
      //   })
      //   const telData = this.custData.find(v => {
      //     return v.key === 'kd_phone'
      //   })
      //   console.log(accData)
      //   console.log(telData)
      //   this.formorder[this.AccountId] = accData.value
      //   if (this.formorder[this.PhoneId] === '') {
      //     this.formorder[this.PhoneId] = telData.value
      //   }
      const _this = this
      this.custData.map(v => {
        if (v.value) {
          if (v.key === 'kd_account') {
            _this.formorder[this.AccountId] = v.value
          } else if (v.key === 'kd_phone') {
            _this.formorder[this.PhoneId] = v.value
          } else if (v.key === 'kd_intime') {
            if (!_this.formorder['148']) {
              _this.formorder['148'] = v.value
            }
          } else if (v.key === 'kd_name') {
            if (!_this.formorder['152']) {
              _this.formorder['152'] = v.value
            }
          } else if (v.key === 'kd_mana') {
            if (!_this.formorder['153']) {
              _this.formorder['153'] = v.value
            }
          } else if (v.key === 'kd_manaphone') {
            if (!_this.formorder['154']) {
              _this.formorder['154'] = v.value
            }
          } else if (v.key === 'kd_addr') {
            if (!_this.formorder['155']) {
              _this.formorder['155'] = v.value
            }
          }
        }
      })
    },
    extract() {
      // 字段筛选分类
      const _this = this
      let flag = false
      this.fieldData.forEach(info => {
        // 继续筛选出所属机构分组
        if (info.FieldType !== 'other') {
          _this.itemData.push(info)
        } else if (!flag) {
          _this.itemData.push({
            IsSys: -1,
            Checked: '-1',
            FieldId: '-1',
            IsWrite: -1,
            Regular: '',
            SysField: 'group',
            FieldName: '派单机构',
            FieldType: 'group'
          })
          flag = true
        }
        // 保存宽带账号和电话id
        if (info.SysField === 'webAccount') {
          _this.AccountId = info.FieldId // 宽带账号在字段中的id
        }
        if (info.SysField === 'custPhone') {
          _this.PhoneId = info.FieldId // 宽带账号在字段中的id
        }
      })
    },
    playAplayer() {
      this.$refs.player.play()
    },
    playMp3(file, user) {
      // 播放录音
      // console.log(file)
      if (file) {
        const last = file.lastIndexOf('/')
        const name = file.substring(last + 1)
        const obj = {
          title: name, // 歌曲名称
          artist: user, // 演唱者
          src: file, // 音频文件的 URL 必填
          pic: '/static/img/td_icon.ico' // 封面图片 URL
        }
        this.songList = obj // 播放文件加载到播放列表
        this.startPlayer = true // 显示播放器
      }
    },
    cutLine() {
      // 清除定时器
      this.cleraTimer()
      // 挂断电话
      this.hangUpNow()
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.nowSize = val
      this.initTable()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.currentPage = val
      this.initTable()
    },
    startTimer(start) {
      // 复位计时器
      this.cleraTimer()
      // 开始计时器
      const _this = this
      _this.clock = start + 1
      let minute = 0
      let seconds = 0
      this.timerId = window.setInterval(function() {
        minute = 0
        seconds = 0
        if (_this.clock >= 60) {
          minute = parseInt(_this.clock / 60)
          seconds = _this.clock % 60
        } else {
          seconds = _this.clock
        }
        if (minute < 10) {
          minute = '0' + minute
        }
        if (seconds < 10) {
          seconds = '0' + seconds
        }
        _this.timing = minute + ':' + seconds
        _this.clock += 1
        // console.log(_this.timing)
      }, 1000)
    },
    stopTimer() {
      const _this = this
      if (_this.timerId !== '') {
        window.clearInterval(_this.timerId)
      }
      _this.timerId = ''
    },
    cleraTimer() {
      const _this = this
      // 关闭并初始化计时数据
      if (this.timerId !== '') {
        window.clearInterval(_this.timerId)
      }
      this.timerId = ''
      this.clock = 0
      this.timing = '00:00'
    },
    hangUpNow() {
      // 挂机操作
      hangUp(Cookies.get('yh_web_UserCode'), Cookies.get('yh_web_ComId'))
        .then(res => {})
        .catch(function(err) {
          console.log(err)
        })
    },
    addRecord() {
      // 新增沟通记录
      const _this = this
      if (this.matter === '') {
        this.$message.warning('不能提交空内容！')
        return
      }
      _this.$Spin.show({
        render: h => {
          return h('div', [
            h('Icon', {
              class: 'demo-spin-icon-load',
              props: {
                type: 'load-c',
                size: 18
              }
            }),
            h('div', '正在提交，请稍等...')
          ])
        }
      })
      this.axios
        .post(
          '/apiweb/work/workorder/-1/follow',
          {
            callcode: _this.inCallCode,
            content: _this.matter
          },
          {
            headers: { 'Content-Type': 'application/json' }
          }
        )
        .then(res => {
          // console.log(res.data)
          if (res.data.id) {
            _this.$message.success('操作成功！')
            _this.matter = ''
            _this.$Spin.hide()
          } else {
            _this.$message.error('操作失败！')
            _this.$Spin.hide()
          }
        })
        .catch(err => {
          _this.$Spin.hide()
          if (err.response.data.msg) {
            this.$message.error(err.response.data.msg)
          } else {
            this.$message.error('操作失败')
          }
        })
    },
    submitForm() {
      const _this = this
      if (!_this.inCallCode) {
        _this.$message.warning('请在通话后保存工单!')
        return
      }
      if (!_this.cansave) {
        _this.$message.warning('请在通话后保存工单!')
        return
      }
      if (_this.custData.length > 0) {
        const accData = _this.custData.find(v => {
          return v.key === 'kd_account'
        })
        if (_this.formorder[_this.AccountId] !== accData.value) {
          _this.$message.warning('工单信息和宽带信息中的宽带账号必须保持一致！')
          return
        }
      }
      _this.checkOrg()
      // 提交表单
      _this.$refs['orders'].validate(valid => {
        if (valid && _this.checkOrg()) {
          _this.saveLoading = true
          _this.$Spin.show({
            render: h => {
              return h('div', [
                h('Icon', {
                  class: 'demo-spin-icon-load',
                  props: {
                    type: 'load-c',
                    size: 18
                  }
                }),
                h('div', '正在提交，请稍等...')
              ])
            }
          })
          let nowField = JSON.parse(JSON.stringify(_this.fieldData))
          let nowForm = JSON.parse(JSON.stringify(_this.formorder))
          let saveData = dealData(nowField, nowForm)
          console.log(saveData)
          _this.axios
            .post('/apiweb/work/workorder', saveData, {
              headers: { 'Content-Type': 'application/json' }
            })
            .then(res => {
              console.log(res.data)
              if (res.data.id) {
                _this.orderId = res.data.id
                _this.$message.success('操作成功！')
                if (_this.inCallCode) {
                  _this.associatedId()
                }
                // _this.saveCustDetail(res.data.id, _this.custData)
                // 重置
                _this.$refs['orders'].resetFields()
                _this.orgList = []
                _this.gridList = []
                _this.formorder['176'] = []
                _this.formorder['176'] = ''
                _this.formorder['177'] = ''
                if (this.custData.length > 0) {
                  _this.saveCustDetail(res.data.id, this.custData)
                }
                // 更新呼入记录的workId

                _this.axios
                  .post('/apiweb/work/workorder/callInChange', {
                    workId: res.data.id,
                    callcode: _this.inCallCode
                  })
                  .then(res => {})

                _this.saveLoading = false
                _this.$Spin.hide()
                _this.callIn()
                _this.$store.commit('removeTag', 'hotline')
                _this.$router.push('/orderdetail/' + res.data.id)
              } else {
                _this.$message.error('操作失败！')
                _this.saveLoading = false
                _this.$Spin.hide()
              }
            })
            .catch(err => {
              _this.$Spin.hide()
              if (err.response.data.msg) {
                _this.$message.error(err.response.data.msg)
              } else {
                _this.$message.error('操作失败')
              }
            })
        } else {
          return false
        }
      })
    },
    associatedId() {
      // 关联工单id与沟通记录id
      this.axios
        .post(
          '/apiweb/work/bindfollow',
          {
            workid: this.orderId,
            callcode: this.inCallCode
          },
          {
            headers: { 'Content-Type': 'application/json' }
          }
        )
        .then(res => {
          console.log(res.data)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted() {
    const _this = this

    this.cardHeight = window.innerHeight - 120
    // 浏览器窗口发生改变
    window.onresize = function() {
      _this.cardHeight = window.innerHeight - 120
    }
    // 字段初始化
    this.initOrderForm()
    // 初始化所属区域
    this.getAreaList()
    // this.getHistoryOrder()
    this.getClassData()
    this.getCommunityData()
  },
  destroyed() {
    this.cleraTimer()
  }
}
</script>