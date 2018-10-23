<style lang="less">
@import './myself.less';
</style>
<template>
  <div class="contener">
    <el-card class="box-card1">
      <div class="img-box" @click="cropperModal = true">
        <Avatar class="my-photo" :src="userImg" />
        <p style="text-align: center; padding-top: 6px; color:#2b85e4;">更换头像</p>
      </div>
      <div class="msg-box">
        <h3>{{formValidate.name}}</h3>
        <p>{{formValidate.desc == null || formValidate.desc == "" ? "无" : formValidate.desc}}</p>
      </div>
    </el-card>
    <el-card class="box-card2">
      <Tabs value="name1">
        <TabPane label="个人资料" name="name1">
          <Row class="my-msg">
            <Col span="16" offset="4">
            <Form ref="myselfForm" :model="formValidate" :rules="ruleValidate" :label-width="100">
              <FormItem v-show="idedit" label="姓名：" prop="name">
                <Input v-model="formValidate.name" placeholder="请填写你的姓名"></Input>
              </FormItem>
              <FormItem v-show="!idedit" label="姓名：">
                <span class="static-msg">{{ formValidate.name }}</span>
              </FormItem>
              <FormItem v-show="idedit" label="手机号码：" prop="cellphone">
                <div>
                  <Input v-model="formValidate.cellphone"></Input>
                </div>
              </FormItem>
              <FormItem v-show="!idedit" label="手机号码：">
                <span class="static-msg">{{ formValidate.cellphone }}</span>
              </FormItem>
              <FormItem v-show="idedit" label="邮箱：" prop="mail">
                <Input v-model="formValidate.mail" placeholder="请填写电子邮箱"></Input>
              </FormItem>
              <FormItem v-show="!idedit" label="邮箱：">
                <span class="static-msg">{{formValidate.mail}}</span>
              </FormItem>
              <FormItem v-show="idedit" label="昵称：" prop="nickname">
                <Input v-model="formValidate.nickname" placeholder="请填写你的昵称"></Input>
              </FormItem>
              <FormItem v-show="!idedit" label="昵称：">
                <span class="static-msg">{{ formValidate.nickname }}</span>
              </FormItem>
              <FormItem v-show="idedit" label="签名：">
                <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请填写您的签名"></Input>
              </FormItem>
              <div class="edit-btn" v-show="!idedit">
                <Button type="ghost" @click="toggleEdit(1)">编辑</Button>
              </div>
              <div v-show="idedit" style="padding-left: 100px;">
                <Button type="text" style="width: 100px;" @click="toggleEdit(2)">取消</Button>
                <Button type="primary" style="width: 100px;" :loading="save_loading" @click="saveEdit">保存</Button>
              </div>
            </Form>
            </Col>
          </Row>
        </TabPane>
        <TabPane label="个人操作日志" name="name2">
          <Row>
            <Col span="24">
            <Table stripe :columns="columns1" height="440" width="100%" :data="data1" style="margin-bottom: 30px;"></Table>
            <div style="text-align: right; padding-right: 20px;">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentpage" background :page-sizes="[10, 20, 30, 40]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="joutotal">
              </el-pagination>
            </div>
            </Col>
          </Row>
        </TabPane>
        <!-- <TabPane label="个人字段扩展" name="name3">
                    <Row>
                        <Col span="24">
                            <div style="margin-bottom: 20px;">
                                <Button type="success" icon="plus">新增</Button>&nbsp;&nbsp;&nbsp;<Button type="info" icon="compose">编辑</Button>&nbsp;&nbsp;&nbsp;<Button type="error" icon="trash-b">删除</Button>
                            </div>
                            <Table stripe :columns="columns1" height="420"  width="100%" :data="data1" style="margin-bottom: 30px;"></Table>
                            <el-pagination
                              @size-change="handleSizeChange"
                              @current-change="handleCurrentChange"
                              :current-page="currentpage"
                              background
                              :page-sizes="[10, 20, 30, 40]"
                              :page-size="pagesize"
                              layout="total, sizes, prev, pager, next, jumper"
                              :total="joutotal">
                            </el-pagination>
                        </Col>
                    </Row>
                </TabPane> -->
      </Tabs>
    </el-card>
    <Modal v-model="cropperModal" width="860" class-name="none-footer" title="更换头像">
      <div style="padding-bottom: 30px;">
        <div class="cropper-content">
          <div class="cropper">
            <vueCropper ref="cropper" :img="option.img" :outputSize="option.size" :outputType="option.outputType" :info="true" :full="option.full" :canMove="option.canMove" :canMoveBox="option.canMoveBox" :original="option.original" :autoCrop="option.autoCrop" :autoCropWidth="option.autoCropWidth" :autoCropHeight="option.autoCropHeight" :fixedBox="option.fixedBox" @realTime="realTime" @imgLoad="imgLoad"></vueCropper>
          </div>
          <div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}">
            <div :style="previews.div" class="preview">
              <img :src="previews.url" :style="previews.img">
            </div>
          </div>
        </div>

        <div class="footer-btn">
          <div class="scope-btn">
            <label class="btn" for="uploads">选择图片</label>
            <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
            <Button type="ghost" @click="changeScale(1)" icon="plus-round"></Button>
            <Button type="ghost" @click="changeScale(-1)" icon="minus-round"></Button>
            <Button type="ghost" @click="rotateLeft"><span style="font-weight: 600;">↺</span></Button>
            <Button type="ghost" @click="rotateRight"><span style="font-weight: 600;">↻</span></Button>
          </div>
          <div class="upload-btn">
            <Button type="primary" style="margin-left: 46px;" @click="down('update')">上传头像</Button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import VueCropper from 'vue-cropper'
