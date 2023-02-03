<template>
  <BackToTopComponents/>
  <HelperComponents title-helper="معلومة" v-show="!showEmptyData" :progres-percinteg="percentage">
    <p> مثال : جلب مبيعات شهر (1) وعرض 20 منتج تسلسيا بترتيب الاكثر مبيعا</p>
  </HelperComponents>
  <EmptyDataComponents v-show="showEmptyData"/>
  <InfoDataMaxComponents v-show="!showEmptyData" :data-json="isMaxs"/>
  <InfoStepsComponents v-show="!showEmptyData" :data-step='months' type-step="months"/>

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
import {collect} from "collect.js";

export default {
  name: 'SalesItemsTopByDay',
  components: {
    InfoStepsComponents,
    BackToTopComponents, HelperComponents, CardChartComponents, EmptyDataComponents, InfoDataMaxComponents
  },
  data() {
    return {
      chartDataJson: [],
      cardChartIsLoading: [],
      months: [],
      showEmptyData: false,
      isMaxs: [],
      percentage: {}

    };
  },

  async mounted() {
    let i = 0;
    let promiseAll = [];

    this.$mysqlAsyncClass.getAllMonths(StaticsEnum.sales).then(async rows => {
      for (const item of rows) {
        this.months.push(item);
        promiseAll[i++] = await this.PromiseMe(item);
      }

      Promise.all(promiseAll).then((values) => {
        this.isMaxs = DataModel.getMax(toRaw(this.chartDataJson));
      });
    }).catch(err => {
      console.log(err);
    }).finally((k) => {
      this.showEmptyData = collect(this.months).isEmpty()
    });


  },
  methods: {
    PromiseMe(r) {
      let keyID = r.month;
      return new Promise((res, rej) => {
        this.$mysqlAsyncClass.getSalesItemByMonthlyID(StaticsEnum.sales, keyID).then(rows => {
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