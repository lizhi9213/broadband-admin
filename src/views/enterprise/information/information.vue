<style lang="less">
@import "./information.less";
</style>

<template>
    <div>
        <Card>
            <!-- 顶部标题 -->
            <p slot="title">
                <Icon type="trophy"></Icon>
                企业信息
            </p>
            <div>
                <p class="tips">亲,请点击线框右侧编辑按钮完善你的公司信息资料，点击logo图片即可上传上传公司logo。</p>
                <!-- tab切换 -->
                <Tabs type="card">
                    <TabPane label="企业账号信息">
                        <Row class="acco-msg">
                            <!-- logo盒子 -->
                            <Col span="6" class="acco-msg-logo">
                                <Avatar style="width:200px; height: 200px; margin-left: 1em;" shape="square" src="/static/img/default_img.jpg" size="large" />
                            </Col>
                            <!-- 右侧信息 -->
                            <Col span="14" class="acco-msg-name">
                                <h3>{{entname}}</h3>
                                <p>{{entndesc}}</p>
                            </Col>
                        </Row>
                        <!-- 企业信息展示与编辑切换 -->
                        <Row>
                            <Col span="20">
                                <Form 
                                    class="edit-from"
                                    ref="compForm"
                                    :model="userForm" 
                                    :label-width="110" 
                                    label-position="left"
                                    :rules="inforValidate"
                                >
                                    <FormItem v-show="idedit" label="公司名称：" prop="entcompany">
                                        <div style="display:inline-block;width:400px;">
                                            <Input v-model="userForm.entcompany" placeholder="请填写公司名称" ></Input>
                                        </div>
                                    </FormItem>
                                    <FormItem v-show="idedit" label="公司简称：" prop="entnbrief">
                                        <div style="display:inline-block;width:400px;">
                                            <Input v-model="userForm.entnbrief" placeholder="请填写公司简称" ></Input>
                                        </div>
                                    </FormItem>
                                    <FormItem v-show="!idedit" label="公司简称：">
                                        <span class="static-msg">{{ userForm.entnbrief }}</span>
                                    </FormItem>
                                    <FormItem v-show="idedit" label="公司介绍：" prop="entabbre">
                                        <Input v-model="userForm.entabbre" type="textarea" style="width: 400px;" :autosize="{minRows: 3,maxRows: 10}" placeholder="请填写公司介绍"></Input>
                                    </FormItem>
                                    <FormItem v-show="idedit" label="经营范围:" prop="entopera">
                                        <Select v-model="userForm.entopera"  style="width: 400px;" placeholder="请选择一个">
                                            <Option v-for="(n,i) in options1" :key="i+20" :value="n.value">{{n.text}}</Option>
                                        </Select>
                                    </FormItem>
                                    <FormItem v-show="!idedit" label="经营范围：">
                                        <span class="static-msg">{{ userForm.operatext }}</span>
                                    </FormItem>
                                    <FormItem v-show="idedit" label="公网URL：" prop="enturl">
                                        <div style="display:inline-block;width:400px;">
                                            <Input v-model="userForm.enturl" ></Input>
                                        </div>
                                    </FormItem>
                                    <FormItem v-show="!idedit" label="公网URL：">
                                        <span class="static-msg">{{ userForm.enturl }}</span>
                                    </FormItem>
                                    <FormItem v-show="idedit" label="公司性质：" prop="entnature">
                                        <Select v-model="userForm.entnature"  style="width: 400px;" placeholder="请选择一个">
                                            <Option v-for="(n,i) in options2" :key="i+16" :value="n.value">{{n.text}}</Option>
                                        </Select>
                                    </FormItem>
                                    <FormItem v-show="!idedit" label="公司性质：">
                                        <span class="static-msg">{{ userForm.naturetext }}</span>
                                    </FormItem>
                                    <FormItem label="授权域名前缀：">
                                        <span class="static-msg">{{ userForm.entprefix }}</span>
                                    </FormItem>
                                    <FormItem v-show="idedit" label="联系人：" prop="name">
                                        <div style="display:inline-block;width:400px;">
                                            <Input v-model="userForm.name" ></Input>
                                        </div>
                                    </FormItem>
                                    <FormItem v-show="!idedit" label="联系人：">
                                        <span class="static-msg">{{ userForm.name }}</span>
                                    </FormItem>
                                    <FormItem v-show="idedit" label="手机号码：" prop="cellphone" >
                                        <div style="display:inline-block;width:400px;">
                                            <Input v-model="userForm.cellphone"></Input>
                                        </div>
                                        <!-- <div style="display:inline-block;position:relative;">
                                            <Button @click="getIdentifyCode" :disabled="canGetIdentifyCode">{{ gettingIdentifyCodeBtnContent }}</Button>
                                            <div class="own-space-input-identifycode-con" v-show="inputCodeVisible">
                                                <div style="background-color:white;z-index:110;margin:10px;">
                                                    <Input v-model="securityCode" placeholder="请填写短信验证码" ></Input>
                                                    <div style="margin-top:10px;text-align:right">
                                                        <Button type="ghost" @click="cancelInputCodeBox">取消</Button>
                                                        <Button type="primary" @click="submitCode" :loading="checkIdentifyCodeLoading">确定</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> -->
                                    </FormItem>
                                    <FormItem v-show="!idedit" label="手机号码：">
                                        <span class="static-msg">{{ userForm.cellphone }}</span>
                                    </FormItem>
                                    <FormItem v-show="idedit" label="邮箱：" prop="entemail">
                                        <div style="display:inline-block;width:400px;">
                                            <Input v-model="userForm.entemail" ></Input>
                                        </div>
                                    </FormItem>
                                    <FormItem v-show="!idedit" label="邮箱：">
                                        <span class="static-msg">{{ userForm.entemail }}</span>
                                    </FormItem>
                                    <FormItem v-show="idedit" label="登录密码：">
                                        <Button type="text" size="small" @click="showEditPassword">修改密码</Button>
                                    </FormItem>
                                    <FormItem v-show="!idedit" label="登录密码：">
                                        <span class="static-msg">********</span>
                                    </FormItem>
                                    <div class="edit-btn" v-show="!idedit">
                                      <Button type="ghost" @click="toggleEdit(1)">编辑</Button>
                                    </div>
                                    <div v-show="idedit" style="margin-left: 110px;">
                                        <Button type="text" style="width: 100px;" @click="toggleEdit(2)">取消</Button>
                                        <Button type="primary" style="width: 100px;" :loading="save_loading" @click="saveEdit">保存</Button>
                                    </div>
                                </Form>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane label="系统日志">
                        <Row>
                            <Col span="24">
                                <Table stripe :columns="columns1" height="540" :data="data1" style="margin-bottom: 30px;"></Table>
                                <el-pagination
                                  @size-change="handleSizeChange"
                                  @current-change="handleCurrentChange"
                                  :current-page="currentpage"
                                  background
                                  :page-sizes="[10, 20, 30, 40]"
                                  :page-size="pagesize"
                                  layout="total, sizes, prev, pager, next, jumper"
                                  :total="joutotal">
                                </el-pagination>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
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
import Cookies from "js-cookie";
import md5 from "js-md5";
export default {
  name: "information",
  data() {
    const validePhone = (rule, value, callback) => {
      var re = /^1[0-9]{10}$/;
      if (!re.test(value)) {
        callback(new Error("请输入正确格式的手机号"));
      }

      this.axios
        .get("/apiweb/com/CheckComPhone", {
          params: { ComId: Cookies.get("yh_web_ComId"), ComPhone: value }
        })
        .then(res => {
          // console.log(res.data);
          if (!res.data.ok) {
            callback(new Error(res.data.msg));
          } else {
            callback();
          }
        })
        .catch(res => {
          callback(new Error("验证失败！"));
        });
    };
    const valideRePassword = (rule, value, callback) => {
      if (value !== this.editPasswordForm.newPass) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    const valideOldPassword = (rule, value, callback) => {
      console.log(md5(value))
      console.log(this.initOldPass)
      if (md5(value) !== this.initOldPass) {
        callback(new Error("原密码输入不正确"));
      } else {
        callback();
      }
    };
    return {
      ComId: Cookies.get("yh_web_ComId"), // 公司id,后期通过store获取
      userId: Cookies.get("yh_web_UserId"), // 当前用户Id
      entname: "无", // 顶部公司名称，初始化获取，每次编辑提交成功后刷新
      entndesc: "无", // 顶部公司介绍，初始化获取，每次编辑提交成功后刷新
      idedit: false, // 是否为编辑状态
      userForm: {
        entcompany: "", // 公司名称
        entnbrief: "", // 公司简称
        entabbre: "", // 公司介绍
        entopera: "", // 经营范围
        operatext: "", // 经营范围字符
        enturl: "", // 公网URL
        entnature: "", // 公司性质
        naturetext: "", // 公司性质字符
        entprefix: "", // 授权域名前缀
        name: "", // 联系人
        entemail: "", // 公司邮箱
        cellphone: "" // 电话号码
      },
      uid: "", // 登录用户的userId
      securityCode: "", // 验证码
      phoneHasChanged: false, // 是否编辑了手机
      save_loading: false,
      identifyError: "", // 验证码错误
      editPasswordModal: false, // 修改密码模态框显示
      savePassLoading: false, //loading加载
      oldPassError: "",
      identifyCodeRight: false, // 验证码是否正确
      hasGetIdentifyCode: false, // 是否点了获取验证码
      canGetIdentifyCode: false, // 是否可点获取验证码
      checkIdentifyCodeLoading: false,
      inforValidate: {
        entcompany: [
          { required: true, message: "请输入公司名称", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" }
        ],
        cellphone: [
          { required: true, message: "请输入手机号码" },
          { validator: validePhone }
        ],
        entemail: [
          { type: "email", message: "请输入正确的邮箱格式！", trigger: "blur" }
        ]
      },
      editPasswordForm: {
        oldPass: "",
        newPass: "",
        rePass: ""
      },
      passwordValidate: {
        oldPass: [
          { required: true, message: "请输入原密码", trigger: "blur" },
          { validator: valideOldPassword, trigger: "blur" }
        ],
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
      inputCodeVisible: false, // 显示填写验证码box
      initPhone: "", // 初始化手机号，用于比较与新手机号是否相同
      initOldPass: "", // 初始化原始密码，用于比较用户是否输入正确原密码
      gettingIdentifyCodeBtnContent: "获取验证码", // “获取验证码”按钮的文字
      columns1: [
        // thead
        // {
        //   type: "selection",
        //   width: 60,
        //   align: "center"
        // },
        {
          title: "操作对象",
          key: "LogObject"
        },
        {
          title: "操作类型",
          key: "LogType"
        },
        {
          title: "操作内容",
          key: "LogDes"
        },
        {
          title: "公司名称",
          key: "ComName"
        },
        {
          title: "操作时间",
          key: "OperTime"
        }
      ],
      data1: [],
      options1: [], // 经营范围
      options2: [], // 公司性质
      currentpage: 1, // 当前页码
      pagesize: 10, // 一页多少条
      joutotal: 200 // 总条数
    };
  },
  methods: {
    getIdentifyCode() {
      this.hasGetIdentifyCode = true;
      this.$refs["userForm"].validate(valid => {
        if (valid) {
          this.canGetIdentifyCode = true;
          let timeLast = 60;
          let timer = setInterval(() => {
            if (timeLast >= 0) {
              this.gettingIdentifyCodeBtnContent = timeLast + "秒后重试";
              timeLast -= 1;
            } else {
              clearInterval(timer);
              this.gettingIdentifyCodeBtnContent = "获取验证码";
              this.canGetIdentifyCode = false;
            }
          }, 1000);
          this.inputCodeVisible = true;
          // you can write ajax request here
        }
      });
    },
    showEditPassword() {
      this.editPasswordModal = true;
      this.$refs["editPasswordForm"].resetFields();
    },
    saveEdit() {
      // 按钮保存校验逻辑
      this.$refs["compForm"].validate(valid => {
        if (valid) {
          // 判定逻辑最后采集数据，调用保存接口函数
          let userData = {};
          userData.ComName = this.userForm.entcompany; // 公司名称
          userData.ComShortName = this.userForm.entnbrief; // 公司简称
          userData.ComIntro = this.userForm.entabbre; // 公司介绍
          userData.ComBusi = this.userForm.entopera; // 公司经营范围
          userData.ComUrl = this.userForm.enturl; // 公司公网URL
          userData.ComNature = this.userForm.entnature; // 公司性质
          userData.ComWww = this.userForm.entprefix; // 授权域名前缀
          userData.ComContact1 = this.userForm.name; // 联系人
          userData.ComName1 = this.userForm.cellphone; // 电话号码
          userData.ComMail = this.userForm.entemail; // 邮箱
          this.saveComEdit(userData);
          // this.UpdateComPwd();
        }
      });
    },
    cancelEditPass() {
      this.editPasswordModal = false;
    },
    getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
      }
      return "";
    },
    saveEditPass() {
      //let name = this.getCookie(cname);
      this.$refs["editPasswordForm"].validate(valid => {
        if (valid) {
          let queryData = {};
          this.savePassLoading = true;
          queryData.OldPwd = this.editPasswordForm.oldPass; // 原密码
          queryData.NewPwd = this.editPasswordForm.newPass; // 新密码
          Cookies.get("name"); // 获取修改人
          this.UpdateComPwd(queryData);
          // 在此次请求后台将数据传给后台，成功回调中提示
        }
      });
    },
    init() {
      let vm = this;
      //获取公司信息
      this.axios
        .get("/apiweb/com/GetOneCom", {
          params: {
            ComId: vm.ComId
          }
        })
        .then(res => {
          // console.log(res.data);
          // 顶部展示公司和公司介绍，每次编辑提交成功后刷新
          this.entname = res.data.ComName;
          this.entndesc = res.data.ComIntro;
          // 初始化手机号，用于用户在修改新手机号的时候比较是否相同
          this.initPhone = res.data.ComName1;
          this.$refs["compForm"].resetFields();
          // 表单中的数据填充和处理
          this.userForm.entcompany = res.data.ComName; // 公司名称
          this.userForm.entnbrief = res.data.ComShortName; // 公司简称
          this.userForm.entabbre = res.data.ComIntro; // 公司介绍
          this.userForm.enturl = res.data.ComUrl; // 公网URL
          this.userForm.entprefix = res.data.ComWww; // 授权域名前缀
          this.userForm.name = res.data.ComContact1; // 联系人
          this.userForm.cellphone = res.data.ComName1; // 表单中联系人电话
          this.userForm.entemail = res.data.ComMail; // 邮箱
          this.userForm.entopera = parseInt(res.data.ComBusi); // 经营范围

          this.userForm.entnature = parseInt(res.data.ComNature); // 公司性质
          //this.userForm.naturetext = res.data.ComNature; // 公司性质字符
          this.initOldPass = res.data.ComPwd; // 公司原密码
          console.log(this.initOldPass);
          // console.log(this.userForm);
          this.setOptionData(res.data);
          this.idedit = false;
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    //修改公司密码
    UpdateComPwd(data) {
      let vm = this;
      this.axios
        .get("/apiweb/com/UpdateComPwd", {
          params: {
            OldPwd: data.OldPwd,
            NewPwd: data.NewPwd
          }
        })
        .then(res => {
          //console.log(res.data);
          setTimeout(() => {
            if (res.data.ok) {
              vm.savePassLoading = false;
              vm.editPasswordModal = false;
              vm.$message({
                message: "保存成功！",
                type: "success"
              });
              vm.initOldPass = md5(data.NewPwd);
            } else {
              vm.savePassLoading = false;
              vm.editPasswordModal = true;
              vm.$message.error("保存失败！");
            }
          }, 500);
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    //编辑公司信息
    saveComEdit(data) {
      let vm = this;
      this.axios
        .get("/apiweb/com/ComUpdate", {
          params: {
            ComName: data.ComName, //公司名称
            ComShortName: data.ComShortName, //公司简称
            ComIntro: data.ComIntro, //公司简介
            ComBusi: data.ComBusi, //公司经营范围
            ComUrl: data.ComUrl, //公司公网url
            ComNature: data.ComNature, //公司性质
            // ComLogo: ComLogo,//公司logo
            ComWww: data.ComWww, //公司授权前缀
            ComContact1: data.ComContact1, //公司联系人
            ComName1: data.ComName1, //号码
            ComMail: data.ComMail, //邮箱
          }
        })
        .then(res => {
          // console.log(res.data.ok);
          if (res.data.ok) {
            vm.$message({
              message: "保存成功！",
              type: "success"
            });
          } else {
            vm.$message.error("保存失败！");
          }
          vm.init();
        })
        .catch(function(err) {
          console.log(err);
        });
      // 用于 成功提示消息或者失败消息
      //return;
    },
    //获取公司操作日志总数
    getComLogTotal() {
      let vm = this;
      this.axios
        .get("/apiweb/log/GetTotalLog", {
          params: {
            ComId: vm.ComId
          }
        })
        .then(res => {
          // console.log(res.data);
          vm.joutotal = res.data.total;
        })
        .catch(function(err) {
          console.log(err);
        });
    },

    //获取公司操作日志列表
    getComOperLogList() {
      let vm = this;
      this.axios
        .get("/apiweb/log/GetOperLogList", {
          params: {
            ComId: vm.ComId,
            currentpage: vm.currentpage, //当前页码
            pagesize: vm.pagesize //页大小
          }
        })
        .then(res => {
          vm.data1 = res.data;
          // console.log(res.data);
        })
        .catch(function(err) {
          console.log(err);
        });
    },

    setOptionData(a) {
      this.options1 = [
        {
          text: "商品贸易",
          value: 1
        },
        {
          text: "文化办公",
          value: 2
        },
        {
          text: "工艺品(除金银)",
          value: 3
        },
        {
          text: "日用百货",
          value: 4
        },
        {
          text: "家用电器",
          value: 5
        },
        {
          text: "电子产品",
          value: 6
        }
      ]; // 经营范围
      this.options2 = [
        {
          text: "国有企业",
          value: 1
        },
        {
          text: "集体企业",
          value: 2
        },
        {
          text: "联营企业",
          value: 3
        },
        {
          text: "股份合作制企业",
          value: 4
        },
        {
          text: "私营企业",
          value: 5
        },
        {
          text: "个体户",
          value: 6
        },
        {
          text: "合伙企业",
          value: 7
        },
        {
          text: "有限责任公司",
          value: 8
        },
        {
          text: "股份有限公司",
          value: 9
        }
      ]; // 公司性质
      for (let i = 0; i < this.options2.length; i++) {
        if (this.options2[i]["value"] == a.ComNature) {
          this.userForm.naturetext = this.options2[i].text;
        }
      }

      for (let j = 0; j < this.options1.length; j++) {
        if (this.options1[j]["value"] == a.ComBusi) {
          this.userForm.operatext = this.options1[j].text;
        }
      }
    },
    cancelInputCodeBox() {
      this.inputCodeVisible = false;
      this.userForm.cellphone = this.initPhone;
    },
    submitCode() {
      let vm = this;
      vm.checkIdentifyCodeLoading = true;
      if (this.securityCode.length === 0) {
        this.$Message.error("请填写短信验证码");
      } else {
        setTimeout(() => {
          this.$Message.success("验证码正确");
          this.inputCodeVisible = false;
          this.checkIdentifyCodeLoading = false;
        }, 1000);
      }
    },
    hasChangePhone() {
      // 废弃
      this.phoneHasChanged = true;
      this.hasGetIdentifyCode = false;
      this.identifyCodeRight = false;
    },
    saveInfoAjax() {
      this.save_loading = true;
      setTimeout(() => {
        this.$Message.success("保存成功");
        this.save_loading = false;
      }, 1000);
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.getComOperLogList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentpage = val;
      this.getComOperLogList();
      this.getComLogTotal();
    },
    toggleEdit(a) {
      if (a === 1) {
        this.idedit = true;
      } else if (a === 2) {
        this.idedit = false;
        // 取消代码段
        return;
        this.$store.commit("removeTag", "ownspace_index");
        localStorage.pageOpenedList = JSON.stringify(
          this.$store.state.app.pageOpenedList
        );
        let lastPageName = "";
        if (this.$store.state.app.pageOpenedList.length > 1) {
          lastPageName = this.$store.state.app.pageOpenedList[1].name;
        } else {
          lastPageName = this.$store.state.app.pageOpenedList[0].name;
        }
        this.$router.push({
          name: lastPageName
        });
      }
    }
  },
  mounted() {
    this.init();
    this.getComOperLogList();
    this.getComLogTotal();
  }
};
</script>
