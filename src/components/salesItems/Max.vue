<template>
  <BackToTopComponents/>

  <HelperComponents v-show="!showEmptyData" title-helper="معلومة">مثال:جلب حركة المنتج وترتيبها الاكثر حركة
  </HelperComponents>

  <EmptyDataComponents v-show="showEmptyData"/>


  <el-row :gutter="12">
    <el-col :span="24">
      <CardBlockComponents card-title='اجمالي منتجات' :data-body='totalItems' background-color='#03A9F4'>
        <template v-slot:any>
          <progress-percentage :percentage="percentage" :total-items="totalItems"/>
        </template>
      </CardBlockComponents>
    </el-col>
  </el-row>


  <div v-loading.fullscreen.lock="isLoading">
    <el-row :gutter="20" element-loading-text="تحميل ...">
      <template v-for="(item,key) in dataJson">
        <el-col :span="6">
          <CollapseSyncComponents :card-title="item[0].it_name" tooltip-tilte="عدد منتجات" :key="key"
                                  :data-json="item"/>
        </el-col>
      </template>
    </el-row>
  </div>


</template>

<script>
import CollapseSyncComponents from "@/components/CollapseSyncComponents.vue";
import BackToTopComponents from "@/components/BackToTopComponents.vue";
import HelperComponents from "@/components/HelperComponents.vue";
import EmptyDataComponents from "@/components/EmptyDataComponents.vue";
import {collect} from "collect.js";
import {toRaw} from "vue";
import {StaticsEnum} from "@/assets/tsModels/StaticsAll";
import DataJsonChartModel from "@/assets/tsModels/DataJsonChartModel";
import ProgressPercentage from "@/components/progressPercentageComponents.vue";
import CardBlockComponents from "@/components/CardBlockComponents.vue";

export default {
  name: "SalesItemsMax",
  components: {
    CardBlockComponents,
    ProgressPercentage, CollapseSyncComponents, BackToTopComponents, HelperComponents, EmptyDataComponents
  },

  data() {
    return {
      dataJson: [],
      isLoading: true,
      showEmptyData: false,
      chunksItems: [],
      pageSize: 56,
      totalItems: 0,
      percentage: 0,
    };
  },
  async mounted() {
    this.isLoading = false;
    let promiseAll = [];

    this.$mysqlAsyncClass.getItemsInDetByMax(StaticsEnum.sales).then(async rows => {
      this.totalItems = rows.length;
      for (let i = 0; i < rows.length; i++) {
        promiseAll[i] = await this.PromiseMe(rows[i], i);
        this.percentage = i+1;
      }

      if (rows.length <= 0) {
        this.showEmptyData = true;
      }

      Promise.all(promiseAll).then((values) => {
        console.log('Finshhhhhh', values);
      });

    }).catch(err => {
      console.log(err);
      this.showEmptyData = true
    });


  },

  methods: {
    PromiseMe(r, id) {
      let keyID = r.it_id;
      let self = this;
      return new Promise((res, rej) => {
        this.$mysqlAsyncClass.getSalesItemAllByID([keyID]).then(async rows => {
          self.chartDataJson = [new DataJsonChartModel(toRaw(rows), id)];
          let resultList = await this.initList(rows);
          self.dataJson.push(resultList);
          res(this.chartDataJson);
        });
      });

    },


    async initList(rows) {
      let allItems = [];
      let badgeColor = ["bg-primary", "bg-secondary", "bg-success", "bg-danger", "bg-warning", "bg-info"];
      await collect(rows).map(item => {
        let cssRandom = badgeColor[Math.floor(Math.random() * badgeColor.length)];
        allItems.push({
          "x": item.x,
          "value": item.value,
          "tooltip": item.tooltip,
          it_name: item.it_name,
          css: cssRandom
        });
      });
      return allItems;
    },


  }
};
</script>

<style scoped>
.el-row {
  margin-bottom: 10px;
}

.el-backtop {
  background: lightsteelblue;
  height: 50px;
  width: 50px;
}

.infinite-list-wrapper {
  height: 300px;
  text-align: center;
}

.infinite-list-wrapper .list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.infinite-list-wrapper .list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}

.infinite-list-wrapper .list-item + .list-item {
  margin-top: 10px;
}
</style>