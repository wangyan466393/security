<template>
  <div class="amap-page-container" id="amap-page-container">
    <el-amap vid="amapDemo" :zoom="zoom" :plugin="plugin" :center="center" :events="events" class="amap-demo">
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
      ></el-amap-marker>
    </el-amap>
    <div class="toolbar">
      <p>显示文本内容：</p>
      <p>position: [{{ lng }}, {{ lat }}] address: {{ address }}</p>
      <!-- {{ cameraInfos }} -->
    </div>
  </div>
</template>
<script>
import bus from "../eventBus";
export default {
  name: "amap-page",
  props:["cameraInfos"],
  data() {
    let self = this;
    return {
    
        //保存获取到的 经纬度
      address: "",
      lng: 0, //经度纬度
      lat: 0, //经度纬度
      // slotStyle: {
      //   padding: "2px 8px",
      //   background: "#eee",
      //   color: "#333",
      //   border: "1px solid #aaa"
      // },
      zoom: 14,
      center: [116.27177, 40.04721], //默认定位得位置
      markers: [
        {
          position: [116.27177, 40.04721], //图标显示得位置
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
            },
            dragend: e => {
              console.log("---event---: dragend");
              this.markers[0].position = [e.lnglat.lng, e.lnglat.lat];
            },
          },
          visible: true,
          draggable: false, //拖拽移动点标记
          template: "<span>1</span>"
        },
        {
          position: [116.28019016683362, 40.049026970840245], //图标显示得位置
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
                    self.$nextTick(
                      function(){
                          self.emitEvent()
                      }
                    );
                    
                  }
                }
              });
              
            },
            dragend: e => {
              console.log("---event---: dragend");
              this.markers[0].position = [e.lnglat.lng, e.lnglat.lat];
            }
          },
          visible: true,
          draggable: false, //拖拽移动点标记
          template: "<span>2</span>"
        },
        {
          position:[116.273745, 40.043793]
        },
        {
          position: [116.258124, 40.048786]
        },
        {
          position: [116.293057, 40.047012]
        },
        {
          position: [116.261986, 40.043464]
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
        console.log(this.address)
				this.$emit("positionAddr",this.address)
			}
		},
};
</script>
<style scoped>
/*地图宽高*/
.amap-demo {
  height: 200px;
}
</style>
