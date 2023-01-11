
import StoreConfig from "@/assets/tsModels/StoreConfig";

const serialNumber = require('serial-number');
const md5 = require('md5');
serialNumber.preferUUID = true;

export default abstract class RegisterApp {


    private static keyPassword:string= "14149566";

    /**
     *
     * @param companyName   اسم الشركة
     * @param serialApp  السيريال المستخرج من الجهاز الي
     * @param keyApp  مفتاح التسجيل المشفر
     */
    public static async saveRegister(companyName: string, serialApp: string, keyApp: string) {
        let self = this;
        return new Promise(resolve => {
            let hashSerialApp: string =serialApp+self.keyPassword;
            //console.log(keyApp,'KeyApp')
            //console.log(hashSerialApp,'hashSerialApp')


            if (md5(hashSerialApp) === keyApp) {
                resolve(true);
                let regInfo = {
                    companyName:companyName,
                    serialApp:serialApp,
                    keyApp:keyApp
                }
                StoreConfig.saveIpcRenderer({'registerApp':regInfo});
            }else {
                resolve(false);
            }
        })

    }

    /**
     * التاكد من البرنامج مسجل
     */
    public static checkisRegister() {
        return new Promise(resolve => {
            StoreConfig.getIpcRenderer('registerApp').then(v=>{
               // console.log(v,'Infooo')
                let hashSerialApp: string =v.serialApp+this.keyPassword;
                let res=  md5(hashSerialApp) === v.keyApp;
                resolve(res);
            }).catch(()=>{
                resolve(false);
            });
        })

    }


    public static async getSerialNumeber() {

        return new Promise(resolve => {
            serialNumber(function (err: any, value: any) {
                resolve(value);
            });

        })


    }


}