<template>
  <div id="loading" dir="rtl">
    <treeselect :options="options" :load-options="loadOptions" :auto-load-root-options="false" v-model="value"
                @select="inputChanged" @deselect="inputChanged" valueFormat="object" loadingText="تحميل ....."
                noOptionsText="فارغ ...." noChildrenText="لايوجد منتجات" :show-count="true"
                placeholder="قم تحديد المنتج....." :multiple="true" :disable-branch-nodes="false"
                :default-expand-level="defaultExpandLevel"
                :value-consists-of="valueConsistsOf" dir="rtl">' +
      <div slot="value-label" slot-scope="{ node }"><label class="d-inline-block">{{ node.raw.name }}<span
        class="vue-treeselect__icon-loader tree-select-loading inline"></span>
      </label></div>
    </treeselect>
  </div>
</template>

<script>
import { Treeselect, LOAD_ROOT_OPTIONS } from "vue3-treeselect";
import "vue3-treeselect/dist/vue3-treeselect.css";
import { collect } from "collect.js";

const { arrayToTree } = require("tree-with-array");

export default {
  // register the component
  props     : {
    isInvoiceOrItems: {
      type   : Object,
      default: "invoice"
    }
  },
  name      : "TreeComponent",
  components: {
    Treeselect
  },

  data() {
    return {
      value             : null,
      options           : null,
      valueConsistsOf   : "LEAF_PRIORITY",
      defaultExpandLevel: 0
    };
  },

  methods: {
    inputChanged(node, it) {
      this.$nextTick(() => {
        //console.log('inputChanged',this.value);
        this.$emit("selectItems", this.value);
      });

    },
    async loadOptions({ action, callback }) {
      let self = this;
      let typeTree = this.$props.isInvoiceOrItems;

      if (action === LOAD_ROOT_OPTIONS) {

        switch (typeTree) {
          case "invoice":
            self.$mysqlAsyncClass.getInvoiceType().then(function(rows) {

              self.options = collect(rows).map((item) => {
                return { "id": item.in_type_id, "in_type_const": item.in_type_const, "label": item.in_type_name };
              }).all();

              callback();
            });

            break;
          case "items":
            let rowsParent = await self.$mysqlAsyncClass.getItemClass();
            let rowsCh = await self.$mysqlAsyncClass.getItems();
            let mereg = collect(rowsParent).merge(rowsCh).all();
            self.options = arrayToTree(mereg, {
              idKey : "id",
              pIdKey: "pid"
            });

            callback();

            break;

          case "customers":

            let customers = await this.$mysqlAsyncClass.getCustomers(["0", "1"]);

            let newCustomers = collect(customers);
            newCustomers.prepend({ id: "1", label: "موردين" });
            newCustomers.prepend({ id: "0", label: "عملاء" });


            const custeomerTree = arrayToTree(newCustomers.all(), {
              idKey : "id",
              pIdKey: "pid"
            });
            this.defaultExpandLevel = 1;
            self.options = custeomerTree;
            callback();
            break;

        }

      }

    }
  }
};
</script>
