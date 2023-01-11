<template>


  <div class="container-fluid pb-2 g-0"  >
    <div class="row">
      <div class="col-3" v-for="item in dataJson">
        <div role="button" v-on:click="scrollPageTo(`${item.index}`)" class="chip">
          {{ item.title }}
          <div class="card-text d-sm-inline-block p-1" >
            <vue3-autocounter ref='counter' :pause="true" :startAmount='0' :endAmount='item.total' :duration='1'
                              separator=',' decimalSeparator='.' :decimals='2' :autoinit='false'/>
          </div>
          <el-icon v-show="item.index" color="green">
            <DCaret/>
          </el-icon>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import {toRaw} from 'vue';
import CardComponents from './CardComponents.vue';
import $ from 'jquery';
import Vue3Autocounter from 'vue3-autocounter';

export default {
  name      : 'InfoDataMaxComponents',
  components: {CardComponents, Vue3Autocounter},
  props     : {
    dataJson: String,
    isStart : {type: Boolean, default: false},
  },

  watch     : {
    dataJson(newData, oldData) {
      if (newData) {
        //console.log(toRaw(newData), 'InfoDataMaxComponents');
        this.$props.dataJson = newData;

        this.$nextTick(() => {
          let refs = this.$refs.counter;
          refs.forEach(ref => {
            ref.reset();
            ref.start();
          });
        });

      }
    }
  },
  methods   : {
    scrollPageTo(el) {
      let selector = $(`div[data-hash="${el}"] > .card-header`);
      //console.log(selector, 'selector ');
      if (selector.length > 0) {
        $('html').animate({
          scrollTop: $(selector).offset().top,
        }, function() {

          $(selector).addClass('highlight');

          setTimeout(() => {
            $(selector).removeClass('highlight');
          }, 6000);

        });
      } else {
        console.warn('not Find ' + selector);
      }
    },
  },

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