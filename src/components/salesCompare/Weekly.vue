<template>
  <BackToTopComponents/>

  <HelperComponents title-helper="معلومة" v-show="!showEmptyData" :progres-percinteg="percentage">
    <p>جلب المبيعات من يوم السبت الى يوم الجمعه ومن ثم عرضها حسب رقم الاسبوع</p>
    <p>جلب مبيعات الاسبوع الثاني وعرضها في الاسبوع الثاني</p>
  </HelperComponents>

  <EmptyDataComponents v-show="showEmptyData"/>

  <InfoStepsComponents  :data-step='weeks' type-step="weeks"/>
  <InfoDataMaxComponents v-show="!showEmptyData" :data-json="isMaxs"/>



  <template v-for="(item, index) in weeks">
    <el-row class="p-1">
      <el-col :span="24">
        <div style="height: 600px;" :data-id="item.weeks">
          <CardChartComponents :is-visable-footer="true" :ref="item.weeks"

                               :is-visable-loading="cardChartIsLoading[item.weeks]"
                               :is-visable-sorted-data="true"
                               :show-legend="false"
                               :is-visable-icons="cardChartIsLoading[item.weeks]"
                               :data-hash="item.weeks"
                               :chart-data-json="chartDataJson[item.weeks]"
                               :chart-id="'chartID-'+item.weeks"
                               :is-maxs="isMaxs.index === index"
                               :card-title=" '  اسبوع رقم  - ' + item.weeks"/>
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

export default {
  name      : 'SalesCompareWeekly',
  components: {
    InfoStepsComponents,
    InfoDataMaxComponents, BackToTopComponents, CardChartComponents, HelperComponents, EmptyDataComponents,
  },
  data() {
    return {
      chartDataJson     : [],
      cardChartIsLoading: [],
      weeks             : [],
      showEmptyData     : false,
      isMaxs            : [],
      percentage        : {},
    };
  },

  async mounted() {

    this.$mysqlAsyncClass.getAllWeeks(StaticsEnum.sales).then(async rows => {
      for (const item of rows) {
        this.weeks.push(item);
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
      let keyID = r.weeks;
      return new Promise((res, rej) => {
        this.$mysqlAsyncClass.getSalesWeeklyByID(StaticsEnum.sales, keyID).then(rows => {
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