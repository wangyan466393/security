<template>
    <div style="position:relative"> 
        <el-tabs class="userTab" type="border-card" @tab-click="tab_change" >
            <el-tab-pane v-for='(item,index) in labelData' :key='index' :name='index+""' :label="item">
                  <template>
                    <el-table @row-click="handleRowClick"
                    :data="userinfoData"
                    style="width: 100%">
                        <el-table-column
                            prop="username"
                            label="用户名"
                            width="120">
                        </el-table-column>
                        <el-table-column 
                            label="密码"
                            width="120">
                            <template slot-scope="{$index,row}">
                                <span v-if="!editUserPwd[$index]">{{row.password}}</span>
                                <el-input :maxlength="6" @blur="updatePwd(row.password)" @keyup.enter.native='updatePwd(row.password)' v-if='editUserPwd[$index]' show-password v-model="row.password"  placeholder="请输入6位数密码"></el-input>
                            </template>
                                
                        </el-table-column>
                        <el-table-column
                            label="身份"
                            width="120"> 
                            <template slot-scope="scope">{{scope.row.user_type==1?'管理员':'普通用户'}}</template>
                        </el-table-column>
                        <el-table-column
                            prop="add_time"
                            label="更新时间"
                            :formatter="formatDate"> 
                        </el-table-column>
                        <el-table-column
                            label="操作"> 
                             <template slot-scope="{$index,row}">
                                 <a href="" @click.prevent='delUser($index,row)'>删除</a>
                                 <a href="" @click.prevent='editUser($index,row)'>修改</a>
                             </template>
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
            trigger="click"
            content=""
            v-model="visible">
            <el-row>
                <el-col :span="23">
                <el-form :label-position="labelPosition" label-width="100px" :model="userinfo">
                    <el-form-item label="姓名：">
                    <el-input ref='refUserName' v-model="userinfo.username" @blur="usernameBlur" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="密码：">
                    <el-input :maxlength="6" style="ime-mode:disabled;"  v-model="userinfo.password" clearable></el-input>
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
                v-show="tab_index==0"
                type="primary"
                slot="reference"
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
            },
            user_id:'',
            indexStatus:'', //编辑指定行下标
            editUserPwd: [],    //编辑用户密码切换
        }
    },
    methods:{
        handleRowClick(row, column, event){
            console.log(row, column, event)
            if (row.id != this.user_id) {              
                this.editUserPwd[this.indexStatus] = false;
                this.$set(this.editUserPwd, this.indexStatus, false);  
            }
        },
       
        // 删除用户
                delUser: function(index,row) {
                    console.log(row);
                    // 1.弹出提示框，确认是否删除
                    if(confirm("您确定要删除本条记录吗？？？")){

                        // 执行删除操作
                        // console.log(row.id);
                        var that=this;
                        this.$http.delete('/api/userinfo_delete/'+row.id+'/',{
                            params:{
                                token:window.localStorage.getItem("userToken")
                            }
                        }).then(function(response){
                            console.log(response);
                            if (response.status == 200) {
                                that.$message({
                                    message: '删除用户成功',
                                    type: 'success'
                                });
                                that.tab_index=(that.tab_index==0)?'':that.tab_index;
                                that.getUserinfo(that.tab_index);
        
                            }else{
                                that.$message.error('删除失败，请重试！');
                            }
                        })
                    }else{
                        //用户不删除，不做任何操作
                        // console.log('不删除');
                    }
                },
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
          console.log(targetName)
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
                // console.log(response.data);
                app.userinfoData = response.data;
            });
        },
        // 添加用户
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
                    app.$message({
                    message: '新增用户成功',
                    type: 'success'
                    });
                    app.visible = false;
                    app.userinfo='';
                    app.getUserinfo(app.tab_index);

            }).catch(function(error){
               app.$message.error('新增失败，请填写完整信息！');
            })
        },
        // 添加用户用户名验证
        usernameBlur(){
            let self = this;
            console.log(this.userinfo.username);
            for(var i=0;i<this.userinfoData.length;i++){
                // console.log(this.userinfoData[i].username);
                if(this.userinfo.username==this.userinfoData[i].username){
                    // console.log('用户名已存在，请重新填写');
                    this.$message({
                        message: '用户名已存在，请重新填写',
                        type: 'warning'
                    });
                    this.$refs.refUserName.focus();
                }
            }
        },
        // 修改用户
        editUser(index,row){
            console.log(row);
            this.user_id=row.id;
            this.indexStatus = index;
            this.editUserPwd[index] = true;
            this.$set(this.editUserPwd, index, true);
        },
         // 修改密码
         updatePwd(val){
             var that = this;
             var data = qs.stringify({
                id:this.user_id,
                password:val
             })
             console.log(val);
            this.$http.put("/api/userinfo_update",data,{
            params:{
                token:window.localStorage.getItem("userToken")
            }
            }).then(function(response){
                console.log(response);
                if (response.status == 200 && response.data.length>0) {
                    that.$message({
                    message: '用户密码修改成功！',
                    type: 'success'
                    });
                    that.tab_index=(that.tab_index==0)?'':that.tab_index;
                    that.getUserinfo(that.tab_index);
                    that.editUserPwd[that.indexStatus] = false;
                    that.$set(that.editUserPwd, that.indexStatus, false);
                }else{
                that.$message.error('修改密码失败，请重试！');
                }
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
