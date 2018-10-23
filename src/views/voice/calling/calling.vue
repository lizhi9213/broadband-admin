<style lang="less">
@import "./calling.less";
</style>

<template>
    <div>
         <Card>
            <!-- 顶部标题 -->
            <p slot="title">
                <Icon type="android-volume-up"></Icon>
                主叫管理
            </p>
            <div>
              <Row class="lable-box">
                <Col span="24">
                    <div class="hadle-box">
                      <Button type="success" icon="ios-telephone">添加</Button>&nbsp;&nbsp;&nbsp;<Button type="info" icon="compose">编辑</Button>&nbsp;&nbsp;&nbsp;<Button type="error" icon="trash-b">移除</Button>
                    </div>
                    <Table stripe :columns="columns1" height="560" :data="data1" style="margin-bottom: 30px;"></Table>
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
        <!-- 修改密码弹出框 -->
        <Modal v-model="editPasswordModal" :closable='false' :mask-closable=false :width="500">
            <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
            <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
                <FormItem label="原密码" prop="oldPass" :error="oldPassError">
                    <Input v-model="editPasswordForm.oldPass" placeholder="请输入现在使用的密码" ></Input>
                </FormItem>
                <FormItem label="新密码" prop="newPass">
                    <Input v-model="editPasswordForm.newPass" placeholder="请输入新密码，至少6位字符" ></Input>
                </FormItem>
                <FormItem label="确认新密码" prop="rePass">
                    <Input v-model="editPasswordForm.rePass" placeholder="请再次输入新密码" ></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelEditPass">取消</Button>
                <Button type="primary" :loading="savePassLoading" @click="saveEditPass">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
  name: "calling",
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
      idedit: false,
      save_loading: false,
      editPasswordModal: false, // 修改密码模态框显示
      savePassLoading: false,
      oldPassError: "",
      editPasswordForm: {
        oldPass: "",
        newPass: "",
        rePass: ""
      },
      passwordValidate: {
        oldPass: [{ required: true, message: "请输入原密码", trigger: "blur" }],
        newPass: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 6, message: "请至少输入6个字符", trigger: "blur" },
          { max: 32, message: "最多输入32个字符", trigger: "blur" }
        ],
        rePass: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          { validator: valideRePassword, trigger: "blur" }
        ]
      },
      columns1: [
        // thead
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          type: "index",
          title: "序号",
          width: 60,
          align: "center"
        },
        {
          title: "主叫编号",
          key: "number"
        },
        {
          title: "主叫号码",
          key: "telnum"
        },
        {
          title: "所在省",
          key: "province"
        },
        {
          title: "所在市",
          key: "city"
        },
        {
          title: "有效",
          key: "effective",
          align: "left",
          render: (h, params) => {
            // 使用vue render函数处理table中td里面的switch渲染及事件处理
            // console.log(params);
            return h("div", [
              h(
                "i-switch",
                {
                  //数据库1是已处理，0是未处理
                  props: {
                    type: "primary",
                    value: params.row.check === 1 // 控制开关的打开或关闭状态，官网文档属性是value
                  },
                  style: {},
                  on: {
                    "on-change": value => {
                      console.log(value);
                      //触发事件是on-change,用双引号括起来，
                      //参数value是回调值，并没有使用到
                      //this.switch(params.index); //params.index是拿到table的行序列，可以取到对应的表格值
                    }
                  }
                },
                ""
              )
            ]);
          }
        }
      ],
      data1: [
        // tbody
        {
          number: "03775555555",
          telnum: "03775555555",
          effective: 1,
          province: "河南省",
          city: "郑州市"
        },
        {
          number: "01055555555",
          telnum: "01055555555",
          effective: 1,
          province: "	北京市",
          city: "郑州市"
        },
        {
          number: "0106666666",
          telnum: "0106666666",
          effective: 1,
          province: "北京市",
          city: "郑州市"
        },
        {
          number: "03719999999",
          telnum: "03719999999",
          effective: 1,
          province: "河南省",
          city: "郑州市"
        },
        {
          number: "03718888888",
          telnum: "03718888888",
          effective: 1,
          province: "河南省",
          city: "郑州市"
        },
        {
          number: "03725555555",
          telnum: "03725555555",
          effective: 0,
          province: "河南省",
          city: "郑州市"
        },
        {
          number: "06325555555",
          telnum: "06325555555",
          effective: 1,
          province: "山东省",
          city: "郑州市"
        },
        {
          number: "03985555555",
          telnum: "03985555555",
          effective: 1,
          province: "山东省",
          city: "郑州市"
        }
      ]
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    showEditPassword() {
      this.editPasswordModal = true;
    },
    cancelEditPass() {
      this.editPasswordModal = false;
    },
    saveEditPass() {
      this.$refs["editPasswordForm"].validate(valid => {
        if (valid) {
          this.savePassLoading = true;
          // you can write ajax request here
        }
      });
    },
    saveInfoAjax() {
      this.save_loading = true;
      setTimeout(() => {
        this.$Message.success("保存成功");
        this.save_loading = false;
      }, 1000);
    },
    saveEdit() {
      return;
      this.$refs["userForm"].validate(valid => {
        if (valid) {
          if (
            this.phoneHasChanged &&
            this.userForm.cellphone !== this.initPhone
          ) {
            // 手机号码修改过了而且修改之后的手机号和原来的不一样
            if (this.hasGetIdentifyCode) {
              // 判断是否点了获取验证码
              if (this.identifyCodeRight) {
                // 判断验证码是否正确
                this.saveInfoAjax();
              } else {
                this.$Message.error("验证码错误，请重新输入");
              }
            } else {
              this.$Message.warning("请先点击获取验证码");
            }
          } else {
            this.saveInfoAjax();
          }
        }
      });
    },
    toggleEdit(a) {
      if (a === 1) {
        this.idedit = true;
      } else if (a === 2) {
        this.idedit = false;
        // 取消代码段
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  },
  mounted() {}
};
</script>
