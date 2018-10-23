<style lang="less">
@import url('./hotlineEasy.less');
</style>

<template>
    <div class="container">
        <Card dis-hover :style="{minHeight: cardHeight + 'px'}">
            <Row :gutter="24" class="calling-box">
                <Col span="24" class="telephone">
                <p class="title">来电号码</p>
                <div class="phone-number">
                    <span class="number">{{inPhone}}</span>
                    <span class="timer">{{timing}}</span>
                </div>
                <!-- <div class="phone-number">
                    <span class="number">坐席持续：{{showPopData.calldate}}</span>
                    <span class="timer">分机持续：{{showPopData.extdate}}</span>
                </div>
                <div class="phone-number">
                    <span class="number">坐席状态：{{showPopData.callstatus}}</span>
                    <span class="timer">分机状态：{{showPopData.extstatus}}</span>
                </div> -->
                <div class="hangup-btn">
                    <button @click="hangUp">挂断</button>
                </div>
                </Col>
                <Col span="24" class="record">
                <p class="title">沟通记录</p>
                <Form :model="formItem" :label-width="80">
                    <FormItem label="来电类型">
                        <Select v-model="formItem.calltype">
                            <Option value="宽带咨询">宽带咨询</Option>
                            <Option value="故障报修">故障报修</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="备注说明">
                        <Input v-model="formItem.memo" type="textarea" :rows="4" placeholder="当前通话沟通主要内容记录" />
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="submitRecord(true)">保存</Button>
                    </FormItem>
                </Form>
                </Col>
            </Row>
        </Card>
        <div v-show="false">
            {{showPopData}}
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: 'hotline',
  computed: {
    showPopData: function() {
      this.popData = this.$store.state.app.popData
      return this.$store.state.app.popData
    }
  },
  watch: {
    popData(data) {
      console.log(data)
      const vm = this
      if (data.callcode) {
        if (vm.inCallCode != data.callcode) {
          // 切换号码
          vm.autoSave = false
          vm.clearForm()
        }
        vm.inPhone = data.phone
        vm.inCallCode = data.callcode
      }
      if (data.extstatus == 1) {
        // 振铃
        vm.startTimer(data.extdate)
      } else if (data.extstatus == 2) {
        // 通话中
        console.log(!vm.autoSave)
        if (!vm.autoSave) {
          vm.clearForm()
          vm.submitRecord(vm.autoSave)
          vm.autoSave = true
        }
        if (data.callstatus === 2) {
          vm.callOut()
        }
        vm.startTimer(data.extdate)
      } else {
        // 空闲
        vm.stopTimer()
      }
    }
  },
  data() {
    return {
      autoSave: false,
      inPhone: '',
      inCallCode: '',
      popData: {},
      formItem: {
        calltype: '',
        memo: ''
      },
      cardHeight: 500,
      timing: '00:00', // 页面计时
      clock: 0, // 程序计时
      timerId: '' // 间歇定时器id存放
    }
  },
  methods: {
    startTimer(start) {
      // 复位计时器
      this.cleraTimer()
      // 开始计时器
      const _this = this
      _this.clock = start + 1
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
    stopTimer() {
      const _this = this
      if (_this.timerId !== '') {
        window.clearInterval(_this.timerId)
      }
      _this.timerId = ''
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
    hangUp() {
      // 先存储通话时长
      // 清除定时器
      this.axios
        .post('/apiwss/system/hangUp', {
          id: Cookies.get('yh_web_UserCode'),
          comId: Cookies.get('yh_web_ComCode')
        })
        .then(res => {
          if (res.data) {
            this.$message.success(res.data.msg)
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    callIn() {
      this.axios
        .post('/apiwss/system/signIn', {
          id: Cookies.get('yh_web_UserCode'),
          comId: Cookies.get('yh_web_ComCode')
        })
        .then(res => {})
        .catch(function(err) {
          console.log(err)
        })
    },
    callOut() {
      this.axios
        .post('/apiwss/system/signOut', {
          id: Cookies.get('yh_web_UserCode'),
          comId: Cookies.get('yh_web_ComCode')
        })
        .then(res => {})
        .catch(function(err) {
          console.log(err)
        })
    },
    submitRecord(sub) {
      // 提交跟进记录
      //   console.log(this.formItem)
      const vm = this
      if (vm.inPhone) {
        vm.axios
          .post('/apiwss/system/callresult', {
            id: Cookies.get('yh_web_UserCode'),
            pcode: '-1', // 工单Id 热线为-1
            phone: vm.inPhone,
            calltype: vm.formItem.calltype || '',
            memo: vm.formItem.memo || '',
            callcode: vm.inCallCode
          })
          .then(res => {
            if (res.data) {
              if (sub) {
                vm.$message.success(res.data.msg)
                if (vm.popData.extstatus == 0) {
                  vm.callIn()
                  vm.clearForm()
                }
              }
            }
          })
          .catch(function(err) {
            console.log(err)
          })
      } else {
        vm.$message.error('当前无通话!')
      }
    },
    clearForm() {
      const vm = this
      vm.formItem = {
        calltype: '',
        memo: ''
      }
    }
  },
  mounted() {},
  destroyed() {
    this.cleraTimer()
  }
}
</script>

