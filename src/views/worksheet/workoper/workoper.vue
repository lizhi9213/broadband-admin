<style lang="less">
@import './workoper.less';
</style>

<template v->
  <div>
    <Card>
      <!-- 顶部标题 -->
      <p slot="title">
        <Icon type="android-options"></Icon>
        工单操作
      </p>
      <div :style="{height: boxHeight}">
        <Form ref="orderForms" style="height:100%" :model="orderForm" :rules="ruleNewOrder" label-position="top">
          <Row :gutter="18" style="height:100%; overflow:hidden;">
            <Col span="14" style="height:100%">
            <Row :gutter="18" style=" overflow-y: auto;max-height:100%">
              <Col style="min-height:79px" :span="12" v-for="(n,i) in fieldData" :key="i + 3.26" v-if="n.SysField !='WorkSubject' && n.SysField !='WorkDetail' && n.SysField != 'WorkStatus' && n.FieldId!=='110' && n.FieldId!=='111'">
              <FormItem :label="n.FieldName + '：'" :prop="n.FieldId">
                <Input v-if="n.FieldType == 'input' || n.FieldType == 'number'　|| n.FieldType == 'regular'　|| n.FieldType == 'url'　|| n.FieldType == 'tel'　|| n.FieldType == 'phone'　|| n.FieldType == 'ip'　|| n.FieldType == 'email'" :placeholder="'请填写' + n.FieldName" v-model="orderForm[n.FieldId]" @on-blur="inputChange(n.FieldId)"></Input>
                <Input v-if="n.FieldType == 'textarea'" type="textarea" :autosize="{minRows: 3,maxRows: 20}" :placeholder="'请填写' + n.FieldName" v-model="orderForm[n.FieldId]" @on-blur="inputChange(n.FieldId)"></Input>
                <RadioGroup v-if="n.FieldType == 'radio'" v-model="orderForm[n.FieldId]" @on-change="v=>{ moreChange(v,n.FieldId,'radio')}">
                  <Radio v-for="(k,j) in n.options" :key="j + 2.56" :label="j + ''">{{k.value}}</Radio>
                </RadioGroup>
                <CheckboxGroup v-if="n.FieldType == 'checkbox'" v-model="orderForm[n.FieldId]" @on-change="v=>{ moreChange(v,n.FieldId,'checkbox')}">
                  <Checkbox v-for="(g,h) in n.options" :key="h + 6.26" :label="h + ''">{{g.value}}</Checkbox>
                </CheckboxGroup>
                <Select v-if="n.FieldType == 'select'" v-model="orderForm[n.FieldId]" :placeholder="'请选择' + n.FieldName" @on-change="v=>{ moreChange(v,n.FieldId,'select')}">
                  <Option v-for="(d,f) in n.options" :key="f + 6.26" :value="f + ''">{{d.value}}</Option>
                </Select>
                <Select v-if="n.FieldType == 'multipleselect'" multiple v-model="orderForm[n.FieldId]" :placeholder="'请选择' + n.FieldName" @on-change="v=>{ moreChange(v,n.FieldId,'multipleselect')}">
                  <Option v-for="(d,f) in n.options" :key="f + ''" :value="f + ''">{{d.value}}</Option>
                </Select>
                <Cascader v-if="n.FieldType == 'cascader'" :data="n.options" v-model="orderForm[n.FieldId]" @on-change="(v,d)=>{ moreChange(v,n.FieldId,'cascader',d)}"></Cascader>
                <DatePicker v-if="n.FieldType == 'time' ||　n.FieldType == 'timerange'　" format="yyyy-MM-dd" :type="n.Checked" :placeholder="'请选择' + n.FieldName" v-model="orderForm[n.FieldId]" @on-change="v=>{ moreChange(v,n.FieldId,n.FieldType)}">
                </DatePicker>
              </FormItem>
              </Col>
            </Row>
            </Col>
            <Col span="10" style=" overflow-y: auto;max-height:100%">
            <div class="reply_item">
              <h3>
                <Icon type="android-star-outline" size="20" style="vertical-align: middle;margin-right: 10px;"></Icon>{{processData.WorkSubject}}</h3>
              <p>{{processData.CreatTime}} | {{processData.CustName}}
                <span class="phone_number">{{processData.CustPhone}}</span>
                <!-- < <Icon type="ios-telephone"></Icon><span @click="callclick">{{processData.CustPhone}}</span>   > -->
                <!-- <span @click="hangup">挂机</span> -->
                <el-button type="success" style="margin-left: 30px;" plain icon="el-icon-phone" size="mini" :title="processData.CustPhone" @click="callclick">拨打电话</el-button>
                <el-button type="warning" icon="el-icon-remove-outline" plain size="mini" @click="hangup">挂机</el-button>
                <el-button type="info" size="mini" icon="el-icon-setting" plain title="点击进行修改" @click="callModal=true">{{ caller }}
                </el-button>
              </p>
            </div>
            <div class="reply_item desc_item_box">
              <div class="desc_hadle_box">
                <el-upload class="upload-box" ref="upload" action="/apiweb/upload/UploadFiles" :limit="3" :data="orderForm" :show-file-list="false" :http-request="getImgList" multiple>
                  <Button icon="android-upload" size="large" class="unpload_bth">上传文件</Button>
                </el-upload>
              </div>
              <Input type="textarea" class="desc_textarea" v-model="reply" clearable :autosize="{minRows: 3,maxRows: 12}" placeholder="请在此输入消息..."></Input>
            </div>
            <FormItem label="处理结果" prop="110" v-if="fieldData[15]">
              <Cascader :data="fieldData[15].options" v-model="orderForm['110']" @on-change="(v,d)=>{ moreChange(v,'110','cascader',d)}"></Cascader>
            </FormItem>
            <FormItem label="结果说明" prop="111" v-if="fieldData[16]">
              <Input type="textarea" :autosize="{minRows: 3,maxRows: 20}" placeholder="请填写处理结果说明" v-model="orderForm['111']" @on-blur="inputChange('111')" />
            </FormItem>
            <div class="reply_item">
              <Row :gutter="16">
                <Col span="12">
                <el-button-group class="reply_box" v-if="process==0">
                  <div class="reply_class" id v-if="isReplyClass">
                    <p @click="btnOk(2)">抢单并处理完毕</p>
                    <p @click="btnOk(3)">回复</p>
                  </div>
                  <el-button type="primary" style="padding: 12px 36px;letter-spacing: 4px;" @click="btnOk(1)">抢单</el-button>
                  <el-button type="primary" :icon="isReplyClass ? 'el-icon-caret-top':'el-icon-caret-bottom'" v-on:blur.native="btnBlur" @click="isReplyClass = !isReplyClass"></el-button>
                </el-button-group>
                <el-button-group class="reply_box" v-if="process==1">
                  <el-button type="primary" style="padding: 12px 36px;letter-spacing: 4px;" @click="btnOk(3)">回复</el-button>
                  <!-- <el-button type="primary" :icon="isReplyClass ? 'el-icon-caret-top':'el-icon-caret-bottom'" v-on:blur.native="btnBlur" @click="isReplyClass = !isReplyClass"></el-button> -->
                </el-button-group>
                <el-button-group class="reply_box" v-if="process==2">
                  <div class="reply_class" id v-if="isReplyClass">
                    <p @click="btnOk(4)">工单处理完毕</p>
                    <p @click="btnOk(5)">移交</p>
                  </div>
                  <el-button type="primary" style="padding: 12px 36px;letter-spacing: 4px;" @click="btnOk(3)">回复</el-button>
                  <el-button type="primary" :icon="isReplyClass ? 'el-icon-caret-top':'el-icon-caret-bottom'" v-on:blur.native="btnBlur" @click="isReplyClass = !isReplyClass"></el-button>
                </el-button-group>
                </Col>
                <Col span="12">
                <ul class="el-upload-list el-upload-list--text">
                  <li class="el-upload-list__item is-success" v-for="(item,index) in imgListData" :key="index">
                    <a class="el-upload-list__item-name">
                      <i class="el-icon-document"></i>{{item.FileName}}
                    </a>
                    <label class="el-upload-list__item-status-label">
                      <i class="el-icon-upload-success el-icon-circle-check"></i>
                    </label>
                    <i class="el-icon-close" @click="delImg(index)"></i>
                  </li>
                </ul>
                </Col>
              </Row>
            </div>
            <div class="reply_item relpay_tab">
              <Tabs type="card">
                <TabPane label="全部">
                  <div class="list_item" v-for="(item,index) in dealData" :key="index">
                    <div class="sys-item" v-if="item.DealType == 2">
                      <span class="sys_msg">{{item.DealDate}}&nbsp;&nbsp;{{item.DealUser}}&nbsp;&nbsp;{{item.OperaType}} : &nbsp;&nbsp;{{item.AddField}}&nbsp;&nbsp;
                        <del>{{item.SubField}}</del>
                      </span>
                    </div>
                    <div class="reply-item" v-if="item.DealType == 1">
                      <Avatar class="user_photo" size="large" :src="item.UserPhoto || '/static/img/default_img.jpg'" />
                      <p class="user_title_msg">
                        <span class="user_name">{{item.DealUser}}</span>{{item.DealDate}}</p>
                      <div class="reply_content">
                        <span class="content_detail" :class="{'mine_color':item.UserId == 1,'oter_color':item.UserId == 2}">{{item.Replay}}</span>
                      </div>
                    </div>
                  </div>
                </TabPane>
                <TabPane label="仅回复">
                  <div class="list_item" v-for="(item,index) in dealData" :key="index">
                    <div class="reply-item" v-if="item.DealType == 1">
                      <Avatar class="user_photo" size="large" :src="item.UserPhoto || '/static/img/default_img.jpg'" />
                      <p class="user_title_msg">
                        <span class="user_name">{{item.DealUser}}</span>{{item.DealDate}}</p>
                      <div class="reply_content">
                        <span class="content_detail" :class="{'mine_color':item.UserId == 1,'oter_color':item.UserId == 2}">{{item.Replay}}</span>
                      </div>
                    </div>
                  </div>
                </TabPane>
                <TabPane label="时间轴" style="padding-left: 18px;">
                  <Timeline>
                    <TimelineItem v-for="(item,index) in timeLineData" :key="index">
                      <p class="time">{{item.OperTime}}</p>
                      <p class="content">{{item.OperaUser}}&nbsp;&nbsp;{{item.OperType}} : &nbsp;&nbsp;{{item.next}}</p>
                    </TimelineItem>
                  </Timeline>
                </TabPane>
                <TabPane label="历史录音" class="pane_attachment">
                  <MarkRecordsLog :workId="WorkTotalId" ref="MarkRecordsLog"></MarkRecordsLog>
                </TabPane>
                <TabPane label="营销录音" class="pane_attachment">
                  <MarkRecords :phone="processData.CustPhone" canCopy canPlay></MarkRecords>
                </TabPane>
                <TabPane label="附件" class="pane_attachment">
                  <div class="list_item" v-for="(item,index) in fileData" :key="index">
                    <div class="reply-item file_item">
                      <Avatar class="user_photo" size="large" :src="item[0].UserImage || '/static/img/default_img.jpg'" />
                      <p class="user_title_msg">
                        <span class="user_name">{{item[0].UserName}}</span>{{item[0].ReplyTime}}</p>
                      <div class="reply_content" v-for="(child,idx) in item">
                        <p class="fiel_line">
                          <Icon style="margin-right: 10px;" type="document"></Icon>
                          <a title="点击下载文件以查看" :href="child.FileAddr" :download="child.FileName">{{child.FileName}}</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </TabPane>
              </Tabs>
            </div>
            </Col>
          </Row>
        </Form>
      </div>
    </Card>
    <Modal v-model="selectModal" :styles="{'height':'400px'}">
      <h3 slot="header" style="color:#2D8CF0">请选择移交人</h3>
      <Form>
        <FormItem>
          <Cascader :data="dealList" v-model="dealing" :change-on-select="true" @on-change="selectChange" filterable></Cascader>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="selectModal=false">取消</Button>
        <Button type="primary" @click="workNextProcess">保存</Button>
      </div>
    </Modal>
    <Modal v-model="callModal" @on-ok="editcaller">
      <AutoComplete v-model="newcaller" :data="autodata" @on-search="handleAuto"></AutoComplete>
    </Modal>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import MarkRecords from '../component/MarkRecords'
