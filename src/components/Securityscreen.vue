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
                <!-- <i class="el-icon-s-home">

                </i>-->
                <span class="camera">摄像头选择</span>
                <!-- <el-select v-model="value" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>-->
              </div>
            </div>
          </el-col>
          <el-col :span="8" style="position:absolute;right:0">
            <div class="header_right">
              <div class="current_time">
                <span>{{timeFormat(date)}}</span>
                <br />
                <span style="font-size: 12px;">{{dateFormat(date)}}</span>
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
          <photo ref="myphoto" v-on:zifu="hehe"></photo>
        </el-main>
        <el-aside width="450px">
          <el-row>
            <el-col :span="24">
              <div class="suspect_box">
                <h5 class="suspect_title">在逃人员信息</h5>
                <div class="suspect_info" v-for="(info,index) in suspectInfo" :key="index">
                  <p>嫌疑犯姓名：{{  info.person_name }}</p>
                  <div  class="suspect_text">
                    <div v-if="info.gender == 1">性别：男</div>
                    <div>身份ID：{{ info.identity_id }}</div>
                    <div>所犯案件：{{ info.case_type }}</div>
                    <div v-if="info.status == 0">案件类型：已结案</div>
                    <div v-if="info.status == 1">案件类型：在逃</div>
                    <div v-if="info.status == 2">案件类型：已报警在逃人员</div>
                    <img src="../images/police.png" alt />
                  </div>
                </div>
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
              <!-- 实时地图 -->
              <div class="suspect_box">
                <h5 class="suspect_title">
                  <ul>
                    <li>实时地图</li>
                  </ul>
                </h5>
                <div class="suspect_map">
                  <live-map></live-map>
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
      date: new Date(),
      imgSrc: "", //疑犯拍摄
      image_src: "", //子组件发送过来的 疑犯文件base64
      confidence: "", //相似度
      personId: "", //疑犯id
      userToken:"", 
      username:"",
      // 疑犯信息
      suspectInfo: []
    };
  },
  components: {
    Photo,
    LiveMap
  },
  created() {
    this.checkCookie();
    this.userToken = window.localStorage.getItem("userToken");
  },
  mounted() {
    let _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(() => {
      _this.date = new Date(); // 修改数据date
    }, 1000);
    //开启摄像头
    this.$refs.myphoto.getCompetence();
  },
  methods: {
    getCookie: function(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
      }
      return "";
    },
    checkCookie: function() {
      var user = this.getCookie("username");
      if (user != "") {
        this.username = user
      }
    },
    //接收子组件Photo.vue的数据
    hehe(data) {
      this.imgSrc = data.imgSrc;
      (this.image_src = data.image_src),
        (this.personId = data.personId),
        (this.confidence = data.confidence);

      this.escapedInfo();
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
            that.suspectInfo = response.data
        });
    },
    dateFormat(time) {
      var date = new Date(time);
      var year = date.getFullYear();
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var seconds =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      // 拼接
      return year + "-" + month + "-" + day;
    },
    timeFormat(time) {
      var date = new Date(time);
      var year = date.getFullYear();
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var seconds =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      // 拼接
      return hours + ":" + minutes + ":" + seconds;
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
  /* background-size: 100%; */
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
  float: right;
  margin-top: 14px;
  margin-right: 45px;
  width: 180px;
  height: 65px;
  text-align: center;
  line-height: 45px;
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
  padding: 3px 23px;
  color: #d1f5f6;
  font-weight: 600;
  letter-spacing: 3px;
  background: url(../images/home_ljp.png) no-repeat 0px 0px;
  background-size: 20px;
  cursor: pointer;
  font-size: 14px;
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
  top: 0;
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
</style>
