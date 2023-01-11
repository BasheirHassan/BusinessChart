<template>
<BackToTopComponents/>
  <HelperComponents title-helper="معلومة" v-show="!showEmptyData" :progres-percinteg="percentage">
    <p>مثال يوم جلب يوم 1 من كل ايام السنة وعرضه في يوم واحد</p>
    <p>جلب يوم 2 من كل السنة وعرض في يوم 2</p>
  </HelperComponents>

<EmptyDataComponents v-show="showEmptyData"/>
<InfoDataMaxComponents v-show="!showEmptyData"  :data-json="isMaxs"/>
<InfoStepsComponents v-show="!showEmptyData" type-step="dayInMonth"/>

  <template v-for="(item, index) in days">
    <el-row class="p-1">
      <el-col :span="24">
        <div style="height: 600px;">

          <CardChartComponents :is-visable-footer="false"
                               :is-visable-loading="cardChartIsLoading[item.day]"
                               :is-visable-sorted-data="!cardChartIsLoading[item.day]"
                               :is-visable-icons ="!cardChartIsLoading[item.day]"
                               :show-legend="false"
                               type-chart-bar="column"
                               :data-hash="item.day"
                               :chart-data-json="chartDataJson[item.day]"
                               :is-maxs="isMaxs.index === item.day"
                               :chart-id="'chartID-'+item.day"
                               :card-title=" '  يوم - ' + item.day"/>
        </div>

      </el-col>
    </el-row>
  </template>
</template>


<script>
import CardChartComponents from '@/components/CardChartComponents.vue';
import HelperComponents from '@/components/HelperComponents.vue';
import BackToTopComponents from '@/components/BackToTopComponents.vue';
import InfoDataMaxComponents from '@/components/InfoDataMaxComponents.vue';
import EmptyDataComponents from '@/components/EmptyDataComponents.vue';
import InfoStepsComponents from '@/components/InfoStepsComponents.vue';

import DataJsonChartModel from '@/assets/tsModels/DataJsonChartModel';
import {StaticsEnum} from '@/assets/tsModels/StaticsAll';
import PromiseClass from '@/assets/tsModels/PromiseClass';
import DataModel from '@/assets/tsModels/DataModel';
import {toRaw} from 'vue';
import $ from 'jquery';


export default {
  name      : 'SalesCompareSameDayInMonths',
  components: { InfoDataMaxComponents,BackToTopComponents, EmptyDataComponents, CardChartComponents,HelperComponents,InfoStepsComponents},

  data() {
    return {
      chartDataJson     : [],
      cardChartIsLoading: [],
      days            : [],
      showEmptyData:false,
      isMaxs:[],
      percentage:{}
    };
  },

  async mounted() {

    this.days = await this.$mysqlAsyncClass.getAllDays(StaticsEnum.sales);
    this.loadingData();
    this.showEmptyData = this.days.length <=0;


  },
  methods: {
    loadingData() {
      let promises;
      const rawObject = toRaw(this.days);


      rawObject.forEach((item, key) => {
        let keyID = item.day;
        promises = new PromiseClass(resolve => {
          this.cardChartIsLoading[keyID] = true;
          $.when(this.percentage = {value:keyID,total:rawObject.length-1}).then(()=>{
            this.$mysqlAsyncClass.getSalesDayInMonths(StaticsEnum.sales, keyID).then(rows => {
                this.chartDataJson[keyID] = [new DataJsonChartModel(toRaw(rows), keyID)];
                resolve(this.chartDataJson[keyID]);
              })

            })

        });
      });

     promises.then(v => {
       //console.log(v, 'vvvvvvvv');
        this.$mysqlAsyncClass.closeConnection();
        this.isMaxs = DataModel.getMax(toRaw(this.chartDataJson));
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