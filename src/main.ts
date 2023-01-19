import { createApp } from 'vue'
import App from './App.vue'
import './samples/node-api'
import router from "./router";
import "bootstrap/dist/css/bootstrap.rtl.css";
import "bootstrap";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/assets/css/myStyle.css'
import RegisterApp from "@/assets/tsModels/RegisterApp";
import DayNameAr from "@/assets/tsModels/DayNameAr";
const dayjs = require('dayjs');
const moment = require('moment');

import Numbro from 'numbro';
import MysqlAsyncClass from "@/assets/tsModels/MysqlAsyncClass";


let app = createApp(App);
app.use(router);
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}


RegisterApp.checkisRegister().then(v=>{
    console.log(v,'check is Reg')
    if (v=== true){
        app.config.globalProperties.$GlobalBlurCss = 'isReg'
    }else {
        app.config.globalProperties.$GlobalBlurCss = 'blur'
    }
}).catch(v=>{
    app.config.globalProperties.$GlobalBlurCss = 'blur'
})


app.config.globalProperties.$moment=  moment;
app.config.globalProperties.$dayjs=  dayjs;
app.config.globalProperties.$dayNameAr=  DayNameAr;
app.config.globalProperties.$Numbro=  Numbro;
app.config.globalProperties.$mysqlAsyncClass= new MysqlAsyncClass('serverhost');

Numbro.setDefaults({
    thousandSeparated: true,
    mantissa: 2
});

app.mount('#app')
    .$nextTick(() => {
        postMessage({ payload: 'removeLoading' }, '*')
    })



