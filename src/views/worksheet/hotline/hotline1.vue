<style lang="less">
@import url('./hotline.less');
</style>

<template>
  <div class="container">
    <Card dis-hover :style="{minHeight: cardHeight + 'px'}">
      <Row :gutter="24" class="calling-box">
        <Col span="12" class="telephone">
        <p class="title">来电号码</p>
        <div class="phone-number">
          <span class="number">{{orderForm.Phone}}</span>
          <span class="timer">{{timing}}</span>
        </div>
        <div class="hangup-btn">
          <button @click="hangUp">挂断</button>
        </div>
        </Col>
        <Col span="12" class="record">
        <p class="title">沟通记录</p>
        <Input v-model="record" @blur="submitRecord" type="textarea" :rows="4" placeholder="当前通话沟通主要内容记录" style="width: 86%; margin-left: 4.3%;" />
        </Col>
      </Row>
      <Row :gutter="24" class="work-order">
        <Col span="12" class="userinfo">
        <p class="title">来电接听</p>
        <div class="content">
          <ul class="con-form">
            <li class="form-items">
              <div class="item-col">宽带账号：{{userInfo.Account}}</div>
            </li>
            <li class="form-items">
              <div class="item-col">联系人：{{userInfo.Linkman}}</div>
              <div class="item-col">联系电话：{{userInfo.Phone}}</div>
            </li>
            <li class="form-items">
              <div class="item-col">拥有工单数目：{{userInfo.OrderNum}}</div>
            </li>
          </ul>
          <Table :columns="orderColumns" :data="orderData"></Table>
        </div>
        </Col>
        <Col span="12" class="history">
        <p class="title">历史工单</p>
        <div class="content">
          <Timeline pending>
            <TimelineItem color="#ff6060" v-for="(item, index) in showList" :key="index">
              <p class="line-title">2018年9月5日&nbsp;&nbsp;10:36:21
                <span class="label">热线/故障</span>
              </p>
              <div class="timeline-body">
                <p class="details">{{item.Problem}}</p>
                <div class="remark">
                  <span>备注：</span>
                  <p>{{item.Remark}}</p>
                </div>
              </div>
            </TimelineItem>
            <TimelineItem color="#ff6060" v-if="showList.length !== orderList.length">
              <a class="line-title" href="javascript:;" @click="showMore">查看更多</a>
            </TimelineItem>
          </Timeline>
        </div>
        </Col>
      </Row>
    </Card>
    <Modal v-model="newOrder" width="920" class-name="none-footer-order">
      <Form :model="orderForm" :rules="ruleValidate" label-position="right" class="order-form" :label-width="100">
        <Row :gutter="24">
          <Col span="12">
          <FormItem label="宽带账号：" prop="Account">
            <Input v-model="orderForm.Account"></Input>
          </FormItem>
          <FormItem label="联系人：" prop="Linkman">
            <Input v-model="orderForm.Linkman"></Input>
          </FormItem>
          <FormItem label="联系电话：" prop="Phone">
            <Input v-model="orderForm.Phone"></Input>
          </FormItem>
          <FormItem label="安装地址：" prop="Address">
            <Input v-model="orderForm.Address"></Input>
          </FormItem>
          <FormItem label="所属机构：" prop="Affiliation">
            <Select v-model="orderForm.Affiliation">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="安装客户经理：" prop="Manager">
            <Input v-model="orderForm.Manager"></Input>
          </FormItem>
          <FormItem label="经理联系方式：" prop="ManagerTel">
            <Input v-model="orderForm.ManagerTel"></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="来源：" prop="Source">
            <Select v-model="orderForm.Source">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="服务类型：" prop="ServiceType">
            <Select v-model="orderForm.ServiceType">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="问题现象：" prop="Problem">
            <Input v-model="orderForm.Problem"></Input>
          </FormItem>
          <FormItem label="基本诉求：" prop="Demands">
            <Input type="textarea" v-model="orderForm.Demands" :autosize="{minRows: 4,maxRows: 6}"></Input>
          </FormItem>
          <FormItem label="备注：" prop="Remark">
            <Input type="textarea" v-model="orderForm.Remark" :autosize="{minRows: 3,maxRows: 6}"></Input>
          </FormItem>
          </Col>
          <Col span="24" class="handle-box">
          <Button class="submint-btn" type="success" @click="formSubmit">提交</Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'hotline',
  data() {
    return {
      cardHeight: 500,
      timing: '00:00', // 页面计时
      clock: 0, // 程序计时
      timerId: '', // 间歇定时器id存放
      record: '', // 沟通记录
      newOrder: false, // 新建工单控制modal
      userInfo: {
        Account: '', // 宽带账号
        Linkman: '', // 联系人
        Phone: '', // 联系电话
        OrderNum: 3 // 拥有工单数目
      }, // 用户信息
      orderForm: {
        Account: '', // 宽带账号
        Linkman: '', // 联系人
        Phone: '', // 联系电话
        Address: '', // 安装地址
        Affiliation: '', // 所属机构
        Manager: '', // 安装客户经理
        ManagerTel: '', // 安装经理电话
        Source: '', // 来源
        ServiceType: '', // 服务类型
        Problem: '', // 问题现象
        Demands: '', // 基本诉求
        Remark: '' // 备注
      },
      ruleValidate: {
        Account: [
          {
            required: true,
            message: '宽带账号不能为空！',
            trigger: 'blur'
          }
        ],
        Linkman: [
          {
            required: true,
            message: '联系人姓名不能为空！',
            trigger: 'blur'
          }
        ],
        Phone: [
          {
            required: true,
            message: '联系人姓名不能为空！',
            trigger: 'blur'
          }
        ],
        Address: [
          {
            required: true,
            message: '安装地址不能为空！',
            trigger: 'blur'
          }
        ]
      },
      showList: [], // 展示的历史工单列表
      orderList: [], // 历史工单列表
      cityList: [
        {
          value: 'New York',
          label: 'New York'
        },
        {
          value: 'London',
          label: 'London'
        },
        {
          value: 'Sydney',
          label: 'Sydney'
        },
        {
          value: 'Ottawa',
          label: 'Ottawa'
        },
        {
          value: 'Paris',
          label: 'Paris'
        },
        {
          value: 'Canberra',
          label: 'Canberra'
        }
      ],
      orderColumns: [
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '宽带编号',
          key: 'serial',
          width: 160
        },
        {
          title: '安装地址',
          key: 'address',
          minWidth: 180
        },
        {
          title: '宽带开通日期',
          key: 'openDate',
          width: 160
        },
        {
          title: '操作',
          width: 120,
          key: 'operation',
          align: 'center',
          render: (h, params) => {
            return h(
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
                  click: () => {
                    this.addOrders(params.row.serial)
                  }
                }
              },
              '新建工单'
            )
          }
        }
      ], // 工单表头
      orderData: [
        {
          phone: '13598516340',
          serial: '02JZ20180900209',
          address:
            '下马村sf32-2号分纤箱安装在闪康家东墙上-onu002-fw-hg6201m/001',
          openDate: '2018-09-07 15:31:16'
        },
        {
          phone: '13598516340',
          serial: '02JZ20180900209',
          address:
            '下马村sf32-2号分纤箱安装在闪康家东墙上-onu002-fw-hg6201m/001',
          openDate: '2018-09-07 15:31:16'
        },
        {
          phone: '13598516340',
          serial: '02JZ20180900209',
          address:
            '下马村sf32-2号分纤箱安装在闪康家东墙上-onu002-fw-hg6201m/001',
          openDate: '2018-09-07 15:31:16'
        }
      ] // 工单数据
    }
  },
  methods: {
    startTimer() {
      // 复位计时器
      this.cleraTimer()
      // 开始计时器
      const _this = this
      let minute = 0
      let seconds = 0
      this.timerId = window.setInterval(function() {
        minute = 0
        seconds = 0
        if (_this.clock >= 60) {
          minute = parseInt(_this.clock / 60)
          seconds = _this.clock % 60
        } else {
          seconds = _this.clock
        }
        if (minute < 10) {
          minute = '0' + minute
        }
        if (seconds < 10) {
          seconds = '0' + seconds
        }
        _this.timing = minute + ':' + seconds
        _this.clock += 1
        // console.log(_this.timing)
      }, 1000)
    },
    cleraTimer() {
      const _this = this
      // 关闭并初始化计时数据
      if (this.timerId !== '') {
        window.clearInterval(_this.timerId)
      }
      this.timerId = ''
      this.clock = 0
      this.timing = '00:00'
    },
    getUserInfo(phone) {
      // this.axios
      //     .get('https://kejiyuan.xierxinxi.cn:1443/data/Report.ashx', {
      //       params: {
      //         Action: 'GetAllImportResult',
      //         TelNumber: phone
      //       }
      //     })
      //     .then(result => {
      //       console.log(result)
      //     })
      //     .catch(err => {
      //       this.$message.error('发生错误')
      //     })
      const res = {
        data: {
          Account: '', // 宽带账号
          SerialNum: '', // 宽带编号
          Linkman: '', // 联系人
          Phone: phone, // 联系电话
          Address: '', // 安装地址
          OpeningTime: '2018-3-2', // 宽带办理时间
          Validity: '2020-3-2', // 到期时间
          Affiliation: '', // 所属机构
          Manager: '', // 安装客户经理
          ManagerTel: '', // 安装经理电话
          ReviewResult: '', // 上次回访结果
          OrderNum: 3
        }
      }
      // 设置用户数据
      this.userInfo = {
        Account: res.data.Account, // 宽带账号
        Linkman: res.data.Linkman, // 联系人
        Phone: res.data.Phone, // 联系电话
        OrderNum: res.data.OrderNum // 安装地址
      }
      // 填充表单
      this.orderForm.Account = res.data.Account
      this.orderForm.Linkman = res.data.Linkman
      this.orderForm.Phone = res.data.Phone
      this.orderForm.Address = res.data.Address
      this.orderForm.Affiliation = res.data.Affiliation
      this.orderForm.Manager = res.data.Manager
      this.orderForm.ManagerTel = res.data.ManagerTel
    },
    getHistoryOrder(phone) {
      // 获取历史工单
      // this.axios
      //     .get('https://kejiyuan.xierxinxi.cn:1443/data/Report.ashx', {
      //       params: {
      //         Action: 'GetAllImportResult',
      //         TelNumber: phone
      //       }
      //     })
      //     .then(result => {
      //       console.log(result)
      //     })
      //     .catch(err => {
      //       this.$message.error('发生错误')
      //     })
      const res = {
        data: [
          {
            Problem: '网络故障，上网频繁掉线，无法正常使用',
            Remark: '加急处理'
          },
          {
            Problem: '网络故障，上网频繁掉线，无法正常使用',
            Remark: '加急处理'
          },
          {
            Problem: '网络故障，上网频繁掉线，无法正常使用',
            Remark: '加急处理'
          }
        ]
      }
      this.orderList = res.data
      this.showList.push(res.data[0], res.data[1])
    },
    addOrders(num) {
      // 新建工单 num为宽带编号
      console.log(num)
      this.newOrder = true
    },
    hangUp() {
      // 先存储通话时长
      // 清除定时器
      this.cleraTimer()
    },
    showMore() {
      // 显示更多，可以一次多显示几条也可以全部显示
      this.showList = this.orderList
    },
    submitRecord() {
      // 提交跟进记录
      console.log(this.record)
    },
    formSubmit() {
      // 新增表单
      console.log(this.orderForm)
    }
  },
  mounted() {
    const _this = this

    this.cardHeight = window.innerHeight - 120
    // 浏览器窗口发生改变
    window.onresize = function() {
      _this.cardHeight = window.innerHeight - 120
    }
    this.getUserInfo(this.$route.params.number)
    this.getHistoryOrder(this.$route.params.number)
    this.startTimer()
    console.log(this.$route.params)
  },
  destroyed() {
    this.cleraTimer()
  }
}
</script>

