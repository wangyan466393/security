<template>
  <div style="position:relative">
    <el-tabs type="border-card">
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
      placement="bottom"
      title="新增在逃犯"
      width="500"
      trigger="manual"
      content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
      v-model="visible"
    >
      <el-row>
        <el-col :span="8">
            <div style="text-align:center;">
                <img class="escapeImg" :src="imageUrl" alt  />
                <p>嫌犯照片</p>
            </div>
          
          <div>
            <input type="file" name="pic" ref="imgInput" @change="saveSrc()" />
          </div>
          <el-button type="primary" round style="padding: 8px 17px;">上传</el-button>
        </el-col>
        <el-col :span="16">
          <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign">
            <el-form-item label="姓名：">
              <el-input v-model="formLabelAlign.name"></el-input>
            </el-form-item>
            <el-form-item label="性别：">
                <el-radio-group v-model="formLabelAlign.resource">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="身份证号：">
              <el-input v-model="formLabelAlign.region"></el-input>
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
            <el-form-item>
            <el-button type="primary" @click="onSubmit">确定</el-button>
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
      >新增</el-button>
    </el-popover>
  </div>
</template>
<script>
export default {
  name: "SystemCase",
  data() {
    return {
      // 在逃犯数据
      fugitiveData: [],
      // 被偷车辆数据
      stolenCarData: [],
      visible: false,
      labelPosition: "right",
      formLabelAlign: {
        name: "",
        region: "",
        type: "",
        resource:"",
        date1:"",
        date2:"",
        status:""
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
      // 被偷车辆
      vm.$http
        .get("/api/stolen_cars", {
          params: {
            token: window.localStorage.getItem("userToken")
          }
        })
        .then(function(response) {
          console.log(response.data);
          vm.stolenCarData = response.data;
        });
    });
  },
  methods: {
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
.escapeImg{
    margin: auto;
    display: block;
    width: 120px;
    height: 150px;
    border: 1px dashed #ccc;
    border-radius: 5px;
    background: #ececec url(../images/ljp_photo.png) no-repeat center;
    background-size: 90%;
}
.el-input{
    height: 35px;
    line-height: 35px;
    background-color: #ececec;
}
.el-form-item__content{
    text-align: right;
}
</style>
