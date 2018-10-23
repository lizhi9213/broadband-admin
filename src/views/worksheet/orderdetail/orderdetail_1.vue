<style lang="less">
@import url('./orderdetail.less');
</style>

<template>
  <div class="container">
    <Card dis-hover :style="{minHeight: cardHeight + 'px'}">
      <div class="order-number">
        <span class="label">工单编号：</span>
        <span class="text">{{oCoder}}</span>
        <span class="label">工单状态：</span>
        <span class="text">{{status}}</span>
      </div>
      <Tabs value="name1" class="detail-tabs">
        <TabPane label="工单信息" name="name1">
          <div class="pane-items">
            <Row :gutter="10" class="obder-details">
              <Col span="15" class="field-form">
              <Form ref="details" :model="formorder" :rules="ruleOrder" :label-width="120">
                <h3 class="field-title">基础字段</h3>
                <Row>
                  <Col class="list-item" v-for="(n,i) in baseField" :key="i + 3.26" :span="(n.FieldType === 'group' || n.FieldType === 'textarea') ? 24 : 12">
                  <FormItem v-if="n.FieldType !== 'group'" :label="n.FieldName + '：'" :prop="n.FieldId">
                    <Input v-if="n.FieldType == 'input' || n.FieldType == 'number'　|| n.FieldType == 'regular'　|| n.FieldType == 'url'　|| n.FieldType == 'tel'　|| n.FieldType == 'phone'　|| n.FieldType == 'ip'　|| n.FieldType == 'email'" :placeholder="'请填写' + n.FieldName" v-model="formorder[n.FieldId]"></Input>
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
                  </FormItem>
                  <div v-if="n.FieldType === 'group'" class="item-group">
                    <label class="group-label">{{n.FieldName}}：</label>
                    <div class="group-content">
                      <FormItem>
                        <Cascader :data="areaData" @on-change="areaSelDone" placeholder="请选择所属区域" v-model="formorder['175']"></Cascader>
                      </FormItem>
                      <FormItem>
                        <Select v-model="formorder['176']" @on-change="orgSelDone" placeholder="请选择所属组织">
                          <Option v-for="item in orgList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                      </FormItem>
                      <FormItem>
                        <Select v-model="formorder['177']" placeholder="请选择所属网格">
                          <Option v-for="item in gridList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                      </FormItem>
                    </div>
                  </div>
                  </Col>
                </Row>
                <h3 class="field-title" v-if="diyField && diyField.length > 0">扩展字段</h3>
                <Row v-if="diyField && diyField.length > 0">
                  <Col span="12" class="list-item" v-for="(n,i) in diyField" :key="i + 3.26">
                  <FormItem :label="n.FieldName + '：'" :prop="n.FieldId">
                    <Input v-if="n.FieldType == 'input' || n.FieldType == 'number'　|| n.FieldType == 'regular'　|| n.FieldType == 'url'　|| n.FieldType == 'tel'　|| n.FieldType == 'phone'　|| n.FieldType == 'ip'　|| n.FieldType == 'email'" :placeholder="'请填写' + n.FieldName" v-model="formorder[n.FieldId]"></Input>
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
                    <DatePicker v-if="n.FieldType == 'time' ||　n.FieldType == 'timerange'" :format="n.Checked === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm'" :type="n.Checked" :placeholder="'请选择' + n.FieldName" v-model="formorder[n.FieldId]" style="width: 100%;"></DatePicker>
                  </FormItem>
                  </Col>
                </Row>
                <FormItem>
                  <Button type="success" class="submit-form-btn" @click="saveBaseForm">保存并提交</Button>
                </FormItem>
              </Form>
              </Col>
              <Col span="9" class="return-visit">
              <Form ref="visit" :model="visitForm" :rules="ruleVisit" :label-width="120" style="padding-right: 40px;">
                <FormItem label="客户联系电话：">
                </FormItem>
                <div class="visit-box">
                  <span class="phone">{{formorder['151']}}</span>
                  <Button type="success" icon="ios-telephone" style="background-color: #1890ff; border-color: #1890ff;">回访</Button>
                </div>
                <FormItem label="回访类型：" prop="VisitType">
                  <Select v-model="visitForm.VisitType">
                    <Option v-for="item in visitList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="备注说明：" prop="Explain">
                  <Input v-model="visitForm.Explain" type="textarea" :rows="4"></Input>
                </FormItem>
                <div class="deal-visit">
                  <Button type="success" @click="addRecord(1)">回复</Button>
                  <Button type="success" ghost @click="addRecord(2)">归档</Button>
                </div>
              </Form>
              </Col>
            </Row>
          </div>
        </TabPane>
        <TabPane label="时间轴" name="name2">
          <div class="pane-items">
            <Row class="time-line">
              <Col span="16" offset="2" style="padding-top: 30px;">
              <Timeline pending>
                <TimelineItem color="#ff6060" v-if="timerShaft.createTime !== null">
                  <p class="line-title">
                    <span class="type">生成工单</span>{{timerShaft.createTime}}
                    <!-- <span class="label">故障来源/故障类型</span> -->
                  </p>
                  <div class="timeline-body">
                    <div class="timeline-item">
                      <div class="item-list">
                        <span class="label">创建人：{{timerShaft.createName}}</span>
                        <span class="content"></span>
                      </div>
                    </div>
                  </div>
                </TimelineItem>
                <TimelineItem color="#ff6060" v-if="timerShaft.orderTime !== null">
                  <p class="line-title">
                    <span class="type">派单</span>{{timerShaft.orderTime}}
                  </p>
                  <div class="timeline-body">
                    <div class="timeline-item">
                      <div class="item-list">
                        <span class="label">派单人：{{timerShaft.orderUser}}</span>
                        <span class="content"></span>
                      </div>
                    </div>
                  </div>
                </TimelineItem>
                <TimelineItem color="#ff6060" v-if="timerShaft.ordersTime !== null">
                  <p class="line-title">
                    <span class="type">接单</span>{{timerShaft.ordersTime}}
                  </p>
                  <div class="timeline-body">
                    <div class="timeline-item">
                      <div class="item-list">
                        <span class="label">接单人：{{timerShaft.ordersUser}}</span>
                        <span class="content"></span>
                      </div>
                    </div>
                  </div>
                </TimelineItem>
                <TimelineItem color="#ff6060" v-if="timerShaft.completedTime !== null">
                  <p class="line-title">
                    <span class="type">完工</span>{{timerShaft.completedTime}}
                  </p>
                  <div class="timeline-body">
                    <div class="timeline-item">
                      <div class="item-list">
                        <span class="label">完工人：{{timerShaft.completedUser}}</span>
                        <span class="content"></span>
                      </div>
                    </div>
                  </div>
                </TimelineItem>
              </Timeline>
              </Col>
            </Row>
          </div>
        </TabPane>
        <TabPane label="沟通记录" name="name3">
          <div class="pane-items">
            <Row class="record">
              <Col span="16" offset="2" style="padding-top: 30px;">
              <Timeline pending>
                <TimelineItem color="#ff6060" v-for="(item, index) in recordList" :key="index">
                  <p class="line-title">
                    {{item.operTime}}
                    <span class="label">{{item.type}}</span>
                  </p>
                  <div class="timeline-body">
                    <div class="timeline-item">
                      <div class="item-list">
                        <span class="label">备注说明：</span>
                        <span class="content">{{item.content}}</span>
                      </div>
                    </div>
                  </div>
                </TimelineItem>
                <TimelineItem color="#ff6060" v-if="recordData.length > 3">
                  <a class="line-title" href="javascript:;" @click="recordList = recordData">查看更多</a>
                </TimelineItem>
              </Timeline>
              </Col>
            </Row>
          </div>
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script>
import { dealFrom, dealData, dealClassify } from '../workorder/tool.js'
export default {
  // name: 'orderdetail',
  data() {
    return {
      cardHeight: 500,
      fieldData: [], // 所有表单字段
      baseField: [], // 基础字段
      diyField: [], // 拓展字段
      formorder: {}, // 表单数据
      ruleOrder: {}, // 表单验证规则
      areaData: [], // 所属区域级联数据
      orgList: [], // 所属组织列表
      gridList: [], // 网格列表
      orderId: '', // 工单id
      oCoder: '', // 工单编号
      status: '', // 工单状态
      visitForm: {
        VisitType: '', // 回访类型
        Explain: ''
      }, // 右侧操作处理表单
      ruleVisit: {
        VisitType: [
          {
            required: true,
            message: '请选择回访类型',
            trigger: 'change'
          }
        ]
      }, // 回访验证电话数据
      timerShaft: [], // 时间轴
      recordList: [], // 沟通记录数据
      recordData: [], // 沟通记录全部数据
      visitList: [
        {
          value: '生成工单',
          label: '生成工单'
        },
        {
          value: '派单',
          label: '派单'
        },
        {
          value: '接单',
          label: '接单'
        },
        {
          value: '完工',
          label: '完工'
        },
        {
          value: '归档',
          label: '归档'
        }
      ]
    }
  },
  methods: {
    initOrderForm() {
      // 初始化表单字段
      const _this = this
      this.axios
        .get('/apiweb/work/WorkListForm', {
          FlagId: 1
        })
        .then(res => {
          // console.log(JSON.stringify(res.data))
          _this.fieldData = res.data
          // 分类提取字段,渲染到页面不同区域
          _this.extract()
          // 生成表单data数据和校验规则
          let nowFileData = JSON.parse(JSON.stringify(res.data))
          _this.formorder = dealFrom(nowFileData)[0]
          _this.ruleOrder = dealFrom(nowFileData)[1]
          // 区域级联下拉初始化
          _this.getAreaList()
          // 设置表单数据
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
          // console.log(JSON.stringify(res.data))
          // 设置工单编号和状态
          _this.oCoder = res.data.code
          _this.status = res.data.status
          // 先初始化所属机构两个个下拉
          _this.getOrgList(res.data['175'].text)
          _this.getGridList(res.data['176'].text)
          // 设置表单数据
          const typeArr = dealClassify(_this.fieldData)
          console.log(typeArr.strArr)
          typeArr.strArr.forEach(i => {
            _this.formorder[i] = res.data[i].text
          })
          typeArr.arrOf.forEach(n => {
            _this.formorder[n] = res.data[n].value
          })
          // typeArr.selArr.forEach(n => {
          //   _this.formorder[n] = res.data[n].value
          // })
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
          _this.recordList = res.data
          if (res.data.length > 3) {
            _this.recordList.push(res.data[0])
            _this.recordList.push(res.data[1])
            _this.recordList.push(res.data[2])
            _this.recordData = res.data
          } else {
            _this.recordList = res.data
            _this.recordData = res.data
          }
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
          console.log(JSON.stringify(res.data))
          _this.timerShaft = res.data
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
    extract() {
      // 字段筛选分类
      const _this = this
      // 提取字段分类
      const sysField = [] // 系统字段
      // 分类系统字段和非系统字段
      this.fieldData.forEach(item => {
        if (item.IsSys === 1) {
          sysField.push(item)
        } else {
          _this.diyField.push(item)
        }
      })
      let flag = false
      sysField.forEach(info => {
        // 继续筛选出所属机构分组
        if (info.FieldType !== 'other') {
          _this.baseField.push(info)
        } else if (!flag) {
          _this.baseField.push({
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
      })
    },
    saveBaseForm() {
      // 保存编辑的表单
      // this.$refs['details'].validate(valid => {
      const _this = this
      // 提交表单
      this.$refs['details'].validate(valid => {
        if (valid) {
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
        } else {
          return false
        }
      })
    },
    addRecord(type) {
      const _this = this
      // 1回复 2归档
      if (type === 1) {
        // 回复
        _this.$refs['visit'].validate(valid => {
          if (valid) {
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
            // 提交回复
            this.axios
              .post(
                '/apiweb/work/workorder/' + _this.orderId + '/follow',
                {
                  type: _this.visitForm.VisitType,
                  content: _this.visitForm.Explain
                },
                {
                  headers: { 'Content-Type': 'application/json' }
                }
              )
              .then(res => {
                // console.log(res.data)
                if (res.data.id) {
                  _this.$message.success('操作成功！')
                  // 重置
                  _this.$refs['visit'].resetFields()
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
          } else {
            return false
          }
        })
      }
    }
  },
  mounted() {
    const _this = this
    this.cardHeight = window.innerHeight - 130
    // 浏览器窗口发生改变
    window.onresize = function() {
      _this.cardHeight = window.innerHeight - 130
    }
    this.orderId = this.$route.params.phone
    // 初始化基础表单数据
    this.initOrderForm()
    // 获取时间轴和沟通记录数据
    this.initRecord()
    this.initTimesTree()
  }
}
</script>

