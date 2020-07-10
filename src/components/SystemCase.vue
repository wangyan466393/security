<template>
  <div style="position:relative">
    <el-tabs type="border-card" @tab-click="tab_add">
      <el-tab-pane label="在逃犯管理">
        <template>
          <el-table :data="fugitiveData" style="width: 100%">
            <el-table-column prop="person_name" label="姓名" width="80"></el-table-column>
            <el-table-column label="性别" width="80">
              <template slot-scope="scope">{{scope.row.gender==1?'男':'女'}}</template>
            </el-table-column>
            <el-table-column label="照片" width="80">
              <template slot-scope="scope" :show-overflow-tooltip="true">
                <img
                  :src="'data:image/jpeg;base64,'+scope.row.person_img"
                  width="50"
                  height="33.35"
                  class="head_pic"
                />
              </template>
            </el-table-column>
            <el-table-column prop="identity_id" label="身份证号" width="160"></el-table-column>
            <el-table-column prop="case_type" label="案件类型" width="100"></el-table-column>
            <el-table-column prop="escape_time" label="逃离时间" width="180" :formatter="formatDate"></el-table-column>
            <el-table-column label="当前状态" width="80">
              <template
                slot-scope="scope"
              >{{scope.row.status==0?'已结案':scope.row.status==1?'在逃':'已报警'}}</template>
            </el-table-column>
            <el-table-column prop="update_time" label="更新时间" width="180" :formatter="formatDate"></el-table-column>
            <el-table-column label="操作">
              <i class="el-icon-edit-outline"></i>
            </el-table-column>
          </el-table>
        </template>
      </el-tab-pane>
      <el-tab-pane label="被偷车辆管理">
        <template>
          <el-table :data="stolenCarData" style="width: 100%">
            <el-table-column prop="car_number" label="车牌号" width="80"></el-table-column>
            <el-table-column prop="car_color" label="颜色" width="80"></el-table-column>
            <el-table-column label="品牌" width="80" prop="car_model"></el-table-column>
            <el-table-column prop="owner_name" label="车主姓名" width="120"></el-table-column>
            <el-table-column prop="owner_identify" label="车主身份证号" width="160"></el-table-column>
            <el-table-column prop="stolen_time" label="被盗时间" width="180" :formatter="formatDate"></el-table-column>
            <el-table-column label="当前状态" width="80">
              <template
                slot-scope="scope"
              >{{scope.row.status==0?'已结案':scope.row.status==1?'在逃':'已报警'}}</template>
            </el-table-column>
            <el-table-column prop="update_time" label="更新时间" width="180" :formatter="formatDate"></el-table-column>
            <el-table-column label="操作">
              <i class="el-icon-edit-outline"></i>
            </el-table-column>
          </el-table>
        </template>
      </el-tab-pane>
    </el-tabs>
    <el-popover
      popper-class="myPopover0"
      placement="bottom"
      title="新增在逃犯"
      width="500"
      trigger="manual"
      content=""
      v-model="visible"
      v-if="tab_index == 0"
    >
      <el-row>
        <el-col :span="8" style="margin-top: 50px;">
            <div style="text-align:center;">
                <img class="escapeImg" :src="imageUrl" alt  />
                <p class="img_title">嫌犯照片</p>
            </div>
          <div class="file">
              上传
            <input type="file" name="pic" ref="imgInput" @change="saveSrc()" />
          </div>
        </el-col>
        <el-col :span="16">
          <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign">
            <el-form-item label="姓名：">
              <el-input v-model="formLabelAlign.name" clearable></el-input>
            </el-form-item>
            <el-form-item label="性别：">
                <el-radio-group v-model="formLabelAlign.resource">
                  <el-radio label="男"></el-radio>
                  <el-radio label="女"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="身份证号：">
              <el-input v-model="formLabelAlign.region" clearable></el-input>
            </el-form-item>
            <el-form-item label="案件类型：">
              <el-input v-model="formLabelAlign.type"></el-input>
            </el-form-item>
            <el-form-item label="逃离时间：">
                <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="formLabelAlign.date1" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                <el-time-picker placeholder="选择时间" v-model="formLabelAlign.date2" style="width: 100%;"></el-time-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="当前状态：">
                <el-radio-group v-model="formLabelAlign.status">
                <el-radio label="在逃"></el-radio>
                <el-radio label="结案"></el-radio>
                <el-radio label="已报警"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item style="text-align:right;">
            <el-button type="primary"  style="padding: 8px 20px;">确定</el-button>
        </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-button
        type="primary"
        slot="reference"
        @click="visible = !visible"
        round
        style="position: absolute;right: 100px;top: 12px;padding: 8px 17px;"
        icon="el-icon-plus"
      >新增</el-button>
    </el-popover>

    <!-- 新增被偷车辆 -->
    <el-popover
      popper-class="myPopover1"
      placement="bottom"
      title="新增被偷车辆"
      width="350"
      trigger="manual"
      content=""
      v-model="visible"
      v-if="tab_index == 1"
    >
      <el-row>
        <el-col :span="24">
          <el-form :label-position="labelPosition" label-width="100px" :model="formstolenCar">
            <el-form-item label="车牌号：">
              <el-input v-model="formstolenCar.car_number" clearable></el-input>
            </el-form-item>
            <el-form-item label="颜色：">
               <el-input v-model="formstolenCar.car_color" clearable></el-input>
            </el-form-item>
            <el-form-item label="品牌：">
              <el-input v-model="formstolenCar.car_model" clearable></el-input>
            </el-form-item>
            <el-form-item label="车主姓名：">
              <el-input v-model="formstolenCar.owner_name"></el-input>
            </el-form-item>
            <el-form-item label="车主身份证号：">
              <el-input v-model="formstolenCar.owner_identify"></el-input>
            </el-form-item>
            <el-form-item label="被偷时间：">
                <el-col :span="24">
                <el-date-picker
                  v-model="formstolenCar.stolenTime"
                  type="datetime"
                  :picker-options="pickerOptions"
                   @change="pickStolenTime"
                  placeholder="选择日期时间">
                </el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="当前状态：">
                <el-radio-group v-model="formstolenCar.status">
                <el-radio  label="1">在逃</el-radio>
                <el-radio  label="0">结案</el-radio>
                <el-radio  label="2">已报警</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item style="text-align:right;">
                <el-button type="primary" @click="addStolenCar" style="padding: 8px 20px;">确定</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-button
        type="primary"
        slot="reference"
        @click="visible = !visible"
        round
        style="position: absolute;right: 100px;top: 12px;padding: 8px 17px;"
        icon="el-icon-plus"
      >新增</el-button>
    </el-popover>
  </div>
