<style lang="less">
@import "./userset.less";
</style>

<template>
    <div>
         <Card>
            <!-- 顶部标题 -->
            <p slot="title">
                <Icon type="person"></Icon>
                用户设置
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
                        <Button type="success" @click="openModal(1)" icon="plus">新增</Button>&nbsp;&nbsp;&nbsp;<Button type="info" @click="openModal(2)" icon="compose">修改</Button>&nbsp;&nbsp;&nbsp;<Button type="error" @click="delUser" icon="trash-b">删除</Button>
                      </div>
                    </div>
                    <Table stripe :columns="columns1" height="600" :data="data1" style="margin-bottom: 30px;"></Table>
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="4"
                      background
                      :page-sizes="[10, 20, 30, 40]"
                      :page-size="10"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="100">
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
           <Form v-if="editRol" :label-width="100">
             <FormItem label="修改为：">
               <Select v-model="userRole" filterable placeholder="请选择要修的目标角色">
                 <Option v-for="item in roleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
             </FormItem>
           </Form>
           <Form v-if="!editRol" ref="userForm" :model="userDate" :rules="ruleUser" :label-width="100">
             <FormItem label="用户姓名：" prop="name" placeholder="请填写用户姓名">
               <Input v-model="userDate.name"></Input>
             </FormItem>
             <FormItem label="用户密码：" prop="password" placeholder="请填写用户密码">
               <Input v-model="userDate.password"></Input>
             </FormItem>
             <FormItem label="手机号：" prop="phone" placeholder="请填写手机号">
               <Input v-model="userDate.phone"></Input>
             </FormItem>
             <FormItem label="用户邮箱：" prop="email" placeholder="请填写电子邮箱">
               <Input v-model="userDate.email"></Input>
             </FormItem>
             <FormItem label="用户昵称：" prop="nike" placeholder="请填用户昵称">
               <Input v-model="userDate.nike"></Input>
             </FormItem>
             <FormItem label="用户状态：" prop="status">
               <Select v-model="userDate.status" placeholder="请选择用户状态">
                  <Option value="1">正常</Option>
                  <Option value="2">离职</Option>
                  <Option value="3">禁用</Option>
                  <Option value="4">已删除</Option>
               </Select>
             </FormItem>
           </Form>
        </Modal>
    </div>
</template>

<script>
export default {
  name: "preview",
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
      editRol: false,
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
        name: "", // 姓名
        password: "", // 密码
        phone: "", // 手机号
        email: "", // 邮箱
        nike: "", // 昵称
        status: ""
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
          title: "姓名",
          key: "name",
          align: "left",
          render: (h, params) => {
            // 使用vue render函数处理table中td里面的switch渲染及事件处理
            // console.log(params);
            let that = this;
            let name = params.row.name;
            let userData = params.row;
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
                      return that.openModal(3, userData);
                    }
                  }
                })
              ]
            );
          }
        },
        {
          title: "密码",
          key: "password"
        },
        {
          title: "手机号",
          key: "phone"
        },
        {
          title: "邮箱",
          key: "email"
        },
        {
          title: "昵称",
          key: "nike"
        },
        {
          title: "用户状态",
          key: "status"
        },
        {
          title: "是否在线",
          key: "online"
        },
        {
          title: "在线时间",
          key: "linetime"
        },
        {
          title: "登录时间",
          key: "logintime"
        }
      ], //table 表头
      data1: [
        // tbody
        {
          name: "张三",
          password: 123456,
          phone: "135667489956",
          email: "4562347@qq.com",
          nike: "两只老虎",
          status: "正常",
          statusId: 1,
          online: "是",
          onlineId: 1,
          linetime: "2018-5-7 9:50",
          logintime: "2018-5-7 8:30"
        },
        {
          name: "李四",
          password: 123456,
          phone: "135667489956",
          email: "4562347@qq.com",
          nike: "跑的快",
          status: "正常",
          statusId: 1,
          online: "不在线",
          onlineId: 0,
          linetime: "2018-5-7 9:50",
          logintime: "2018-5-7 8:30"
        },
        {
          name: "王五",
          password: 123456,
          phone: "17788956231",
          email: "4562347@qq.com",
          nike: "一只没有尾巴",
          status: "正常",
          statusId: 1,
          online: "在线",
          onlineId: 1,
          linetime: "2018-5-7 9:50",
          logintime: "2018-5-7 8:30"
        },
        {
          name: "赵柳",
          password: 123456,
          phone: "17788956231",
          email: "4562347@qq.com",
          nike: "一只没有耳朵",
          status: "禁用",
          statusId: 3,
          online: "不在线",
          onlineId: 0,
          linetime: "2018-5-7 9:50",
          logintime: "2018-5-7 8:30"
        },
        {
          name: "丁酉",
          password: 123456,
          phone: "186559623345",
          email: "4562347@qq.com",
          nike: "真奇怪",
          status: "已删除",
          statusId: 4,
          online: "不在线",
          onlineId: 0,
          linetime: "2018-5-7 9:50",
          logintime: "2018-5-7 8:30"
        }
      ] // table 数据
    };
  },
  methods: {
    openModal(a, b) {
      this.editRol = false; // 每次打开要先初始化
      if (a == 1) {
        this.modalTitle = "新增用户";
      } else if (a == 2) {
        this.modalTitle = "修改角色";
        this.editRol = true;
      } else if (a == 3) {
        this.modalTitle = "编辑用户";
      }
      this.userModal = true;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    ok() {
      // modal对话框点击确认
      this.$Message.info("Clicked ok");
    },
    cancel() {
      // modal对话框点击取消
      this.$Message.info("Clicked cancel");
    },
    delUser() {
      this.$confirm("此操作将删除用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
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
      this.axios
        .get("/apiweb/field/GetFieldList", {
          params: {
            ComId: ComId,
            FlagId: FlagId
          }
        })
        .then(res => {
          console.log(res.data);
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  },
  mounted() {
    this.init();
  }
};
</script>
