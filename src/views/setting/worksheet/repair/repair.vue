<style lang="less">
@import './repair.less';
.ivu-modal-content {
  height: 100%;
  border-radius: 0;
  .ivu-modal-body {
    height: calc(~'100% - 100px');
    .ivu-radio-group {
      width: 100%;
    }
  }
}
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
</style>
<style lang="less" scoped>
.ivu-menu {
  position: relative;
  .ivu-menu-item {
    font-size: 13px;
    position: relative;
    &:hover .icon-xiugai,
    &:hover .icon-shanchu {
      display: block;
    }
    .item-label {
      line-height: 20px;
      height: 20px;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .icon-xiugai {
      color: #2db7f5;
      position: absolute;
      top: 24px;
      right: 30px;
      display: none;
    }
    .icon-shanchu {
      color: #f16543;
      position: absolute;
      top: 24px;
      right: 4px;
      display: none;
    }
  }
  .icon-tianjia {
    position: absolute;
    color: #666;
  }
}
</style>


<template>
    <div>
        <Card>
            <div style="display:flex;margin-top:10px;">
                <div>
                    <div style="padding:0 10px;">
                        <Select v-model="ClassCode" @on-change="getGroup" clearable filterable placeholder="请先选择代维公司" label-in-value>
                            <Option v-for="option in classOption" :key="option.value" :value="option.value">{{option.label}}</Option>
                        </Select>
                    </div>
                    <Menu ref="leftMenu" theme="light" width="300px" :active-name="GroupCode" @on-select="GroupChange">
                        <div style="padding:20px 0 5px 20px; font-size:14px; color:rgb(128, 128, 128)">
                            <span>装维班组</span>
                            <Tooltip content="添加班组" placement="top" style="position: absolute; right:34px; top: 5px;" v-show="ClassCode">
                                <i class="iconfont icon-tianjia" @click="formModal=true"></i>
                            </Tooltip>
                        </div>
                        <MenuGroup :style="{'max-height':tableHeight+35+'px', 'overflow-y':'auto'}">
                            <MenuItem v-for="option in groups" :name="option.value" :key="option.value" @mouseover.native="over(option.value)">
                            <span>{{option.label}}</span>
                            <Icon type="compose" :size="24" style="position:absolute; right:5px; top:10px;" @click="groupEdit(option)" v-show="hoverCode===option.value"></Icon>
                            </MenuItem>
                        </MenuGroup>
                    </Menu>
                </div>
                <div style="flex:1;border-left:1px solid #eee;padding-left:20px;">
                    <div class="hadle-box" style="margin-top:0;">
                        <div class="search-box">
                            <Input placeholder="请输入查询内容" icon="ios-search" v-model="keyWord" style="width: 240px;margin-right:12px;" @on-enter="getData">
                            </Input>
                            <!-- <Button type="primary" @click="getrepairData">
                <Icon type="ios-search"></Icon> 搜索
              </Button> -->
                        </div>
                        <div class="btn-box">
                            <Button type="success" icon="ios-upload-outline" @click="showUpload=true">导入</Button>
                            <Button type="success" icon="plus" @click="workerModal=true" :disabled="!GroupCode">新增</Button>
                            <!-- <Button type="info" icon="compose" @click="">编辑</Button>&nbsp;&nbsp;&nbsp; -->
                            <!-- <Button type="error" icon="trash-b" @click="">删除</Button> -->
                        </div>
                    </div>
                    <Table stripe :show-overflow-tooltip="true" :columns="columns" :loading="loading" :data="tableData.data" :height="tableHeight" style="margin-bottom:30px;"></Table>
                    <div style="text-align:right;padding-right:14px;">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="curnPage" background :page-sizes="[30, 50]" :page-size="sizePage" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
                        </el-pagination>
                    </div>
                </div>
            </div>

        </Card>
        <Modal title="装维班组" v-model="formModal" @on-visible-change="modalChange" @on-ok="submit">
            <Form ref="groupForm" :model="groupForm" :rules="groupRule">
                <FormItem label="班组编号" prop="Code">
                    <Input v-model="groupForm.Code" :disabled="isEdit" />
                </FormItem>
                <FormItem label="班组名称" prop="Name">
                    <Input v-model="groupForm.Name" />
                </FormItem>
                <FormItem label="归属公司">
                    <Input disabled v-model="groupForm.ClassName" />
                </FormItem>
            </Form>
            <div slot="footer">
                <el-button v-if="isEdit" type="text" style="float:left; color:red" size="small" @click="deleteGroup">移除该班组</el-button><Button @click="formModal=false">取消</Button><Button @click="submit" :loading="tableLoading" type="primary">确定</Button>
            </div>
        </Modal>
        <Modal title="装维经理" v-model="workerModal" @on-visible-change="modalChange" @on-ok="workerSubmit">
            <Form ref="workerForm" :model="workerForm" :rules="workerRule">
                <FormItem label="姓名" prop="name">
                    <Input v-model="workerForm.name" />
                </FormItem>
                <FormItem label="电话" prop="phone">
                    <Input v-model="workerForm.phone" :disabled='phoneDisabled' />
                </FormItem>
            </Form>
            <div slot="footer">
                <el-button v-if="isEdit" type="text" style="float:left; color:red" size="small" @click="deleteWorker">移除该用户</el-button><Button @click="workerModal=false">取消</Button><Button @click="workerSubmit" :loading="tableLoading" type="primary">确定</Button>
            </div>
        </Modal>
        <Modal v-model="showUpload" title="导入数据">
            <Alert>
                <ul>
                    <li>
                        此操作可能需要5-10分钟，期间请勿关闭网页
                    </li>
                    <li>
                        仅支持xls、xlsx格式文件
                    </li>
                    <li>
                        导入数据需与模板对应，请<a href="/static/json/装维经理.xls">点击此处</a>下载
                    </li>
                </ul>
            </Alert>
            <el-upload action="/apiweb/worker/import" :show-file-list="false" drag :http-request="upload" v-loading.fullscreen="loading" :element-loading-text="'正在处理，可能需要5~10分钟，已耗时'+loading_time">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
            <div slot="footer">
                <Button @click="showUpload=false">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
export default {
  name: 'repair',
  data() {
    return {
      phoneDisabled: false,
      showUpload: false,
      tableLoading: false,
      loading_text: 0,
      isEdit: false,
      hoverCode: '',
      ClassCode: '',
      GroupCode: '',
      keyWord: '',
      loading: false,
      formModal: false,
      workerModal: false,
      groupForm: {
        ClassName: '',
        ClassCode: '',
        Name: '',
        Code: ''
      },
      workerForm: {
        Id: null,
        phone: '',
        name: '',
        GroupCode: '',
        GroupName: ''
      },
      workerRule: {
        name: [{ required: true, message: '请填写姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请填写电话', trigger: 'blur' }]
      },
      groupRule: {
        Name: [{ required: true, message: '请填写班组名称', trigger: 'blur' }],
        Code: [{ required: true, message: '请填写班组编码', trigger: 'blur' }]
      },
      classOption: [],
      columns: [
        {
          title: '班组编码',
          key: 'GroupId',
          minWidth: 100
        },
        {
          title: '班组名称',
          key: 'GroupName',
          minWidth: 150
        },
        {
          title: '所属公司',
          key: 'ClassName',
          minWidth: 150
        },
        {
          title: '姓名',
          key: 'name',
          minWidth: 80
        },
        {
          title: '电话',
          key: 'phone',
          minWidth: 100
        },
        {
          title: '操作',
          width: 80,
          fixed: 'right',
          align: 'center',
          key: 'Operation',
          render: (h, params) => {
            const _this = this
            return h('i', {
              class: {
                iconfont: true,
                'icon-beizhu': true
              },
              style: {
                color: '#666',
                cursor: 'pointer'
              },
              attrs: {
                title: '编辑'
              },
              on: {
                click: () => {
                  _this.workerEdit(params.row)
                }
              }
            })
          }
        }
      ],
      tableData: {
        data: [],
        total: 0
      },
      curnPage: 1,
      sizePage: 30,
      tableHeight: 500,
      groups: []
    }
  },
  watch: {},
  methods: {
    submit() {
      this.tableLoading = true
      this.$refs.groupForm
        .validate()
        .then(result => {
          if (result) {
            if (this.isEdit) {
              this.axios
                .put(
                  '/apiweb/class/group/' + this.groupForm.Code + '/',
                  this.groupForm
                )
                .then(res => {
                  this.formModal = false
                  this.tableLoading = false
                  this.$message.success(res.data.msg)
                  this.getGroup()
                })
                .catch(err => {
                  console.log(err)
                  this.tableLoading = false
                  if (err.response.data.msg) {
                    this.$message.error(err.response.data.msg)
                  } else {
                    this.$message.error('发生错误')
                  }
                })
            } else {
              this.axios
                .post('/apiweb/class/group/', this.groupForm)
                .then(res => {
                  this.formModal = false
                  this.tableLoading = false
                  this.$message.success(res.data.msg)
                  this.getGroup()
                })
                .catch(err => {
                  this.tableLoading = false
                  if (err.response.data.msg) {
                    this.$message.error(err.response.data.msg)
                  } else {
                    this.$message.error('发生错误')
                  }
                })
            }
          } else {
            this.tableLoading = false
          }
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    workerSubmit() {
      this.tableLoading = true
      this.$refs.workerForm
        .validate()
        .then(result => {
          if (result) {
            if (this.isEdit) {
              this.axios
                .put(
                  '/apiweb/worker/' + this.workerForm.Id + '/',
                  this.workerForm
                )
                .then(res => {
                  this.workerModal = false
                  this.tableLoading = false
                  this.$message.success(res.data.msg)
                  this.getData()
                })
                .catch(err => {
                  console.log(err)
                  this.tableLoading = false
                  if (err.response.data.msg) {
                    this.$message.error(err.response.data.msg)
                  } else {
                    this.$message.error('发生错误')
                  }
                })
            } else {
              this.workerForm.GroupCode = this.GroupCode
              this.axios
                .post('/apiweb/worker/', this.workerForm)
                .then(res => {
                  this.workerModal = false
                  this.tableLoading = false
                  this.$message.success(res.data.msg)
                  this.getData()
                })
                .catch(err => {
                  this.tableLoading = false
                  if (err.response.data.msg) {
                    this.$message.error(err.response.data.msg)
                  } else {
                    this.$message.error('发生错误')
                  }
                })
            }
          } else {
            this.tableLoading = false
          }
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    setClassCombo() {
      // 归属区域下拉
      this.axios
        .get('/apiweb/class/combox/concat/', {})
        .then(res => {
          this.classOption = res.data
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getGroup(Class) {
      if (Class) {
        this.groupForm.ClassName = Class.label
        this.groupForm.ClassCode = Class.value
      }
      this.axios
        .get('/apiweb/class/group/combox/concat/', {
          params: { Code: this.groupForm.ClassCode }
        })
        .then(res => {
          this.groups = res.data
          if (this.groups.length > 0) {
            this.$nextTick(() => {
              this.GroupCode = this.groups[0].value
              this.getData()
            })
          }
        })
        .catch(err => {
          this.groups = []
          if (err.response.data.msg) {
            this.$message.error(err.response.data.msg)
          } else {
            this.$message.error('发生错误')
          }
        })
    },
    handleSizeChange(val) {
      this.sizePage = val
      this.getregionData()
    },
    handleCurrentChange(val) {
      this.getregionData()
    },
    over(val) {
      this.hoverCode = val
    },
    modalChange(status) {
      if (status === false) {
        this.$refs.workerForm.resetFields()
        this.$refs.groupForm.resetFields()
        this.isEdit = false
        this.phoneDisabled = false
      }
    },
    workerEdit(worker) {
      console.log(worker)
      this.workerForm.name = worker.name
      this.workerForm.phone = worker.phone
      this.workerForm.Id = worker.Id
      this.workerForm.GroupCode = worker.GroupId
      this.workerModal = true
      this.isEdit = true
      this.phoneDisabled = true
    },
    groupEdit(group) {
      console.log(group)
      this.groupForm.Code = group.value
      this.groupForm.Name = group.label.substr(group.label.indexOf('-') + 1)
      this.formModal = true
      this.isEdit = true
    },
    upload(con) {
      const _this = this
      _this.loading = true
      var _time = setInterval(() => {
        _this.loading_text += 1
      }, 1000)
      let formdata = new FormData()
      formdata.append('file', con.file)
      this.showUpload = false
      this.axios({
        url: con.action,
        method: 'post',
        data: formdata,
        timeout: 0
      })
        .then(result => {
          _this.loading = false
          this.$message.success(result.data.msg)
          clearInterval(_time)
          _this.loading_text = 0
          this.getData()
        })
        .catch(err => {
          _this.loading = false
          clearInterval(_time)
          _this.loading_text = 0
          console.log(err)
          if (err.response.data.msg) {
            this.$message.error(err.response.data.msg)
          } else if (err.response.status) {
            this.$message.error('服务器发生错误')
          } else {
            this.$message.error('处理超时')
          }
        })
    },
    GroupChange(Code) {
      this.workerForm.GroupCode = Code
      this.GroupCode = Code
      this.getData()
    },

    getData() {
      this.tableLoading = true
      this.axios
        .get('/apiweb/worker/', {
          params: {
            index: this.curnPage,
            limit: this.sizePage,
            GroupId: this.GroupCode || null,
            keyWord: this.keyWord
          }
        })
        .then(res => {
          console.log(res.data)
          this.tableData.data = res.data.data
          this.tableData.total = res.data.total
          this.tableLoading = false
        })
        .catch(err => {
          try {
            this.$message.error(err.response.data.msg)
          } catch (err) {
            this.$message.error('发生错误')
          }
          console.log(err)
          this.tableLoading = false
        })
    },
    deleteGroup() {
      this.$confirm('确定删除该班组？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .delete('/apiweb/class/group/' + this.groupForm.Code + '/')
            .then(res => {
              this.formModal = false
              this.getGroup()
              this.getData()
              this.$message.success(res.data.msg)
            })
            .catch(err => {
              try {
                this.$message.error(err.response.data.msg)
              } catch (err) {
                this.$message.error('发生错误')
              }
            })
        })
        .catch(() => {})
    },
    deleteWorker() {
      this.$confirm('确定删除该用户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .delete('/apiweb/worker/' + this.workerForm.Id + '/', {
              data: {
                groupId: this.workerForm.GroupCode
              }
            })
            .then(res => {
              this.workerModal = false
              this.getData()
              this.$message.success(res.data.msg)
            })
            .catch(err => {
              try {
                this.$message.error(err.response.data.msg)
              } catch (err) {
                this.$message.error('发生错误')
              }
            })
        })
        .catch(() => {})
    }
  },
  created() {
    this.setClassCombo()
    this.getData()
  },
  mounted() {
    const _this = this
    this.tableHeight = window.innerHeight - 280
    // 浏览器窗口发生改变
    window.onresize = function() {
      _this.tableHeight = window.innerHeight - 280
    }
  },
  computed: {
    loading_time() {
      const min = parseInt(this.loading_text / 60)
      const sec = this.loading_text % 60
      function pro0(val) {
        if (val < 10) {
          return '0' + val
        } else {
          return val
        }
      }
      return pro0(min) + ':' + pro0(sec)
    }
  }
}
</script>
<style lang="less" scoped>
.ivu-input-group {
  top: 0;
}
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
</style>
<style>
.ivu-menu-light {
  z-index: 1;
}
.ivu-menu-vertical .ivu-menu-item-group-title {
  height: 0;
}
</style>
<style>
.el-upload {
  width: 100%;
}
.el-upload .el-upload-dragger {
  width: 100%;
}
</style>



