<style lang="less">
@import './styles/infor-card.less';
</style>

<template>
    <Card :padding="0">
        <div class="infor-card-con">
            <Col class="infor-card-icon-con" :style="{backgroundColor: color, color: 'white'}" span="8">
            <Row class="height-100" type="flex" align="middle" justify="center">
                <i class="iconfont" :class="iconType" :style="{fontSize: iconSize +'px', color: '#fff'}"></i>
            </Row>
            </Col>
            <Col span="16" class="height-100">
            <Row type="flex" align="middle" justify="center" class="height-100">
                <count-up class="infor-card-count user-created-count" :id-name="idName" :end-val="endVal" :color="color" :countSize="countSize" :myUnit="unit" :countWeight="countWeight">
                    <p class="infor-intro-text" slot="intro">{{ introText }}</p>
                </count-up>
            </Row>
            </Col>
        </div>
    </Card>
</template>

<script>
import countUp from './countUp.vue'

export default {
  name: 'inforCard',
  components: {
    countUp
  },
  props: {
    idName: String,
    endVal: Number,
    color: String,
    unit: {
      type: String,
      default: ''
    },
    iconType: String,
    introText: String,
    countSize: {
      type: String,
      default: '30px'
    },
    countWeight: {
      type: Number,
      default: 700
    },
    iconSize: {
      type: Number,
      default: 32
    }
  }
}
</script>