export default {
  name: 'myself',
  components: {
    VueCropper
  },
  computed: {
    avatorPath() {
      return localStorage.avatorImgPath
    }
  },
  data() {
    let vm = this
    const validePhone = (rule, value, callback) => {
      var re = /^1[0-9]{10}$/
      if (!re.test(value)) {
        callback(new Error('请输入正确格式的手机号'))
      }
      if (vm.oldPhone == value) {
        return callback()
      }
      this.axios
        .get('/apiweb/user/CheckUserPhone', { params: { UserPhone: value } })
        .then(res => {
          // console.log(res.data);
          if (!res.data.ok) {
            callback(new Error(res.data.msg))
          } else {
            callback()
          }
        })
        .catch(res => {
          callback(new Error('验证失败！'))
        })
    }
    return {
      idedit: false,
      save_loading: false,
      oldPassError: '',
      cropperModal: false, // 弹出modal
      oldPhone: '', // 用户电话
      formValidate: {
        name: '', // 名字
        cellphone: '', //电话号码
        desc: '', // 签名
        nickname: '', // 昵称
        mail: '' // 邮箱
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }
        ],
        nickname: [
          {
            required: false,
            message: '昵称不能为空',
            trigger: 'blur'
          }
        ],
        cellphone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validePhone }
        ],
        mail: [
          { type: 'email', message: '不正确的电子邮件格式', trigger: 'blur' }
        ],
        desc: [
          {
            required: false,
            message: '请填写你的签名',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 16,
            message: '不少于16字',
            trigger: 'blur'
          }
        ]
      },
      columns1: [
        // thead
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '操作人',
          key: 'UserName'
        },
        {
          title: '操作对象',
          key: 'LogObject'
        },
        {
          title: '操作类型',
          key: 'LogType'
        },
        {
          title: '操作内容',
          key: 'LogDes'
        }
      ],
      data1: [],
      currentpage: 1, // 当前页码
      pagesize: 10, // 一页多少条
      joutotal: 0,
      ComId: Cookies.get('yh_web_ComId'), // 公司id,后期通过store获取
      userId: Cookies.get('yh_web_UserId'), // 当前用户Id
      userImg: Cookies.get('yh_web_UserImage'), // 当前用户头像
      crap: false,
      previews: {},
      option: {
        img: '',
        size: 1,
        full: false, // 输出原图比例截图 props名full
        outputType: 'png',
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: true
      },
      downImg: '#'
    }
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Message.success('Success!')
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    handleReset(name) {
      this.$refs[name].resetFields()
    },
    //编辑个人中心信息
    saveEdit() {
      this.$refs['myselfForm'].validate(valid => {
        if (valid) {
          let vm = this
          let UserName = this.formValidate.name //姓名
          let UserPhone = this.formValidate.cellphone //手机号码
          let UserMail = this.formValidate.mail //邮箱
          let UserNick = this.formValidate.nickname //昵称
          let UserSign = this.formValidate.desc //签名
          let UpdateId = '1' //修改人

          this.axios
            .get('/apiweb/user/UserUpdate', {
              params: {
                UserID: vm.userId,
                ComId: vm.ComId,
                UserName: UserName,
                UserPhone: UserPhone,
                UserMail: UserMail,
                UserNick: UserNick,
                UserSign: UserSign,
                UpdateId: UpdateId
              }
            })
            .then(res => {
              // console.log(res.data);
              if (res.data.ok) {
                vm.$message({
                  message: res.data.msg,
                  type: 'success'
                })
                vm.toggleEdit(2)
              } else {
                vm.$message.error(res.data.msg)
              }
              vm.init()
            })
            .catch(function(err) {
              console.log(err)
              vm.$message.error('保存失败！')
            })
        }
      })
    },
    toggleEdit(a) {
      if (a === 1) {
        this.idedit = true
      } else if (a === 2) {
        this.idedit = false
        // 取消代码段
      }
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagesize = val
      this.getPersonOperLogList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentpage = val
      this.getPersonOperLogList()
      this.getPerSonOperTotal()
    },
    init() {
      let vm = this
      this.axios
        .get('/apiweb/user/GetUserDetail', {
          params: {
            UserId: vm.userId,
            ComId: vm.ComId
          }
        })
        .then(res => {
          this.$refs['myselfForm'].resetFields()
          // console.log(res.data);
          this.formValidate.name = res.data.UserName
          this.formValidate.cellphone = res.data.UserPhone
          this.oldPhone = res.data.UserPhone
          this.formValidate.mail = res.data.UserMail
          this.formValidate.nickname = res.data.UserNick
          this.formValidate.desc = res.data.UserSign
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    //获取个人操作日志列表
    getPersonOperLogList() {
      let vm = this
      this.axios
        .get('/apiweb/log/GetUserOperLogList', {
          params: {
            ComId: vm.ComId,
            UserId: vm.userId,
            currentpage: vm.currentpage,
            pagesize: vm.pagesize
          }
        })
        .then(res => {
          // console.log(res.data);
          // console.log(JSON.parse(res.data.data));
          vm.data1 = JSON.parse(res.data.data)
          vm.joutotal = res.data.total
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    changeScale(num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    rotateLeft() {
      this.$refs.cropper.rotateLeft()
    },
    rotateRight() {
      this.$refs.cropper.rotateRight()
    },
    finish(type) {
      // 输出
      // var test = window.open('about:blank')
      // test.document.body.innerHTML = '图片生成中..'
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob(data => {
          var img = window.URL.createObjectURL(data)
          this.model = true
          this.modelSrc = img
        })
      } else {
        this.$refs.cropper.getCropData(data => {
          this.model = true
          this.modelSrc = data
        })
      }
    },
    // 实时预览函数
    realTime(data) {
      this.previews = data
    },
    down(type) {
      const _this = this
      if (!_this.option.img) {
        _this.$message.error('请先选择图片!')
        return
      }
      // event.preventDefault()
      var aLink = document.createElement('a')
      aLink.download = 'author-img'
      // 输出
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob(data => {
          console.log(data)
          this.downImg = window.URL.createObjectURL(data)
          //            aLink.download = this.downImg;
          console.log(this.downImg)
          aLink.href = window.URL.createObjectURL(data)
          aLink.click()
        })
      } else {
        this.$refs.cropper.getCropData(data => {
          // this.downImg = data
          // aLink.href = data
          // aLink.click()
          // 将头像图片数据发送给后台
          // console.log(data)
          _this.axios
            .post('/apiweb/upload/fileUpload', {
              content: data
            })
            .then(res => {
              if (res.data) {
                if (res.data.code) {
                  console.log(res.data)
                  const row = res.data
                  _this.axios
                    .get('/apiweb/user/UpdateUserImage', {
                      params: {
                        ComId: _this.ComId,
                        UserID: _this.userId,
                        UserName: Cookies.get('yh_web_UserName'),
                        UserImage: res.data.img
                      }
                    })
                    .then(res => {
                      if (res.data) {
                        console.log(res.data)
                        _this.init()
                        _this.$store.commit('setAvator', row.img)
                        Cookies.set('yh_web_UserImage', row.img)
                        _this.$nextTick(() => {
                          _this.userImg = row.img
                        })
                        _this.cropperModal = false
                      }
                    })
                }
              }
            })
            .catch(function(err) {
              console.log(err)
            })
        })
      }
    },
    uploadImg(e, num) {
      //上传图片
      // this.option.img
      var file = e.target.files[0]
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
        return false
      }
      var reader = new FileReader()
      reader.onload = e => {
        let data
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        if (num === 1) {
          this.option.img = data
        } else if (num === 2) {
          this.example2.img = data
        }
      }
      // 转化为base64
      reader.readAsDataURL(file)
      // 转化为blob
      // reader.readAsArrayBuffer(file)
    },
    imgLoad(msg) {
      console.log(msg)
    }
  },
  mounted() {
    this.init()
    // this.getPersonOperLogList()
  }
}
</script>
