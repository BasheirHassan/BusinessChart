<template>
  <HelperComponents title-helper="معلومة">عرض اجمالي مشتريات بترتيب الموسم - صيف - شتاء - ربيع - خريف</HelperComponents>

  <el-row class="vh-100">
    <el-col :span="24">
      <CardChartComponents
          :is-visable-loading="cardChartIsLoading"
          :is-visable-footer="true"
          card-title="مشتريات موسمية"
          :chart-data-json="chartDataJson"
          :is-visable-icons ="!cardChartIsLoading"
          :is-visable-sorted-data="!cardChartIsLoading"
          :show-x-scroller="false"
          chart-id="chartID"/>
    </el-col>
  </el-row>

</template>

<script>

import CardChartComponents from '@/components/CardChartComponents.vue';
import HelperComponents from '@/components/HelperComponents.vue';
import MysqlAsyncClass from '@/assets/tsModels/MysqlAsyncClass';
import DataJsonChartModel from '@/assets/tsModels/DataJsonChartModel';
import {collect} from 'collect.js';
import {StaticsEnum} from '@/assets/tsModels/StaticsAll';
import {StaticsSeasons} from '@/assets/tsModels/StaticsAll';

export default {
  name      : 'SalesCompareSeasons',
  components: {CardChartComponents, HelperComponents},

  data() {
    return {
      chartDataJson     : null,
      cardChartIsLoading: false,
    };
  },

  mounted() {


    this.cardChartIsLoading =true;

    let dataModel = [];

    this.$mysqlAsyncClass.getSalesMonthly(StaticsEnum.purchases)

    .then(rows=> {

      StaticsSeasons.forEach((item, key) => {
        let grouped = collect(rows).whereIn('months', item.value);
        let totalSeasonValue = grouped.sum('value');
        let totalSeasonTooltip = grouped.sum('tooltip');
        dataModel.push(new DataJsonChartModel([{x: item.title, 'value': totalSeasonValue, 'tooltip': totalSeasonTooltip}], item.title));

      });

      console.log(dataModel,'dataModel');
      this.chartDataJson = dataModel;
      this.cardChartIsLoading =false;


    });

  },

};
</script>

<style scoped>
.el-row {
  margin-bottom: 10px;
}
</style>