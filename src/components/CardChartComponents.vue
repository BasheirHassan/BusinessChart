<template>



  <div :id="chartId" :data-hash="dataHash" class="card" style="height: 90%">
    <div class="card-header ">

      <div class="container-fluid align-content-center">
        <div class="row">
          <!--          Text Title-->

          <div class="col text-start text-truncate">
            <div class="row">
              <div class="col">

                <el-popover :width="200" trigger="hover" content="تصدير">
                  <template #reference>
                    <el-icon v-show="isVisableIcons"  role="button" color="green" @click="exportAs"><Download /> </el-icon>
                  </template>
                </el-popover>


                <el-tag v-show="isMaxs" class="ml-2" type="success">اعلى</el-tag>
                {{ cardTitle }}

              </div>

              <div class="col">
                <div class="col">
                  <!--          Sorted Date-->
                  <div v-show="isVisableSortedData" class="float-end">
                    <el-select v-model="valueSelectSorted" placeholder="اختيار طريقة العرض "
                               @change="updateSort($event)">
                      <el-option-group>
                        <el-option label=" فرز حسب اجمالي المبيعات" value="value" />
                      </el-option-group>
                      <el-option-group>
                        <el-option label=" فرز حسب اجمالي الكمية" value="tooltip" />
                      </el-option-group>
                    </el-select>

                  </div>
                  <div v-show="isVisableSortedData" style="direction: ltr" class="float-end">

                  </div>
                </div>

                <div class="col">
                  <!--          Sorted Date-->

                </div>


              </div>
            </div>

          </div>

          <!--          Icon-->
          <div v-show="isVisableIcons" class="col">



            <span v-for="item in chartTypeConst" v-show="item.isShow" :data-key="item.key" :class="item.css"
                  role="button" @click="changeChartType(item)">  </span>
          </div>


        </div>


        <slot></slot>
      </div>
    </div>

    <div aria-valuemax="100" aria-valuemin="0"
         aria-valuenow="0" class="chartProgessParent progress-bar progress-bar-striped progress-bar-animated"
         role="progressbar"></div>

    <div v-loading="isLoading" class="card-body" element-loading-text="تحميل .....">


      <div :class="'apexcharts-css vhh-95 ' +this.$GlobalBlurCss"></div>

    </div>
    <div v-show="isVisableFooter" class="card-footer text-muted">


      <div class="row  row-cols-auto footer-total float-start" v-show="isShwoTotalSelectedBar">&nbsp;
        <span class="text-right"> اجمالي المحدد : </span>
        <vue3-autocounter ref="counter" :pause="true" :startAmount="0" :endAmount="TotalSelectedBar" :duration="1"
                          separator="," decimalSeparator="." :decimals="2" :autoinit="true" />
      </div>


    </div>


  </div>
</template>

<script>
import AnyChartClass from "@/assets/tsModels/AnyChartClass";
import { chartTypeConst, exportTypeConst } from "@/assets/tsModels/StaticsAll";
import { toRaw } from "vue";
import { collect } from "collect.js";
import { typeNameChartEnum } from "../assets/tsModels/StaticsAll";
import Vue3Autocounter from "vue3-autocounter";
import $ from "jquery";

