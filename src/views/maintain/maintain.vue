<style lang="less">
@import './maintain.less';
</style>

<template>
  <div class="container">
    <Card dis-hover>
      <Row :gutter="10" class="hadle-box" style="margin-top:10px;">
        <Col :span="colWidth" class="filter-box">
        <div class="group-content">
          <div class="item">
            <Cascader :data="areaData" @on-change="areaSelDone" placeholder="请选择所属区域" v-model="areaId"></Cascader>
          </div>
          <div class="item">
            <Select v-model="classId" @on-change="orgSelDone" placeholder="请选择所属组织">
              <Option v-for="item in orgList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="item">
            <Select v-model="groupId" placeholder="请选择所属网格">
              <Option v-for="item in gridList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
        </div>
        <Input v-model="keyWord" icon="ios-search" placeholder="请输入关键字" style="width: 240px; margin:0 12px;"></Input>
        <Button type="primary" @click="intitTable">
          <i class="iconfont icon-shaixuan" style="line-height:15px;vertical-align:middle;"></i> 筛选
        </Button>
        </Col>
        <Col :span="24 - colWidth" class="btn-box">
        <Button type="success" icon="plus" @click="openModal()">新增</Button>&nbsp;&nbsp;&nbsp;
        <Button type="error" icon="trash-b" ghost @click="delManager">删除</Button>
        <!-- <Dropdown style="margin-left: 14px" @on-click="selectMenu" trigger="click">
          <Button type="success">
            批量操作
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="1">删除</DropdownItem>
          </DropdownMenu>
        </Dropdown> -->
        </Col>
      </Row>
      <Table stripe :show-overflow-tooltip="true" :columns="tableColumns" @on-selection-change="onSelect" :loading="loading" :data="tableData.data " :height="tableHeight" style="margin-bottom:14px;"></Table>
      <div style="text-align: right; padding-right: 14px;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="curnPage" background :page-sizes="[30, 50]" :page-size="sizePage" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
        </el-pagination>
      </div>
    </Card>
    <Modal v-model="formModal" :width="720 " :styles="{ 'margin-right': '0', 'height': 'calc(100% - 100px)'} " :transfer="false " :transition-names="[ 'move-right', 'fade'] ">
      <h3 slot="header" style="color:#2D8CF0">{{modalTitle}}</h3>
      <Form ref="manager" :model="managerForm" :label-width="100" label-position="right" :rules="rulesManager">
        <FormItem label="经理姓名：" prop="name">
          <Input v-model="managerForm.name" placeholder="请填写装维经理姓名"></Input>
        </FormItem>
        <FormItem label="经理电话：" prop="phone">
          <Input v-model="managerForm.phone" placeholder="请填写装维经理姓名"></Input>
        </FormItem>
        <FormItem v-if="!pwdTips" label="初始密码：" prop="pwd">
          <Input v-model="managerForm.pwd" type="password" placeholder="如果不填写，密码默认为123456"></Input>
        </FormItem>
        <FormItem v-if="pwdTips" label="初始密码：" prop="pwd">
          <Input v-model="managerForm.pwd" type="password" placeholder="如不需要修改密码，此项置空即可"></Input>
        </FormItem>
        <FormItem label="归属网格：" required :error="errorMsg1">
          <div class="item-content">
            <FormItem>
              <Cascader :data="areaData" @on-change="areaSelDone1" placeholder="请选择所属区域" v-model="managerForm.group1"></Cascader>
            </FormItem>
            <FormItem>
              <Select v-model="managerForm.group2" @on-change="orgSelDone1" placeholder="请选择所属组织">
                <Option v-for="item in orgList1" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Select v-model="managerForm.group3" @on-change="gridDone" placeholder="请选择所属网格">
                <Option v-for="item in gridList1" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </div>
        </FormItem>
        <FormItem label="配置权限：" v-if="!isEdit">
          <div class="item-content">
            <FormItem>
              <Cascader :data="areaData" @on-change="areaSelDone2" placeholder="请选择所属区域" v-model="managerForm.area1"></Cascader>
            </FormItem>
            <FormItem>
              <Select v-model="managerForm.area2" @on-change="orgSelDone2" placeholder="请选择所属组织">
                <Option v-for="item in orgList2" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Select v-model="managerForm.area3" placeholder="请选择所属网格">
                <Option v-for="item in gridList2" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="formModal = false">取消</Button>
        <Button type="primary" :loading="savePassLoading" @click="submit">保存</Button>
      </div>
    </Modal>
    <Modal v-model="permis" :width="720 ">
      <h3 slot="header" style="color:#2D8CF0">修改装维经理权限</h3>
      <Form :model="managerForm" label-position="right">
        <FormItem :error="errorMsg2" style="height: 300px; padding-top: 30px;">
          <div class="item-content" style="display: flex;">
            <FormItem style="flex: 1; margin-right: 5px;">
              <Cascader :data="areaData" @on-change="areaSelDone2" placeholder="请选择所属区域" v-model="managerForm.area1"></Cascader>
            </FormItem>
            <FormItem style="flex: 1; margin: 0 5px;">
              <Select v-model="managerForm.area2" @on-change="orgSelDone2" placeholder="请选择所属组织">
                <Option v-for="item in orgList2" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem style="flex: 1;  margin-left: 5px;">
              <Select v-model="managerForm.area3" placeholder="请选择所属网格">
                <Option v-for="item in gridList2" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="permis = false">取消</Button>
        <Button type="primary" :loading="savePowerLoading" @click="changePower">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
