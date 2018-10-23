// 选项列表
export const types = [{
        value: 'input',
        label: '文本输入框',
        showReg: true,
        reg: '',
        showUrl: true
    },
    {
        value: 'textarea',
        label: '多行文本输入框',
        showReg: true,
        reg: '',
        showUrl: false
    },
    {
        value: 'number',
        label: '数字',
        showReg: true,
        reg: '^\\d+(\\.\\d+)?$',
        showUrl: true
    },
    {
        value: 'email',
        label: 'Email',
        showReg: true,
        reg: '^(w)+(.w+)*@(w)+((.w+)+)$',
        showUrl: true
    },
    {
        value: 'radio',
        label: '单项选择',
        showReg: false,
        reg: '',
        showUrl: false,
        options: [{
            value: ''
        }],
        checkType: 'RadioGroup'
    },
    {
        value: 'checkbox',
        label: '多项选择',
        showReg: false,
        reg: '',
        showUrl: false,
        options: [{
            value: ''
        }],
        checkType: 'CheckboxGroup'
    },
    {
        value: 'select',
        label: '下拉框',
        showReg: false,
        reg: '',
        showUrl: false,
        options: [{
            value: ''
        }]
    },
    {
        value: 'multipleselect',
        label: '下拉框（多选）',
        showReg: false,
        reg: '',
        showUrl: false,
        options: [{
            value: ''
        }]
    },
    {
        value: 'cascader',
        label: '下拉框（级联选择）',
        showReg: false,
        reg: '',
        showUrl: false,
        options: [{
            value: '',
            children: [{
                value: ''
            }]
        }]
    },
    {
        value: 'time',
        label: '时间',
        showReg: false,
        reg: '',
        showUrl: false,
        type: '',
        checked: 'date'
    },
    {
        value: 'timerange',
        label: '时间范围',
        showReg: false,
        reg: '',
        showUrl: false,
        type: '',
        checked: 'daterange'
    },
    {
        value: 'regular',
        label: '正则表达式',
        showReg: true,
        reg: '',
        showUrl: false
    },
    {
        value: 'url',
        label: '链接地址',
        showReg: true,
        reg: '[a-zA-z]+:\\/\\/[^s]*',
        showUrl: false
    },
    {
        value: 'tel',
        label: '手机号码',
        showReg: true,
        reg: '^1(3|4|5|7|8)\\d{9}$',
        showUrl: true
    },
    {
        value: 'phone',
        label: '电话号码',
        showReg: true,
        reg: '^\\d{3}-\\d{7,8}|\\d{4}-\\d{7,8}$',
        showUrl: true
    },
    {
        value: 'ip',
        label: 'IP地址',
        showReg: true,
        reg: '^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$',
        showUrl: false
    }
];