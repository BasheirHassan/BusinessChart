/**
 *
 *
 *
 *
 *
 *
 */

/**
 * انواع الفواتير
 */

export enum StaticsEnum {
  category = "category",
  datetime = "datetime",
  numeric = "numeric",
  sales = "102",
  purchases = "105",
}


/**
 * فصول السنة
 */
export const StaticsSeasons = [
  {
    name: "winter",
    title: "شتاء",
    value: ["12", "1", "2"]
  }, {
    name: "spring",
    title: "ربيع",
    value: ["3", "4", "5"]
  }, {
    name: "summer",
    title: "صيف",
    value: ["6", "7", "8"]
  }, {
    name: "fall",
    title: "خريف",
    value: ["9", "10", "11"]
  }];


export enum typeNameChartEnum {
  Line = "line",
  Column = "column",
  StackedBar = "stackedbar",
  Area = "area",
  Pie = "pie",
  heatMap = "heatMap"
}


/**
 * انواع الشارت
 */
export const chartTypeConst = [
  {
    type: typeNameChartEnum.Line,
    css: "chartLine",
    key: "chartLine",
    prop: "",
    isShow: true
  },
  {
    type: typeNameChartEnum.Column,
    css: "chartColumn",
    key: "chartColumn",
    prop: "",
    isShow: true
  },
  {
    type: typeNameChartEnum.Column,
    css: "chartStackBar",
    key: "chartStackBar",
    prop: typeNameChartEnum.StackedBar,
    isShow: true
  },
  {
    type: typeNameChartEnum.Area,
    css: "chartArea",
    key: "chartArea",
    prop: "",
    isShow: true
  }
  ,
  {
    type: typeNameChartEnum.Pie,
    css: "pie",
    key: "pie",
    prop: "",
    isShow: false
  }
  ,
  {
    type: typeNameChartEnum.heatMap,
    css: "pie",
    key: "pie",
    prop: "",
    isShow: false
  }


];


export const exportTypeConst = [
  {
    title:'Pdf',
    type: "pdf"
  },
  {
    title:'Svg',
    type: "svg"
  },
  {
    title:'Png',
    type: "png"
  },
  {
    title:'Jpg',
    type: "jpg"
  },
  {
    title:'Xlsx',
    type: "xlsx"
  }



];


