<style lang="less">
.userset {
  .hadle-box {
    overflow: hidden;
    margin-bottom: 20px;
    .search-box {
      float: left;
    }
    .btn-box {
      float: right;
    }
  }
  .table-name {
    > button {
      display: none;
    }
    &:hover {
      > button {
        display: block;
      }
    }
  }
}
</style>

<template>
  <div>
    <Card>
      <div>
        <Row class="userset">
          <Col span="24">
          <div class="hadle-box" style="margin-top:10px;">
            <div class="search-box">
              <Input placeholder="请输入查询内容" icon="ios-search" v-model="keyWord" style="width: 240px;margin-right:12px;margin-bottom:2px;" @on-enter="init">
              </Input>
              <!-- <Button type="primary" @click="init">
                <Icon type="ios-search"></Icon> 搜索
              </Button> -->
            </div>
            <div class="btn-box">
              <!-- <Button type="success" @click="openModal(1)" icon="plus">新增</Button>&nbsp;&nbsp;&nbsp;
                        <Button type="info" @click="openModal(4)" icon="ionic">批量新增</Button>&nbsp;&nbsp;&nbsp; -->
              <!-- <Button type="warning" @click="openModal(2)" icon="compose">修改</Button>&nbsp;&nbsp;&nbsp; -->
              <!-- <Button type="error" @click="delUser" icon="trash-b">删除</Button> -->
            </div>
          </div>
          <Table :border="true" @on-selection-change="onSelectChange" stripe :columns="columns1" :height="tableHeight" :data="data1" style="margin-bottom: 30px;">
          </Table>
          <div style="text-align:right;padding-right:14px;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page" background :page-sizes="[10, 50, 100, 500]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
          </Col>
        </Row>
      </div>
    </Card>
    <!--用户表单弹框 -->
    <Modal v-model="userModal" :title="modalTitle" @on-ok="ok" @on-cancel="cancel">
      <Form v-if="batchAdd" :label-width="100">
        <FormItem label="分机前缀：">
          <Input v-model="userDate1.prefix" placeholder="请填写分机前缀（可为空）"></Input>
        </FormItem>
        <FormItem label="分机号：">
          <Input v-model="userDate1.start" style="width:100px" placeholder="开始于"></Input>
          &nbsp;至&nbsp;
          <Input v-model="userDate1.end" style="width:100px" placeholder="截止于"></Input>
        </FormItem>
        <FormItem label="分机密码：">
          <Input v-model="userDate1.password" placeholder="请填写分机密码（默认分机名）"></Input>
        </FormItem>
        <FormItem label="域名：" prop="realm">
          <Select v-model="userDate1.realm" placeholder="请选择域名">
            <Option value="39.106.196.77">39.106.196.77</Option>
          </Select>
        </FormItem>
        <FormItem label="主叫：" prop="caller">
          <Input v-model="userDate1.caller" placeholder="请填写分机主叫"></Input>
        </FormItem>
      </Form>
      <Form v-if="!batchAdd" ref="userForm" :model="userDate" :rules="ruleUser" :label-width="100">
        <FormItem label="用户名：" prop="username">
          <Input v-model="userDate.username" placeholder="请填写用户名"></Input>
        </FormItem>
        <FormItem label="密码：" prop="password">
          <Input v-model="userDate.password" placeholder="请输入密码（默认用户名）"></Input>
        </FormItem>
        <FormItem label="域名：" prop="realm">
          <Select v-model="userDate.realm" placeholder="请选择域名">
            <Option value="39.106.196.77">39.106.196.77</Option>
          </Select>
        </FormItem>
        <FormItem label="主叫：" prop="caller">
          <Input v-model="userDate.caller" placeholder="请填写分机主叫"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: 'extension',
  data() {
    const validePhone = (rule, value, callback) => {
      var re = /^1[0-9]{10}$/
      if (!re.test(value)) {
        callback(new Error('请输入正确格式的手机号'))
      } else {
        callback()
      }
    }
    const valideRePassword = (rule, value, callback) => {
      if (value !== this.editPasswordForm.newPass) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      keyWord: '',
      tableHeight: 500,
      modalTitle: '新增用户',
      userModal: false, // 用户设置表单modal
      batchAdd: false,
      userRole: '', // 批量更改的用户角色id
      userDate: {
        id: '',
        username: '', // 用户名
        realm: '', // 域名
        password: '', // 密码
        caller: '' //分机前缀
      }, // 操作用户表单数据集
      userDate1: {
        prefix: '', //分机前缀
        start: '', // 开始于
        end: '', // 截止于
        realm: '', // 域名
        password: '', // 密码
        caller: '' //分机前缀
      }, // 操作用户表单数据集
      ruleUser: {
        name: [
          {
            required: true,
            message: '请输入用户姓名',
            trigger: 'blur'
          }
        ]
      }, // 验证表单
      columns1: [
        // thead
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '用户名',
          key: 'username',
          align: 'left',
          render: (h, params) => {
            // 使用vue render函数处理table中td里面的switch渲染及事件处理
            // console.log(params);
            let that = this
            let name = params.row.username
            let data = params.row
            return h(
              'div',
              {
                attrs: {
                  class: 'table-name'
                },
                style: {
                  overflow: 'hidden',
                  height: '100%',
                  width: '100%'
                }
              },
              [
                h('span', {
                  style: {
                    lineHeight: '30px'
                  },
                  domProps: {
                    innerHTML: name
                  }
                })
                // h("Button", {
                //   //数据库1是已处理，0是未处理
                //   props: {
                //     type: "text",
                //     icon: "edit"
                //   },
                //   style: {
                //     float: "right"
                //   },
                //   on: {
                //     click: event => {
                //       // this.openModal(3,userData);
                //       return that.openModal(3, data);
                //     }
                //   }
                // })
              ]
            )
          }
        },
        {
          title: '注册域',
          key: 'realm'
        },
        {
          title: '注册密码',
          key: 'password'
        }
        // {
        //   title: '注册IP',
        //   key: 'regIp'
        // },
        // {
        //   title: '主叫号码',
        //   key: 'caller'
        // },
        // {
        //   title: '状态',
        //   key: 'userstatus',
        //   render: (h, params) => {
        //     if (params.row.userstatus == '0') {
        //       return h('div', '已注册')
        //     } else if (params.row.userstatus == '1') {
        //       return h('div', '签出')
        //     } else if (params.row.userstatus == '2') {
        //       return h('div', '签入')
        //     } else {
        //       return h('div', '离线')
        //     }
        //   }
        // }
      ], //table 表头
      alldata: [],
      selectCol: [],
      page: 1,
      size: 10,
      total: 0,
      data1: [] // table 数据
    }
  },
  watch: {
    keyWord: function() {
      this.init()
    }
  },
  methods: {
    onSelectChange(selection, row) {
      this.selectCol = selection
    },

    openModal(a, b) {
      this.userDate = {}
      this.batchAdd = false // 每次打开要先初始化
      if (a == 1) {
        this.modalTitle = '新增分机'
      } else if (a == 2) {
        this.modalTitle = '修改分机'
        //this.batchAdd = true;
        if (this.selectCol.length == 0) {
          //弹出提示请选择分机
          this.$message({
            type: 'error',
            message: '请选择分机！'
          })
          return false
        } else if (this.selectCol.length > 1) {
          //弹出提示只能选择一条记录
          this.$message({
            type: 'error',
            message: '只能选择一条记录'
          })
          return false
        } else {
          var data = {}
          data = Object.assign({}, this.selectCol[0])
          this.userDate = data
          console.log(data)
        }
      } else if (a == 3) {
        this.modalTitle = '编辑分机'
        var data = {}
        data = Object.assign({}, b)
        this.userDate = data
      } else if (a == 4) {
        this.modalTitle = '批量新增'
        this.batchAdd = true
        this.clearFormData(1)
      }
      this.userModal = true
    },
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.size = val
      this.selectCol = []
      this.changedata()
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      this.page = val
      this.selectCol = []
      this.changedata()
    },
    ok() {
      // modal对话框点击确认
      //this.$Message.info("Clicked ok");
      let that = this
      let url = ''
      let params = {}
      if (this.batchAdd) {
        url = '/apiwss/user/addmore'
        params.prefixs = this.userDate1.prefix || ''
        params.start = this.userDate1.start || ''
        params.end = this.userDate1.end || ''
        params.realm = this.userDate1.realm || ''
        params.password = this.userDate1.password || ''
        params.caller = this.userDate1.caller || ''
        params.comid = Cookies.get('yh_web_ComId')
        params.prefix = 'zz' //Cookies.get("yh_web_prefix");
      } else {
        url = '/apiwss/user/add'
        params.userid = this.userDate.id || ''
        params.username = this.userDate.username || ''
        params.realm = this.userDate.realm || ''
        params.password = this.userDate.password || ''
        params.caller = this.userDate.caller || ''
        params.comid = Cookies.get('yh_web_ComId')
        params.prefix = 'zz' //Cookies.get("yh_web_prefix");
      }
      const msg = this.$Message.loading({
        content: 'Loading...',
        duration: 0
      })
      this.axios
        .get(url, {
          params: params
        })
        .then(res => {
          setTimeout(msg, 1000)
          //that.data1 = res.data;
          console.log(res.data)
          if (res.data.code == '200') {
            this.init()
            this.$message({
              type: 'success',
              message: res.data.msg
            })
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
        .catch(function(err) {
          console.log(err)
          setTimeout(msg, 1000)
          this.$message({
            type: 'error',
            message: '操作失败!'
          })
        })
    },
    cancel() {
      // modal对话框点击取消
      //this.$Message.info("Clicked cancel");

      this.$message({
        type: 'success',
        message: res.data.msg
      })
    },
    delUser() {
      let that = this
      if (this.selectCol.length == 0) {
        //弹出提示请选择分机
        this.$message({
          type: 'error',
          message: '请选择分机！'
        })
        return false
      }
      let ids = []
      for (let i = 0; i < this.selectCol.length; i++) {
        ids.push(this.selectCol[i].id)
      }
      this.$confirm('此操作将删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .get('/apiwss/user/del', {
              params: {
                ids: ids.join(',')
              }
            })
            .then(res => {
              console.log(res.data)
              if (res.data.code == '200') {
                this.init()
                this.$message({
                  type: 'success',
                  message: res.data.msg
                })
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.msg
                })
              }
            })
            .catch(function(err) {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    init() {
      let that = this
      this.axios
        .get('/apiwss/user/list', {
          params: {
            word: this.keyWord || '',
            comId: Cookies.get('yh_web_ComId'),
            rnd: Math.random()
          }
        })
        .then(res => {
          let obj = res.data
          if (obj.code == '200') {
            that.page = 1
            that.alldata = obj.data
            that.total = obj.data.length
            that.changedata()
          }
          //console.log(res.data);
        })
        .catch(function(err) {
          console.log(err)
        })
      this.userDate = {}
      this.selectCol = []
    },
    changedata() {
      let data = []
      let inum = ((this.page || 1) - 1) * (this.size || 10)

      for (var i = inum; i < this.alldata.length; i++) {
        if (i < inum + (this.size || 10)) {
          data.push(this.alldata[i])
        }
      }
      this.data1 = data
      console.log(this.data1)
    },
    clearFormData(type) {
      if (type == 1) {
        this.userDate1 = {
          prefix: '', //分机前缀
          start: '', // 开始于
          end: '', // 截止于
          realm: '', // 域名
          password: '' // 密码
        }
      }
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
