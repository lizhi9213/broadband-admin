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
            <!-- 顶部标题 -->
            <p slot="title">
                <Icon type="person"></Icon>
                分机管理
            </p>
            <div>
              <Row class="userset">
                <Col span="24">
                    <div class="hadle-box">
                      <div class="search-box">
                        <el-input placeholder="请输入查询内容" v-model="keyWord" class="input-with-select">
                          <el-button slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                      </div>
                      <div class="btn-box">
                        <Button type="success" @click="wssMethods(0)" icon="plus">系统初始化</Button>&nbsp;&nbsp;&nbsp;
                        <Button type="success" @click="wssMethods(1)" icon="plus">获取用户信息</Button>&nbsp;&nbsp;&nbsp;
                        <Button type="success" @click="wssMethods(2)" icon="plus">注册</Button>&nbsp;&nbsp;&nbsp;
                        <Button type="success" @click="wssMethods(3)" icon="plus">取消注册</Button>&nbsp;&nbsp;&nbsp;
                        <Button type="success" @click="wssMethods(4)" icon="plus">用户初始化</Button>&nbsp;&nbsp;&nbsp;
                        <Button type="success" @click="wssMethods(5)" icon="plus">用户签入</Button>&nbsp;&nbsp;&nbsp;
                        <Button type="success" @click="wssMethods(6)" icon="plus">用户签出</Button>&nbsp;&nbsp;&nbsp;
                        <Button type="success" @click="wssMethods(7)" icon="plus">呼叫</Button>&nbsp;&nbsp;&nbsp;
                        <Button type="success" @click="wssMethods(8)" icon="plus">挂机</Button>&nbsp;&nbsp;&nbsp;
                        <Button type="success" @click="wssMethods(9)" icon="plus">接听</Button>&nbsp;&nbsp;&nbsp;
                        <Button type="success" @click="openModal(1)" icon="plus">新增</Button>&nbsp;&nbsp;&nbsp;
                        <Button type="info" @click="openModal(4)" icon="ionic">批量新增</Button>&nbsp;&nbsp;&nbsp;
                        <Button type="warning" @click="openModal(2)" icon="compose">修改</Button>&nbsp;&nbsp;&nbsp;
                        <Button type="error" @click="delUser" icon="trash-b">删除</Button>
                      </div>
                    </div>
                    <Table 
                        :border="true" 
                        @on-selection-change="onSelectChange" 
                        stripe 
                        :columns="columns1" 
                        height="600" 
                        :data="data1" 
                        style="margin-bottom: 30px;">
                    </Table>
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="page"
                      background
                      :page-sizes="[10, 50, 100, 500]"
                      :page-size="size"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="total">
                    </el-pagination>
                </Col>
              </Row>
            </div>
         </Card>
        <!--用户表单弹框 -->
        <Modal
          v-model="userModal"
          :title="modalTitle"
          @on-ok="ok"
          @on-cancel="cancel">
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
                  <Option value="192.168.30.246">192.168.30.246</Option>
               </Select>
             </FormItem>
           </Form>
           <Form v-if="!batchAdd" ref="userForm" :model="userDate" :rules="ruleUser" :label-width="100">
             <FormItem label="用户名：" prop="username">
               <Input v-model="userDate.username" placeholder="请填写用户名"></Input>
             </FormItem>
             <FormItem label="显示名：" prop="display">
               <Input v-model="userDate.display" placeholder="请填写显示名（默认用户名）"></Input>
             </FormItem>
             <FormItem label="密码：" prop="password">            
               <Input v-model="userDate.password" placeholder="请输入密码（默认用户名）"></Input>
             </FormItem>
             <FormItem label="域名：" prop="realm">               
               <Select v-model="userDate.realm" placeholder="请选择域名">
                  <Option value="192.168.30.246">192.168.30.246</Option>
               </Select>
             </FormItem>
           </Form>
        </Modal>
    </div>
</template>

<script>
import Cookies from "js-cookie";

