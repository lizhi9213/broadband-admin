import axios from 'axios';
// 动态表单的 modal和rule处理
export const handleFrom = (data) => {
    // console.log(data)

    let formData = {}; //定义一个局部变量保存表单数据
    let ruleData = {}; // 定义一个局部变量保存验证规则
    let otherArr = []; // 其他不需要处理的字段
    data.forEach(item => {
        // 先处理其他不需要渲染到页面到数据,例外数据
        if (item.SysField == 'WorkSubject' || item.SysField == 'WorkDetail' || item.SysField == 'WorkStatus') {
            // console.log(item)
            otherArr.push(item);
            // console.log(item.SysField);
            return false;
        }
        // 根据field数据来实例化表单中每条选项的model对应
        switch (item.FieldType) {
            case "timerange":
                formData[item.FieldId] = [];
                break;
            case "radio":
                formData[item.FieldId] = item.Checked;
                break;
            case "checkbox":
                let checkData = [];
                if (item.Checked != '' && item.Checked.indexOf(",") > -1) {
                    checkData = item.Checked.replace(/[\[\]\'\s]/g, ""); // 去掉中括号 单引号 空格
                    checkData = item.Checked.split(",")
                }
                if (item.Checked != '' && item.Checked.indexOf(",") == -1) {
                    checkData = item.Checked.split(",")
                }
                formData[item.FieldId] = checkData;
                break;
            case "cascader":
                formData[item.FieldId] = [];
                break;
            case "multipleselect":
                formData[item.FieldId] = [];
                break;
            default:
                formData[item.FieldId] = "";
        }

        // 验证规则处理
        // 判断如果必填只需要验证是否为空即可，针对可能出现的不同类型用switch选择器来处理
        if (item.IsWrite == 1) {
            switch (item.FieldType) {
                case "number":
                    ruleData[item.FieldId] = [{
                        required: true,
                        message: item.FieldName + "不能为空！",
                        trigger: "blur"
                    }];
                    break;
                case "email":
                    ruleData[item.FieldId] = [{
                            required: true,
                            message: item.FieldName + "不能为空！",
                            trigger: "blur"
                        },
                        {
                            type: "email",
                            message: "请输入正确的邮箱格式",
                            trigger: "blur"
                        }
                    ];
                    break;
                case "select":
                    ruleData[item.FieldId] = [{
                        required: true,
                        message: "请选择" + item.FieldName + "!",
                        trigger: "change"
                    }];
                    break;
                case "radio":
                    ruleData[item.FieldId] = [{
                        required: true,
                        message: "请选择" + item.FieldName + "!",
                        trigger: "change"
                    }];
                    break;
                case "timerange":
                    ruleData[item.FieldId] = [{
                        required: true,
                        type: "date",
                        message: "请选择" + item.FieldName + "!",
                        trigger: "change"
                    }];
                    break;
                case "time":
                    ruleData[item.FieldId] = [{
                        required: true,
                        type: "date",
                        message: "请选择" + item.FieldName + "!",
                        trigger: "change"
                    }];
                    break;
                case "multipleselect":
                    ruleData[item.FieldId] = [{
                        required: true,
                        validator: (rule, value, callback) => {
                            // console.log(value)
                            // console.log(value.length)
                            if (value.length == 0) {
                                callback(new Error("请选择至少一条" + item.FieldName));
                            } else {
                                callback();
                            }
                        },
                        trigger: "blur"
                    }];
                    break;
                default:
                    /*input/text/textarea*/
                    ruleData[item.FieldId] = [{
                        required: true,
                        message: item.FieldName + "不能为空！",
                        trigger: "blur"
                    }];
            }
        }
        if (item.Regular != "") {
            // 如果正则表达式不为空，则需要自定义验证
            if (!ruleData[item.FieldId]) {
                ruleData[item.FieldId] = [];
            }
            ruleData[item.FieldId].push({
                validator: (rule, value, callback) => {
                    // console.log(item);
                    // console.log(item.Regular);
                    let reg = item.Regular;
                    let rex = new RegExp(reg);
                    // console.log(rex)
                    // console.log(value)
                    // console.log(rex.test(value))
                    if (!rex.test(value) && value != "") {
                        let tipMsg = "";
                        switch (item.FieldType) {
                            case "number":
                                tipMsg = "请输入数字格式！";
                                break;
                            case "email":
                                tipMsg = "请输入正确的邮箱格式";
                                break;
                            default:
                                tipMsg = "请填写正确的格式！";
                        }

                        callback(new Error(tipMsg));
                    } else {
                        callback();
                    }
                    if (item.Checked == 'CustPhone') {
                        axios
                            .get("/apiweb/cust/CheckCustPhone", {
                                params: {
                                    FieldId: item.FieldId,
                                    FieldMemo: value
                                }
                            })
                            .then(res => {
                                if (!res.data.ok) {
                                    callback(new Error("字段已存在"));
                                } else {
                                    callback();
                                }
                            })
                            .catch(res => {
                                callback(new Error("验证失败"));
                            });
                    }
                },
                trigger: "blur"
            });
            // console.log(ruleData[item.FieldId])
        }
    });
    return [formData, ruleData, otherArr];
}

// 处理用户编辑后的数据
// 在Date原型上绑定一个格式化日期函数
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
    // yyyy-MM-dd hh:mm:ss 或者 yyyy-MM-dd
}

export const handleData = (...datas) => {
    // console.log(datas)
    const fieldData = datas[0]; // 表单字段data
    const formData = datas[1]; // 表单填写的data
    // console.log(typeof (fieldData))
    // console.log(typeof (formData))
    let multiData = []; // 定义一个多选暂存数组
    fieldData.forEach(item => {
        let thisId = item.FieldId;
        let nwoItem = item;
        nwoItem["FieldMemo"] = '';
        switch (item.FieldType) {
            case 'checkbox':
                nwoItem["Checked"] = formData[thisId];
                nwoItem["FieldMemo"] = formData[thisId];
                break;
            case 'cascader':
                nwoItem["Checked"] = formData[thisId];
                nwoItem["FieldMemo"] = formData[thisId];
                break;
            case 'multipleselect':
                nwoItem["Checked"] = formData[thisId];
                nwoItem["FieldMemo"] = formData[thisId];
                break;
            case 'timerange':
                let timesArr = [];
                if (formData[thisId].length != 0) {
                    for (let item of formData[thisId]) {
                        if (item != '') {
                            let time2 = new Date(item).format("yyyy-MM-dd");
                            console.log(time2);
                            timesArr.push(time2);
                        }
                    }
                    nwoItem["Checked"] = timesArr
                } else {
                    nwoItem["Checked"] = timesArr;
                }
                nwoItem["FieldMemo"] = timesArr;
                break;
            case 'select':
                nwoItem["Checked"] = formData[thisId];
                nwoItem["FieldMemo"] = formData[thisId];
                break;
            case 'radio':
                nwoItem["Checked"] = formData[thisId];
                nwoItem["FieldMemo"] = formData[thisId];
                break;
            case 'time':
                let nowTime = formData[thisId];
                // console.log(nowTime)
                if (nowTime != '') {
                    let time1 = new Date(nowTime).format("yyyy-MM-dd");
                    // console.log(time1);
                    nwoItem["Checked"] = time1;
                    nwoItem["FieldMemo"] = time1;
                } else {
                    nwoItem["Checked"] = "";
                }
                break;
            default:
                nwoItem["FieldMemo"] = formData[thisId];
        }
        multiData.push(nwoItem);
    })
    multiData = JSON.stringify(multiData);
    // console.log(JSON.parse(multiData))
    return multiData;
}