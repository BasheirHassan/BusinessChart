<template>

  <BackToTopComponents/>
  <HelperComponents title-helper="معلومة" v-show="!showEmptyData">
    <p>مثال يوم جلب يوم 1 من كل شهر وعرضه في يوم واحد</p>
  </HelperComponents>
  <EmptyDataComponents v-show="showEmptyData"/>
  <InfoDataMaxComponents v-show="!showEmptyData" :data-json="isMaxs"/>
  <InfoStepsComponents v-show="!showEmptyData" type-step="dayInWeek"/>

  <template v-for="(item, index) in months">
    <el-row class="p-1">
      <el-col :span="24">
        <div style="height: 600px;">
          <CardChartComponents :is-visable-footer="false"
                               :is-visable-loading="cardChartIsLoading[item.month]"
                               :is-visable-sorted-data="!cardChartIsLoading[item.month]"
                               :is-visable-icons="!cardChartIsLoading[item.month]"
                               :show-legend="false"
                               :data-hash="item.days"
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
import BackToTopComponents from '@/components/BackToTopComponents.vue';
import InfoDataMaxComponents from '@/components/InfoDataMaxComponents.vue';
import InfoStepsComponents from '@/components/InfoStepsComponents.vue';
import HelperComponents from '@/components/HelperComponents.vue';

import DataJsonChartModel from '@/assets/tsModels/DataJsonChartModel';
import {StaticsEnum} from '@/assets/tsModels/StaticsAll';
import PromiseClass from '@/assets/tsModels/PromiseClass';
import DataModel from '@/assets/tsModels/DataModel';
import {toRaw} from 'vue';

export default {
  name      : 'PurchaseCompareSameDayInMonths',
  components: {BackToTopComponents, CardChartComponents, EmptyDataComponents, InfoDataMaxComponents,InfoStepsComponents,HelperComponents},
  data() {
    return {
      chartDataJson     : [],
      cardChartIsLoading: [],
      months            : null,
      showEmptyData     : false,
      isMaxs            : [],

    };
  },

  async mounted() {

    this.months = await this.$mysqlAsyncClass.getAllMonths(StaticsEnum.purchases);
    if (this.months.length > 0) {
      this.loadingData();
      this.showEmptyData = false;
    } else {
      this.showEmptyData = true;
    }


  },
  methods: {
    loadingData() {
      let promises;
      const rawObject = toRaw(this.months);
      //console.log(rawObject);
      rawObject.forEach(item => {
        let keyID = item.month;
        new PromiseClass(resolve => {
          promises = this.$mysqlAsyncClass.getSalesDayInMonths(StaticsEnum.purchases, keyID).then(rows => {
            this.cardChartIsLoading[keyID] = false;
            this.chartDataJson[keyID] = [new DataJsonChartModel(toRaw(rows), keyID)];
            resolve(true);

          });
        });
      });

      promises.then(v => {
        //console.log(v, 'vvvvvvvv');
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