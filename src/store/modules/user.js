import Cookies from 'js-cookie';

const user = {
    state: {
        userId: ''
    },
    mutations: {
        setUserId(state, data) {
            state.userId = Cookies.get('yh_web_UserId')
        },
        logout(state, vm) {
            // Cookies.remove('user');
            // Cookies.remove('password');
            // Cookies.remove('access');
            // 清空cooke
            Cookies.remove('yh_web_UserId'); //用户id
            Cookies.remove('yh_web_ComId'); // 公司id
            Cookies.remove('yh_web_UserName'); // 姓名
            Cookies.remove('yh_web_UserMail'); // 邮箱
            Cookies.remove('yh_web_UserPhone'); // 手机号
            Cookies.remove('reload_num'); // 重载计数器
            Cookies.remove('url');
            state.userId = ''
            // 恢复默认样式
            let themeLink = document.querySelector('link[name="theme"]');
            themeLink.setAttribute('href', '');
            // 清空打开的页面等数据，但是保存主题数据
            let theme = '';
            if (localStorage.theme) {
                theme = localStorage.theme;
            }
            localStorage.clear();
            if (theme) {
                localStorage.theme = theme;
            }
        }
    }
};

export default user;