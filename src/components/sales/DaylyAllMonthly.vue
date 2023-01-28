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
import {ElNotification} from 'element-plus';
import {toRaw} from 'vue';
import PromiseClass from '@/assets/tsModels/PromiseClass';
import DataModel from '@/assets/tsModels/DataModel';

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
      percentage: {}
    };
  },

  async mounted() {

    await this.$mysqlAsyncClass.getAllMonths(StaticsEnum.sales).then(rows => {
      console.log(rows, 'this.month');
      this.month = rows;
      this.loadingData();
      this.showEmptyData = this.month.length <= 0;
      console.log(this.showEmptyData,'showEmptyData')
    }).catch(err => {
      console.log(err);
      this.showEmptyData=true
    });

  },
  methods: {
    loadingData() {
      let promises;
      const rawObject = toRaw(this.month);
      rawObject.forEach(item => {
        let keyID = item.month;

        promises = new PromiseClass(resolve => {
          this.$mysqlAsyncClass.getSalesDayInMonthly(StaticsEnum.sales, keyID).then(rows => {
            this.cardChartIsLoading[keyID] = false;
            this.chartDataJson[keyID] = [new DataJsonChartModel(toRaw(rows), keyID)];
            resolve(true);

          })
        })
      });
      promises.then(v => {
        //console.log(v, 'vvvvvvvv');
        //this.$mysqlAsyncClass.closeConnection();
        if (!v.length) return;
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

.hDiv {
  height: 600px;
}
</style>