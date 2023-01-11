<template>
  <el-row>
    <el-col :span="24">
      <TreeComponent is-invoice-or-items="customers" @selectItems="selectItems"></TreeComponent>
    </el-col>
  </el-row>

  <el-row class="vh-100">
    <el-col :span="24">
      <CardChartComponents
          :is-visable-loading="cardChartIsLoading"
          :is-visable-footer="true"
          :is-visable-icons ="isVisibleIcons"
          :is-visable-sorted-data="isVisibleIcons"
          card-title="مبيعات شهرية"
          :chart-data-json="chartDataJson"
          :show-x-scroller="true"
          chart-id="chartID" />
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
  name      : 'SalesCustomersMonthly',
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
    selectItems(data) {

      let self = this;
      let dataModel = [];
      let promises = [];


      if (data != null && !toRaw(data).length) {
        self.chartDataJson = [];
        return;
      }
      console.log(data, 'data');
      this.cardChartIsLoading = true;
      this.isVisibleIcons = true;
      const rawObject = toRaw(data);
      if (!rawObject) {
        self.cardChartIsLoading = false;
        return;
      }


      rawObject.forEach((item, key) => {
        promises = new PromiseClass(resolve => {
          this.$mysqlAsyncClass.getSalesCustomersMonthly(StaticsEnum.sales, item.id).then(rows=> {
            dataModel.push(new DataJsonChartModel(rows, item.label, 'yyyy-MM'));
            resolve(true);
          });
        });
      });

      promises.then(v => {
        // console.log(v, 'vvvvv');
        self.chartDataJson = dataModel;
        self.cardChartIsLoading = false;
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