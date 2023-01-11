<template>

  <BackToTopComponents/>
  <HelperComponents title-helper="معلومة" v-show="!showEmptyData">
    <p> مثال:جلب مبيعات السبت من كل ايام السنة كاملة - الاحد من كل ايام السنة</p>
  </HelperComponents>
  <EmptyDataComponents v-show="showEmptyData"/>
  <InfoDataMaxComponents v-show="!showEmptyData" :data-json="isMaxs"/>
  <InfoStepsComponents v-show="!showEmptyData" type-step="dayInWeek"/>

  <template v-for="(item, index) in days">
    <el-row class="p-1">
      <el-col :span="24">
        <div style="height: 600px;">
          <CardChartComponents :is-visable-footer="false"
                               :is-visable-loading="cardChartIsLoading[item.days]"
                               :is-visable-sorted-data="!cardChartIsLoading[item.days]"
                               :is-visable-icons="!cardChartIsLoading[item.days]"
                               :rotation-label-xaxis="90"
                               :show-labels-xaxis="true"
                               :show-legend="false"
                               :data-hash="item.days"
                               :chart-data-json="chartDataJson[item.days]"
                               :chart-id="'chartID-'+item.days"
                               :card-title=" ' يوم - ' + $dayNameAr(item.dayName)  "/>
        </div>

      </el-col>
    </el-row>
  </template>
</template>


<script>
import CardChartComponents from '@/components/CardChartComponents.vue';
import EmptyDataComponents from '@/components/EmptyDataComponents.vue';
import BackToTopComponents from '@/components/BackToTopComponents.vue';
import HelperComponents from '@/components/HelperComponents.vue';
import InfoDataMaxComponents from '@/components/InfoDataMaxComponents.vue';
import InfoStepsComponents from '@/components/InfoStepsComponents.vue';

import DataJsonChartModel from '@/assets/tsModels/DataJsonChartModel';
import {StaticsEnum} from '@/assets/tsModels/StaticsAll';
import PromiseClass from '@/assets/tsModels/PromiseClass';
import DataModel from '@/assets/tsModels/DataModel';
import {toRaw} from 'vue';
export default {
  name      : 'SalesCompareSameDateInWeek',
  components: {
    InfoStepsComponents,
    BackToTopComponents, CardChartComponents, HelperComponents, EmptyDataComponents, InfoDataMaxComponents},
  data() {
    return {
      chartDataJson     : [],
      cardChartIsLoading: [],
      days              : [],
      dayName           : [],
      showEmptyData     : false,
      isMaxs            : [],

    };
  },

  async mounted() {

    this.days = await this.$mysqlAsyncClass.getAllDaysOffWeeks(StaticsEnum.purchases);
    if (this.days.length > 0) {
      this.loadingData();
      this.showEmptyData = false;
    } else {
      this.showEmptyData = true;
    }



  },
  methods: {
    loadingData() {
      let promises;
      const rawObject = toRaw(this.days);
      rawObject.forEach(item => {
        let keyID = item.days;
        promises =new PromiseClass(resolve => {
          this.$mysqlAsyncClass.getSalesDayOffWeeks(StaticsEnum.purchases, keyID).then(rows => {
            this.cardChartIsLoading[keyID] = false;
            this.chartDataJson[keyID] = [new DataJsonChartModel(toRaw(rows), keyID)];
            resolve(true);
          });
        })
      });

       promises.then(v => {
        //this.$mysqlAsyncClass.closeConnection();
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