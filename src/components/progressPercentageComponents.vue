
<template>
  <div v-show="percentageValue>0">
    <el-progress  :percentage="percentageValue || 0" :total-items="totalItems" type="circle" width="90"/>
  </div>
</template>
<script>

export default {
  name: 'progressPercentage',
  props: {
    totalItems: Number,
    percentage: Number,
  },
  data() {
    return {
      percentageValue: 0
    }
  },

  watch: {
    totalItems: {
      handler: function (val) {
        console.log(val, 'total Items')
        this.percentageCalc(val);
      },
      immediate: true,
    },
    percentage: {
      handler: function (val) {
        console.log(val, 'percentage Value')
        this.percentageCalc(val);
      },
      immediate: true,
    },
  },
  methods: {
    percentageCalc(value) {
      this.percentageValue = Math.round((100 * value) / this.totalItems);
    }
  }
};
</script>


