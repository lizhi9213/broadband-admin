<style lang="less">
@import url('./orderdetail.less');
</style>

<template>
  <div class="container">
    <Row :gutter="24" style="margin:0 !important;">
      <Col span="5" style="padding-left:0;">
      <Card dis-hover :style="{minHeight: cardHeight + 'px'}" style="overflow: hidden; overflow-y: auto;">
        <ul class="customer">
          <li class="cust-title"><span class="label">宽带信息</span></li>
          <li class="cust-item" v-for="(item, index) in custData" :key="index+12" v-if="item.key !== 'id' && item.key !== 'workid' && item.key !== 'custid' && item.key !== 'kd_other'">
            <span class="label">{{item.name}}：</span>
            <span v-if="item.key !== 'kd_phone'">{{item.value}}</span>
            <span v-if="item.key === 'kd_phone'" style="cursor: pointer;" @click="callCustPhone(item.value)">
              {{item.value}} &nbsp;&nbsp;<Icon type="ios-telephone" size="20" style="color: #1890ff;"></Icon>
            </span>
          </li>
          <li v-if="custData.length === 0 && !cusLoading" class="cust-item" :class="{'error': noMsg !== ''}">{{noMsg === '' ? '无法获取到有效宽带信息' : noMsg}}</li>
          <li v-if="cusLoading" class="cust-item">宽带信息加载中...</li>
        </ul>
      </Card>
      </Col>
      <Col span="19" style="padding-right:0;">
      <Card dis-hover>
        <Row class="order-detail">
          <Col span="9" class="operation">
          <div class="return-visit">
            <div class="phone">
              <span class="number">{{textData['custPhone']}}</span>
              <div><Button type="primary" @click="callOut(textData['custPhone'])" icon="ios-telephone" style="margin-left: 32px;">
                  回访
                </Button>
                <Button class="cut-line" type="ghost" @click="hangUp()" icon="ios-telephone" style="margin-left: 22px;">
                  挂机
                </Button></div>
            </div>
          </div>
          <div class="comm-content">
            <div class="label">沟通内容：</div>
            <div class="content-textarea">
              <Input type="textarea" v-model="recordCon" :rows="5" placeholder="请输入沟通内容"></Input>
              <Button type="primary" @click="addRecord" style="position: absolute; right: 14px; bottom: 7px;">
                提交
              </Button>
            </div>
          </div>
          </Col>
          <Col span="15" class="base-msg">
          <div class="item-list" style="width: 100%;text-align: right; width: 100%; margin-bottom: 16px; min-height: 32px;">
            <Dropdown v-if="stepIndex !== 4" @on-click="operationDrop" style="margin-right: 20px" trigger="click">
              <Button type="primary">
                操作&nbsp;
                <Icon type="arrow-down-b"></Icon>
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem name="1">催单</DropdownItem>
                <DropdownItem name="2">归档</DropdownItem>
                <DropdownItem name="3">其他号码</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div class="item-list">
            <span class="label">工单编号：</span>
            <span class="content">{{oCoder}}</span>
          </div>
          <div class="item-list">
            <span class="label">工单状态：</span>
            <span class="content">{{status}}</span>
          </div>
          <div class="item-list">
            <span class="label indent10">宽带账号：</span>
            <span class="content">{{textData['webAccount']}}</span>
          </div>
          <div class="item-list">
            <span class="label indent10">联系电话：</span>
            <span class="content">{{textData['custPhone']}}</span>
          </div>
          <div class="item-list">
            <span class="label indent10">故障类型：</span>
            <span class="content">{{textData['faultType']}}</span>
          </div>
          <div class="item-list">
            <span class="label indent10">故障现象：</span>
            <span class="content">{{textData['faultMemo']}}</span>
          </div>
          <div class="item-list" style="width: 100%;">
            <span class="label indent10">所属小区：</span>
            <span class="content">{{textData['communityId']}}</span>
          </div>
          <div class="item-list" style="width: 100%;">
            <span class="label indent10">派单机构：</span>
            <span class="content">{{textData['group']}}</span>
          </div>
          </Col>
          <Col span="24" style="padding-top: 10px;">
          <!-- <Tabs v-model="tabsVal">
            <TabPane label="工单详情" name="name1"></TabPane>
            <TabPane label="沟通记录" name="name2"></TabPane>
          </Tabs> -->
          </Col>
        </Row>
      </Card>
      <Card dis-hover>
        <Tabs v-model="tabsVal">
          <TabPane label="工单详情" name="name1">
            <div class="detail-body">
              <div class="title">
                <span class="label">处理进度</span>
              </div>
              <div class="stps-box">
                <el-steps :active="stepIndex" finish-status="success">
                  <!-- <el-step title="生成工单">
                <div slot="description">{{timerShaft.createTime === null ? '' : timerShaft.createTime}}<br>{{timerShaft.createName}}</div>
              </el-step> -->
                  <el-step title="派单">
                    <div v-if="timerShaft.orderTime !== null" slot="description">{{timerShaft.orderTime}}<br>{{timerShaft.orderUser}}</div>
                  </el-step>
                  <el-step title="接单">
                    <div v-if="timerShaft.ordersTime !== null" slot="description">{{timerShaft.ordersTime}}<br>{{timerShaft.ordersUser}}</div>
                  </el-step>
                  <el-step title="签到">
                    <div v-if="timerShaft.checkTime !== null" slot="description">{{timerShaft.checkTime}}<br>{{timerShaft.checkUser}}</div>
                  </el-step>
                  <el-step title="完工">
                    <div v-if="timerShaft.completedTime !== null" slot="description">{{timerShaft.completedTime}}<br>{{timerShaft.completedUser}}</div>
                  </el-step>
                  <el-step title="归档">
                    <div v-if="timerShaft.archiveTime !== null" slot="description">{{timerShaft.archiveTime}}<br>{{timerShaft.archiveUser}}</div>
                  </el-step>
                </el-steps>
              </div>
              <div class="title">
                <span class="label">详细信息</span>
                <Button class="edit-btn" type="ghost" @click="showForm = !showForm">
                  {{!showForm ? '编辑' : '取消'}}
                </Button>
              </div>
              <Form v-if="!showForm" ref="details-text" class="order-form order-form-text" :label-width="120">
                <Row>
                  <Col class="list-item" v-for="(n,i) in itemData" :key="i + 3.26" :span="(n.FieldType === 'group' || n.FieldType === 'textarea') ? 12 : 12">
                  <FormItem v-if="n.FieldType !== 'group' && isShowText(n.SysField)" :label="n.FieldName + '：'">
                    <p>{{textData[n.SysField]}}</p>
                  </FormItem>
                  </Col>
                </Row>
              </Form>
              <Form v-show="showForm" ref="details" class="order-form" :model="formorder" :rules="ruleOrder" :label-width="120">
                <Row>
                  <Col class="list-item" v-for="(n,i) in itemData" :key="i + 3.26" :span="(n.FieldType === 'group' || n.FieldType === 'textarea') ? 24 : 12">
                  <FormItem v-if="n.FieldType !== 'group' && n.FieldType !== 'community'" :label="n.FieldName + '：'" :prop="n.FieldId">
                    <Input v-if="n.FieldType == 'input' || n.FieldType == 'number'　|| n.FieldType == 'regular'　|| n.FieldType == 'url'　|| n.FieldType == 'tel'　|| n.FieldType == 'phone'　|| n.FieldType == 'ip'　|| n.FieldType == 'email'" :placeholder="'请填写' + n.FieldName" :disabled="n.SysField === 'webAccount'? true : false" v-model="formorder[n.FieldId]">
                    <span v-if="(n.SysField === 'webAccount' || n.SysField === 'custPhone') && !custExist" slot="append">
                      <Button title="点击查询客户信息" icon="ios-search" :loading="searchLoading" @click="getCustForField(n.FieldId)"></Button>
                    </span>
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
                    <!-- <span v-if="n.SysField === 'dealLine'" style="width: 40px; padding-left: 10px;">小时</span> -->
                    <span v-if="n.SysField === 'dealLine' || n.SysField === 'workLine'" style="width: 40px; padding-left: 10px;">小时</span>
                    <Select v-if="n.FieldType == 'community'" v-model="formorder[n.FieldId]" filterable remote :remote-method="communityMethod" @on-change="communitySelDone" placeholder="请选择所属小区">
                      <Option v-for="item in communityData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                  <!-- <div v-if="n.FieldType === 'group'" class="item-group">
                                        <label class="group-label">{{n.FieldName}}：</label>
                                        <div class="group-content">
                                            <FormItem :error="orgError">
                                                <Select v-model="formorder['176']" filterable @on-change="classSelDone" placeholder="请选择代维公司">
                                                    <Option v-for="item in classData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                                </Select>
                                            </FormItem>
                                            <FormItem :error="orgError">
                                                <Select v-model="formorder['177']" filterable placeholder="请选择代维班组">
                                                    <Option v-for="item in groupData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                                </Select>
                                            </FormItem>
                                        </div>
                                    </div> -->
                  </Col>
                </Row>
                <FormItem>
                  <Button type="success" class="submit-form-btn" @click="saveBaseForm">保存并提交</Button>
                </FormItem>
              </Form>
            </div>
          </TabPane>
          <TabPane label="沟通记录" name="name2">
            <Table :columns="columns" :data="recordData" height="300"></Table>
          </TabPane>
          <TabPane label="通话记录" name="name3">
            <Table :columns="columns1" :data="CallRecordData" height="300"></Table>
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
  </div>
