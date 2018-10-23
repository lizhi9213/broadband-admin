<style lang="less">
@import './community.less';
</style>

<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="ios-browsers"></Icon>
        小区管理
      </p>
      <div>
        <div class="hadle-box">
          <div class="search-box">
            <Input placeholder="请输入查询内容" v-model="keyWord" class="input-with-select" @on-enter="getData">
            <Button slot="append" icon="ios-search" @click="getData()"></Button>
            </Input>
          </div>
          <div class="btn-box">
            <!-- <Button type="success" icon="plus" @click="openModal(1)">新增</Button>
            <Button type="info" icon="compose" @click="openModal(2)">编辑</Button>
            <Button type="error" icon="trash-b " @click="openModal(3)">删除</Button> -->
            <Button type="success" icon="ios-upload-outline" @click="showUpload=true">导入</Button>
          </div>
        </div>
        <Table stripe :show-overflow-tooltip="true" :columns="Columns " :loading="tableLoading" :data="tableData.data " :height="tableHeight" style="margin-bottom:10px;"></Table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="curnPage" background :page-sizes="[30, 50]" :page-size="sizePage" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
        </el-pagination>
        <Modal v-model="showUpload" title="导入数据">
          <Alert>
            <ul>
              <li>
                此操作将同时更新小区、装维组织数据
              </li>
              <li>
                此操作可能需要5-10分钟，期间请勿关闭网页
              </li>
              <li>
                仅支持xls、xlsx格式文件
              </li>
              <li>
                导入数据需与模板对应，请<a href="/static/json/小区与维护单位信息.xls">点击此处</a>下载
              </li>
            </ul>
          </Alert>
          <el-upload action="/apiweb/area/import" :show-file-list="false" drag :http-request="upload" v-loading.fullscreen="loading" :element-loading-text="'正在处理，可能需要5~10分钟，已耗时'+loading_time">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
          <div slot="footer">
            <Button @click="showUpload=false">取消</Button>
          </div>
        </Modal>
      </div>
    </Card>
  </div>
</template>
<script>
export default {
  name: 'community',
  data() {
    return {
      loading: false,
      tableLoading: false,
      loading_text: 0,
      keyWord: '',
      Columns: [
        {
          title: '小区编码',
          key: 'Code',
          minWidth: 100
        },
        {
          title: '小区名称',
          key: 'Name',
          minWidth: 150
        },
        {
          title: '归属区县',
          key: 'Area',
          minWidth: 100
        },
        {
          title: '乡镇/街道',
          key: 'Street',
          minWidth: 100
        },
        {
          title: '小区地址描述',
          key: 'Description',
          minWidth: 150
        },
        {
          title: '客户经理',
          key: 'ManaName',
          minWidth: 80
        },
        {
          title: '客户经理电话',
          key: 'ManaPhone',
          minWidth: 100
        },
        {
          title: '代维公司名称',
          key: 'ClassName',
          minWidth: 100
        },
        {
          title: '代维公司编号',
          key: 'ClassCode',
          minWidth: 100
        },
        {
          title: '维护班组ID',
          key: 'GroupCode',
          minWidth: 100
        },
        {
          title: '维护班组名称',
          key: 'GroupName',
          minWidth: 100
        },
        {
          title: '地域属性',
          key: 'Attributes',
          minWidth: 80
        }
      ],
      tableData: {
        data: [],
        total: 0
      },
      tableHeight: 400,
      curnPage: 1,
      sizePage: 30,
      showUpload: false
    }
  },
  methods: {
    getData() {
      this.axios
        .get('/apiweb/area/community', {
          params: {
            keyWord: this.keyWord,
            limit: this.sizePage,
            index: this.curnPage
          }
        })
        .then(res => {
          this.tableData.data = res.data.data
          this.tableData.total = res.data.total
        })
        .catch(err => {
          if (err.response.data.msg) {
            this.$message.error(err.response.data.msg)
          } else {
            this.$message.error('发生错误')
          }
        })
    },
    handleSizeChange(val) {
      this.sizePage = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.getData()
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
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.tableHeight = window.innerHeight - 307
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
.el-upload {
  width: 100%;
}
.el-upload .el-upload-dragger {
  width: 100%;
}
</style>



