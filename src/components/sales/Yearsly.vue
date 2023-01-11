<template>


  <HelperComponents title-helper="معلومة" v-show="!showEmptyData">
    <p> مثال : جلب مبيعات كافة السنوات المالية</p>
  </HelperComponents>

  <el-row class="p-1 vh-100">
    <el-col :span="24">

      <CardChartComponents :is-visable-footer="true"
                           :is-visable-loading="cardChartIsLoading"
                           :chart-data-json="chartDataJson"
                           :is-visable-sorted-data="true"
                           :show-labels-xaxis ="false"
                           :is-visable-icons="true"
                           chart-id="chartID" chart-title="مبيعات سنوية"/>


    </el-col>
  </el-row>

</template>


<script>
import CardChartComponents from '@/components/CardChartComponents.vue';
import HelperComponents from '@/components/HelperComponents.vue';
import MysqlAsyncClass from '@/assets/tsModels/MysqlAsyncClass';
import DataJsonChartModel from '@/assets/tsModels/DataJsonChartModel';
import {StaticsEnum} from '@/assets/tsModels/StaticsAll';
import StoreConfig from '@/assets/tsModels/StoreConfig';

export default {
  name      : 'SalesYeasly',
  components: {CardChartComponents,HelperComponents},
  data() {
    return {
      chartDataJson     : null,
      cardChartIsLoading: true,
    };
  },
  async mounted() {
    let self = this;
    let promises = [];
    let mysqlAsyncClass = [];
    let dataModel = [];
    let years = await StoreConfig.getAllDB();

    years.forEach((item, key) => {
      promises[key] = new Promise(async (resolve, reject) => {
        mysqlAsyncClass[key] = new MysqlAsyncClass('serverhost');
        mysqlAsyncClass[key].dbName = item.da_name;
        mysqlAsyncClass[key].getSalesAll(StaticsEnum.sales).then(rows => {
          dataModel[key] = new DataJsonChartModel(rows, item.da_title);
          resolve(dataModel[key]);

        }).catch(err => {
          console.log(err);
        });

      });
    });

    Promise.all(promises).then((results) => {
      self.chartDataJson = results;
      self.cardChartIsLoading = false;

    });

  },

};
</script>

<style scoped>
.el-row {
  margin-bottom: 10px;
}
</style>