<template>
  <CardComponents :card-title="cardTitle">

    <EmptyDataComponents v-show="showEmptyData"/>
    <el-skeleton :rows="10" animated :loading="loading"/>
    <TransitionGroup name="list" tag="ul" class="list-group list-group-flush pb-5">
      <li v-for="item in dataItems" :key="item"
          class="list-group-item d-flex justify-content-between align-items-start">
        <div class="ms-2 me-auto text-truncate">
          <div class="text-truncate"><el-icon color="#79bbff"><CollectionTag /></el-icon> <el-space/>{{appendTitle}}{{ item.x }}</div>
        </div>
        <el-popover
            placement="bottom"
            :title="tooltipTilte"
            :width="100"
            trigger="hover"
            :content="fixedNumber(item.tooltip)"
        >
          <template #reference>
            <span :class="'badge bg-primary rounded-pill ' + item.css " >{{ fixedNumber(item.value) }}</span>
          </template>
        </el-popover>
      </li>

    </TransitionGroup>
  </CardComponents>


</template>

<script>
import CardComponents from './CardComponents.vue';
import Numbro from 'numbro';
import {toRaw} from 'vue';
import EmptyDataComponents from './EmptyDataComponents.vue';

export default {
  props: {
    dataJson    : Object,
    cardTitle   : {
      type   : String,
      default: null,
    },
    tooltipTilte: String,
    appendTitle: String,
  },

  data() {
    return {
      loading      : true,
      showEmptyData: false,
      dataItems    : [],
    };
  },
  name      : 'CollapseSyncComponents',
  components: {
    EmptyDataComponents,
    CardComponents,
  },
  watch     : {
    dataJson: {
      handler  : function(val) {
       //console.log('watch', val)
        this.getDataJson();
      },
      immediate: true,
    },
  },
  methods   : {
    getDataJson() {
      this.loading = false;
      this.$props.cardTitle = this.cardTitle;
      this.showEmptyData = toRaw(this.dataJson).length <= 0;
      //console.log( toRaw(this.dataJson), 'CardTitle');
      let time = 0;
      toRaw(this.dataJson).forEach(item => {
        setTimeout(() => {
          this.dataItems.push(item);
        }, time);
        time = time + 200;
      });
    },
    fixedNumber(n) {
      //console.log(n, 'nnn');
      let num = 0;
      try {
        num = this.$Numbro(n).format({mantissa: 2});
      } catch (e) {
        console.log(e);
      }
      return num;
    },
  },
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>