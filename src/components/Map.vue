<template>
  <div class="amap-page-container" id="amap-page-container">
    <el-amap vid="amapDemo" :zoom="zoom" :center="center" :plugin="plugin" :events="events" class="amap-demo">
      <!-- <el-amap-marker
        vid="component-marker"
        :position="componentMarker.position"
        :content-render="componentMarker.contentRender"
      ></el-amap-marker> -->
      <el-amap-marker
        v-for="(marker,index) in markers"
        :key="index"
        :position="marker.position"
        :events="marker.events"
        :visible="marker.visible"
        :draggable="marker.draggable"
        :vid="index"
        :icon="marker.icon"
      ></el-amap-marker>
      <el-amap-circle  vid="circle"
          :center="center" 
          :radius="radius" 
          fill-opacity="0.2"
          strokeColor="#38f"
          strokeOpacity="0.8"
          strokeWeight="1"
          fillColor="#38f"
          >
        </el-amap-circle>
    </el-amap>
    <div class="toolbar">
      <!-- <p>显示文本内容：</p>
      <p>position: [{{ lng }}, {{ lat }}] address: {{ address }}</p>
      {{ loglat }}
       {{ cameraInfos }}
       <img src="//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png"> --> 
    </div>
  </div>
</template>
<script>
import VueAMap from 'vue-amap';

let amapManager = new VueAMap.AMapManager();
import bus from "../eventBus";
export default {
  name: "amap-page",
  props:["cameraInfos","loglat"],
  data() {
    let self = this;
    return {
      
        //保存获取到的 经纬度
      address: "",
      lng: 0, //经度纬度
      lat: 0, //经度纬度
      zoom: 14,
      amapManager,
      radius:80,
       mapStyle: "amap://styles/8b6be8ec497009e17a708205348b899a",
      center: [116.27177, 40.04721], //默认定位得位置
      markers: [
        {
          position: [116.27177, 40.04721], //图标显示得位置
          // icon:"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png",
          
          events: {
            click: e => {
              let { lng, lat } = e.lnglat;
              self.lng = lng;
              self.lat = lat;
              // 这里通过高德 SDK 完成。
              var geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: "all"
              });
              geocoder.getAddress([lng, lat], function(status, result) {
                if (status === "complete" && result.info === "OK") {
                  if (result && result.regeocode) {
                    self.address = result.regeocode.formattedAddress;
                    self.$nextTick( function(){
                          self.emitEvent()
                      });
                  }
                }
              });
            }
          },
          visible: true,
          draggable: false //拖拽移动点标记
        }
        
      ],
      events: {    //点击地图获取对应的经纬度
        click(e) {
          let { lng, lat } = e.lnglat;
          self.lng = lng;
          self.lat = lat;

          // 这里通过高德 SDK 完成。
          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
          });
          geocoder.getAddress([lng ,lat], function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                self.address = result.regeocode.formattedAddress;
                self.$nextTick();
              }
            }
          });
        }
      },
      plugin: [{
            pName: 'Geolocation',
            showMarker: true,
            events: {
              init(o) {
                // o 是高德地图定位插件实例
                o.getCurrentPosition((status, result) => {
                  if (result && result.position) {
                    self.lng = result.position.lng;
                    self.lat = result.position.lat;
                    self.center = [self.lng, self.lat];
                    self.address = result.formattedAddress;
                    self.loaded = true;
                    self.$nextTick(function(){
                          self.emitEvent()
                      });
                  }
                });
              },
              
            }
          }]
    };
  },
  methods:{
			emitEvent(){
				this.$emit("positionAddr",this.address)
      },
      positionData(cameraInfos){
         for (let index = 0; index < cameraInfos.length; index++) {
           const element = cameraInfos[index];
           let lng = element.map_location.split(/[,，]/)[0]
           let lat = element.map_location.split(/[,，]/)[1]
          let marker = {
            position: [lng, lat]
          };
          this.markers.push(marker);
         }
         
      }
    },
    watch :{
      cameraInfos:function(a,b){
        this.positionData(a);
      },
      loglat:function(a){
          console.log(a)
          this.loglat = a;
          this.center = this.loglat.split(/[,，]/)
      }
    },
};
</script>
<style scoped>
/*地图宽高*/
.amap-demo {
  height: 200px;
}
.amap-icon img{
  width: 22px !important;
  height: 33px;
}
</style>
