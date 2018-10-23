<style lang="less">
@import url('./ordershow.less');
</style>

<template>
    <div>
        <Card dis-hover>
            <p slot="title">
                <Icon type="android-list"></Icon>
                工单视图
            </p>
            <div>
                <Row>
                    <Col span="24">
                    <Table stripe :show-overflow-tooltip="true" :loading="loading" :data="tableData" :columns="columns"></Table>
                    </Col>
                </Row>
            </div>
        </Card>
    </div>
</template>
<script>
import Cookies from 'js-cookie'
export default {
  name: 'ordershow',
  data() {
    return {
      tableData: [],
      columns: [
        {
          title: '视图标题',
          key: 'ViewTitle',
          width: 180,
          fixed: 'left',
          render: (h, params) => {
            let vm = this
            return h(
              'div',
              {
                attrs: { class: 'table-name' },
                style: {
                  overflow: 'hidden',
                  height: '100%',
                  width: '100%',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }
              },
              [
                h('span', {
                  style: {
                    lineHeight: '42px'
                  },
                  domProps: { innerHTML: params.row.ViewTitle }
                }),
                h(
                  'el-tooltip',
                  {
                    props: {
                      effect: 'dark',
                      content: '点击编辑' + params.row.ViewTitle + '视图',
                      placement: 'right'
                    },
                    style: {
                      float: 'right'
                    }
                  },
                  [
                    h('Button', {
                      props: {
                        type: 'text',
                        icon: 'compose'
                      },
                      style: {
                        float: 'right',
                        color: '#2d8cf0',
                        fontSize: '18px'
                      },
                      on: {
                        click: event => {
                          // 阻止冒泡事件
                          event.stopPropagation()
                          vm.setView(params.row.ViewId)
                        }
                      }
                    })
                  ]
                )
              ]
            )
          }
        },
        {
          title: '描述',
          key: 'ViewMemo'
        }
      ],
      loading: false
    }
  },
  created() {
    this.loading = true
    this.axios
      .get('/apiweb/show/FieldShowList')
      .then(res => {
        this.tableData = res.data
        this.loading = false
      })
      .catch(err => {
        this.loading = false
      })
  },
  methods: {
    setView(id) {
      this.$router.push({ name: 'view', params: { id } })
    }
  }
}
</script>

