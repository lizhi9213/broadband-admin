<style lang="less">
@import './customerList.less';
</style>

<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="ios-browsers"></Icon>
        客户列表
      </p>
      <div>
        <div class="hadle-box">
          <div class="search-box">
            <Input placeholder="请输入查询内容" v-model="keyWord" class="input-with-select" @on-enter="getTabData">
            <Button slot="append" icon="ios-search"></Button>
            </Input>
          </div>
          <div class="btn-box">
            <Button icon="ios-cloud-upload-outline" @click="exportData">导出</Button>
            <Button type="success" icon="plus" @click="openModal">新增</Button>
          </div>
        </div>
        <Table stripe :show-overflow-tooltip="true" :columns="Columns " ref="table" @on-selection-change="onSelect" :loading="loading" :data="tableData.data " :height="tableHeight" style="margin-bottom:10px;"></Table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="curnPage" background :page-sizes="[30, 50]" :page-size="sizePage" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
        </el-pagination>
        <Modal v-model="dateModal " :width="700 " :styles="{ 'margin-right': '0', 'height': 'calc(100% - 100px)'} " :transfer="false " :transition-names="[ 'move-right', 'fade'] ">
          <h3 slot="header" style="color:#2D8CF0">{{modalTitle}}</h3>
          <Form ref="Form" :model="Form" :label-width="100" label-position="right" :rules="rulesForm">
            <FormItem label="区域名称" prop="AreaName">
              <Input v-model="Form.AreaName" placeholder="请填写区域名称"></Input>
            </FormItem>
            <FormItem label="归属区域">
              <Select v-model="Form.PId" placeholder="请选择归属区域">
                <Option v-for="item in areaOption" :key="item.value" :value="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="序号" prop="Code">
              <Input v-model="Form.Code" placeholder="请填写序号"></Input>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" @click="dateModal = false">取消</Button>
            <Button type="primary" :loading="savePassLoading" @click="submit">保存</Button>
          </div>
        </Modal>
      </div>
    </Card>
  </div>
</template><script>
export default {
  data() {
    const valideSequence = (rule, value, callback) => {
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
    return {
      badge: '',
      loading: false,
      dateModal: false,
      modalTitle: '',
      savePassLoading: false, // 保存loading
      Form: {
        AreaName: '',
        PID: '-1',
        Code: ''
      },
      areaOption: [],
      rulesForm: {
        AreaName: [
          {
            required: true,
            message: '区域名称不能为空',
            trigger: 'blur'
          }
        ],
        PId: [
          {
            required: true,
            message: '归属区域不能为空',
            trigger: 'change'
          }
        ],
        Code: [
          { required: true, message: '请设置排序', trigger: 'blur' },
          { validator: valideSequence }
        ]
      },
      keyWord: '',
      Columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          key: 'Code'
        },
        {
          title: '宽带账号',
          key: 'aname'
        },
        {
          title: '宽带编号',
          key: 'aname'
        },
        {
          title: '联系人',
          key: 'aname'
        },
        {
          title: '联系电话',
          key: 'aname'
        },
        {
          title: '安装地址',
          key: 'aname'
        },
        {
          title: '业务类型',
          key: 'aname'
        },
        {
          title: '区域名称',
          key: 'aname'
        },
        {
          title: '归属区域',
          key: 'bname'
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
          key: 'action',
          align: 'center',
          width: 150,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {}
                  }
                },
                '催单'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {}
                  }
                },
                '回访'
              )
            ])
          }
        }
      ],
      tableData: {
        data: [
          {
            aname: '呜啦啦',
            bname: '嘤嘤嘤',
            Code: '1',
            CreateTime: '2018-05-08',
            CreateName: '管理员'
          },
          {
            aname: '呜啦啦',
            bname: '嘤嘤嘤',
            Code: '1',
            CreateTime: '2018-05-08',
            CreateName: '管理员'
          },
          {
            aname: '呜啦啦',
            bname: '嘤嘤嘤',
            Code: '1',
            CreateTime: '2018-05-08',
            CreateName: '管理员'
          },
          {
            aname: '呜啦啦',
            bname: '嘤嘤嘤',
            Code: '1',
            CreateTime: '2018-05-08',
            CreateName: '管理员'
          },
          {
            aname: '呜啦啦',
            bname: '嘤嘤嘤',
            Code: '1',
            CreateTime: '2018-05-08',
            CreateName: '管理员'
          }
        ],
        total: 0
      },
      checkedList: [],
      curnPage: 1,
      sizePage: 30,
      tableHeight: 500
    }
  },
  methods: {
    exportData() {
      this.$refs.table.exportCsv({
        noHeader: true,
        filename: '客户列表',
        columns: this.Columns.filter((col, index) => index < 6),
        data: this.tableData.data.filter((data, index) => index < 6)
      })
    },
    setregionCombo() {
      // 归属区域下拉
      this.axios
        .get('/apiweb/area/combox/cascade/', {})
        .then(res => {
          this.areaOption = res.data
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getTabData() {
      let vm = this
      vm.loading = true
      this.axios
        .get('', {
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
      this.getTabData()
    },
    handleCurrentChange(val) {
      this.getTabData()
    },
    openModal(a) {
      this.$refs['Form'].resetFields()
      let vm = this
      this.modalTitle = '新增区域'
      this.badge = 1
      this.dateModal = true
    },
    setinfo() {
      let vm = this
      const Id = vm.checkedList[0].Id
      vm.axios
        .get('', {})
        .then(res => {
          this.Form = res.data
        })
        .catch(res => {
          vm.$message.error('操作失败！')
          this.dateModal = false
        })
    },
    delinfo() {
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
            .put('', {
              ids
            })
            .then(res => {
              vm.$message.success(res.data.msg)
              vm.getTabData()
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
      this.$refs['Form'].validate(valid => {
        if (valid) {
          this.axios
            .post('', {})
            .then(res => {
              this.$message.success(res.data.msg)
              this.dateModal = false
              this.savePassLoading = false
              this.getTabData()
            })
            .catch(res => {
              this.$message.error('操作失败！')
              this.savePassLoading = false
            })
        } else {
          this.savePassLoading = false
        }
      })
    }
  },
  mounted() {
    this.tableHeight = window.innerHeight - 307
    this.setregionCombo()
    this.getTabData()
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


