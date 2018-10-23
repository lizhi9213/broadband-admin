<style lang="less">
@import './role.less';
</style>
<template>
  <div class="role_">
    <!-- 头部卡片 -->
    <Card>
      <p>提示：</p>
      <p>1. 超级管理员权限为系统默认，不可修改权限，不能被复制</p>
      <p>2. 操作权限是指该角色所能够使用操作的功能页面</p>
      <p>3. 用户列表是指拥有该角色身份的所有用户</p>
    </Card>
    <div class="hadle-box">
      <p class="title">角色操作</p>
      <Button type="success" @click="openModal(1)" icon="person-add">新增角色</Button>&nbsp;&nbsp;&nbsp;
      <Button v-if="admin != roleId" type="info" @click="openModal(2)" icon="person-stalker">复制角色</Button>
    </div>
    <!-- body卡片 -->
    <el-card class="body-card">
      <div class="role_flex">
        <div class="left-box">
          <Menu ref="leftMenu" theme="light" :active-name="admin" @on-select="selectItem">
            <MenuItem class="user-list" v-for="(n,i) in userData" :key="i+0.26" :name="n.value">
            <Icon type="person"></Icon>
            {{n.text}}（{{n.total}}人）
            <i v-if="admin != n.value" @click.stop="delUser(n.value,n.text)" title="删除此角色" style="color:#ed3f14;" class="el-icon-delete"></i>
            </MenuItem>
          </Menu>
        </div>
        <div class="power">
          <Tabs value="1">
            <TabPane name="1" label="操作权限">
              <el-collapse value="0" class="collapse">
                <el-collapse-item v-for="(n,i) in powerList" :key="i+1.65" :title="n.text" :name="i+''">
                  <div class="power-list">
                    <div slot="checkbox_list" v-if="n.id">
                      <el-checkbox v-for="(info,list) in n.children" @change="val => { checkChange(val,n.id,[i]) }" :key="list+1.65" :disabled="roleId == userData[0].value ? true : false" :value="info.isCheck">{{info.text}}</el-checkbox>
                    </div>
                    <Collapse value="0" v-if="!n.id">
                      <Panel v-for="(item,index) in n.children" :key="index+56" :name="index+''">
                        {{item.text}}
                        <div slot="content">
                          <el-checkbox v-for="(info,list) in item.children" @change="val => { checkChange(val,item.id,[i, index]) }" :key="list+1.65" :disabled="roleId == userData[0].value ? true : false" :value="info.isCheck">{{info.text}}</el-checkbox>
                        </div>
                      </Panel>
                    </Collapse>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </TabPane>
            <TabPane name="2" label="用户列表">
              <div class="hadle-group">
                <!-- <el-input placeholder="请输入查询条件" v-model="keyWord" class="input-with-search">
                    <el-button slot="append" @click="getUserList()" icon="el-icon-search"></el-button>
                  </el-input> -->
                <div class="input-with-search">
                  <Input placeholder="请输入查询条件" icon="ios-search" v-model="keyWord" @on-enter="getUserList">
                  </Input>
                  <!-- <Button type="primary" @click="getUserList" style="margin-left:14px;">
                    <Icon type="ios-search"></Icon> 搜索
                  </Button> -->
                </div>
                <Button type="success" @click="openModal(3)" icon="gear-a">设置用户</Button>
              </div>
              <Table stripe :columns="columns" height="400" :loading="loading" :data="tableData" style="margin-bottom: 30px;"></Table>
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="curnPage" background :page-sizes="[10, 20, 30, 40]" :page-size="sizePage" layout="total, sizes, prev, pager, next, jumper" :total="totalPage">
              </el-pagination>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </el-card>
    <!-- 弹出层页面 -->
    <Modal v-model="roleModal" :title="modalTitle" width="650">
      <Form ref="roleForm" :model="roleDate" :rules="ruleRole" :label-width="80">
        <FormItem label="角色名称" prop="name" :error="roleError">
          <Input v-model="roleDate.name" :disabled="isSetting" placeholder="请填写角色名称"></Input>
          <p>注：当前系统下的角色名称不能重复</p>
        </FormItem>
        <FormItem label="设置用户" prop="gender">
          <RadioGroup v-model="roleDate.gender">
            <Radio label="1" :disabled="isSetting">是</Radio>
            <Radio label="0" :disabled="isSetting">否</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <h3 v-if="roleDate.gender == '1'" style="margin-bottom: 10px;">请选择要设置该角色权限的用户：</h3>
      <div class="select-user-box" v-if="roleDate.gender == '1'">
        <div class="user-item" :class="{'checked': n.checkStatus == 1}" v-for="(n,i) in staffData" :key="i + 3.52" @click="toggleStaff(i)" :title="n.UserName">
          <Avatar size="large" class="user-photo" shape="square" :src="'/static/img/default_img.jpg' + n.UserImage" />
          <p>{{n.UserName}}</p>
          <sup class="ivu-badge-dot"></sup>
        </div>
      </div>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button v-if="isLoading" type="primary" loading>正在保存...</Button>
        <Button v-if="!isLoading" type="primary" @click="ok">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { handlePowerData } from './role'
