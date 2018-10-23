<style lang="less">
@import './clientlist.less';
</style>


<template>
  <div>
    <Card>
      <!-- 顶部标题 -->
      <p slot="title">
        <Icon type="person"></Icon>
        客户管理
      </p>
      <div>
        <Row class="field">
          <Col span="24">
          <div class="hadle-box">
            <div class="search-box">
              <Input placeholder="请输入查询条件" v-model="keyWord" class="input-with-search" style="margin-bottom: 2px;" @on-enter="getTableData">
              <Button slot="append" icon="ios-search" @click="getTableData"></Button>
              </Input>
            </div>
            <div class="btn-box">
              <Button type="success" @click="openModal(1)" icon="plus">新增</Button>&nbsp;&nbsp;&nbsp;
              <!-- <Button @click="openModal(2)" type="info" icon="compose" style="background-color: #2db7f5; border-color: #2db7f5;">编辑</Button>&nbsp;&nbsp;&nbsp; -->
              <Button @click="openModal(3)" type="error" icon="trash-b">删除</Button>
            </div>
          </div>
          <Table stripe :show-overflow-tooltip="true" @on-selection-change="onSelect" :loading="loading" :columns="columns1" :height="tableHeight" :data="tableData.data" style="margin-bottom: 10px;"></Table>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="curnPage" background :page-sizes="[30, 50]" :page-size="sizePage" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
          </Col>
        </Row>
      </div>
    </Card>
    <!-- 客户字段弹出框 -->
    <Modal v-model="fieldModal" :width="700" :styles="{'margin-right':'0','height':'calc(100% - 100px)'}" :transfer="false" :transition-names="['move-right','fade']">
      <h3 slot="header" style="color:#2D8CF0">{{modalTitle}}</h3>
      <Form ref="dynamic" :label-width="100" :model="formData" :rules="ruleForm">
        <FormItem v-for="(n,i) in fieldData" :key="i + 3.26" :label="n.FieldName + '：'" :prop="n.FieldId">
          <Input v-if="n.FieldType == 'input' || n.FieldType == 'number'　|| n.FieldType == 'regular'　|| n.FieldType == 'url'　|| n.FieldType == 'tel'　|| n.FieldType == 'phone'　|| n.FieldType == 'ip'　|| n.FieldType == 'email'" :placeholder="'请填写' + n.FieldName" v-model="formData[n.FieldId]"></Input>
          <Input v-if="n.FieldType == 'textarea'" type="textarea" :autosize="{minRows: 4,maxRows: 20}" :placeholder="'请填写' + n.FieldName" v-model="formData[n.FieldId]"></Input>
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
        <Button type="primary" :loading="savePassLoading" @click="btnOk">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { handleFrom, handleData } from './clientlist'

