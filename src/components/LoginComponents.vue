<template>

  <div class='d-flex justify-content-md-center align-items-center vh-100'>
  <div class="container">

    <el-card class="box-card" v-loading="isLoadingParent">
      <el-form :inline="false" :model="form" label-width="120px">
        <el-row gutter="20">
          <el-col :span="24">
            <div class="mt-4">
              <el-form-item label="Server Host">
                <el-input v-model="form.serverIpTxtBox" v-on:keyup.enter="testConnection" placeholder="Server Host">
                  <template #append>

                    <el-button @click="testConnection" :loading="isLoadingParent" style="width: 100px" color="#409EFC">
                      <BottomLeft color="#409EFFFF" style="width: 1em; height: 1em; margin-right: 8px" />
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="السنة المالبة">
              <el-select :disabled="!isConnectionServer" v-model="form.selectedValueYear" loading-text="تحميل بيانات"
                         @change="updateDropdownsSelectYear" remote
                         placeholder="اختيار السنة المالية" :loading="loadingSelectYare" :fit-input-width="400">
                <el-option v-for="item in dataSelectYare" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="24">
            <el-form-item label="اسم المستخدم">
              <el-input v-model="form.userName"  :disabled="!isConnectionServer" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="24">

            <el-form-item label="الرقم السري">
              <el-input v-model="form.password" type="password"  :disabled="!isConnectionServer" show-password autocomplete="off" placeholder="">
                <template #append>
                  <el-button @click="savePassword" title="حفظ الرقم السري" style="width: 100px" color="#409EFC">
                    <Tools color="#409EFFFF" style="width: 1em; height: 1em; margin-right: 8px" />
                  </el-button>

                </template>
              </el-input>
            </el-form-item>

          </el-col>
        </el-row>


        <el-row>
          <el-col :span="24">

            <el-button type="primary" @click="onSubmit" :disabled="isDisabledLogin">دخول</el-button>

          </el-col>
        </el-row>

      </el-form>
    </el-card>
  </div>
  </div>


</template>
<script>
import MysqlAsyncClass from "@/assets/tsModels/MysqlAsyncClass";
import { collect } from "collect.js";
import * as electron from "electron";
import StoreConfig from "@/assets/tsModels/StoreConfig";
import { ElNotification } from "element-plus";
import $ from "jquery";

export default {
  data() {
    return {
      dataSelectYare   : [],
      allData          : [],
      loadingSelectYare: false,
      isLoadingParent  : false,
      isDisabledLogin  : true,
      isConnectionServer: false,
      form             : {
        selectedValueYear: null,
        serverIpTxtBox   : null,
        userName         : "",
        password         : ""
      }
    };
  },

  methods: {
    onSubmit() {
      let self = this;
      self.isLoadingButtonLogin = true;
      let mysqlAsyncClass = new MysqlAsyncClass("serverhost");
      let userName = self.form.userName;
      let password = self.form.password || "";
      //console.log(userName, password);

      mysqlAsyncClass.login(self.form.userName, self.form.password).then(function(rows) {

        if (rows.length > 0) {
          createWindow();
          ElNotification({
            title   : "Success",
            message : "تم تسجيل الدخول",
            type    : "success",
            position: "bottom-left"
          });
        } else {
          ElNotification({
            title   : "Warning",
            message : "لم يتم تسجيل الدخول تاكد من اسم المستخدم او كلمة المرور",
            type    : "warning",
            position: "bottom-left"
          });
        }
      }).finally(v => {
        self.isLoadingButtonLogin = false;
      });
    },
    updateDropdownsSelectYear() {

      let self = this;
      this.isLoadingParent = true;
      this.isDisabledLogin = false;
      let getSelected = collect(self.allData).
        filter((value, key) => value.da_name === self.form.selectedValueYear).
        first();
      let proxy = JSON.parse(JSON.stringify(getSelected));

      StoreConfig.saveServerHost(self.form.serverIpTxtBox, proxy.da_name);
      StoreConfig.getPasswordAndUserNameSaveSelectDB(proxy.da_name).then(v => {
        try {
          if (collect(v).isEmpty()){
            return;
          }
          this.form.userName = collect(v).has("userName") ? v.userName : "";
          this.form.password = collect(v).has("password") ? v.password : "";
        } catch (e) {
          self.form.userName = "";
          self.form.password = "";
          console.log(e);
        }

      }).finally(() => {
        this.isLoadingParent = false;

      });

    },
    /**
     * تحميل البيانات
     */
    reloadData() {
      let self = this;
      self.loadingSelectYare = true;
      self.dataSelectYare = [];
      let mysqlAsyncClass = new MysqlAsyncClass("localhost");
      mysqlAsyncClass.getListDB().then(rows => {
        console.log(rows, "rrrws");
        self.loadingSelectYare = false;
        self.isConnectionServer = true;
        self.allData = rows;
        StoreConfig.SaveAllDB(rows);
        self.dataSelectYare = collect(rows).map(row => {
          return { value: row.da_name, label: row.da_title };
        }).toArray();
      }).catch(err => {
        self.isConnectionServer = false;
        console.log(err);
      });
    },
    /**
     * تجريب الاتصال
     */
    testConnection() {
      let self = this;
      console.log("TestConnection");
      this.isLoadingParent = true;
      this.isDisabledLogin = true;
      self.isConnectionServer = false;
      this.form.selectedValueYear = null;
      this.dataSelectYare = null;
      let testConn = new MysqlAsyncClass("localhost");
      testConn.testConnection(this.form.serverIpTxtBox).then(result => {
        if (result) {
          StoreConfig.saveLocalHost(self.form.serverIpTxtBox);
          self.reloadData();
          ElNotification({
            title   : "Success",
            message : " تم الاتصال بنجاح",
            type    : "success",
            position: "bottom-left"
          });
          self.isConnectionServer = true;
        } else {
          ElNotification({
            title   : "Error",
            message : "لم يتم الاتصال ",
            type    : "error",
            position: "bottom-left"
          });
        }

      }).catch(err => {

        ElNotification({
          title   : "Error",
          message : "لم يتم الاتصال بنجاح",
          type    : "error",
          position: "bottom-left"
        });

      }).finally(() => {
        this.isLoadingParent = false;
      });

    },
    savePassword() {
      let userName = this.form.userName;
      let password = this.form.password || "";
      console.log("Sve");
      StoreConfig.savePasswordSaveSelectDB(this.form.selectedValueYear, userName, password);
      ElNotification({
        title   : "Success",
        message : " تم  بنجاح",
        type    : "success",
        position: "bottom-left"
      });
    }
  },
  mounted() {
    this.isLoadingParent = true;
    StoreConfig.getLocalHost().then(v => {
      this.form.serverIpTxtBox = v.host;
      this.reloadData();
    }).finally(() => {
      this.isLoadingParent = false;
    });

    $("html").attr("dir", "ltr");
  }

};

function createWindow() {
  electron.ipcRenderer.send("openIndexWindow", "/home");
  window.close();
}


</script>


<style scoped >


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

.label {
  padding-left: 20px;

}

.el-button .custom-loading .circular .path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: var(--el-button-text-color);
  stroke-linecap: round;
}

html {
  overflow: scroll;
  overflow-x: hidden;
}
::-webkit-scrollbar {
  width: 0;  /* Remove scrollbar space */
  background: transparent;  /* Optional: just make scrollbar invisible */
}
/* Optional: show position indicator in red */
::-webkit-scrollbar-thumb {
}
</style>
