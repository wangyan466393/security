<template>
  <div style="position:relative">
    <el-tabs type="border-card" @tab-click="tab_add">
      <el-tab-pane label="在逃犯管理">
        <template>
          <el-table :data="fugitiveDataPage" style="width: 100%" @row-click="handleRowClick">
            <el-table-column prop="person_name" label="姓名" width="80"></el-table-column>
            <el-table-column label="性别" width="80">
              <template slot-scope="scope">{{scope.row.gender==1?'男':'女'}}</template>
            </el-table-column>
            <el-table-column label="照片" width="80">
              <template slot-scope="scope" :show-overflow-tooltip="true">
                <img
                  :src="'data:image/jpeg;base64,'+scope.row.person_img"
                  width="45"
                  height="50"
                  class="head_pic"
                />
              </template>
            </el-table-column>
            <el-table-column prop="identity_id" label="身份证号" width="160"></el-table-column>
            <el-table-column prop="case_type" label="案件类型" width="100"></el-table-column>
            <el-table-column prop="escape_time" label="逃离时间" width="180" :formatter="formatDate"></el-table-column>
            <el-table-column label="当前状态" width="110">
              <template
                slot-scope="{$index,row}" 
              >
              <div class="select">
              <span v-if="!editEscaped[$index]">{{row.status==0?'已结案':row.status==1?'在逃':'已报警'}}</span>
              <el-select v-if="editEscaped[$index]" v-model="row.status" placeholder="请选择" @change="updateStatus">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="update_time" label="更新时间" width="180" :formatter="formatDate"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{$index,row}">
                <i class="el-icon-edit-outline" @click="editEscapedPerson($index,row)" ></i>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-tab-pane>
      <el-tab-pane label="被偷车辆管理">
        <template>
          <el-table :data="fugitiveDataPage" style="width: 100%" @row-click="handleRowClick">
            <el-table-column prop="car_number" label="车牌号" width="100"></el-table-column>
            <el-table-column prop="car_color" label="颜色" width="80"></el-table-column>
            <el-table-column label="品牌" width="80" prop="car_model"></el-table-column>
            <el-table-column prop="owner_name" label="车主姓名" width="120"></el-table-column>
            <el-table-column prop="owner_identify" label="车主身份证号" width="170"></el-table-column>
            <el-table-column prop="stolen_time" label="被盗时间" width="180" :formatter="formatDate"></el-table-column>
            <el-table-column label="当前状态" width="110">
            <template
                slot-scope="{$index,row}" 
              >
              <div class="select">
              <span v-if="!editStolCar[$index]">{{row.status==0?'已结案':row.status==1?'在逃':'已报警'}}</span>
              <el-select v-if="editStolCar[$index]" v-model="row.status" placeholder="请选择" @change="updateStatus">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                </div>
              </template>
              <!-- <template  slot-scope="scope">
                <span>
                    {{scope.row.status==0?'已结案':scope.row.status==1?'在逃':'已报警'}}
                </span>
              </template> -->
            </el-table-column>
            <el-table-column prop="update_time" label="更新时间" width="180" :formatter="formatDate"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{$index,row}">
                 <i @click.prevent='editStolenCar($index,row)' class="el-icon-edit-outline"></i>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-tab-pane>
      <el-pagination
        :hide-on-single-page="paginationVal"
        :total="total"
        :page-size="pageSize"
        @prev-click="prevPage"
        @next-click="nextPage"
        @current-change="currentPageFunc"
        :current-page='currentPage'
        layout="prev, pager, next">
      </el-pagination>
    </el-tabs>
    <el-popover
      popper-class="myPopover0"
      placement="bottom"
      title="新增在逃犯"
      width="500"
      trigger="click"
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
              <el-input v-model="formLabelAlign.person_name" clearable></el-input>
            </el-form-item>
            <el-form-item label="性别：">
                <el-radio-group v-model="formLabelAlign.gender">
                  <el-radio label="男" ></el-radio>
                  <el-radio label="女" ></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="身份证号：">
              <el-input v-model="formLabelAlign.identity_id" clearable></el-input>
            </el-form-item>
            <el-form-item label="案件类型：">
              <el-input v-model="formLabelAlign.case_type"></el-input>
            </el-form-item>
            <el-form-item label="逃离时间：">
                  <el-date-picker
                    style="width:233px"
                    v-model="formLabelAlign.escapeTime"
                    type="datetime"
                    placeholder="选择日期时间">
                  </el-date-picker>
            </el-form-item>
            <el-form-item label="当前状态：">
                <el-radio-group v-model="formLabelAlign.status">
                <el-radio :label="1">在逃</el-radio>
                <el-radio :label="0">结案</el-radio>
                <el-radio :label="2">已报警</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item style="text-align:right;">
            <el-button type="primary"  style="padding: 8px 20px;" @click="addEscapedPerson">确定</el-button>
        </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-button
        type="primary"
        slot="reference"
        
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
      trigger="click"
      content=""
      v-model="visible"
      v-if="tab_index == 1"
    >
      <el-row>
        <el-col :span="24">
          <el-form :label-position="labelPosition" label-width="100px" :model="formstolenCar">
            <el-form-item label="车牌号：">
              <el-input ref='refCarNumber' @blur="carNumberBlur" v-model="formstolenCar.car_number" clearable></el-input>
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
              <el-input ref='refIdentify' @blur="identifyBlur" v-model="formstolenCar.owner_identify"></el-input>
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
        person_name: "",   
        gender: "",    //性别
        case_type: "",   //案件类型
        identity_id:"",   //身份证号
        escapeTime:"",   //在逃时间
        status:""
      },
      editEscaped: [],    //编辑在逃犯状态切换
      rowId:"",
      person_id:"",       //疑犯id
      indexStatus:"",   //编辑指定行下标
      options: [{
          value: 1,
          label: '在逃'
        }, {
          value: 2,
          label: '已报警'
        }, {
          value: 0,
          label: '已结案'
        }],
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
      editStolCar: [],    //编辑被偷车辆状态切换
      car_id:'',//被偷车辆id
      pickerOptions:{                                 //禁用当前日期之前的日期
            disabledDate(time) {
            //Date.now()是javascript中的内置函数，它返回自1970年1月1日00:00:00 UTC以来经过的毫秒数。
                return time.getTime() > Date.now() - 8.64e7;
            },
        },
      imageUrl:"",
      paginationVal:true, //只有一页时隐藏页码
      total:0,     //数据总数
      pageSize:10,     //每页显示个数
      currentPage:1    //当前页
    };
  },
  created:function(){
    this.getStolenCar();
    this.getEscapedPersons();
  },
  computed: {
    fugitiveDataPage(){
      let startVal =parseInt((this.currentPage-1) * this.pageSize);
      if(this.tab_index==0){
        return this.fugitiveData.slice(startVal,startVal+this.pageSize)  ; 
      }else{
        return this.stolenCarData.slice(startVal,startVal+this.pageSize)  ; 
      }
          
      //1页 0  5  1-1 *5     (currentPage-1)*pageSize    (currentPage-1)*pageSize + pageSize
      //2页 5 10   2-1 *5
      //3页 10 15   3-1 *5
    }
  },
  methods: {
    prevPage(val){
      this.currentPage = val
    },
    nextPage(val){
      this.currentPage = val
    },
    currentPageFunc(val){
      this.currentPage = val
    },
    //获取在逃犯数据
    getEscapedPersons(){
      var that = this;
      this.$http
        .get("/api/escape_persons", {
          params: {
            token: window.localStorage.getItem("userToken")
          }
        })
        .then(function(response) {
          if(response.data){
              that.fugitiveData = response.data;
              that.total = response.data.length;
          }
          
        });
    },
    //编辑疑犯状态
    editEscapedPerson(index,row){
      console.log(row);
      this.rowId = row.id;
      this.indexStatus = index;
      this.editEscaped[index] = true;
      this.$set(this.editEscaped, index, true);
      this.person_id = row.id
    },
    updateStatus(val){   //更新疑犯状态数据
      var that = this;
      if(this.tab_index==0){
        var data = qs.stringify({
          person_id:this.person_id,
          status:val
        })
        this.$http.put("/api/escape_person_status",data,{
          params:{
            token:window.localStorage.getItem("userToken")
          }
        }).then(function(response){
            console.log(response);
            if (response.status == 200 && response.data.length>0) {
                that.$message({
                  message: '疑犯状态修改成功！',
                  type: 'success'
                });
                that.getEscapedPersons();
                that.editEscaped[that.indexStatus] = false;
                that.$set(that.editEscaped, that.indexStatus, false);
            }else{
              that.$message.error('修改状态失败，请重试！');
            }
        })
      }else{
        var data = qs.stringify({
          car_id:this.car_id,
          status:val
        })
        this.$http.put("/api/stolen_car_status",data,{
          params:{
            token:window.localStorage.getItem("userToken")
          }
        }).then(function(response){
            console.log(response);
            if (response.status == 200 && response.data.length>0) {
                that.$message({
                  message: '被盗车辆状态修改成功！',
                  type: 'success'
                });
                that.getStolenCar();
                that.editStolCar[that.indexStatus] = false;
                that.$set(that.editStolCar, that.indexStatus, false);
            }else{
              that.$message.error('修改状态失败，请重试！');
            }
        })
      }
      
    },
    handleRowClick(row, column, event){
      console.log(row, column, event)
      if (row.id != this.rowId) {
        console.log(this.tab_index);
        if(this.tab_index==0){
          this.editEscaped[this.indexStatus] = false;
          this.$set(this.editEscaped, this.indexStatus, false);
        }else if(this.tab_index==1){
          this.editStolCar[this.indexStatus] = false;
          this.$set(this.editStolCar, this.indexStatus, false);
        }
        
      }
    },
    //新增疑犯
    addEscapedPerson(){
        var that = this;
        var data = qs.stringify({
          person_name: this.formLabelAlign.person_name,
          gender: this.formLabelAlign.gender== "男" ? 1 : 2,
          person_img: this.imageUrl.split(",")[1],
          identity_id: this.formLabelAlign.identity_id,
          case_type: this.formLabelAlign.case_type,
          escape_time: this.$moment(this.formLabelAlign.escapeTime).format("YYYY-MM-DD HH:mm:ss"),
          status: this.formLabelAlign.status
      })
        this.$http.post("/api/escape_persons",data,{params:{token: window.localStorage.getItem("userToken")}}).then(function(response){
            console.log(response);
            if (response.status == 201) {
                that.$message({
                  message: '新增在逃犯信息成功！',
                  type: 'success'
                });
                that.visible = false;
                that.getEscapedPersons();
                that.formLabelAlign=''
            }
        }).catch(function(error){
               that.$message.error('新增失败，请填写完整在逃犯信息！');
            })
    },
    tab_add(targetName){
          // console.log(targetName.index)
        this.tab_index = targetName.index;
        this.currentPage =1;
        this.visible=false;
      },
    //时间方法区
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
        this.p((dt.getMonth() + 1)) +
        "-" +
        this.p(dt.getDate()) +
        " " +
        this.p(dt.getHours()) +
        ":" +
        this.p(dt.getMinutes()) +
        ":" +
        this.p(dt.getSeconds())
      );
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
    //车牌号验证方法
    isVehicleNumber(vehicleNumber) {
      var xreg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
      var creg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
      if(vehicleNumber.length == 7){
        return creg.test(vehicleNumber);
      } else if(vehicleNumber.length == 8){
        return xreg.test(vehicleNumber);
      } else{
        return false;    
      }
    },
    // 车牌号失去焦点验证
    carNumberBlur(){
      console.log(this.formstolenCar.car_number);
      var carNumReg=this.isVehicleNumber(this.formstolenCar.car_number);
      console.log(carNumReg);
      if(carNumReg==false){
        this.$message({
          message: '请输入正确的车牌号',
          type: 'warning'
        });
        this.formstolenCar.car_number='';
        this.$refs.refCarNumber.focus();
      }
    },
    identifyBlur(){
      var identifyReg= this.checkIDCard(this.formstolenCar.owner_identify);
      if(identifyReg==false){
        this.$message({
          message: '请输入正确的身份证号',
          type: 'warning'
        });
        this.formstolenCar.owner_identify='';
        this.$refs.refIdentify.focus();
      }
    },
    // 函数参数必须是字符串，因为二代身份证号码是十八位，而在javascript中，十八位的数值会超出计算范围，造成不精确的结果，导致最后两位和计算的值不一致，从而该函数出现错误。
    // 详情查看javascript的数值范围
    checkIDCard(idcode){
        // 加权因子
        var weight_factor = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
        // 校验码
        var check_code = ['1', '0', 'X' , '9', '8', '7', '6', '5', '4', '3', '2'];

        var code = idcode + "";
        var last = idcode[17];//最后一位

        var seventeen = code.substring(0,17);

        // ISO 7064:1983.MOD 11-2
        // 判断最后一位校验码是否正确
        var arr = seventeen.split("");
        var len = arr.length;
        var num = 0;
        for(var i = 0; i < len; i++){
            num = num + arr[i] * weight_factor[i];
        }
        
        // 获取余数
        var resisue = num%11;
        var last_no = check_code[resisue];

        // 格式的正则
        // 正则思路
        /*
        第一位不可能是0
        第二位到第六位可以是0-9
        第七位到第十位是年份，所以七八位为19或者20
        十一位和十二位是月份，这两位是01-12之间的数值
        十三位和十四位是日期，是从01修改-31之间的数值
        十五，十六，十七都是数字0-9
        十八位可能是数字0-9，也可能是X
        */
        var idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;

        // 判断格式是否正确
        var format = idcard_patter.test(idcode);

        // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
        return last === last_no && format ? true : false;
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
          if (response.status == 201) {
                app.$message({
                  message: '新增被偷车辆成功！',
                  type: 'success'
                });
                app.visible = false;
                app.getStolenCar();
                app.formstolenCar='';
            }
       }).catch(function(error){
            app.$message.error('新增失败，请填写完整信息！');
      })
    },
    // 编辑被偷车辆
    editStolenCar(index,row){
      console.log(row);
      this.car_id=this.rowId = row.id;
      this.indexStatus = index;
      this.editStolCar[index] = true;
      this.$set(this.editStolCar, index, true);
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
.el-icon-edit-outline{
  font-size: 22px;
  color: #409EFF;
}
.el-pagination{
  text-align: right;
}
.select .el-input__icon{
  line-height: 0 !important;
}
</style>
