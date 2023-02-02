<template>
  <el-row>
    <el-col :span="24">
      <TreeComponent is-invoice-or-items="items" @selectItems="selectItems"></TreeComponent>
    </el-col>
  </el-row>

  <el-row class="vh-100">
    <el-col :span="24">
      <CardChartComponents
          :is-visable-loading="cardChartIsLoading"
          :is-visable-footer="true"
          :is-visable-icons="isVisibleIcons"
          :is-visable-sorted-data="isVisibleIcons"
          card-title="مبيعات شهرية"
          :chart-data-json="chartDataJson"

          :show-x-scroller="false"
          chart-id="chartID"/>
    </el-col>
  </el-row>

</template>

<script>
import TreeComponent from '@/components/TreeComponent.vue';
import CardChartComponents from '@/components/CardChartComponents.vue';
import DataJsonChartModel from '@/assets/tsModels/DataJsonChartModel';
import {StaticsEnum} from '@/assets/tsModels/StaticsAll';
import PromiseClass from '@/assets/tsModels/PromiseClass';
import {toRaw} from 'vue';
import {collect} from "collect.js";

export default {
  name      : 'SalesItemsWeekly',
  components: {CardChartComponents, TreeComponent},

  data() {
    return {
      mysqlClass        : null,
      chartDataJson     : null,
      cardChartIsLoading: false,
      isVisibleIcons    : false,
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
        this.isVisibleIcons = true;
      });


    }  ,
    PromiseMe(item) {
      return new Promise((resolve, reject) => {
        this.$mysqlAsyncClass.getSalesItemHourly(StaticsEnum.sales, item.id).then(rows=> {
          resolve(new DataJsonChartModel(rows, item.label));
        });
      });
    }

  }

};
</script>

<style scoped>
.el-row {
  margin-bottom: 10px;
}
</style>