export default {
  name: "userset",
  data() {
    const validePhone = (rule, value, callback) => {
      var re = /^1[0-9]{10}$/;
      if (!re.test(value)) {
        callback(new Error("请输入正确格式的手机号"));
      } else {
        callback();
      }
    };
    const valideRePassword = (rule, value, callback) => {
      if (value !== this.editPasswordForm.newPass) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      keyWord: "",
      modalTitle: "新增用户",
      userModal: false, // 用户设置表单modal
      batchAdd: false,
      userRole: "", // 批量更改的用户角色id
      roleList: [
        {
          value: 1,
          label: "研发-前端"
        },
        {
          value: 2,
          label: "研发-后端"
        },
        {
          value: 3,
          label: "UI"
        },
        {
          value: 4,
          label: "产品经理"
        },
        {
          value: 5,
          label: "10086客服"
        },
        {
          value: 6,
          label: "产品运维"
        },
        {
          value: 7,
          label: "销售"
        },
        {
          value: 8,
          label: "HR"
        }
      ],
      userDate: {
        id: "",
        username: "", // 用户名
        display: "", // 显示名
        realm: "", // 域名
        password: "" // 密码
      }, // 操作用户表单数据集
      userDate1: {
        prefix: "", //分机前缀
        start: "", // 开始于
        end: "", // 截止于
        realm: "", // 域名
        password: "" // 密码
      }, // 操作用户表单数据集
      ruleUser: {
        name: [
          {
            required: true,
            message: "请输入用户姓名",
            trigger: "blur"
          }
        ]
      }, // 验证表单
      columns1: [
        // thead
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "用户名",
          key: "username",
          align: "left",
          render: (h, params) => {
            // 使用vue render函数处理table中td里面的switch渲染及事件处理
            // console.log(params);
            let that = this;
            let name = params.row.username;
            let data = params.row;
            return h(
              "div",
              {
                attrs: {
                  class: "table-name"
                },
                style: {
                  overflow: "hidden",
                  height: "100%",
                  width: "100%"
                }
              },
              [
                h("span", {
                  style: {
                    lineHeight: "30px"
                  },
                  domProps: {
                    innerHTML: name
                  }
                }),
                h("Button", {
                  //数据库1是已处理，0是未处理
                  props: {
                    type: "text",
                    icon: "edit"
                  },
                  style: {
                    float: "right"
                  },
                  on: {
                    click: event => {
                      // this.openModal(3,userData);
                      return that.openModal(3, data);
                    }
                  }
                })
              ]
            );
          }
        },
        {
          title: "显示名",
          key: "display"
        },
        {
          title: "注册域",
          key: "realm"
        },
        {
          title: "注册密码",
          key: "password"
        },
        {
          title: "注册IP",
          key: "regIp"
        },
        {
          title: "状态",
          key: "status"
        }
      ], //table 表头
      alldata: [],
      selectCol: [],
      page: 1,
      size: 10,
      total: 0,
      data1: [], // table 数据
      skay: ""
    };
  },
  watch: {
    keyWord: function() {
      this.init();
    }
  },
  methods: {
    onSelectChange(selection, row) {
      this.selectCol = selection;
    },

    openModal(a, b) {
      this.userDate = {};
      this.batchAdd = false; // 每次打开要先初始化
      if (a == 1) {
        this.modalTitle = "新增分机";
      } else if (a == 2) {
        this.modalTitle = "修改分机";
        //this.batchAdd = true;
        if (this.selectCol.length == 0) {
          //弹出提示请选择分机
          this.$message({
            type: "error",
            message: "请选择分机！"
          });
          return false;
        } else if (this.selectCol.length > 1) {
          //弹出提示只能选择一条记录
          this.$message({
            type: "error",
            message: "只能选择一条记录"
          });
          return false;
        } else {
          var data = {};
          data = Object.assign({}, this.selectCol[0]);
          this.userDate = data;
        }
      } else if (a == 3) {
        this.modalTitle = "编辑分机";
        var data = {};
        data = Object.assign({}, b);
        this.userDate = data;
      } else if (a == 4) {
        this.modalTitle = "批量新增";
        this.batchAdd = true;
        this.clearFormData(1);
      }
      this.userModal = true;
    },
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.size = val;
      this.selectCol = [];
      this.changedata();
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      this.page = val;
      this.selectCol = [];
      this.changedata();
    },
    ok() {
      // modal对话框点击确认
      //this.$Message.info("Clicked ok");
      let that = this;
      let url = "";
      let params = {};
      if (this.batchAdd) {
        url = "/apiweb/call/useraddmore";
        params.prefix = this.userDate1.prefix || "";
        params.start = this.userDate1.start || "";
        params.end = this.userDate1.end || "";
        params.realm = this.userDate1.realm || "";
        params.password = this.userDate1.password || "";
      } else {
        url = "/apiweb/call/useradd";
        params.userid = this.userDate.id || "";
        params.display = this.userDate.display || "";
        params.username = this.userDate.username || "";
        params.realm = this.userDate.realm || "";
        params.password = this.userDate.password || "";
      }
      const msg = this.$Message.loading({
        content: "Loading...",
        duration: 0
      });
      this.axios
        .get(url, {
          params: params
        })
        .then(res => {
          setTimeout(msg, 1000);
          //that.data1 = res.data;
          console.log(res.data);
          if (res.data.ok == "true") {
            this.init();
            this.$message({
              type: "success",
              message: res.data.msg
            });
          } else {
            this.$message({
              type: "error",
              message: res.data.msg
            });
          }
        })
        .catch(function(err) {
          console.log(err);
          setTimeout(msg, 1000);
          this.$message({
            type: "error",
            message: "操作失败!"
          });
        });
    },
    cancel() {
      // modal对话框点击取消
      //this.$Message.info("Clicked cancel");

      this.$message({
        type: "success",
        message: res.data.msg
      });
    },
    delUser() {
      let that = this;
      if (this.selectCol.length == 0) {
        //弹出提示请选择分机
        this.$message({
          type: "error",
          message: "请选择分机！"
        });
        return false;
      }
      let ids = [];
      for (let i = 0; i < this.selectCol.length; i++) {
        ids.push(this.selectCol[i].id);
      }
      this.$confirm("此操作将删除用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .get("/apiweb/call/userdel", {
              params: {
                ids: ids.join(",")
              }
            })
            .then(res => {
              console.log(res.data);
              if (res.data.ok == "true") {
                this.init();
                this.$message({
                  type: "success",
                  message: res.data.msg
                });
              } else {
                this.$message({
                  type: "error",
                  message: res.data.msg
                });
              }
            })
            .catch(function(err) {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    init() {
      let ComId = "12";
      let FlagId = "1";
      let that = this;
      this.axios
        .get("/apiweb/call/userlist", {
          params: {
            key: this.keyWord || ""
          }
        })
        .then(res => {
          that.alldata = res.data;
          that.total = res.data.length;
          //console.log(res.data);
          that.changedata();
        })
        .catch(function(err) {
          console.log(err);
        });
      this.userDate = {};
      this.selectCol = [];
    },
    changedata() {
      let data = [];
      let inum = ((this.page || 1) - 1) * (this.size || 10);

      for (var i = inum; i < this.alldata.length; i++) {
        if (i < inum + (this.size || 10)) {
          data.push(this.alldata[i]);
        }
      }
      this.data1 = data;
      console.log(this.data1);
    },
    clearFormData(type) {
      if (type == 1) {
        this.userDate1 = {
          prefix: "", //分机前缀
          start: "", // 开始于
          end: "", // 截止于
          realm: "", // 域名
          password: "" // 密码
        };
      }
    },
    wssMethods(type) {
      console.log(type);
      switch (type) {
        case 0:
          //系统初始化
          this.createWSS();
          break;
        case 1:
          //获取用户信息
          this.wssgetuser();
          break;
        case 2:
          //注册
          this.wssgetuser(true);
          break;
        case 3:
          //取消注册
          this.skay.oSipUnRegister();
          break;
        case 4:
          //用户初始化
          this.skay.oSipInit(function(msg) {
            console.log(msg);
          });
          break;
        case 5:
          //用户签入
          this.skay.oSipSignIn(function(msg) {
            console.log(msg);
          });
          break;
        case 6:
          //用户签出
          this.skay.oSipSignOut(function(msg) {
            console.log(msg);
          });
          break;
        case 7:
          //呼叫
          this.skay.oSipCall("15039081466");
          break;
        case 8:
          //挂机
          this.skay.oSipHangUp();
          break;
        case 9:
          //接听
          this.skay.oSipAnswer();
          break;
      }
    },
    createWSS() {
      //初始化skaysip
      let that = this;
      oSipStatus.sipInit(
        function(msg) {
          //regstatus change
          console.log(msg);
          that.regstatus = msg == "1" ? "已注册" : "离线";
        },
        function(msg) {
          //callstatus change
          console.log(msg);
          that.callstatus = msg;
        }
      );
      var sipreg = setInterval(function() {
        if (oSipStatus.getuser) {
          clearInterval(sipreg);
          alert("系统初始化成功!");
        }
      }, 1000);
    },
    wssgetuser(reg) {
      //获取用户信息
      let that = this;
      if (this.skay.isInit()) {
        this.skay.oSipGetConf(
          {
            user: Cookies.get("yh_web_UserId"),
            token: "123"
          },
          function(data) {
            //获取配置文件信息
            console.log(data);
            if (data.code == "200") {
              //读取配置文件成功
              if (reg) {
                that.wssRegister(data.data[0]);
              } else {
                console.log(data.data[0]);
              }
            } else {
              //读取失败
              alert(data.msg);
            }
          }
        );
      }
    },
    wssRegister(data) {
      //创建 网页软电话
      this.skay.oSipRegister(data);
    }
  },
  mounted() {
    this.init();
    this.skay = this.$store.state.page.skay;
    //this.createWSS();
  }
};
</script>
