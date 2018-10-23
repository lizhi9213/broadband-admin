<style lang="less">
</style>

<template>
  <div>
    <Row :gutter="20" style="width:100%">
      <Col span="24">
      <h3>
        <Icon type="ios-musical-notes"></Icon>
        历史录音
      </h3>
      <aplayer @canplay="toggle" ref="aplayer" :music="music" v-if="flag" />
      <Row :gutter="20" v-for="item in list" :key="item.recordfile" style="min-height:55px; background-color:#fff; padding:5px; margin-top:5px; border:thin solid #f1f1f1; border-radius:4px; margin-right:5px; margin-left:5px;box-shadow:0 2px 2px 0 rgba(0,0,0,.07), 0 1px 5px 0 rgba(0,0,0,.1)">
        <Col span="20" @click.native="playto(item)">
        <p>{{item.title}}</p>
        <p>{{item.artist}}</p>
        </Col>
        <Col span="4" style="height:100%">
        <Button type="success" shape="circle" icon="ios-play" style="font-weight:900; margin-top:-10px" @click="playto(item.src)"></Button>
        <Tooltip content="播放录音" placement="top">
          <Button type="success" shape="circle" icon="android-microphone" style="font-weight:900" @click="playincall(item.src)"></Button>
        </Tooltip>
        <Tooltip content="停止播放录音" placement="top">
          <Button type="info" shape="circle" icon="stop" style="font-weight:900" @click="stopincall(item)"></Button>
        </Tooltip>
        <a download="" :href="item.src" style="margin-left:7px;font-weight:900; margin-top:5px">
          <Icon :size="26" style="font-weight:900; margin-top:8px" type="ios-cloud-download-outline"></Icon>
        </a>
        </Col>
      </Row>
      </Col>
    </Row>
  </div>
</template>

<script>
import Aplayer from 'vue-aplayer'
import Cookies from 'js-cookie'
export default {
  name: 'MarkRecordsLog',
  components: {
    Aplayer
  },
  props: {
    workId: String
  },
  data() {
    return {
      flag: false,
      list: [],
      music: {
        src: 'http://stor.cloudmusics.cn/mp3/2018/06',
        title: '暂无',
        artist: '暂无',
        pic: '/td_icon.ico'
      },
      firstInit: false
    }
  },
  watch: {
    workId: function() {
      this.getlist()
    }
  },
  mounted() {
    if (this.workId) this.getlist()
  },
  methods: {
    toggle() {
      this.$refs.aplayer.play()
    },
    getlist() {
      this.axios
        .get('/apiweb/work/workrecordList', {
          params: {
            workId: this.workId
          }
        })
        .then(res => {
          //this.list = res.data.rows;
          console.log(res.data)
          //this.list = res.data;
          let rows = []
          for (let i = 0; i < res.data.length; i++) {
            let row = {}
            row.src = res.data[i].recordfile
            row.title = res.data[i].title
            row.artist = res.data[i].OperaUser + '-' + res.data[i].CallTime
            row.pic = '/td_icon.ico'
            rows.push(row)
          }
          this.list = rows
          console.log(this.list)
          //   if (this.list.length === 0) {
          //     this.$message.warning("无营销记录");
          //   }
          this.flag = true
        })
        .catch(err => {
          console.log(err)
          if (!err.response) {
            this.$message.error('服务器状态异常，请稍后重试。')
          } else {
            this.$message.error('发生错误')
          }
          this.flag = true
        })
    },
    playto(item) {
      this.music = item
    },
    playErr(err) {
      console.log(err)
      if (this.firstInit) {
        if (err.type === 'error') {
          this.$message.error('资源错误，请查询存储')
        }
      } else {
        this.firstInit = true
      }
    },
    formatDate(time) {
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
    },
    playincall(play) {
      if (play) {
        this.axios
          .post('/apiwss/system/sendVoice', {
            id: Cookies.get('yh_web_UserCode'),
            comId: Cookies.get('yh_web_ComId'),
            file: play
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
      if (play) {
        this.axios
          .post('/apiwss/system/stopVoice', {
            id: Cookies.get('yh_web_UserCode'),
            comId: Cookies.get('yh_web_ComId'),
            file: play
          })
          .then()
          .catch(() => {
            this.$message.error('播放出现错误，请检查分机状态或尝试下载录音')
          })
      } else {
        this.$message.error('录音不存在')
      }
    }
  }
}
</script>

