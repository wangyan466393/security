<template>
  <div class="hello">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="16">
            <div class="header_left">
              <div class="highlight">
                <span
                  style="font-size:20px;letter-spacing:15px;font-weight:700;color:#b0e5fd"
                >智能安防系统</span>
                <br />
                <span style="font-size:12px;color:#a4daf2">INTELLIGENT SECURITY SYSTEM</span>
              </div>
              <div class="select_right">
                <span class="camera" :title="selectedCamera">{{ selectedCamera }}</span>
                <ul class="camera_list" @click="selectCamera($event)">
                  <li
                    v-for="(info,index) in cameraInfos"
                    :key="index"
                    :data-addr="info.address"
                    :data-loglat="info.map_location"
                  >{{ info.device_name }}</li>
                </ul>
              </div>
            </div>
          </el-col>
          <el-col :span="8" style="position:absolute;right:0">
            <div class="header_right">
              <div class="current_time">
                <span>{{ $moment(date).format("HH:mm:ss")}}</span>
                <br />
                <span style="font-size: 12px;">{{ $moment(date).format("YYYY-MM-DD") }}</span>
              </div>
              <div class="shu"></div>
              <div class="users">
                <i class="el-icon-user-solid">&nbsp;{{ username }}</i>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-container style="padding:25px 25px 0px;">
        <el-main style="margin-right:20px">
          <photo ref="myphoto" v-on:zifu="hehe" :posAddr="posAddr" @stolenCar="stolenCarF"></photo>
        </el-main>
        <el-aside width="450px">
          <el-row>
            <el-col :span="24">
              <div v-if="num==1">
                <div class="suspect_box">
                  <h5 class="suspect_title">在逃人员信息</h5>
                  <template>
                    <div class="suspect_info" v-for="(info,index) in suspectInfo" :key="index">
                      <p>嫌疑犯姓名：{{ info.person_name }}</p>
                      <div class="suspect_text">
                        <div v-if="info.gender == 1">性别：男</div>
                        <div v-if="info.gender == 2">性别：女</div>
                        <div>身份ID：{{ info.identity_id }}</div>
                        <div>所犯案件：{{ info.case_type }}</div>
                        <div v-if="info.status == 0">案件类型：已结案</div>
                        <div v-if="info.status == 1">案件类型：在逃</div>
                        <div v-if="info.status == 2">案件类型：已报警在逃人员</div>
                        <img src="../images/police.png" alt />
                      </div>
                    </div>
                  </template>
                </div>
                <!-- 疑犯照片 -->
                <div class="suspect_box">
                  <h5 class="suspect_title">嫌犯照片比对</h5>
                  <div class="suspect_photo" v-if="imgSrc">
                    <p>
                      <img :src="imgSrc" style="width:100%;height: 125px;" />
                    </p>
                    <p>
                      相似度
                      <br />
                      {{ confidence }}%
                    </p>
                    <p>
                      <img :src="image_src" style="width:100%;height:125px;" />
                    </p>
                  </div>
                </div>
              </div>
              <div v-else-if="num == 2">
                <div class="suspect_box">
                  <h5 class="suspect_title">被盗车辆信息</h5>
                  <template>
                    <div class="stolen_carImg">
                      <img :src="carImg" alt="">
                    </div>
                    <div class="suspect_info" v-for="(info,index) in stolen_car[0]" :key="index">
                      <p>车牌号：{{ info.car_number }}</p>
                      <div class="suspect_text">
                        <div>车主姓名：{{ info.owner_name }}</div>
                        <div>车主身份ID：{{ info.owner_identify }}</div>
                        <div>车辆型号：{{ info.car_model }}</div>
                        <div>车辆颜色：{{ info.car_color }}</div>
                        <div>被盗时间：{{ $moment(info.stolen_time).format("YYYY-MM-DD HH:mm:ss") }}</div>
                        <div v-if="info.status == 0">案件类型：已结案</div>
                        <div v-if="info.status == 1">案件类型：在逃</div>
                        <div v-if="info.status == 2">案件类型：已报警在逃车辆</div>
                        <img src="../images/police.png" alt />
                      </div>
                    </div>
                  </template>
                </div>
              </div>

              <!-- 实时地图 -->
              <div class="suspect_box">
                <h5 class="suspect_title" style="overflow:hidden">
                  <ul style="float:left">
                    <li>实时地图</li>
                  </ul>
                  <!-- <span style="float:right">北七家摄像头</span> -->
                </h5>
                <div class="suspect_map">
                  <live-map @positionAddr="posAddrs" ref="livemap" :cameraInfos="cameraInfos" :loglat="loglat"></live-map>
                </div>
              </div>
              
            </el-col>
          </el-row>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Photo from "./Photo.vue";
