<template>
    <div style="position:relative"> 
        <el-tabs class="userTab" type="border-card" @tab-click="tab_change">
            <el-tab-pane v-for='(item,index) in labelData' :key='index' :label="item">
                  <template>
                    <el-table
                    :data="userinfoData"
                    style="width: 100%">
                        <el-table-column
                            prop="username"
                            label="用户名"
                            width="100">
                        </el-table-column>
                        <el-table-column
                            prop="password"
                            label="密码"
                            width="100">
                        </el-table-column>
                        <el-table-column
                
                            label="身份"
                            width="100"> 
                            <template slot-scope="scope">{{scope.row.user_type==1?'管理员':'普通用户'}}</template>
                        </el-table-column>
                        <el-table-column
                            prop="add_time"
                            label="更新时间"
                            :formatter="formatDate"> 
                        </el-table-column>
                        <el-table-column
                            label="操作"> 
                             <a href="">删除</a>
                             <a href="">修改</a>
                        </el-table-column>
                    </el-table>
                </template>
            </el-tab-pane>
        </el-tabs>
        
        <el-popover
           popper-class="myPopover"
            placement="bottom"
            title="新增用户"
            width="300"
            trigger="manual"
            content=""
            v-model="visible">
            <el-row>
                <el-col :span="23">
                <el-form :label-position="labelPosition" label-width="100px" :model="userinfo">
                    <el-form-item label="姓名：">
                    <el-input v-model="userinfo.username" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="密码：">
                    <el-input v-model="userinfo.password" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="身份：">
                        <el-radio-group v-model="userinfo.user_type">
                        <el-radio  label="1">管理员</el-radio>
                        <el-radio  label="2">用  户</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item style="text-align:right;">
                        <el-button type="primary" @click="addUser" style="padding: 8px 20px;">确定</el-button>
                    </el-form-item>
                </el-form>
                </el-col>
            </el-row>
            <el-button
                type="primary"
                slot="reference"
                @click="visible = !visible"
                round
                style="position: absolute;right: 100px;top: 12px;padding: 8px 17px;"
                icon="el-icon-plus"
            >新增</el-button>
        </el-popover>
    </div>
</template>
<script>
import qs from 'querystring';
export default {
    name:'SystemUser',
    data(){
        return{
            labelData:['全部用户','管理员','普通用户'],
            tab_index:0,
            userinfoData:[],
            visible:false,
            labelPosition: "right",
            userinfo:{
                username:'',
                password:'',
                user_type:''
            }
        }
    },
    methods:{
        // p为不够10添加0的函数
            p(s) {
                return s < 10 ? '0' + s : s
            },
        //时间方法区
        formatDate(row, column) {
            // 获取单元格数据
            let data = row[column.property];
            if (data == null) {
                return null;
            }
            let dt = new Date(data);
            return (
                dt.getFullYear() +
                "-" +
                this.p((dt.getMonth() + 1)) +
                "-" +
                this.p(dt.getDate()) +
                " " +
                this.p(dt.getHours()) +
                ":" +
                this.p(dt.getMinutes()) +
                ":" +
                this.p(dt.getSeconds())
            );
        },
        tab_change(targetName){
          console.log(targetName.index)
          this.tab_index = targetName.index;
          if(this.tab_index==0){
              this.tab_index=''
          }
          this.getUserinfo(this.tab_index);
       },
       getUserinfo(usertype=''){
        var app=this
        // 用户信息
        this.$http.get("/api/userinfo", {
            params: {
                token: window.localStorage.getItem("userToken"),
                usertype:usertype
            }
            })
            .then(function(response) {
                console.log(response.data);
                app.userinfoData = response.data;
            });
        },
        addUser(){
            var app = this;
            var data = qs.stringify({
                username: this.userinfo.username,
                password: this.userinfo.password,
                user_type: this.userinfo.user_type,
            })
            console.log(data);
            app.$http.post("/api/userinfo", data,{
                params: {
                    token: window.localStorage.getItem("userToken")
                }
            }).then(function(response) {
                // console.log(response);
                app.visible = false;
                app.getUserinfo();
            })
        }
    },
    created:function(){
        this.getUserinfo()
    },
}
</script>
<style>
.userTab.el-tabs--border-card > .el-tabs__header{
  width: 277px;
}
.el-popover.myPopover{
    left: 850px!important;
}
.el-popover.myPopover .el-form-item__label{
  width: 70px!important;
}
.el-popover.myPopover .el-form-item__content{
  margin-left:70px!important; 
}
a{
    text-decoration: none;
    color: #606266;
    font-size: 14px;
}
</style>
