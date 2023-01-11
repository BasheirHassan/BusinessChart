<template>


  <el-row class='vh-100'>
    <el-col :span='24'>
      <CardChartComponents
        :is-visable-loading='cardChartIsLoading'
        :is-visable-footer='true'
        :is-visable-icons='isVisibleIcons'
        card-title='مشتريات حسب مبلغ الفاتورة'
        :chart-data-json='chartDataJson'
        :display-heat-map-rows='20'
        :is-visable-sorted-data='isVisibleIcons'
        type-chart-bar='heatMap'
        :show-x-scroller='false'
        :show-points-count='0'
        chart-id='chartID' />
    </el-col>
  </el-row>

</template>

<script>
import CardChartComponents from '@/components/CardChartComponents.vue';
import { StaticsEnum } from '@/assets/tsModels/StaticsAll';
import { collect } from 'collect.js';

export default {
  name      : 'purchaseMoneyTop',
  components: { CardChartComponents },

  data() {
    return {
      chartDataJson     : null,
      cardChartIsLoading: false,
      isVisibleIcons    : false
    };
  },

  mounted() {
    let self = this;
    this.cardChartIsLoading = true;

    this.$nextTick(() => {
      this.$mysqlAsyncClass.getInvoicesAll(StaticsEnum.purchases).then(rows => {
        let coll = collect(rows).groupBy(item => parseInt(item.value));

        console.log(coll,'coll');

        let dataMap = [];
        let xxx = 0;
        let yyy = 0;

        coll.each((item,key) => {

          if (xxx > 20) {
            xxx = 0;
            yyy++;
          }

          let cc = collect(item).count();
          dataMap.push({ x: xxx, y: yyy, value: cc,title:key+"\n"+": مبلغ " });
          xxx++;
        });

        console.log(dataMap);
        self.chartDataJson = dataMap;
        this.cardChartIsLoading = false;
      });
    });

  }

};
</script>

<style scoped>
.el-row {
  margin-bottom: 10px;
}
</style>