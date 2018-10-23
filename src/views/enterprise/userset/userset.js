// 绘制表头信息
export const tableHead = [
    // thead
    {
        type: "selection",
        width: 60,
        fixed: "left",
        align: "center"
    },
    {
        title: "姓名",
        key: "UserName",
        fixed: "left",
        width: 150,
        render: (h, params) => {
            // 使用vue render函数处理table中td里面的switch渲染及事件处理
            // console.log(params);
            let that = this;
            let name = params.row.UserName;
            let tips = "点击编辑" + name + "的信息";
            let userData = params.row;
            return h(
                "div", {
                    attrs: {
                        class: "table-name"
                    },
                    style: {
                        overflow: "hidden",
                        height: "100%",
                        width: "100%"
                    }
                }, [
                    h("span", {
                        style: {
                            lineHeight: "30px"
                        },
                        domProps: {
                            innerHTML: name
                        }
                    }),
                    h(
                        "el-tooltip", {
                            //数据库1是已处理，0是未处理
                            props: {
                                effect: "dark",
                                content: tips,
                                placement: "right"
                            },
                            style: {
                                float: "right"
                            }
                        }, [
                            h("Button", {
                                //数据库1是已处理，0是未处理
                                props: {
                                    type: "text",
                                    icon: "edit"
                                },
                                style: {
                                    float: "right",
                                    color: "#2d8cf0"
                                },
                                on: {
                                    click: event => {
                                        // 阻止冒泡事件
                                        event.stopPropagation();
                                        // this.openModal(3,userData);
                                        return that.openModal(3, userData);
                                    }
                                }
                            })
                        ]
                    )
                ]
            );
        }
    },
    {
        title: "电话",
        minWidth: 150,
        key: "UserPhone"
    },
    {
        title: "邮箱",
        minWidth: 200,
        key: "UserMail",
        render: (h, params) => {
            const row = params.row;
            const text =
                row.UserMail == null || row.UserMail == "" ? "无" : row.UserMail;
            return h("span", text);
        }
    },
    {
        title: "头像",
        minWidth: 150,
        key: "photo",
        render: (h, params) => {
            // 使用vue render函数处理table中td里面的switch渲染及事件处理
            // console.log(params);
            let that = this;
            // let name = params.row.name;
            let url =
                "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg";
            return h("img", {
                attrs: {
                    src: url
                },
                style: {
                    marginTop: "6px",
                    display: "inline-block",
                    height: "40px",
                    width: "40px"
                }
            });
        }
    },
    {
        title: "部门",
        minWidth: 150,
        key: "DepartName",
        render: (h, params) => {
            const row = params.row;
            const text =
                row.DepartName == null || row.DepartName == "" ?
                "无" :
                row.DepartName;
            return h("span", text);
        }
    },
    {
        title: "角色",
        minWidth: 150,
        key: "RoleName",
        render: (h, params) => {
            const row = params.row;
            const text =
                row.RoleName == null || row.RoleName == "" ? "无" : row.RoleName;
            return h("span", text);
        }
    },
    {
        title: "昵称",
        minWidth: 150,
        key: "UserNick",
        render: (h, params) => {
            const row = params.row;
            const text =
                row.UserNick == null || row.UserNick == "" ? "无" : row.UserNick;
            return h("span", text);
        }
    },
    {
        title: "是否在线",
        minWidth: 150,
        key: "IsLine",
        render: (h, params) => {
            const row = params.row;
            const color = row.online == 1 ? "green" : "#ccc";
            const text = row.online == 1 ? "在线" : "下线";
            return h(
                "Tag", {
                    props: {
                        type: "dot",
                        color: color
                    }
                },
                text
            );
        }
    },
    {
        title: "登录时间",
        minWidth: 200,
        key: "LoginTime"
    }
]