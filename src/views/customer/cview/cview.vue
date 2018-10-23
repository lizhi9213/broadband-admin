<style lang="less">
// @import "../../../styles/common.less";
@import './cview.less';
</style>

<template>
  <div>
    <Card>
      <!-- 顶部标题 -->
      <p slot="title">
        <Icon type="android-laptop"></Icon>{{FlagId == '2' ? '客户视图': ViewId == '3' ? '宽带视图' : '工单视图'}}
      </p>
      <div>
        <Row :gutter="24" v-if="ViewId.length>3" style="padding-bottom:10px">
          <Col span="24">
          <!-- <Alert>您可以添加更多视图来满足您的业务需求。</Alert> -->
          </Col>
          <Col span="12">
          <Form :model="formData" :label-width="100" label-position="right" :rules="formRule">
            <FormItem label="名称" prop="ViewTitle">
              <Input v-model="formData.ViewTitle" placeholder="请填写名称" disabled></Input>
            </FormItem>
            <!-- <FormItem label="类型" prop="ViewType">

              <RadioGroup v-model="formData.ViewType">
                <Radio label="1">公开</Radio>
                <Radio label="2">私有</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="可见的组" prop="ViewVisible" v-show="formData.ViewType != 2">
              <Select v-model="formData.ViewVisible" filterable multiple>
                <Option value="0">全部组</Option>
              </Select>
            </FormItem> -->
            <FormItem label="视图描述" prop="ViewMemo">
              <Input v-model="formData.ViewMemo" placeholder="请填写视图描述" disabled type="textarea">
              </Input>
            </FormItem>
            <!-- <FormItem label="分组" prop="ViewGroup">
              <Select v-model="formData.ViewGroup" placeholder="">
              </Select>
            </FormItem>
            <FormItem label="排序" prop="ViewSort">
              <Select v-model="formData.ViewSort" placeholder="">
              </Select>
            </FormItem> -->
          </Form>
          </Col>
          <!-- <Col span="24">
          <Alert>设置过滤条件，符合条件的工单将进入该视图。</Alert>
          </Col>
          <Col span="12">
          <Card dis-hover>
            <p slot="title">
              符合下面的全部条件
            </p>
          </Card>
          </Col>
          <Col span="12">
          <Card dis-hover>
            <p slot="title">
              符合下面的任何条件
            </p>
          </Card>
          </Col> -->
        </Row>
        <Row :gutter="24">
          <Col span="24">
          <Alert>您可以选择想要的字段在列表中显示，通过在列表中拖放来选择和重新排序。</Alert>
          </Col>
        </Row>
        <Row class="view-box" :gutter="24">
          <Col span="12" class="drgga-box">
          <Card dis-hover>
            <p slot="title">
              <Icon type="ios-list"></Icon>
              不显示的列
            </p>
            <div style="height: 500px;">
              <ul id="todoList" class="iview-admin-draggable-list left-list">
                <li v-for="(item, index) in todoArray" :key="index" class="notwrap todolist-item" :data-id="item.FieldId" :data-index="index">
                  <span class="item-title">{{ item.FieldName }}</span>
                  <input class="item-input" v-model="item.FieldSize" @blur="inputBlur" :data-id="item.FieldId" type="number" placeholder="列宽">
                  <span class="company">px</span>
                </li>
              </ul>
            </div>
          </Card>
          </Col>
          <Col span="12" class="drgga-box">
          <Card dis-hover>
            <p slot="title">
              <Icon type="ios-list-outline"></Icon>
              显示的列--列宽
            </p>
            <div style="height: 500px;">
              <ul id="doList" class="iview-admin-draggable-list right-list">
                <li v-for="(item, index) in doArray" :key="index" class="notwrap todolist-item" :data-id="item.FieldId" :data-index="index">
                  <span class="item-title">{{ item.FieldName }}</span>
                  <input class="item-input" v-model="item.FieldSize" @blur="inputBlur" :data-id="item.FieldId" type="number" placeholder="列宽">
                  <span class="company">px</span>
                </li>
              </ul>
            </div>
          </Card>
          </Col>
          <Col span="24">
          <Button type="success" icon="upload" @click="save" style="margin-top: 20px;">更新视图</Button>
          </Col>
        </Row>
      </div>
    </Card>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
