<style lang="less">
</style>

<template>
  <div>
    <Row :gutter="20" style="width:100%;">
      <Col span="24">
      <h3>
        <Icon type="ios-musical-notes"></Icon>
        {{ phone }} 的通话记录
      </h3>
      <aplayer @canplay="toggle" ref="aplayer" :music="music" @error="playErr" @ended="firstInit=false" :list="[]" />
      <Alert type="warning" show-icon>
        10085平台录音到该平台查询。<br>无法播放的录音请查询存储。
      </Alert>
      </Col>
      <Col span="24" style="margin:10px 0" v-for="item,index in list" :key="index">
      <Card>
        <div slot="title">
          <strong>{{formatDate(item.DAIL_TIME)}}</strong>
          <span :style="{color:item.StatusName === '成功' ? 'green' : 'red'}">
            <Icon :type="item.StatusName === '成功' ? 'ios-checkmark-outline' : 'ios-close-outline'"></Icon>
            {{item.StatusName}}
          </span>
        </div>
        <Row :gutter="20">
          <Col span="16">
          <p>
            <Icon type="social-buffer-outline" v-if="!!item.BusinTitle"></Icon>
            {{item.BusinTitle}}</p>
          <p>
            <Icon type="ios-home-outline"></Icon>
            {{item.PlatName}} | {{(item.Province || '') + (item.City || '')}}</p>
          <p>
            <Icon type="ios-person-outline"></Icon>
            {{(item.RealName || '') +' | '+ (item.Account || '')}}</p>
          </Col>
          <Col span="8">
          <Tooltip content="听音" placement="top">
            <Button type="success" shape="circle" icon="ios-play" style="font-weight:900" @click="playto(item)"></Button>
          </Tooltip>
          <Tooltip content="复制到表单" placement="top">
            <Button type="info" shape="circle" icon="ios-copy-outline" style="font-weight:900" @click="fordata(item)" v-if="canCopy"></Button>
          </Tooltip>
          <Tooltip content="播放录音" placement="top">
            <Button type="success" shape="circle" icon="android-microphone" style="font-weight:900" @click="playincall(item)" v-if="canPlay"></Button>
          </Tooltip>
          <Tooltip content="停止播放录音" placement="top">
            <Button type="info" shape="circle" icon="stop" style="font-weight:900" @click="stopincall(item)" v-if="canPlay"></Button>
          </Tooltip>
          <Tooltip content="下载" placement="top">
            <a v-if="!!down(item)" style="font-weight:900" target="_blank" :href="down(item)">
              <Icon :size="32" type="ios-cloud-download-outline"></Icon>
            </a>
          </Tooltip>
          </Col>
        </Row>
      </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import Aplayer from 'vue-aplayer'
