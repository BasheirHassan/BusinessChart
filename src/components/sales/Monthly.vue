<template>

  <HelperComponents title-helper="معلومة" v-show="true" :progres-percinteg="100">
    <p>مقارنة مبيعات - مشتريات شهرية</p>
  </HelperComponents>
  <el-row>
    <el-col :span="24">
      <TreeComponent is-invoice-or-items="invoice" @selectItems="selectItems"></TreeComponent>
    </el-col>
  </el-row>

  <el-row class="vh-100">
    <el-col :span="24">
      <CardChartComponents
          :is-visable-loading="cardChartIsLoading"
          :is-visable-footer="true"
          :is-visable-icons="isVisibleIcons"
          card-title="مبيعات شهرية"
          :chart-data-json="chartDataJson"
          :is-visable-sorted-data="isVisibleIcons"
          type-chart-bar="column"
          :show-x-scroller="false"
          :show-points-count="0"
          chart-id="chartID"/>
    </el-col>
  </el-row>

</template>

<script>
import TreeComponent from '@/components/TreeComponent.vue';
import CardChartComponents from '@/components/CardChartComponents.vue';
import HelperComponents from '@/components/HelperComponents.vue';

import DataJsonChartModel from '@/assets/tsModels/DataJsonChartModel';
import PromiseClass from '@/assets/tsModels/PromiseClass';
import {toRaw} from 'vue';
import {StaticsEnum} from "@/assets/tsModels/StaticsAll";
import DataModel from "@/assets/tsModels/DataModel";
import {collect} from "collect.js";

export default {
  name      : 'SalesMonthly',
  components: {CardChartComponents, TreeComponent,HelperComponents},

  data() {
    return {
      chartDataJson     : null,
      cardChartIsLoading: false,
      isVisibleIcons    : false,
      dataModel : []
     };
  },


  methods: {
    async selectItems(data) {
      let self = this;
      let i = 0;
      let promiseAll = [];


      if (collect(data).isEmpty()) {
        self.chartDataJson = [];
        return;
      }

      this.cardChartIsLoading = true;
      this.isVisibleIcons = true;
      const rawObject = toRaw(data);
      for (const item of rawObject) {
        promiseAll[i++] = await this.PromiseMe(item);
      }


      Promise.all(promiseAll).then((values) => {
        self.chartDataJson = values;
        self.cardChartIsLoading = false;
      });

    },

    PromiseMe(item) {
      return new Promise((resolve, reject) => {
            this.$mysqlAsyncClass.getSalesMonthly(item.in_type_const).then(rows => {
              resolve(new DataJsonChartModel(rows, item.label, 'MM-YY'));
              console.log(rows, 'rows')
            });
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