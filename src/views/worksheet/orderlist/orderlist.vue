<style lang="less">
@import url('./orderlist.less');
.el .ivu-form-item-content {
  line-height: normal;
}
</style>

<template>
    <div class="container">
        <Card dis-hover>
            <Row :gutter="10" class="handle-box" style="margin-bottom:0;">
                <Col span="18" class="filter-input">
                <Icon type="funnel" size="20" style="margin: 0 12px; cursor: pointer; color: #1890ff;" @click="show1 = !show1"></Icon>
                <div class="base-filter" v-if="!show1">
                    派单时间：
                    <el-date-picker type="datetimerange" v-model="filterData.orderTime" format="yyyy-MM-dd HH:mm" start-placeholder="开始时间" end-placeholder="结束时间" size="small" value-format="yyyy-MM-dd HH:mm" :default-time="['07:00:00', '18:00:00']" style="width: 240px;"></el-date-picker>
                    <Input v-model="filterData.keyWord" icon="ios-search" placeholder="请输入关键字" style="width: 240px; margin: 0 12px;">
                    </Input>
                    <Button type="primary" @click="initOrderList">
                        <i class="iconfont icon-shaixuan" style="line-height:15px;vertical-align:middle;"></i> 筛选
                    </Button>
                </div>
                </Col>
                <Col span="6" class="btn-group">
                <Button type="success" icon="plus" ghost @click="$router.push('/workorder')">新增</Button>
                <Button type="error" icon="trash-b" ghost @click="selectMenu('0')">删除</Button>
                <!-- <Dropdown style="margin-left: 14px" @on-click="selectMenu" trigger="click">
          <Button type="success">
            批量操作
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="1">催单</DropdownItem>
            <DropdownItem name="0">删除</DropdownItem>
            <DropdownItem name="2">归档</DropdownItem>
          </DropdownMenu>
        </Dropdown> -->
                </Col>
            </Row>
        </Card>
        <el-collapse-transition>
            <div v-show="show1">
                <div class="filter-list">
                    <Form ref="filterform" :model="filterData" :label-width="120">
                        <Row :gutter="10">
                            <Col span="8">
                            <FormItem label="派单时间：" class="el">
                                <el-date-picker type="datetimerange" format="yyyy-MM-dd HH:mm" v-model="filterData.orderTime" start-placeholder="开始时间" end-placeholder="结束时间" size="small" value-format="yyyy-MM-dd HH:mm" :default-time="['07:00:00', '18:00:00']" style="width: 100%"></el-date-picker>
                            </FormItem>
                            </Col>
                            <Col span="8">
                            <FormItem label="接单时间：" class="el">
                                <el-date-picker type="datetimerange" format="yyyy-MM-dd HH:mm" v-model="filterData.ordersTime" start-placeholder="开始时间" end-placeholder="结束时间" size="small" value-format="yyyy-MM-dd HH:mm" :default-time="['07:00:00', '18:00:00']" style="width: 100%"></el-date-picker>
                            </FormItem>
                            </Col>
                            <Col span="8">
                            <FormItem label="完工时间：" class="el">
                                <el-date-picker type="datetimerange" format="yyyy-MM-dd HH:mm" v-model="filterData.completedTime" start-placeholder="开始时间" end-placeholder="结束时间" size="small" value-format="yyyy-MM-dd HH:mm" :default-time="['07:00:00', '18:00:00']" style="width: 100%"></el-date-picker>
                            </FormItem>
                            </Col>
                            <Col span="8">
                            <FormItem label="归档时间：" class="el">
                                <el-date-picker type="datetimerange" format="yyyy-MM-dd HH:mm" v-model="filterData.archiveTime" start-placeholder="开始时间" end-placeholder="结束时间" size="small" value-format="yyyy-MM-dd HH:mm" :default-time="['07:00:00', '18:00:00']" style="width: 100%"></el-date-picker>
                            </FormItem>
                            </Col>
                            <Col span="8">
                            <FormItem label="工单状态：">
                                <Select v-model="filterData.status" placeholder="请选择工单状态" clearable>
                                    <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                            </Col>
                            <Col span="8">
                            <FormItem label="关键字：">
                                <Input v-model="filterData.keyWord" placeholder="请输入关键字以检索宽带类型、故障类型、宽带账号、工单编号等字段"></Input>
                            </FormItem>
                            </Col>
                            <Col span="8">
                            <FormItem label="所属小区：">
                                <Select clearable filterable remote :remote-method="communityMethod" v-model="filterData.communityId" placeholder="请选择所属小区">
                                    <Option v-for="item in communityData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                            </Col>
                            <Col span="16">
                            <div class="item-group">
                                <label class="group-label">派单机构：</label>
                                <div class="group-content">
                                    <FormItem>
                                        <Select clearable v-model="filterData.classId" @on-change="classSelDone" placeholder="请选择代维公司">
                                            <Option v-for="item in classData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select>
                                    </FormItem>
                                    <FormItem>
                                        <Select clearable v-model="filterData.groupId" placeholder="请选择代维班组">
                                            <Option v-for="item in groupData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select>
                                    </FormItem>
                                </div>
                            </div>
                            </Col>
                            <Col offset="21" span="3" style="text-align:right">
                            <Button type="primary" style="margin-left: 16px;" @click="initOrderList">
                                <Icon type="ios-search"></Icon> 筛选
                            </Button>
                            </Col>
                        </Row>
                        </Card>
                    </Form>
                </div>
            </div>
        </el-collapse-transition>
        <Card dis-hover style="margin-top: 12px;">
            <Table :height="cardHeight" :columns="columns1" :data="data1" :loading="isTableLoading" :highlight-row="true" :row-class-name="rowClassName" @on-select="rowSelect" style="margin-bottom:30px;"></Table>
            <div style="text-align:right;padding-right:14px;">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background :current-page="currentPage" :page-sizes="[30, 60, 90, 120]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageTotal">
                </el-pagination>
            </div>
        </Card>
    </div>
