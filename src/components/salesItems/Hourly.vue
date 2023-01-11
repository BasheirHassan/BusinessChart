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
    selectItems(data) {

      let self = this;
      let dataModel = [];
      let promises = [];

      //console.log(data, 'data');
      if (!toRaw(data).length) {
        self.chartDataJson = [];
        return;
      }

      this.cardChartIsLoading = true;
      this.isVisibleIcons = true;
      const rawObject = toRaw(data);
      rawObject.forEach((item, key) => {
        promises = new PromiseClass(resolve => {
          this.$mysqlAsyncClass.getSalesItemHourly(StaticsEnum.sales, item.id).then(rows => {
            dataModel.push(new DataJsonChartModel(rows, item.label));
            resolve(true);
          });
        });
      });

      promises.then(v => {
        //console.log(v, 'vvvvvvvvv');
        self.chartDataJson = dataModel;
        self.cardChartIsLoading = false;
      });

    },

  },
};
</script>

<style scoped>
.el-row {
  margin-bottom: 10px;
}
</style>