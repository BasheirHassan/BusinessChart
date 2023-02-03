<template>
  <HelperComponents title-helper="معلومة" v-show="!showEmptyData" :progres-percinteg="percentage">
    <p> مثال : جلب مبيعات الاسبوع الاول وعرض المبيعات حسب الايام في الاسبوع</p>
  </HelperComponents>

  <EmptyDataComponents v-show="showEmptyData"/>
  <InfoDataMaxComponents v-show="!showEmptyData" card-hash="chartID-" :data-json="isMaxs"/>
  <InfoStepsComponents  v-show="!showEmptyData" :data-step='weeks' type-step="weeks"/>
  <BackToTopComponents/>

  <template v-for="(item, index) in weeks">
    <el-row class="p-1">
      <el-col :span="24">
        <div style="height: 600px;">
          <CardChartComponents :is-visable-footer="false"
                               :is-visable-loading="cardChartIsLoading[item.weeks]"
                               :is-visable-icons="!cardChartIsLoading[item.weeks]"
                               :is-visable-sorted-data="!cardChartIsLoading[item.weeks]"
                               :show-legend="false"
                               :data-hash="item.weeks"
                               :rotation-label-xaxis="90"
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
import InfoDataMaxComponents from '@/components/InfoDataMaxComponents.vue';
import BackToTopComponents from '@/components/BackToTopComponents.vue';
import InfoStepsComponents from '@/components/InfoStepsComponents.vue';

import DataJsonChartModel from '@/assets/tsModels/DataJsonChartModel';
import {StaticsEnum} from '@/assets/tsModels/StaticsAll';
import {toRaw} from 'vue';
import PromiseClass from '@/assets/tsModels/PromiseClass';
import DataModel from '@/assets/tsModels/DataModel';
import $ from 'jquery';
import {collect} from "collect.js";

export default {
  name      : 'SalesItemsTopByDay',
  components: {BackToTopComponents, CardChartComponents, HelperComponents, EmptyDataComponents, InfoDataMaxComponents,InfoStepsComponents},
  data() {
    return {
      chartDataJson     : [],
      cardChartIsLoading: [],
      weeks             : [],
      showEmptyData     : false,
      isMaxs            : [],
      percentage:{}
    };
  },

  async mounted() {




    let i = 0;
    let promiseAll = [];
    this.$mysqlAsyncClass.getAllWeeks(StaticsEnum.sales).then(async rows => {
      for (const item of rows) {
        this.weeks.push(item);
        promiseAll[i++] =await this.PromiseMe(item);
      }

      Promise.all(promiseAll).then((values) => {
        this.isMaxs = DataModel.getMax(toRaw(this.chartDataJson));
      });
    }).catch(err => {
      console.log(err);
    }).finally((k)=>{
      this.showEmptyData = collect(this.weeks).isEmpty()
    });





    // this.weeks = await this.$mysqlAsyncClass.getAllWeeks(StaticsEnum.sales);
    // this.loadingData();
    // this.showEmptyData = this.weeks.length <= 0;






  },
  methods: {
    loadingData() {
      let promises;
      const rawObject = toRaw(this.weeks);
      rawObject.forEach(item => {
        let keyID = item.weeks;
        promises = new PromiseClass(resolve => {
          $.when(this.percentage = {value:keyID,total:rawObject.length-1}).then(()=>{
            this.$mysqlAsyncClass.getSalesItemByWeeklyID(StaticsEnum.sales, keyID).then(rows => {
              this.cardChartIsLoading[keyID] = false;
              this.chartDataJson[keyID] = [new DataJsonChartModel(toRaw(rows), keyID)];
              resolve(true);

            });
          })

        });
      });

      promises.then(v => {
        //console.log(v, 'vvvvvvvv');
        this.isMaxs = DataModel.getMax(toRaw(this.chartDataJson));
      });

    },
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