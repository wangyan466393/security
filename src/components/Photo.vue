<template>
  <div class="camera_outer">
    <video id="videoCamera"  :width="videoWidth" :height="videoHeight" preload autoplay></video>
    <canvas id="canvasCamera" :width="videoWidth" :height="videoHeight"></canvas>
    <!-- 显示位置地址 -->
    <div class="camera_addr">
      <i class="el-icon-location">
        <span>{{ posAddr }}</span>
      </i>
    </div>
    <div v-if="imgSrc" class="img_bg_camera">
      <img :src="imgSrc" alt class="tx_img" />
    </div>
    <div class="btn_box">
      <button @click="getCompetence()">打开摄像头</button>
      <button @click="stopNavigator()">关闭摄像头</button>
      <button @click="setImage()" style="position:relative;">拍照</button>
    </div>
    <div class="layui-form-item">
      <div class="layui-input-inline">
        <el-upload
          ref="upload"
          :file-list="fileList"
          :multiple="false"
          accept="image/jpeg, image/gif, image/png"
          action
          :http-request="uploadFiles"
          :on-change="uploadFiles"
          element-loading-text="拼命加载中"
        >
          <el-button size="mini" type="primary">选取图片</el-button>
          <span>&nbsp;</span> 
        </el-upload>
      </div>
    </div>
  </div>
</template>
<script>
require("tracking/build/tracking-min.js");
require("tracking/build/data/face-min.js");
import qs from 'querystring';
import bus from "../eventBus";
import axios from "axios";
//把axios实例对象作为Vue原型链prototype对象的某一个属性

