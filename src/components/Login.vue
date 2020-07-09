<template>
  <div class="login">
      <div class="logo">
        <img src="../images/wy-logo.png" alt="">
      </div>
      <div class="splitLine">
        <img src="../images/wy-hr.png" alt="">
      </div>
      <div class="main">
          <div>
            <img src="../images/wy-system.png" alt="">
          </div>
          <div class="login-list">
              <input class="login-info" v-model="username" type="text">
              <input class="login-info pwd" v-model="password" type="password">
              <div class="login-local">
                <input type="checkbox" v-model='remember'>
                记住账号
              </div>
              <div class="login-btn" @click="dologin">登录</div>
          </div>
      </div>
      <footer>
        Copyright © 2018—2020 Lenovo.EDU rights reserved
      </footer>
  </div>
</template>

<script>
import qs from 'querystring';
// 引入base64
const Base64 = require('js-base64').Base64;
export default {
  name: 'Login',
  data () {
    return {
      username: "",
      password: "",
      remember:''
    }
  },
      created () {
        // 在页面加载时从cookie获取登录信息
        let username = this.getCookie("username")
        let password = Base64.decode(this.getCookie("password"))
        // 如果存在赋值给表单，并且将记住密码勾选
        if(username){
            this.username = username
            this.password = password
            this.remember = true
        }
        // console.log(this.username)
        // console.log(this.password)
    },
  methods:{
    // 储存表单信息
        setUserInfo:function() {
            // 判断用户是否勾选记住密码，如果勾选，向cookie中储存登录信息，
            // 如果没有勾选，储存的信息为空
            console.log(this.remember);
            if(this.remember){
                this.setCookie("username",this.username)
                // base64加密密码
                let password = Base64.encode(this.password)
                this.setCookie("password",password);
                this.setCookie("remember",this.remember)
            }else{
                this.setCookie("username","")
                this.setCookie("password","")
            }
        },
     // 执行用户登录操作
    dologin:function() {
      var app = this;
      var data = qs.stringify({
          username: this.username,
          password: this.password
      })
      app.$http.post("/api/login", data).then(function(response) {
          // console.log(response.data);
            if(response.data.status === 0){
              
              window.localStorage.setItem("userToken", response.data.result.token);
              console.log(response.data.result.token);
              if(response.data.result.user_type==1){
                // console.log('管理员');
                app.$router.push('/system/systemCase')
              }else if(response.data.result.user_type==2){
                // console.log('普通');
                app.$router.push('/securityscreen')
              }
              // 储存登录信息
                app.setUserInfo()
          }else{
            alert("对不起账号密码错误请重新输入。。")
          }
        });
    },

    // 获取cookie
        getCookie: function (key) {
            if (document.cookie.length > 0) {
            var start = document.cookie.indexOf(key + '=')
            if (start !== -1) {
                start = start + key.length + 1
                var end = document.cookie.indexOf(';', start)
                if (end === -1) end = document.cookie.length
                return unescape(document.cookie.substring(start, end))
            }
            }
            return ''
        },
        // 保存cookie
        setCookie: function (cName, value, expiredays) {
            var exdate = new Date()
            exdate.setDate(exdate.getDate() + expiredays)
            document.cookie = cName + '=' + decodeURIComponent(value) +
            ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
        }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.login{
  background-image: url('../images/wy-loginBg.png');
  background-size: cover;
  background-position: 50%;
  position: fixed;
  width: 100%;
  height: 100%;
}
.login .logo{
  margin-left:96px;
  margin-top: 42px;
}
.login .logo>img{
  height: 35px;
}
.splitLine{
  margin-top: 14px;
  margin-left: 300px;
}
.splitLine img{
  height: 2px;
  width: 100%;
}
.main{
  margin-top: 100px;
  overflow: hidden;
}
.main>div{
  float: left;
}
.main img{
  height: 306px;
}
.login-list{
  /* display: inline-block; */
  height: 306px;
  width: 447px;
  margin-left: 30px;
  background: url('../images/wy-formBg.png') 100%;
}
.login-list>input{
  display: block;
  width: 228px;
  height: 35px;
  margin: 0 auto;
  border: 1px solid #fff;
  text-indent: 44px;
  color: #fff;
}
.login-list>input:first-child{
  margin-top: 50px;
  margin-bottom: 30px;
  background:rgba(0,0,0,0) url('../images/wy-user.png') no-repeat left center;
  background-size: 30px;
}
input.pwd{
  background:rgba(0,0,0,0) url('../images/wy-pwd.png') no-repeat 4px center;
  background-size: 22px;
}
.login-local{
  color: #fff;
  margin-left: 120px;
  margin-top: 20px;
  font-size: 12px;
  /* vertical-align: middle; */
}
.login-local>input{
  background: rgba(0,0,0,0);
  vertical-align: middle;
}
.login-btn{
  background:rgba(65,162,187,0.6);
  width: 100px;
  height: 30px;
  border-radius: 15px;
  margin: 20px auto;
  color: #fff;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
}
footer{
  color: #fff;
  position: absolute;
  bottom: 20px;
  left: 160px;
}
</style>
