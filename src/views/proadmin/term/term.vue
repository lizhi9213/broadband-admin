<style lang="less">
@import "./term.less";
</style>

<template>
    <div>
        <Card v-if="!showtest">
            <!-- 顶部标题 -->
            <p slot="title">
                <Icon type="android-checkbox-outline"></Icon>
                话术问卷
            </p>
            <div>
              <Row class="lable-box">
                <Col span="24">
                    <Tabs value="name1" :animated="false">
                      <TabPane label="模板话术" name="name1">
                        <div class="hadle-box">
                          <div class="search-box">
                            <el-input placeholder="请输入内容" v-model="keyWord" class="input-with-select">
                              <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                          </div>
                          <Button type="success" icon="plus-round" @click="openModal(1)">新增话术</Button>&nbsp;&nbsp;&nbsp;<Button  type="warning" icon="compose" @click="openModal(2)">编辑</Button>&nbsp;&nbsp;&nbsp;<Button type="error" @click="confirm" icon="trash-b">移除</Button>
                        </div>
                        <Table stripe :columns="columns1" @on-select="selectTd" @on-select-cancel="canceSlect" height="560" :data="termdata1" style="margin-bottom: 30px;"></Table>
                      </TabPane>
                      <TabPane label="模板问卷" name="name2">
                        <div class="hadle-box">
                          <div class="search-box">
                            <el-input placeholder="请输入内容" v-model="keyWord" class="input-with-select">
                              <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                          </div>
                          <Button type="success" icon="plus-round" @click="openModal(3)">新增问卷</Button>
                          <!-- &nbsp;&nbsp;&nbsp;<Button type="error" @click="confirm" icon="trash-b">移除</Button> -->
                        </div>
                        <Table stripe :columns="columns2" @on-select="selectTd" @on-select-cancel="canceSlect" height="560" :data="termdata2" style="margin-bottom: 30px;"></Table>
                      </TabPane>
                    </Tabs>
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
        <Card class="test-paper"  v-if="showtest">
          <!-- 顶部标题 -->
          <p slot="title">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item><span class="test-title" @click="showtest = false">话术问卷</span> </el-breadcrumb-item>
              <el-breadcrumb-item>移动流量问卷试题</el-breadcrumb-item>
            </el-breadcrumb>
          </p>
          <div>
            <Row class="test-box">
              <!-- 左侧树形试题列表 -->
              <Col span="4" class="tree">
                <el-tree
                  :data="treedata"
                  :props="defaultProps"
                  accordion
                  :expand-on-click-node="false">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                      <span>{{ node.label }}</span>
                      <span v-if="node.level == 1">
                        <el-button
                          type="text"
                          size="mini"
                          @click="() => treeEdit(data)">
                          编辑
                        </el-button>
                        <el-button
                          type="text"
                          size="mini"
                          @click="() => treeRemove(node, data)">
                          删除
                        </el-button>
                      </span>
                    </span>
                </el-tree>
              </Col>
              <!-- 右侧试题填写表单 -->
              <Col span="19" offset="1"> 
                <Form :model="questdata" :rules="rulequest" :label-width="100">
                  <FormItem label="问题类型：" prop="quealign">
                      <Select v-model="questdata.quealign" placeholder="设置问题显示类型">
                          <Option value="1">单选题</Option>
                          <Option value="2">多选题</Option>
                          <Option value="3">填空题</Option>
                          <Option value="4">问答题</Option>
                          <Option value="5">描述题</Option>
                      </Select>
                  </FormItem>
                  <FormItem label="题目标题标题：" prop="quetitle">
                      <Input v-model="questdata.quetitle" placeholder="请输入题目标题"></Input>
                  </FormItem>
                  <FormItem label="排列方式：" prop="quetype">
                      <Select v-model="questdata.quetype" placeholder="设置子选项排列方式">
                          <Option value="1">纵向排列</Option>
                          <Option value="2">横向排列</Option>
                      </Select>
                  </FormItem>
                  <FormItem label="分隔标识：" prop="quehref">
                      <Checkbox v-model="single">Checkbox</Checkbox>&nbsp;&nbsp;&nbsp;<span>是否在本题顶部或底部显示分隔行，以标识问卷不同部分</span>
                  </FormItem>
                  <FormItem label="是否结束：" prop="quehref">
                      <Checkbox v-model="single">Checkbox</Checkbox>&nbsp;&nbsp;&nbsp;<span>是否在本题结束本问卷</span>
                  </FormItem>
                  <FormItem label="问卷描述：" prop="desc">
                      <Input v-model="questdata.desc" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请填写问卷描述"></Input>
                  </FormItem>
                  <FormItem label="序号：" prop="quenum">
                      <Input v-model="questdata.quenum" placeholder="列表显示的顺序（填写数字）"></Input>
                  </FormItem>
                   <FormItem label="是否生效：" prop="extname">
                      <Switch v-model="switch1" @on-change="change"></Switch>
                  </FormItem>
                </Form>
              </Col>
            </Row>
          </div>
        </Card>
        <!-- 新增话术/问卷弹出框 -->
        <Modal
            v-model="popmodel"
            width="960"
            :title="modelTitle"
            @on-ok="modalOk"
            @on-cancel="modalCancel">
            <div class="term-box" v-if="tertype == 1">
              <Form :model="speechdata" :rules="rulespeech" :label-width="100">
                <FormItem label="话术编号：" prop="spenum">
                    <Input v-model="speechdata.spenum" placeholder="请填写话术编号"></Input>
                </FormItem>
                <FormItem label="话术名称：" prop="spename">
                    <Input v-model="speechdata.spename" placeholder="请填写话术名称"></Input>
                </FormItem>
                <FormItem label="公告内容：">
                    <div class="margin-top-20">
                      <textarea id="articleEditor"></textarea>
                    </div>
                </FormItem>
                <FormItem label="是否生效：" prop="extname">
                    <Switch v-model="switch1" @on-change="change"></Switch>
                </FormItem>
                <FormItem label="备注：" prop="desc">
                    <Input v-model="speechdata.desc" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请填写备注"></Input>
                </FormItem>
              </Form>
            </div>
            <div v-if="tertype == 2">
              <Form :model="questdata" :rules="rulequest" :label-width="100">
                <FormItem label="问卷标题：" prop="quetitle">
                    <Input v-model="questdata.quetitle" placeholder="请填写问卷标题"></Input>
                </FormItem>
                <FormItem label="对齐方式：" prop="quealign">
                    <Select v-model="questdata.quealign" placeholder="设置问题内容对齐方式">
                        <Option value="1">居中显示</Option>
                        <Option value="2">居左显示</Option>
                    </Select>
                </FormItem>
                <FormItem label="问题显示类型：" prop="quetype">
                    <Select v-model="questdata.quetype" placeholder="设置问题显示类型">
                        <Option value="1">全文列表</Option>
                        <Option value="2">分别列表</Option>
                    </Select>
                </FormItem>
                <FormItem label="是否打开跳转：" prop="quehref">
                    <Select v-model="questdata.quehref" placeholder="设置单选题选中答案后是否自动跳转到下一题">
                        <Option value="1">是</Option>
                        <Option value="2">否</Option>
                    </Select>
                </FormItem>
                <FormItem label="问卷描述：" prop="desc">
                    <Input v-model="questdata.desc" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请填写问卷描述"></Input>
                </FormItem>
                <FormItem label="序号：" prop="quenum">
                    <Input v-model="questdata.quenum" placeholder="列表显示的顺序（填写数字）"></Input>
                </FormItem>
                 <FormItem label="是否生效：" prop="extname">
                    <Switch v-model="switch1" @on-change="change"></Switch>
                </FormItem>
              </Form>
            </div>
        </Modal>
    </div>
