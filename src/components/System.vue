<template>
    <div>
        <header>
            <el-row>
            <el-col :span="6">
                <div class="grid-content heder-left"></div>
            </el-col>
            <el-col :span="14" class="header-center">
                <div class="grid-content">
                    <router-link to="/system/systemCase" :class="$route.path=='/system/systemCase'?'active':''">
                        案件库管理
                        <span v-show="$route.path=='/system/systemCase'"></span>
                    </router-link>
                    <router-link to="/system/systemCamera" :class="$route.path=='/system/systemCamera'?'active':''">
                        摄像头管理
                        <span v-show="$route.path=='/system/systemCamera'"></span>
                    </router-link>
                    <router-link to="/system/systemUser" :class="$route.path=='/system/systemUser'?'active':''">
                       用户管理
                       <span v-show="$route.path=='/system/systemUser'"></span>
                    </router-link>
                </div>
            </el-col>
            <el-col :span="4" class="header-right">
                <img src="../images/wy-sysBell.png" alt="">
                <img class="userImg" src="../images/wy-sysUser.png" alt="">
                <span >{{LoginName}}</span>
            </el-col>
            </el-row>
        </header>
        <!--  -->
        <div class="main">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
export default {
    name:'system',
    data() {
        return {
            LoginName:''
        };
    },
    created() {
    this.LoginName = window.localStorage.getItem("username");
    },
}
</script>
<style scoped>
body{
    background: #f9f9f9;
}
header{
    height: 70px;
    background: #2D333E;
    color: #fff;
}
header div{
    height: 100%;
}
header .el-row{
    width: 96%;
    margin: 0 auto;
    background: #2D333E;
}
.heder-left{
    width: 100%;
    height: 100%;
    background: url('../images/wy-headerLeft.png') no-repeat;
    background-size: 66%;
    background-position: center;
}
.header-center>div{
    width: 50%;
    margin: 0 auto;
}
.header-center a{
    display: inline-block;
    position: relative;
    color: #fff;
    text-decoration: none;
    color: rgb(182, 182, 182);
    font-size: 14px;
    margin-right: 20px;
    line-height: 60px;
}
.grid-content .active{
    color: #fff;
}
.grid-content a>span{
    position: absolute;
    bottom: 5px;
    left:32px;
    width: 8px;
    height: 8px;
    background: #fff;
    border-radius: 50%;
}
.grid-content a:last-child>span{
    left:22px;
}
.header-right span{
    line-height: 70px;
    margin-left: 10px;
}
.header-right>img:first-child{
    float: left;
    height: 24px;
    margin-top: 23px;
    margin-right: 40px;
}
.header-right>img.userImg{
    float: left;
    height: 30px;
    margin-top: 20px;
    
}
.main{
    width: 90%;
    padding: 30px;
    margin: 38px auto;
    background: #fff;
    box-shadow: 2px 2px 2px #eee;
    overflow: hidden;
}
</style>


