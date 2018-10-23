<template>
    <div>
        <p :class="className" :style="{textAlign: 'center', color: color, fontSize: countSize, fontWeight: countWeight}"><span v-cloak :id="idName">{{ startVal }}</span><span>{{ unit }}</span></p>
        <slot name="intro"></slot>
    </div>
</template>

<script>
import CountUp from 'countup'

export default {
  data() {
    return {
      unit: '',
      demo: {}
    }
  },
  name: 'countUp',
  props: {
    idName: String,
    className: String,
    startVal: {
      type: Number,
      default: 0
    },
    myUnit: {
      type: String,
      default: ''
    },
    endVal: {
      type: Number,
      required: true
    },
    decimals: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 2
    },
    delay: {
      type: Number,
      default: 500
    },
    options: {
      type: Object,
      default: () => {
        return {
          useEasing: true,
          useGrouping: true,
          separator: ',',
          decimal: '.'
        }
      }
    },
    color: String,
    countSize: {
      type: String,
      default: '30px'
    },
    countWeight: {
      type: Number,
      default: 700
    },
    introText: [String, Number]
  },
  methods: {
    transformValue(val) {
      let endVal = val
      let unit = ''
      if (this.myUnit !== '') {
        unit = this.myUnit
      }
      return {
        val: endVal,
        unit: unit,
        demo: {}
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
        let res = this.transformValue(this.endVal)
        let endVal = res.val
        this.unit = res.unit
        let demo = {}
        this.demo = demo = new CountUp(
          this.idName,
          this.startVal,
          endVal,
          this.decimals,
          this.duration,
          this.options
        )
        if (!demo.error) {
          demo.start()
        }
    })
  },
  watch: {
    endVal(val) {
      let res = this.transformValue(val)
      let endVal = res.val
      this.unit = res.unit
      // console.log(this.demo);
      this.demo.update(endVal)
    }
  }
}
</script>
