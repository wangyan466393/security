<template>
    <div>
        <template>
            <el-table :data="cameraData" style="width: 65%;min-width:806px;">
                <el-table-column
                    prop="device_name"
                    label="名称"
                    width="146">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="位置"
                    width="280">
                </el-table-column>
                <el-table-column
                    prop="map_location"
                    label="定位信息"
                    width="180">
                </el-table-column>
                <el-table-column
                    label="状态"
                    width="80">
                    <template slot-scope="scope">
                        {{scope.row.status==0?'正常':'非正常'}}
                    </template>
                </el-table-column>
                <el-table-column
                            prop="update_time"
                            label="更新时间"
                            width="180"
                            :formatter="formatDate"
                            >
                </el-table-column>
            </el-table>
        </template>
    </div>
</template>
<script>
export default {
    name:'SystemCamera',
    data() {
        return {
            // 摄像头数据
          cameraData: [],
        }
      },
    methods:{
        formatDate(row, column) {
                // 获取单元格数据
                let data = row[column.property]
                if(data == null) {
                    return null
                }
                let dt = new Date(data)
                 return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
            }
    },
    beforeRouteEnter:function(to,from,next){
        next(function(vm){
            // 摄像头
            vm.$http.get('/api/camer_devices',{
                params:{
                 token:window.localStorage.getItem("userToken")
                }
            }).then(function(response){
                console.log(response.data);
                 vm.cameraData=response.data;
            });
        })
    }
}
</script>
<style>
.el-table th>.cell{
    color: #000;
    text-align: center;
    background: #f9f9f9;
    line-height: 44px;
}
.el-table tr:first-child th {
    padding: 0;
}
.el-table td>.cell{
    text-align: center;
}
</style>
