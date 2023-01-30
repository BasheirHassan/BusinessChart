<template>



  <div class="container-fluid" dir="ltr">
    <div class="row">
      <div class="col">
        <el-steps :active="active" align-center finish-status="success">
          <template v-for="(item, index) in itemSteps">
            <el-step    :title="item.title || item.ID "  :status='statUsElSteps[item.ID]?.status'/>
          </template>
        </el-steps>

      </div>
    </div>
  </div>






</template>

<script>


import { reactive, ref, toRaw } from 'vue';
import { collect } from 'collect.js';
import DayNameAr from '@/assets/tsModels/DayNameAr';



export default {
  name : 'InfoStepsComponents',
  props:  {
    typeStep: {type:String,required:true},
    dataStep: {type:Object,required:false},
  },
  setup: () => {
    const statUsElSteps = ref([]);
    return { statUsElSteps };
  },

  data() {
    return {
      active   : 0,
      itemSteps: 0,
    };
  },
  watch: {
    dataStep: {
      handler(newValue, oldValue) {
        // Note: `newValue` will be equal to `oldValue` here
        // on nested mutations as long as the object itself
        // hasn't been replaced.
        if (newValue){
          toRaw(newValue).forEach(element => {
            // console.log(element.numberID,'newValue.month');
            this.statUsElSteps[element.numberID] = {"status":"success"}
          });

          // console.log(this.statUsElSteps,'statUsElSteps');
        }
      },
      deep: true
    }
  },
  mounted() {

    // console.log(this.$props.dataStep,'Data Set');
    const countWeeks = this.$moment().weeksInYear();
    const countMonth = 12;
    const countDayInWeek = 7;
    const daysOfWeek = collect(["Saturday","Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
    const countDayMonth = 31;
    let typeStep = this.$props.typeStep.toLowerCase();
    //console.log(typeStep,'typeStep');
    // console.log(this.$moment().daysInMonth(),'typeStep');
    this.$nextTick(() => {

      switch (typeStep) {

        case 'weeks':

          this.itemSteps = this.creatArrayByTotal(countWeeks).map(item=>{
            return {ID:item,status:"success"}
          });

          break;

        case 'dayinmonth':
          this.itemSteps =this.creatArrayByTotal(countDayMonth).map(item=>{
            return {ID:item,status:"error"}
          });

          break;

        case 'months':
             console.log(countMonth);
          this.itemSteps = this.creatArrayByTotal(countMonth).map(item=>{
            return {ID:item,status:"success"}
          });
          break;


          case 'dayinweek':
          this.itemSteps = daysOfWeek.map(item=>{
            return {ID:item,status:"success","title":DayNameAr(item)}
          });

          break;
        default:
          this.itemSteps = 0;
          break;
      }

    });

 },
  methods:{
    isSetInData(k){
      let keys = toRaw(this.$props.dataStep);
      let getX = collect(keys).where('month',k.toString());
      if (getX.count()>0){
        return 'error'
      }else {
        return 'success'
      }
    },creatArrayByTotal(t){
      let item=[];
      for (let i = 0; i < t; i++) {
        item.push(i+1)
      }
      return collect(item);
    }
  }

};
</script>

