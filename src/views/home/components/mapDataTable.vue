<template>
    <div :style="styleObj">
        <Table :height="height" :columns="columns" :loading="isloading" :data="cityData"></Table>
    </div>
</template>

<script>
export default {
  name: 'mapDataTable',
  data() {
    return {
      columns: [
        {
          title: '区域名称',
          key: 'name'
        },
        {
          title: '当日工单量',
          key: 'value',
          sortable: true
        }
      ],
      isloading: false
    }
  },
  props: {
    cityData: Array,
    styleObj: Object,
    height: String,
    tloading: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    tloading(val) {
      this.isloading = val
    }
  }
}
</script>
