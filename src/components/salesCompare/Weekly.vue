<template>
  <BackToTopComponents/>

  <HelperComponents title-helper="معلومة" v-show="!showEmptyData" :progres-percinteg="percentage">
    <p>جلب المبيعات من يوم السبت الى يوم الجمعه ومن ثم عرضها حسب رقم الاسبوع</p>
    <p>جلب مبيعات الاسبوع الثاني وعرضها في الاسبوع الثاني</p>
  </HelperComponents>

  <EmptyDataComponents v-show="showEmptyData"/>

  <InfoStepsComponents :active="activeWeeks" type-step="weeks"/>
  <InfoDataMaxComponents v-show="!showEmptyData" :data-json="isMaxs"/>



  <template v-for="(item, index) in weeks">
    <el-row class="p-1">
      <el-col :span="24">
        <div style="height: 600px;" :data-id="item.weeks">
          <CardChartComponents :is-visable-footer="false" :ref="item.weeks"

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
import moment from 'moment';
import {collect} from 'collect.js';
import DataModel from '@/assets/tsModels/DataModel';
import PromiseClass from '@/assets/tsModels/PromiseClass';
import $ from 'jquery';

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
      weeksThisYear     : moment().weeksInYear(),
      activeWeeks       : 0,
      showEmptyData     : false,
      isMaxs            : [],
      percentage        : {},
    };
  },

  async mounted() {

    this.weeks = await this.$mysqlAsyncClass.getAllWeeks(StaticsEnum.sales);
    this.loadingData();

    if (this.weeks.length > 0) {
      this.activeWeeks = toRaw(collect(this.weeks).last()).weeks || 0;
    }

    this.showEmptyData = this.weeks.length <= 0;

  },
  methods: {


    loadingData() {
      let self = this;
      let promises;
      const rawObject = toRaw(this.weeks);

      rawObject.forEach((item, key) => {
        let keyID = item.weeks;

        promises = new PromiseClass(resolve => {
          this.cardChartIsLoading[keyID] = true;
            this.$mysqlAsyncClass.getSalesWeeklyByID(StaticsEnum.sales, keyID).then(rows => {

              this.percentage = {value:key,total:rawObject.length-1};

              this.chartDataJson[keyID] = [new DataJsonChartModel(toRaw(rows), keyID)];
              this.activeWeeks = keyID;
              resolve(this.chartDataJson[keyID]);
            });

        });
      });

      promises.then(v => {
        //console.log(v, 'vvvvvvvvv');
       // this.$mysqlAsyncClass.closeConnection();
        this.isMaxs = DataModel.getMax(toRaw(this.chartDataJson));
        //console.log(this.isMaxs, 'Max');
      }).catch(err => {
        console.log(err);
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