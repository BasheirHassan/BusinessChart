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

export default {
  name      : 'SalesMonthly',
  components: {CardChartComponents, TreeComponent,HelperComponents},

  data() {
    return {
      chartDataJson     : null,
      cardChartIsLoading: false,
      isVisibleIcons    : false,
     };
  },


  methods: {
    selectItems(data) {
      let self = this;
      let dataModel = [];
      let promises;

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
         this.$mysqlAsyncClass.getSalesMonthly(item.in_type_const).then(rows => {
            dataModel.push(new DataJsonChartModel(rows, item.label, 'MM-YY'));
            resolve(true);
           console.log(rows,'rows')
          });
        });
      });

      promises.then(result => {
        //console.log(dataModel, 'result');
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