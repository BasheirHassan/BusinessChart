<template>
  <BackToTopComponents/>
  <HelperComponents title-helper="معلومة" v-show="!showEmptyData" :progres-percinteg="percentage">
    <p> مثال : جلب مبيعات شهر (1) وعرض 20 منتج تسلسيا بترتيب الاكثر مبيعا</p>
  </HelperComponents>
  <EmptyDataComponents v-show="showEmptyData"/>
  <InfoDataMaxComponents v-show="!showEmptyData" :data-json="isMaxs"/>
  <InfoStepsComponents v-show="!showEmptyData" type-step="months"/>

  <template v-for="(item, index) in months">
    <el-row class="p-1">
      <el-col :span="24">
        <div style="height: 600px;">
          <CardChartComponents :is-visable-footer="false"
                               :is-visable-loading="cardChartIsLoading[item.month]"
                               :is-visable-icons="!cardChartIsLoading[item.month]"
                               :is-visable-sorted-data="!cardChartIsLoading[item.month]"
                               :show-legend="false"
                               :data-hash="item.month"
                               :rotation-label-xaxis="90"
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
import EmptyDataComponents from '@/components/EmptyDataComponents.vue';
import HelperComponents from '@/components/HelperComponents.vue';
import BackToTopComponents from '@/components/BackToTopComponents.vue';
import InfoDataMaxComponents from '@/components/InfoDataMaxComponents.vue';
import InfoStepsComponents from '@/components/InfoStepsComponents.vue';

import DataJsonChartModel from '@/assets/tsModels/DataJsonChartModel';
import {StaticsEnum} from '@/assets/tsModels/StaticsAll';
import {toRaw} from 'vue';
import PromiseClass from '@/assets/tsModels/PromiseClass';
import DataModel from '@/assets/tsModels/DataModel';
import $ from 'jquery';

export default {
  name      : 'SalesItemsTopByDay',
  components: {
    InfoStepsComponents,
    BackToTopComponents, HelperComponents, CardChartComponents, EmptyDataComponents, InfoDataMaxComponents},
  data() {
    return {
      chartDataJson     : [],
      cardChartIsLoading: [],
      months            : [],
      showEmptyData     : false,
      isMaxs            : [],
      percentage:{}

    };
  },

  async mounted() {

    this.months = await this.$mysqlAsyncClass.getAllMonths(StaticsEnum.sales);
    this.loadingData();
    this.showEmptyData = this.months.length <= 0;
  },
  methods: {
    loadingData() {
      let promises;
      const rawObject = toRaw(this.months);
      //console.log(rawObject);
      rawObject.forEach(item => {
        let keyID = item.month;
        promises = new PromiseClass(resolve => {
          $.when(this.percentage = {value:keyID,total:rawObject.length-1}).then(()=>{
            this.$mysqlAsyncClass.getSalesItemByMonthlyID(StaticsEnum.sales, keyID).then(rows => {
              this.cardChartIsLoading[keyID] = false;
              this.chartDataJson[keyID] = [new DataJsonChartModel(toRaw(rows), keyID)];
              resolve(true);

            });
          })

        });
      });

      promises.then(v => {
        // console.log(v, 'vvvvvvvv');
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