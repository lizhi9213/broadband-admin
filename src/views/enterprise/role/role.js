export const handlePowerData = (...arr) => {
    // console.log(arr);
    const listArr = arr[0]; // 结构数据
    const powerArr = arr[1]; // 权限数据
    // console.log(JSON.stringify(powerArr));
    let powerList = []; // 渲染到页面到权限列表数据
    // 遍历结构数据，每次循环节点查询是否有这个权限
    for (let [index, item] of listArr.entries()) {
        let parItem = {
            text: item.title,
            children: [] //第二层菜单集合
        }
        if (item.children.length == 1) {
            // console.log(powerArr[index])
            // 有一个子集
            parItem.id = item.children[0].id;
            // 查找权限，并设置
            let nowPlist = powerArr.find(list => {
                return list.id == item.id
            });
            if (!nowPlist) {
                throw new Error('无法根据当前的ID查找到权限!当前ID为：' + item.id);
            }
            // console.log(nowPlist);
            parItem.children.push({
                id: "001",
                text: "查看",
                isCheck: (nowPlist.isCheck == 1 ? true : false)
            });
            powerList.push(parItem);
            continue; // 结束当前循环进入下一次循环
        } else {
            // 有子集再次遍历循环子集
            for (let [seri, child] of item.children.entries()) {
                let nowClist = powerArr.find(info => {
                    return info.id == child.id
                });
                // console.log(nowClist);
                if (!nowClist) {
                    throw new Error('无法根据当前的ID查找到权限!当前ID为：' + child.id);
                }
                let childItem = {
                    text: child.title,
                    id: child.id,
                    children: [{
                        id: "001",
                        text: "查看",
                        isCheck: (nowClist.isCheck == 1 ? true : false)
                    }]
                }
                parItem.children.push(childItem);
            }
            powerList.push(parItem);
        }
    }
    return powerList;
}