export default {
  name: 'clientlist',
  data() {
    return {
      formData: {},
      ruleForm: {},
      resetData: {},
      reset: 0,
      fieldData: [],
      ComId: Cookies.get('yh_web_ComId'),
      keyWord: '', // 搜索框关键字
      fieldModal: false, // 表单模态框显示
      modalTitle: '新增客户',
      savePassLoading: false, // 保存loading
      columns1: [],
      tableData: { data: [], total: 0 },
      checkedList: [],
      curnPage: 1,
      sizePage: 30,
      FlagId: 2,
      loading: false, // 表格loading
      tableHeight: 500
    }
  },
  methods: {
    /* 处理打开moddal层操作：新增/编辑/删除*/
    openModal(a) {
      let vm = this
      this.$refs['dynamic'].resetFields()
      // 先初始化表单
      this.formData = JSON.parse(JSON.stringify(vm.resetData)) // 深拷贝，不用指针指向，防止污染初始化data;
      // 处理打开，新增/编辑
      if (a == 1) {
        this.modalTitle = '新增客户'
        this.fieldModal = true
      } else if (a == 2) {
        this.modalTitle = '编辑客户'
        // 判断用户是否选择了一条数据
        if (this.checkedList.length == 0 || this.checkedList.length > 1) {
          this.$message({
            message: '请选择一条数据再进行操作',
            type: 'warning'
          })
          return
        }
        // 调用查询单条并设置数据进modal框中
        // this.setFeild();
      } else if (a == 3) {
        // 删除用户，先判定用户是否选择了一条或多条数据
        if (this.checkedList.length == 0) {
          this.$message({
            message: '请至少选择一条数据再进行操作',
            type: 'warning'
          })
          return
        } else {
          this.delField()
        }
      }
    },
    setFeild(a) {
      let vm = this
      this.modalTitle = '编辑客户'
      // console.log(this.checkedList);
      this.checkedList = []
      this.checkedList.push(a)
      this.axios
        .get('/apiweb/cust/CustDetail', {
          params: {
            FlagId: '2', //类型（测试数据1）
            CustFieldId: a //客户id
          }
        })
        .then(res => {
          // console.log(res.data);
          // console.log(vm.formData);
          for (let item of res.data) {
            // console.log(item);
            switch (item.FieldType) {
              case 'select':
                //下拉单选
                vm.formData[item.FieldId] = item.Checked
                break
              case 'radio':
                // radio 单选
                vm.formData[item.FieldId] = item.Checked
                break
              case 'multipleselect':
                // 下拉多选
                break
              case 'checkbox':
                let checkArr = []
                try {
                  checkArr = item.Checked.replace(/[\[\]\'\s]/g, '') // 去掉中括号 单引号 空格
                } catch (err) {
                  console.log('checkbox类型转数组错误')
                  console.log(err)
                }
                // console.log(checkArr.split(","));
                vm.formData[item.FieldId] = checkArr.split(',')
                break
              default:
                vm.formData[item.FieldId] = item.FieldMemo
            }
          }
          this.fieldModal = true
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    delField() {
      const vm = this
      // 调用警告框，如果用户确定执行删除操作
      this.$confirm('此操作将删除您所选中的字段, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log(vm.checkedList)
          let idList = vm.checkedList.map(item => item.CustFieldId)
          let nameList = vm.checkedList.map(item => item.CustName)
          console.log(idList.join(','))
          console.log(nameList.join(','))
          vm.axios
            .get('/apiweb/cust/DeleteCust', {
              params: {
                CustFieldId: idList.join(','),
                CustName: nameList.join(',')
              }
            })
            .then(res => {
              if (res.data.ok) {
                vm.$message.success(res.data.msg)
                vm.getTableData()
              } else vm.$message.error(res.data.msg)
            })
            .catch(res => {
              vm.$message.error('操作失败！')
            })
        })
        .catch(() => {})
    },
    /*新增/编辑提交*/
    btnOk() {
      let vm = this
      if (vm.savePassLoading) {
        return
      }
      vm.savePassLoading = true
      vm.$refs['dynamic'].validate(valid => {
        if (valid) {
          // 必须将传入的obj做深拷贝处理，为了不让处理函数影响当前obj.
          let nowField = JSON.parse(JSON.stringify(vm.fieldData))
          let nowForm = JSON.parse(JSON.stringify(vm.formData))
          // console.log(nowField);
          // console.log(nowForm);
          let saveData = handleData(nowField, nowForm)
          console.log(JSON.parse(saveData))
          // 默认新增
          let url = '/apiweb/cust/AddCustomer'
          let sendData = {
            objectData: JSON.parse(saveData)
          }
          // 如果为 编辑做相应处理
          if (vm.modalTitle == '编辑客户') {
            url = '/apiweb/cust/UpdateCustomer'
            sendData.CustFieldId = vm.checkedList[0]
          }

          vm.axios
            .post(url, sendData)
            .then(res => {
              console.log(res.data)
              if (res.data.ok) {
                vm.$message.success(res.data.msg)
                vm.fieldModal = false
                vm.savePassLoading = false
                vm.getTableData()
              } else {
                vm.$message.error(res.data.msg)
                vm.fieldModal = false
                vm.savePassLoading = false
              }
            })
            .catch(function(err) {
              console.log(err)
              vm.savePassLoading = false
            })
        } else {
          vm.savePassLoading = false
        }
      })
    },
    onSelect(s) {
      this.checkedList = s
    },
    /*页数*/
    handleSizeChange(val) {
      this.sizePage = val
      this.getTableData()
    },
    /*页码*/
    handleCurrentChange(val) {
      // console.log(val)
      this.curnPage = val
      this.getTableData()
    },
    tableInit() {
      let vm = this
      this.axios
        .get('/apiweb/cust/CustTableTitle', {
          params: {
            FlagId: '2' //类型(测试数据1)
          }
        })
        .then(res => {
          console.log(res.data)
          let thead = []
          res.data.forEach((item, index) => {
            let nowItem = {
              title: item.FieldName,
              key: item.FieldId,
              width: item.ShowSize,
              minWidth: item.minSize,
              render: (h, params) => {
                let vm = this
                let nowReslt = params.row[item.FieldId]
                if (nowReslt == null || nowReslt == '') {
                  nowReslt = '无'
                }
                return h('span', {}, nowReslt)
              }
            }
            if (index == 0) {
              let nowItem1 = {
                type: 'selection',
                width: 60,
                fixed: 'left',
                align: 'center'
              }
              thead.push(nowItem1)
              // console.log(item);
              let nowItem2 = {
                title: item.FieldName,
                key: item.FieldId,
                width: 180,
                fixed: 'left',
                render: (h, params) => {
                  // console.log(params);
                  let vm = this
                  let uName = params.row.CustName
                  let tips = '点击编辑' + uName + '的信息'
                  let groupId = params.row.CustFieldId
                  return h(
                    'div',
                    {
                      attrs: {
                        class: 'table-name'
                      },
                      style: {
                        overflow: 'hidden',
                        height: '100%',
                        width: '100%',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }
                    },
                    [
                      h('span', {
                        style: {
                          lineHeight: '42px'
                        },
                        domProps: {
                          innerHTML: uName
                        }
                      }),
                      h(
                        'el-tooltip',
                        {
                          props: {
                            effect: 'dark',
                            content: tips,
                            placement: 'right'
                          },
                          style: {
                            float: 'right'
                          }
                        },
                        [
                          h('Button', {
                            props: {
                              type: 'text',
                              icon: 'compose'
                            },
                            style: {
                              float: 'right',
                              color: '#2d8cf0',
                              fontSize: '18px'
                            },
                            on: {
                              click: event => {
                                // 阻止冒泡事件
                                event.stopPropagation()
                                vm.setFeild(groupId)
                              }
                            }
                          })
                        ]
                      )
                    ]
                  )
                }
              }
              thead.push(nowItem2)
            } else {
              thead.push(nowItem)
            }
          })

          vm.columns1 = thead
          console.log(vm.columns1)
          vm.getTableData()
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getTableData() {
      let vm = this
      vm.loading = true
      this.axios
        .get('/apiweb/cust/CustTableList', {
          params: {
            FlagId: '2', //类型（测试数据1）
            currentpage: vm.curnPage, //当前页
            pagesize: vm.sizePage, //页大小
            keyWord: vm.keyWord //关键字
          }
        })
        .then(res => {
          console.log(res.data)
          // 处理系统字段
          let nowData = res.data.data[0]
          vm.tableData.total = res.data.total
          let result = []
          for (let item of nowData) {
            // console.log(item);
            for (let key in item) {
              if (!item[key]) {
                item[key] = '无'
              }
            }
            result.push(item)
          }
          vm.tableData.data = result
          vm.loading = false
        })
        .catch(function(err) {
          console.log(err)
          vm.loading = false
        })
    },
    formInit() {
      let vm = this
      // 请求动态表单字段
      this.axios
        .get('/apiweb/cust/CustFormList', {
          params: {
            FlagId: 2
          }
        })
        .then(res => {
          // console.log(res.data);
          vm.fieldData = res.data
          let nowFileData = JSON.parse(JSON.stringify(res.data))
          // 设置动态form的modal 和 rule
          let handleData = handleFrom(nowFileData)
          // console.log(handleData);
          vm.formData = handleData[0]
          if (vm.reset < 1) {
            // 此处暂存初始化的值，点击新增按钮时初始化表单数据使用
            let nowData = JSON.parse(JSON.stringify(vm.formData)) // 深拷贝
            vm.resetData = nowData // 重置存储
            vm.reset += 1
            // console.log("执行：" + vm.reset + "次");
          }
          vm.ruleForm = handleData[1]
          // console.log(nowData);
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    optionRemove(index, sindex) {
      const vm = this
      if (!sindex) vm.fieldData.options.splice(index, 1)
      else vm.fieldData.options[index].children.splice(sindex, 1)
    },
    selectChange(value) {
      for (let i = 0; i < this.types.length; i++) {
        if (this.fieldData.FieldType == this.types[i].value) {
          this.typeInfo = this.types[i]
          this.fieldData.Regular = this.types[i].reg
          this.fieldData.options = this.types[i].options
          break
        }
      }
    }
  },
  watch: {},
  created() {
    this.tableInit() // 初始化table
  },
  mounted() {
    this.tableHeight = window.innerHeight - 307
    this.formInit()
  }
}
</script>
