<template>
  <BackToTopComponents/>
  <HelperComponents title-helper="معلومة" v-show="!showEmptyData" :progres-percinteg="percentage">
    <p>مثال:جلب مشتريات السبت من كل ايام السنة كاملة - الاحد من كل ايام السنة</p>
  </HelperComponents>
  <EmptyDataComponents v-show="showEmptyData"/>
  <InfoDataMaxComponents :data-json="isMaxs"/>
  <InfoStepsComponents type-step="dayinweek" :data-step='days'/>

  <template v-for="(item, index) in days">
    <el-row class="p-1">
      <el-col :span="24">
        <div style="height: 600px;">
          <CardChartComponents :is-visable-footer="false"
                               :is-visable-loading="cardChartIsLoading[item.days]"
                               :is-visable-sorted-data="!cardChartIsLoading[item.days]"
                               :is-visable-icons="!cardChartIsLoading[item.days]"
                               :rotation-label-xaxis="90"
                               :show-legend="false"
                               :show-labels-xaxis="true"
                               :show-data-labels="true"
                               :data-hash="item.days"
                               :is-maxs="isMaxs.index === index"
                               type-chart-bar="area"
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
import DataModel from '@/assets/tsModels/DataModel';
import PromiseClass from '@/assets/tsModels/PromiseClass';
import {toRaw} from 'vue';
import $ from 'jquery';


export default {
  name: 'SalesCompareSameDateInWeek',
  components: {

    InfoStepsComponents,
    BackToTopComponents, CardChartComponents, HelperComponents, EmptyDataComponents, InfoDataMaxComponents
  },
  data() {
    return {
      chartDataJson: [],
      cardChartIsLoading: [],
      days: [],
      showEmptyData: false,
      isMaxs: [],
      percentage: {}
    };
  },

  async mounted() {

    console.log('xxxxxxxxxxxxxx');

    this.$mysqlAsyncClass.getAllDaysOffWeeks(StaticsEnum.sales).then(async rows => {
      for (const item of rows) {
        console.log(item,'item')
        this.days.push(item);
        await this.PromiseMe(item);

      }
      if (rows.length <= 0) {
        this.showEmptyData = true;
      }
    }).catch(err => {
      console.log(err);
      this.showEmptyData = true
    });


  },
  methods: {
    PromiseMe(r) {
      let keyID = r.days;
      return new Promise((res, rej) => {
        this.$mysqlAsyncClass.getSalesDayOffWeeks(StaticsEnum.sales, keyID).then(rows => {
          this.chartDataJson[keyID] = [new DataJsonChartModel(toRaw(rows), keyID)];
          res(this.chartDataJson[keyID]);
        })
      });
    }


  },
};
</script>

<style scoped>
.el-row {
  margin-bottom: 10px;
}
</style>