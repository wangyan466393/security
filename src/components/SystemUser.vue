<template>
    <div>
        <el-tabs type="border-card" @tab-click="tab_change">
            <el-tab-pane v-for='(item,index) in labelData' :key='index' :label="item">{{item}}</el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
export default {
    name:'SystemUser',
    data(){
        return{
            labelData:['全部用户','管理员','普通用户'],
            tab_index:0,
            userinfoData:[]
        }
    },
    methods:{
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
        // 被偷车辆
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
    },
    created:function(){
        this.getUserinfo()
    },
}
</script>
<style>
.el-tabs--border-card > .el-tabs__header{
  width: 277px;
}
</style>