var md5 = require('md5')
export default {
  name: 'maintain',
  data() {
    const _this = this
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else {
        // 校验手机号是否符合规则
        if (/^1(3|4|5|7|8)\d{9}$/.test(value)) {
          // 校验是否重复
          this.axios
            .post('/apiweb/worker/exist/' + value + '/')
            .then(res => {
              // true已存在 false不存在
              if (res.data.exist) {
                callback(new Error('手机号已经存在'))
              } else {
                callback()
              }
            })
            .catch(function(err) {
              console.log(err)
            })
        } else {
          callback(new Error('手机号格式不正确'))
        }
      }
    }
    return {
      areaId: [], // 区域id
      classId: '', // 组织id
      groupId: '', // 网格id
      areaData: [], // 所属区域数据
      orgList: [], // 所属组织数据
      orgList1: [], // 所属组织数据
      orgList2: [], // 所属组织数据
      gridList: [], // 所属网格数据
      gridList1: [], // 所属网格数据
      gridList2: [], // 所属网格数据
      tableHeight: 500, // table表格高度
      colWidth: 14, // col宽度
      keyWord: '', // 关键字
      curnPage: 1, // 页码
      sizePage: 30, // 一页多少条
      loading: false, // 表格loading
      formModal: false, // modal控制
      checkedList: [], // table列表选中的集合
      nowcId: '', // 当前要操作的权限id
      savePowerLoading: false, // 保存权限
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '姓名',
          minWidth: 150,
          key: 'name'
        },
        {
          title: '手机号',
          minWidth: 150,
          key: 'phone'
        },
        {
          title: '所属区域',
          minWidth: 200,
          key: 'AreaName'
        },
        {
          title: '所属组织',
          minWidth: 200,
          key: 'ClassName'
        },
        {
          title: '所属网格',
          minWidth: 220,
          key: 'GroupName'
        },
        {
          title: '所属权限',
          minWidth: 220,
          key: 'areaView'
        },
        {
          title: '操作',
          minWidth: 40,
          fixed: 'right',
          align: 'center',
          key: 'Operation',
          render: (h, params) => {
            return h(
              'Dropdown',
              {
                props: {
                  trigger: 'click'
                },
                on: {
                  'on-click': name => {
                    console.log(name)
                    if (name === 1) {
                      // 编辑
                      _this.resetFrom()
                      _this.isEdit = true
                      _this.modalTitle = '编辑装维经理信息'
                      _this.setManger(params.row.Id)
                      _this.formModal = true
                    } else if (name === 2) {
                      _this.permis = true
                      _this.nowcId = params.row.Id
                      _this.resetFrom()
                    } else if (name === 3) {
                      // 单个删除
                      const arr = [params.row.Id]
                      _this.dealDelete(arr, 2)
                    }
                  }
                }
              },
              [
                h('i', {
                  style: {
                    cursor: 'pointer'
                  },
                  class: {
                    iconfont: true,
                    'icon-shezhi': true
                  }
                }),
                h(
                  'DropdownMenu',
                  {
                    slot: 'list'
                  },
                  [
                    h('DropdownItem', { props: { name: 1 } }, '编辑'),
                    h('DropdownItem', { props: { name: 2 } }, '权限'),
                    h('DropdownItem', { props: { name: 3 } }, '删除')
                  ]
                )
              ]
            )
          }
        }
      ], // 表头配置
      tableData: {
        data: [],
        total: 0
      }, // 表格体数据
      modalTitle: '', // modal标题
      managerForm: {
        name: '', // 经理姓名
        phone: '', // 经理电话
        pwd: '', // 密码
        group1: [], // 归属网格1
        group2: '', // 归属网格2
        group3: '', // 归属网格3
        area1: [], // 权限1
        area2: '', // 权限2
        area3: '' // 权限3
      }, // 表单数据
      rulesManager: {
        name: [
          {
            required: true,
            message: '请填写装维经理姓名',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            validator: validatePhone,
            trigger: 'blur'
          }
        ],
        pwd: [
          {
            min: 6,
            max: 12,
            message: '长度限制6-12位',
            trigger: 'blur'
          }
        ]
      }, // 表单验证规则
      errorMsg1: '', // 归属网格错误信息
      errorMsg2: '', // 权限修改错误信息
      pwdTips: false, // 新增/编辑密码项不同的提示
      permis: false, // 权限修改控制
      savePassLoading: false, // 保存loading
      isEdit: false // 是否处于编辑信息状态
    }
  },
  methods: {
    intitTable() {
      const _this = this
      // 获取获取装维经理列表数据
      this.axios
        .get('/apiweb/worker/', {
          params: {
            ClassId: _this.classId, // 组织
            GroupId: _this.groupId, // 网格
            AreaId:
              _this.areaId.length > 0
                ? _this.areaId[_this.areaId.length - 1]
                : null, // 区域
            limit: _this.sizePage, // 一页多少条数据
            index: _this.curnPage, // 页码
            keyWord: _this.keyWord // 关键字
          }
        })
        .then(res => {
          _this.tableData = res.data
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
    getOrgList(id, type) {
      const _this = this
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
          const nowType = type === 0 ? 'orgList' : 'orgList' + type
          _this[nowType] = res.data
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getGridList(id, type) {
      const _this = this
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
          const nowType = type === 0 ? 'gridList' : 'gridList' + type
          _this[nowType] = res.data
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    rulesGrid() {
      if (this.managerForm.group3 === '') {
        this.errorMsg1 = '归属网格必须选择到网格下（三项必选）'
        return false
      } else {
        this.errorMsg1 = ''
        return true
      }
    }, // 校验网格
    gridDone() {
      // 网格选择后校验
      this.rulesGrid()
    },
    areaSelDone(val, data) {
      // 区域级联选择完毕回调
      // 先清空后两级所有的数据
      this.classId = '' // 组织id
      this.groupId = '' // 网格id
      this.orgList = [] // 所属组织数据
      this.gridList = [] // 所属网格数据
      const nowId = val[val.length - 1]
      this.getOrgList(nowId, 0)
      this.areaId = val
    },
    orgSelDone(val) {
      // 所属组织下拉选择完毕
      // console.log(val)
      this.groupId = '' // 网格id
      this.getGridList(val, 0)
    },
    areaSelDone1(val, data) {
      // 区域级联选择完毕回调
      // 先清空后两级所有的数据
      this.managerForm.group2 = '' // 组织id
      this.managerForm.group3 = '' // 网格id
      this.orgList1 = [] // 所属组织数据
      this.gridList1 = [] // 所属网格数据
      const nowId = val[val.length - 1]
      this.getOrgList(nowId, 1)
      this.managerForm.group1 = val
    },
    orgSelDone1(val) {
      // 所属组织下拉选择完毕
      // console.log(val)
      this.managerForm.group3 = '' // 组织id
      this.getGridList(val, 1)
    },
    areaSelDone2(val, data) {
      // 区域级联选择完毕回调
      // 先清空后两级所有的数据
      this.managerForm.area2 = '' // 组织id
      this.managerForm.area3 = '' // 网格id
      this.orgList2 = [] // 所属组织数据
      this.gridList2 = [] // 所属网格数据
      const nowId = val[val.length - 1]
      this.getOrgList(nowId, 2)
      // 验证权限是否选择
      this.managerForm.area1 = val
      // console.log(this.managerForm.area1)
      if (this.managerForm.area1.length !== 0) {
        this.errorMsg2 = ''
      }
    },
    orgSelDone2(val) {
      // 所属组织下拉选择完毕
      // console.log(val)
      this.managerForm.area3 = '' // 组织id
      this.getGridList(val, 2)
      // console.log(this.managerForm.area2)
    },
    selectMenu(name) {
      // 批量操作选择回调
      // console.log(name)
      if (name === 1) {
        // 批量删除
        this.delManager()
      }
    },
    handleSizeChange(val) {
      // 条数发生改变
      this.intitTable()
    },
    handleCurrentChange(val) {
      // 页码发生改变
      this.intitTable()
    },
    onSelect(s) {
      // table选择发生改变
      this.checkedList = s
    },
    openModal() {
      const _this = this
      this.resetFrom()
      this.pwdTips = false
      this.isEdit = false
      this.modalTitle = '添加装维经理'
      this.formModal = true
    },
    resetFrom() {
      // 重置表单
      this.$refs['manager'].resetFields()
      this.managerForm.area1 = [] // 组织id
      this.managerForm.area2 = '' // 组织id
      this.managerForm.area3 = '' // 网格id
      this.managerForm.group1 = [] // 组织id
      this.managerForm.group2 = '' // 组织id
      this.managerForm.group3 = '' // 网格id
      this.orgList1 = [] // 所属组织数据
      this.orgList2 = [] // 所属组织数据
      this.gridList1 = [] // 所属网格数据
      this.gridList2 = [] // 所属网格数据
    },
    delManager() {
      // 批量删除处理函数
      const _this = this
      if (this.checkedList.length === 0) {
        this.$message.warning('请至少选择一条数据！')
        return
      }
      const ids = this.checkedList.map(v => {
        return v.Id
      })
      this.dealDelete(ids, 1)
    },
    dealDelete(arr, type) {
      const _this = this
      // 最终删除处理函数
      // 调用警告框，如果用户确定执行删除操作
      this.$confirm('此操作将删除您所选中的字段, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // console.log(arr)
          _this.axios
            .put('/apiweb/worker/', {
              ids: arr
            })
            .then(res => {
              // console.log(res.data)
              if (res.data.msg) {
                _this.$message.success(res.data.msg)
                _this.intitTable()
                if (type === 1) {
                  _this.checkedList = []
                }
              }
            })
            .catch(res => {
              _this.$message.error('操作失败！')
            })
        })
        .catch(() => {})
    },
    setManger(id) {
      const _this = this
      this.pwdTips = true
      // 查找级联数据
      let idArr = [] // id集合
      let dataArr = [] // data数据集合
      let t = 0 // 查找标记
      function findId(arr, id, node) {
        for (let i = 0; i < arr.length; i++) {
          if (t !== 0) return
          idArr[node] = arr[i].value
          dataArr[node] = { label: arr[i].label, value: arr[i].value }
          if (arr[i].value == id) {
            t++
          }
          if (arr[i].children && arr[i].children.length > 0) {
            findId(arr[i].children, id, node + 1)
          }
        }
      }
      // 向后台请求数据
      this.axios
        .get('/apiweb/worker/' + id + '/')
        .then(res => {
          console.log(res.data)
          if (res.data.name) {
            _this.managerForm.name = res.data.name
            _this.managerForm.phone = res.data.phone
            _this.getOrgList(res.data.areaId, 1)
            _this.getGridList(res.data.classId, 1)
            _this.managerForm.group2 = res.data.classId
            _this.managerForm.group3 = res.data.groupId
            findId(this.areaData, res.data.areaId, 0)
            _this.managerForm.group1 = idArr
          } else {
            _this.$message.error('无法获取到数据')
          }
        })
        .catch(err => {
          if (err.response.data.msg) {
            _this.$message.error(err.response.data.msg)
          } else {
            _this.$message.error('操作失败')
          }
        })
    },
    submit() {
      const _this = this
      this.savePassLoading = false
      this.$refs['manager'].validate(valid => {
        _this.rulesGrid()
        if (valid && _this.rulesGrid()) {
          // 开启button 的loading，禁止重复提交
          _this.savePassLoading = true
          // 处理要提交的数据
          const sData = {
            name: _this.managerForm.name,
            phone: _this.managerForm.phone,
            pwd: md5(
              _this.managerForm.pwd === '' ? '123456' : _this.managerForm.pwd
            ),
            groupId: _this.managerForm.group3
          }
          if (_this.managerForm.area2 === '') {
            // 为空判断第一个
            if (_this.managerForm.area1.length === 0) {
              // 空数组，传空给后台
              sData.areaId = null
              sData.type = null
            } else {
              // 不为空数组
              sData.areaId =
                _this.managerForm.area1[_this.managerForm.area1.length - 1]
              sData.type = 1
            }
          } else {
            // 不为空判断第三个
            if (_this.managerForm.area3 === '') {
              // 第三个为空，取第二个
              sData.areaId = _this.managerForm.area2
              sData.type = 2
            } else {
              // 第三个不为空，取第三个
              sData.areaId = _this.managerForm.area3
              sData.type = 3
            }
          }
          _this.axios
            .post('/apiweb/worker/', sData)
            .then(res => {
              // console.log(res.data)
              if (res.data.id) {
                _this.$message.success(res.data.msg)
                _this.savePassLoading = false
                _this.formModal = false
                _this.intitTable()
                _this.resetFrom()
              } else {
                _this.$message.error(res.data.msg)
                _this.savePassLoading = false
              }
            })
            .catch(res => {
              _this.$message.error('操作失败！')
              _this.savePassLoading = false
            })
        } else {
          _this.savePassLoading = false
        }
      })
    },
    changePower() {
      // 修改装维经理权限
      const _this = this
      if (_this.managerForm.area1.length === 0) {
        _this.errorMsg2 = '请至少选择一项'
        return
      }
      // 处理结果
      const pData = {}
      if (_this.managerForm.area2 === '') {
        // 为空判断第一个
        if (_this.managerForm.area1.length === 0) {
          // 空数组，传空给后台
          pData.areaId = null
          pData.type = null
        } else {
          // 不为空数组
          pData.areaId =
            _this.managerForm.area1[_this.managerForm.area1.length - 1]
          pData.type = 1
        }
      } else {
        // 不为空判断第三个
        if (_this.managerForm.area3 === '') {
          // 第三个为空，取第二个
          pData.areaId = _this.managerForm.area2
          pData.type = 2
        } else {
          // 第三个不为空，取第三个
          pData.areaId = _this.managerForm.area2
          pData.type = 3
        }
      }
      this.savePowerLoading = true
      // 发送请求给后台
      _this.axios
        .post('/apiweb/worker/view/' + this.nowcId + '/', pData)
        .then(res => {
          // console.log(res.data)
          _this.$message.success(res.data.msg)
          _this.savePowerLoading = false
          _this.permis = false
        })
        .catch(res => {
          _this.$message.error('操作失败！')
          _this.savePassLoading = false
        })
    }
  },
  mounted() {
    const _this = this
    this.tableHeight = window.innerHeight - 260
    if (window.innerWidth < 1460) {
      this.colWidth = 18
    } else {
      this.colWidth = 14
    }
    window.onresize = function() {
      _this.tableHeight = window.innerHeight - 260
      if (window.innerWidth < 1460) {
        _this.colWidth = 18
      } else {
        _this.colWidth = 14
      }
    }
    this.intitTable()
    this.getAreaList()
  }
}
</script>