import LiveMap from "./Map.vue";
import axios from "axios";
export default {
  name: "securityscreen",
  data() {
    return {
      num:0,
      selectedCamera: "摄像头选择",
      date: new Date(),
      imgSrc: "", //疑犯拍摄
      image_src: "", //子组件发送过来的 疑犯文件base64
      confidence: "", //相似度
      personId: "", //疑犯id
      userToken: "",
      username: "",
      // 疑犯信息
      suspectInfo: [],
      posAddr: "",
      cameraInfos: [], //摄像头信息
      loglat:"",
      carImg: "", //拍下的车辆图片路径
      stolen_car: "" //被偷车辆数据

    };
  },
  components: {
    Photo,
    LiveMap
  },
  created() {
    this.username = window.localStorage.getItem("username");
    this.userToken = window.localStorage.getItem("userToken");
  },
  mounted() {
    let _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(() => {
      _this.date = new Date(); // 修改数据date
    }, 1000);
    //开启摄像头
    this.$refs.myphoto.getCompetence();
    this.getCamera();
  },
  methods: {
    selectCamera(e) {  //选择摄像头
      console.log(e.target.dataset);
      this.selectedCamera = e.target.innerText;
      this.posAddr = e.target.dataset.addr;
      this.loglat = e.target.dataset.loglat;
    },
    //获取摄像头信息
    getCamera() {
      let that = this;
      this.$http
        .get("/api/camer_devices", { params: { token: that.userToken } })
        .then(function(response) {
          console.log(response);
          that.cameraInfos = response.data;
        });
    },

    //接收子组件Photo.vue的数据
    hehe(data) {
      this.imgSrc = data.imgSrc;
      // (this.image_src = data.image_src),
      (this.personId = data.personId), (this.confidence = data.confidence); // 相似度
      this.num = data.record

      this.escapedInfo();
    },
    stolenCarF(data) {
      this.stolen_car = data.stolen_car; //被偷车辆数据
      this.num = data.record
      this.carImg = data.carImg
    },
    posAddrs(data) {
      // 接收子组件传过来的定位地址
      // console.log(data);
      this.posAddr = data;
    },
    //获取在逃疑犯数据
    escapedInfo() {
      let that = this;
        this.$http
        .get("/api/escape_persons", {
          params: {
            identity_id: this.personId,
            token: this.userToken
          }
        })
        .then(function(response) {
          console.log(response.data);
          if (response.data.length > 0) {
            that.suspectInfo = response.data;
            that.image_src =
              "data:image/jpeg;base64," + response.data[0].person_img;
          }
          return;
        });
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  background: url(../images/back.png) no-repeat;
  background-size: 100% 100%;
  height: 100%;
  padding: 1px 5px;
  overflow: auto;
  /* white-space: nowrap;
      -webkit-overflow-scrolling: touch;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 0 0.1rem;
      margin-bottom: -.2rem;
      overflow: -moz-scrollbars-none;
      overflow: -moz-scrollbars-none; */
}
.hello::-webkit-scrollbar {
  display: none;
}
.el-header {
  padding: 0;
  height: 75px !important;
}
.el-main {
  padding: 0;
}
.el-container {
  position: relative;
  background: url(../images/ljp_back05.png) no-repeat 0px bottom;
  background-size: 100%;
}
.el-col .header_left {
  position: absolute;
  height: 330px;
  width: 66.6%;
  background: url(../images/nav_back01.png) no-repeat 0px 0px;
  background-size: 100% 328px;
}
.el-col .header_right {
  height: 411px;
  background: url(../images/nav_back02.png) no-repeat -1px 0px;
  background-size: 100% 410px;
  margin-left: -4px;
}
.el-col .highlight {
  float: left;
  padding-left: 60px;
  padding-right: 255px;
  padding-top: 15px;
  height: 60px;
  background: url(../images/highlight.png) no-repeat -5px -23px;
}
.select_right {
  position: relative;
  float: right;
  margin-top: 14px;
  margin-right: 45px;
  width: 180px;
  height: 65px;
  background: url(../images/select01.png) no-repeat 0px 0px;
  background-size: 100%;
}
.el-icon-s-home {
  font-size: 24px;
  margin-left: 38px;
  margin-top: 14px;
  color: #d1f0ff;
}
.camera {
  margin-left: 26px;
  display: inline-block;
  height: 44px;
  width: 112px;
  line-height: 46px;
  padding: 0px 23px;
  color: #d1f5f6;
  font-weight: 600;
  letter-spacing: 3px;
  background: url(../images/home_ljp.png) no-repeat 0px center;
  background-size: 20px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.select_right:hover .camera_list {
  display: block;
}
.camera_list {
  display: none;
  padding-top: 15px;
  padding-bottom: 20px;
  list-style: none;
  position: absolute;
  top: 62px;
  z-index: 3000;
  background: url(../images/ljp_list.png) no-repeat 0 0;
  background-size: 100% 100%;
  width: 178px;
  text-align: center;
}
.camera_list li {
  line-height: 34px;
  color: #daffff;
  font-size: 14px;
}
.camera_list li:hover {
  background: url(../images/ljp_li.png) no-repeat 0 0;
  background-size: 100%;
  cursor: pointer;
}
.current_time {
  margin-left: 40px;
  margin-top: 7px;
  margin-right: 40px;
  float: left;
  font-size: 24px;
  color: #d1f0ff;
  text-align: center;
}
.shu {
  float: left;
  width: 5px;
  height: 75px;
  background: url(../images/shu.png) no-repeat -6px -2px;
}
.users {
  padding-left: 40px;
  float: right;
  width: 50%;
  height: 75px;
  line-height: 75px;
  color: #d1f0ff;
  background: url(../images/highlight_02.png) no-repeat 2px -3px;
  background-size: 100%;
}
.el-icon-user-solid {
  margin-left: 40px;
  font-size: 18px;
  font-weight: 500;
}
/* 在逃疑犯 */
.suspect_box {
  margin-bottom: 10px;
  background-color: #0d2843;
  padding: 5px;
  border: 1px solid #0d6690;
}
.suspect_title {
  line-height: 30px;
  padding-left: 25px;
  color: #bfdfef;
  background: url(../images/back_02.png) no-repeat;
  letter-spacing: 2px;
  font-size: 12px;
}
.suspect_info {
  width: 408px;
  margin: 25px auto;
}
.suspect_info > p {
  background: url(../images/back_03.png) no-repeat;
  color: #58f1eb;
  font-weight: 600;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
  letter-spacing: 5px;
}
.suspect_text {
  position: relative;
}
.suspect_text > div {
  padding-left: 20px;
  background-color: #103953;
  border-top: 2px solid #0d2843;
  color: #e9ebed;
  font-size: 12px;
  line-height: 26px;
  letter-spacing: 2px;
}
.suspect_text > img {
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -55px;
  width: 150px;
}
/* 嫌犯照片 */
.suspect_photo {
  padding-top: 10px;
  border: none;
  background: url(../images/tan.png) no-repeat 0px -15px;
  background-size: 100%;
  text-align: center;
}
.suspect_photo > p {
  padding-top: 25px;
  padding-right: 5px;
  padding-left: 5px;
  display: inline-block;
  vertical-align: top;
  width: 120px;
  height: 155px;
}
.suspect_photo p:first-child,
.suspect_photo p:last-child {
  background: url(../images/photo_box.png) no-repeat;
  background-size: 100%;
}
.suspect_photo p:nth-child(2) {
  color: #e82234;
  font-size: 30px;
  font-weight: 700;
  line-height: 2;
}
.stolen_carImg{
  margin: 10px auto;
  padding: 5px 5px 10px;
  width: 350px;
  height: 190px;
  background: url(../images/ljp_box.png) no-repeat 0 0;
  background-size: 100% 100%;
}
.stolen_carImg>img{
  width: 100%;
}
</style>
