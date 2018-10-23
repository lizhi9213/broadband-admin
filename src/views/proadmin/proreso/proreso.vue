<style lang="less">
@import "./extension.less";
</style>

<template>
    <div>
         <Card>
            <!-- 顶部标题 -->
            <p slot="title">
                <Icon type="merge"></Icon>
                分机管理
            </p>
            <div>
              <Row class="lable-box">
                <Col span="24">
                    <div class="hadle-box">
                      <div class="search-box">
                        <el-input placeholder="请输入内容" v-model="keyWord" class="input-with-select">
                          <el-button slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                      </div>
                      <Button type="success" icon="ios-telephone" @click="openModal(1)">新增</Button>&nbsp;&nbsp;&nbsp;<Button @click="openModal(2)" type="info" icon="compose">编辑</Button>&nbsp;&nbsp;&nbsp;<Button type="error" @click="confirm" icon="trash-b">移除</Button>
                    </div>
                    <Table stripe :columns="columns" @on-select="selectTd" @on-select-cancel="canceSlect" height="560" :data="extdata" style="margin-bottom: 30px;"></Table>
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
        <!-- 新增分机弹出框 -->
        <Modal
            v-model="popmodel"
            :title="modelTitle"
            @on-ok="modalOk"
            @on-cancel="modalCancel">
            <Form ref="formValidate" :model="formData" :rules="ruleDate" :label-width="80">
              <FormItem label="分机号：" prop="extnum">
                  <Input v-model="formData.extnum" placeholder="请输入分机号"></Input>
              </FormItem>
              <FormItem label="分机名：" prop="extname">
                  <Input v-model="formData.extname" placeholder="请输入分机名"></Input>
              </FormItem>
              <FormItem label="密码：" prop="extpw">
                  <Input type="password" v-model="formData.extpw" placeholder="请填写密码"></Input>
              </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
export default {
  name: "proreso",
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
      popmodel: false,
      modelTitle: "新增分机",
      formData: {
        // 新增/编辑数据集
        extnum: "", // 分机号
        extname: "", // 分机名
        extpw: "" // 密码
      },
      ruleDate: {
        // 验证提示消息
        extnum: [
          {
            required: true, //是否为必填
            message: "分机号不能为空！", // 提示消息
            trigger: "blur" // 焦点离开后验证
          }
        ],
        extpw: [
          {
            required: true, //是否为必填
            message: "密码不能为空！", // 提示消息
            trigger: "blur" // 焦点离开后验证
          }
        ]
      },
      columns: [
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
          title: "分机号",
          key: "extnum"
        },
        {
          title: "分机名",
          key: "extname"
        },
        {
          title: "密码",
          key: "extpw"
        },
        {
          title: "分机状态",
          key: "extstatus"
        },
        {
          title: "注册状态",
          key: "register"
        },
        {
          title: "用户状态",
          key: "userstatus"
        },
        {
          title: "注册IP",
          key: "regip"
        }
      ],
      extdata: [],
      selectdata: [], // 选中的所有数据
      selectone: [], // 选中的单条数据
      pageSize: 10, //当前一页多少数据
      pageCurrent: 1 // 当前页码
    };
  },
  methods: {
    inint(a = 1) {
      // 初始化加载，请求数据
      this.extdata = [
        {
          extnum: "FSJ001",
          extname: "FSJ001",
          extpw: "123456",
          extstatus: "空闲",
          register: "未注册",
          userstatus: "示忙1",
          regip: "171.8.0.33"
        },
        {
          extnum: "FSJ001",
          extname: "FSJ002",
          extpw: "123456",
          extstatus: "空闲",
          register: "未注册",
          userstatus: "示忙2",
          regip: "171.8.0.33"
        },
        {
          extnum: "FSJ001",
          extname: "FSJ003",
          extpw: "123456",
          extstatus: "空闲",
          register: "未注册",
          userstatus: "示忙3",
          regip: "171.8.0.33"
        },
        {
          extnum: "FSJ001",
          extname: "FSJ004",
          extpw: "123456",
          extstatus: "空闲",
          register: "未注册",
          userstatus: "示忙4",
          regip: "171.8.0.33"
        }
      ];
      return;
      this.axios
        .get("/apiweb/grant/Add", {
          params: {
            //Action: "AllShopList",
            // keyWord: "",
            // xxx:aaa
            ComId: ComId,
            GrantNum: GrantNum,
            CreatId: CreateId,
            StartTime: StartTime,
            EndTime: EndTime
          }
        })
        .then(res => {
          console.log(res.data);
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    openModal(t) {
      // t 表示打开类别： 1新增 2编辑
      if (t == 1) {
        this.modelTitle = "新增分机";
        // 新增先清空data存储model中的数据
        this.formData.extnum = "";
        this.formData.extname = "";
        this.formData.extpw = "";
      } else if (t == 2) {
        this.modelTitle = "编辑分机";
        if (this.selectdata.length != 1 && this.selectone != 1) {
          this.$Message.warning({
            content: "请选择一条数据",
            duration: 3,
            closable: true,
            top: 50
          });
          return;
        } else {
          // console.log(this.selectone)
          this.formData.extnum = this.selectone.extnum;
          this.formData.extname = this.selectone.extname;
          this.formData.extpw = this.selectone.extpw;
        }
      }
      this.popmodel = true;
    },
    modalOk() {
      // 新增/编辑的保存
    },
    modalCancel() {
      // 新增/编辑的取消
    },
    selectTd(s, r) {
      // 在多选模式下有效，选中某一项时触发
      // 批量操作，移除用
      // console.log(s); // 所有选中的数据集合
      this.selectdata = s;
      // 编辑单条，编辑用
      // console.log(r); // 选中当前单条数据
      this.selectone = r;
    },
    canceSlect(s, r) {
      //console.log(s);
      //console.log(r);
      // 在多选模式下有效，取消选中某一项时触发
      this.selectdata = s;
      this.selectone = [];
      if (s.length == 1) {
        this.selectone = s[0];
        console.log(this.selectone);
      }
    },
    handleSizeChange(val) {
      this. pageSize = val;
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pageCurrent = val
      console.log(`当前页: ${val}`);
    },
    confirm() {
      this.$Modal.confirm({
        title: "系统提示你您",
        content: "<p>是否要删除这些选项吗？</p>",
        onOk: () => {
         // 点击确定
        },
        onCancel: () => {
          // 点击取消
        }
      });
    }
  },
  mounted() {
    this.inint();
  }
};
</script>