export default {
  props: ["posAddr"],
  data() {
    return {
      fileList:[],
      accesskey:
        "29a594655f9df16005bc1d62f52529c13987aa43bfe3c596ef0226242e1b21e9",
      secretkey:
        "ede12a7b3a576506d626b1f1af24a74c3a14874e1a8e036df20e531c34238795",
      aiPlatform: {
        // host: 'https://api.brain.lenovo.com',
        // host: "https://public-api.brain.lenovo.com/",
        host: " https://test-leva.brain.lenovo.com/api",
        url: {
          getToken: "/online-authorize",
          visionTech: {
            faceDetection: "/apicore/cv/face-detection/1.6",
            /* 人脸检测*/
            faceIdentification: "/apicore/cv/face-identification/1.7"
            /*人脸识别*/
          },
          faceLib: {
            createFaceLib: "/dev-service/rest/cv/face/libraries",
            createFaceGroup: "/dev-service/rest/cv/face/groups",
            createFacePerson: "/dev-service/rest/cv/face/persons",
            /*人员新建*/
            addNewFaceToPerson:
              "/dev-service/rest/cv/face/persons/{personId}/images" /* 人员新增图片*/
          }
        },
        token: {
          createTime: new Date(),
          expireTime: null,
          duration: 12 //token有效时长，单位小时
        }
      },
      videoWidth: 820,
      videoHeight: 800,
      trackerTask: null,
      imgSrc: "",
      photo_imgSrc: "", //拍摄到的疑犯头像base64
      base64Code: "",
      confidence: "", //相似度
      personId: "", //疑犯id
      thisCancas: null,
      thisContext: null,
      thisVideo: null,
      usertoken:"",
      stolen_car:"" , //被偷车辆数据
      carImg:"",
      record:0,
      fullscreenLoading:false,
      timer:null
    };
  },
  methods: {
    //向父组件发送数据疑犯信息
    emitScaped() {
      this.$emit("zifu", {
        imgSrc: this.imgSrc,
        confidence: this.confidence,
        personId: this.personId,
        record:1
      });
    },
    //向父组件传递被偷车辆数据
    emitStolenCar(){
        this.$emit("stolenCar",{
          stolen_car:this.stolen_car,
          record:2,
          carImg:this.carImg
        })
    },
    // 调用权限（打开摄像头功能）
    getCompetence() {
      var _this = this;
      this.thisCancas = document.getElementById("canvasCamera");
      this.thisContext = this.thisCancas.getContext("2d");
      this.thisVideo = document.getElementById("videoCamera");
      // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }
      // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
      // 使用getUserMedia，因为它会覆盖现有的属性。
      // 这里，如果缺少getUserMedia属性，就添加它。
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
          // 首先获取现存的getUserMedia(如果存在)
          var getUserMedia =
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.getUserMedia;
          // 有些浏览器不支持，会返回错误信息
          // 保持接口一致
          if (!getUserMedia) {
            return Promise.reject(
              new Error("getUserMedia is not implemented in this browser")
            );
          }
          // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
          return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        };
      }
      var constraints = {
        audio: false,
        video: {
          width: this.videoWidth,
          height: this.videoHeight,
          transform: "scaleX(-1)"
        }
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
          // 旧的浏览器可能没有srcObject
          if ("srcObject" in _this.thisVideo) {
            _this.thisVideo.srcObject = stream;
          } else {
            // 避免在新的浏览器中使用它，因为它正在被弃用。
            _this.thisVideo.src = window.URL.createObjectURL(stream);
          }
          _this.thisVideo.onloadedmetadata = function(e) {
            _this.thisVideo.play();
          };
        
          const tracker = new window.tracking.ObjectTracker("face");
          tracker.setInitialScale(4);
          tracker.setStepSize(2);
          tracker.setEdgesDensity(0.1);
          // 启动摄像头初始化
          _this.trackerTask = window.tracking.track(
            "#videoCamera",
            tracker,
            {camera:true}
          );
          tracker.on("track", function(event) {
            _this.thisContext.clearRect(0, 0, _this.thisCancas.width, _this.thisCancas.height);
            event.data.forEach(function(rect) {
              _this.thisContext.strokeStyle = "#ff0000";
              _this.thisContext.strokeRect( rect.x, rect.y, rect.width, rect.height);
            });
          });
        })
        .catch(err => {
          console.log(err);
        });
      // this.timer = setInterval(this.setImage,1000);
    },
    //  绘制图片（拍照功能）
    setImage() {
      var _this = this;
      // 点击，canvas画图
      _this.thisContext.drawImage(
        _this.thisVideo,
        0,
        0,
        _this.videoWidth,
        _this.videoHeight
      );
      // 获取图片base64链接
      var image = this.thisCancas.toDataURL("image/jpeg", 1.0);
      _this.imgSrc = image;
      this.base64Code = image.split(",")[1];
      // console.log(this.base64Code);
      if(this.base64Code){
        this.objIdentification()
      }
      this.$emit("refreshDataList", this.imgSrc);
    },
    // base64转文件
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(",");
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length;
      var u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    // 关闭摄像头
    stopNavigator() {
      clearInterval(this.timer);
      this.timer=null;
      this.thisVideo.srcObject.getTracks()[0].stop();
    },

    //物体识别
    objIdentification() {
      var that = this;
      if (this.base64Code) {
        axios({
          url: that.aiPlatform.host + "/online-authorize",
          method: "post",
          async:false,
          data: JSON.stringify({
            accesskey: that.accesskey,
            secretkey: that.secretkey
          })
        }).then(function(response) {
          if (response.data.status == 0) {
            var token = response.data.result.token;
            axios({
              method: "POST",
              async:false,
              url:
                `${that.aiPlatform.host}/apicore/cv/object-recognition/1.6?token=` +
                token,
              data: JSON.stringify({
                imageId: that.getUuid(),
                base64Data: that.base64Code
              }),
              headers: { "Content-Type": "application/json" }
            }).then(function(res) {
              if (res.data.result.objectResults) {
                var objectResults = res.data.result.objectResults;
                var pre = [];
                for (var i = 0; i < objectResults.length; i++) {
                  pre.push(objectResults[i].objectName);
                  for (var j = 0; j < pre.length; j++) {
                    if (pre[j] == "person") {
                      that.fullscreenLoading = true;
                      // console.log("人");
                      var base64LS = that.base64Code
                      axios({
                        method: "POST",
                        url: that.aiPlatform.host + "/online-authorize",
                        data: JSON.stringify({
                          accesskey: that.accesskey,
                          secretkey: that.secretkey
                        })
                      }).then(function(response) {
                        if (response.data.status == 0) {
                          var token = response.data.result.token;
                          axios({
                            method: "POST",
                            url:
                              `${that.aiPlatform.host}/apicore/cv/face-identification/1.7?token=` +
                              token,
                            data: JSON.stringify({
                              base64Data: base64LS,
                              format: "jpg",
                              groupNames: "escapePersonGroup"
                            }),
                            headers: {
                              "Content-Type": "application/json"
                            }
                          }).then(function(response) {
                            // console.log(response)
                            if (response.data.status == 0) {
                              let results =
                                response.data.result.faces[0].results;
                                 if (
                                results.length > 0 &&
                                results[0].confidence >= 0.80
                              ) {
                                //confidence越高越相似
                                //匹配到人脸且可信度高于80%,是疑犯
                                // that.fileId = results[0].fileId;
                                that.confidence = (
                                  results[0].confidence * 100
                                ).toFixed(2);
                                that.personId = results[0].personId;
                                // that.photo_imgSrc = that.imgSrc;
                                that.emitScaped(); //父组件需要的数据
                                that.fullscreenLoading = false;
                                clearInterval(that.timer);
                                that.timer = null;
                                
                                // that.timer = setInterval(that.setImage,5000);
                                return;
                              } 
                            }
                          });
                        }
                      });
                    } else if (pre[j] == "vehicle" || pre[j] == "car") {
                      console.log("汽车");
                      let base64C = that.base64Code
                      // var data = qs.stringify({
                      //       car_img: base64C,
                      //   })
                        var data = new FormData();
                        data.append("car_img",base64C)
                      that.$http
                        .post(
                          "/api/stolen_car_detection",data,
                          {
                            params:{
                              token: window.localStorage.getItem("userToken"),
                            },
                            headers:{
                              'Content-Type': 'application/x-www-form-urlencoded'
                            }
                          }
                        )
                        .then(function(response) {
                          debugger;
                          console.log(response.data);  
                            if (response.data.length>0) {
                              that.stolen_car = response.data;
                              that.emitStolenCar()
                               that.fullscreenLoading = false;
                            }
                        })
                    }
                  }
                }
              }
            });
          }
        });
      }
    },
    /****设置图片id****/
    getUuid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
        c
      ) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    //图片转base64
    //点击上传图片,上传成功返回图片路径
    uploadFiles(file,fileList) {
      let that = this;
      let reader = new FileReader(); //html5读文件
      reader.readAsDataURL(file.raw);
      //转BASE64
      reader.onload = function(e) {
        that.carImg = e.target.result;
        that.imgSrc = e.target.result;
        that.base64Code = e.target.result.split(",")[1];
        if (that.base64Code) {
           that.objIdentification();
        }
      };
    }
  },
  created(){
    this.usertoken = window.localStorage.getItem("userToken")
  },
  // mounted() {
  //   //定时拍照
  //  this.timer = setInterval(this.setImage,1000);
  // },
  watch: {
    posAddr(a) {
      this.posAddr = a;
    }
  }
};
</script>
<style lang="scss" scoped>
.camera_outer {
  position: relative;
  overflow: hidden;
  height: 800px;
  video,
  canvas,
  .tx_img {
    // -moz-transform: scaleX(-1);
    // -webkit-transform: scaleX(-1);
    // -o-transform: scaleX(-1);
    // transform: scaleX(-1);
    position: absolute;
  }
  #videoCamera{
    top:-40px;
  }
  .btn_box {
    position: absolute;
    top: 750px;
    button {
      border: none;
      outline: none;
      border: 1px solid #0d6690;
      background-color: #0d2843;
      padding: 5px;
      color: #bfdfef;
      cursor: pointer;
    }
  }
  .layui-form-item{
    position: absolute;
    top: 750px;
    right: 0;
  }
  .camera_addr {
    position: absolute;
    top: 10px;
    left: 0;
    height: 50px;
    width: 100%;
    background: url(../images/back_04.png) no-repeat left;
    background-size: 100%;
    .el-icon-location {
      font-size: 22px;
      color: red;
      line-height: 50px;
      margin-left: 20px;
    }
    span {
      color: #b0e4fd;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 2px;
    }
  }
  .img_bg_camera {
    visibility: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
