import axios from 'axios'
// 动态表单的 modal和rule处理
export const dealFrom = data => {
  // console.log(data)

  let formData = {} //定义一个局部变量保存表单数据
  let ruleData = {} // 定义一个局部变量保存验证规则
  data.forEach(item => {
    // 根据field数据来实例化表单中每条选项的model对应
    switch (item.FieldType) {
      case 'timerange':
        formData[item.FieldId] = []
        break
      case 'radio':
        formData[item.FieldId] = item.Checked
        break
      case 'checkbox':
        let checkData = []
        if (item.Checked != '' && item.Checked.indexOf(',') > -1) {
          checkData = item.Checked.replace(/[\[\]\'\s]/g, '') // 去掉中括号 单引号 空格
          checkData = item.Checked.split(',')
        }
        if (item.Checked != '' && item.Checked.indexOf(',') == -1) {
          checkData = item.Checked.split(',')
        }
        formData[item.FieldId] = checkData
        break
      case 'cascader':
        formData[item.FieldId] = []
        break
      case 'other':
        // 三个联动特殊处理
        if (item.FieldId === '175') {
          formData[item.FieldId] = []
        } else {
          formData[item.FieldId] = ''
        }
        break
      case 'multipleselect':
        formData[item.FieldId] = []
        break
      case 'number':
        formData[item.FieldId] = item.Checked
        break
      default:
        formData[item.FieldId] = ''
    }

    // 验证规则处理
    // 判断如果必填只需要验证是否为空即可，针对可能出现的不同类型用switch选择器来处理
    if (item.IsWrite == 1) {
      switch (item.FieldType) {
        case 'number':
          ruleData[item.FieldId] = [
            {
              required: true,
              message: item.FieldName + '不能为空！',
              trigger: 'blur'
            }
          ]
          break
        case 'email':
          ruleData[item.FieldId] = [
            {
              required: true,
              message: item.FieldName + '不能为空！',
              trigger: 'blur'
            },
            {
              type: 'email',
              message: '请输入正确的邮箱格式',
              trigger: 'blur'
            }
          ]
          break
        case 'select':
          ruleData[item.FieldId] = [
            {
              required: true,
              message: '请选择' + item.FieldName + '!',
              trigger: 'change'
            }
          ]
          break
        case 'radio':
          ruleData[item.FieldId] = [
            {
              required: true,
              message: '请选择' + item.FieldName + '!',
              trigger: 'change'
            }
          ]
          break
        case 'timerange':
          ruleData[item.FieldId] = [
            {
              required: true,
              type: 'date',
              message: '请选择' + item.FieldName + '!',
              trigger: 'change'
            }
          ]
          break
        case 'time':
          ruleData[item.FieldId] = [
            {
              required: true,
              type: 'date',
              message: '请选择' + item.FieldName + '!',
              trigger: 'change'
            }
          ]
          break
        case 'multipleselect':
          ruleData[item.FieldId] = [
            {
              required: true,
              validator: (rule, value, callback) => {
                // console.log(value)
                // console.log(value.length)
                if (value.length == 0) {
                  callback(new Error('请选择至少一条' + item.FieldName))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ]
          break
        default:
          /*input/text/textarea*/
          ruleData[item.FieldId] = [
            {
              required: true,
              message: item.FieldName + '不能为空！',
              trigger: 'blur'
            }
          ]
      }
    }
    if (item.Regular != '') {
      // 如果正则表达式不为空，则需要自定义验证
      if (!ruleData[item.FieldId]) {
        ruleData[item.FieldId] = []
      }
      ruleData[item.FieldId].push({
        validator: (rule, value, callback) => {
          let reg = item.Regular
          let rex = new RegExp(reg)
          if (!rex.test(value) && value != '') {
            let tipMsg = ''
            switch (item.FieldType) {
              case 'number':
                tipMsg = '请输入数字格式！'
                break
              case 'email':
                tipMsg = '请输入正确的邮箱格式'
                break
              default:
                tipMsg = '请填写正确的格式！'
            }

            callback(new Error(tipMsg))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      })
    }
  })
  // console.log(formData)
  // console.log(ruleData)
  return [formData, ruleData]
}

// 处理用户编辑后的数据
// 在Date原型上绑定一个格式化日期函数
Date.prototype.format = function(fmt) {
  var o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
  // yyyy-MM-dd hh:mm:ss 或者 yyyy-MM-dd
}

export const dealData = (...datas) => {
  // console.log(datas)
  const fieldData = datas[0] // 表单字段data
  const formData = datas[1] // 表单填写的data
  // console.log(typeof (fieldData))
  // console.log(typeof (formData))
  let multiData = [] // 定义一个多选暂存数组
  fieldData.forEach(item => {
    let thisId = item.FieldId
    let nwoItem = item
    nwoItem['FieldMemo'] = ''
    switch (item.FieldType) {
      case 'checkbox':
        nwoItem['Checked'] = formData[thisId]
        nwoItem['FieldMemo'] = formData[thisId]
        break
      case 'cascader':
        nwoItem['Checked'] = formData[thisId]
        nwoItem['FieldMemo'] = formData[thisId]
        break
      case 'multipleselect':
        nwoItem['Checked'] = formData[thisId]
        nwoItem['FieldMemo'] = formData[thisId]
        break
      case 'timerange':
        let timesArr = []
        if (formData[thisId].length != 0) {
          for (let item of formData[thisId]) {
            if (item != '') {
              let nformat =
                item.Checked === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd hh:mm'
              let time2 = new Date(item).format(nformat)
              console.log(time2)
              timesArr.push(time2)
            }
          }
          nwoItem['Checked'] = timesArr
        } else {
          nwoItem['Checked'] = timesArr
        }
        nwoItem['FieldMemo'] = timesArr
        break
      case 'select':
        nwoItem['Checked'] = formData[thisId]
        nwoItem['FieldMemo'] = formData[thisId]
        break
      case 'radio':
        nwoItem['Checked'] = formData[thisId]
        nwoItem['FieldMemo'] = formData[thisId]
        break
      case 'time':
        let nowTime = formData[thisId]
        // console.log(nowTime)
        if (nowTime != '') {
          let nformat2 =
            item.Checked === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd hh:mm'
          let time1 = new Date(nowTime).format(nformat2)
          // console.log(time1);
          nwoItem['Checked'] = time1
          nwoItem['FieldMemo'] = time1
        } else {
          nwoItem['Checked'] = ''
          nwoItem['FieldMemo'] = ''
        }
        break
      case 'other':
        nwoItem['Checked'] = formData[thisId]
        nwoItem['FieldMemo'] = formData[thisId]
        break
      case 'community':
        nwoItem['Checked'] = formData[thisId]
        nwoItem['FieldMemo'] = formData[thisId]
        break
      default:
        nwoItem['FieldMemo'] = formData[thisId]
    }
    multiData.push(nwoItem)
  })
  multiData = JSON.stringify(multiData)
  // console.log(JSON.parse(multiData))
  return multiData
}

// 提取表单数据分类依据
export const dealClassify = data => {
  const classObj = {
    strArr: [],
    arrOf: []
  }
  data.forEach((item, index) => {
    switch (item.FieldType) {
      case 'checkbox':
        // 多选，数组
        classObj.arrOf.push(item.FieldId)
        break
      case 'cascader':
        //  级联，数组
        classObj.arrOf.push(item.FieldId)
        break
      case 'multipleselect':
        // 多选，数组
        classObj.arrOf.push(item.FieldId)
        break
      case 'timerange':
        // 时间范围选择，数组
        classObj.arrOf.push(item.FieldId)
        break
      case 'select':
        // 单项选择，字符
        classObj.arrOf.push(item.FieldId)
        break
      case 'radio':
        // 单项，字符
        classObj.strArr.push(item.FieldId)
        break
      case 'time':
        // 时间选择器，字符
        classObj.strArr.push(item.FieldId)
        break
      case 'other':
        // 其他，当id为175为级联数组
        if (item.FieldId === '175') {
          classObj.arrOf.push(item.FieldId)
        } else {
          classObj.strArr.push(item.FieldId)
        }
        break
      default:
        // 其他为字符串
        classObj.strArr.push(item.FieldId)
    }
  })
  return classObj
}
