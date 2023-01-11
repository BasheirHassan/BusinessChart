<template>
  <CardComponents :card-title="cardTitle">



    <template v-slot:slotTotal >

      <div v-show='isTotal && total >0'>
        <vue3-autocounter class='badge bg-info'   :pause="true" :startAmount="0" :endAmount="parseInt(total)" :duration="1"
                          separator="," decimalSeparator="." :decimals="0" :autoinit="true" />
      </div>

    </template>
    <EmptyDataComponents v-show="showEmptyData"/>
    <el-skeleton :rows="10" animated :loading="loading"/>
    <TransitionGroup name="list" tag="ul" class="list-group list-group-flush pb-5">
      <li v-for="(item,key) in dataItems" :key="key"
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

            <span :class="{'badge bg-primary rounded-pill ': item.value > 0, ' badge bg-danger rounded-pill': item.value <= 0 }"> {{ fixedNumber(item.value)  }}</span>
          </template>
        </el-popover>


      </li>
    </TransitionGroup>

    <template v-slot:collapseBtn>
      <el-icon v-show="ShowExpandIcon" ref="myBtn" role="button" @click="moreData" data-bs-toggle="collapse"
               data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
        <ArrowDownBold/>
      </el-icon>
    </template>

  </CardComponents>

</template>

<script>
import CardComponents from './CardComponents.vue';
import {toRaw} from 'vue';
import EmptyDataComponents from './EmptyDataComponents.vue';
import {collect} from 'collect.js';
import Vue3Autocounter from 'vue3-autocounter';

export default {
  props: {
    dataJson : Object,
    cardTitle: { type   : String, default: null},
    limitShow   : { type   : Number,  default: 5 },
    isImmediate   : { type   : Boolean,  default: false },
    tooltipTilte: String,
    appendTitle: String,
    isTotal: {type:Boolean,default:false},
  },

  name      : 'CollapseComponents',
  data() {
    return {
      loading       : true,
      showEmptyData : false,
      dataItems     : [],
      total     : 0,
      chunkItems    : [],
      ShowExpandIcon: false,
      isExpaned     : false,
    };
  },


  components: {
    EmptyDataComponents,
    CardComponents,
    Vue3Autocounter
  },
  watch     : {
    dataJson: {
      handler  : function(val) {
        //console.log('watch', val)
        this.getDataJson();
      },
    },

  },
  methods   : {
    getDataJson() {
      this.loading = false;
      this.$props.cardTitle = this.cardTitle;
      this.showEmptyData = toRaw(this.dataJson).length <= 0;
      let rowData = toRaw(this.dataJson);
      if (rowData.length > this.$props.limitShow) {
        this.ShowExpandIcon = true;
      }

      //console.log(rowData,'rowData');
      if (this.$props.isTotal){
        this.total =collect(rowData).sum('value');
      }

      let chunkItems = collect(rowData).slice(0, this.$props.limitShow);

      let time = 0;
      chunkItems.each(item => {
        setTimeout(() => {
          this.dataItems.push(item);
        }, time);
        time = time + 200;
      });
    },
    moreData() {
      let rowData = toRaw(this.dataJson);
      let time = 0;

      if (this.isExpaned) {

        collect(rowData).slice(this.$props.limitShow, rowData.length).each((item, key) => {
          setTimeout(() => {
            let index = this.dataItems.indexOf(item);
            this.dataItems.splice(index, 1);
          }, time);
          time = time + 50;
        });
        this.isExpaned = false;
        return;
      }

      this.isExpaned = true;
      collect(rowData).slice(this.$props.limitShow, rowData.length).each(item => {
        setTimeout(() => {
          this.dataItems.push(item);
        }, time);
        time = time + 50;
      });
    },
    fixedNumber(n) {
      let num = 0;
      try {
        num = this.$Numbro(n).format({mantissa: 2});
      } catch (e) {
        console.warn(n,e);
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
