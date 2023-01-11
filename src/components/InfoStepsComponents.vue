<template>


  <div class="container-fluid" dir="ltr">
    <div class="row">
      <div class="col">
        <el-steps :active="active" align-center finish-status="success">
          <template v-for="(item, index) in itemSteps">
            <el-step :title="item"/>
          </template>
        </el-steps>

      </div>
    </div>
  </div>






</template>

<script>


export default {
  name : 'InfoStepsComponents',
  props:  {
    typeStep: {type:String,required:true},
  },

  data() {
    return {
      active   : 0,
      itemSteps: 0,
    };
  },
  mounted() {
    let countWeeks = this.$moment().weeksInYear();
    let countMonth = 12;
    let countDayInWeek = 7;
    let countDayMonth = 31;
    let typeStep = this.$props.typeStep.toLowerCase();
    //console.log(typeStep,'typeStep');
    this.$nextTick(() => {

      switch (typeStep) {

        case 'weeks':
          this.itemSteps = countWeeks;
          this.active =this.$moment().format('w')
          break;

        case 'dayinmonth':
          this.itemSteps = countDayMonth;
          this.active =this.$moment().format('D')
          break;

           case 'months':
          this.itemSteps = countMonth;
          this.active =this.$moment().format('M')
          break;


          case 'dayinweek':
          this.itemSteps = countDayInWeek;
          this.active =this.$moment().format('E')
            //console.log(this.$moment().format('E'),'(E)');
          break;
        default:
          this.itemSteps = 0;
          break;
      }

    });

 },

};
</script>

