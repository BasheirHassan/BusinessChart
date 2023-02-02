<template>
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
          :is-visable-icons ="isVisibleIcons"
          card-title="مبيعات شهرية"
          :chart-data-json="chartDataJson"
          :is-visable-sorted-data="isVisibleIcons"
          :show-points-count="30"
          :show-x-scroller="true"
          chart-id="chartID" />
    </el-col>
  </el-row>

</template>

<script>
import TreeComponent from '@/components/TreeComponent.vue';
import CardChartComponents from '@/components/CardChartComponents.vue';

import DataJsonChartModel from '@/assets/tsModels/DataJsonChartModel';
import PromiseClass from '@/assets/tsModels/PromiseClass';
import {toRaw} from 'vue';

export default {
  name      : 'SalesDayly',
  components: {CardChartComponents, TreeComponent},

  data() {
    return {
      mysqlClass   : null,
      chartDataJson:null,
      cardChartIsLoading: false,
      isVisibleIcons : false
    };
  },


  methods: {
    async selectItems(data) {
      let self = this;
      let i = 0;
      let promiseAll = [];



      if (!toRaw(data).length) {
        self.chartDataJson = [];
        return;
      }

      this.cardChartIsLoading = true;

      const rawObject = toRaw(data);
      for (const item of rawObject) {
        promiseAll[i++] = await this.PromiseMe(item);
      }


      Promise.all(promiseAll).then((values) => {
        self.chartDataJson = values;
        self.cardChartIsLoading = false;
        this.isVisibleIcons = true;

      });


    } ,

    PromiseMe(item) {
      return new Promise((resolve, reject) => {
        this.$mysqlAsyncClass.getSalesDayly(item.in_type_const).then(rows => {
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