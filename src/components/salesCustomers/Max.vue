<template>
  <BackToTopComponents/>

  <HelperComponents v-show="!showEmptyData" title-helper="معلومة">مثال:جلب حركة المنتج وترتيبها الاكثر حركة
  </HelperComponents>

  <EmptyDataComponents v-show="showEmptyData"/>

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


export default {
  name      : 'salesCustomersMax',
  components: {BackToTopComponents, CollapseSyncComponents, HelperComponents, EmptyDataComponents},

  data() {
    return {
      dataJson     : [],
      isLoading    : true,
      showEmptyData: false,
    };
  },

  async mounted() {
    let customers = await this.$mysqlAsyncClass.getCustomers(['0', '1']);

    collect(customers).each((item, key) => {
      this.initList(item);
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