<style lang="less">
@import './userset.less';
</style>

<template>
  <div>
    <Card dis-hover>
      <div>
        <Row class="userset">
          <Col span="24">
          <div class="hadle-box" style="margin-top:10px;">
            <div class="search-box">
              <Input placeholder="请输入查询条件" icon="ios-search" v-model="keyWord" style="margin-bottom: 2px;width:240px;margin-right:12px;" @on-enter="init"></Input>
              <!-- <Button type="primary" @click="init">
                <Icon type="ios-search"></Icon> 搜索
              </Button> -->
            </div>
            <div class="btn-box">
              <Button type="success" @click="openModal(1)" icon="plus">新增</Button>&nbsp;&nbsp;&nbsp;
              <!-- <Button style="background-color: #2db7f5; border-color: #2db7f5;" type="primary" @click="openModal(2)" icon="compose">批量操作</Button>&nbsp;&nbsp;&nbsp; -->
              <Button type="error" @click="delUser" icon="trash-b">删除</Button>
            </div>
          </div>
          <Table stripe :columns="columns1" :height="tableHeight" :loading="loading" @on-row-click="checkedTr" @on-select="selectOne" @on-select-cancel="selectCan" :data="data1" style="margin-bottom: 30px;"></Table>
          <div style="text-align:right;padding-right:14px;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="curnPage" background :page-sizes="[10, 20, 30, 40]" :page-size="sizePage" layout="total, sizes, prev, pager, next, jumper" :total="totalPage">
            </el-pagination>
          </div>
          </Col>
        </Row>
      </div>
    </Card>
    <!--用户表单弹框 -->
    <Modal v-model="userModal" :title="modalTitle">
      <Form v-if="editRol" ref="editForm" :model="editData" :rules="ruleEdit" :label-width="100">
        <FormItem label="修改部门：" prop="userDepa">
          <Select v-model="editData.userDepa" filterable placeholder="请选择目标部门">
            <Option v-for="item in depaList" :value="item.DepartID" :key="item.DepartID">{{ item.DepartName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="修改角色：" prop="userRole">
          <Select v-model="editData.userRole" filterable placeholder="请选择目标角色">
            <Option v-for="item in roleList" :value="item.value" :key="item.value">{{ item.text }}</Option>
          </Select>
        </FormItem>
      </Form>
      <Form v-if="!editRol" ref="userForm" :model="userData" :rules="ruleUser" :label-width="100">
        <FormItem label="用户姓名：" prop="name" placeholder="请填写用户姓名">
          <Input v-model="userData.name"></Input>
        </FormItem>
        <!-- <FormItem label="用户密码：" prop="password" placeholder="请填写用户密码">
               <Input v-model="userData.password"></Input>
             </FormItem> -->
        <FormItem label="手机号：" prop="phone" placeholder="请填写手机号">
          <Input v-model="userData.phone" :disabled="modalTitle == '编辑用户'"></Input>
        </FormItem>
        <FormItem label="用户邮箱：" prop="email" placeholder="请填写电子邮箱">
          <Input v-model="userData.email"></Input>
        </FormItem>
        <FormItem label="用户昵称：" prop="nike" placeholder="请填用户昵称">
          <Input v-model="userData.nike"></Input>
        </FormItem>
        <FormItem label="签名：" prop="graph">
          <Input v-model="userData.graph" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请填写用户签名"></Input>
        </FormItem>
        <FormItem v-if="modalTitle == '编辑用户'" label="用户状态：" prop="status">
          <Select v-model="userData.status" placeholder="请选择用户状态">
            <Option value="1">正常</Option>
            <Option value="2">离职</Option>
            <Option value="0">禁用</Option>
            <Option value="-1">已删除</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" @click="ok">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { tableHead } from './userset'
import Cookies from 'js-cookie'
export default {
  name: 'userset',
  data() {
    let vm = this
    const validePhone = (rule, value, callback) => {
      var re = /^1[0-9]{10}$/
      if (!re.test(value)) {
        return callback(new Error('请输入正确格式的手机号！'))
      }
      if (vm.modalTitle == '编辑用户' && vm.oldPhone == value) {
        // console.log('编辑用户')
        return callback()
      }
      this.axios
        .get('/apiweb/user/CheckUserPhone', { params: { UserPhone: value } })
        .then(res => {
          // console.log(res.data);
          if (!res.data.ok) {
            callback(new Error(res.data.msg))
          } else {
            callback()
          }
        })
        .catch(res => {
          callback(new Error('验证失败！'))
        })
    }
    const valideRePassword = (rule, value, callback) => {
      if (value !== this.editPasswordForm.newPass) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      tableHeight: 570,
      ComId: Cookies.get('yh_web_ComId'), // 公司id,后期通过store获取
      userId: Cookies.get('yh_web_UserId'), // 当前用户Id
      keyWord: '',
      oldPhone: '', // 初始化后的电话号码
      modalTitle: '新增用户',
      loading: true, // 表格loading,默认打开，加载完成后关闭
      userModal: false, // 用户设置表单modalbum
      editRol: false,
      editData: {
        userDepa: '', // 批量更改为的部门id
        userRole: ''
      }, // 批量更改为的角色id
      ruleEdit: {},
      roleList: [], // 角色列表
      depaList: [], // 部门列表
      userData: {
        name: '', // 姓名
        password: '', // 密码
        phone: '', // 手机号
        email: '', // 邮箱
        nike: '', // 昵称
        graph: '', // 签名
        status: '1' // 用户状态
        // status: ""  // 头像
      }, // 操作用户表单数据集
      ruleUser: {
        name: [
          {
            required: true,
            message: '请填写用户姓名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请填写用户密码',
            trigger: 'blur'
          },
          { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
          { max: 32, message: '最多输入32个字符', trigger: 'blur' }
        ],
        phone: [
          {
            required: true,
            message: '请填写用户手机号',
            trigger: 'blur'
          },
          { validator: validePhone, trigger: 'blur' }
        ]
      }, // 验证表单
      columns1: [
        // thead
        {
          type: 'selection',
          width: 60,
          fixed: 'left',
          align: 'center'
        },
        {
          title: '姓名',
          key: 'UserName',
          fixed: 'left',
          width: 180,
          render: (h, params) => {
            // 使用vue render函数处理table中td里面的switch渲染及事件处理
            // console.log(params);
            let vm = this
            let name = params.row.UserName
            let tips = '点击编辑' + name + '的信息'
            let userData = params.row
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
                    lineHeight: '41px'
                  },
                  domProps: {
                    innerHTML: name
                  }
                }),
                h(
                  'el-tooltip',
                  {
                    //数据库1是已处理，0是未处理
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
                      //数据库1是已处理，0是未处理
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
                          // this.openModal(3,userData);
                          return vm.openModal(3, userData)
                        }
                      }
                    })
                  ]
                )
              ]
            )
          }
        },
        {
          title: '电话',
          minWidth: 150,
          key: 'UserPhone'
        },
        {
          title: '邮箱',
          minWidth: 200,
          key: 'UserMail',
          render: (h, params) => {
            const row = params.row
            const text =
              row.UserMail == null || row.UserMail == '' ? '无' : row.UserMail
            return h('span', text)
          }
        },
        {
          title: '头像',
          minWidth: 150,
          key: 'photo',
          render: (h, params) => {
            // 使用vue render函数处理table中td里面的switch渲染及事件处理
            console.log(params)
            let vm = this
            let imgUrl = params.row.UserImage.replace('.', '')
            let url = imgUrl === '' ? '/static/img/default_img.jpg' : imgUrl
            return h('img', {
              attrs: {
                src: url
              },
              style: {
                marginTop: '6px',
                display: 'inline-block',
                height: '40px',
                width: '40px'
              }
            })
          }
        },
        // {
        //   title: '部门',
        //   minWidth: 150,
        //   key: 'DepartName',
        //   render: (h, params) => {
        //     const row = params.row
        //     const text =
        //       row.DepartName == null || row.DepartName == ''
        //         ? '无'
        //         : row.DepartName
        //     return h('span', text)
        //   }
        // },
        {
          title: '角色',
          minWidth: 150,
          key: 'RoleName',
          render: (h, params) => {
            const row = params.row
            const text =
              row.RoleName == null || row.RoleName == '' ? '无' : row.RoleName
            return h('span', text)
          }
        },
        {
          title: '昵称',
          minWidth: 150,
          key: 'UserNick',
          render: (h, params) => {
            const row = params.row
            const text =
              row.UserNick == null || row.UserNick == '' ? '无' : row.UserNick
            return h('span', text)
          }
        }
        // {
        //   title: '是否在线',
        //   minWidth: 150,
        //   key: 'IsLine',
        //   render: (h, params) => {
        //     const row = params.row
        //     const color = row.online == 1 ? 'green' : '#ccc'
        //     const text = row.online == 1 ? '在线' : '下线'
        //     return h(
        //       'Tag',
        //       {
        //         props: {
        //           type: 'dot',
        //           color: color
        //         }
        //       },
        //       text
        //     )
        //   }
        // },
        // {
        //   title: '登录时间',
        //   minWidth: 200,
        //   key: 'LoginTime'
        // }
      ], //table 表头
      data1: [], // table 数据
      curnPage: 1, // 当前页码
      sizePage: 10, // 一页n条
      totalPage: 0, // 总页数
      keyWord: '', // 关键字查询
      checkedList: [], // 用户选中的列表
      ncUserId: '' // 当前所编辑的用户id
    }
  },
  watch: {
    keyWord: function() {
      this.init()
    }
  },
  methods: {
    openModal(a, b) {
      this.editRol = false // 每次打开要先初始化
      if (a == 1) {
        this.$refs['userForm'].resetFields()
        this.modalTitle = '新增用户'
        this.userData = {
          name: '', // 姓名
          password: '', // 密码
          phone: '', // 手机号
          email: '', // 邮箱
          nike: '', // 昵称
          graph: '', // 签名
          status: '1' // 用户状态
          // status: ""  // 头像
        }
        this.userModal = true
      } else if (a == 2) {
        // this.$refs["editForm"].resetFields();
        this.modalTitle = '批量操作'
        this.editData = {
          userDepa: '',
          userRole: ''
        }
        // 先判断用户是否选择了数据(一条或者多条)，选择的不符合规则就提示
        if (this.checkedList.length == 0) {
          this.$message({
            message: '请至少选择一条数据进行操作！',
            type: 'warning'
          })
          return
        } else {
          this.userModal = true
          this.editRol = true //
        }
      } else if (a == 3) {
        this.$refs['userForm'].resetFields()
        this.modalTitle = '编辑用户'
        this.ncUserId = b.UserId // 设置当前所编辑的用户的ID
        this.setUser(b)
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.sizePage = val
      this.init()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.curnPage = val //当前页
      this.init()
    },
    setUser(data) {
      console.log(data)
      // 保存手机号以判断用户是否修改了手机号
      this.oldPhone = data.UserPhone
      //填充数据
      this.userData = {
        name: data.UserName, // 姓名
        password: data.UserPWD, // 密码
        phone: data.UserPhone, // 手机号
        email: data.UserMail, // 邮箱
        nike: data.UserNick, // 昵称
        graph: data.UserSign, // 签名
        status: data.UserStatus // 用户状态
        // status: ""  // 头像
      }
      this.userModal = true // 数据填充成功后打开modal
      // let vm = this;
      // this.axios
      //   .get("/apiweb/user/GetUserSetDetail", {
      //     params: {
      //       ComId: "12", //公司id，字符串类型（可传1或12进行测试）
      //       UserId: vm.checkedList[0].UserId //单个用户的id，字符串类型（可传1进行测试）
      //     }
      //   })
      //   .then(res => {
      //     console.log(res.data);
      //     // 将用户选择的单条信息写入表单中

      //   })
      //   .catch(function(err) {
      //     console.log(err);
      //   });
    },
    ok() {
      // modal对话框点击确认:编辑/新增保存
      let vm = this
      // 判断是哪种类型的保存
      let getUrl = '/apiweb/'
      let domName = 'userForm'
      let udata = {}
      if (this.modalTitle == '新增用户') {
        getUrl = getUrl + 'user/UserSetAdd'
        udata = {
          ComId: vm.ComId, //公司id
          UserName: vm.userData.name, //用户姓名
          UserPWD: vm.userData.password, //密码
          UserPhone: vm.userData.phone, //手机号
          UserMail: vm.userData.email, //邮箱
          UserImage: '', //头像
          UserSign: vm.userData.graph, //签名
          UserNick: vm.userData.nike, //昵称
          UserStatus: vm.userData.status, //用户状态（默认传1）
          OperID: vm.userId //操作人
        }
        domName = 'userForm'
      } else if (this.modalTitle == '编辑用户') {
        getUrl = getUrl + 'user/UserSetUpdate'
        udata = {
          ComId: vm.ComId, //公司id
          UserID: vm.ncUserId, // 用户id
          UserName: vm.userData.name, //用户姓名
          UserPWD: vm.userData.password, //密码
          UserPhone: vm.userData.phone, //手机号
          UserMail: vm.userData.email, //邮箱
          UserImage: '', //头像
          UserSign: vm.userData.graph, //签名
          UserNick: vm.userData.nike, //昵称
          UserStatus: vm.userData.status, //用户状态（默认传1）
          UpdateId: '123' //操作人
        }
        domName = 'userForm'
      } else if (this.modalTitle == '批量操作') {
        getUrl = getUrl + 'user/UserRoleSet'
        let uids = []
        vm.checkedList.forEach((item, list) => {
          uids.push(item.UserId)
        })
        // 判断用户是否选择了下拉，至少选择一项更改目标
        if (vm.editData.userDepa == '' && vm.editData.userRole == '') {
          vm.$message({
            message: '请至少选择一项更改目标来进行操作！',
            type: 'warning'
          })
          return
        }
        udata = {
          ComId: vm.ComId, //公司id
          UserId: uids.join(','), //用户id（因为是多用户批量设置，因此该字段以逗号拼接成字符串的形式发送给后台）
          RoleId: vm.editData.userRole, //角色id（发送形式同用户id的发送形式）
          DepartId: vm.editData.userDepa, //部门id（发送形式同上）
          OperId: vm.userId //操作人
        }
        domName = 'editForm'
      }
      this.$refs[domName].validate(valid => {
        if (valid) {
          // 发送数据到后台
          vm.$Spin.show({
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
          vm.axios
            .get(getUrl, {
              params: udata
            })
            .then(res => {
              console.log(res.data)
              if (res.data.ok != 'false') {
                vm.$message({
                  type: 'success',
                  message: '操作成功!'
                })
                vm.$Spin.hide()
                if (vm.modalTitle == '新增用户') {
                  if (!!res.data.code) {
                    //新增用户时，同步发送数据到新增分机
                    let vparam = {}
                    let vurl = '/apiwss/user/adduser'
                    vparam.bindUser = res.data.code || ''
                    vparam.display = vm.userData.phone || ''
                    vparam.password = vm.userData.phone || ''
                    vparam.comId = Cookies.get('yh_web_ComCode')
                    vm.axios
                      .post(vurl, vparam)
                      .then(res => {
                        console.log(res.data)
                      })
                      .catch(function(err) {
                        console.log(err)
                      })
                  }
                }
                // 刷新数据
                vm.init()
                vm.userModal = false
              } else {
                vm.$message.error('操作失败！')
                vm.$Spin.hide()
                vm.userModal = false
              }
            })
            .catch(function(err) {
              console.log(err)
            })
        }
      })
    },
    cancel() {
      // modal对话框点击取消
      this.userModal = false
    },
    delUser() {
      let vm = this
      // 先判断是否选择有用户
      if (this.checkedList.length == 0) {
        this.$message({
          message: '请至少选择一条数据进行操作！',
          type: 'warning'
        })
        return
      }
      // 收集当前获取的用户id集合
      let uids = []
      let ucodes = []
      vm.checkedList.forEach((item, list) => {
        uids.push(item.UserId)
        ucodes.push(item.code)
      })
      this.$confirm('此操作将删除您所选中的用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 发送删除请求给后台
          this.axios
            .get('/apiweb/user/UserDel', {
              params: {
                ComId: vm.ComId, //公司id，字符串类型（可传1或12进行测试）
                UserId: uids.join(',') //单个用户的id，字符串类型（可传1进行测试）
              }
            })
            .then(res => {
              console.log(res.data)
              // 将用户选择的单条信息写入表单中
              if (res.data.ok != 'false') {
                vm.$message({
                  type: 'success',
                  message: '操作成功!'
                })
                vm.axios
                  .post('/apiwss/user/upStatus', {
                    comId: Cookies.get('yh_web_ComCode'),
                    status: -1,
                    ids: ucodes
                  })
                  .then(res => {
                    console.log(res.data)
                  })
                  .catch(function(err) {
                    console.log(err)
                  })
                vm.init()
              } else {
                vm.$message.error('操作失败！')
              }
            })
            .catch(function(err) {
              console.log(err)
            })
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除"
          // });
        })
    },
    checkedTr(data, index) {
      let vm = this
      // 单击一行checked选中/取消切换
      // console.log(data);
      // console.log(index);
      this.data1[index]['_checked'] = !this.data1[index]['_checked']
      data['_checked'] = !data['_checked'] // 当前数据的也同步，更优雅
      // this.checkedList = []
      //处理选中暂存
      if (this.data1[index]['_checked']) {
        // 选中
        this.checkedList.push(data)
      } else {
        // 取消
        this.checkedList.forEach((item, list) => {
          if (item.UserId == data.UserId) {
            vm.checkedList.splice(list, 1)
          }
        })
      }
      console.log(this.checkedList)
    },
    selectOne(s, r) {
      // 表格第一列checkbox点击事件处理
      console.log(s) // 已选中的数据
      this.checkedList = s
    },
    selectCan(s, r) {
      // 取消选择某一项
      this.checkedList = s
    },
    init() {
      let vm = this
      this.loading = true // 先打开表格loading,
      // 请求当前用户数据
      this.axios
        .get('/apiweb/user/GetUserSetList', {
          params: {
            ComId: vm.ComId,
            currentpage: vm.curnPage, //当前页
            pagesize: vm.sizePage, //页大小
            keyWord: vm.keyWord //关键字
          }
        })
        .then(res => {
          console.log(res.data)
          // 处理数据，每条数据加上checkd控制属性
          let result = res.data
          result.forEach(item => {
            item._checked = false
          })
          vm.data1 = result
          vm.loading = false
        })
        .catch(function(err) {
          console.log(err)
        })

      //请求总页数
      this.axios
        .get('/apiweb/user/GetUserSetTotal', {
          params: {
            ComId: vm.ComId
          }
        })
        .then(res => {
          console.log(res.data)
          vm.totalPage = res.data.total
        })
        .catch(function(err) {
          console.log(err)
        })

      //请求部门列表
      this.axios
        .get('/apiweb/user/UserSetDepartList', {
          params: {
            ComId: vm.ComId, // 当前为测试数据
            DepartStatus: '1' //角色状态
          }
        })
        .then(res => {
          console.log(res.data)
          vm.depaList = res.data
        })
        .catch(function(err) {
          console.log(err)
        })

      //请求角色列表
      this.axios
        .get('/apiweb/role/GetRoleList', {
          params: {
            ComId: vm.ComId, // 当前为测试数据
            RoleStatus: '1' //角色状态
          }
        })
        .then(res => {
          console.log(res.data)
          vm.roleList = res.data
        })
        .catch(function(err) {
          console.log(err)
        })
    }
  },
  mounted() {
    const _this = this
    this.tableHeight = window.innerHeight - 280
    // 浏览器窗口发生改变
    window.onresize = function() {
      _this.tableHeight = window.innerHeight - 280
    }
    this.init()
  }
}
</script>
