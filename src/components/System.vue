<template>
    <div>
        <header>
            <el-row>
            <el-col :span="6">
                <div class="grid-content heder-left"></div>
            </el-col>
            <el-col :span="12" class="header-center">
                <div class="grid-content">
                    <router-link to="/system/systemCase" :class="$router.path=='/system/systemCase'?'active':''">
                        案件库管理
                        <span></span>
                    </router-link>
                    <router-link to="/system/systemCamera" :class="$router.path=='/system/systemCamera'?'active':''">摄像头管理<span></span></router-link>
                    <router-link to="/system/systemUser" :class="$router.path=='/system/systemUser'?'active':''">用户管理<span></span></router-link>
                </div>
            </el-col>
            <el-col :span="6">333</el-col>
            </el-row>
        </header>
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    name:'system'
}
</script>
<style>
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
</style>


