import {autoUpdater, UpdateInfo} from "electron-updater";
import moment from "moment";
const ProgressBar = require("electron-progressbar");


export default class UpdaterClass {

    private win:any;
    private app:any;

    constructor(win:any,app:any) {
        this.win = win;
        this.app = app;
    }
    checkUpdaterApp(){
        var progressBar = new ProgressBar({
            indeterminate: true,
            title: 'تحديث',
            text: 'جاري بحث عن تحديثات...',
            detail: 'انتظار...',
            closeOnComplete: false,
            browserWindow: {
                parent: this.win,
                closable: true,
                height: 400,

            }
        });


        autoUpdater.checkForUpdatesAndNotify();

        progressBar
            .on('completed', function () {
                progressBar.setCompleted();
            })
            .on('aborted', function () {
                console.info(`aborted...`);
                progressBar.setCompleted();
            });

        progressBar.text = "بحث عن تحديث";
        autoUpdater.on('checking-for-update', () => {
            if (!progressBar.isCompleted()) {
                progressBar.detail = "\n" + "جاري بحث عن تحديثات .....";
            }
        })
        autoUpdater.on('update-available', (info:any) => {
            if (!progressBar.isCompleted()) {

                progressBar.detail += "جاري تحميل ......";
                progressBar.detail += "\n" + "يوجد تحديث جديد .....";
                progressBar.detail += "\n" + info.version;
                progressBar.detail += "\n" + moment(info.releaseDate).format('YYYY-MM-DD');
            }
        })

        autoUpdater.on('update-not-available', (info:UpdateInfo) => {
            if (!progressBar.isCompleted()) {
                progressBar.detail = "لا يتوفر تحديث حاليا";
                progressBar.detail = "\n" + "لا يوجد تحديث جديد";
                progressBar.setCompleted();
            }
        })
        autoUpdater.on('error', (err:any) => {
            if (!progressBar.isCompleted()) {
                progressBar.detail += "\n" + 'لايمكن تحديث الرجاء المحاولة لاحقا' + err;
                progressBar.setCompleted();
            }
        })
        autoUpdater.on('download-progress', (progressObj:any) => {
            if (!progressBar.isCompleted()) {
                progressBar.detail = "\n" + " تم تحميل ...  " + "\n" + parseInt(progressObj.percent) + "%";
            }
        })
        autoUpdater.on('update-downloaded', (info:any) => {
            if (!progressBar.isCompleted()) {
                progressBar.detail = " تم تحميل التحديثات .....";
                progressBar.detail += "\n" + "قم باعادة تشغيل التطبيق لتحديثه";
                progressBar.setCompleted();
                this.app.quit();
            }
        })
    }


}

