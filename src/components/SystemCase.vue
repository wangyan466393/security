<template>
    <div>
        <el-tabs type="border-card">
            <el-tab-pane label="在逃犯管理">
                 <template>
                    <el-table
                    :data="fugitiveData"
                    style="width: 100%">
                        <el-table-column
                            prop="person_name"
                            label="姓名"
                            width="80">
                        </el-table-column>
                        <el-table-column
                            label="性别"
                            width="80">
                             <template slot-scope="scope">
                                 {{scope.row.gender==1?'男':'女'}}
                             </template>
                        </el-table-column>
                        <el-table-column
                            label="照片"
                            width="80"
                            >
                            <template slot-scope="scope">
                               <img :src="scope.row.person_img" width="40" height="40" class="head_pic"/>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="identity_id"
                            label="身份证号"
                            width="160">
                        </el-table-column>
                        <el-table-column
                            prop="case_type"
                            label="案件类型"
                            width="100">
                        </el-table-column>
                        <el-table-column
                            prop="escape_time"
                            label="逃离时间"
                            width="180"
                            :formatter="formatDate"
                            >
                        </el-table-column>
                        <el-table-column
                            label="当前状态"
                            width="180">
                            <template slot-scope="scope">
                                 {{scope.row.status==1?'在逃':'已结案'}}
                             </template>
                        </el-table-column>
                        <el-table-column
                            prop="update_time"
                            label="更新时间"
                            width="180"
                            :formatter="formatDate"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="update_time"
                            label="操作"
                            width="180"
                            :formatter="formatDate"
                            >
                        </el-table-column>
                    </el-table>
                </template>
            </el-tab-pane>
            <el-tab-pane label="被偷车辆管理">被偷车辆管理</el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
export default {
    name:'SystemCase',
    data() {
        return {
          fugitiveData: []
        }
      },
    beforeRouteEnter:function(to,from,next){
        next(function(vm){
            vm.$http.get('/api/escape_persons',{
                params:{
                 token:window.localStorage.getItem("userToken")
                }
            }).then(function(response){
                console.log(response.data);
                vm.fugitiveData=response.data;
            })
        })
    },
    methods:{
       //方法区
            formatDate(row, column) {
                // 获取单元格数据
                let data = row[column.property]
                if(data == null) {
                    return null
                }
                let dt = new Date(data)
                 return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
            }
    }
}
</script>
<style>
.el-tabs--border-card>.el-tabs__header{
    width: 240px;
}
.el-table th>.cell{
    color: #000;
}
</style>
