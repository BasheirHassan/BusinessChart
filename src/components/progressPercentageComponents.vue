<template>
    <el-progress :percentage="percentageValue || 0" :total-items="totalItems" type="circle" width="90" />
</template>

<script>

export default {
  name: 'progressPercentage',
  props: {
    totalItems: Number,
    percentage: Number,
  },
data(){
    return{
      percentageValue:0
    }
},

  watch: {
    totalItems: {
      handler: function (val) {
          this.percentageCalc(val);
      },
      immediate: true,
    },
    percentage: {
      handler: function (val) {
        console.log(val,'VVVVVV')
          this.percentageCalc(val);
      },
      immediate: true,
    },
  },
  methods: {
    percentageCalc(partialValue) {

      this.percentageValue = Math.round((100 * partialValue) / this.totalItems);
    }
  }
};
</script>


