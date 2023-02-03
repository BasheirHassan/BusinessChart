<template>
  <BackToTopComponents/>

  <HelperComponents v-show="!showEmptyData" title-helper="معلومة">مثال:جلب حركة المنتج وترتيبها الاكثر حركة
  </HelperComponents>

  <EmptyDataComponents v-show="showEmptyData"/>

  <el-row :gutter="12">
    <el-col :span="24">
      <CardBlockComponents card-title='اجمالي عملاء' :data-body='totalItems' background-color='#03A9F4'>
        <template v-slot:any>
          <progress-percentage :percentage="percentage" :total-items="totalItems"/>
        </template>
      </CardBlockComponents>
    </el-col>
  </el-row>

  <el-row :gutter="20" element-loading-text="تحميل ..." v-loading.fullscreen.lock="isLoading">


    <template v-for="(item,key) in dataJson">
      <el-col :span="6">
        <CollapseSyncComponents :card-title="item[0].cu_name" :data-json="item"/>

      </el-col>
    </template>
  </el-row>

</template>

<script>
import CollapseSyncComponents from '@/components/CollapseSyncComponents.vue';
import BackToTopComponents from '@/components/BackToTopComponents.vue';
import HelperComponents from '@/components/HelperComponents.vue';
import EmptyDataComponents from '@/components/EmptyDataComponents.vue';
import {collect} from 'collect.js';
import ProgressPercentage from "@/components/progressPercentageComponents.vue";
import CardBlockComponents from "@/components/CardBlockComponents.vue";


export default {
  name      : 'salesCustomersMax',
  components: {BackToTopComponents, CollapseSyncComponents, HelperComponents, EmptyDataComponents,ProgressPercentage,CardBlockComponents},

  data() {
    return {
      dataJson     : [],
      isLoading    : true,
      showEmptyData: false,
      totalItems: 0,
      percentage: 0,
    };
  },

  async mounted() {
    let i=1;

    let customers = await this.$mysqlAsyncClass.getCustomers(['0', '1']);
    this.totalItems = customers.length;



    collect(customers).each(async (item, key) => {
      await this.initList(item);
      this.percentage = i;
      i++;
    });

    this.isLoading = false;
    this.showEmptyData = customers.length <= 0;

  },

  methods: {
    async initList(rows) {
      let allItems = [];
      let id = rows.cu_id;
      let name = rows.cu_name;
      let res = await this.$mysqlAsyncClass.getMaxSalesByCustomersID(id);


      if (res.length <= 0) {
        return;
      }

      collect(res).each(item => {
        allItems.push({'x': item.in_type_name, 'value': item.value, 'tooltip': item.tooltip, 'cu_name': name});
      });

      this.dataJson.push(allItems);

    },
  },
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

</style>