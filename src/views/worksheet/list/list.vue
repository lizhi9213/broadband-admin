<style lang="less">
@import url('./list.less');
</style>

<template>
  <div>
    <Card dis-hover>
      <Layout>
        <Sider hide-trigger width="200">
          <Menu :active-name="activeName" @on-select="menuChange" width="200px">
            <MenuGroup title="公共视图">
              <MenuItem v-for="item, index in viewList" :key="item.ViewId" :name="item.ViewId+','+index"> {{ item.ViewTitle }}
              </MenuItem>
            </MenuGroup>
          </Menu>
        </Sider>
        <Layout>
          <Header>
            <Form inline @submit.native.prevent>
              <FormItem>
                <DatePicker type="datetimerange" v-model="times" format="yyyy-MM-dd HH:mm" :clearable="false" placeholder="选择时间范围" style="width: 270px" @on-ok="getData"></DatePicker>
              </FormItem>
              <FormItem>
                <Input placeholder="搜索姓名、手机、主题" style="width: 280px;" v-model="keyWord" @on-enter="getData">
                <Button slot="append" icon="ios-search" @click="getData"></Button>
                </Input>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="expCsv">
                  <Icon type="ios-download-outline"></Icon> 导出</Button>
                <Button type="error" @click="delWork">
                  <Icon type="android-delete"></Icon> 删除</Button>
              </FormItem>
            </Form>
          </Header>
          <Content>
            <Table :height="tableHeight" @on-sort-change="sortTable" :columns="cols" :loading="loading" :data="tableData.data" @on-row-click="toOper" @on-selection-change="tableSelect" ref="table"></Table>
          </Content>
          <Footer>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="curnPage" background :page-sizes="[30, 50, 100]" :page-size="sizePage" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
            </el-pagination>
          </Footer>
        </Layout>
      </Layout>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'orderlist',
  data() {
    let _this = this
    return {
      activeName: null,
      viewList: [],
      curnPage: 1,
      sizePage: 30,
      tableData: {
        data: [],
        total: 0
      },
      tableHeight: window.innerHeight - 260,
      cols: [],
      loading: false,
      keyWord: '',
      changed: [],
      times: [],
      sort: '',
      order: ''
    }
  },
  methods: {
    menuChange(val) {
      this.activeName = val
      this.getShows(val)
    },
    handleCurrentChange(val) {
      this.getData()
    },
    handleSizeChange(val) {
      this.sizePage = val
      this.getData()
    },
    tableSelect(changed) {
      this.changed = [...changed.map(item => item.WorkID)]
    },
    getShows(val) {
      this.axios
        .get('/apiweb/workshow/getcols', {
          params: {
            ViewId: (!val ? this.activeName : val).split(',')[0]
          }
        })
        .then(res => {
          res.data.map(item => {
            item.ellipsis = true
            if (item.key === 'ImportID') {
              item.render = (h, params) => {
                let type = ''
                console.log(params.row.ImportID)
                if (
                  params.row.ImportID === '越级' ||
                  params.row.ImportID === '紧急'
                )
                  type = 'danger'
                return h('div', [
                  h(
                    'el-tag',
                    { props: { size: 'small', type } },
                    params.row.ImportID
                  )
                ])
              }
            }
          })
          this.cols = [
            {
              type: 'selection',
              width: 52,
              align: 'center'
            },
            {
              type: 'index',
              width: 50,
              align: 'center'
            }
          ].concat(res.data)
          if (this.cols.length === 0) {
            this.$message.warning('请设置视图')
          } else {
            this.getData()
          }
        })
        .catch(err => {})
    },
    getData() {
      this.loading = true
      this.axios
        .get('/apiweb/workshow/getlist', {
          params: {
            Type: this.activeName.split(',')[1],
            index: this.curnPage,
            limit: this.sizePage,
            btime: !this.times[0]
              ? ''
              : Math.round(this.times[0].getTime() / 1000),
            etime: !this.times[1]
              ? ''
              : Math.round(this.times[1].getTime() / 1000),
            keyWord: this.keyWord,
            sort: this.sort,
            order: this.order
          }
        })
        .then(res => {
          res.data.data.map(
            item =>
              item._disabled === 1
                ? (item._disabled = true)
                : (item._disabled = false)
          )
          this.tableData.data = res.data.data
          this.tableData.total = res.data.count
          this.loading = false
        })
        .catch(err => {
          this.tableData.data = { data: [], total: 0 }
          this.loading = false
        })
    },
    toOper(row, index) {
      this.$router.push({
        path: `workoper/workoper/${row.WorkTotalId}`
      })
    },
    delWork() {
      let that = this
      if (that.changed.length === 0) {
        that.$message.warning('请选中要删除的工单')
      } else {
        that
          .$confirm('确认删除这些工单？删除后不可找回。', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            that.axios
              .post('/apiweb/work/delWork', { ids: that.changed })
              .then(res => {
                if (res.data.ok) {
                  that.$message.success(res.data.msg)
                  that.getData()
                } else {
                  that.$message.error(res.data.msg)
                }
              })
              .catch(err => {
                that.$message.error('操作失败')
              })
          })
          .catch(() => {})
      }
    },
    expCsv() {
      this.loading = true
      this.axios
        .get('/apiweb/workshow/getlist', {
          params: {
            Type: this.activeName.split(',')[1],
            index: 1,
            limit: 10000,
            btime: !this.times[0]
              ? ''
              : Math.round(this.times[0].getTime() / 1000),
            etime: !this.times[1]
              ? ''
              : Math.round(this.times[1].getTime() / 1000),
            keyWord: this.keyWord
          }
        })
        .then(res => {
          res.data.data.map(item => {
            Object.keys(item).map(key => {
              item[key] =
                '"' +
                (typeof item[key] === 'string'
                  ? item[key].replace(/"/g, "'")
                  : item[key]) +
                '"'
            })
          })
          console.log(res.data.data)
          this.$refs.table.exportCsv({
            filename: new Date().toLocaleString(),
            columns: this.cols,
            data: res.data.data
          })
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.$message.error('操作失败！')
          this.loading = false
        })
    },
    sortTable(sort) {
      console.log(sort)
      this.sort = sort.key
      this.order = sort.order
      this.getData()
    }
  },
  created() {
    this.times = [
      new Date(
        new Date(
          new Date(new Date().setDate(new Date().getDate() - 1)).setHours(0)
        ).setMinutes(0)
      ),
      new Date(new Date(new Date().setHours(23)).setMinutes(59))
    ]
    this.axios.get('/apiweb/show/FieldShowList').then(res => {
      this.activeName = res.data[0].ViewId + ',0'
      this.viewList = res.data
      this.getShows()
    })
  }
}
</script>

