<style lang="less">
@import './neworder.less';
</style>

<template>
  <div>
    <Card>
      <!-- 顶部标题 -->
      <p slot="title">
        <Icon type="ios-browsers"></Icon>
        新建工单
      </p>
      <div :style="{height: boxHeight}">
        <Row :gutter="18" style="height:100%; overflow:hidden;">
          <Form ref="orderForm" :model="orderForm" :rules="ruleNewOrder" label-position="top" style="height:100%">
            <Col span="14" style="height:100%">
            <Row :gutter="18" style="overflow-y: auto; max-height:100%">
              <Col span="12">
              <FormItem label="客戶：" prop="custom">
                <Input v-model="orderForm.custom" placeholder="请输入客户手机号" @on-change="(v)=>orderForm.title=v.target.value" @on-blur="searchOrder" />
                <!-- <Select v-model="orderForm.custom" filterable remote @on-open-change="toggleAn" :remote-method="getCustList" :label="remoLabel" :loading="loading1">
                <li>
                  <Button v-if="!showNoList" type="ghost" icon="plus" style="margin-left: 16px;margin-bottom:8px;" size="small" @click="newCustom">添加客户</Button>
                  <span v-if="showNoList">暂无匹配项</span>
                </li>
                <Option v-for="item in custList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select> -->
              </FormItem>
              </Col>
              <Col span="12" style="height:79px">
              <FormItem label="处理人：" prop="dealing">
                <Cascader :data="dealList" v-model="orderForm.dealing" :change-on-select="true" @on-change="cascaChage" @on-visible-change="bisibleDone" filterable></Cascader>
              </FormItem>
              </Col>
              <Col span="12" v-for="(n,i) in fieldData" :key="i + 3.26" style="min-height:79px" v-if="n.SysField !='WorkSubject' && n.SysField !='WorkDetail' && n.SysField != 'WorkStatus' && n.FieldId!=='110' && n.FieldId!=='111'">
              <FormItem :label="n.FieldName + '：'" :prop="n.FieldId">
                <Input v-if="n.FieldType == 'input' || n.FieldType == 'number'　|| n.FieldType == 'regular'　|| n.FieldType == 'url'　|| n.FieldType == 'tel'　|| n.FieldType == 'phone'　|| n.FieldType == 'ip'　|| n.FieldType == 'email'" :placeholder="'请填写' + n.FieldName" v-model="orderForm[n.FieldId]"></Input>
                <Input v-if="n.FieldType == 'textarea'" type="textarea" :autosize="{minRows: 3,maxRows: 20}" :placeholder="'请填写' + n.FieldName" v-model="orderForm[n.FieldId]"></Input>
                <!-- <Input v-if="n.FieldType == 'input'"  :placeholder="'请填写' + n.FieldName" v-model="orderForm[n.FieldId]"></Input> -->
                <RadioGroup v-if="n.FieldType == 'radio'" v-model="orderForm[n.FieldId]">
                  <Radio v-for="(k,j) in n.options" :key="j + 2.56" :label="j + ''">{{k.value}}</Radio>
                </RadioGroup>
                <CheckboxGroup v-if="n.FieldType == 'checkbox'" v-model="orderForm[n.FieldId]">
                  <Checkbox v-for="(g,h) in n.options" :key="h + 6.26" :label="h + ''">{{g.value}}</Checkbox>
                </CheckboxGroup>
                <Select v-if="n.FieldType == 'select'" v-model="orderForm[n.FieldId]" :placeholder="'请选择' + n.FieldName">
                  <Option v-for="(d,f) in n.options" :key="f + 6.26" :value="f + ''">{{d.value}}</Option>
                </Select>
                <Select v-if="n.FieldType == 'multipleselect'" multiple v-model="orderForm[n.FieldId]" :placeholder="'请选择' + n.FieldName">
                  <Option v-for="(d,f) in n.options" :key="f + ''" :value="f + ''">{{d.value}}</Option>
                </Select>
                <Cascader v-if="n.FieldType == 'cascader'" :data="n.options" v-model="orderForm[n.FieldId]"></Cascader>
                <DatePicker v-if="n.FieldType == 'time' ||　n.FieldType == 'timerange'　" format="yyyy/MM/dd" :type="n.Checked" :placeholder="'请选择' + n.FieldName" v-model="orderForm[n.FieldId]"></DatePicker>
              </FormItem>
              </Col>
            </Row>
            </Col>
            <Col span="10" style="overflow-y: auto; max-height:100%">
            <FormItem label="主题" prop="title">
              <Input v-model="orderForm.title" placeholder="请填写工单主题"></Input>
            </FormItem>
            <FormItem label="描述" prop="desc" class="desc_item_box">
              <div class="desc_hadle_box">
                <el-upload class="upload-box" ref="upload" action="/apiweb/upload/UploadFiles" :limit="3" :data="orderForm" :show-file-list="false" :http-request="getImgList" multiple>
                  <Button icon="android-upload" size="large" class="unpload_bth">上传文件</Button>
                </el-upload>
              </div>
              <Input type="textarea" class="desc_textarea" v-model="orderForm.desc" :autosize="{minRows: 3,maxRows: 12}" placeholder="工单描述"></Input>
            </FormItem>
            <FormItem label="处理结果" prop="110" v-if="fieldData[15]">
              <Cascader :data="fieldData[15].options" v-model="orderForm['110']"></Cascader>
            </FormItem>
            <FormItem label="结果说明" prop="111" v-if="fieldData[16]">
              <Input type="textarea" :autosize="{minRows: 3,maxRows: 20}" placeholder="请填写处理结果说明" v-model="orderForm['111']" />
            </FormItem>
            <FormItem>
              <Row :gutter="16">
                <Col span="12">
                <el-button-group class="reply_box">
                  <div class="reply_class" id v-if="isReplyClass">
                    <p @click="btnOk(1)">提交并处理完毕</p>
                  </div>
                  <el-button type="primary" style="padding: 12px 36px;letter-spacing: 4px;" @click="btnOk(0)">提交</el-button>
                  <el-button type="primary" :icon="isReplyClass ? 'el-icon-caret-top':'el-icon-caret-bottom'" v-on:blur.native="btnBlur" @click="showTopCaret"></el-button>
                </el-button-group>
                </Col>
                <Col span="12">
                <ul class="el-upload-list el-upload-list--text">
                  <li class="el-upload-list__item is-success" v-for="(item,index) in imgListData" :key="index">
                    <a class="el-upload-list__item-name">
                      <i class="el-icon-document"></i>{{item.FileName}}
                    </a>
                    <label class="el-upload-list__item-status-label">
                      <i class="el-icon-upload-success el-icon-circle-check"></i>
                    </label>
                    <i class="el-icon-close" @click="delImg(index)"></i>
                  </li>
                </ul>
                </Col>
              </Row>
            </FormItem>

            <MarkRecords :phone="phone" @click-data="toData" :canCopy="true"></MarkRecords>
            </Col>
          </Form>
        </Row>
      </div>
    </Card>
    <!-- 客户字段弹出框 -->
    <Modal v-model="fieldModal" :width="700" :styles="{'margin-right':'0','height':'calc(100% - 100px)'}" :transfer="false" :transition-names="['move-right','fade']">
      <h3 slot="header" style="color:#2D8CF0">新增客户</h3>
      <Form ref="dynamic" :label-width="100" :model="formData" :rules="ruleForm">
        <FormItem v-for="(n,i) in itemData" :key="i + 3.26" :label="n.FieldName + '：'" :prop="n.FieldId">
          <Input v-if="n.FieldType == 'input' || n.FieldType == 'number'　|| n.FieldType == 'regular'　|| n.FieldType == 'url'　|| n.FieldType == 'tel'　|| n.FieldType == 'phone'　|| n.FieldType == 'ip'　|| n.FieldType == 'email'" :placeholder="'请填写' + n.FieldName" v-model="formData[n.FieldId]"></Input>
          <Input v-if="n.FieldType == 'textarea'" type="textarea" :autosize="{minRows: 3,maxRows: 20}" :placeholder="'请填写' + n.FieldName" v-model="formData[n.FieldId]"></Input>
          <!-- <Input v-if="n.FieldType == 'input'"  :placeholder="'请填写' + n.FieldName" v-model="formData[n.FieldId]"></Input> -->
          <RadioGroup v-if="n.FieldType == 'radio'" v-model="formData[n.FieldId]">
            <Radio v-for="(k,j) in n.options" :key="j + 2.56" :label="j + ''">{{k.value}}</Radio>
          </RadioGroup>
          <CheckboxGroup v-if="n.FieldType == 'checkbox'" v-model="formData[n.FieldId]">
            <Checkbox v-for="(g,h) in n.options" :key="h + 6.26" :label="h + ''">{{g.value}}</Checkbox>
          </CheckboxGroup>
          <Select v-if="n.FieldType == 'select'" v-model="formData[n.FieldId]" :placeholder="'请选择' + n.FieldName">
            <Option v-for="(d,f) in n.options" :key="f + 6.26" :value="f + ''">{{d.value}}</Option>
          </Select>
          <Select v-if="n.FieldType == 'multipleselect'" multiple v-model="formData[n.FieldId]" :placeholder="'请选择' + n.FieldName">
            <Option v-for="(d,f) in n.options" :key="f + ''" :value="f + ''">{{d.value}}</Option>
          </Select>
          <Cascader v-if="n.FieldType == 'cascader'" :data="n.options" v-model="formData[n.FieldId]"></Cascader>
          <DatePicker v-if="n.FieldType == 'time' ||　n.FieldType == 'timerange'　" format="yyyy/MM/dd" :type="n.Checked" :placeholder="'请选择' + n.FieldName" v-model="formData[n.FieldId]"></DatePicker>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="fieldModal = false">取消</Button>
        <Button type="primary" :loading="modalBtnLoading" @click="saveCust">保存</Button>
      </div>
    </Modal>
    <Modal v-model="searchModal">
      <h3 slot="header">正在处理的工单</h3>
      <Table :data="searchData" :columns="[{title:'主题',key:'WorkSubject'},{title:'处理人',key:'name'}]" @on-row-click="toOper"></Table>
      <div slot="footer">
        <Button type="text" @click="searchModal=false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import MarkRecords from '../component/MarkRecords'
