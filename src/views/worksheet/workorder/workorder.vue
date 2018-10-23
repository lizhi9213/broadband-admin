<style lang="less">
@import url('./workorder.less');
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
            <Card dis-hover :style="{minHeight: cardHeight + 'px'}">
                <div class="title">
                    <span class="label">工单信息</span>
                </div>
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
                                <!-- <FormItem :error="orgError">
                  <Cascader :data="areaData" @on-change="areaSelDone" placeholder="请选择所属区域" v-model="formorder['175']"></Cascader>
                </FormItem>
                <FormItem :error="orgError">
                  <Select v-model="formorder['176']" @on-change="orgSelDone" placeholder="请选择所属组织">
                    <Option v-for="item in orgList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
                <FormItem :error="orgError">
                  <Select v-model="formorder['177']" @on-change="gridDone" placeholder="请选择所属网格">
                    <Option v-for="item in gridList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem> -->
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
                        <Button type="success" class="submit-form-btn" @click="submitForm">保存并提交</Button>
                    </FormItem>
                </Form>
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
    </div>
</template>

<script>
import { dealFrom, dealData } from './tool.js'
import { getCust, saveCust } from '@/api/other.js'
import {
  getClassCombo,
  getGroupCombo,
  getCommunityCombo,
  getCommunityDetail
} from '@/api/combox.js'
export default {
  name: 'workorder',
  data() {
    return {
      cardHeight: 500, // card高度
      custData: [], // 展示的宽带数据
      custList: [], // 宽带列表
      fieldData: [], // 工单表单字段列表
      formorder: {}, // 工单表单
      ruleOrder: {}, // 表单验证规则
      itemData: [], // 处理完所属组织后的全部字段数据
      areaData: [], // 所属区域级联数据
      orgList: [], // 所属组织列表
      gridList: [], // 网格列表
      classData: [], // 代维公司信息
      groupData: [], // 代维班组信息
      communityData: [], // 小区信息
      noMsg: '', // 没有客户信息
      AccountId: '', // 宽带账号在字段中的id
      PhoneId: '', // 宽带账号在字段中的id
      choseLine: false, // 选择宽带弹出开关
      checkIndex: -1, // 当前选择的序号
      searchLoading: false,
      orgError: '' // 派单机构错误信息
    }
  },
  methods: {
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
            // console.log(JSON.stringify(rows))
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
      const data = {}
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
          const stData = res.data.find(v => v.SysField === 'faultTime')
          const stId = stData.FieldId
          // 处理所属组织
          _this.extract()
          // 生成表单data数据和校验规则
          let nowFileData = JSON.parse(JSON.stringify(res.data))
          _this.formorder = dealFrom(nowFileData)[0]
          _this.ruleOrder = dealFrom(nowFileData)[1]
          _this.formorder[stId] = new Date()
          console.log(_this.formorder[stId])
          // 区域级联下拉初始化
          _this.getAreaList()
          _this.getClassData()
          console.log(_this.formorder)
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
      //   this.formorder[this.PhoneId] = telData.value
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
        // return v.key === 'kd_account'
      })
    },
    extract() {
      // 字段筛选分类
      const _this = this
      let flag = false
      this.fieldData.forEach(info => {
        // 继续筛选出所属机构分组 // && info.SysField !== 'webCode'
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
    submitForm() {
      const _this = this
      //   console.log(_this.formorder)
      if (this.custData.length > 0) {
        const accData = this.custData.find(v => {
          return v.key === 'kd_account'
        })
        //   if (this.custData.length === 0) {
        //     this.$message.warning('请先查询宽带信息！')
        //     return
        //   }
        if (this.formorder[this.AccountId] !== accData.value) {
          this.$message.warning('工单信息和宽带信息中的宽带账号必须保持一致！')
          return
        }
      }
      // 提交表单
      this.checkOrg()
      this.$refs['orders'].validate(valid => {
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
          //   console.log(saveData)
          this.axios
            .post('/apiweb/work/workorder', saveData, {
              headers: { 'Content-Type': 'application/json' }
            })
            .then(res => {
              console.log(res.data)
              if (res.data.id) {
                _this.$message.success('操作成功！')
                // 重置
                _this.$refs['orders'].resetFields()
                _this.orgList = []
                _this.gridList = []
                _this.formorder['176'] = []
                _this.formorder['176'] = ''
                _this.formorder['177'] = ''
                _this.$Spin.hide()
                // 跳转
                if (this.custData.length > 0) {
                  _this.saveCustDetail(res.data.id, this.custData)
                }
                _this.$store.commit('removeTag', 'workorder')
                _this.$router.push('/orderdetail/' + res.data.id)
                // _this.$router.push('/listing')
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
    // 获取用户数据
    this.initOrderForm()
    // 先获取区域所属列表
    this.getAreaList()

    this.getClassData()
    this.getCommunityData()
  },
  destroyed() {
    this.custData = []
  }
}
</script>

