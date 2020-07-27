
import axios from 'axios';
import {
    Message,
    MessageBox
} from 'element-ui'
// axios发送ajax请求
const _axios = axios.create({
    baseURL: 'http://172.16.1.104:8000'
})
// let pending = []; //声明一个数组用于存储每个请求的取消函数和axios标识
// let cancelToken = axios.CancelToken;
// let removePending = (config) => {
//     for (let i in pending) {
//         if (pending[i].url === axios.defaults.baseURL + config.url) { //在当前请求在数组中存在时执行取消函数
//             pending[i].f(); //执行取消操作
//             //pending.splice(i, 1); 根据具体情况决定是否在这里就把pending去掉
//             // console.log(pending[i].url);
//         }
//     }
// }


// _axios.interceptors.request.use(config => {
//     removePending(config); //在一个axios发送前执行一下判定操作，在removePending中执行取消操作
//     // console.log(config.url);
//     config.cancelToken = new cancelToken(function executor(c){//本次axios请求的配置添加cancelToken
//     pending.push({
//         // url: config.url,
//         url: axios.defaults.baseURL+config.url,
//         f:c
//     }); 
//     // console.log(axios.defaults.baseURL+config.url);
//     //将本次的url添加到pending中，因此对于某个url第一次发起的请求不会被取消，因为还没有配置取消函数
// });
//     return Promise.resolve(config);
// }, error => {
//     return Promise.reject(error)
// })
// _axios.interceptors.response.use(data => { 
//     removePending(data.config); //在一个axios响应后再执行一下取消操作，把已经完成的请求从pending中移除
//     console.log(data.config);//如果返回undefined说明被拦截了
//     return Promise.resolve(data)
    
//     }, error => {
//         console.log(error)
//     //加载失败
//     MessageBox.confirm(
//                 '你已被登出，可以取消继续留在该页面，或者重新登录',
//                 '确定登出', {
//                 confirmButtonText: '重新登录',
//                 cancelButtonText: '取消',
//                 type: 'warning'
//             }
//             ).then(() => {
//                 window.location.href = '/';
//             })
//     return {'data':{}}
//     })



// 配置默认的host,假如你的API host是：http://api.htmlx.club
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
