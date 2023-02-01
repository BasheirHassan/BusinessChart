<template>

  <div class="card mb-3" :style="{ 'border-color':backgroundColor }">
    <div class="row g-0">

      <div class="col-md-4 d-flex justify-content-center d-flex align-items-center justify-content-center"
           :style="{ 'background-color':backgroundColor }">
        <el-icon size='60px'>
          <Money color='#ffffff'/>
        </el-icon>
      </div>
      <div class="col-md-8">
        <div class="card-body">

          <el-row :gutter="20">
            <el-col :span="8"> <h5 class="card-title text-truncate">{{ cardTitle }} </h5></el-col>
            <el-col :span="12"><div class="grid-content ep-bg-purple" />
              <h5 class="card-title text-truncate">
              <h5 :class="'card-text text-danger '  +this.$GlobalBlurCss " v-show='!isLoading'>
              <vue3-autocounter ref="counter" :pause="true" :startAmount="0" :endAmount="parseInt(dataBody)"
                                :duration="1"
                                separator="," decimalSeparator="." :decimals="0" :autoinit="true"/>
            </h5></h5></el-col>
            <el-col :span="4"><div class="grid-content ep-bg-purple" /><slot name="any"/></el-col>
            <el-skeleton :rows="0" animated :loading="isLoading"/>
          </el-row>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import Vue3Autocounter from "vue3-autocounter";


export default {

  name: 'CardBlockComponents',
  props: {
    cardTitle: String,
    dataBody: String,
    backgroundColor: {type: String, default: '#3E97FF'}
  },
  components: {
    Vue3Autocounter
  },
  data() {
    return {
      isLoading: true
    };
  },

  watch: {
    dataBody(newVal, oldVal) {
      this.isLoading = false;

    }
  }

};
</script>



