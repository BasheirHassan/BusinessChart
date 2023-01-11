import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router';


const router = createRouter({

    history: createWebHashHistory(),
    routes: [
        {
            path: '/home',
            name: 'Home',
            meta: {title: 'رئيسية'},
            component: () => import('@/components/HomeComponents.vue')
        },
        {
            path: '/login',
            name: 'Login',
            meta: {title: 'تسجيل دخول'},
            component: () => import('@/components/LoginComponents.vue')
        },

        /**
         * مبيعات
         */
        {
            path: '/sales/monthly',
            name: 'salesMonthly',
            meta: {title: 'مبيعات شهرية'},
            component: () => import('@/components/sales/Monthly.vue')
        },
        {
            path: '/sales/weekly',
            name: 'salesWeekly',
            meta: {title: 'مبيعات اسبوعية'},
            component: () => import('@/components/sales/Weekly.vue')
        },
        {
            path: '/sales/dayly',
            name: 'salesDayly',
            meta: {title: 'مبيعات يومية'},
            component: () => import('@/components/sales/Dayly.vue')
        },
        {
            path: '/sales/hourly',
            name: 'salesHourly',
            meta: {title: 'مبيعات بالساعة'},
            component: () => import('@/components/sales/Hourly.vue')
        },
        {
            path: '/purchase/daylyallmonthly',
            name: 'PurchaseDaylyAllMonthly',
            meta: {title: 'مشتريات يومية - كل الاشهر'},
            component: () => import('@/components/purchase/DaylyAllMonthly.vue')
        },
        {
            path: '/sales/daylyallmonthly',
            name: 'SalesDaylyAllMonthly',
            meta: {title: 'مبيعات يومية - كل الاشهر'},
            component: () => import('@/components/sales/DaylyAllMonthly.vue')
        },

        {
            path: '/sales/yearsly',
            name: 'salesYeasly',
            meta: {title: 'مبيعات  - كل السنوات'},
            component: () => import('@/components/sales/Yearsly.vue')
        },



        /**
         * مقارنة مبيعات
         * /salesCompare
         */
        {
            meta: {title: 'مقارنة مبيعات - اسبوعية',
            helpUrl:'https://www.youtube.com/?gl=SA&hl=ar'
            },
            name:'salesCompareWeekly',
            path: ('/salesCompare/weekly'),
            component: () => import('@/components/salesCompare/Weekly.vue')
        },
        {
            meta: {
                title: 'مقارنة مبيعات - نفس اليوم من كل اسبوع',
                helpUrl:''
            },
            name:'salesCompareSameDateInWeek',
            path: ('/salesCompare/sameDateInWeek'),
            component: () => import('@/components/salesCompare/sameDateInWeek.vue')
        },
        {
            meta: {title: 'مقارنة مبيعات - نفس اليوم من كل شهر'},
            name:'salesCompareSameDayInMonths',
            path: ('/salesCompare/sameDayInMonths'),
            component: () => import('@/components/salesCompare/SameDayInMonths.vue')

        },
        {
            meta: {title: 'مقارنة مبيعات - موسمية'},
            name:'salesCompareSeasons',
            path: ('/salesCompare/seasons'),
            component: () => import('@/components/salesCompare/Seasons.vue')
        },
        {
            meta: {title: 'مقارنة مبيعات - حسب مبلغ الفاتورة'},
            name:'salesMoneyTop',
            path: ('/salesMoney/Top'),
            component: () => import('@/components/salesMoney/Top.vue')
        },
        {
            meta: {title: 'مقارنة مشتريات - حسب مبلغ الفاتورة'},
            name:'purchaseMoneyTop',
            path: ('/purchaseMoney/Top'),
            component: () => import('@/components/purchaseMoney/Top.vue')
        },
        /**
         * مقارنة مشتريات
         */
        {
            meta: {title: 'مقارنة مشتريات - اسبوعية'},
            name:'purchaseCompareWeekly',
            path: ('/purchaseCompare/weekly'),
            component: () => import('@/components/purchaseCompare/weekly.vue')
        },
        {
            meta: {title: 'مقارنة مشتريات - نفس اليوم من كل اسبوع'},
            name:'purchaseCompareSameDateInWeek',
            path: ('/purchaseCompare/sameDateInWeek'),
            component: () => import('@/components/purchaseCompare/sameDateInWeek.vue')
        },
        {
            meta: {title: 'مقارنة مشتريات - نفس اليوم من كل شهر'},
            name:'purchaseCompareSameDayInMonths',
            path: ('/purchaseCompare/sameDayInMonths'),
            component: () => import('@/components/purchaseCompare/sameDayInMonths.vue')

        },
        {
            meta: {title: 'مقارنة مشتريات - موسمية'},
            name:'purchaseCompareSeasons',
            path: ('/purchaseCompare/seasons'),
            component: () => import('@/components/purchaseCompare/Seasons.vue')
        },


        /**
         * مبيعات منتجات
         */
        {
            meta: {title: 'مبيعات - منتجات -   شهرية'},
            name:'salesItemsMonthly',
            path: ('/salesItems/monthly'),
            component: () => import('@/components/salesItems/Monthly.vue')
        },
        {
            meta: {title: 'مبيعات - منتجات -   اسبوعية'},
            name:'salesItemsWeekly',
            path: ('/salesItems/weekly'),
            component: () => import('@/components/salesItems/Weekly.vue')
        },
        {
            meta: {title: 'مبيعات - منتجات -  يومية'},
            name:'salesItemsDayly',
            path: ('/salesItems/dayly'),
            component: () => import('@/components/salesItems/Dayly.vue')
        },

        {
            meta: {title: 'مبيعات - منتجات -  بالساعة'},
            name:'salesItemsHourly',
            path: ('/salesItems/hourly'),
            component: () => import('@/components/salesItems/Hourly.vue')
        },
        {
            meta: {title: 'منتج اكثر مبيعا اعلى حسب كل يوم من الاسبوع'},
            name:'salesItemsTopByDayInWeeks',
            path: ('/salesItems/topByDayInWeeks'),
            component: () => import('@/components/salesItems/TopByDayInWeek.vue')
        }
        ,
        {
            meta: {title: 'منتج اكثر مبيعا اعلى حسب كل شهر'},
            name:'salesItemstopByMonth',
            path: ('/salesItems/topByMonth'),
            component: () => import('@/components/salesItems/TopByMonth.vue')
        }
        ,
        {
            meta: {title: 'منتج اكثر مبيعا - كل المنتجات'},
            name:'salesItemsMax',
            path: ('/salesItems/max'),
            component: () => import('@/components/salesItems/Max.vue')

        } ,


        /**
         * مبيعات العملاء
         */
        {
            meta: {title: 'مبيعات - منتجات -   شهرية'},
            name:'salescCustomersMonthly',
            path: ('/salescCustomers/monthly'),
            component: () => import('@/components/salesCustomers/Monthly.vue')
        },
        {
            meta: {title: 'مبيعات - منتجات -   اسبوعية'},
            name:'salescCustomersWeekly',
            path: ('/salescCustomers/weekly'),
            component: () => import('@/components/salesCustomers/Weekly.vue')
        },
        {
            meta: {title: 'مبيعات - منتجات -  يومية'},
            name:'salescCustomersDayly',
            path: ('/salescCustomers/dayly'),
            component: () => import('@/components/salesCustomers/Dayly.vue')
        },

        {
            meta: {title: 'مبيعات - منتجات -  بالساعة'},
            name:'salescCustomersHourly',
            path: ('/salescCustomers/hourly'),
            component: () => import('@/components/salesCustomers/Hourly.vue')
        },
        {
            meta: {title: 'مبيعات عملاء- ترتيب الاكثر مبيعا'},
            name:'salescCustomersMax',
            path: ('/salescCustomers/max'),
            component: () => import('@/components/salesCustomers/Max.vue')
        },




        /**
         * تسجيل البرنامج
         * registerApp.vue
         */

        {
            meta: {title: 'تسجيل البرنامج'},
            name:'registerApp',
            path: ('/registerApp'),
            component: () => import('@/components/registerApp.vue')

        },

        {
            meta: {title: 'معلومات تحديث'},
            name:'infoUpdate',
            path: ('/infoUpdate'),
            component: () => import('@/components/InfoUpdateComponents.vue')

        }

    ]

})


router.beforeEach((to) => {
    document.title = "Business Chart - " + to.meta.title || '';
    console.table(to);

});


export default router;