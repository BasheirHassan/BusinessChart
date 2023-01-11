<template>

  <main>
    <div class="container-fluid ">


      <div class='row mt-2'>
        <div class="col-md-6 col-lg-3">
          <CardBlockComponents card-title='اجمالي منتجات' :data-body='counters.item' background-color='#03A9F4'/>
        </div>
        <div class="col-md-6 col-lg-3">
          <CardBlockComponents card-title='اجمالي عملاء'  :data-body='counters.customer' background-color='#AB47BC' />
        </div>
        <div class="col-md-6 col-lg-3">
          <CardBlockComponents card-title='اجمالي موردين'  :data-body='counters.supplier' background-color='#FA9F1B' />
        </div>
        <div class="col-md-6 col-lg-3">
          <CardBlockComponents card-title='اجمالي فواتير مبيعات'  :data-body='counters.invoiceSale' background-color='#90C747' />
        </div>
      </div>



      <div class="row  row-cols-1 row-cols-sm-2  row-cols-md-3 row-cols-lg-4 row-cols-xl-4 g-2 ">


        <div class="col" style="height: 350px;">
          <CardChartComponents :is-visable-loading="true"
                               :show-labels-xaxis="false"
                               :show-labels-yaxis="false"
                               :show-labels="false"
                               :show-data-labels="false"
                               :show-legend="false"
                               card-title="مبيعات شهرية"
                               type-chart-bar="pie"
                               chart-id="idAppsMonth"
                               :chart-data-json="dataAppsMonth"
                               :is-visable-icons="false"
          />
        </div>
        <div class="col">
          <CardChartComponents 
                                :is-visable-loading="true" 
                                :show-labels-xaxis="false" 
                                :show-labels-yaxis="false"
                               :show-labels="false" 
                               :show-data-labels="false" 
                               :show-legend="false"
                               card-title="مبيعات اسبوعية"
                                type-chart-bar="line"
                               chart-id="idAppsWeek" 
                               :chart-data-json="dataAppsWeek"
                               :is-visable-icons="false"/>
        </div>
        <div class="col">
          <CollapseComponents
            :limit-show='5'
            append-title=' شهر -'
            card-title='اجمالي متوسط مبيع يومي - لكل شهر'
            tooltip-tilte='اجمالي عدد فواتير'
            :data-json='dataSalesAvgMonthly' />
        </div>
        <div class="col">
          <CardChartComponents :is-visable-loading="true"
                               :show-labels-xaxis="false"
                               :show-labels-yaxis="false"
                               :show-labels="false"
                               :show-data-labels="false"
                               :show-legend="false"
                               :card-title=" 'اجمالي مبيعات مشتريات '"
                               type-chart-bar="pie"
                               chart-id="idSalesAndPurchases"
                               :chart-data-json="dataSalesAndPurchases" :is-visable-icons="false"/>
        </div>
        <div class="col">
          <CardChartComponents :is-visable-loading="true"
                               :show-labels-xaxis="false"
                               :show-labels-yaxis="false"
                               :show-labels="false"
                               :show-data-labels="false"
                               :show-legend="false"
                               :card-title="'اجمالي مبيعات مشتريات شهر - '+ thisMonth"
                               chart-id="idSalesAndPurchasesThisMonth"
                               type-chart-bar="pie"
                               :chart-data-json="dataSalesAndPurchasesThisMonth" :is-visable-icons="false"/>
        </div>

        <div class="col">
          <CollapseComponents :limit-show="8"
                              card-title=" منتجات اعلى مبيع - حسب الكمية"
                              tooltip-tilte="مبلغ"
                              :data-json="dataListItemMax"/>
        </div>
        <div class="col">

          <CardChartComponents :is-visable-loading="true"
                               :show-labels-xaxis="false"
                               :show-labels-yaxis="false"
                               :show-labels="false"
                               :show-data-labels="false"
                               :show-legend="false"
                               card-title=" اجمالي مبيعات مشتريات اليوم"
                               chart-id="idDataListSalesItemToday"
                               type-chart-bar="column"
                               :chart-data-json="dataListSalesItemToday" :is-visable-icons="false"/>

        </div>

        <div class="col">
          <CollapseComponents
              :limit-show="8"
              card-title="معلومات"
              tooltip-tilte="كمية"
              :data-json="dataInfoSales"/>
        </div>



        <div class="col">
            <CollapseComponents
                :limit-show="8"
                card-title="منتجات خاملة"
                tooltip-tilte="مبلغ"
                :data-json="dataItemWithoutSales"/>
          </div>

          <div class="col">
            <CollapseComponents
                :limit-show="8"
                :is-total="true"
                card-title="اجمالي مبيعات عملاء"
                tooltip-tilte="عدد فواتير "
                :data-json="dataMaxSalesCustomers"/>
          </div>

          <div class="col">
            <CollapseComponents
                :limit-show="8"
                :is-total="true"
                :card-title=" ' مبيعات عملاء  يوم - '+ this.$moment().format('DD')"
                tooltip-tilte="عدد فواتير"
                :data-json="dataMaxSalesCustomersToday"/>
          </div>


        <div class="col">
          <CollapseComponents
              :limit-show="8"
              append-title=" شهر -"
               card-title="متوسط مبيع فاتورة شهريا"
              tooltip-tilte="اجمالي عدد فواتير"
              :data-json="dataAvgInvoicesByMonthID"/>
        </div>



      </div>

