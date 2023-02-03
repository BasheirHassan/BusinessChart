<template>
  <el-row>
    <el-col :span="24" v-show="!showEmptyData">
      <HelperComponents title-helper="معلومة" :progress-percinteg="percentage">
        <p>جلب مبيعات يومية من كل شهر</p>
        <p>جلب شهر 1 ومن ثم جلب مبيعات اليومية لشهر 1</p>
        <p>جلب شهر 2 ومن ثم جلب مبيعات اليومية لشهر 2</p>
        <p>ويتم عرضها وفقا لترتيب العرض بالمسمى</p>
      </HelperComponents>
    </el-col>

    <el-col :span="24" v-show="showEmptyData">
      <EmptyDataComponents/>
    </el-col>

    <el-col :span="24" v-show="!showEmptyData">
      <InfoDataMaxComponents :data-json="isMaxs"/>
    </el-col>

    <el-col :span="24" v-show="!showEmptyData">
      <InfoStepsComponents :data-step='month' type-step="months"/>
    </el-col>


    <template v-for="(item, index) in month">
      <el-col :span="24">
        <div class="hDiv">
          <CardChartComponents :is-visable-footer="true"
                               :is-visable-loading="cardChartIsLoading[item.month]"
                               :is-visable-icons="!cardChartIsLoading[item.month]"
                               :is-visable-sorted-data="!cardChartIsLoading[item.month]"
                               :show-legend="false"
                               :data-hash="item.month"
                               :chart-data-json="chartDataJson[item.month]"
                               :chart-id="'chartID-'+item.month"
                               :card-title=" '  شهر - ' + item.month"/>

        </div>
      </el-col>
    </template>

  </el-row>
</template>


<script>
import CardChartComponents from '@/components/CardChartComponents.vue';
import HelperComponents from '@/components/HelperComponents.vue';
import EmptyDataComponents from '@/components/EmptyDataComponents.vue';
import BackToTopComponents from '@/components/BackToTopComponents.vue';
import InfoDataMaxComponents from '@/components/InfoDataMaxComponents.vue';
import InfoStepsComponents from '@/components/InfoStepsComponents.vue';

import DataJsonChartModel from '@/assets/tsModels/DataJsonChartModel';
import {StaticsEnum} from '@/assets/tsModels/StaticsAll';
import {toRaw} from 'vue';
import DataModel from "@/assets/tsModels/DataModel";
import * as PromiseBluebird from "bluebird";
import {collect} from "collect.js";

export default {
  name: 'SalesDaylyAllMonthly',
  components: {
    BackToTopComponents,
    CardChartComponents,
    EmptyDataComponents,
    HelperComponents,
    InfoDataMaxComponents,
    InfoStepsComponents
  },
  data() {
    return {
      chartDataJson: [],
      cardChartIsLoading: [],
      month: [],
      showEmptyData: false,
      isMaxs: [],
      percentage: {},

    };
  },

  async mounted() {
    let i = 0;
    let promiseAll = [];

    this.$mysqlAsyncClass.getAllMonths(StaticsEnum.sales).then(async rows => {
      for (const item of rows) {
        this.month.push(item);
        promiseAll[i++] = await this.PromiseMe(item);
      }
      if (rows.length <= 0) {
        this.showEmptyData = true;
      }

      Promise.all(promiseAll).then((values) => {
        console.log('Finshhhhhh', values);
        this.isMaxs = DataModel.getMax(toRaw(this.chartDataJson));
      });
    }).catch(err => {
      console.log(err);
    }).
    finally((k)=>{
      this.showEmptyData = collect(this.month).isEmpty()
    });

  },
  methods: {
    PromiseMe(r) {
      let keyID = r.day;
      return new Promise((res, rej) => {
        this.$mysqlAsyncClass.getSalesDayInMonthly(StaticsEnum.sales, r.month).then(rows => {
          let keyID = r.month;
          this.cardChartIsLoading[keyID] = false;
          this.chartDataJson[keyID] = [new DataJsonChartModel(toRaw(rows), keyID)];
          res(rows);
        })
      });
    }

  }

};
</script>

<style scoped>
.el-row {
  margin-bottom: 10px;
}

.hDiv {
  height: 600px;
}
</style>