<template>
  <div>
    <Card>
      <!-- 顶部标题 -->
      <p slot="title">
          <Icon type="android-people"></Icon>
          组织架构
      </p>
      <!-- 操作树形菜单 -->
      <div class="hadle-box" style="text-align: left;">
        横竖切换：<Switch v-model="horizontal"></Switch>&nbsp;&nbsp;&nbsp;&nbsp;
        折叠切换：<Switch v-model="collapsable"></Switch>&nbsp;&nbsp;&nbsp;&nbsp;
        标签主题切换：<Select v-model="labelClassName" style="width:200px">
          <Option v-for="item in colorList" :value="item.value" :key="item.value">{{ item.text }}</Option>
        </Select>
        <div class="button-group">
          <Button type="primary" @click="openModal(1)" icon="plus-round">新增</Button>
        </div>
      </div>
        <!-- 树形主体结构 -->
       <Row>
        <Col span="24">
          <org-tree
            :data="treeData"
            :horizontal="horizontal"
            :collapsable="collapsable"
            :label-class-name="labelClassName"
            :render-content="renderContent"
            @on-expand="onExpand"
            @on-node-click="onNodeClick"
            @on-node-delete="onNodeDelete"
          >
          </org-tree>
        </Col>          
      </Row>
    </Card>
    <!-- 弹出框 -->
    <Modal v-model="treeModal" :title="modalTitle">
         <Form ref="memberForm" :model="memberDate" :rules="ruleMember" :label-width="100">
           <FormItem label="组织名称：" prop="name" placeholder="请填写名称" :error="errorName">
             <Input v-model="memberDate.name"></Input>
           </FormItem>
           <FormItem label="描述：" prop="desc">
             <Input v-model="memberDate.desc" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请填写组织描述"></Input>
           </FormItem>
           <FormItem class="select-parent" label="所属父级：" prop="parent" :error="errorParent">
             <Cascader :data="parentList" :change-on-select="true" @on-visible-change="parentClose" v-model="memberDate.parent" placeholder="请选父级"></Cascader>
             <p>选择完成后点击空白处，即可关闭当前选择列表</p>
           </FormItem>
           <FormItem label="是否生效：" prop="effect">
             <i-switch v-model="memberDate.effect" size="large">
                <span slot="open">生效</span>
                <span slot="close">禁用</span>
             </i-switch>
           </FormItem>
         </Form>
         <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" @click="ok" :loading="saveLoading">保存</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import OrgTree from "@/views/my-components/org-tree";
