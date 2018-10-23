<style lang="less">
@import './region.less';
</style>

<template>
  <div>
    <Card dis-hover>
      <div>
        <div class="hadle-box">
          <div class="search-box">
            <Input placeholder="请输入查询内容" icon="ios-search" v-model="keyWord" style="width: 240px;margin-right:12px;" @on-enter="getregionData">
            </Input>
            <!-- <Button type="primary" @click="getregionData">
              <Icon type="ios-search"></Icon> 搜索
            </Button> -->
          </div>
          <div class="btn-box">
            <Button type="success" icon="plus" @click="openModal(1)">新增</Button>&nbsp;&nbsp;&nbsp;
            <!-- <Button type="info" icon="compose" @click="openModal(2)">编辑</Button>&nbsp;&nbsp;&nbsp; -->
            <Button type="error" icon="trash-b " @click="openModal(3)">删除</Button>&nbsp;&nbsp;&nbsp;
            <Upload ref="upload" :show-upload-list="false" :on-success="uploadSuccess2" :on-error="uploadError" :format="['xlsx','xls']" :max-size="2048" :on-format-error="handleFormatError2" :data="{noValidateType:0}" name='upload' action="//jsonplaceholder.typicode.com/posts/"> 
              <Button type="primary" icon="ios-cloud-upload-outline">导入</Button>    
            </Upload>
          </div>
        </div>
        <Table stripe :show-overflow-tooltip="true" :columns="regionColumns " @on-selection-change="onSelect" :loading="loading" :data="tableData.data " :height="tableHeight" style="margin-bottom:30px;"></Table>
        <div style="text-align: right; padding-right: 14px;">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="curnPage" background :page-sizes="[30, 50]" :page-size="sizePage" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>
        <Modal v-model="regionModal " :width="700 " :styles="{ 'margin-right': '0', 'height': 'calc(100% - 100px)'} " :transfer="false " :transition-names="[ 'move-right', 'fade'] ">
          <h3 slot="header" style="color:#2D8CF0">{{modalTitle}}</h3>
          <Form ref="regionForm" :model="regionForm" :label-width="100" label-position="right" :rules="rulesregionForm">
            <FormItem label="区域名称" prop="AreaName">
              <Input v-model="regionForm.AreaName" placeholder="请填写区域名称"></Input>
            </FormItem>
            <FormItem label="归属区域">
              <Select v-model="regionForm.PId" placeholder="请选择归属区域">
                <Option v-for="item in ascriptionOption" :key="item.value" :value="item.value" :label="item.label">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="序号" prop="Code">
              <Input v-model="regionForm.Code" placeholder="请填写序号"></Input>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" @click="regionModal = false">取消</Button>
            <Button type="primary" :loading="savePassLoading" @click="submit">保存</Button>
          </div>
        </Modal>
      </div>
    </Card>
  </div>
