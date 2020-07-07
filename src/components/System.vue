<template>
    <div>
        <header>
            <el-row>
            <el-col :span="6">
                <div class="grid-content heder-left"></div>
            </el-col>
            <el-col :span="12" class="header-center">
                <div class="grid-content">
                    <a href="">
                        案件库管理
                        <span></span>
                    </a>
                    <a href="">摄像头管理</a>
                    <a href="">用户管理</a>
                </div>
            </el-col>
            <el-col :span="6">333</el-col>
            </el-row>
        </header>
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
    color: #fff;
    text-decoration: none;
    color: rgb(182, 182, 182);
    font-size: 14px;
    margin-right: 20px;
    line-height: 60px;
}
</style>


