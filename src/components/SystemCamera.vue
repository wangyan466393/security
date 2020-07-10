<template>
    <div style="position:realtive">
        <el-popover
        placement="bottom"
        title="新增摄像头"
        width="500"
        trigger="manual"
        content=""
        v-model="visible"
        >
        <!--<el-row>
             <el-col :span="8" style="margin-top: 50px;">
                <div style="text-align:center;">
                    <img class="escapeImg" :src="imageUrl" alt  />
                </div>
            </el-col>
            <el-col :span="16">
            <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign">
                
                <el-form-item style="text-align:right;">
                    <el-button type="primary"  style="padding: 8px 20px;">确定</el-button>
                </el-form-item>
            </el-form>
            </el-col>
        </el-row> -->
        <el-button
            type="primary"
            slot="reference"
            @click="visible = !visible"
            round
            style="position: absolute;right: 100px;top: 12px;padding: 8px 17px;"
            icon="el-icon-plus"
        >新增</el-button>
    </el-popover>
        <template>
            <el-table :data="cameraData" style="float:left;width: 65%;min-width:806px;">
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
                    width="120">
                    <template slot-scope="scope">
                        {{scope.row.map_location|toMapLocation}}
                    </template>
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
            <div style="float:left;width:30%;margin-left:4%;">
                <live-map ></live-map>
            </div>
        </template>
        
    </div>
</template>
<script>
import LiveMap from "./Map.vue";
export default {
    name:'SystemCamera',
    components: {
        LiveMap
    },
    data() {
        return {
            // 摄像头数据
          cameraData: [],
          labelPosition: "right",
          visible:false
        }
      },
    filters:{
        toMapLocation:function(str){
            var arr=str.split(",");
            for(var i=0;i<arr.length;i++){
                arr[i]=Math.round(arr[i]); 
            }
            arr[0]=arr[0]+'N';
            arr[1]=arr[1]+'E';
            return  arr.toString();
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
