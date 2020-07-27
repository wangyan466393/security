import axios from 'axios';
import {
    Message,
    MessageBox
} from 'element-ui'
// axios发送ajax请求
const _axios = axios.create({
    baseURL: 'http://172.16.1.104:8000'
})
// 添加请求拦截器
_axios.interceptors.request.use(function (config) {
   
    if (window.localStorage.getItem('userToken')) {
        config.headers.Authorization = window.localStorage.getItem('userToken');
    }
    //    console.log(window.localStorage.getItem('userToken'));
    return config
}, function (error) {
    console.log(ajax + '   1');
    return Promise.reject(error)
});


//     // 添加响应拦截器
_axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // console.log(response)
    // removePending(response.config);  
    return response
}, function (error) {
    console.log(error.response)
    if (error.response.status == 403) {
        MessageBox.confirm(
            '你已被登出，可以取消继续留在该页面，或者重新登录',
            '确定登出', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
        }
        ).then(() => {
            window.location.href = '/';
        })
    }   
    return Promise.reject(error)
})
export default _axios;
