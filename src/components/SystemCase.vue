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
                            <template slot-scope="scope"  :show-overflow-tooltip="true">
                               <img :src="'data:image/jpeg;base64,'+scope.row.person_img" width="50" height="33.35" class="head_pic"/>
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
                            width="80">
                            <template slot-scope="scope">
                                 {{scope.row.status==0?'已结案':scope.row.status==1?'在逃':'已报警'}}
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
                            label="操作"
                            
                            >
                            <i class="el-icon-edit-outline"></i>
                        </el-table-column>
                    </el-table>
                </template>
            </el-tab-pane>
            <el-tab-pane label="被偷车辆管理">
                <template>
                    <el-table
                    :data="stolenCarData"
                    style="width: 100%">
                        <el-table-column
                            prop="car_number"
                            label="车牌号"
                            width="80">
                        </el-table-column>
                        <el-table-column
                            prop='car_color'
                            label="颜色"
                            width="80">
                        </el-table-column>
                        <el-table-column
                            label="品牌"
                            width="80"
                            prop='car_model'
                            >
                        </el-table-column>
                        <el-table-column
                            prop="owner_name"
                            label="车主姓名"
                            width="120">
                        </el-table-column>
                        <el-table-column
                            prop="owner_identify"
                            label="车主身份证号"
                            width="160">
                        </el-table-column>
                        <el-table-column
                            prop="stolen_time"
                            label="被盗时间"
                            width="180"
                            :formatter="formatDate"
                            >
                        </el-table-column>
                        <el-table-column
                            label="当前状态"
                            width="80">
                            <template slot-scope="scope">
                                 {{scope.row.status==0?'已结案':scope.row.status==1?'在逃':'已报警'}}
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
                            label="操作"
                            >
                            <i class="el-icon-edit-outline"></i>
                        </el-table-column>
                    </el-table>
                </template>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
export default {
    name:'SystemCase',
    data() {
        return {
            // 在逃犯数据
          fugitiveData: [],
            // 被偷车辆数据
          stolenCarData:[]
        }
      },
    beforeRouteEnter:function(to,from,next){
        next(function(vm){
            // 在逃犯
            vm.$http.get('/api/escape_persons',{
                params:{
                 token:window.localStorage.getItem("userToken")
                }
            }).then(function(response){
                console.log(response.data);
                vm.fugitiveData=response.data;
            });
            // 被偷车辆
            vm.$http.get('/api/stolen_cars',{
                params:{
                 token:window.localStorage.getItem("userToken")
                }
            }).then(function(response){
                console.log(response.data);
                vm.stolenCarData=response.data;
            });
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
    width: 236px; 
}
.el-table th>.cell{
    color: #000;
    text-align: center;
    background: #f9f9f9;
    line-height: 44px;
}
.el-table td>.cell{
    text-align: center;
}
.el-table tr:first-child th {
    padding: 0;
}
</style>