</template>

<script>
import tinymce from "tinymce";
export default {
  name: "term",
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
      showtest: false, // 是否显示试卷
      popmodel: false,
      switch1: false,
      switch2: false,
      modelTitle: "新增话术",
      tertype: 1,
      speechdata: {
        // 新增/编辑话术
        spenum: "", // 话术编号
        spename: "", // 话术名称
        desc: ""
      },
      rulespeech: {
        // 验证提示消息
        spenum: [
          {
            required: true, //是否为必填
            message: "话术编号不能为空！", // 提示消息
            trigger: "blur" // 焦点离开后验证
          }
        ],
        spename: [
          {
            required: true, //是否为必填
            message: "话术名称不能为空！", // 提示消息
            trigger: "blur" // 焦点离开后验证
          }
        ]
      },
      questdata: {
        quetitle: "",
        quealign: "",
        quetype: "",
        quehref: "",
        quenum: "",
        desc: ""
      },
      rulequest: {},
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
          title: "术语编号",
          key: "termnum"
        },
        {
          title: "术语名称",
          key: "termname"
        },
        {
          title: "术语备注",
          key: "termremark"
        },
        {
          title: "创建时间",
          key: "termdate"
        },
        {
          title: "有效",
          key: "effective",
          align: "left",
          render: (h, params) => {
            // 使用vue render函数处理table中td里面的switch渲染及事件处理
            console.log(params);
            return h("div", [
              h(
                "i-switch",
                {
                  //数据库1是已处理，0是未处理
                  props: {
                    type: "primary",
                    value: params.row.effective === 1 // 控制开关的打开或关闭状态，官网文档属性是value
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
      columns2: [
        {
          title: "问卷标题",
          key: "tertitle"
        },
        {
          title: "描述",
          key: "terdesc"
        },
        {
          title: "问题个数",
          key: "ternum"
        },
        {
          title: "文件类型",
          key: "tertype"
        },
        {
          title: "创建时间",
          key: "terdate"
        },
        {
          title: "操作",
          key: "effective",
          align: "left",
          render: (h, params) => {
            // 使用vue render函数处理table中td里面的switch渲染及事件处理
            console.log(params);
            return h(
              "Dropdown",
              {
                props: {
                },
                on: {
                  'on-click': value => {
                    console.log(value);
                    // console.log(params.row.termnum);
                  }
                }
              },
              [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary"
                    }
                  },
                  [
                    "更多 ",
                    h("Icon", {
                      props: {
                        type: "arrow-down-b"
                      }
                    })
                  ]
                ),
                h(
                  "DropdownMenu",
                  {
                    slot: "list"
                  },
                  [
                    h(
                      "DropdownItem",
                      {
                        props: {
                          name: "1"
                        }
                      },
                      "预览问卷"
                    ),
                    h(
                      "DropdownItem",
                      {
                        props: {
                          name: "2"
                        }
                      },
                      "编辑问卷"
                    ),
                     h(
                      "DropdownItem",
                      {
                        props: {
                          name: "2"
                        }
                      },
                      "查看试题"
                    )
                  ]
                )
              ]
            );
          }
        }
      ],
      treedata: [
        {
          label: "题目一",
          children: [
            {
              label: "问题步骤选项"
            }
          ]
        },
        {
          label: "题目二",
          children: [
            {
              label: "问题步骤选项1"
            },
            {
              label: "问题步骤选项"
            }
          ]
        },
        {
          label: "题目三"
        }
      ], // 树形菜单数据
      defaultProps: {
        children: "children",
        label: "label"
      },
      termdata1: [], // 术语数据集
      termdata2: [], // 问卷数据集
      selectdata: [], // 选中的所有数据
      selectone: [], // 选中的单条数据
      pageSize: 10, //当前一页多少数据
      pageCurrent: 1 // 当前页码
    };
  },
  methods: {
    inint(a = 1) {
      // 初始化加载，请求数据
      this.termdata1 = [
        {
          termnum: 120,
          termname: "南阳邓州流量加量不加价",
          termremark: "无备注",
          termdate: "2018-04-23 13:34",
          effective: 1
        },
        {
          termnum: 120,
          termname: "南阳邓州流量加量不加价",
          termremark: "无备注",
          termdate: "2018-04-23 13:34",
          effective: 1
        },
        {
          termnum: 120,
          termname: "南阳邓州流量加量不加价",
          termremark: "无备注",
          termdate: "2018-04-23 13:34",
          effective: 1
        },
        {
          termnum: 120,
          termname: "南阳邓州流量加量不加价",
          termremark: "无备注",
          termdate: "2018-04-23 13:34",
          effective: 1
        }
      ];
      this.termdata2 = [
        {
          tertitle: "移动流量调查问卷",
          terdesc: "一个关于移动流量的调查问卷",
          ternum: 12,
          tertype: "类型一",
          terdate: "2018-4-26 17:21"
        },
        {
          tertitle: "移动流量调查问卷",
          terdesc: "一个关于移动流量的调查问卷",
          ternum: 12,
          tertype: "类型一",
          terdate: "2018-4-26 17:21"
        },
        {
          tertitle: "移动流量调查问卷",
          terdesc: "一个关于移动流量的调查问卷",
          ternum: 12,
          tertype: "类型一",
          terdate: "2018-4-26 17:21"
        },
        {
          tertitle: "移动流量调查问卷",
          terdesc: "一个关于移动流量的调查问卷",
          ternum: 12,
          tertype: "类型一",
          terdate: "2018-4-26 17:21"
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
    change(status) {
      // switch 开关
      this.$Message.info("开关状态：" + status);
    },
    openModal(t) {
      // t 表示打开类别： 1新增 2编辑
      switch (t) {
        case 1:
          this.tertype = 1;
          this.modelTitle = "新增话术";
          break;
        case 2:
          this.tertype = 1;
          this.modelTitle = "编辑话术";
          break;
        case 3:
          this.tertype = 2;
          this.modelTitle = "新增问卷";
          break;
        case 4:
          this.tertype = 2;
          this.modelTitle = "编辑问卷";
          break;
      }
      if (t == 5) {
        // 先判断用户是否选择了一个问卷，如果是就显示问卷试题列表
        this.showtest = true;
      } else {
        this.popmodel = true;
      }
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
      this.pageSize = val;
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pageCurrent = val;
      console.log(`当前页: ${val}`);
    },
    treeEdit(data) {
      // 增加
      const newChild = { id: id++, label: "testtest", children: [] };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },
    treeRemove(node, data) {
      console.log(node);
      console.log(data);
      // 移除
      return;
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
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
    // 编辑器
    tinymce.init({
      selector: "#articleEditor",
      branding: false,
      elementpath: false,
      height: 360,
      language: "zh_CN.GB2312",
      menubar: "edit insert view format table tools",
      theme: "modern",
      plugins: [
        "advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools",
        "searchreplace visualblocks visualchars code fullscreen fullpage",
        "insertdatetime media nonbreaking save table contextmenu directionality",
        "emoticons paste textcolor colorpicker textpattern imagetools codesample"
      ],
      toolbar1:
        " newnote print fullscreen preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample",
      autosave_interval: "20s",
      image_advtab: true,
      table_default_styles: {
        width: "100%",
        borderCollapse: "collapse"
      }
    });
  },
  destroyed() {
    tinymce.get("articleEditor").destroy();
  }
};
</script>
