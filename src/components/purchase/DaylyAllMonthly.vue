<template>
<BackToTopComponents/>
  <HelperComponents title-helper="معلومة" v-show="!showEmptyData" :progres-percinteg="percentage">
    <p>جلب مشتريات يومية من كل شهر</p>
    <p>جلب شهر 1 ومن ثم جلب مشتريات اليومية لشهر 1</p>
    <p>جلب شهر 2 ومن ثم جلب مشتريات اليومية لشهر 2</p>
    <p>ويتم عرضها وفقا لترتيب العرض بالمسمى</p>
  </HelperComponents>

  <EmptyDataComponents v-show="showEmptyData"/>
  <InfoDataMaxComponents v-show="!showEmptyData" :data-json="isMaxs"/>
  <InfoStepsComponents v-show="!showEmptyData" type-step="months"/>


  <template v-for="(item, index) in month">
    <el-row class="p-1">
      <el-col :span="24">
        <div style="height: 600px;">
          <CardChartComponents :is-visable-footer="false"
                               :is-visable-loading="cardChartIsLoading[item.month]"
                               :is-visable-icons ="!cardChartIsLoading[item.weeks]"
                               :is-visable-sorted-data="!cardChartIsLoading[item.month]"
                               :show-legend="false"
                               :data-hash="item.month"
                               :chart-data-json="chartDataJson[item.month]"
                               :chart-id="'chartID-'+item.month"
                               :card-title=" '  شهر - ' + item.month"/>
        </div>

      </el-col>
    </el-row>
  </template>
</template>


<script>
import CardChartComponents from '@/components/CardChartComponents.vue';
import HelperComponents from '@/components/HelperComponents.vue';
import EmptyDataComponents from '@/components/EmptyDataComponents.vue';
import BackToTopComponents from '@/components/BackToTopComponents.vue';
import InfoDataMaxComponents from '@/components/InfoDataMaxComponents.vue';
import InfoStepsComponents from '@/components/InfoStepsComponents.vue';
import MysqlAsyncClass from '@/assets/tsModels/MysqlAsyncClass';
import DataJsonChartModel from '@/assets/tsModels/DataJsonChartModel';
import {StaticsEnum} from '@/assets/tsModels/StaticsAll';
import {ElNotification} from 'element-plus';
import {toRaw} from 'vue';
import PromiseClass from '@/assets/tsModels/PromiseClass';
import DataModel from '@/assets/tsModels/DataModel';
import $ from 'jquery';


export default {
  name      : 'PurchaseDaylyAllMonthly',
  components: {BackToTopComponents, CardChartComponents,EmptyDataComponents,HelperComponents,InfoDataMaxComponents,InfoStepsComponents},
  data() {
    return {
      chartDataJson     : [],
      cardChartIsLoading: [],
      month             : [],
      showEmptyData     : false,
      isMaxs            : [],
      percentage:{}

    };
  },

  async mounted() {

    this.month = await this.$mysqlAsyncClass.getAllMonths(StaticsEnum.purchases);
    if (this.month.length > 0) {
      this.loadingData();
      this.showEmptyData = false;
    } else {
      this.showEmptyData = true;
    }
  },
  methods: {
    loadingData() {
    let promises;
      const rawObject = toRaw(this.month);
      rawObject.forEach(item => {
        let keyID = item.month;

        promises=new PromiseClass(resolve => {
          $.when(this.percentage = {value:keyID,total:rawObject.length}).then(()=>{
            this.$mysqlAsyncClass.getSalesDayInMonthly(StaticsEnum.purchases, keyID).then(rows => {
              this.cardChartIsLoading[keyID] = false;
              this.chartDataJson[keyID] = [new DataJsonChartModel(toRaw(rows), keyID)];
              resolve(true);

            })
          });

        })
      });

    promises.then(v => {
        console.log(v, 'vvvvvvvv');
      this.$mysqlAsyncClass.closeConnection();
        this.isMaxs = DataModel.getMax(toRaw(this.chartDataJson));
      });

    },
  },
};
</script>

<style scoped>
.el-row {
  margin-bottom: 10px;
}
</style>