</template>
<script>
import qs from 'querystring';
export default {
  name: "SystemCase",
  data() {
    return {
      // 在逃犯数据
      fugitiveData: [],
      // 被偷车辆数据
      stolenCarData: [],
      tab_index:0,
      visible: false,
      labelPosition: "right",
      // 在逃犯数据
      formLabelAlign: {
        name: "",
        region: "",
        type: "",
        resource:"",
        date1:"",
        date2:"",
        status:""
      },
      // 被偷车辆数据
      formstolenCar: {
        car_number: "",
        car_color: "",
        car_model: "",
        owner_name:"",
        owner_identify:"",
        stolenTime:"",
        status:""
      },
      pickerOptions:{                                 //禁用当前日期之前的日期
            disabledDate(time) {
            //Date.now()是javascript中的内置函数，它返回自1970年1月1日00:00:00 UTC以来经过的毫秒数。
                return time.getTime() > Date.now() - 8.64e7;
            },
        },
      imageUrl:""
    };
  },
  beforeRouteEnter: function(to, from, next) {
    next(function(vm) {
      // 在逃犯
      vm.$http
        .get("/api/escape_persons", {
          params: {
            token: window.localStorage.getItem("userToken")
          }
        })
        .then(function(response) {
          console.log(response.data);
          vm.fugitiveData = response.data;
        });
      
    });
  },
  created:function(){
    this.getStolenCar()
  },
  methods: {
      tab_add(targetName){
          // console.log(targetName.index)
        this.tab_index = targetName.index
      },
    //方法区
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
        (dt.getMonth() + 1) +
        "-" +
        dt.getDate() +
        " " +
        dt.getHours() +
        ":" +
        dt.getMinutes() +
        ":" +
        dt.getSeconds()
      );
    },
    // 上传缩略图
    uploadImgBtn() {
      let form = new FormData($("#form")[0]);
      let _this = this;
      this.$http({
        url: "请求地址",
        type: "post",
        data: form,
        dataType: "json",
        processData: false,
        contentType: false,
        async: false,
      }).then(function(response){
        _this.form.picture = res.data;
      });
    },

    // 保存图片路径为base64,这一步是为了完成预览功能
    saveSrc(e) {
      let file = this.$refs.imgInput.files[0];
      if (file === undefined) {
        this.imageUrl = " ";
        console.log("没有选择图片");
      }
      const _this = this;
      let reader = new FileReader();
      reader.readAsDataURL(file); // 读出 base64
      reader.onloadend = function() {
        _this.imageUrl = reader.result;
      };
      this.uploadImgBtn();
    },
    getStolenCar(){
      var app=this
      // 被偷车辆
      this.$http.get("/api/stolen_cars", {
          params: {
            token: window.localStorage.getItem("userToken")
          }
        })
        .then(function(response) {
          console.log(response.data);
          app.stolenCarData = response.data;
        });
    },
    // 被偷时间
    // p为不够10添加0的函数
    p(s) {
          return s < 10 ? '0' + s : s
    },
    pickStolenTime(val){ 
        const d = new Date(val)
        const resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate())
        const resTime = this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds())
        this.formstolenCar.stolenTime=resDate+' '+resTime;
    },
    // 新增被偷车辆
    addStolenCar(){
      var app = this;
      var data = qs.stringify({
          car_number: this.formstolenCar.car_number,
          car_color: this.formstolenCar.car_color,
          car_model: this.formstolenCar.car_model,
          owner_name: this.formstolenCar.owner_name,
          owner_identify: this.formstolenCar.owner_identify,
          stolen_time: this.formstolenCar.stolenTime,
          status: this.formstolenCar.status
      })
      console.log(data);
       app.$http.post("/api/stolen_cars", data,{
         params: {
            token: window.localStorage.getItem("userToken")
          }
       }).then(function(response) {
          // console.log(response);
          app.visible = false;
          app.getStolenCar();
       })
    }
  }
};
</script>
<style>
.el-tabs--border-card > .el-tabs__header {
  width: 236px;
}
.el-table th > .cell {
  color: #000;
  text-align: center;
  background: #f9f9f9;
  line-height: 44px;
}
.el-table td > .cell {
  text-align: center;
}
.el-table tr:first-child th {
  padding: 0;
}
.el-popover.myPopover0{
    left: 650px!important;
}
.el-popover.myPopover1{
    left: 800px!important;
}
.el-popover.myPopover1 .el-form-item__label{
  width: 120px!important;
}
.el-popover.myPopover1 .el-form-item__content{
  margin-left:120px!important; 
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
.img_title{
    margin-top: 10px;
    margin-bottom: 25px;
    letter-spacing: 3px;
    font-weight: 600;
}
.el-input input{
    height: 32px;
    line-height: 32px;
    background-color: #f9f9f9;
    border: none;
}

.el-form-item {
    margin-bottom: 10px;
}
.file {
    position: relative;
    left: 50%;
    margin-left: -37px;
    display: inline-block;
    background: #409EFF;
    border: 1px solid #99D3F5;
    border-radius: 28px;
    padding: 6px 20px;
    overflow: hidden;
    color: #FFF;
    text-decoration: none;
    text-indent: 0;
    line-height: 20px;
    
}
.file input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
}
.el-popover.myPopover0 .popper__arrow{
    left: 490px !important;
}
.el-popover.myPopover1 .popper__arrow{
    left: 340px !important;
}
.el-popover__title{
    color: #409EFF;
    font-weight: 600;
}
</style>
