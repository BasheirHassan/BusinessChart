<template>

  <el-card class="box-card" v-loading="isLoadingButtonTest">
    <el-form :inline="false"
             :model="form"
             label-width="120px"
    >


      <el-row>
        <el-col :span="24">
          <el-form-item label="اسم التسجيل ">
            <el-input v-model.trim="form.companyName" placeholder="اسم التسجيل" ></el-input>
          </el-form-item>
        </el-col>
      </el-row>


      <el-row>
        <el-col :span="24">
          <el-form-item label="Serial  App">
            <el-input v-model="form.serialApp" disabled  placeholder="Serial App"></el-input>
          </el-form-item>
        </el-col>
      </el-row>


      <el-row>
        <el-col :span="24">

            <el-form-item label="key App">
              <el-input v-model="form.keyApp" placeholder="Key App">
              </el-input>
            </el-form-item>

        </el-col>
      </el-row>




    </el-form>

    <el-row>
      <el-col :span="24">
        <el-form-item>
          <el-button type="primary" @click="onSubmit">تسجيل</el-button>
        </el-form-item>
      </el-col>
    </el-row>

  </el-card>
</template>
<script>

import * as electron from 'electron';
import {ElNotification} from 'element-plus';
import StoreConfig from '../assets/tsModels/StoreConfig';
import RegisterApp from '../assets/tsModels/RegisterApp';
const {ipcMain} = require('electron') // used to communicate asynchronously from the main process to renderer processes.

export default {
  data() {
    return {
      dataSelectYare     : [],
      allData            : [],
      loadingSelectYare  : false,
      isLoadingButtonTest: false,
      form               : {
        companyName: null,
        serialApp  : null,
        keyApp     : null,
      }
    };
  },
  methods: {
    onSubmit() {

      if (this.form.companyName.trim() === ""){
        ElNotification({
          title   : 'Error',
          message : 'لم تقم باختيار اسم التسجيل',
          type    : 'error',
          position: 'bottom-left',
        });
        return ;
      }

      RegisterApp.saveRegister(this.form.companyName, this.form.serialApp, this.form.keyApp).then(v => {

        if (v === true) {
          ElNotification({
            title   : 'Success',
            message : ' تم تسجيل التطبيق  بنجاح -  سيتم اعادة تشغيل التطبيق   ',
            type    : 'success',
            position: 'bottom-left',
          });


          setTimeout(()=>{
            electron.ipcRenderer.invoke('relaunchApp',null)

          },3000)


        } else {
          ElNotification({
            title   : 'Error',
            message : 'رقم تسجيل غير صحيح',
            type    : 'error',
            position: 'bottom-left',
          });
        }
      });
    },
  },
  mounted() {
    RegisterApp.checkisRegister().then(v=>{
      console.log(v,'regggg');
    });

    RegisterApp.getSerialNumeber().then(v => {
      console.log(v);
      this.form.serialApp = v;
    }).catch(err => {
      this.form.keyApp = 'Error Key App';
    });

    StoreConfig.getRegisterApp().then(v => {
      this.form.companyName = v.companyName;
      this.form.keyApp = v.keyApp;
      this.form.serialApp = v.serialApp;
    });

  },

};


</script>


<style scoped>
.el-button .custom-loading .circular {
  margin-right: 6px;
  width: 18px;
  height: 18px;
  animation: loading-rotate 2s linear infinite;
}

.el-button {
  width: 100%;
}

.el-select {
  width: 100%;
}

.el-autocomplete {
  width: 100%;
}

.el-button .custom-loading .circular .path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: var(--el-button-text-color);
  stroke-linecap: round;
}
</style>