export default {

  name      : "CardChartComponents",
  props     : {
    cardTitle          : String,
    chartDataJson      : Object,
    chartId            : { type: String, required: true },
    dataHash           : null,
    isVisableFooter    : { type: Boolean, default: false },
    isVisableLoading   : { type: Boolean, default: true },
    isVisableIcons     : { type: Boolean, default: false },
    isVisableSortedData: { type: Boolean, default: false },
    isMaxs             : { type: Boolean, default: false },
    rotationLabelXaxis : { type: Number, default: 0 },
    showDataLabels     : { type: Boolean, default: true },
    // Setting AnyChart
    showLabels     : { type: Boolean, default: false },
    showLabelsXaxis: { type: Boolean, default: true },
    showLabelsYaxis: { type: Boolean, default: true },
    showLegend     : { type: Boolean, default: true },
    showXScroller  : { type: Boolean, default: false },
    typeChartBar   : { type: String, default: "column" },
    showPointsCount    : { type: Number, default: 0 },
    displayHeatMapRows    : { type: Number, default: 5 },
  },
  components: {
    Vue3Autocounter
  },
  data() {
    return {
      anyChartClass         : null,
      isLoading             : this.$props.isVisableLoading,
      blurCss               : "blur",
      valueSelectSorted     : null,
      chartTypeConst        : chartTypeConst,
      exportTypeConst       : exportTypeConst,
      valueZoom             : "",
      TotalSelectedBar      : 0,
      isShwoTotalSelectedBar: false
    };
  },

  watch: {
    chartDataJson(newVal, oldVal) {
      this.updateDataChart();
      this.isLoading = false;

    },
    isVisableLoading(newVal, oldVal) {
      this.isLoading = newVal;
    }
  },

  mounted() {

    let self = this;
    this.anyChartClass = new AnyChartClass({
      ChartID           : this.chartId,
      showLabels        : this.$props.showLabels,
      showLegend        : this.$props.showLegend,
      showLabelsYaxis   : this.$props.showLabelsYaxis,
      showLabelsXaxis   : this.$props.showLabelsXaxis,
      showDataLabels    : this.$props.showDataLabels,
      showXScroller     : this.$props.showXScroller,
      rotationLabelXaxis: this.$props.rotationLabelXaxis

    });

    let typeChartBar;
    if (!this.$props.typeChartBar) {
      typeChartBar = typeNameChartEnum.Column;
    } else {
      typeChartBar = this.$props.typeChartBar;
    }

    this.anyChartClass.typeChartBar = collect(chartTypeConst).where("type", typeChartBar).first();
    this.anyChartClass.displayHeatMapRows = this.$props.displayHeatMapRows;
    this.anyChartClass.callBackTotalSelectedBar = function(v) {
      // console.log(v);
      self.isShwoTotalSelectedBar = true;
      self.TotalSelectedBar = v;
    };

  },

  methods: {
    updateDataChart() {
      // console.log(toRaw(this.chartDataJson));
      if (toRaw(this.chartDataJson).length > 1) {
        $("[data-key='chartStackBar']").show();
       // console.log("More then 1");
      } else {
        $("[data-key='chartStackBar']").hide();
      }

      this.anyChartClass.appendSeries(toRaw(this.chartDataJson));
      this.setChartSelection();
    },
    updateSort(e) {
      this.isLoading = true;
      this.anyChartClass.reSorted(e);
      this.isLoading = false;
    },
    changeChartType(type) {
      console.log(type, "monteddd");

      this.isLoading = true;
      this.anyChartClass.changeChartType(toRaw(type));
      this.isLoading = false;
    },
    changeZoom() {
      let val = toRaw(this.valueZoom);

      if (!val) {
        return;
      }

      let start = this.$moment(val[0]).format("MM");
      let end = this.$moment(val[1]).format("MM");
      console.log(start, end);
      this.anyChartClass.addZoom(start, end);
    },


    exportAs(type) {

      var FileSaver = require("file-saver");
      var domtoimage = require("dom-to-image-more");

      let cardTitle= ` - (${this.$props.cardTitle}) - `;
      let name = document.title.replace('Business  Chart - ','');
      var querySelctor = document.querySelector(`#${this.chartId}>.card-body`);

      domtoimage.toPng(querySelctor).then(function(blob) {
        FileSaver.saveAs(blob, name + cardTitle + ".png");
      });

    },
    setChartSelection(){

      if (this.$props.showPointsCount>0){
        this.anyChartClass.setChartSelection(this.$props.showPointsCount);
      }


    }
  }

};
</script>


<style scoped>
.el-select {
  width: 300px;
}
</style>