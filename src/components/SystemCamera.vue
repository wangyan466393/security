<template>
    <div style="position:relative;">
        <el-popover
        popper-class="myPopover0"
        placement="bottom"
        title="新增摄像头"
        width="600"
        trigger="click"
        content=""
        v-model="visible"
        >
        <el-row>
             <el-col :span="9" style="margin-top: 20px;">
                <div style="text-align:center;">
                    <div class="amap-page-container" style='height:220px;'>
                        <el-amap ref="map" vid="amapPop" :plugin="plugin"  :center="center" :zoom="zoom"  :events="events" >
                        </el-amap>
                    </div>
                    <!-- <img class="escapeImg" :src="imageUrl" alt  /> -->
                </div>
            </el-col>
            <el-col :span="14">
            <el-form :label-position="labelPosition" label-width="100px" :model="cameraD">
                <el-form-item label="名称：">
                    <el-input ref='refCameraName' @blur="cameraBlur" v-model="cameraD.device_name" clearable></el-input>
                </el-form-item>
                <el-form-item label="位置：">
                    <el-input v-model="cameraD.address" clearable></el-input>
                </el-form-item>
                <el-form-item label="定位信息：">
                    <el-input v-model="cameraD.map_location" clearable></el-input>
                </el-form-item>
                <el-form-item label="当前状态：">
                    <el-radio-group v-model="cameraD.status">
                    <el-radio :label="1">非正常</el-radio>
                    <el-radio :label="0">正常</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item style="text-align:right;">
                    <el-button type="primary"  style="padding: 8px 20px;" @click="addCamera">确定</el-button>
                </el-form-item>
            </el-form>
            </el-col>
        </el-row>
        <el-button
            type="primary"
            slot="reference"
            
            round
            style="position: absolute;right: 100px;top: 12px;padding: 8px 17px;"
            icon="el-icon-plus"
        >新增</el-button>
    </el-popover>

    <div style="height:56px;"></div>
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
                    width="100">
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
            <div style="float:left;width:30%;margin-left:3%;">
                <live-map ></live-map>
            </div>
        </template>
        
    </div>
</template>
<script>
import qs from 'querystring';
import LiveMap from "./Map.vue";
export default {
    name:'SystemCamera',
    components: {
        LiveMap
    },
    data() {
        let self = this;
        return {
         //小地图数据 
          zoom: 12,
          center: [116.278301,40.053648],
          events: {
             click(e) {
                let { lng, lat } = e.lnglat;
                self.lng = lng;
                self.lat = lat;
                self.cameraD.map_location=self.lng+','+self.lat
                console.log(self.lng,self.lat);
                // 这里通过高德 SDK 完成。
                var geocoder = new AMap.Geocoder({
                    radius: 1000,
                    extensions: "all"
                });
                geocoder.getAddress([lng ,lat], function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                    if (result && result.regeocode) {
                        self.cameraD.address=self.address = result.regeocode.formattedAddress;
                        self.$nextTick();
                        console.log(self.address);
                    }
                    }
                });
                }
          },
          plugin: [{
            pName: 'Geolocation',
            events: {
              init(o) {
                // o 是高德地图定位插件实例
                o.getCurrentPosition((status, result) => {
                  if (result && result.position) {
                    console.log(result.formattedAddress)
                    self.lng = result.position.lng;
                    self.lat = result.position.lat;
                    self.center = [self.lng, self.lat];
                    self.address = result.formattedAddress;
                    self.loaded = true;
                    self.$nextTick();
                  }
                });
              },
              
            }
          }],
            // 摄像头数据
          cameraData: [],
          labelPosition: "right",
          visible:false,
          cameraD:{
              device_name:'',
              address:'',
              map_location:'',
              status:''
          },
          imageUrl:''
        }
      },
    filters:{
        toMapLocation:function(str){
            var arr=str.replace(/，/g,",").split(",");

            for(var i=0;i<arr.length;i++){
                arr[i]=Math.round(parseFloat(arr[i])); 
                // console.log(arr[i]);
            }
            arr[0]=arr[0]+'N';
            arr[1]=arr[1]+'E';
            // console.log(arr);
            return  arr.toString();
        }
    },
    methods:{
        p(s) {
          return s < 10 ? '0' + s : s
        },
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
            getCameraData(){
                var app=this;
                this.$http.get("/api/camer_devices", {
                    params: {
                        token: window.localStorage.getItem("userToken")
                    }
                    })
                    .then(function(response) {
                    console.log(response.data);
                    app.cameraData = response.data;
                    });
                },
            addCamera(){
                var app = this;
                var data = qs.stringify({
                    device_name: this.cameraD.device_name,
                    address: this.cameraD.address,
                    map_location: this.cameraD.map_location,
                    status: this.cameraD.status
                })
                console.log(data);
                app.$http.post("/api/camer_devices", data,{
                    params: {
                        token: window.localStorage.getItem("userToken")
                    }
                }).then(function(response) {
                    // console.log(response);
                    app.$message({
                        message: '新增摄像头成功！',
                        type: 'success'
                    });
                    app.visible = false;
                    app.cameraD=''
                    app.getCameraData();
                }).catch(function(error){
                    app.$message.error('新增失败，请填写完整信息！');
                })
            },
            // 添加摄像头名称验证
            cameraBlur(){
                let self=this;
                // console.log(this.cameraD.device_name);
                // cameraData
                for(var i=0;i<this.cameraData.length;i++){
                console.log(this.cameraData[i].device_name);
                if(this.cameraD.device_name==this.cameraData[i].device_name){
                    // console.log('用户名已存在，请重新填写');
                    this.$message({
                        message: '摄像头名称已存在，请重新填写',
                        type: 'warning'
                    });
                    this.$refs.refCameraName.focus();
                    }
                }
            }
    },
    created:function(){
        this.getCameraData()
    },
    
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
.el-popover.myPopover0{
    left: 550px!important;
    z-index: 9999!important;
}
.el-popover.myPopover0 .popper__arrow{
    left: 590px !important;
}
.escapeImg{
    margin: auto;
    display: block;
    width: 120px;
    height: 150px;
    border: 1px dashed #ccc;
    border-radius: 5px;
    background: #f9f9f9 url(../images/ljp_photo.png) no-repeat center;
    background-size: 90%;
}

</style>
