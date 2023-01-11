import {app, BrowserWindow, ipcMain, dialog, Menu} from 'electron'
import {release} from 'os';
import path, {join} from 'path';
import UpdaterClass from "./UpdaterClass";
const parentPathExe = path.dirname (app.getPath ('exe'));


const logger = require('electron-log');
logger.transports.file.resolvePath = () => (parentPathExe+'/logs/main.log');

const Store = require('electron-store');
const store = new Store();





// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()
// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())


if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

const splash = join(__dirname, '../preload/splash.js')

export const ROOT_PATH = {
    // /dist
    dist: join(__dirname, '../..'),
    // /dist or /public
    public: join(__dirname, app.isPackaged ? '../..' : '../../../public'),
}

let win: BrowserWindow | null = null
const preload = join(__dirname, '../preload/splash.js')
const url = `http://${process.env['VITE_DEV_SERVER_HOSTNAME']}:${process.env['VITE_DEV_SERVER_PORT']}`
const indexHtml = join(ROOT_PATH.dist, 'index.html')



async function createWindow(hashUrl: string, config: object = {}) {

    const conf = {
        width: 800,
        height: 600,
        idHashUrl:hashUrl,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            preload:preload,
            webSecurity: false,
            icon: __dirname + '/public/icons/iconApp.ico'
        }
    }

    Object.assign(conf, config);
    win = new BrowserWindow(conf);
    if (app.isPackaged) {
        await win.loadFile(indexHtml, { hash: hashUrl })
    } else {
        await win.loadURL(`${url}/#${hashUrl}`)
    }

    if (config.hasOwnProperty('maximize')){
        win.maximize();
    }


    /**
     * عند اغلاق الرئيسية يتم اغلاق كل الصفحات
     */
    if (hashUrl ==="/home"){

        win.on('closed', function(){
            console.log("closed Home Window");
            win = null;
            app.quit();
        });
    }



    if (!app.isPackaged) {
        win.webContents.openDevTools();



        console.log(hashUrl);
        win.maximize();
    }

}


app.whenReady().then(() => {
    console.log('Window Ready')

    createWindow('/login', {
        resizable: false,
        width: 800,
        height: 500,
    }).then(r => {
        console.log(r)
    });


    if (!app.isPackaged) {
        const {default: installExtension, VUEJS3_DEVTOOLS} = require('electron-devtools-installer');
        installExtension(VUEJS3_DEVTOOLS)
            .then((name: any) => console.log(`Added Extension:  ${name}`))
            .catch((err: any) => console.log('An error occurred: ', err));

    }
});


app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()
})




app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow("#", {}).then(r => {
            console.log(r)
        });
    }
})


ipcMain.on("openIndexWindow", (event, message) => { //"close-app" can be anything but, you need to use the same key in the send message side (later in this answer)
    console.log(message)
    createWindow(message, {
        width: 800,
        height: 600,
        autoHideMenuBar: false,
        resizable: true,
        maximize:true
    }).then(r => {
        console.log(r)
    });
});







