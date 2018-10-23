<style lang="less">
@import "./servicedir.less";
</style>

<template>
    <div>
         <Card>
            <!-- 顶部标题 -->
            <p slot="title">
                <Icon type="ios-pricetags"></Icon>
                标签设置
            </p>
            <div class="label-box">
              <div class="hadle-box">
                <!-- <el-input placeholder="添加新的标签" v-model="newLabel" class="input-with-select" @keyup.enter="init">
                  <el-button slot="append" icon="el-icon-plus">新增</el-button>
                </el-input> -->
                <Button type="success" @click="openModal(1)" icon="ios-bookmarks">服务目录</Button>
              </div>
              <Row :style="{height: boxHeight}">
                <Col span="24">
                  <Collapse value="1">
                    <Panel name="1">
                      客户
                      <div slot="content">
                        <div class="label-list">
                          <Tooltip v-for="(info,list) in custlList" :key="list+20" placement="bottom">
                            <div slot="content">
                              <p style="margin-bottom: 10px;"><Button type="info" @click="openModal(2,info)" size="small" style="background-color: #57c5f7;border: 1px solid #57c5f7;">编辑</Button>&nbsp;&nbsp;
                              <Button type="error"  size="small" @click="delLabel(info)">删除</Button></p>
                              <p>当前状态：{{info.UserId == 1 ? '公用' : '非公用'}}</p>
                            </div>
                            <div class="label-item" :style="{backgroundColor: info.RGB || 'rgba(68, 85, 102, 0.4)'}">
                              <span class="label_msg" :style="{color: info.TagFontRGB || '#666'}">{{info.text}}</span>
                              <span class="triangle" :style="{borderLeftColor: info.RGB || 'rgba(68, 85, 102, 0.4)'}"></span>
                            </div>
                            <div v-if="custlList.length == 0">暂无标签</div>
                          </Tooltip>
                        </div>
                      </div>
                    </Panel>
                    <Panel name="2">
                      工单
                      <div slot="content">
                        <div class="label-list">
                          <Tooltip v-for="(item,index) in orderlList" :key="index+12" placement="bottom">
                            <div slot="content">
                              <p style="margin-bottom: 10px;"><Button type="info" @click="openModal(2,item)" size="small" style="background-color: #57c5f7;border: 1px solid #57c5f7;">编辑</Button>&nbsp;&nbsp;
                              <Button type="error"  size="small" @click="delLabel(item)">删除</Button></p>
                              <p>当前状态：{{item.UserId == 1 ? '公用' : '非公用'}}</p>
                            </div>
                            <div class="label-item" :style="{backgroundColor: item.RGB || 'rgba(68, 85, 102, 0.4)'}">
                              <span class="label_msg" :style="{color: item.TagFontRGB || '#666'}">{{item.text}}</span>
                              <span class="triangle" :style="{borderLeftColor: item.RGB || 'rgba(68, 85, 102, 0.4)'}"></span>
                            </div>
                            <div v-if="orderlList.length == 0">暂无标签</div>
                          </Tooltip>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>
                </Col>
              </Row>
            </div>
         </Card>
         <!-- 弹出层/新增标签 -->
         <Modal v-model="labelModal" :width="500">
            <h3 slot="header" style="color:#2D8CF0">{{modalTitle}}</h3>
            <Form ref="labelForm" :model="labelFormData" :label-width="100" label-position="right" :rules="labelValidate">
              <FormItem label="标签名称：" prop="TagName">
                  <Input v-model="labelFormData.TagName" placeholder="请填写标签名称" ></Input>
              </FormItem>
              <FormItem label="标签颜色：" prop="TagRGB" :error="labelRgbError">
                <el-color-picker v-model="labelFormData.TagRGB" @change="selectColor" show-alpha :predefine="colors"></el-color-picker>
              </FormItem>
              <FormItem label="字体颜色：" prop="TagFontRGB" :error="fontRgbError">
                <el-color-picker v-model="labelFormData.TagFontRGB" @change="selecFontColor" show-alpha :predefine="colors"></el-color-picker>
              </FormItem>
              <FormItem label="标签描述：" prop="TagDetail">
                <Input v-model="labelFormData.TagDetail" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入标签描述"></Input>
              </FormItem>
              <FormItem label="标签状态：" prop="TagStatus">
                <i-switch size="large" v-model="labelFormData.TagStatus">
                  <span slot="open">启用</span>
                  <span slot="close">禁用</span>
                </i-switch>
              </FormItem>
              <!-- <FormItem label="所属父级：" prop="TagDetail">
                <Select v-model="labelFormData.TagPID" placeholder="请选择标签父级">
                  <Option v-for="(item, index) in labelparents" :key="item.value+''" :value="item.value+''">{{item.label}}</Option>
                </Select>
              </FormItem> -->
              <FormItem label="标签类型：" prop="TagType">
                <Select v-model="labelFormData.TagType" placeholder="请选择标签类型">
                  <Option value="1">客户</Option>
                  <Option value="2">工单</Option>
                </Select>
              </FormItem>
              <FormItem label="是否公用：" prop="isPub">
                <i-switch size="large" v-model="labelFormData.isPub">
                  <span slot="open">是</span>
                  <span slot="close">否</span>
                </i-switch>
              </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelModal">取消</Button>
                <Button type="primary" :loading="savePassLoading" @click="btnOk">保存</Button>
            </div>
         </Modal>
    </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
  name: "servicedir",
  data() {
    return {
      newLabel: "", // 新增标签
      boxHeight: "500px",
      modalTitle: "新增标签",
      labelModal: false, // 控制弹出层开关
      savePassLoading: false, // 保存按钮loading
      colors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "rgba(255, 69, 0, 0.68)",
        "rgb(255, 120, 0)",
        "hsv(51, 100, 98)",
        "hsva(120, 40, 94, 0.5)",
        "hsl(181, 100%, 37%)",
        "hsla(209, 100%, 56%, 0.73)",
        "#c7158577"
      ], // 颜色选择器预设颜色
      labelFormData: {
        TagName: "", // 标签名称
        TagRGB: "rgba(25, 190,107, .8)", // 标签颜色
        TagFontRGB: "rgba(25, 190,107, .8)", // 标签字体颜色
        TagDetail: "", // 标签描述
        TagStatus: true, // 标签状态 // 默认传1
        TagType: "1", // 标签类型
        TagPID: null, // 标签父级
        isPub: true // 是否公用
      }, // 弹出层表单
      labelValidate: {
        TagName: [
          {
            required: true,
            message: "标签名称不能为空！",
            trigger: "blur"
          }
        ]
      }, // 表单的验证
      labelparents: [], // 标签父级
      labelRgbError: "", // 标签颜色选择报错
      fontRgbError: "", // 标签字体颜色选择报错
      custlList: [], // 客户标签列表
      orderlList: [], // 工单标签列表
      UserId: Cookies.get("yh_web_UserId"), // 用户id
      tagId: "" // 当前选择的id
    };
  },
  methods: {
    getLabelList() {
      /* 获取标签列表 */
      let vm = this;
      vm.axios
        .get("/apiweb/tag/CustTagList", {
          params: {}
        })
        .then(res => {
          // console.log(res.data);
          vm.custlList = [];
          vm.orderlList = [];
          for (let item of res.data) {
            if (item.Type == 1) {
              vm.custlList.push(item);
            } else if (item.Type == 2) {
              vm.orderlList.push(item);
            }
          }
          console.log(vm.custlList);
          console.log(vm.orderlList);
        })
        .catch(res => {
          vm.$message.error("无法获取标签列表！");
        });
    },
    getLabelParents() {
      let vm = this;
      vm.axios
        .get("/apiweb/tag/ParentTagList", {
          params: {}
        })
        .then(res => {
          console.log(res.data);
          this.labelparents = res.data;
        })
        .catch(res => {
          vm.$message.error("操作失败！");
        });
    },
    openModal(...arr) {
      /* 打开弹出层，并处理新增/编辑逻辑*/
      // 先初始化表单数据
      this.$refs["labelForm"].resetFields();
      this.labelFormData = {
        TagName: "", // 标签名称
        TagRGB: "rgba(25, 190,107, .8)", // 标签颜色
        TagFontRGB: "rgba(25, 190,107, .8)", // 标签字体颜色
        TagDetail: "", // 标签描述
        TagStatus: true, // 标签状态 // 默认传1
        TagType: "1", // 标签类型
        TagPID: "", // 标签父级
        isPub: true // 是否公用
      };
      if (arr[0] == 1) {
        this.modalTitle = "新增标签";
        this.labelModal = true;
      } else if (arr[0] == 2) {
        this.modalTitle = "编辑标签";
        let nwoLabel = arr[1];
        this.tagId = nwoLabel.id;
        this.labelFormData = {
          TagName: nwoLabel.text, // 标签名称
          TagRGB: nwoLabel.RGB, // 标签颜色
          TagFontRGB: nwoLabel.TagFontRGB, // 标签字体颜色
          TagDetail: nwoLabel.TagDetail, // 标签描述
          TagStatus: nwoLabel.Status == 1 ? true : false, // 标签状态 // 默认传1
          TagType: nwoLabel.Type + "", // 标签类型
          TagPID: "", // 标签父级
          isPub: nwoLabel.UserId == -1 ? true : false // 是否公用
        };
        this.labelModal = true;
      }
    },
    cancelModal() {
      /*点击取消弹出层*/
      this.labelModal = false;
    },
    delLabel(a) {
      let vm = this;
      this.$confirm("此操作将删除您所选中的标签, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // console.log(JSON.stringify([{ TagID: a.id, TagName: a.text }]));
          vm.axios
            .get("/apiweb/tag/CustTagDel", {
              params: {
                objectData: JSON.stringify([{ TagID: a.id, TagName: a.text }])
              }
            })
            .then(res => {
              // console.log(res.data);
              if (res.data.ok) {
                vm.$message.success(res.data.msg);
                vm.getLabelList();
              } else vm.$message.error(res.data.msg);
            })
            .catch(res => {
              vm.$message.error("操作失败！");
            });
        })
        .catch(() => {});
    },
    btnOk() {
      /*点击确定按钮*/
      let vm = this;
      this.savePassLoading = true;
      this.$refs["labelForm"].validate(valid => {
        if (valid) {
          // 标签颜色
          if (
            vm.labelFormData.TagRGB == "" ||
            vm.labelFormData.TagRGB == null
          ) {
            this.labelRgbError = "颜色不能为空！";
            return;
          }
          // 字体颜色
          if (
            vm.labelFormData.TagFontRGB == "" ||
            vm.labelFormData.TagFontRGB == null
          ) {
            this.fontRgbError = "字体颜色不能为空！";
            return;
          }
          // 验证通过
          let saveUrl = "/apiweb/tag/CustTagAdd";
          let params = {
            TagName: vm.labelFormData.TagName, //标签名称
            TagRGB: vm.labelFormData.TagRGB, //标签颜色
            TagDetail: vm.labelFormData.TagDetail, //标签描述
            TagStatus: vm.labelFormData.TagStatus ? "1" : "0", //标签状态（默认传1）
            TagType: vm.labelFormData.TagType, //标签类型
            TagFontRGB: vm.labelFormData.TagFontRGB, //标签字体颜色
            UserId: vm.labelFormData.isPub ? "-1" : vm.UserId, //是否公用
            TagPID: vm.labelFormData.TagPID //标签父级id
          };
          console.log(params);
          if (vm.modalTitle == "编辑标签") {
            saveUrl = "/apiweb/tag/CustTagUpdate";
            params.TagID = vm.tagId;
          }

          // 发送请求给后台
          vm.axios
            .get(saveUrl, {
              params: params
            })
            .then(res => {
              console.log(res.data);
              if (res.data.ok) {
                vm.$message.success(res.data.msg);
                vm.labelModal = false;
                vm.savePassLoading = false;
                vm.getLabelList();
              } else {
                vm.$message.error(res.data.msg);
                vm.labelModal = false;
                vm.savePassLoading = false;
              }
            })
            .catch(res => {
              vm.$message.error("操作失败！");
              vm.labelModal = false;
              vm.savePassLoading = false;
            });
        } else {
          // this.$Message.error("Fail!");
          // 验证不通过
          vm.savePassLoading = false;
        }
      });
    },
    selectColor(a) {
      // console.log(a);
      if (a) {
        this.labelRgbError = "";
      }
    },
    selecFontColor(a) {
      // console.log(a);
      if (a) {
        this.fontRgbError = "";
      }
    }
  },
  mounted() {
    this.boxHeight = window.innerHeight - 270 + "px";
    // this.getLabelParents(); // 获取标签父级下拉列表
    this.getLabelList(); // 获取标签列表
  }
};
</script>