</template>

<script>
import {
  getClassCombo,
  getGroupCombo,
  getCommunityCombo
} from '@/api/combox.js'
export default {
  name: 'listing',
  data() {
    const _this = this
    return {
      cardHeight: 500,
      statusList: [
        {
          value: 0,
          label: '已派单'
        },
        {
          value: 1,
          label: '已接单'
        },
        {
          value: 2,
          label: '已签到'
        },
        {
          value: 3,
          label: '已完工'
        },
        {
          value: 4,
          label: '已归档'
        }
      ], // 状态
      cityList: [],
      classData: [], // 代维公司信息
      groupData: [], // 代维班组信息
      communityData: [], // 小区信息
      show1: false, // 显示筛选表单
      isTableLoading: false,
      formOrder: { user: '', password: '' },
      ruleOrder: {},
      columns1: [
        {
          type: 'selection',
          width: 60,
          fixed: 'left',
          align: 'center'
        },
        {
          title: '状态',
          fixed: 'left',
          width: 95,
          key: 'status',
          render: (h, params) => {
            let color = 'blue'
            switch (params.row.status) {
              case '已完成':
                color = 'green'
                break
              case '已归档':
                color = 'green'
                break
              default:
                if (params.row.dealLine > 0) {
                  color = 'red'
                }
                break
            }
            return h(
              'Tag',
              {
                props: {
                  color,
                  type: 'border'
                }
              },
              params.row.status
            )
          }
        },
        {
          title: '工单编号',
          fixed: 'left',
          minWidth: 150,
          key: 'code',
          render: (h, params) => {
            // console.log(params)
            return h(
              'a',
              {
                style: { cursor: 'pointer', 'text-decoration': 'underline' },
                on: {
                  click: () => {
                    this.$router.push('/orderdetail/' + params.row.id)
                  }
                },
                attrs: {
                  title: '查看工单详情'
                }
              },
              params.row.code
            )
          }
        },
        {
          title: '宽带账号',
          minWidth: 150,
          key: 'webAccount'
        },
        {
          title: '宽带开通日期',
          minWidth: 150,
          key: 'openDate'
        },
        {
          title: '联系人',
          minWidth: 150,
          key: 'custName'
        },
        {
          title: '联系电话',
          minWidth: 150,
          key: 'custPhone'
        },
        {
          title: '客户经理工号',
          minWidth: 150,
          key: 'manaAccount'
        },
        {
          title: '客户经理联系电话',
          minWidth: 150,
          key: 'manaPhone'
        },
        {
          title: '所属小区',
          minWidth: 320,
          key: 'communityName'
        },
        {
          title: '派单机构',
          minWidth: 320,
          key: 'area'
        },
        {
          title: '安装地址',
          minWidth: 320,
          key: 'installAddr'
        },
        {
          title: '宽带类型',
          minWidth: 150,
          key: 'type'
        },
        {
          title: '故障现象',
          minWidth: 150,
          key: 'faultMemo'
        },
        {
          title: '故障类型',
          minWidth: 150,
          key: 'faultType'
        },
        {
          title: '回访结果',
          minWidth: 150,
          key: 'visitResult'
        },
        {
          title: '故障开始时间',
          minWidth: 150,
          key: 'faultTime'
        },
        {
          title: '派单时间',
          minWidth: 150,
          key: 'orderTime'
        },
        {
          title: '接单人',
          minWidth: 150,
          key: 'ordersUser'
        },
        {
          title: '接单时间',
          minWidth: 150,
          key: 'ordersTime'
        },
        {
          title: '签到时间',
          minWidth: 150,
          key: 'checkTime'
        },
        {
          title: '完工时间',
          minWidth: 150,
          key: 'completedTime'
        },
        {
          title: '故障来源',
          minWidth: 150,
          key: 'faultSource'
        },
        {
          title: '创建人',
          minWidth: 150,
          key: 'createName'
        },
        {
          title: '备注',
          minWidth: 150,
          key: 'memo'
        },
        {
          title: '评价备注',
          minWidth: 150,
          key: 'remark'
        },
        {
          title: '工作时限',
          minWidth: 120,
          fixed: 'right',
          align: 'center',
          key: 'workLine',
          render: (h, params) => {
            let msg = ''
            if (
              params.row.workLine >= 0 &&
              params.row.status !== '已归档' &&
              params.row.status !== '已完成'
            ) {
              msg = '已超' + params.row.workLine + '小时'
            } else if (
              params.row.workLine < 0 &&
              params.row.status !== '已归档' &&
              params.row.status !== '已完成'
            ) {
              msg = '剩余' + -params.row.workLine + '小时'
            } else {
              msg = params.row.status
            }
            return h('span', msg)
          }
        },
        {
          title: '完工时限',
          minWidth: 120,
          fixed: 'right',
          align: 'center',
          key: 'dealLine',
          render: (h, params) => {
            let msg = ''
            if (
              params.row.dealLine > 0 &&
              params.row.status !== '已归档' &&
              params.row.status !== '已完成'
            ) {
              msg = '已超' + params.row.dealLine + '小时'
            } else if (
              params.row.dealLine < 0 &&
              params.row.status !== '已归档' &&
              params.row.status !== '已完成'
            ) {
              msg = '剩余' + -params.row.dealLine + '小时'
            } else {
              msg = params.row.status
            }
            return h('span', msg)
          }
        },
        {
          title: '操作',
          minWidth: 80,
          fixed: 'right',
          align: 'center',
          key: 'Operation',
          render: (h, params) => {
            return h(
              'Dropdown',
              {
                props: {
                  trigger: 'click',
                  transfer: true
                },
                on: {
                  'on-click': name => {
                    // console.log(name)
                    if (name === 0) {
                      // 单条删除
                      const idArr = []
                      idArr.push(params.row.id)
                      // console.log(idArr)
                      _this.deleteOrder(idArr)
                    } else if (name === 1) {
                      //  催单
                      _this
                        .$prompt('输入提醒内容(可以留空)', '催单', {
                          confirmButtonText: '确定',
                          cancelButtonText: '取消',
                          inputPlaceholder: '请尽快处理该工单，谢谢'
                        })
                        .then(({ value }) => {
                          _this.axios
                            .post(
                              `/apiweb/work/workorder/${
                                params.row.id
                              }/reminders`,
                              { memo: value }
                            )
                            .then(res => {
                              _this.$message.success(res.data.msg)
                            })
                            .catch(err => {
                              if (err.response.data.msg) {
                                _this.$message.error(err.response.data.msg)
                              } else {
                                _this.$message.error('操作失败')
                              }
                              console.log(err)
                            })
                        })
                        .catch(() => {})
                    } else if (name === 2) {
                      this.$confirm('确定将该工单归档？', '提示')
                        .then(() => {
                          this.axios
                            .post(
                              `/apiweb/work/workorder/${params.row.id}/archive`
                            )
                            .then(res => {
                              _this.$message.success(res.data.msg)
                              _this.initOrderList()
                            })
                            .catch(err => {
                              if (err.response.data.msg) {
                                _this.$message.error(res.response.data.msg)
                              } else {
                                _this.$message.error('操作失败')
                              }
                            })
                        })
                        .catch(() => {})
                    }
                  }
                }
              },
              [
                h('i', {
                  style: {
                    cursor: 'pointer'
                  },
                  class: {
                    iconfont: true,
                    'icon-shezhi': true
                  }
                }),
                h(
                  'DropdownMenu',
                  {
                    slot: 'list'
                  },
                  [
                    h('DropdownItem', { props: { name: 1 } }, '催单'),
                    h('DropdownItem', { props: { name: 0 } }, '删除'),
                    params.row.status === '已归档'
                      ? null
                      : h(
                          'DropdownItem',
                          {
                            props: {
                              name: 2
                            }
                          },
                          '归档'
                        )
                  ]
                )
              ]
            )
          }
        }
      ], // table表头
      data1: [], // 表格数据
      selectedList: [], // 已选择的列表
      currentPage: 1, // 当前页码
      pageTotal: 0, // 总页数
      pageSize: 30, // 当前一页多少条
      filterData: {
        keyWord: '', // 关键字
        status: '', // 工单状态
        orderTime: [], // 派单时间
        ordersTime: [], // 接单时间
        completedTime: [], // 完工时间
        archiveTime: [],
        faultType: '', // 故障类型
        type: '', // 宽带类型
        areaId: [], // 区域id
        classId: '', // 组织id
        groupId: '', // 网格id
        communityId: '' // 所属小区
      }, // 筛选表单数据
      areaData: [], // 所属区域
      orgList: [], // 所属组织
      gridList: [] // 所属网格
    }
  },
  methods: {
    toWork() {
      this.$router.push('/workorder')
    },
    initOrderList() {
      const _this = this
      // 初始化工单列表
      this.data1 = []
      this.isTableLoading = true
      // console.log(this.filterData)
      // function compare(time) {
      //   let timeArr = time.split(' ')
      //   if (timeArr[1] === '00:00') {
      //     timeArr[1] = '23:59'
      //     timeArr = timeArr[0] + ' ' + timeArr[1]
      //     // console.log(timeArr)
      //     return timeArr
      //   } else {
      //     return time
      //   }
      // }
      // // 派单时间
      // if (this.filterData.orderTime.length !== 0) {
      //   this.filterData.orderTime[1] = compare(this.filterData.orderTime[1])
      // }
      // // 接单时间
      // if (this.filterData.ordersTime.length !== 0) {
      //   this.filterData.ordersTime[1] = compare(this.filterData.ordersTime[1])
      // }
      // // 完成时间
      // if (this.filterData.completedTime.length !== 0) {
      //   this.filterData.completedTime[1] = compare(
      //     this.filterData.completedTime[1]
      //   )
      // }
      console.log(_this.filterData)
      this.axios
        .get('/apiweb/work/workorder', {
          params: {
            limit: _this.pageSize, // 一页多少条
            index: _this.currentPage, // 当前页码
            keyWord: _this.filterData.keyWord, // 关键字
            status: _this.filterData.status, // 工单状态
            orderTime: _this.filterData.orderTime
              ? JSON.stringify(_this.filterData.orderTime)
              : null, // 派单时间
            ordersTime: _this.filterData.ordersTime
              ? JSON.stringify(_this.filterData.ordersTime)
              : null, // 接单时间
            completedTime: _this.filterData.completedTime
              ? JSON.stringify(_this.filterData.completedTime)
              : null, // 完成时间
            archiveTime: _this.filterData.archiveTime
              ? JSON.stringify(_this.filterData.archiveTime)
              : null,
            areaId:
              _this.filterData.areaId.length > 0
                ? _this.filterData.areaId[_this.filterData.areaId.length - 1]
                : null, // 区域id
            classId: _this.filterData.classId, // 组织id
            groupId: _this.filterData.groupId, // 网格id
            communityId: _this.filterData.communityId // 所属小区
          }
        })
        .then(res => {
          _this.data1 = res.data.data
          _this.isTableLoading = false
          _this.pageTotal = res.data.count // 总页数
        })
        .catch(function(err) {
          _this.isTableLoading = false
        })
    },
    getAreaList() {
      const _this = this
      // 获取所属区域列表
      this.axios
        .get('/apiweb/area/combox/cascade/', {
          keyWord: ''
        })
        .then(res => {
          // console.log(JSON.stringify(res.data))
          _this.areaData = res.data
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getOrgList(id) {
      const _this = this
      // 先清空之前的数据
      this.orgList = []
      this.filterData.classId = ''
      // 获取所属组织下拉列表
      this.axios
        .get('/apiweb/class/combox/select/', {
          params: {
            keyWord: '',
            areaId: id
          }
        })
        .then(res => {
          // console.log(JSON.stringify(res.data))
          _this.orgList = res.data
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getGridList(id) {
      const _this = this
      // 先清空之前的数据
      this.gridList = []
      this.filterData.groupId = ''
      // 获取所属组织下拉列表
      this.axios
        .get('/apiweb/class/group/combox/select/', {
          params: {
            keyWord: '',
            classId: id
          }
        })
        .then(res => {
          _this.gridList = res.data
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    areaSelDone(val, data) {
      // 区域级联选择完毕回调
      const nowId = val[val.length - 1]
      this.getOrgList(nowId)
    },
    getClassData() {
      // 获取代维公司信息
      const _this = this
      getClassCombo('concat', '')
        .then(res => {
          //   console.log(res.data)
          const data = res.data
          if (data) {
            // 成功
            _this.classData = data
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getGroupData(id) {
      // 获取代维班组信息
      const _this = this
      _this.groupData = []
      getGroupCombo('concat', id, '')
        .then(res => {
          //   console.log(res.data)
          const data = res.data
          if (data) {
            // 成功
            _this.groupData = data
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getCommunityData() {
      // 获取小区信息
      const _this = this
      getCommunityCombo('', 10)
        .then(res => {
          //   console.log(res.data)
          const data = res.data
          if (data) {
            // 成功
            _this.communityData = data
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    classSelDone(val) {
      // 代维公司选择事件
      this.getGroupData(val)
    },
    communityMethod(val) {
      // 获取小区信息
      const _this = this
      getCommunityCombo(val)
        .then(res => {
          //   console.log(res.data)
          const data = res.data
          if (data) {
            // 成功
            _this.communityData = data
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    rowClassName(row, index) {
      if (
        (row.workLine >= 0 || row.dealLine >= 0) &&
        row.status !== '已归档' &&
        row.status !== '已完成'
      ) {
        return 'row-statu2'
      } else if (
        (row.workLine < 1 || row.dealLine < 1) &&
        (row.workLine > -3 || row.dealLine > -3) &&
        row.status !== '已归档' &&
        row.status !== '已完成'
      ) {
        return 'row-statu1'
      }
      return ''
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.initOrderList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.initOrderList()
    },
    rowSelect(selection, row) {
      // table表格row选项勾选触发
      this.selectedList = selection
    },
    selectMenu(name) {
      const _this = this
      // 选择菜单项回调
      // 先判定用户是否选择了列表项，如果没有提示
      if (this.selectedList.length === 0) {
        _this.$message.warning('请至少选择一条数据！')
        return
      }
      // 处理id集合
      const idArr = []
      this.selectedList.forEach(item => {
        idArr.push(item.id)
      })
      // 当前操作的类型
      let nowType = name // 1催单 2归档 0删除

      // 发送请求到服务器
      //如果是删除要提醒用户
      if (nowType === '0') {
        _this.deleteOrder(idArr)
      }
    },
    deleteOrder(arr) {
      const _this = this
      // 删除工单
      this.$confirm('确认删除这些工单？删除后不可找回。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          _this.axios
            .put('/apiweb/work/workorder', { ids: arr })
            .then(res => {
              if (res.data.msg) {
                _this.$message.success(res.data.msg)
                _this.initOrderList()
              } else {
                _this.$message.error(res.data.msg)
              }
            })
            .catch(err => {
              _this.$message.error('操作失败')
            })
        })
        .catch(() => {})
    }
  },
  mounted() {
    const _this = this
    this.cardHeight = window.innerHeight - 304
    // 浏览器窗口发生改变
    window.onresize = function() {
      _this.cardHeight = window.innerHeight - 304
    }
    this.initOrderList()
    // this.getAreaList()
    this.getClassData()
    this.getCommunityData()
  }
}
</script>