</template>

<script>
import Aplayer from 'vue-aplayer'
import Cookies from 'js-cookie'
import { dealFrom, dealData, dealClassify } from '../workorder/tool.js'
import { getCust, readCust, saveCust, callOut, hangUp } from '@/api/other.js'
import {
  getClassCombo,
  getGroupCombo,
  getCommunityCombo,
  getCommunityDetail
} from '@/api/combox.js'
export default {
  name: 'orderdetail',
  components: {
    Aplayer
  },
  watch: {
    startPlayer(val) {
      if (!val) {
        this.$refs.player.pause()
      }
    }
  },
  data() {
    return {
      cardHeight: 500, // 左侧客户信息
      showForm: false, // 显示表单切换开关
      fieldData: [], // 全部字段数据
      textData: [], // 展示用data
      itemData: [], // 处理完所属组织后的全部字段数据
      formorder: {}, // 表单数据data
      ruleOrder: {}, // 表单验证规则
      areaData: [], // 所属区域级联数据
      orgList: [], // 所属组织列表
      gridList: [], // 网格列表
      classData: [], // 代维公司信息
      groupData: [], // 代维班组信息
      communityData: [], // 小区信息
      areaText: '', // 所属区域text
      orgText: '', //  所属组织text
      gridText: '', // 网格列表text
      orderId: '', // 工单id
      oCoder: '', // 工单编号
      status: '', // 工单状态
      custList: [], // 宽带列表
      custData: [], // 客户数据
      custSave: false,
      custExist: false, // 客户数据是否存在
      timerShaft: {}, // 时间轴
      stepIndex: 0, // 进度
      cusLoading: false, // 获取用户信息加载
      tabsVal: 'name1', // tabs切换
      startPlayer: false, // 开始播放
      songList: {
        src: 'https://moeplayer.b0.upaiyun.com/aplayer/snowmoonflowers',
        title: '暂无',
        artist: '暂无',
        pic: '/static/img/td_icon.ico'
      }, // 录音播放列表
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '沟通时间',
          key: 'operTime'
        },
        {
          title: '沟通内容',
          key: 'content'
        },
        {
          title: '操作人',
          key: 'UserName'
        }
      ], // table表头
      columns1: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '号码',
          width: 120,
          key: 'phone'
        },
        {
          title: '类型',
          width: 100,
          key: 'calltype',
          render: (h, params) => {
            let type = ''
            switch (params.row.calltype) {
              case 'callIn':
                type = '呼入'
                break
              case 'callOut':
                type = '呼出'
                break
            }
            return h('span', type)
          }
        },
        {
          title: '客服',
          width: 120,
          key: 'username'
        },
        {
          title: '拨打时间',
          width: 150,
          key: 'createtime'
        },
        {
          title: '操作',
          width: 120,
          key: 'operTime',
          render: (h, params) => {
            const _this = this
            if (
              params.row.recordfile !== '' &&
              params.row.recordfile !== null
            ) {
              const filename = params.row.recordfile.substring(
                params.row.recordfile.lastIndexOf('/') + 1
              )
              return h('div', [
                h('div', {
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
                }),
                h('a', {
                  class: {
                    iconfont: true,
                    'icon-Group-': true
                  },
                  style: {
                    marginRight: '14px',
                    cursor: 'pointer',
                    fontSize: '22px',
                    fontWeight: '600'
                  },
                  attrs: {
                    href: params.row.recordfile,
                    download: filename
                  }
                })
              ])
            } else {
              return h('span', '无')
            }
          }
        }
      ],
      recordData: [], // table数据
      CallRecordData: [], // table 数据
      recordCon: '', // 当前沟通内容
      AccountId: '', // 宽带账号在字段中的id
      PhoneId: '', // 宽带账号在字段中的id
      choseLine: false, // 选择宽带弹出开关
      checkIndex: -1, // 当前选择的序号
      searchLoading: false,
      noMsg: '',
      orgError: '' // 派单机构错误信息
    }
  },
  methods: {
    hangUp() {
      // 执行呼叫操作
      hangUp(Cookies.get('yh_web_UserCode'), Cookies.get('yh_web_ComId'))
        .then(res => {})
        .catch(function(err) {
          console.log(err)
        })
    },
    callOut(phone) {
      // 执行呼叫操作
      if (phone) {
        callOut(phone, Cookies.get('yh_web_UserCode'), this.orderId)
          .then(res => {})
          .catch(function(err) {
            console.log(err)
          })
      } else {
        this.$message.error('号码不能为空')
      }
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
    getCustDetail() {
      // workid: 工单id
      this.custData = []
      this.cusLoading = true
      const _this = this
      // orderId = '1' // 测试号码
      // 获取所属区域列表
      readCust(this.orderId)
        .then(res => {
          console.log(res.data)
          // console.log(JSON.stringify(res.data))
          if (res.data.length > 0) {
            _this.custData = res.data[0]
            _this.cusLoading = false
            _this.custExist = true
          } else {
            _this.custSave = true
            _this.cusLoading = false
            _this.custExist = false
          }
        })
        .catch(function(err) {
          console.log(err)
          _this.cusLoading = false
        })
    },
    getCustForField(id) {
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
      //   //   this.formorder[this.AccountId] = accData.value
      //   if (telData) {
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
    saveCustDetail(workid, custdata) {
      // keynum: 手机号码,或者宽带账号
      const _this = this
      let data = {}
      data.workid = workid // 工单保存的workid
      data.data = custdata // get获取的客户信息
      // 获取所属区域列表
      saveCust(data)
        .then(res => {
          console.log(res.data)
          const rr = res.data
          if (rr) {
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
          //   console.log(_this.formorder)
          _this.ruleOrder = dealFrom(nowFileData)[1]
          // 区域级联下拉初始化
          //   _this.getAreaList()
          // 设置表单数据
          this.$refs.details.resetFields()
          _this.setOrderForm()
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    setOrderForm() {
      const _this = this
      this.axios
        .get('/apiweb/work/workorder/' + _this.orderId, {})
        .then(res => {
          // console.log(res.data)
          // 设置工单编号和状态
          _this.oCoder = res.data.code
          _this.status = res.data.status
          // 先初始化所属机构两个个下拉
          //   _this.getOrgList(res.data['175'].text)
          //   _this.getGridList(res.data['176'].text)
          // 处理展示数据
          _this.filterDetail(res.data)
          // 设置表单数据
          const typeArr = dealClassify(_this.fieldData)
          typeArr.strArr.forEach(i => {
            if (res.data[i] !== undefined) {
              _this.formorder[i] = res.data[i].text
            }
          })
          typeArr.arrOf.forEach(n => {
            if (res.data[n] !== undefined) {
              _this.formorder[n] = res.data[n].value
            }
          })
          if (res.data['147'].value) {
            _this.getCommunityData(res.data['147'].value)
          }
          _this.getClassData(res.data['176'].value)
          _this.getGroupData(res.data['176'].value, res.data['177'].value)
          // typeArr.selArr.forEach(n => {
          //   _this.formorder[n] = res.data[n].value
          // })
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    initTimesTree() {
      // 获取时间轴
      const _this = this
      this.axios
        .get('/apiweb/work/workorder/' + this.orderId + '/timeline')
        .then(res => {
          // console.log(JSON.stringify(res.data))
          _this.timerShaft = res.data
          // 时间轴进度
          _this.stepIndex = res.data.status
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    initRecord() {
      // 获取沟通记录数据
      const _this = this
      this.axios
        .get('/apiweb/work/workorder/' + this.orderId + '/follow')
        .then(res => {
          // console.log(JSON.stringify(res.data))
          _this.recordData = res.data
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    initCallRecord() {
      // 获取沟通记录数据
      const _this = this
      this.axios
        .get('/apiweb/work/workorder/' + this.orderId + '/record')
        .then(res => {
          // console.log(JSON.stringify(res.data))
          _this.CallRecordData = res.data
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getClassData(code) {
      // 获取代维公司信息
      const _this = this
      getClassCombo('concat', '')
        .then(res => {
          //   console.log(res.data)
          const data = res.data
          if (data) {
            // 成功
            _this.classData = data
            if (code) {
              _this.formorder['176'] = code
            }
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
    getCommunityData(val) {
      // 获取小区信息
      const _this = this
      val = val || ''
      getCommunityCombo(val, 10)
        .then(res => {
          //   console.log(res.data)
          const data = res.data
          if (data) {
            // 成功
            _this.communityData = data
            if (val) {
              _this.formorder['147'] = val
            }
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
    filterDetail(data) {
      const _this = this
      // 展示数据处理
      // this.textData
      let flag = false
      this.fieldData.forEach(item => {
        if (item.FieldType === 'community') {
          _this.textData['communityId'] = data.communityName
        } else if (item.FieldType !== 'other') {
          // 不是派单机构
          if (data[item.FieldId] !== undefined) {
            _this.textData[item.SysField] = data[item.FieldId].text
          } else {
            _this.textData[item.SysField] = ''
          }
        } else if (!flag) {
          // 派单机构要合并为一个
          _this.textData['group'] = data.area
          flag = true
        }
      })
    },
    callCustPhone(phone) {
      const _this = this
      this.$confirm('确定呼叫该号码？', '提示')
        .then(() => {
          _this.callOut(phone)
        })
        .catch(() => {})
    },
    extract() {
      // 字段筛选分类
      const _this = this
      let flag = false
      _this.itemData = []
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
    isShowText(field) {
      const textArr = [
        'webAccount',
        'custPhone',
        'faultType',
        'faultMemo',
        'communityId'
      ]
      const isShow = textArr.find(v => v === field)
      if (isShow !== undefined) {
        return false
      } else {
        return true
      }
    },
    operationDrop(name) {
      const _this = this
      // console.log(name)
      if (name === '1') {
        //  催单
        _this
          .$prompt('输入提醒内容(可以留空)', '催单', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          })
          .then(({ value }) => {
            _this.axios
              .post(`/apiweb/work/workorder/${_this.orderId}/reminders`, {
                memo: value
              })
              .then(res => {
                _this.$message.success(res.data.msg)
              })
              .catch(err => {
                if (err.response.data.msg) {
                  _this.$message.error(err.response.data.msg)
                } else {
                  _this.$message.error('操作失败')
                }
                console.log(err)
              })
          })
          .catch(() => {})
      } else if (name === '2') {
        this.$confirm('确定将该工单归档？', '提示')
          .then(() => {
            this.axios
              .post(`/apiweb/work/workorder/${_this.orderId}/archive`)
              .then(res => {
                _this.$message.success(res.data.msg)
                _this.setOrderForm()
                _this.initTimesTree()
              })
              .catch(err => {
                if (err.response.data.msg) {
                  _this.$message.error(res.response.data.msg)
                } else {
                  _this.$message.error('操作失败')
                }
              })
          })
          .catch(() => {})
      } else if (name === '3') {
        //  催单
        _this
          .$prompt('请输入被叫号码', '呼叫', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          })
          .then(({ value }) => {
            if (value) {
              _this.callOut(value)
            } else {
              _this.$message.error('号码不能为空!')
            }
          })
          .catch(() => {})
      }
    },
    addRecord() {
      // 新增沟通记录
      const _this = this
      if (this.recordCon === '') {
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
          '/apiweb/work/workorder/' + _this.orderId + '/follow',
          {
            content: _this.recordCon
          },
          {
            headers: { 'Content-Type': 'application/json' }
          }
        )
        .then(res => {
          // console.log(res.data)
          if (res.data.id) {
            _this.$message.success('操作成功！')
            _this.$Spin.hide()
            _this.recordCon = ''
            _this.initRecord()
            _this.initCallRecord()
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
    saveBaseForm() {
      // 保存编辑的表单
      // this.$refs['details'].validate(valid => {
      const _this = this
      if (_this.custSave) {
        if (_this.custData.length > 0) {
          const accData = _this.custData.find(v => {
            return v.key === 'kd_account'
          })
          //   if (this.custData.length === 0) {
          //     this.$message.warning('请先查询宽带信息！')
          //     return
          //   }
          if (this.formorder[this.AccountId] !== accData.value) {
            _this.$message.warning(
              '工单信息和宽带信息中的宽带账号必须保持一致！'
            )
            return
          }
        }
      }
      // 提交表单
      this.checkOrg()
      this.$refs['details'].validate(valid => {
        if (valid && _this.checkOrg()) {
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
          // console.log(saveData)
          this.axios
            .put('/apiweb/work/workorder/' + _this.orderId, saveData, {
              headers: { 'Content-Type': 'application/json' }
            })
            .then(res => {
              // console.log(res.data)
              if (res.data.id) {
                _this.$message.success('操作成功！')
                _this.showForm = false
                _this.$refs['details'].resetFields()
                _this.setOrderForm()
                _this.$Spin.hide()

                if (_this.custSave) {
                  if (_this.custData.length > 0) {
                    _this.saveCustDetail(res.data.id, _this.custData)
                  }
                }
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
        } else {
          return false
        }
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
    // 获取传过来的手机号
    this.orderId = this.$route.params.phone
    // 初始化获取表单的动态字段
    // this.initOrderForm()
    // // 获取客户信息
    // this.getCustDetail()
    // // 获取时间轴
    // this.initTimesTree()
    // // 获取沟通记录
    // this.initRecord()
    // this.getClassData()
    // this.getCommunityData()
  },
  watch: {
    $route(n, o) {
      if (n.name === 'orderdetail') {
        if (n.params.phone !== this.orderId) {
          this.orderId = this.$route.params.phone
        }
      }
    },
    orderId() {
      this.initOrderForm()
      // 获取客户信息
      this.getCustDetail()
      // 获取时间轴
      this.initTimesTree()
      // 获取沟通记录
      this.initRecord()
      this.initCallRecord()
    },
    custData(val) {
      console.log(val)
    }
  }
}
</script>