<!--      <div class="row">-->
<!--        <div class="col-12">-->

<!--          <div class="col-12">-->
<!--            <CollapseComponents-->
<!--              :limit-show="8"-->
<!--              append-title=""-->
<!--              card-title="حركة - مالية"-->
<!--              tooltip-tilte="اجمالي عدد فواتير"-->
<!--              :data-json="dataAccountBalance"/>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->



      <div class="container-fluid">
        <div class="row">

          <div class="col-6">
            <div class="h-100">

              <CardChartComponents :is-visable-loading='true'
                                   :show-labels-xaxis='false'
                                   :show-labels-yaxis='false'
                                   :show-labels='false'
                                   :show-data-labels='false'
                                   :display-heat-map-rows='3'
                                   :show-legend='false'
                                   :card-title="'مبيعات يومية شهر - '+ thisMonth"
                                   type-chart-bar='heatMap'
                                   chart-id='idSaleDaylyThisMonth'
                                   :chart-data-json='dataSaleDaylyThisMonth'
                                   :is-visable-icons='false' />


            </div>
          </div>


          <div class="col-6">
            <div class="h-100">
              <div class='col-12'>
              <CardBlockComponents card-title='عدد السنوات المالية' :data-body='counters.years'  background-color='#FA9F1B' />
            </div>
              <div class='col-12'>
              <CardBlockComponents card-title='عدد الاشهر المالية' :data-body='counters.months'     background-color='#03A9F4' />
              </div>

            <div class='col-12'>
              <CardBlockComponents card-title='عدد الاسابيع المالية' :data-body='counters.weeks' background-color='#AB47BC' />
            </div>

            <div class='col-12'>
              <CardBlockComponents card-title='عدد الايام المالية' :data-body='counters.days'  background-color='#FA9F1B' />
            </div>

            <div class='col-12'>
              <CardBlockComponents card-title='اجمالي فواتير مشتريات' :data-body='counters.invoicePur'   background-color='#90C747' />
            </div>

          </div>
          </div>

        </div>

      </div>




    </div>


  </main>


  <footer class="footer navbar-fixed-bottom mt-auto py-3 bg-light">
    <div class="container">

      <el-divider direction="vertical" border-style="dashed"/>
      <el-tag class="ml-2" size="large" effect="light" type="info">السنة المالية ::{{ dbTitle }}</el-tag>
      <el-divider direction="vertical" border-style="dashed"/>

      <el-tag v-if="isRegisterApp" class="ml-2" size="large" effect="light" type="success">نسخة مرخصة</el-tag>
      <el-tag v-else class="ml-2" size="large" effect="light" type="danger">نسخة غير مرخصة</el-tag>



    </div>
  </footer>


</template>

<script>
import CardChartComponents from '@/components/CardChartComponents.vue';
import CollapseComponents from '@/components/CollapseComponents.vue';
import CardBlockComponents from '@/components/CardBlockComponents.vue';

import StoreConfig from '@/assets/tsModels/StoreConfig';
import DataJsonChartModel from '@/assets/tsModels/DataJsonChartModel';
import {StaticsEnum} from '@/assets/tsModels/StaticsAll';
import RegisterApp from '@/assets/tsModels/RegisterApp';
import moment from 'moment/moment';
import {collect} from 'collect.js';
import * as electron from 'electron';