import Cookies from 'js-cookie'
export default {
  name: 'role',
  data() {
    return {
      ComId: Cookies.get('yh_web_ComId'),
      userId: Cookies.get('yh_web_UserId'),
      isSetting: false, //是否是用户设置
      roleId: '', // 暂存当前选中到角色Id
      roleModal: false, // 弹出层控制
      modalTitle: '新增角色', // 弹出层标题切换
      roleDate: {
        // 表单数据
        name: '', // 名称
        gender: '0' // 是否展示选择用户
      },
      ruleRole: {
        // 表单验证
        name: [
          {
            required: true,
            message: '角色名称不能为空',
            trigger: 'blur'
          }
        ]
      },
      userData: [], // 角色列表
      powerList: [], //页面权限列表
      Opentype: 1,
      keyWord: '', // 用户查询关键字
      columns: [
        {
          title: '用户姓名',
          minWidth: 150,
          key: 'UserName'
        },
        {
          title: '用户电话',
          minWidth: 150,
          key: 'UserPhone'
        },
        {
          title: '用户邮箱',
          key: 'UserMail',
          minWidth: 200,
          render: (h, params) => {
            const row = params.row
            const text =
              row.UserMail == null || row.UserMail == '' ? '无' : row.UserMail
            return h('span', text)
          }
        },
        {
          title: '用户昵称',
          minWidth: 150,
          key: 'UserNick',
          render: (h, params) => {
            const row = params.row
            const text =
              row.UserMail == null || row.UserMail == '' ? '无' : row.UserMail
            return h('span', text)
          }
        }
      ],
      tableData: [],
      loading: false, // 用户表单刷新的loading
      checkedList: [], // 选中的用户数据暂存项
      totalPage: 0, // 当前角色所拥有用户总条数
      curnPage: 1, // 当前角色下用户列表页码
      sizePage: 10, // 当前角色下用户列表显示的条数
      staffData: [], // 员工数据
      isLoading: false, // 保存按钮的loading
      roleError: '', // 角色验证错误信息
      admin: '', //
      powListData: [] // 权限列表结构数据
    }
  },
  watch: {
    keyWord: function() {
      this.getUserList()
    }
  },
  methods: {
    //初始化获取角色列表
    init() {
      // console.log(appRouter);
      let vm = this
      // 获取左侧角色列表
      this.axios
        .get('/apiweb/role/GetRoleList', {
          params: {
            ComId: vm.ComId,
            RoleStatus: '1' // 角色状态
          }
        })
        .then(res => {
          // console.log("角色列表")
          // console.log(res.data);
          // 将默认打开的管理员的 id total初始化
          vm.userData = res.data
          vm.roleId = vm.roleId || vm.userData[0].value
          vm.admin = vm.userData[0].value
          vm.totalPage = vm.userData[0].total
          // console.log(vm.roleId);
          setTimeout(() => {
            // 初始化渲染显示管理员的权限结构表
            vm.setRolePowerList()
          }, 200)
          // 初始化当前角色下的用户，初始化显示超级管理员角色下的用户
          vm.getUserList()
          // 重新渲染左侧列表active数据
          vm.$nextTick(() => {
            vm.$refs.leftMenu.updateActiveName()
          })
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getPowerListData() {
      // 获取配置权限列表的视图结构数据
      this.axios
        .get('/apiweb/role/RoleAllPowerList', {
          params: {}
        })
        .then(res => {
          // console.log(res.data);
          this.powListData = res.data
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    setRolePowerList() {
      let vm = this
      this.axios
        .get('/apiweb/role/RoleUserPower', {
          params: {
            RoleId: vm.roleId
          }
        })
        .then(res => {
          // console.log(res.data);
          let listData = JSON.parse(JSON.stringify(vm.powListData))
          let powerData = JSON.parse(JSON.stringify(res.data))
          // console.log(powerData);
          if (listData != 0) {
            let nowData = handlePowerData(listData, powerData)
            vm.powerList = []
            vm.$nextTick(() => {
              vm.powerList = nowData
              // console.log(vm.powerList);
            })
          } else {
            console.log(
              '无法获取到权限结构列表的数据，请检查接口：/role/RoleAllPowerList'
            )
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    // 打开弹出层，判断是哪个按钮打开并做判断
    openModal(a) {
      this.$refs['roleForm'].resetFields()
      // 清除表单状态，清除用户选中状态
      this.roleError = ''
      this.isLoading = false
      this.isSetting = false
      this.roleDate = {
        name: '', // 名称
        gender: '0' // 是否展示选择用户
      }
      this.staffData.forEach(item => {
        item.checked = false
      })
      // 清空暂存列表
      this.checkedList = []

      this.Opentype = a
      let vm = this
      if (a == 1) {
        this.modalTitle = '新增角色'
        this.getStaffList()
      } else if (a == 2) {
        this.modalTitle = '复制角色'
        this.getStaffList(1)
        // 将角色信息填入
        this.userData.forEach(item => {
          if (item.value == vm.roleId) {
            this.roleDate.name = item.text
            return false
          }
        })
        this.roleDate.gender = '1' // 选择员工展开状态
      } else if (a == 3) {
        this.modalTitle = '设置用户'
        // 将角色名称填入input框中并设置当前选中id
        this.userData.forEach(item => {
          if (item.value == vm.roleId) {
            this.roleDate.name = item.text
            return false
          }
        })
        // 修改设置状态
        this.isSetting = true // 用户是否设置
        this.roleDate.gender = '1' // 选择员工展开状态
        // 更新员工数据，
        this.getStaffList(1)
      }
      // 打开弹窗
      this.roleModal = true
    },
    // 获取当前角色下的所有用户列表
    getUserList() {
      let vm = this
      // 打开loading
      vm.loading = true
      this.axios
        .get('/apiweb/role/GetRoleUserList', {
          params: {
            RoleId: vm.roleId, //角色id
            ComId: vm.ComId, //公司id
            keyWord: vm.keyWord,
            currentpage: vm.curnPage, //当前页
            pagesize: vm.sizePage //页大小
          }
        })
        .then(res => {
          // console.log(res.data);
          let result = res.data
          vm.tableData = result
          vm.loading = false
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    // 获取公司所有的员工
    getStaffList(a = '') {
      let vm = this
      let nowRid = -1
      if (a != '') {
        nowRid = vm.roleId
      }
      this.axios
        .get('/apiweb/role/RoleSetUserList', {
          params: {
            ComId: vm.ComId, //公司id
            RoleId: nowRid // 角色id为-1，表示要获取到公司所有的员工；
          }
        })
        .then(res => {
          // console.log(res.data);
          // 先处理选中状态
          let reslut = res.data
          vm.staffData = []
          vm.$nextTick(() => {
            vm.staffData = reslut
            // console.log(vm.staffData);
            // 处理选中暂存列表
            let checkList = []
            for (let item of reslut) {
              if (item.checkStatus == 1) {
                checkList.push(item)
              }
            }
            // console.log(checkList);
            vm.checkedList = checkList
          })
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    // 点击选择员工，切换状态并处理
    toggleStaff(i) {
      let vm = this
      this.staffData[i]['checkStatus'] == 0
        ? (this.staffData[i]['checkStatus'] = 1)
        : (this.staffData[i]['checkStatus'] = 0)
      // 将选择或者取消的员工数据存储和删除
      if (this.staffData[i]['checkStatus'] == 1) {
        this.checkedList.push(this.staffData[i])
      }
      // 回收取消选中的用户
      for (let [index, val] of this.checkedList.entries()) {
        // console.log(val)
        // console.log(index)
        if (val.checkStatus == 0) {
          vm.checkedList.splice(index, 1)
        }
      }

      // console.log(this.checkedList);
    },
    // 选择每页展示多少条
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.sizePage = val
      // 刷新用户列表
      this.getUserList()
    },
    // 选择当前页码
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.curnPage = val
      // 刷新用户列表
      this.getUserList()
    },

    //保存新增的角色/复制的角色
    saveRole() {
      let vm = this
      // 先处理用户是否选择了员工
      // console.log(this.checkedList);
      let nowId = -1
      if (this.roleDate.gender == '1' && this.checkedList.length != 0) {
        nowId = []
        // 处理id
        this.checkedList.forEach(item => {
          nowId.push(item.UserId)
        })
        nowId = nowId.join(',')
      }
      if (this.Opentype == 1) {
        //新增角色
        this.axios
          .get('/apiweb/role/AddRole', {
            params: {
              ComId: vm.ComId,
              RoleName: vm.roleDate.name,
              OperId: vm.userId,
              UserId: nowId
            }
          })
          .then(res => {
            // console.log(res.data);
            setTimeout(() => {
              if (res.data.ok) {
                vm.$message({
                  message: '保存成功！',
                  type: 'success'
                })
                vm.init()
                vm.isLoading = false
                vm.roleModal = false
              } else {
                vm.isLoading = false
                vm.roleModal = false
                vm.$message({
                  message: res.data.msg,
                  type: 'error'
                })
              }
            }, 500)
          })
          .catch(function(err) {
            console.log(err)
          })
      } else {
        //复制角色
        // console.log('复制角色')
        this.axios
          .get('/apiweb/role/CopyRole', {
            params: {
              ComId: vm.ComId,
              RoleName: vm.roleDate.name,
              OperId: vm.userId,
              UserId: nowId,
              RoleId: vm.roleId //角色id
            }
          })
          .then(res => {
            // console.log(res.data);
            setTimeout(() => {
              if (res.data.ok) {
                vm.isLoading = false
                vm.roleModal = false
                vm.init()
                vm.$message({
                  message: res.data.msg,
                  type: 'success'
                })
              } else {
                vm.isLoading = false
                vm.roleModal = false
                vm.$message({
                  message: res.data.msg,
                  type: 'error'
                })
              }
            }, 500)
          })
          .catch(function(err) {
            console.log(err)
          })
      }
    },
    // 保存设置角色下的用户
    setUsers() {
      // console.log("保存设置角色下的用户")
      // console.log(this.checkedList);
      let vm = this
      let nowId = ''
      let idArr = this.checkedList.map(item => {
        return item.UserId
      })
      // console.log(idArr);
      if (idArr.length != 0) {
        nowId = idArr.join(',')
      }
      // vm.isLoading = false;
      this.axios
        .get('/apiweb/role/RoleUserSet', {
          params: {
            UserId: nowId, //用户id（拼接的字符串）
            RoleId: vm.roleId //角色id
          }
        })
        .then(res => {
          // console.log(res.data);
          setTimeout(() => {
            if (res.data.ok) {
              vm.isLoading = false
              vm.roleModal = false
              vm.init()
              vm.$message({
                message: '保存成功！',
                type: 'success'
              })
            } else {
              vm.isLoading = false
              vm.roleModal = false
              vm.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          }, 500)
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    // 验证角色是否重复
    ok() {
      let vm = this
      // 打开loading
      this.isLoading = true
      // 验证表单
      this.$refs['roleForm'].validate(valid => {
        if (valid) {
          // 表单验证成功后再验证是否重复, 设置用户无需验证重复
          if (vm.Opentype != 3) {
            vm.axios
              .get('/apiweb/role/CheckRoleName', {
                params: {
                  ComId: vm.ComId,
                  RoleName: vm.roleDate.name
                }
              })
              .then(res => {
                // console.log(res.data);
                // 判断如果成功再调取保存按钮，如果不成功关闭loading并显示错误信息
                if (res.data.ok == 'true') {
                  // 名称不重复，调取保存保存函数
                  vm.saveRole()
                } else {
                  // 名称重复，关闭loading，显示error信息
                  vm.roleError = res.data.msg
                  vm.isLoading = false
                  // 如果用户关闭了弹窗，需要给用户提示
                  if (vm.roleModal == false) {
                    vm.$message({
                      message: '角色名称重复，请重新填写！',
                      type: 'warning'
                    })
                  }
                }
              })
              .catch(function(err) {
                console.log(err)
              })
          } else {
            // 用户设置，直接调用保存用户设置的函数
            vm.setUsers()
          }
        } else {
          // 关闭loading
          this.isLoading = false
        }
      })
    },
    cancel() {
      this.roleModal = false
      //this.$Message.info("Clicked cancel");
    },
    // 左侧选择角色的回调
    selectItem(name) {
      let vm = this
      // 获取到角色id并调用右侧权限列表展示
      // console.log(name);
      // 将当前选择的角色的用户总条数存储
      this.userData.forEach((item, list) => {
        if (item.value == name) {
          vm.totalPage = item.total
          return false
        }
      })
      // console.log("name:" + name);
      this.roleId = name // 将当前用户选择的角色id存储
      // 根据所选角色更新权限列表结构
      this.setRolePowerList()
      // 根据所选角色更新当前角色下的用户
      this.getUserList()
    },
    delUser(a, b) {
      let vm = this
      // console.log("删除id:" + a);
      this.$confirm('您确定要删除当前角色吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .get('/apiweb/role/UpdateStatus', {
              params: {
                ComId: vm.ComId, //公司id
                RoleStatus: -1, //角色状态
                OperId: vm.userId, //操作人
                RoleId: a, //角色id
                RoleName: b //角色名称
              }
            })
            .then(res => {
              if (res.data.ok == 'true') {
                vm.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                vm.init()
              } else {
                vm.$message({
                  type: 'error',
                  message: res.data.msg
                })
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    checkChange(...arr) {
      // console.log(this.powerList);
      // console.log(arr);
      // 先更新改变checkbox的值
      let checkIndex = arr[2]
      if (checkIndex.length === 1) {
        // 如果是一层折叠
        this.powerList[checkIndex[0]].children[0].isCheck = arr[0]
      } else {
        // 两层折叠
        // console.log(this.powerList[checkIndex[0]].children[checkIndex[1]]);
        this.powerList[checkIndex[0]].children[
          checkIndex[1]
        ].children[0].isCheck = arr[0]
      }
      // 再将id 和改变的值传给后台
      let isCheck = arr[0] ? 1 : 0
      this.saveCheckResult(arr[1], isCheck)
    },
    saveCheckResult(bid, isCheck) {
      // console.log(bid);
      // console.log(isCheck);
      let vm = this
      this.axios
        .get('/apiweb/role/RolePowerSet', {
          params: {
            RoleId: vm.roleId, //角色id
            PageId: bid, //按钮id
            Flag: isCheck //标记，0取消，1选中
          }
        })
        .then(res => {
          // console.log(res.data);
          if (res.data.ok) {
            vm.$message({
              message: res.data.msg,
              type: 'success'
            })
            // vm.setRolePowerList();
          } else {
            // console.log(res.data.ok);
            vm.$message.error(res.data.msg)
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    }
  },
  created() {
    this.init()
    this.getStaffList() // 获取公司所有员工
    this.getPowerListData() // 获取权限列表结构体数据
  }
}
</script>
