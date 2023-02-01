<template>
    <el-progress :percentage="percentageValue" :total-items="totalItems" type="circle" width="90" />
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


<style>
@keyframes highlight {
  0% {
    background: rgba(0, 128, 0, 0.52);

  }

  50% {
    background: rgba(0, 128, 0, 0.53);
    border-color: rgba(0, 128, 0, 0.53);
  }


  100% {
    background: none;
  }
}

.highlight {
  animation-duration: 3s;
  animation-name: highlight;
  animation-iteration-count: 2;
  animation-direction: alternate;
}

.chip {
  display: inline-block;
  padding: 0 25px;
  height: 50px;
  line-height: 50px;
  border-radius: 25px;
  background-color: rgba(241, 241, 241, 0.97);
}


</style>