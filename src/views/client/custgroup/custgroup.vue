<style lang="less">
@import "./custgroup.less";
</style>


<template>
    <div>
         <Card>
            <!-- 顶部标题 -->
            <p slot="title">
                <Icon type="chatboxes"></Icon>
                用户组
            </p>
            <div>
              <Row class="group">
                <Col span="24">
                    <div class="hadle-box">
                      <div class="search-box">
                        <Input placeholder="请输入查询条件" v-model="keyWord" class="input-with-search" style="margin-bottom: 2px;" @on-enter="init">
                          <Button slot="append" icon="ios-search" @click="init"></Button>
                        </Input>
                      </div>
                      <div class="btn-box">
                        <Button type="success" @click="openModal(1)" icon="plus">添加用户组</Button>
                        <!-- &nbsp;&nbsp;&nbsp;<Button @click="openModal(2)" type="info" icon="compose">编辑</Button> -->
                        &nbsp;&nbsp;&nbsp;<Button @click="openModal(3)" type="error" icon="trash-b">删除用户组</Button>
                      </div>
                    </div>
                    <Table stripe :show-overflow-tooltip="true" @on-selection-change="onSelect" :loading="loading" :columns="columns1" :height="tableHeight" :data="tableData.data" style="margin-bottom: 10px;"></Table>
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page.sync="curnPage"
                      background
                      :page-sizes="[30, 50]"
                      :page-size="sizePage"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="tableData.total">
                    </el-pagination>
                </Col>
              </Row>
            </div>
         </Card>
        <!-- 添加/编辑用户组弹出框 -->
        <Modal v-model="groupModal" :width="700" :styles="{'margin-right':'0','height':'calc(100% - 100px)'}" :transfer="false" :transition-names="['move-right','fade']">
            <h3 slot="header" style="color:#2D8CF0">{{modalTitle}}</h3>
            <Form ref="groupForm" class="group-form" :model="groupData" :label-width="100" label-position="right" :rules="rulField" style="height:100%; overflow-y:auto;padding-right: 14px;">
                <FormItem class="select-parent" label="用户组父级：" prop="Parent" :error="errorParent">
                  <Cascader :data="parentList" :change-on-select="true" @on-visible-change="parentClose" v-model="groupData.Parent" placeholder="请选择父级,不选默认为最高级层级"></Cascader>
                  <p>选择完成后点击空白处，即可关闭当前选择列表</p>
                </FormItem>
                <FormItem label="用户组名称：" prop="GroupName">
                  <Input v-model="groupData.GroupName" placeholder="请填用户组名称" ></Input>
                </FormItem>
                <FormItem v-if="false" label="用户组类型：" prop="GroupType">
                  <Select v-model="groupData.GroupType"  @on-open-change="mulOpenChange" filterable>
                    <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="负责人：" prop="GroupCharge">
                  <Select v-model="groupData.GroupCharge">
                    <Option v-for="item in userList" :value="item.value+''" :key="item.value+''">{{ item.label }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="用户组成员：" class="formeitem-users" prop="GroupUsers">
                  <el-select v-model="selectedUsers" @visible-change="mulOpenChange" filterable multiple placeholder="请选择成员或在输入框中键入关键字" style="width: 100%;">
                    <el-option
                      v-for="item in userList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <div class="user-list-box">
                    <ul id="doList"  class="iview-admin-draggable-list">
                      <li v-for="(item, index) in dragList" :key="index" class="notwrap todolist-item" :data-id="item.value" :data-index="index">
                          <Icon type="person" size="20" style="vertical-align: middle;"></Icon>&nbsp;&nbsp;&nbsp;{{ item.label }}<Button type="ghost" class="handle_bth" @click="removeBtn(item.value)" size="small">移除</Button>
                      </li>
                    </ul>
                  </div>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text"  @click="groupModal = false">取消</Button>
                <Button type="primary" :loading="savePassLoading" @click="btnOk">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import Cookies from "js-cookie";
import Sortable from "sortablejs";
export default {
  name: "custgroup",
  data() {
    let vm = this;
    const valideGroupName = (rule, value, callback) => {
      if (this.modalTitle == "编辑用户组") {
        return callback();
      }
      if (!value) {
        return callback(new Error("请输入有效值"));
      }
      this.axios
        .get("/apiweb/guests/Verification", {
          params: { GroupName: value, ComId: vm.ComId }
        })
        .then(res => {
          // console.log(res.data);
          if (!res.data.ok) {
            callback(new Error("字段已存在"));
          } else {
            callback();
          }
        })
        .catch(res => {
          callback(new Error("验证失败"));
        });
    };
    return {
      ComId: Cookies.get("yh_web_ComId"),
      keyWord: "", //搜索框关键字
      groupModal: false, // 修改密码模态框显示
      modalTitle: "添加用户组",
      savePassLoading: false, // 保存loading
      selectedUsers: [], // select多选列表
      dragList: [], // 拖拽列表；
      groupData: {
        GroupName: "", // 用户组名称
        GroupType: "", // 用户组类型
        GroupCharge: "", // 用户组负责人
        GroupUsers: [], // 用户组成员
        Parent: [] //所属父级
      },
      rulField: {
        GroupName: [
          { required: true, message: "名称不可为空", whitespace: true },
          { validator: valideGroupName, trigger: "blur" }
        ],
        GroupCharge: [
          { required: true, message: "负责人不可为空", trigger: "change" }
        ]
      },
      errorParent: "", // 父级报错信息
      parentList: [], // 父级联级数据
      columns1: [
        // thead
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "用户组名字",
          key: "GroupName",
          width: 180,
          fixed: "left",
          render: (h, params) => {
            // console.log(params);
            let vm = this;
            // console.log(params);
            let uName = params.row.GroupName;
            let tips = "点击编辑" + uName + "的信息";
            let groupId = params.row.GroupId;
            return h(
              "div",
              {
                attrs: {
                  class: "table-name"
                },
                style: {
                  overflow: "hidden",
                  height: "100%",
                  width: "100%",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }
              },
              [
                h("span", {
                  style: {
                    lineHeight: "42px"
                  },
                  domProps: {
                    innerHTML: uName
                  }
                }),
                h(
                  "el-tooltip",
                  {
                    props: {
                      effect: "dark",
                      content: tips,
                      placement: "right"
                    },
                    style: {
                      float: "right"
                    }
                  },
                  [
                    h("Button", {
                      props: {
                        type: "text",
                        icon: "compose"
                      },
                      style: {
                        float: "right",
                        color: "#2d8cf0",
                        fontSize: "18px"
                      },
                      on: {
                        click: event => {
                          // 阻止冒泡事件
                          event.stopPropagation();
                          vm.setGroup(groupId);
                        }
                      }
                    })
                  ]
                )
              ]
            );
          }
        },
        {
          title: "父级组",
          key: "GroupPName",
          render: (h, params) => {
            let pName = params.row.GroupPName;
            if (pName == null || pName == "") {
              pName = "无";
            }
            return h("span", pName);
          }
        },
        {
          title: "负责人",
          key: "UserName",
          render: (h, params) => {
            let name = params.row.UserName;
            if (!name) {
              name = "无";
            }
            return h("span", name);
          }
        },
        {
          title: "组员",
          key: "GroupUserName",
          render: (h, params) => {
            let num = params.row.GroupUserName;
            // console.log(num);
            if (!num) {
              num = "0人";
            } else {
              num = num.split(",").length + "人";
            }
            return h("span", num);
          }
        }
      ], // 表头
      tableData: {
        data: [],
        total: 0
      }, // 主体结构数据
      typeList: [
        {
          value: "1",
          label: "类型一"
        },
        {
          value: "2",
          label: "类型二"
        },
        {
          value: "3",
          label: "类型三"
        }
      ], // 类型列表
      userList: [], // 用户列表
      checkedList: [],
      curnPage: 1,
      sizePage: 30,
      loading: false,
      tableHeight: 500
    };
  },
  methods: {
    openModal(a) {
      let vm = this;
      this.$refs["groupForm"].resetFields();
      if (vm.savePassLoading) {
        return;
      }
      // 先初始化表单
      this.groupData = {
        GroupName: "", // 用户组名称
        GroupType: "", // 用户组类型
        GroupUsers: [] // 用户组成员
      };
      this.dragList = [];
      // 处理打开，新增/编辑
      if (a == 1) {
        this.modalTitle = "添加用户组";
        this.groupModal = true;
      } else if (a == 2) {
        this.modalTitle = "编辑用户组";
        // 判断用户是否选择了一条数据
        if (this.checkedList.length == 0 || this.checkedList.length > 1) {
          this.$message({
            message: "请选择一条数据再进行操作",
            type: "warning"
          });
          return;
        }
        // 调用查询单条并设置数据进modal框中
        // this.setGroup();
      } else if (a == 3) {
        // 删除用户，先判定用户是否选择了一条或多条数据
        if (this.checkedList.length == 0) {
          this.$message({
            message: "请至少选择一条数据再进行操作",
            type: "warning"
          });
          return;
        } else {
          this.delGroup();
        }
      }
    },
    setGroup(a) {
      let vm = this;
      console.log(a);
      this.modalTitle = "编辑用户组";
      this.checkedList = a;
      this.groupModal = true;
      this.axios
        .get("/apiweb/guests/SelectGroup", { params: { GroupID: a } })
        .then(res => {
          // console.log(res.data);
          // 先重置列表
          vm.dragList = [];
          vm.groupData.Parent = res.data.row;
          vm.groupData.GroupName = res.data.data[0].GroupName;
          vm.groupData.GroupCharge = res.data.data[0].UserID + "";
          let values = res.data.data[0].GroupUserId.split(",");
          let labels = res.data.data[0].GroupUserName.split(",");
          vm.$nextTick(function() {
            for (let [index, item] of values.entries()) {
              let nowitem = {};
              nowitem.value = item;
              nowitem.label = labels[index];
              vm.dragList.push(nowitem);
            }
            // console.log(vm.dragList);
          });
          // vm.groupData.GroupCharge = res.data.data[0].UserID;
        })
        .catch(err => {
          console.log(err);
        });
    },
    delGroup() {
      const vm = this;

      for (let item of vm.checkedList) {
        let hasUser = item.GroupUserName;
        // 后台必须保证数据是字符串
        if (item.GroupUserName && item.GroupUserName.split(",").length != 0) {
          // console.log(item.GroupUserName);
          vm.$message.warning(
            "当前选中的用户组中有组员，请先该组中的组员清空再删除！"
          );
          return;
        }
      }
      // console.log(vm.checkedList);
      // 调用警告框，如果用户确定执行删除操作
      this.$confirm("此操作将删除您所选中的字段, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log(
            JSON.stringify(
              vm.checkedList.map(item => {
                return { GroupID: item.GroupId, GroupName: item.GroupName };
              })
            )
          );
          vm.axios
            .get("/apiweb/guests/DelGroup", {
              params: {
                ObjectData: JSON.stringify(
                  vm.checkedList.map(item => {
                    return { GroupID: item.GroupId, GroupName: item.GroupName };
                  })
                )
              }
            })
            .then(res => {
              if (res.data.ok) {
                vm.$message.success(res.data.msg);
                vm.init();
              } else vm.$message.error(res.data.msg);
            })
            .catch(res => {
              vm.$message.error("操作失败！");
            });
        })
        .catch(() => {});
    },
    btnOk() {
      let vm = this;
      this.savePassLoading = true;
      this.$refs["groupForm"].validate(valid => {
        if (valid) {
          //采集数据
          // 处理表单数据
          let IdList = [];
          vm.dragList.forEach(item => {
            IdList.push(item.value);
          });
          let saveUrl = "/apiweb/guests/InsertGroup";
          let params = {
            GroupPID: vm.groupData.Parent[vm.groupData.Parent.length - 1] || -1, //上级编号
            GroupName: vm.groupData.GroupName, //名称
            Principal: vm.groupData.GroupCharge, //负责人编号
            UserID: IdList.join(",") //员工编号
          };
          if (vm.modalTitle == "编辑用户组") {
            params.GroupID = vm.checkedList; // 当前编辑的用户组id
            saveUrl = "/apiweb/guests/UpdateGroup";
            // 判断联级是否选择正确
            // errorParent
            if (vm.groupData.Parent.find(n => n == vm.checkedList)) {
              vm.errorParent = "不能选择当前组自己和它下面的子级组！";
              return;
            } else {
              vm.errorParent = "";
            }
            // console.log(vm.checkedList);
            // console.log(vm.groupData.Parent);
            // console.log(params);
          }
          this.axios
            .get(saveUrl, { params })
            .then(res => {
              // console.log(res.data);
              if (res.data.ok) {
                vm.$message.success(res.data.msg);
                this.init();
                vm.groupModal = false;
                vm.savePassLoading = false;
              } else {
                vm.$message.error(res.data.msg);
                vm.savePassLoading = false;
              }
            })
            .catch(res => {
              this.$message.error("操作失败！");
              this.savePassLoading = false;
            });
        } else {
          this.savePassLoading = false;
        }
      });
    },
    onSelect(s) {
      this.checkedList = s;
    },
    mulOpenChange(value) {
      let vm = this;
      if (!value) {
        // console.log("下拉框隐藏");
        // console.log(this.selectedUsers); // 多选modal项
        // 将选中的数据处理并保存到下方到列表中
        // this.groupData["GroupUsers"] = [];
        let newArr = vm.dragList.slice(0);
        for (let item of vm.userList) {
          // console.log(item);
          if (vm.selectedUsers.find(selId => selId === item.value)) {
            if (!vm.dragList.find(groupId => groupId.value === item.value)) {
              newArr.push(item);
            }
          }
        }
        vm.dragList = [];
        vm.$nextTick(function() {
          vm.dragList = newArr;
          // console.log(vm.dragList);
        });
        this.selectedUsers = [];
        // console.log(this.groupData["GroupUsers"]); // 确认选中的
      }
    },
    removeBtn(a) {
      let vm = this;
      // console.log(a);
      // console.log(vm.dragList);
      let nwoIndex = "";
      // 根据当前id来查询当前的要删除元素的序号
      for (let [key, item] of vm.dragList.entries()) {
        // console.log(key);
        // console.log(item);
        if (item.value == a) {
          nwoIndex = key;
          break;
        }
      }
      // console.log(nwoIndex);
      vm.dragList.splice(nwoIndex, 1);
      var newArray = vm.dragList.slice(0);
      vm.dragList = [];
      vm.$nextTick(function() {
        vm.dragList = newArray;
        // console.log(vm.dragList);
      });
    },
    handleSizeChange(val) {
      this.sizePage = val;
      this.init();
    },
    handleCurrentChange(val) {
      this.curnPage = val;
      this.init();
    },
    init() {
      let vm = this;
      vm.loading = true;
      // console.log(vm.Keyword)
      this.axios
        .get("/apiweb/guests/ReadGroup", {
          params: {
            Keyword: vm.keyWord, //关键字
            currentpage: vm.curnPage, //分页
            pagesize: vm.sizePage //分页
          }
        })
        .then(res => {
          // console.log(res.data);
          vm.tableData.data = res.data.data;
          vm.tableData.total = res.data.total;
          vm.loading = false;
        })
        .catch(function(err) {
          console.log(err);
          vm.loading = false;
        });
    },
    PlistInit() {
      let vm = this;
      // 初始化表单父级下拉列表
      this.axios
        .get("/apiweb/guests/GuestsParentList", {
          params: {}
        })
        .then(res => {
          // console.log(res.data);
          vm.parentList = res.data;
        })
        .catch(function(err) {
          console.log(err);
        });
      // 初始化表单组员下拉
      this.axios
        .get("/apiweb/guests/ReadGroupUser", {
          params: {
            // ComId: vm.ComId, //公司id，字符串类型
            // DepartStatus: "1" //状态（默认传1，该字段是为了与其他地方的数据区分）
          }
        })
        .then(res => {
          // console.log(res.data);
          vm.userList = res.data;
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    parentClose(a) {
      // 联级关闭事件
      // console.log(a);
      let vm = this;
      if (
        vm.modalTitle == "编辑用户组" &&
        vm.groupData.Parent.find(n => n == vm.checkedList)
      ) {
        // console.log(vm.groupData.Parent);
        vm.errorParent = "不能选择当前组自己和它下面的子级组！";
        vm.groupData.Parent = [];
        return;
      }
      if (!a) {
        this.errorParent = "";
      }
    }
  },
  mounted() {
    let vm = this;
    this.tableHeight = window.innerHeight - 307;
    this.init();
    this.PlistInit(); // 初始化父级联级数据
    let doList = document.getElementById("doList");
    // console.log(doList);
    Sortable.create(doList, {
      group: {
        name: "list",
        pull: true
      }, // 分组的名字，同样的name可以互相拖动到对应列表排序
      filter: ".iview-admin-draggable-delete",
      animation: 120, //动画时间
      ghostClass: "placeholder-style", // 被拖动元素离开原来位置时原来位置的样式
      fallbackClass: "iview-admin-cloned-item",
      onEnd: function(evt) {
        // console.log(evt);
        //拖拽结束发生该事件
        vm.dragList.splice(
          evt.newIndex,
          0,
          vm.dragList.splice(evt.oldIndex, 1)[0]
        );
        var newArray = vm.dragList.slice(0);
        vm.dragList = [];
        vm.$nextTick(function() {
          vm.dragList = newArray;
          // console.log(vm.dragList);
        });
      }
    });
  }
};
</script>