export default {
  name: 'cview',
  data() {
    const validePhone = (rule, value, callback) => {
      var re = /^1[0-9]{10}$/
      if (!re.test(value)) {
        callback(new Error('请输入正确格式的手机号'))
      } else {
        callback()
      }
    }
    const valideRePassword = (rule, value, callback) => {
      if (value !== this.editPasswordForm.newPass) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      todoArray: [],
      doArray: [],
      viewList: [], // 显示的列表做改变的组，右边显示组的操作映射
      FlagId: 1,
      ViewId: this.$route.params.id, //TODO:获取路由参数
      formData: {
        ViewType: 1,
        ViewVisible: ['0']
      },
      formRule: {
        ViewTitle: [{ required: true, message: '请填写名称' }]
      }
    }
  },
  created() {
    if (!this.$route.params.id) {
      this.ViewId = this.$route.path.substr(
        this.$route.path.lastIndexOf('/') + 1
      )
      this.FlagId = this.ViewId
    }
    this.init()
    if (this.FlagId == 1) {
      this.axios
        .get('/apiweb/show/FieldViewDetail', {
          params: {
            ViewId: this.ViewId,
            FieldId: this.FieldId
          }
        })
        .then(res => {
          if (res.data) this.formData = res.data[0]
        })
    }
  },
  methods: {
    inputBlur(e) {
      let [inputId, nowWidth] = [
        e.srcElement.getAttribute('data-id'),
        e.srcElement.value
      ]
      for (let i = 0; i < this.viewList.length; i++) {
        if (this.viewList[i]['FieldId'] == inputId) {
          this.viewList[i]['FieldSize'] = nowWidth
          break
        }
      }
      console.log(this.viewList)
    },
    init() {
      let that = this
      // this.todoArray 所有的列表
      // this.doArray 显示的列表
      // this.viewList 显示的列表映射，请求到数据后需要初始化。保存时从这里面取数据发送给后台
      this.axios
        .get('/apiweb/show/FieldShowDetail', {
          params: {
            FlagId: that.FlagId,
            ViewId: that.ViewId
          }
        })
        .then(res => {
          that.todoArray = [...res.data.left]
          that.doArray = [...res.data.right]
          that.viewList = [...res.data.right]
        })
        .catch(res => {})
    },
    save() {
      // 保存函数
      // this.viewList 从这个函数中获取列表数据处理
      console.log(this.viewList)
      this.axios
        .post('/apiweb/show/FieldShowAdd', {
          ViewId: this.ViewId,
          FlagId: this.FlagId,
          viewList: this.viewList
        })
        .then(res => {
          if (res.data.ok) {
            this.$message.success(res.data.msg)
          } else {
            this.$message.error(res.data.msg)
          }
        })
    }
  },
  mounted() {
    document.body.ondrop = function(event) {
      event.preventDefault() // 拖动时阻止冒泡
      event.stopPropagation() // 拖动时不再派发事件。
    }
    let vm = this
    let todoList = document.getElementById('todoList')
    Sortable.create(todoList, {
      group: {
        name: 'list',
        pull: true
      }, // 分组的名字，同样的name可以互相拖动到对应列表排序
      sort: false, // 默认为true，设置是否可以排序。当前不允许排序
      animation: 120, //动画时间
      ghostClass: 'placeholder-style', // 被拖动元素离开原来位置时原来位置的样式
      fallbackClass: 'iview-admin-cloned-item',
      onRemove(event) {
        //console.log(vm.doArray)
      }
    })
    let doList = document.getElementById('doList')
    Sortable.create(doList, {
      group: {
        name: 'list',
        pull: true
      }, // 分组的名字，同样的name可以互相拖动到对应列表排序
      filter: '.iview-admin-draggable-delete',
      animation: 120, //动画时间
      ghostClass: 'placeholder-style', // 被拖动元素离开原来位置时原来位置的样式
      fallbackClass: 'iview-admin-cloned-item',
      onRemove(event) {
        // console.log(event);
      },
      onUpdate(event) {
        console.log(event)
      },
      onSort(event) {
        // doList 发生改变之后都会触发
        // console.log(event.newIndex); //当前最新排列序号
        // console.log(event.item.getAttribute("data-id"));
        let [nowId, nowIndex, itemWidth] = [
          event.item.getAttribute('data-id'),
          event.newIndex,
          event.item.children[1].value
        ]
        // 以 event.from.id 和event.to.id 为依据判断用户是删除，新增，还是排序
        if (event.from.id == 'todoList' && event.to.id == 'doList') {
          // from: todoList => to: doList // 显示组新增了
          // console.log("新增");
          // 获取宽度
          let nowItem = { FieldId: nowId, FieldSize: itemWidth }
          vm.viewList.splice(nowIndex, 0, nowItem)
        } else if (event.from.id == 'doList' && event.to.id == 'doList') {
          // from: doList => to: doList //显示组排序
          // console.log("排序");
          let nowItem = { FieldId: nowId, FieldSize: itemWidth } // 变量暂存数据
          vm.viewList.splice(event.oldIndex, 1) // 先删除原来的那条数据
          vm.viewList.splice(nowIndex, 0, nowItem) // 插入数据
        } else if (event.from.id == 'doList' && event.to.id == 'todoList') {
          // from: doList => to: todoList //显示组删除
          // console.log("删除");
          vm.viewList.splice(event.oldIndex, 1) // 删除
        }
      }
    })
  }
}
</script>
