<template>
  <div class="camera_outer">
    <video id="videoCamera" :width="videoWidth" :height="videoHeight" autoplay></video>
    <canvas style="display:none;" id="canvasCamera" :width="videoWidth" :height="videoHeight"></canvas>
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
    
  </div>
</template>
<script>
  import bus from "../eventBus";
  import axios from "axios";
import { Base64 } from 'js-base64';
  //把axios实例对象作为Vue原型链prototype对象的某一个属性

  export default {
    props:["posAddr"],
    data() {
      return {
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
        imgSrc: "",
        photo_imgSrc:"",    //拍摄到的疑犯头像base64
        base64Code: "",
        image_src:"",    //文件下载的疑犯头像
        confidence:"", //相似度
        personId:"",   //疑犯id
        thisCancas: null,
        thisContext: null,
        thisVideo: null
      };
    },
    methods: {
      //向父组件发送数据
      cyy() {
        this.$emit("zifu", {
            imgSrc:this.photo_imgSrc,
            confidence:this.confidence,
            personId:this.personId,
            image_src:this.image_src,

          }
        );
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
          })
          .catch(err => {
            console.log(err);
          });
      },
      //获取图片base64
      getImgBase64(file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e) {
          base64Code = this.result.split(",")[1];
        };
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
        this.thisVideo.srcObject.getTracks()[0].stop();
      },

      //物体识别
      objIdentification() {
        var that = this;
        if (this.base64Code) {
          axios({
            url: that.aiPlatform.host + "/online-authorize",
            method: "post",
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
                        console.log("人");
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
                                base64Data: that.base64Code,
                                format: "jpg",
                                groupNames: "escapePersonGroup"
                              }),
                              headers: {
                                "Content-Type": "application/json"
                              }
                            }).then(function(response) {
                              console.log(response);
                              if (response.data.status == 0) {
                                let results = response.data.result.faces[0].results;
                                // console.log(results)
                                if (
                                  results.length > 0 &&
                                  results[0].confidence >= 0.85
                                ) {
                                  //confidence越高越相似
                                  //匹配到人脸且可信度高于85%,是疑犯
                                  that.fileId = results[0].fileId;
                                  that.confidence=((results[0].confidence)*100).toFixed(2);
                                  that.personId = results[0].personId;
                                  that.photo_imgSrc = that.imgSrc;
                                  that.cyy();  //疑犯图像base64
                                  axios({
                                    method: 'POST',
                                    url: that.aiPlatform.host + '/online-authorize',
                                    data: JSON.stringify({
                                      accesskey:that.accesskey,
                                      secretkey:that.secretkey,
                                    }),
                                  }).then(function(response){
                                    let token = response.data.result.token;
                                    axios({    //通过文件id获取疑犯照片
                                      method: 'GET',
                                      url: that.aiPlatform.host + '/file/download/file/' + that.fileId + '?token=' + token,
                                      responseType:"blob"
                                    }).then(function(response){
                                      that.blobToBase64(response.data ).then(res=>{
                                        that.image_src= res
                                      })
                                    })
                                  })

                                } else {
                                }
                              }
                            });
                          }
                        });
                      } else if (pre[j] == "vehicle" || pre[j] == "car") {
                        console.log("汽车");
                         that.$http.post("/api/stolen_car_detection",{
                           car_img:Base64.encodeURI(that.base64Code),
                           },
                           
                           {params:{
                             token: window.localStorage.getItem("userToken"),
                           }
                         },).then(function(response){
                           console.log(response);
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
      blobToBase64(blob) {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.onload = (e) => {
            resolve(e.target.result);
          };
          // readAsDataURL
          fileReader.readAsDataURL(blob);
          fileReader.onerror = () => {
            reject(new Error('文件流异常'));
          };
        });
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
      }
    },
    updated() {
      this.objIdentification();
    },
    // mounted() {
    //   //定时拍照
    //   setInterval(this.setImage,1000);
    // },
     watch:{
        posAddr(a){
            this.posAddr = a;
        }
    },
  };
</script>
<style lang="scss" scoped>
  .camera_outer {
    position: relative;
    overflow: hidden;
    // background: url("../../assets/img/user_0608_04.png") no-repeat center;
    background-size: 100%;
    video,
    canvas,
    .tx_img {
      -moz-transform: scaleX(-1);
      -webkit-transform: scaleX(-1);
      -o-transform: scaleX(-1);
      transform: scaleX(-1);
    }
    video {
      position: relative;
      top: -40px;
    }
    .btn_box{
      text-align: center;
      button{
        border:none;
        outline: none;
        border:1px solid #0d6690;
        background-color: #0d2843;
        padding: 5px;
        color: #bfdfef;
      }
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
    .btn_camera {
      position: absolute;
      bottom: 4px;
      left: 0;
      right: 0;
      height: 50px;
      background-color: rgba(0, 0, 0, 0.3);
      line-height: 50px;
      text-align: center;
      color: #ffffff;
    }
    .bg_r_img {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      top: 0;
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