const template: Electron.MenuItemConstructorOptions[]  = [
    {
        label: 'مبيعات - مشتريات',
        submenu: [
            {
                label: 'مبيعات مشتريات - شهرية',
                click() {
                    createWindow('sales/monthly', {maximize:true})
                }
            },
            {
                label: 'مبيعات مشتريات  -  اسبوعية',
                click() {
                    createWindow('sales/weekly', {})
                }

            },
            {
                label: 'مبيعات مشتريات - يومية',
                click() {
                    createWindow('sales/dayly', {})
                }
            },
            {
                label: 'مبيعات مشتريات - ساعة',
                click() {
                    createWindow('sales/hourly', {})
                }
            },
            {
                label: 'مبيعات يومية - كل الاشهر',
                click() {
                    createWindow('sales/daylyallmonthly',{maximize:true})

                }
            },
            {
                label: 'مشتريات يومية - كل الاشهر',
                click() {
                    createWindow('purchase/daylyAllMonthly',{maximize:true})

                }
            },
            {
                label: 'مبيعات  - كل السنوات',
                click() {
                    createWindow('sales/yearsly', {maximize:true})
                }
            },

        ]
    },
    {
        label: 'مقارنة المبيعات',
        submenu: [
            {
                label: 'اسبوعية',
                click() {
                    createWindow('salesCompare/weekly',{maximize:true})
                }
            },
            {
                label: 'نفس اليوم من كل اسبوع',
                click() {
                    createWindow('salesCompare/sameDateInWeek',{maximize:true})
                }
            },
            {
                label: 'نفس اليوم من كل شهر',
                click() {
                    createWindow('salesCompare/sameDayInMonths',{maximize:true})
                }
            },
            {
                label: 'موسمية',
                click() {
                    createWindow('salesCompare/seasons')
                }
            },
            {
                label: 'مبلغ الفاتورة',
                click() {
                    createWindow('salesMoney/Top')
                }
            },

        ]
    },

    /**
     * مقارنة مشتريات'
     */
    {
        label: 'مقارنة مشتريات',
        submenu: [
            {
                label: 'اسبوعية',
                click() {
                    createWindow('purchaseCompare/weekly',{maximize:true})
                }
            },
            {
                label: 'نفس اليوم من كل اسبوع',
                click() {
                    createWindow('purchaseCompare/sameDateInWeek',{maximize:true})
                }
            },
            {
                label: 'نفس اليوم من كل شهر',
                click() {
                    createWindow('purchaseCompare/sameDayInMonths',{maximize:true})
                }
            },
            {
                label: 'موسمية',
                click() {
                    createWindow('purchaseCompare/seasons',{maximize:true})
                }
            },
            {
                label: 'مبلغ الفاتورة',
                click() {
                    createWindow('purchaseMoney/Top')
                }
            },

        ]
    },
    /**
     * مبيع منتجات
     */

    {
        label: 'مبيعات - عملاء',
        submenu: [
            {
                label: '  شهرية',
                click() {
                    createWindow('salescCustomers/monthly')
                }
            },
            {
                label: '  اسبوعية',
                click() {
                    createWindow('salescCustomers/weekly')
                }
            },
            {
                label: ' يومية',
                click() {
                    createWindow('salescCustomers/dayly')
                }
            },

            {
                label: ' بالساعة',
                click() {
                    createWindow('salescCustomers/hourly')
                }
            },
            {
                label: ' اكثر مبيعا',
                click() {
                    createWindow('salescCustomers/max')
                }
            },
        ]
    },
    {
        label: 'مبيعات - منتجات',
        submenu: [
            {
                label: '  شهرية',
                click() {
                    createWindow('salesItems/monthly')
                }
            },
            {
                label: '  اسبوعية',
                click() {
                    createWindow('salesItems/weekly')
                }
            },
            {
                label: ' يومية',
                click() {
                    createWindow('salesItems/dayly')
                }
            },

            {
                label: ' بالساعة',
                click() {
                    createWindow('salesItems/hourly')
                }
            },
            {
                label: 'اكثر مبيعا حسب ....',
                submenu: [

                    {
                        label: 'منتج اكثر مبيع اعلى حسب كل يوم من الاسبوع',
                        click() {
                            createWindow('salesItems/topByDayInWeeks',{maximize:true})
                        }
                    }, {
                        label: 'منتج اكثر مبيع اعلى حسب كل شهر',
                        click() {
                            createWindow('salesItems/topByMonth',{maximize:true})
                        }
                    },
                    {
                        label: 'منتج اكثر مبيع - كل المنتجات',
                        click() {
                            createWindow('salesItems/max',{maximize:true})
                        }
                    },
                ],
            },

        ]
    },
    {
        label: 'تعليمات',
        submenu: [
            {
                label: 'تغيير السنة المالية',
                click() {
                    app.relaunch();
                    app.quit();

                }
            },


            {
                label: 'تسجيل البرنامج',
                click() {
                    createWindow('/registerApp',{
                        width: 600,
                        height: 300,
                        resizable: false,
                    })



                }
            },
            {
                label: 'بحث عن تحديثات',
                click() {
                    let updaterClass = new UpdaterClass(win,app);
                    updaterClass.checkUpdaterApp();

                }
            },
            {
                label: 'تحديثات النسخة الحالية',
                click() {
                    createWindow('/infoUpdate',{
                        width: 500,
                        height: 700,
                        resizable: true,
                    })

                }
            },
          {
                label: 'حول',
                click() {

                    const options = {
                        defaultId: 1,
                        title: 'Business Chart',
                        message: 'اصدار التطبيق',
                        detail: app.getVersion(),
                    };

                    // @ts-ignore
                    dialog.showMessageBox(null, options);
                }
            },

        ]
    },



]


if (!app.isPackaged) {

    template.push({
        label: 'مطور', submenu: [
            {
                role: 'reload'
            }, {
                role: 'toggleDevTools'
            }
       ]
    });

}





const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)






ipcMain.handle("saveStoreValue", (event, dataJson) => { //"close-app" can be anything but, you need to use the same key in the send message side (later in this answer)
    //console.log(dataJson,'saveStoreValue')

    //console.log(dataJson,'saveStoreValue')
    let k = dataJson.key;
    let v = dataJson.value;

    store.set(dataJson);
    return true;
});


ipcMain.handle('getStoreValue', async (event, dataJson) => {
    // console.log(app.getPath('userData'), 'app.getPath(\'userData\')')
    // console.log('getStoreValue',dataJson)
        return  store.get(dataJson);
});



ipcMain.handle('saveErrorLog', async (event, errorValue) => {
    logger.error(errorValue);
});


ipcMain.handle('relaunchApp', async (event, errorValue) => {
    app.relaunch();
    app.quit();

});




ipcMain.handle('openInfoUpdateWindow', async (event, errorValue) => {

    let locationInfoUpdate = parentPathExe + '/infoUpdate.json';
    const store = require('data-store')({ path: locationInfoUpdate });
    if (!store.hasOwn('isShowInfoUpdate')){
        await createWindow('/infoUpdate', {
          width: 500,
          height: 700,
          resizable: false,
        })
        store.set('isShowInfoUpdate', true);
    }

    console.log(store,'store');

});



