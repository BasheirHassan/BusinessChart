<template>
  <BackToTopComponents />

  <HelperComponents v-show="!showEmptyData" title-helper="معلومة">مثال:جلب حركة المنتج وترتيبها الاكثر حركة
  </HelperComponents>

  <EmptyDataComponents v-show="showEmptyData" />

  <div class="mb-3" style="direction: ltr" v-show="!showEmptyData">
    <el-pagination
      :page-size="pageSize"
      :total="totalItems"
      :background="true"
      layout="prev, pager, next, jumper"
      @current-change="setNextChunks"

    />
  </div>

  <div v-loading.fullscreen.lock="isLoading" >
    <el-row :gutter="20" element-loading-text="تحميل ...">
      <template v-for="(item,key) in dataJson">
        <el-col :span="6">
          <CollapseSyncComponents :card-title="item[0].it_name" tooltip-tilte="عدد منتجات" :key="key"
                                  :data-json="item" />
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
import { collect } from "collect.js";
import { toRaw } from "vue";

export default {
  name      : "SalesItemsMax",
  components: { CollapseSyncComponents, BackToTopComponents, HelperComponents, EmptyDataComponents },

  data() {
    return {
      dataJson     : [],
      isLoading    : true,
      showEmptyData: false,
      chunksItems  : [],
      pageSize     : 56,
      totalItems   : 0

    };
  },
  async mounted() {
    let items = await this.$mysqlAsyncClass.getItemsInDet();
    let itemsIDs = collect(items).pluck("it_id").toArray();
    this.chunksItems = collect(itemsIDs).chunk(56).toArray();
    this.totalItems = items.length;

    await this.setNextChunks(1);
  },

  methods: {
    initList(rows) {
      let allItems = [];
      let badgeColor = ["bg-primary", "bg-secondary", "bg-success", "bg-danger", "bg-warning", "bg-info"];
      collect(rows).map(item => {
        let cssRandom = badgeColor[Math.floor(Math.random() * badgeColor.length)];
        allItems.push(
          { "x": item.x, "value": item.value, "tooltip": item.tooltip, it_name: item.it_name, css: cssRandom });
      });

      return allItems;
    },

    initRow(chunks) {

      //console.log(toRaw(chunks), "chunksItems");
      this.isLoading = true;
      this.dataJson = [];
      let chunksRow = toRaw(chunks);
      this.$mysqlAsyncClass.getSalesItemAllByID(chunksRow).then(v => {

        let grouped = collect(v).sortBy('in_det_in_out_type').groupBy("it_id");
        grouped.each(async (item, key) => {
          this.dataJson.push(this.initList(item));
        });

        this.showEmptyData = v.length <= 0;
      }).catch(e => {
        console.log(e, "error");
      }).finally(() => {
        this.isLoading = false;
      });
    },
    async setNextChunks(pageID) {

      pageID = pageID - 1;
      //console.log(pageID, "pageID");
      //console.log(this.chunksItems.length, "this.chunksItems.length");

      if (pageID >= this.chunksItems.length) {
        return;
      }

      this.initRow(this.chunksItems[pageID]);

    }

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