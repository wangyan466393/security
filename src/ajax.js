
import axios from 'axios';
import ajax from './router';
// axios发送ajax请求
const _axios = axios.create({
    baseURL:'http://172.16.1.104:8000'
})
// 配置默认的host,假如你的API host是：http://api.htmlx.club
// 添加请求拦截器
_axios.interceptors.request.use(function (config) {
    　　// 在发送请求之前做些什么
    if (window.localStorage.getItem('userToken')) {
        config.headers.Authorization = window.localStorage.getItem('userToken');
    }
       console.log(window.localStorage.getItem('userToken'));
    　　return config
    }, function (error) {
    　　// 对请求错误做些什么
       console.log(ajax+'   1');
      return Promise.reject(error)
    });    
    // 添加响应拦截器
_axios.interceptors.response.use(function (response) {
    　　// 对响应数据做点什么
    　　return response
    }, function (error) {
    　　// 对响应错误做点什么
        window.location.href='/';
    　　return Promise.reject(error)
    })  
export default _axios;