export default {
  name      : 'HomeComponents',
  components: {
    CardBlockComponents,
    CollapseComponents,
    CardChartComponents,
  },
  data() {
    return {
      thisMonth                     : moment().format('MM'),
      isRegisterApp                 : false,
      dataAppsMonth                 : [],
      dataAppsWeek                  : [],
      dataSaleDaylyThisMonth        : [],
      dataSalesAndPurchases         : [],
      dataSalesAndPurchasesThisMonth: null,
      dataListItemMax               : [],
      dataListSalesItemToday        : [],
      dataInfoSales                 : [],
      dataItemWithoutSales          : [],
      dataMaxSalesCustomers         : [],
      dataMaxSalesCustomersToday         : [],
      dataAvgInvoicesByMonthID        : [],
      dataAccountBalance            : [],
      dataSalesAvgMonthly            : [],
      percentage                    : 50,
      dbTitle                       : null,
      counters:{
        item:0,
        custemour:0,
        supplier:0,
        invoiceSale:0,
        months:0,
        weeks:0,
        days:0,
        years:0,
        invoicePur:0,

      }

    };
  },
  async mounted() {
    await this.getAppsMonth();
    await this.getAppsWeek();
    await this.getSaleDaylyThisMonth();
    await this.getSalesAndPurchases();
    await this.getSalesAndPurchasesThisMonth();
    await this.getListItemMax();
    await this.getListSalesToday();
    await this.getInfoSales();
    await this.getItemWithoutSales();
    await this.getMaxSalesCustomers();
    await this.getMaxSalesCustomersToday();
    await this.getDataAvgInvoicesByMonthID();
    await this.infoUpdate();
    //this.getDataAccountBalance();
    this.getDataSalesAvgMonthly();
    this.getCountItems();
    this.getCountCustemers();
    this.getCountSupplier();
    this.getCountInvoice();
    this.getCountInvoiceByDays();
    this.getCountYears();

    RegisterApp.checkisRegister().then(v => {
      this.isRegisterApp = v;
    });

    this.dbTitle = await StoreConfig.getServerHostDbTitleSelect();

  },
  methods: {
    /**
     * جلب مبيعات شهرية
     */
    getAppsMonth() {
      let self = this;
      this.$mysqlAsyncClass.getSalesMonthly(StaticsEnum.sales).then(rows => {
        self.counters.months = rows.length;
        self.dataAppsMonth = [new DataJsonChartModel(rows, 'مبيعات شهرية')];
      }).catch(err => {
        console.log(err);
      });
    },

    /**
     * مبيعات مشتريات الاسبوعية
     */
    getAppsWeek() {
      let self = this;
      this.$mysqlAsyncClass.getSalesWeekly(StaticsEnum.sales).then(rows => {
        self.counters.weeks = rows.length;

        self.dataAppsWeek = [new DataJsonChartModel(rows, 'مبيعات اسبوعية')];
      }).catch(err => {
        console.log(err);
      });
    },

    /**
     * مبيعات يومية لهذا الشهر
     */
    getSaleDaylyThisMonth() {
      let self = this;
      this.$mysqlAsyncClass.getSalesDaylyThisMonth(StaticsEnum.sales).then(function(rows) {
        // console.log(rows, '  dataSaleDaylyThisMonth');

        self.dataSaleDaylyThisMonth = rows;

      }).catch(err => {
        console.log(err);
      });
    },

    /**
     * مبيعات و مشتريات
     */
    getSalesAndPurchases() {
      let self = this;
      this.$mysqlAsyncClass.getSalesAndPurchasesAll().then(function(rows) {
        self.dataSalesAndPurchases = [new DataJsonChartModel(rows, 'مبيعات مشتريات كاملة')];
      }).catch(err => {
        console.log(err);
      });
    },
    /**
     * مبيعات مشتريات شهر الحالي
     */
    getSalesAndPurchasesThisMonth() {
      let self = this;

      this.$mysqlAsyncClass.getSalesAndPurchasesThisMonth().then(rows => {
        self.dataSalesAndPurchasesThisMonth = [new DataJsonChartModel(rows, 'مبيعات مشتريات شهر - ')];
        //console.log(rows, 'getSalesAndPurchasesThisMonth');
      }).catch(err => {
        console.log(err);
      });
    },

    /**
     * مبيعات اعلى منتج
     */
    getListItemMax() {
      let self = this;
      this.$mysqlAsyncClass.getSalesItemsMax(StaticsEnum.sales, 20).then(function(rows) {
//                console.log(rows, 'getListItemMax');
        self.dataListItemMax = rows;
      }).catch(err => {
        console.log(err);
      });
    },

    /**
     *
     */
    getListSalesToday() {
      let self = this;
      this.$mysqlAsyncClass.getSalesAndPurchasesThisDay().then(function(rows) {

        self.dataListSalesItemToday = [new DataJsonChartModel(rows, 'مبيعات مشتريات  اليوم ')];
      }).catch(err => {
        console.log(err);
      });
    },

    /**
     *
     *
     */
    getInfoSales() {
      let self = this;
      let promises = [];
      let dataAll = [];

      promises[0] = new Promise(async (resolve, reject) => {
        this.$mysqlAsyncClass.getSalesMonthly(StaticsEnum.sales).then(function(rows) {

          if (!rows.length) {
            reject(false);
            return;
          }

          let dataRows = new DataJsonChartModel(rows);
          dataRows.sortedData();
          let dataMax = moment(dataRows.getMaxItem().x).format('MM');
          dataAll.push({
            'x'      : 'اعلى مبيع شهر - ' + dataMax,
            'value'  : dataRows.getMaxItem().value,
            'tooltip': dataMax,
          });
          resolve(true);

        }).catch(function(error) {
          console.error(error);
        });
      });
      promises[1] = new Promise(async (resolve, reject) => {
        this.$mysqlAsyncClass.getSalesDayly(StaticsEnum.sales).then(function(rows) {

          // console.log(rows, 'rrrrrrrrr');
          if (!rows.length) {
            reject(false);
            return;
          }
          let dataRows = new DataJsonChartModel(rows, '');
          dataRows.sortedData();
          let dataMax = moment(dataRows.getMaxItem().x).format('yy-MM-DD');

          dataAll.push(
              {
                'x'      : 'اعلى مبيع يوم - ' + dataMax,
                'value'  : dataRows.getMaxItem().value,
                'tooltip': dataMax,
              },
              {
                'x'      : 'متوسط مبيع   يومي ',
                'value'  : dataRows.getAvgItem(),
                'tooltip': '',
              },
              {
                'x'      : ' اقل  مبيع   يوم - ' + dataMax,
                'value'  : dataRows.getMinItem().value,
                'tooltip': dataRows.getMinItem().x,
                'css': 'bg-danger',
              },
          );
          resolve(true);

        }).catch(function(error) {
          console.error(error);
        });

      });
      promises[2] = new Promise(async (resolve, reject) => {
        this.$mysqlAsyncClass.getSalesDayly(StaticsEnum.purchases).then(function(rows) {
          if (!rows.length) {
            reject(false);
            return;
          }
          let dataRows = new DataJsonChartModel(rows, '');
          dataRows.sortedData();
          let dataMax = moment(dataRows.getMaxItem().x).format('yy-MM-DD');
          dataAll.push(
              {
                'x'      : 'اعلى شراء يوم - ' + dataMax,
                'value'  : dataRows.getMaxItem().value,
                'tooltip': dataMax,
              }, {
                'x'      : 'متوسط شراء   يومي ',
                'value'  : dataRows.getAvgItem(),
                'tooltip': '',
              }, {
                'x'      : ' اقل  شراء   يوم - ' + dataMax,
                'days'   : dataRows.getMinItem().x,
                'value'  : dataRows.getMinItem().value,
                'tooltip': dataRows.getMinItem().x,
                'css': 'bg-warning text-dark',
              });

          resolve(true);
        }).catch(function(error) {
          console.error(error);
        });

      });

      promises[3] = new Promise(async (resolve, reject) => {
        this.$mysqlAsyncClass.getAvgInvoices(StaticsEnum.sales).then(function(rows) {
          if (!rows.length) {
            reject(false);
            return;
          }
          let dataRows = collect(rows).first();
          let dataMax = moment(dataRows.x).format('yy-MM-DD');
          dataAll.push(
              {
                'x'      : 'متوسط مبيع فاتورة',
                'value'  : dataRows.value,
                'tooltip': dataRows.tooltip,
                'css':'bg-success',
              });

          resolve(true);
        }).catch(function(error) {
          console.error(error);
        });

      });

 promises[4] = new Promise(async (resolve, reject) => {
        this.$mysqlAsyncClass.getAvgInvoices(StaticsEnum.purchases).then(function(rows) {
          if (!rows.length) {
            reject(false);
            return;
          }
          let dataRows = collect(rows).first();
          let dataMax = moment(dataRows.x).format('yy-MM-DD');
          dataAll.push(
              {
                'x'      : 'متوسط شراء -  فاتورة',
                'value'  : dataRows.value,
                'tooltip': dataRows.tooltip,
              });

          resolve(true);
        }).catch(function(error) {
          console.error(error);
        });

      });




      Promise.all(promises).then((results) => {
        // console.log(dataAll, 'results');

        self.dataInfoSales = dataAll;
      }).catch(error => {
        self.dataInfoSales = [];
        console.error(error);
      });


    },
      getItemWithoutSales(){
        let self = this;
        this.$mysqlAsyncClass.getItemWithoutSales(20).then(function(rows) {

         // console.log(rows,'getItemWithoutSales');
          self.dataItemWithoutSales =rows;
        }).catch(err => {
          self.dataItemWithoutSales = [];

          console.log(err);
        });
      },

    getMaxSalesCustomers(){
        let self = this;
        this.$mysqlAsyncClass.getMaxSalesCustomers(StaticsEnum.sales,20).then(function(rows) {

         // console.log(rows,'getMaxSalesCustomers');
          self.dataMaxSalesCustomers =rows;
        }).catch(err => {
          self.dataMaxSalesCustomers = [];

          console.log(err);
        });
      },

     getMaxSalesCustomersToday(){
            let self = this;
            this.$mysqlAsyncClass.getMaxSalesCustomersToday(StaticsEnum.sales,20).then(function(rows) {

              //console.log(rows,'getMaxSalesCustomers');
              self.dataMaxSalesCustomersToday =rows;
            }).catch(err => {
              self.dataMaxSalesCustomersToday = [];

              console.log(err);
            });
          },

        getDataAvgInvoicesByMonthID(){
            let self = this;
            this.$mysqlAsyncClass.getAvgInvoicesAll(StaticsEnum.sales).then(function(rows) {
              // console.log(collect(rows).sortByDesc('years'),'getAvgInvoicesAll');
              self.dataAvgInvoicesByMonthID =rows;
            }).catch(err => {
              self.dataAvgInvoicesByMonthID = [];
              console.log(err);
            });
          },

       getDataAccountBalance(){
                  let self = this;
                  this.$mysqlAsyncClass.getAccountBalance().then(function(rows) {
                   // console.log(rows,'getAccountBalance');
                    self.dataAccountBalance =rows;
                    //console.log(collect(rows).sum("value"),'SSSS');
                  }).catch(err => {
                    self.dataAccountBalance = [];
                    console.log(err);
                  });
        },

      getDataSalesAvgMonthly(){
                  let self = this;
                  this.$mysqlAsyncClass.getSalesDayly(StaticsEnum.sales).then(function(rows) {

                    let itemAvg=[];
                  let mapAvg = collect(rows).groupBy(item => moment(item.x).format("M")).each(item=> {
                    let coll = collect(item);
                    itemAvg.push({x:moment(coll.first().x).format('M-YYYY'),value:coll.avg('value'),tooltip:0})
                  });

                    self.dataSalesAvgMonthly =itemAvg;

                  }).catch(err => {
                    self.dataSalesAvgMonthly = [];
                    console.log(err);
                  });
        },


    /**
     * عرض اخر تغييرات التطبيق
     */
    infoUpdate(){
      window.setTimeout(()=>{
        electron.ipcRenderer.invoke('openInfoUpdateWindow');
      },5000)
    },

    async getCountItems() {
      // console.log(this.$mysqlAsyncClass.getCustomers(),'this.$mysqlAsyncClass.getCustomers()');
        await this.$mysqlAsyncClass.getCountItems().then(rows=>{
          console.log(rows,'getCountItems');
        this.counters.item = rows.count;
      });

    },
    async getCountCustemers() {
    await this.$mysqlAsyncClass.getCustomers(['0']).then(rows=>{
        this.counters.customer = rows.length;
      });

    },
    async getCountSupplier() {
      await this.$mysqlAsyncClass.getCustomers(['1']).then(rows => {
        this.counters.supplier = rows.length;
      });

    },
    async getCountInvoice() {
      await this.$mysqlAsyncClass.getCountInvoice(StaticsEnum.sales).then(rows => {
        this.counters.invoiceSale = rows.count;
      });

      await this.$mysqlAsyncClass.getCountInvoice(StaticsEnum.purchases).then(rows => {
        this.counters.invoicePur = rows.count;
      });



    },

    async getCountInvoiceByDays() {
      await this.$mysqlAsyncClass.getCountInvoiceByDays(StaticsEnum.sales).then(rows => {
        this.counters.days = rows.length;
      });

    },
    async getCountYears() {
      await this.$mysqlAsyncClass.getCountYears().then(rows => {
        console.log(rows,'rows');
        this.counters.years = rows.length;
      });

    }

  }

};
</script>

<style scoped>
.el-footer {
  background: #030303;
  width: 100%;
  height: 40px;
  margin: 1px;

}


</style>
