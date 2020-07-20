import axios from 'axios';
// axios发送ajax请求
// 1.直接使用axios函数
// 2.借助辅助函数
// 3.创建实例对象
const request = axios.create({
    baseURL:'http://172.16.1.104:8000'
})

export default request;