import MarkRecordsLog from '../component/MarkRecordsLog'
import { handleFrom, handleData } from '@/views/client/clientlist/clientlist.js'
export default {
  name: 'worksheetoper',
  data() {
    return {
      reset: 0,
      boxHeight: '500px',
      reply: '', // 回复消息
      resetData: {}, // 表单初始化数据
      fieldData: [], //请求字段数据
      savePassLoading: false, // 保存loading
      orderForm: {}, // 表单数据
      ruleNewOrder: {}, // 验证规则
      isReplyClass: false, //提交顶部弹出
      otherField: [], // 其他字段
      loading1: false, // select远程搜索loading控制
      dealList: [], // 处理人列表
      formData: {}, // 新增客户表单
      selectedData: [], //级联选择的data
      imgListData: [], // 当前要上传到服务器的文件数据
      process: -1, // 当前流程到组或人（0为组，1为人）
      skay: '',
      callcode: '',
      dealData: [],
      fileData: [],
      timeLineData: [],
      processData: {},
      WorkTotalId: '',
      flagChange: false, // 标记，不让change一上来就触发
      selectModal: false, // 弹出选择组/人
      dealing: [], //处理人id
      caller: '', //  主叫号码
      newcaller: '',
      autodata: [],
      callModal: false
    }
  },
  components: {
    MarkRecords,
    MarkRecordsLog
  },
  computed: {
    getcallcode() {
      return this.$store.state.page.callcode
    }
  },
  watch: {
    getcallcode(code) {
      if (!!code) {
        this.callcode = code
        this.saveworkRecordSave()
      } else {
        if (!!this.callcode) {
          this.updateworkRecordSave(this.callcode)
        }
      }
    },
    $route(to, from) {
      if (to.name === 'worksheetoper' && this.WorkTotalId !== to.params.id) {
        let vm = this
        this.flagChange = false
        this.WorkTotalId = this.$route.params.id
        this.boxHeight = window.innerHeight - 210 + 'px'
        this.getCustInit() // 获取客户表单数据和处理人
        this.getOrderForm().then(() => {
          vm.setOrderForm()
        }) // 获取表单数据
        this.getWorkProcess() // 获取工单流程信息
        this.getworkReplyEdit() // 获取回复与操作记录
        this.getworkfileList() // 获取附件记录
        this.getworktimeLineList() //获取时间轴记录
        this.skay = this.$store.state.page.skay
        this.getCaller()
      }
    }
  },
  methods: {
    handleAuto(value) {
      this.autodata = []
      if (!!value && value.length < 11) {
        for (let i = 6; i < 9; i++) {
          let t = value
          while (t.length < 11) {
            t += i
          }
          this.autodata.push(t)
        }
      }
    },
    hangup() {
      this.skay.oSipHangUp()
    },
    callclick() {
      if (!!this.processData.CustPhone && !!this.orderForm['141']) {
        const h = this.$createElement
        const _this = this
        const msgbox = this.$msgbox({
          title: '选择要呼叫的号码',
          message: h('div', {}, [
            h(
              'Button',
              {
                props: { type: 'primary' },
                on: {
                  click: () => {
                    _this.skay.oSipCall(_this.processData.CustPhone)
                    _this.$msgbox.close()
                  }
                }
              },
              '主要：' + _this.processData.CustPhone
            ),
            h(
              'Button',
              {
                props: { type: 'primary' },
                style: { 'margin-left': '15px' },
                on: {
                  click: () => {
                    _this.skay.oSipCall(_this.orderForm['141'])
                    _this.$msgbox.close()
                  }
                }
              },
              '次要：' + _this.orderForm['141']
            )
          ]),
          showConfirmButton: false,
          showCancelButton: true
        })
      } else if (!!this.processData.CustPhone) {
        this.skay.oSipCall(this.processData.CustPhone)
      } else {
        this.message.warning('号码不存在!')
      }
    },
    getOrderForm() {
      let vm = this
      // 请求动态表单字段
      return new Promise((resolve, reject) => {
        this.axios
          .get('/apiweb/work/WorkListForm', {
            params: {
              FlagId: 1
            }
          })
          .then(res => {
            // console.log(res.data);
            vm.fieldData = res.data
            let nowFileData = JSON.parse(JSON.stringify(res.data))
            // 设置动态form的modal 和 rule
            let handleData = handleFrom(nowFileData)
            //   vm.orderForm = handleData[0].concat(vm.orderForm);
            vm.orderForm = handleData[0]
            vm.ruleNewOrder = handleData[1]
            // vm.ruleNewOrder = handleData[1]; // 将处理后的验证规则传到data中
            vm.otherField = handleData[2]
            // console.log(vm.orderForm);
            // console.log(vm.ruleNewOrder);
            resolve()
          })
          .catch(function(err) {
            console.log(err)
            reject(err)
          })
      })
    },
    btnBlur() {
      let vm = this
      // console.log("按钮失去焦点");
      setTimeout(function() {
        vm.isReplyClass = false
      }, 200)
    },
    getCustInit() {
      let vm = this
      // 获取用户组列表
      this.axios
        .get('/apiweb/work/WorkGroupUserList', {
          params: {}
        })
        .then(res => {
          // console.log(res.data);
          vm.dealList = res.data
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getImgList(obj) {
      // console.log(obj);
      let vm = this
      let formData = new FormData()
      formData.set('file', obj.file)
      this.axios({
        url: '/apiweb/upload/UploadFiles',
        method: 'post',
        onUploadProgress: function(progressEvent) {
          //原生获取上传进度的事件
          if (progressEvent.lengthComputable) {
            //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
            //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
            console.log(progressEvent)
            // _this.$nextTick(() => {
            //   _this.precent = loaded / total * 100;
            // });
          }
        },
        data: formData
      })
        .then(res => {
          console.log(res.data)
          vm.imgListData.push(res.data)
          let mowData = vm.imgListData.splice(0)
          vm.$nextTick(function() {
            vm.imgListData = mowData
            console.log(vm.imgListData)
          })
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    delImg(i) {
      let vm = this
      this.$confirm('此操作将删除当前上传的文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          vm.imgListData.splice(i, 1)
          let mowData = vm.imgListData.splice(0)
          vm.$nextTick(function() {
            vm.imgListData = mowData
            vm.$message.success('删除成功！')
            // console.log(vm.imgListData);
          })
        })
        .catch(() => {})
    },
    selectChange(val, data) {
      console.log(data)
      this.dealing = val
      this.selectedData = data
      // 处理人change事件,上面的是其它业务逻辑，不用动
      // console.log(val);
      // console.log(data);
      // this.saveItemValue({})
    },
    inputChange(id) {
      // input 输入框提交事件
      // console.log(id);
      // 根据传入的id来获取当前input输入框的数据并提交给后台
      let vm = this
      vm.$refs['orderForms'].validate(valid => {
        if (valid) {
          let inputValue = vm.orderForm[id] //值
          // console.log(inputValue);
          let itemData = vm.fieldData.find(item => item.FieldId == id)
          if (itemData) {
            itemData['FieldMemo'] = inputValue
            // console.log(itemData);
            // 将id和当前要修改的值传入保存函数
            let oldVal = JSON.parse(
              JSON.stringify(vm.resetData[itemData.FieldId])
            )
            let nowVal = JSON.parse(JSON.stringify(inputValue))
            // console.log(oldVal);
            // console.log(nowVal);
            if (oldVal !== nowVal) {
              vm.saveItemValue(itemData)
            }
          } else {
            console.log(
              '使用当前item的id无法在this.fieldData中找到数据，请检查后台发送的数据或检查clientlist.js的处理过程'
            )
          }
        } else {
          vm.$message.warning('无法保存，请检查输入的值是否符合条件！')
        }
      })
    },
    moreChange(...arr) {
      let vm = this
      if (!this.flagChange) {
        return
      }
      vm.$refs['orderForms'].validate(valid => {
        if (valid) {
          // 将当前更改的值赋值给orderForm,同步更新防止出错
          vm.orderForm[arr[1]] = arr[0]
          // console.log(arr); // 第一项为当前组件的change事件回调值，第二项为当前项的id,第三项为当前的类型
          let itemData = vm.fieldData.find(item => item.FieldId == arr[1])
          itemData = JSON.parse(JSON.stringify(itemData))
          itemData['FieldMemo'] = arr[0]
          // if (arr[2] == "radio" || arr[2] == 'select') {
          //   itemData["FieldMemo"] = arr[0];
          // } else {
          itemData['Checked'] = arr[0]
          // }
          // 将id和当前要修改的值传入保存函数
          // console.log(itemData);
          vm.saveItemValue(itemData)
        } else {
          vm.$message.warning('无法保存，请检查输入的值是否符合条件！')
        }
      })
    },
    btnOk(a) {
      let vm = this
      if (vm.savePassLoading) {
        return
      }
      // 各种不同类型的回复
      if (vm.reply == '' && a != 1 && a != 2 && a != 5) {
        vm.$message.warning('请输入回复内容!')
        return
      }
      vm.savePassLoading = true
      if (a == 1) {
        // a为2 所有人 回复按钮
        //console.log("点击了抢单按钮");
        vm.saveworkRobbing()
      } else if (a == 2) {
        // a为2 所有人 回复按钮
        //console.log("点击了抢单并处理完毕按钮");
        vm.savewordRobFinish()
      } else if (a == 3) {
        // a为2 所有人 回复按钮
        //console.log("点击了回复按钮");
        vm.saveworkReply()
      } else if (a == 4) {
        // a为2 所有人 回复按钮
        //console.log("点击了工单处理完毕按钮");
        vm.saveworkFinish()
      } else if (a == 5) {
        // a为2 所有人 回复按钮
        console.log('点击了移交按钮')
        vm.dealing = []
        vm.selectModal = true
        vm.savePassLoading = false
      }
    },
    saveworkReply() {
      let vm = this
      this.axios
        .post('/apiweb/work/workReply', {
          workid: vm.WorkTotalId,
          msg: vm.reply,
          record: vm.callcode,
          fileData: vm.imgListData.length == 0 ? '' : vm.imgListData
        })
        .then(res => {
          if (res.data.ok) {
            vm.pageInit()
            //console.log(res.data);
            vm.savePassLoading = false
            vm.$message.success('保存成功')
            this.clearForm()
          } else {
            vm.$message.error(res.data.msg)
          }
        })
        .catch(function(err) {
          vm.$message.error('保存失败！')
          vm.savePassLoading = false
          console.log(err)
        })
    },
    workNextProcess() {
      let vm = this
      console.log(vm.selectedData)
      let len = vm.selectedData.length
      let nextid = vm.selectedData[len - 1].id
      let nextflag = vm.selectedData[len - 1].Flag
      this.axios
        .post('/apiweb/work/workNextProcess', {
          workid: vm.WorkTotalId,
          msg: vm.reply,
          record: vm.callcode,
          nextid: nextid,
          nextflag: nextflag,
          fileData: vm.imgListData.length == 0 ? '' : vm.imgListData,
          rnd: Math.random()
        })
        .then(res => {
          if (res.data.ok) {
            vm.pageInit()
            //console.log(res.data);
            vm.$message.success('保存成功')
            this.clearForm()
            vm.selectModal = false
          } else {
            vm.$message.error(res.data.msg)
          }
        })
        .catch(function(err) {
          vm.$message.error('保存失败！')
          vm.selectModal = false
          console.log(err)
        })
    },
    saveworkFinish() {
      let vm = this
      this.axios
        .post('/apiweb/work/workFinish', {
          workid: vm.WorkTotalId,
          msg: vm.reply,
          record: vm.callcode,
          fileData: vm.imgListData.length == 0 ? '' : vm.imgListData,
          rnd: Math.random()
        })
        .then(res => {
          if (res.data.ok) {
            vm.pageInit()
            //console.log(res.data);
            vm.savePassLoading = false
            vm.$message.success('保存成功')
            this.clearForm()
          } else {
            vm.$message.error(res.data.msg)
          }
        })
        .catch(function(err) {
          vm.$message.error('保存失败！')
          vm.savePassLoading = false
          console.log(err)
        })
    },
    saveworkRobbing() {
      let vm = this
      this.axios
        .post('/apiweb/work/workRobbing', {
          workid: vm.WorkTotalId,
          msg: vm.reply,
          record: vm.callcode,
          fileData: vm.imgListData.length == 0 ? '' : vm.imgListData,
          rnd: Math.random()
        })
        .then(res => {
          if (res.data.ok) {
            vm.pageInit()
            //console.log(res.data);
            vm.savePassLoading = false
            vm.$message.success('保存成功')
            this.clearForm()
          } else {
            vm.pageInit()
            vm.$message.error(res.data.msg)
            this.clearForm()
          }
        })
        .catch(function(err) {
          vm.$message.error('保存失败！')
          vm.savePassLoading = false
          console.log(err)
        })
    },
    savewordRobFinish() {
      let vm = this
      this.axios
        .post('/apiweb/work/wordRobFinish', {
          workid: vm.WorkTotalId,
          msg: vm.reply,
          record: vm.callcode,
          fileData: vm.imgListData.length == 0 ? '' : vm.imgListData,
          rnd: Math.random()
        })
        .then(res => {
          if (res.data.ok) {
            vm.pageInit()
            //console.log(res.data);
            vm.savePassLoading = false
            vm.$message.success('保存成功')
            this.clearForm()
          } else {
            vm.$message.error(res.data.msg)
          }
        })
        .catch(function(err) {
          vm.$message.error('保存失败！')
          vm.savePassLoading = false
          console.log(err)
        })
    },
    saveworkRecordSave() {
      let vm = this
      this.axios
        .post('/apiweb/work/workRecordSave', {
          workid: vm.WorkTotalId,
          callcode: vm.callcode,
          rnd: Math.random()
        })
        .then(res => {
          console.log(res.data)
        })
        .catch(function(err) {
          vm.$message.error('录音记录保存失败！')
          console.log(err)
        })
    },
    updateworkRecordSave(code) {
      let vm = this
      this.axios
        .post('/apiweb/work/workRecordUpdate', {
          workid: vm.WorkTotalId,
          callcode: code,
          rnd: Math.random()
        })
        .then(res => {
          vm.$refs.MarkRecordsLog.getlist()
        })
        .catch(function(err) {
          vm.$message.error('录音记录获取失败！')
          console.log(err)
        })
    },
    saveItemValue(result) {
      let vm = this
      let data = JSON.parse(JSON.stringify(result))
      let nowId = data.FieldId
      let nowVal = data.FieldName
      // console.log(data);
      // console.log(vm.WorkTotalId);
      let sendData = {
        objectData: data, //数据体
        WorkTotalId: this.WorkTotalId //工单id
      }
      // console.log(sendData);
      this.axios
        .post('/apiweb/work/UpdateWork', sendData)
        .then(res => {
          console.log(res.data)
          if (res.data.ok) {
            vm.$message.success(res.data.msg)
            // 修改了，更新校对数据
            vm.resetData[nowId] = nowVal
            // 更新右侧
            vm.getworkReplyEdit()
          } else {
            vm.$message.error(res.data.msg)
          }
        })
        .catch(function(err) {
          vm.$message.error('保存失败！')
          console.log(err)
        })
    },
    setOrderForm() {
      // 设置工单form
      let vm = this
      this.axios
        .get('/apiweb/work/GetWorkDetail', {
          params: {
            FlagId: 2,
            WorkTotalId: vm.WorkTotalId
          }
        })
        .then(res => {
          console.log(res.data)
          vm.$nextTick(() => {
            for (var i = 0; i < res.data.length; i++) {
              if (
                res.data[i].FieldType == 'select' ||
                res.data[i].FieldType == 'radio' ||
                res.data[i].FieldType == 'time'
              ) {
                vm.orderForm[res.data[i].FieldId] = res.data[i].Checked
              } else if (
                res.data[i].FieldType == 'multipleselect' ||
                res.data[i].FieldType == 'cascader' ||
                res.data[i].FieldType == 'checkbox' ||
                res.data[i].FieldType == 'timerange'
              ) {
                if (res.data[i].Checked != '' && res.data[i].Checked != null) {
                  vm.orderForm[res.data[i].FieldId] = eval(res.data[i].Checked)
                } else {
                  vm.orderForm[res.data[i].FieldId] = []
                }
              } else {
                vm.orderForm[res.data[i].FieldId] = res.data[i].FieldMemo
              }
            }
            vm.resetData = JSON.parse(JSON.stringify(vm.orderForm))
          })
          //console.log(vm.orderForm);
          setTimeout(() => {
            vm.flagChange = true
          }, 200)
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getWorkProcess() {
      //获取工单流程信息
      let vm = this
      this.axios
        .get('/apiweb/work/workProcessDetail', {
          params: {
            workId: vm.WorkTotalId
          }
        })
        .then(res => {
          //console.log(res.data);
          vm.processData = res.data
          if (res.data.DealStatus == 1) {
            vm.process = 1
          } else if (res.data.DealFlag == '0') {
            vm.process = 0
          } else {
            if (res.data.DealId != Cookies.get('yh_web_UserId')) {
              vm.process = 1
            } else {
              vm.process = 2
            }
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getworkReplyEdit() {
      //获取回复与操作记录
      let vm = this
      this.axios
        .get('/apiweb/work/workReplyEditList', {
          params: {
            workId: vm.WorkTotalId
          }
        })
        .then(res => {
          //console.log(res.data);
          vm.dealData = res.data
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getworktimeLineList() {
      //获取回复与操作记录
      let vm = this
      this.axios
        .get('/apiweb/work/worktimeLineList', {
          params: {
            workId: vm.WorkTotalId
          }
        })
        .then(res => {
          //console.log(res.data);
          vm.timeLineData = res.data
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getworkfileList() {
      //获取回复与操作记录
      let vm = this
      this.axios
        .get('/apiweb/work/workfileList', {
          params: {
            workId: vm.WorkTotalId
          }
        })
        .then(res => {
          //console.log(res.data);
          vm.fileData = res.data
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    pageInit() {
      this.getWorkProcess() // 获取工单流程信息
      this.getworkReplyEdit() // 获取回复与操作记录
      this.getworkfileList() // 获取附件记录
      this.getworktimeLineList() //获取时间轴记录
    },
    clearForm() {
      this.reply = ''
      this.callcode = ''
      this.imgListData = []
    },
    getCaller() {
      //  获取当前主叫
      this.axios
        .get('/apiwss/system/getcaller', {
          params: {
            id: Cookies.get('yh_web_UserCode'),
            comId: Cookies.get('yh_web_ComCode')
          }
        })
        .then(res => {
          if (res.data.code === '200') {
            this.caller = res.data.data.caller
            this.newcaller = this.caller
          } else {
            console.log('未获取到主叫号码')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    editcaller() {
      this.axios
        .post('/apiwss/system/updatecaller', {
          caller: this.newcaller,
          id: Cookies.get('yh_web_UserCode'),
          comId: Cookies.get('yh_web_ComCode')
        })
        .then(res => {
          if (res.data.code === '200') {
            this.$message.success(res.data.msg)
            this.getCaller()
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('操作失败！')
        })
    }
  },
  mounted() {
    let vm = this
    this.WorkTotalId = this.$route.params.id
    this.boxHeight = window.innerHeight - 210 + 'px'
    this.getCustInit() // 获取客户表单数据和处理人
    this.getOrderForm().then(() => {
      vm.setOrderForm()
    }) // 获取表单数据
    this.getWorkProcess() // 获取工单流程信息
    this.getworkReplyEdit() // 获取回复与操作记录
    this.getworkfileList() // 获取附件记录
    this.getworktimeLineList() //获取时间轴记录
    this.skay = this.$store.state.page.skay
    this.getCaller()
  }
}
</script>