</template><script>
export default {
  data() {
    const _this = this
    const valideSequence = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        callback()
      } else {
        if (!/^\+?[1-9][0-9]*$/.test(value)) {
          callback(new Error('请输入有效的整数'))
        } else {
          callback()
        }
      }
      // this.axios.get('', { params: { value } }).then(res => {
      //   if (!res.data.ok) {
      //     callback(new Error('序号已存在'))
      //   } else {
      //     callback()
      //   }
      // })
    }
    const valideAreaname = (rule, value, callback) => {
      if (_this.badge === 2) {
        return
      }
      this.axios
        .get('/apiweb/exist/areaName/', {
          params: {
            AreaName: this.regionForm.AreaName,
            PId: this.regionForm.PId,
            Id: this.checkedList.length == 0 ? '' : this.checkedList[0].Id
          }
        })
        .then(res => {
          if (!res.data.ok) {
            callback(new Error('区域名称重复'))
          } else {
            callback()
          }
        })
    }
    return {
      badge: '',
      loading: false,
      regionModal: false,
      modalTitle: '',
      savePassLoading: false, // 保存loading
      regionForm: {
        AreaName: '',
        PId: '',
        Code: ''
      },
      ascriptionOption: [],
      rulesregionForm: {
        AreaName: [
          {
            required: true,
            message: '区域名称不能为空',
            trigger: 'blur'
          },
          { validator: valideAreaname }
        ],
        Code: [
          { required: true, message: '请设置排序', trigger: 'blur' },
          { validator: valideSequence }
        ]
      },
      keyWord: '',
      regionColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '区域名称',
          key: 'AreaName'
        },
        {
          title: '归属区域',
          key: 'PName'
        },
        {
          title: '序号',
          key: 'Code'
        },
        {
          title: '时间',
          key: 'CreateTime'
        },
        {
          title: '处理人',
          key: 'CreateName'
        },
        {
          title: '操作',
          width: 80,
          fixed: 'right',
          align: 'center',
          key: 'Operation',
          render: (h, params) => {
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
                  console.log(params.row.Id)
                  _this.modalTitle = '编辑区域'
                  _this.badge = 2
                  _this.regionModal = true
                  _this.setregions(params.row.Id)
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
      checkedList: [],
      curnPage: 1,
      sizePage: 30,
      tableHeight: 500
    }
  },
  watch: {
    keyWord(val) {
      this.curnPage = 1
      this.getregionData()
    }
  },
  methods: {
    uploadSuccess2 (res, file) { 
      //上传成功            
      this.$Message.success(res.data.msg) 
    },
    uploadError(error, file) {
      //上传失败
      this.$Message.error("上传失败")
    },
    handleFormatError2 (file) {
      //文件格式错误
      this.$Message.warning("文件格式不正确,请上传excel格式文件")
    },
    setregionCombo() {
      // 归属区域下拉
      this.axios
        .get('/apiweb/area/combox/cascade/', {})
        .then(res => {
          this.ascriptionOption = res.data
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getregionData() {
      let vm = this
      vm.loading = true
      this.axios
        .get('/apiweb/area/', {
          params: {
            index: vm.curnPage,
            limit: vm.sizePage,
            keyWord: vm.keyWord
          }
        })
        .then(res => {
          this.tableData.data = res.data.data
          this.tableData.total = res.data.count
          vm.loading = false
          vm.setregionCombo()
        })
        .catch(function(err) {
          console.log(err)
          vm.loading = false
        })
    },
    onSelect(s) {
      this.checkedList = s
    },
    handleSizeChange(val) {
      this.sizePage = val
      this.getregionData()
    },
    handleCurrentChange(val) {
      this.getregionData()
    },
    openModal(a) {
      this.$refs['regionForm'].resetFields()
      let vm = this
      if (a == 1) {
        this.modalTitle = '新增区域'
        this.badge = 1
        this.regionModal = true
      } else if (a == 2) {
        if (this.checkedList.length !== 1) {
          this.$message({
            message: '请选择单条数据再进行操作',
            type: 'warning'
          })
          return
        } else {
          this.modalTitle = '编辑区域'
          this.badge = 2
          this.regionModal = true
          this.setregions()
        }
      } else if (a == 3) {
        if (this.checkedList.length === 0) {
          this.$message({
            message: '请至少选择一条数据再进行操作',
            type: 'warning'
          })
          return
        } else {
          this.delregions()
        }
      }
    },
    setregions(Id) {
      let vm = this
      // const Id = vm.checkedList[0].Id
      vm.axios
        .get('/apiweb/area/' + Id + '/', {})
        .then(res => {
          this.regionForm = res.data
          this.regionForm.Code = res.data.Code.toString()
          console.log(this.regionForm)
        })
        .catch(res => {
          vm.$message.error('操作失败！')
          this.regionModal = false
        })
    },
    delregions() {
      const vm = this
      // 调用警告框，如果用户确定执行删除操作
      this.$confirm('此操作将删除您所选中的字段, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const ids = []
          for (var i = 0; i < this.checkedList.length; i++) {
            ids.push(this.checkedList[i].Id)
          }
          vm.axios
            .put('/apiweb/area/', {
              ids
            })
            .then(res => {
              vm.$message.success(res.data.msg)
              vm.getregionData()
              vm.checkedList = []
            })
            .catch(res => {
              vm.$message.error('操作失败！')
            })
        })
        .catch(() => {})
    },
    submit() {
      const vm = this
      this.savePassLoading = true
      this.$refs['regionForm'].validate(valid => {
        if (valid) {
          if (vm.badge === 1) {
            vm.regionForm.PId = vm.regionForm.PId || '-1'
            this.axios
              .post('/apiweb/area/', {
                AreaName: vm.regionForm.AreaName,
                PId: vm.regionForm.PId,
                Code: vm.regionForm.Code
              })
              .then(res => {
                this.$message.success(res.data.msg)
                this.regionModal = false
                this.savePassLoading = false
                this.getregionData()
              })
              .catch(res => {
                this.$message.error('操作失败！')
                this.savePassLoading = false
              })
          } else if (vm.badge === 2) {
            const Id = vm.checkedList[0].Id
            this.axios
              .put('/apiweb/area/' + Id + '/', {
                AreaName: vm.regionForm.AreaName,
                PId: vm.regionForm.PId,
                Code: vm.regionForm.Code
              })
              .then(res => {
                this.$message.success(res.data.msg)
                this.regionModal = false
                this.savePassLoading = false
                this.checkedList = []
                this.getregionData()
              })
              .catch(res => {
                this.$message.error('操作失败！')
                this.savePassLoading = false
              })
          }
        } else {
          this.savePassLoading = false
        }
      })
    }
  },
  mounted() {
    const _this = this
    this.tableHeight = window.innerHeight - 280
    // 浏览器窗口发生改变
    window.onresize = function() {
      _this.tableHeight = window.innerHeight - 280
    }
    this.getregionData()
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
  margin-top: 10px;
  .search-box {
    float: left;
  }
  .btn-box {
    float: right;
    display: flex;
    height: 32px;
  }
}
</style>


