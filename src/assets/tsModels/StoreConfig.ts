/**
 *
 * كلاس بيانات التخزين
 */
import {collect} from "collect.js";

const {ipcMain} = require('electron') // used to communicate asynchronously from the main process to renderer processes.
import * as electron from 'electron';

export default abstract class StoreConfig {


    public static async saveIpcRenderer(value: any) {
        await electron.ipcRenderer.invoke('saveStoreValue', value)
    }


    public static async getIpcRenderer(d: string) {
        //console.log(d, 'getIpcRenderer')
        return await electron.ipcRenderer.invoke('getStoreValue', d);

    }


    /**
     * جلب بينات السيرفر المحلي
     */
    public static async getLocalHost() {
        return this.getIpcRenderer('localhost');
    }


    /**
     * حفظ بيانات السيرفر المحلي
     * @param serverIpTxtBox
     */
    public static saveLocalHost(serverIpTxtBox: string) {

        this.saveIpcRenderer({
            localhost: {
                'host': serverIpTxtBox,
                'database': 'db_config',
                charset: 'utf8',
            }
        })
    }


    /**
     * جلب بينات السيرفر
     */
    public static getServerHost() {

        return this.getIpcRenderer('serverhost');


    }


    /**
     * جلب اسم قاعدة البينات المحفوظة
     */
    public static async getServerHostDbName() {

        return await this.getIpcRenderer('serverhost.database');


    }


    public static async getServerHostDbTitleSelect() {

        let AllDb = await this.getAllDB();
        let dbSelected = await this.getServerHostDbName();

        // console.log(AllDb, 'AllDb')
        // console.log(dbSelected, 'dbSelected')

       let title = collect(AllDb).where('da_name', dbSelected);

        // @ts-ignore
        return title.first().da_title;

        // @ts-ignore
       // console.log(title.first().da_title, 'title')

    }


    /**
     * تعديل اسم قاعدة البينات
     * @param db
     */
    public static async setServerHostDbName(db: string) {
        return await this.saveIpcRenderer({'serverhost.database': db});
    }


    /**
     * حفظ بيانات السيرفر
     * @param serverIpTxtBox
     * @param dbName
     */
    public static saveServerHost(serverIpTxtBox: string, dbName: string) {
        this.saveIpcRenderer({
            serverhost: {
                'host': serverIpTxtBox,
                'database': dbName,
                charset: 'utf8',
            }
        })

    }


    /**
     * حفط الرقم السري واسم المستخدم
     * @param dbName
     */
    public static getPasswordAndUserNameSaveSelectDB(dbName: string) {
        return this.getIpcRenderer(`${dbName}`);


    }

    // @ts-ignore
    /**
     * جلب بينات اسم المستخد والرقم السري
     * @param dbName
     * @param userName
     * @param password
     */

    public static savePasswordSaveSelectDB(dbName: string, userName: string, password: string) {
        let infoDbSelected = {};
        // @ts-ignore
        infoDbSelected[dbName] = {'userName': userName, 'password': password}
        this.saveIpcRenderer(infoDbSelected);
    }


    public static saveInfoDBSelecteed(dbTitle: string, dbName: string) {

        interface IDictionary {
            [index: string]: string;
        }

        let params = {} as IDictionary;

        params[dbName] = dbTitle; // okay

        this.saveIpcRenderer({info: params});

    }


    public static SaveAllDB(db: object) {
        this.saveIpcRenderer({allDBConfig: db});
    }


    public static getAllDB() {
        return this.getIpcRenderer(`allDBConfig`);
    }


    public static async getRegisterApp() {
        return this.getIpcRenderer('registerApp');
    }


    public static async saveRegisterApp(v: any) {
        return this.saveIpcRenderer({registerApp: v});
    }


}