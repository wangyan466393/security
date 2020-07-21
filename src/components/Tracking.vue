<template>
  <div>
    <div class="demo-frame">
    <div class="demo-container">
      <video id="video" width="320" height="200" preload autoplay loop muted></video>
      <canvas id="canvas" width="320" height="200"></canvas>
    </div>
  </div>
  </div>
</template>
<script>
require("tracking/build/tracking-min.js");
require("tracking/build/data/face-min.js");
export default {
  name: "login",
  data() {
    return {
      trackerTask: null,
      trackering: null,
      mediaStreamTrack: null
    };
  },
  mounted() {
    this.getCompetence();
  },
  methods: {
    getCompetence() {
      let flag = true;
      const _this = this;
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then(function(stream) {
          const video = (_this.mediaStreamTrack = document.getElementById(
            "video"
          ));
          const canvas = document.getElementById("canvas");
          const context = canvas.getContext("2d");
          video.srcObject = stream;
          video.onloadedmetadata = function(e) {
            video.play();
          };
          const tracker = new window.tracking.ObjectTracker("face");
          tracker.setInitialScale(4);
          tracker.setStepSize(2);
          tracker.setEdgesDensity(0.2);
          // 启动摄像头初始化
          _this.trackerTask = window.tracking.track(
            "#video",
            tracker,
            {camera:true}
          );
          tracker.on("track", function(event) {
            //   console.log(event)
            context.clearRect(0, 0, canvas.width, canvas.height);
            event.data.forEach(function(rect) {
              context.strokeStyle = "#ff0000";
              context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            });
            if (event.data.length) {
              // 会不停的去检测人脸，所以这里需要做个锁
            //   console.log(event.data);
              if (flag) {
              }
            }
          });
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  },
  destroyed() {
    if (!this.mediaStreamTrack) {
      return;
    }
    // 关闭摄像头和侦测
    this.mediaStreamTrack.srcObject.getTracks()[0].stop();
    this.trackerTask.stop();
  }
};
</script>
<style scoped>
.demo-frame {
  /* background: url(frame.png) no-repeat; */
  width: 854px;
  height: 800px;
  overflow: hidden;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
}

.demo-container {
  width: 100%;
  height: 530px;
  position: relative;
  background: #eee;
  overflow: hidden;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
video, canvas {
    position: absolute;
  }
</style>