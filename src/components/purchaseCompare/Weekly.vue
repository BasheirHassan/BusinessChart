<template>
<BackToTopComponents/>
  <HelperComponents title-helper="معلومة" v-show="!showEmptyData">
    <p>جلب مشتريات من يوم السبت الى يوم الجمعه ومن ثم عرضها حسب رقم الاسبوع</p>
    <p>جلب مشتريات الاسبوع الثاني وعرضها في الاسبوع الثاني</p>
  </HelperComponents>
  <EmptyDataComponents v-show="showEmptyData"/>
  <InfoDataMaxComponents v-show="!showEmptyData" :data-json="isMaxs"/>
  <InfoStepsComponents   v-show="!showEmptyData" type-step="weeks"/>

  <template v-for="(item, index) in weeks">
    <el-row class="p-1">
      <el-col :span="24">
        <div style="height: 600px;">
          <CardChartComponents :is-visable-footer="false"
                               :is-visable-loading="cardChartIsLoading[item.weeks]"
                               :is-visable-sorted-data="!cardChartIsLoading[item.weeks]"
                               :show-legend="false"
                               :data-hash="item.weeks"
                               :is-visable-icons ="!cardChartIsLoading[item.weeks]"
                               :chart-data-json="chartDataJson[item.weeks]"
                               :chart-id="'chartID-'+item.weeks"
                               :card-title=" '  اسبوع - ' + item.weeks"/>
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

import MysqlAsyncClass from '@/assets/tsModels/MysqlAsyncClass';
import DataJsonChartModel from '@/assets/tsModels/DataJsonChartModel';
import {StaticsEnum} from '@/assets/tsModels/StaticsAll';
import DataModel from '@/assets/tsModels/DataModel';
import {toRaw} from 'vue';
import PromiseClass from '@/assets/tsModels/PromiseClass';


export default {
  name      : 'PurchaseCompareWeekly',
  components: {BackToTopComponents, CardChartComponents, EmptyDataComponents, HelperComponents, InfoDataMaxComponents,InfoStepsComponents},
  data() {
    return {
      chartDataJson     : [],
      cardChartIsLoading: [],
      weeks             : [],
      showEmptyData     : false,
      isMaxs            : []
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
}
</script>

<style scoped>
.el-row {
  margin-bottom: 10px;
}
</style>