import Cookies from 'js-cookie'
export default {
  name: 'MarkRecords',
  components: {
    Aplayer
  },
  props: {
    phone: String,
    canCopy: Boolean,
    canPlay: Boolean
  },
  data() {
    return {
      list: [],
      music: {
        src: 'https://moeplayer.b0.upaiyun.com/aplayer/snowmoonflowers',
        title: '暂无',
        artist: '暂无',
        pic: '/static/img/td_icon.ico'
      },
      firstInit: false
    }
  },
  created() {
    if (this.phone) this.getList
  },
  methods: {
    getList() {
      this.axios
        .get('https://kejiyuan.xierxinxi.cn:1443/data/Report.ashx', {
          params: {
            Action: 'GetAllImportResult',
            rows: '100',
            page: '1',
            PhoneNum: this.phone,
            PhoneStatus: '-1',
            sidx: 'DAIL_TIME',
            sord: 'desc'
          }
        })
        .then(res => {
          this.list = res.data.rows
          if (this.list.length === 0) {
            this.$message.warning('无营销记录')
          }
        })
        .catch(err => {
          if (!err.response) {
            this.$message.error('服务器状态异常，请稍后重试。')
          } else {
            this.$message.error('发生错误')
          }
        })
    },
    down(item) {
      let path = ''
      switch (item.PlatNo) {
        case '2':
          path = '/xe/kejiyuan/FS' + item.RecourPath
          break
        case '3':
          path = '/yh/bishagang/fs' + item.RecourPath
          break
        case '4':
          if (item.PlatName.indexOf('CC') > -1) {
            if (item.RecourPath.indexOf('audio') > -1) {
              path =
                '/cc/壹号/' +
                this.formatDate(item.DAIL_TIME, 'yyyy-MM') +
                '/' +
                this.formatDate(item.DAIL_TIME, 'dd') +
                '/' +
                item.RecourPath.substr(6)
            } else {
              path =
                '/jh/' +
                this.formatDate(item.DAIL_TIME, 'yyyyMMdd') +
                '/' +
                item.RecourPath.substr(item.RecourPath.lastIndexOf('\\') + 1)
            }
          } else {
            path = '/yh/minhanglu' + item.RecourPath
          }
          break
        case '5':
          path = '/xe/shangqiu/FS' + item.RecourPath
          break
        case '6':
          path = '/xe/school/FS' + item.RecourPath
          break
        case '7':
          path = '/hz/FS' + item.RecourPath
          break
        case '8':
          path = '/xe/ankailu' + item.RecourPath
          break
        case '9':
          path = '/' + item.RecourPath
          break
        case '10':
          path = '/nansanhuan' + item.RecourPath
        case '11':
          path = '/qingfeng' + item.RecourPath
      }
      if (!path || path.indexOf('null') > -1) {
        return ''
      } else {
        return 'http://kejiyuan.xierxinxi.cn:3100' + path
      }
    },
    playto(item) {
      let path = ''
      switch (item.PlatNo) {
        case '2':
          path = '/xe/kejiyuan/FS' + item.RecourPath
          break
        case '3':
          path = '/yh/bishagang/fs' + item.RecourPath
          break
        case '4':
          if (item.PlatName.indexOf('CC') > -1) {
            if (item.RecourPath.indexOf('audio') > -1) {
              path =
                '/cc/壹号/' +
                this.formatDate(item.DAIL_TIME, 'yyyy-MM') +
                '/' +
                this.formatDate(item.DAIL_TIME, 'dd') +
                '/' +
                item.RecourPath.substr(6)
            } else {
              path =
                '/jh/' +
                this.formatDate(item.DAIL_TIME, 'yyyyMMdd') +
                '/' +
                item.RecourPath.substr(item.RecourPath.lastIndexOf('\\') + 1)
            }
          } else {
            path = '/yh/minhanglu' + item.RecourPath
          }
          break
        case '5':
          path = '/xe/shangqiu/FS' + item.RecourPath
          break
        case '6':
          path = '/xe/school/FS' + item.RecourPath
          break
        case '7':
          path = '/hz/FS' + item.RecourPath
          break
        case '8':
          path = '/xe/ankailu' + item.RecourPath
          break
        case '9':
          path = '/' + item.RecourPath
          break
        case '10':
          path = '/nansanhuan' + item.RecourPath
        case '11':
          path = '/qingfeng' + item.RecourPath
      }
      if (!path || path.indexOf('null') > -1) {
        this.$message.error('无法播放，请至存储中查找')
      } else {
        this.music = {
          src: 'http://kejiyuan.xierxinxi.cn:3100' + path,
          title: path.substr(path.lastIndexOf('/') + 1),
          pic: '/static/img/td_icon.ico',
          artist: item.RealName + ' | ' + item.Account
        }
      }
    },
    toggle() {
      this.$refs.aplayer.play()
    },
    playErr(err) {
      if (this.firstInit) {
        if (err.type === 'error') {
          this.$message.error('资源错误，请查询存储')
        }
      } else {
        this.firstInit = true
      }
    },
    formatDate(time) {
      if (!!time) {
        let date = new Date(parseInt(time.substr(6, 13)))
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let hour = date.getHours()
        let minute = date.getMinutes()
        let second = date.getSeconds()
        return (
          year +
          '/' +
          month +
          '/' +
          day +
          '  ' +
          hour +
          ':' +
          minute +
          ':' +
          second
        )
      } else {
        return ''
      }
    },
    fordata(data) {
      this.$emit('click-data', data)
    },
    playincall(play) {
      const src = this.down(play)
      if (src) {
        this.axios
          .post('/apiwss/system/sendVoice', {
            id: Cookies.get('yh_web_UserCode'),
            comId: Cookies.get('yh_web_ComId'),
            file: src
          })
          .then()
          .catch(() => {
            this.$message.error('播放出现错误，请检查分机状态或尝试下载录音')
          })
      } else {
        this.$message.error('录音不存在')
      }
    },
    stopincall(play) {
      const src = this.down(play)
      if (src) {
        this.axios
          .post('/apiwss/system/stopVoice', {
            id: Cookies.get('yh_web_UserCode'),
            comId: Cookies.get('yh_web_ComId'),
            file: src
          })
          .then()
          .catch(() => {
            this.$message.error('播放出现错误，请检查分机状态或尝试下载录音')
          })
      } else {
        this.$message.error('录音不存在')
      }
    }
  },
  watch: {
    phone: function(params) {
      this.getList()
    }
  }
}
</script>

