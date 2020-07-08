<template>
  <div class="amap-page-container" id="amap-page-container">
    <el-amap vid="amapDemo" :zoom="zoom" :center="center" :events="events" class="amap-demo">
      <el-amap-marker vid="component-marker" :position="componentMarker.position" :content-render="componentMarker.contentRender" ></el-amap-marker>
      <el-amap-marker v-for="(marker,index) in markers" :key="index" :position="marker.position" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable" :vid="index"></el-amap-marker>
    </el-amap>
    <div class="toolbar">
      <!-- <button type="button" name="button" v-on:click="addMarker">add marker</button>
      <button type="button" name="button" v-on:click="removeMarker">remove marker</button> -->
      <p>显示文本内容：</p>
      <p> position: [{{ lng }}, {{ lat }}] address: {{ ruleForm.address }}</p>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'amap-page',
    data() {
      let self = this;
      return {
        ruleForm: {    //保存获取到的 经纬度
          address: "",
        },
        lng: 0,       //经度纬度
        lat: 0,      //经度纬度
        count: 1,
        slotStyle: {
          padding: '2px 8px',
          background: '#eee',
          color: '#333',
          border: '1px solid #aaa'
        },
        zoom: 14,
        center: [116.27177, 40.04721],   //默认定位得位置
        markers: [
          {
            position: [116.27177, 40.04721], //图标显示得位置
            events: {
              click: (e) => {
                console.log(e)
              },
              dragend: (e) => {
                console.log('---event---: dragend')
                this.markers[0].position = [e.lnglat.lng, e.lnglat.lat];
              }
            },
            visible: true,
            draggable: true,   //拖拽移动点标记
            template: '<span>1</span>',
          },
          {
            position: [116.28019016683362, 40.049026970840245], //图标显示得位置
            events: {
              click: (e) => {
                alert(e);
              },
              dragend: (e) => {
                console.log('---event---: dragend')
                this.markers[0].position = [e.lnglat.lng, e.lnglat.lat];
              }
            },
            visible: true,
            draggable: true,   //拖拽移动点标记
            template: '<span>1</span>',
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
                  self.ruleForm.address = result.regeocode.formattedAddress;
                  self.$nextTick();
                }
              }
            });
          }
        },
        componentMarker: {
          position: [116.27177, 40.04721],
          contentRender: (h, instance) => h(exampleComponents,{style: {backgroundColor: '#fff'}, props: {text: 'father is here'}}, ['xxxxxxx'])
        },
        slotMarker: {
          position: [116.27177, 40.04721]
        }
      };
    },
  };
</script>
<style scoped>
  /*地图宽高*/
  .amap-demo {
    height: 200px;
  }
</style>
