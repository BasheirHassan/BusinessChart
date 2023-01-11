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

    this.weeks = await this.$mysqlAsyncClass.getAllWeeks(StaticsEnum.purchases);
    this.loadingData();
    this.showEmptyData = this.weeks.length <= 0;

  },
  methods: {
    loadingData() {
      let promises;
      const rawObject = toRaw(this.weeks);
      rawObject.forEach(item => {
        let keyID = item.weeks;
        promises= new PromiseClass(resolve => {
          this.$mysqlAsyncClass.getSalesWeeklyByID(StaticsEnum.purchases, keyID).then(rows => {
            this.cardChartIsLoading[keyID] = false;
            this.chartDataJson[keyID] = [new DataJsonChartModel(toRaw(rows), keyID)];
            resolve(true);

          })
        })

      promises.then(v => {
        //console.log(v, 'vvvvvvvv');
        //this.$mysqlAsyncClass.closeConnection();
        this.isMaxs = DataModel.getMax(toRaw(this.chartDataJson));
      });
    })

    }
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 10px;
}
</style>