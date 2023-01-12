<template>

  <div class='tip custom-block position-relative'>
    <div role='button' v-show="yotubeUrls !=''" ref='yotBtn' @click='openUrl(yotubeUrls)' class='youtubeIcon'></div>

    <p role='button' class='custom-block-title text-start' @click='show =!show '> {{ titleHelper }}
      <Location color='#606266' style='width: 1em; height: 1em; margin-right: 8px' />
    </p>

    <Transition>
      <div v-if='show '>
        <p class='text-start blockquote-footer' v-for='item in solts'>
          {{ item }}
          <Star color='#409EFFFF' style='width: 1em; height: 1em; margin-right: 8px' />
        </p>
      </div>
    </Transition>


  </div>


</template>

<script>
import $ from 'jquery';
import { collect } from 'collect.js';

export default {
  name : 'HelperComponents',
  props: {
    titleHelper     : String,
    progresPercinteg: Object
  },

  data() {
    return {
      solts         : null,
      show          : false,
      percentage    : 0,
      isShowprogress: true,
      yotubeUrls    : ''
    };
  },
  mounted() {

    this.$nextTick(() => {
      try {
        this.solts = this.$slots.default().map(vnode => {
            return vnode.children;
          }
        );
      } catch (e) {
        console.log(e);
      }
      this.findHelpUrl();
    });
  },

  watch: {
    progresPercinteg: {
      async handler(val) {
        // console.log(val,'newss');
        this.clacPercentage(val);

      }
    }
  },

  methods: {
    clacPercentage(data) {

      this.percentage = (100 * data.value) / data.total;
      //console.log(data, 'progres PercintegsXX');

      $('.progress-bar').width(this.percentage + '%');
      //data.cb();
      //
      // if (data.total === data.value -1 ){
      //   this.isShowprogress = false;
      // }else {
      //   this.isShowprogress = true;
      // }
    },
    sleep(ms) {
      return new Promise((r) =>
        setTimeout(r, ms));
    },
    findHelpUrl() {
      // this.$refs.yotBtn.onclick = window.open("yotubeUrls",'_blank');
      console.log(this.$route, ' this.$route');

      let routeName = collect(this.$route);
      let meta = routeName.get('meta');
      let helpUrl = collect(meta).has('helpUrl');
      if (helpUrl) {
        let val = collect(meta).get('helpUrl');
        if (collect(val).isNotEmpty() && val !== '') {
          console.log(helpUrl, '  routeNamerouteName Find');
          this.yotubeUrls =  collect(meta).get('helpUrl');
        }

      }

    },
    openUrl(u) {
      console.log(this.yotubeUrls);
      if (this.yotubeUrls !==""){
        require('electron').shell.openExternal(this.yotubeUrls);

      }

    }

  }

};
</script>

<style scoped>
.custom-block.tip {
  padding: 8px 16px;
  background-color: #ecf5ff;
  border-radius: 4px;
  border-left: 5px solid var(--el-color-primary);
  margin: 20px 0;
}

.custom-block .custom-block-title {
  font-weight: 700;
}


.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;

}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.progressInfo {
  margin: 0;
}

</style>