import Cookies from "js-cookie";
export default {
  name: "organization",
  components: {
    OrgTree
  },
  data() {
    return {
      treeModal: false, //弹窗
      modalTitle: "新增组织",
      treeData: {},
      horizontal: false,
      collapsable: false,
      errorName: "", // 名称重复保错信息
      errorParent: "", // 父级报错信息
      labelClassName: "bg-white",
      saveLoading: false,
      colorList: [
        {
          text: "白色",
          value: "bg-white"
        },
        {
          text: "橙色",
          value: "bg-orange"
        },
        {
          text: "金色",
          value: "bg-gold"
        },
        {
          text: "灰色",
          value: "bg-gray"
        },
        {
          text: "浅粉色",
          value: "bg-lightpink"
        },
        {
          text: "巧克力色",
          value: "bg-chocolate"
        },
        {
          text: "番茄色",
          value: "bg-tomato"
        }
      ], // 标签主题
      memberDate: {
        name: "", // 组织名称
        desc: "", // 组织描述
        parent: [], // 从属父级
        effect: true // 是否生效
      }, // 弹出框表单
      ruleMember: {
        name: [
          {
            required: true,
            message: "请输入组织名称",
            trigger: "blur"
          }
        ],
        parent: [
          {
            required: true,
            type: "array",
            message: "请选择所属父级",
            trigger: "change"
          }
        ]
      }, // 表单验证规则
      parentList: [], // 表单下拉列表
      selectedId: "", // 当前选中的id
      ComId: Cookies.get("yh_web_ComId"), // 公司id,后期通过store获取
      userId: Cookies.get("yh_web_UserId") // 当前用户Id
    };
  },
  methods: {
    renderContent(h, data) {
      return data.label;
    },
    onExpand(data) {
      if ("expand" in data) {
        data.expand = !data.expand;

        if (!data.expand && data.children) {
          this.collapse(data.children);
        }
      } else {
        this.$set(data, "expand", true);
      }
    },
    parentClose(a) {
      console.log(a);
      if (!a && this.memberDate.parent.length != 0) {
        this.errorParent = "";
      }
    },
    onNodeClick(e, data) {
      // 点击单个标签弹出编辑
      // console.log(data.id)
      // 将当前选中的id存储到暂存变量中
      this.selectedId = data.id;
      // 打开弹窗
      this.openModal(2);
    },
    onNodeDelete(e, data) {
      // 删除回调
      // console.log(e)
      // console.log(data)
      // 将当前选中的id存储到暂存变量中
      this.selectedId = data.id;
      // 调用删除接口
      this.delMember();
    },
    setMember() {
      let vm = this;
      //根据id向后台请求数据，并填充到表单中
      // 初始化显示的报错信息
      this.errorName = "";
      this.errorParent = "";
      // 请求单条信息填充；
      this.axios
        .get("/apiweb/depart/GetDepartDetail", {
          params: {
            ComId: vm.ComId, //公司id
            DepartId: vm.selectedId //部门id
          }
        })
        .then(res => {
          // console.log(res.data);
          let reslut = res.data;
          let DepartPIDs = [];
          reslut.forEach((item, index) => {
            if (index == reslut.length - 1) {
              return false;
            }
            DepartPIDs.push(item.DepartId);
          });
          let pdata = reslut[reslut.length - 1];
          // console.log(DepartPIDs);
          vm.memberDate = {
            name: pdata.ComName,
            desc: pdata.DepartDes,
            parent: DepartPIDs, // 第二项需要处理
            effect: pdata.DepartStatus == "1" ? true : false
          };
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    delMember() {
      let vm = this;
      // 先弹出警告框
      this.$confirm("此操作将删除该组织, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 弹出警告框确定处理
          // 先关闭第一层的弹出窗口
          this.treeModal = false;
          // 获取到当前id发送给后台处理
          this.axios
            .get("/apiweb/depart/DepartDel", {
              params: {
                ComId: vm.ComId, //公司id，字符串类型
                DepartId: vm.selectedId //部门id
              }
            })
            .then(res => {
              // console.log(res.data);
              // 判断是否返回成功，刷新组织架构数据并提示成功
              if (res.data.ok) {
                vm.treeInit();
                vm.$message({
                  type: "success",
                  message: "删除成功!"
                });
                vm.treeInit();
              } else {
                this.$message.error(res.data.msg);
                vm.treeInit();
              }
            })
            .catch(function(err) {
              console.log(err);
            });
        })
        .catch(() => {
          // 弹出警告框取消处理，暂时不做操作
        });
    },
    collapse(list) {
      // 折叠切换处理
      list.forEach(child => {
        if (child.expand) {
          child.expand = false;
        }

        child.children && this.collapse(child.children);
      });
    },
    treeInit() {
      let vm = this;
      // 初始化加载组织结构树数据
      this.axios
        .get("/apiweb/depart/GetOrganizationList", {
          params: {
            ComId: vm.ComId
          }
        })
        .then(res => {
          // console.log(res.data);
          vm.treeData = res.data[0];
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    PlistInit() {
      let vm = this;
      // 初始化表单下拉列表
      this.axios
        .get("/apiweb/depart/GetdepartList", {
          params: {
            ComId: vm.ComId, //公司id，字符串类型
            DepartStatus: "1" //状态（默认传1，该字段是为了与其他地方的数据区分）
          }
        })
        .then(res => {
          // console.log(res.data);
          vm.parentList = res.data;
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    openModal(a) {
      // 重置表单
      this.$refs["memberForm"].resetFields();
      // 新增组织，先清空表单数据
      this.memberDate = {
        name: "", // 组织名称
        desc: "", // 组织描述
        parent: [], // 从属父级
        effect: true // 是否生效
      };
      this.errorName = "";
      this.errorParent = "";
      if (a == 1) {
        this.modalTitle = "新增组织";
      } else if (a == 2) {
        this.modalTitle = "编辑组织";
        this.setMember();
      }
      this.treeModal = true;
    },
    cancel() {
      // modal对话框点击取消
      this.treeModal = false;
    },
    ok() {
      let vm = this;
      // 先验证用户填写的信息,再验证重复
      this.$refs.memberForm.validate(valid => {
        if (valid) {
          // console.log(this.memberDate); // 在此处理成后台要求的数据
          vm.saveLoading = true;
          if (vm.modalTitle == "新增组织") {
            vm.axios
              .get("/apiweb/depart/CheckDepartName", {
                params: {
                  ComId: vm.ComId, //公司id
                  DepartName: vm.memberDate.name //部门名称
                }
              })
              .then(res => {
                // console.log(res.data);
                // 判断是否验证通过，如果通过就继续调取保存
                if (res.data.ok == "true") {
                  vm.saveForm();
                } else {
                  vm.errorName = res.data.msg;
                }
              })
              .catch(function(err) {
                console.log(err);
              });
          } else {
            // 编辑不用验证重复
            vm.saveForm();
          }
        } else {
          // 表单规则验证不通过，表单内有红字提示，故不做处理
        }
      });
    },
    saveForm() {
      let vm = this;
      // console.log(this.memberDate);
      // console.log(this.memberDate.parent.length);
      let DepartPID = "";
      if (this.memberDate.parent.length == 1) {
        DepartPID = "-1";
      } else {
        DepartPID = this.memberDate.parent[this.memberDate.parent.length - 1];
      }
      if (DepartPID == this.selectedId) {
        this.errorParent = "所属父级不能选择当前组织本身";
        return;
      }
      // DepartPID = DepartPID.replace(/[^\d]/g, ""); // 将id中的数字提取出来
      let meData = {};
      // 判断是新增还是编辑，更改action
      let getUrl = "/apiweb/depart/";
      if (this.modalTitle == "新增组织") {
        getUrl = getUrl + "DepartAdd";
        meData = {
          ComId: this.ComId, //公司id，字符串类型
          DepartName: this.memberDate.name, //名称，字符串类型
          DepartPID: DepartPID, //所属父级，字符串类型
          DepartDes: this.memberDate.desc, //描述，字符串类型
          DepartStatus: this.memberDate.effect ? 1 : 0, //状态，字符串类型 1生效0禁用
          CreatId: vm.userId //创建人，字符串类型
        };
      } else if (this.modalTitle == "编辑组织") {
        getUrl = getUrl + "DepartUpdate";
        meData = {
          ComId: this.ComId, //公司id
          DepartName: this.memberDate.name, //部门名称
          DepartPID: DepartPID, //所属父级id
          DepartDes:
            this.memberDate.desc == null || this.memberDate.desc == ""
              ? "无"
              : this.memberDate.desc, //部门描述
          DepartStatus: this.memberDate.effect ? 1 : 0, //状态
          OperID: vm.userId, //操作人
          DepartID: vm.selectedId //部门id
        };
      }
      // console.log(meData);
      // console.log(getUrl);
      // 规则验证通过，发送ajax请求给后台
      this.axios
        .get(getUrl, {
          params: meData
        })
        .then(res => {
          // console.log(res.data);
          if (res.data.ok) {
            vm.$message({
              type: "success",
              message: "保存成功!"
            });
            // 刷新组织结构树
            vm.treeInit();
            // 关闭按钮loading
            vm.saveLoading = false;
            // 关闭弹出窗口
            vm.treeModal = false;
          } else {
            this.$message.error(res.data.msg);
            // 关闭按钮loading
            vm.saveLoading = false;
          }
        })
        .catch(function(err) {
          console.log(err);
          vm.$message.error("保存失败！");
          // 关闭按钮loading
          vm.saveLoading = false;
          // 关闭弹出窗口
          vm.treeModal = false;
        });
    }
  },
  mounted() {
    this.treeInit();
    this.PlistInit();
  }
};
</script>

<style>
.bg-white {
  background-color: white;
}
.bg-orange {
  background-color: orange;
}
.bg-gold {
  background-color: gold;
}
.bg-gray {
  background-color: gray;
  color: #fff;
}
.bg-lightpink {
  background-color: lightpink;
}
.bg-chocolate {
  background-color: chocolate;
  color: #fff;
}
.bg-tomato {
  background-color: tomato;
}
.hadle-box {
  margin-bottom: 18px;
}
.hadle-box .button-group {
  float: right;
}
.is-use {
  background-color: #ccc !important;
}
</style>
