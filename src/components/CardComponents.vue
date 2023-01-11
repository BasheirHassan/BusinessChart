<template>
  <div class="card" style="height: 90%;">

    <div class="card-header">


      <span class="text-truncate">{{ cardTitle }}</span>
      <slot name="slotTotal"/>
      <slot name="collapseBtn"/>

    </div>
    <div :class="'card-body ' +this.$GlobalBlurCss ">
      <slot></slot>
    </div>
    <div v-show="isVisableFooter" class="card-footer text-muted">
      {{ footer }}
    </div>
  </div>
</template>

<script>

export default {

  name : 'CardComponents',
  props: {
    cardTitle      : String,
    isLoading      : {
      type   : Boolean,
      default: false,
    },
    isVisableFooter: {
      type   : Boolean,
      default: false,
    },
    chartDataJson  : {
      type   : Object,
      default: null,
    },
    footer         : String,
  },

};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.box-card {
  width: 100%;
}
</style>