import { handleFrom, handleData } from '@/views/client/clientlist/clientlist.js'
import Vue from 'vue'
export default {
  name: 'neworder',
  components: {
    MarkRecords
  },
  data() {
    const validatePhone = (rule, value, cb) => {
      const reg = /^[1][3-9][0-9]{9}$/
      if (reg.test(value)) {
        return cb()
      } else {
        return cb(new Error('请输入有效的手机号'))
      }
    }
    return {
      reset: 0,
      boxHeight: '500px',
      resetData: {}, // 表单初始化数据
      fieldData: [], //请求字段数据
      savePassLoading: false, // 保存loading
      orderForm: {
        title: '', // 标题
        desc: '', // 描述
        custom: '', //客户id
        dealing: [] //处理人id
      }, // 表单数据
      ruleNewOrder: {
        title: [
          {
            required: true,
            message: '请填写工单主题',
            trigger: 'blur'
          }
        ],
        custom: [
          {
            required: true,
            type: 'string',
            message: '请填写客户手机号'
          },
          { validator: validatePhone, trigger: 'blur' }
        ], //客户id
        dealing: [
          {
            required: true,
            type: 'array',
            message: '请选择处理人',
            trigger: 'change'
          }
        ] //处理人id
      }, // 验证规则
      isReplyClass: false, //提交顶部弹出
      otherField: [], // 其他字段
      loading1: false, // select远程搜索loading控制
      custList: [], // 客户列表
      dealList: [], // 处理人列表
      fieldModal: false, // 新增客户模态框
      formData: {}, // 新增客户表单
      resetCustData: {}, // 重置客户表单
      ruleForm: {}, // 新增客户验证规则
      itemData: [], // 新增客户表单字段
      modalBtnLoading: false, // 新增客户表单字段
      showNoList: false, // 无匹配数据
      selectedData: [], //级联选择的data
      imgListData: [], // 当前要上传到服务器的文件数据
      remoLabel: '', // 仅在 remote 模式下，初始化时使用。因为仅通过 value 无法得知选项的 label，需手动设置。
      isMyself: false, // 判断当前选择的处理人是否是本人
      searchData: [],
      searchModal: false,
      phone: ''
    }
  },
  methods: {
    getOrderForm() {
      let vm = this
      // 请求动态表单字段
      this.axios
        .get('/apiweb/work/WorkListForm', {
          params: {
            FlagId: 1
          }
        })
        .then(res => {
          vm.fieldData = res.data
          let nowFileData = JSON.parse(JSON.stringify(res.data))
          // 设置动态form的modal 和 rule
          let handleData = handleFrom(nowFileData)
          //   vm.orderForm = handleData[0].concat(vm.orderForm);
          for (var p in handleData[0]) {
            vm.orderForm[p] = handleData[0][p]
          }
          vm.orderForm = handleData[0] // 将处理的formdata 传到data中
          if (vm.reset < 1) {
            // 此处暂存初始化的值，点击新增按钮时初始化表单数据使用
            let nowData = JSON.parse(JSON.stringify(vm.orderForm)) // 深拷贝
            vm.resetData = nowData // 重置存储
            vm.reset += 1
          }
          //   vm.ruleNewOrder = handleData[1];
          for (var p in handleData[1]) {
            vm.ruleNewOrder[p] = handleData[1][p]
          }

          // vm.ruleNewOrder = handleData[1]; // 将处理后的验证规则传到data中
          vm.otherField = handleData[2]
          let user = []
          let forL = []
          let t = 0
          function forId(arr, id, node) {
            for (let i = 0; i < arr.length; i++) {
              if (t !== 0) return
              user[node] = arr[i].value
              forL[node] = { Flag: arr[i].Flag, id: arr[i].id }
              if (arr[i].id == id && arr[i].Flag === 1) {
                t++
              }
              if (arr[i].children && arr[i].children.length > 0) {
                forId(arr[i].children, id, node + 1)
              }
            }
          }
          forId(this.dealList, Cookies.get('yh_web_UserId'), 0)
          if (t === 1) {
            Vue.nextTick(() => {
              Vue.set(this.orderForm, 'dealing', user)
            })
            // setTimeout(() => {
            //   Vue.set(this.orderForm, 'dealing', p)
            // }, 500)
            this.cascaChage([], forL)
          }
          Vue.nextTick(() => {
            Vue.set(this.orderForm, '56', '0')
            Vue.set(this.orderForm, '53', '0')
          })
        })
        .catch(function(err) {})
    },
    btnOk(a) {
      let vm = this
      if (vm.savePassLoading) {
        return
      }
      vm.savePassLoading = true
      vm.$refs['orderForm'].validate(valid => {
        if (valid) {
          // 必须将传入的obj做深拷贝处理，为了不让处理函数影响当前obj.
          let nowField = JSON.parse(JSON.stringify(vm.fieldData))
          let nowForm = JSON.parse(JSON.stringify(vm.orderForm))
          let saveData = handleData(nowField, nowForm)
          saveData = JSON.parse(saveData)
          // 处理主题和描述
          for (let item of saveData) {
            if (item.SysField == 'WorkSubject') {
              item.FieldMemo = vm.orderForm.title
              item.Checked = vm.orderForm.title
            }

            if (item.SysField == 'WorkDetail') {
              item.FieldMemo = vm.orderForm.desc
              item.Checked = vm.orderForm.desc
            }

            if (item.SysField == 'WorkStatus') {
              item.FieldMemo = a
              item.Checked = a
            }
          }
          // 处理人
          let dealData = vm.selectedData[vm.selectedData.length - 1]
          // 转字符串
          // saveData = JSON.stringify(saveData);
          let url = '/apiweb/work/AddWorkOrder'
          let sendData = {
            CustTotalId: vm.orderForm.custom, // 客户id
            DealData: [
              {
                DealId: dealData.id, //处理者id，
                DealFlag: dealData.Flag //处理者标记（0表示组，1表示人）
              }
            ],
            objectData: saveData, // 工单表单数据
            fileData: vm.imgListData
          }
          vm.axios
            .post(url, sendData)
            .then(res => {
              if (res.data.ok) {
                vm.$message.success(res.data.msg)
                vm.savePassLoading = false
                // 跳转到工单列表
                vm.$router.push({
                  name: 'orderlist'
                })
                // 清空表单数据
                this.$refs['orderForm'].resetFields()
                let user = []
                let forL = []
                let t = 0
                function forId(arr, id, node) {
                  for (let i = 0; i < arr.length; i++) {
                    if (t !== 0) return
                    user[node] = arr[i].value
                    forL[node] = { Flag: arr[i].Flag, id: arr[i].id }
                    if (arr[i].id == id && arr[i].Flag === 1) {
                      t++
                    }
                    if (arr[i].children && arr[i].children.length > 0) {
                      forId(arr[i].children, id, node + 1)
                    }
                  }
                }
                forId(this.dealList, Cookies.get('yh_web_UserId'), 0)
                if (t === 1) {
                  Vue.nextTick(() => {
                    Vue.set(this.orderForm, 'dealing', user)
                    Vue.set(this.orderForm, '56', '0')
                    Vue.set(this.orderForm, '53', '0')
                  })
                  // setTimeout(() => {
                  //   Vue.set(this.orderForm, 'dealing', p)
                  // }, 500)
                  this.cascaChage([], forL)
                }
              } else {
                vm.$message.error(res.data.msg)
                vm.savePassLoading = false
              }
            })
            .catch(function(err) {
              vm.$message.error('提交失败！')
              vm.savePassLoading = false
            })
        } else {
          vm.savePassLoading = false
        }
      })
    },
    btnBlur() {
      let vm = this
      setTimeout(function() {
        vm.isReplyClass = false
      }, 200)
    },
    getImgList(obj) {
      let vm = this
      let formData = new FormData()
      formData.set('file', obj.file)
      this.axios({
        url: '/apiweb/upload/UploadFiles',
        method: 'post',
        onUploadProgress: function(progressEvent) {
          //原生获取上传进度的事件
          if (progressEvent.lengthComputable) {
            //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
            //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
            // _this.$nextTick(() => {
            //   _this.precent = loaded / total * 100;
            // });
          }
        },
        data: formData
      })
        .then(res => {
          vm.imgListData.push(res.data)
          let mowData = vm.imgListData.splice(0)
          vm.$nextTick(function() {
            vm.imgListData = mowData
          })
        })
        .catch(function(err) {})
    },
    delImg(i) {
      let vm = this
      this.$confirm('此操作将删除当前上传的文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          vm.imgListData.splice(i, 1)
          let mowData = vm.imgListData.splice(0)
          vm.$nextTick(function() {
            vm.imgListData = mowData
            vm.$message.success('删除成功！')
          })
        })
        .catch(() => {})
    },
    getCustList(query = '') {
      let vm = this
      if (query !== '') {
        this.loading1 = true
        this.axios
          .get('/apiweb/work/WorkCustList', {
            params: {
              keyWord: query //搜索关键字，没有时传空
            }
          })
          .then(res => {
            vm.loading1 = false
            let list = res.data.map(item => {
              return {
                value: item.id,
                label: item.value
              }
            })
            vm.custList = list.filter(
              item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
            )
          })
          .catch(function(err) {})
      } else {
        // 获取客户列表
        this.axios
          .get('/apiweb/work/WorkCustList', {
            params: {
              keyWord: '' //搜索关键字，没有时传空
            }
          })
          .then(res => {
            let list = res.data.map(item => {
              return {
                value: item.id,
                label: item.value
              }
            })
            vm.custList = list
          })
          .catch(function(err) {})
      }
    },
    toggleAn(a) {},
    cascaChage(val, data) {
      let vm = this
      this.selectedData = data
      if (data[data.length - 1].id == Cookies.get('yh_web_UserId')) {
        vm.isMyself = true
      } else {
        vm.isMyself = false
      }
    },
    bisibleDone(val) {},
    getCustInit() {
      let vm = this
      // 获取新增用户表单字段
      this.axios
        .get('/apiweb/cust/CustFormList', {
          params: {
            FlagId: 2
          }
        })
        .then(res => {
          vm.itemData = res.data
          let nowFileData = JSON.parse(JSON.stringify(res.data))
          // 设置动态form的modal 和 rule
          let handleData = handleFrom(nowFileData)
          vm.formData = handleData[0]
          if (vm.reset < 1) {
            // 此处暂存初始化的值，点击新增按钮时初始化表单数据使用
            let nowData = JSON.parse(JSON.stringify(vm.formData)) // 深拷贝
            vm.resetCustData = nowData // 重置存储
            vm.reset += 1
          }
          vm.ruleForm = handleData[1]
        })
        .catch(function(err) {})
      // 获取用户组列表
      this.axios
        .get('/apiweb/work/WorkGroupUserList', {
          params: {}
        })
        .then(res => {
          this.dealList = res.data
        })
        .catch(function(err) {})
    },
    newCustom() {
      let vm = this
      this.$refs['dynamic'].resetFields()
      // 先初始化表单
      this.formData = JSON.parse(JSON.stringify(vm.resetCustData)) // 深拷贝，不用指针指向，防止污染初始化data;
      this.fieldModal = true
    },
    saveCust() {
      // 保存新增的用户
      let vm = this
      if (vm.modalBtnLoading) {
        return
      }
      vm.modalBtnLoading = true
      vm.$refs['dynamic'].validate(valid => {
        if (valid) {
          // 必须将传入的obj做深拷贝处理，为了不让处理函数影响当前obj.
          let nowField = JSON.parse(JSON.stringify(vm.itemData))
          let nowForm = JSON.parse(JSON.stringify(vm.formData))
          let saveData = handleData(nowField, nowForm)
          // 默认新增
          let url = '/apiweb/cust/AddCustomer'
          let sendData = JSON.parse(saveData)
          // 如果为 编辑做相应处理
          vm.axios
            .post(url, { objectData: sendData })
            .then(res => {
              if (res.data.ok) {
                vm.$message.success(res.data.msg)
                vm.fieldModal = false
                vm.modalBtnLoading = false
                vm.custList = [
                  {
                    value: res.data.CustTotalId,
                    label: res.data.CustMsg
                  }
                ]
                vm.orderForm.custom = res.data.CustTotalId
                vm.remoLabel = res.data.CustMsg
              } else {
                vm.$message.error(res.data.msg)
                vm.fieldModal = false
                vm.modalBtnLoading = false
              }
            })
            .catch(function(err) {
              vm.modalBtnLoading = false
            })
        } else {
          vm.modalBtnLoading = false
        }
      })
    },
    showTopCaret() {
      if (!this.isMyself) {
        // 如果选择的处理人不是当前登陆的userid
        // 不显示
        this.isReplyClass = false
        // 提示
        this.$message.warning(
          '无法选择处理完毕，请先将处理人选为当前账号本人。'
        )
        return
      }
      // 小三角切换状态
      this.isReplyClass = !this.isReplyClass
    },
    searchOrder() {
      const _this = this
      this.phone = this.orderForm.custom
      _this.$refs.orderForm.validateField('custom', function(err) {
        if (!err) {
          _this.axios
            .get('/apiweb/work/phone', {
              params: { phone: _this.orderForm.custom }
            })
            .then(res => {
              if (res.data.length > 0) {
                _this.searchModal = true
                _this.searchData = res.data
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    toOper(row, index) {
      this.searchModal = false
      this.$router.push({
        path: `workoper/workoper/${row.WorkTotalId}`
      })
    },
    formatDate(time) {
      if (!!time) {
        let date = new Date(parseInt(time.substr(6, 13)))
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let hour = date.getHours()
        let minute = date.getMinutes()
        let second = date.getSeconds()
        return (
          year +
          '/' +
          month +
          '/' +
          day +
          '  ' +
          hour +
          ':' +
          minute +
          ':' +
          second
        )
      } else {
        return ''
      }
    },
    toData(data) {
      this.orderForm['90'] = this.formatDate(data['DAIL_TIME'])
      this.orderForm['131'] = (data['Province'] || '') + (data['City'] || '')
      this.orderForm['99'] = data['BusinTitle']
      this.orderForm['105'] = data['Account']
      this.orderForm['106'] = data['RealName']
      const Plats = this.fieldData[11]['options']
      for (let i = 0; i < Plats.length; i++) {
        const platName = Plats[i]['value']
          .replace('办事处', '')
          .replace('职场', '')
          .replace('郑州', '')
        if (
          platName ===
          data['PlatName']
            .replace('办事处', '')
            .replace('职场', '')
            .replace('郑州', '')
        ) {
          this.orderForm['103'] = i + ''
          return
        }
      }
    }
  },
  mounted() {
    this.boxHeight = window.innerHeight - 210 + 'px'
    this.$refs['orderForm'].resetFields()
    this.getCustList() // 获取客户列表
    this.getCustInit() // 获取客户表单数据和处理人
    this.getOrderForm() // 获取表单数据
  },
  watch: {
    'orderForm.dealing': function(item, value) {
      console.log(item, value)
    }
  }
}
</script>

