/**
 *  تهىذة الشارات
 * @param json
 * @param chartName
 * @param typeChat نوع
 * @param h عرض
 */

// Add gitHub Actionsss

import DataJsonChartModel from "@/assets/tsModels/DataJsonChartModel";
import {chartTypeConst, typeNameChartEnum} from "@/assets/tsModels/StaticsAll";
import collect from 'collect.js';
import Numbro from "numbro";


const uniqueId = require('lodash.uniqueid');
const anychart = require('anychart');
const Tafgeet = require('tafgeetjs');
const $ = require('jquery');


export default class AnyChartClass {

    private chartID: any;
    private chartBody: any;
    private chartObject: any;               //SVG Object
    public  typeChartBar:any ;
    private dataJsonCharts = Array<DataJsonChartModel>();
    private isInited = false;
    private showLegend: any;            // عرض ايام الشهر او المسمى السفلي
    private showDataLabels: any;
    private showLabelsYaxis: any;
    private showLabelsXaxis: any;       // عرض التاريخ  اسفل العمود البار
    private rotationLabelXaxis: number;
    private showXScroller: any;
    private unqID:any;
    private mapAsFormat = {'x': 'x', 'value': 'value'};
    private showTooltip:boolean = true;
    public callBackTotalSelectedBar=null;
    public displayHeatMapRows=5;                // عرض عدد المربعات في الهيت ماب


    /**
     * config Chart
     * @private
     */
    private dataSetsArray:any;
    private mapAsArray:any;

    constructor({  ChartID = 'ChartID', showLegend = false, showLabelsYaxis = false, showLabelsXaxis = false,  showDataLabels = false,  showXScroller = true,  rotationLabelXaxis = 0}) {
        this.showLegend = showLegend;
        this.showLabelsYaxis = showLabelsYaxis;
        this.showLabelsXaxis = showLabelsXaxis;
        this.showDataLabels = showDataLabels;               // عرض نتائج القيم اعلى العمود
        this.showXScroller = showXScroller;
        this.rotationLabelXaxis = rotationLabelXaxis;
        this.chartID = $(`#${ChartID}`);
        this.chartBody = this.chartID.find('.apexcharts-css');
        this.unqID = uniqueId('chart-container-').toString();
    }



    private initChart() {
        let self = this;
        if (self.isInited) {
            return;
        }
        let obj = $(self.chartID).attr('id');
        if (obj === undefined) {
            console.error(`Error get Object`, obj, this.chartID);
        }

        $(self.chartBody).attr('id', this.unqID);
        self.dataJsonCharts = [];
        self.chartObject = anychart.cartesian();
        self.chartObject.defaultSeriesType(this.typeChartBar.type);
        self.configPieChart(self.chartObject)
        self.configAnyChartType(self.chartObject);
        self.chartObject.draw();
        self.addEventListenerResize();
        self.isInited = true;
        self.addEventSelector();
        self.chartObject.yAxis().orientation("right");
        self.chartObject.yMinorGrid().enabled(true);

    }


    /**
     * عرض اجمالي المحدد
     */
    addEventSelector(){
        let self= this;
        let selItem:any=[];

        self.chartObject.listen('pointsSelect', (e:any)=> {
                // @ts-ignore
            let total=[];
            e.points.forEach((item:any)=>{
                total.push({value:item.get('value')})
                let index = item.getIndex();
                let series = item.getSeries();
                let seriesIndex = series.getIndex();
                self.mapAsArray[seriesIndex].set(index,'selected',{marker:{enabled:true, type:"star5", fill:"gold", size:10, offsetY: -10}});
                selItem.push({itemIndex:index,seriesIndex:seriesIndex})
            })
            // @ts-ignore
            let sum = collect(total).sum("value");

                if(typeof self.callBackTotalSelectedBar === "function"){
                    // @ts-ignore
                    self.callBackTotalSelectedBar(sum);
                }

        });



    }




    private configAnyChartType(chartObject: any) {
        let self = this;
        chartObject.maxPointWidth("10%");
        chartObject.yAxis().enabled(self.showLabelsYaxis);
        chartObject.xAxis().enabled(self.showLabelsXaxis);
        chartObject.xAxis().labels().rotation(self.rotationLabelXaxis);
        chartObject.xAxis().labels().width(100);
        chartObject.xAxis().labels().textOverflow('....');
        chartObject.xScroller(self.showXScroller);

        self.addEventListenerResize();
        chartObject.xScroller().autoHide(true);
        // let xZoom = chartObject.xZoom();
        // xZoom.setToPointsCount(5);

        // enable the scroller



    }


    /**
     * تحديد عدد الاعمدة الضاهرة
     * @param count
     */
    setChartSelection(count:number){
        this.chartObject.xScroller(true);
        this.chartObject.xZoom().setToPointsCount(count, true);
        console.log('configAnyChartType');
    }



    private configPieChart(chartObject:any) {
//        console.log(chartObject, 'chartObject');
        let self = this;
        // اكبر عرض للعود


        chartObject.legend().useHtml(true);
        chartObject.legend().tooltip().enabled(true);
        chartObject.legend().position('bottom');
        chartObject.legend().itemsSpacing(5);
        chartObject.legend().paginator();



        /**
         * الليقند  الخاص بالتسمية من اسفل شهر او اسم المادة
         */

        chartObject.legend().tooltip().useHtml(true);
        chartObject.legend().tooltip().format((e: any)=> {
            let seriesName = e.value;

            let sum = this.checkIntegerValue(e.meta.sum);
            let avg = this.checkIntegerValue(e.meta.avg);
            let numtoWordSum;
            if (sum) {
                numtoWordSum = new Tafgeet(sum, '').parse();
            } else {
                numtoWordSum = 0;
            }
            let numtoWordAvg;
            if (avg) {
                numtoWordAvg = new Tafgeet(avg, '').parse();
            } else {
                numtoWordAvg = 0;
            }

            return `${seriesName} : ${sum} <br> ${numtoWordSum}  <br> متوسط : ${avg} <br>   ${numtoWordAvg}  <hr>`;
        });

        /**
         * التول تيب الخاص بالعمود اي البار
         */
        chartObject.tooltip(this.showTooltip);
        chartObject.tooltip().useHtml(true);
        chartObject.tooltip().positionMode("point");
        chartObject.tooltip().format((e: any) => {
            let parseValue = this.checkIntegerValue(e.value);
            let seriesName = (e.seriesName);
            let numtoWords = new Tafgeet(parseValue, '').parse();
            return `${seriesName} : ${parseValue} <br> ${numtoWords} <hr>`;
        });


        chartObject.legend().enabled(self.showLegend);
        chartObject.container(this.unqID);
        chartObject.noData().label({text: 'لايوجد بيانات'});
        chartObject.labels().enabled(self.showDataLabels);    //  عرض المجاميع


        chartObject.contextMenu(true);
        chartObject.contextMenu().itemsFormatter(function (items: any) {
            // Delete item.
            delete items['about'];
            delete items['full-screen-enter'];
           // console.log(items);
            return items;
        });


        //chartObject.contextMenu.setup({enabled: true});

    }


    public getChartObject(){
        return this.chartObject;
    }

    /**
     * اضافة حدث لتغيير الحجم  الشارات
     */
    private addEventListenerResize() {
        let self = this;
        $(window).on('resize', function () {
            let parent = $('.apexcharts-css > div');
            self.chartObject.width(parent.width());
            self.chartObject.height(parent.height());
            //console.log('resize');
        });
    }

    /**
     * اضافة حدث لتغير العرض حسب الكمية او المبلغ
     */
    private reSorted(sel: string) {
        this.mapAsFormat = {'x': 'x', 'value': sel};
        this.appendSeries(this.dataJsonCharts);
    }


    /**
     * اضافة عمود بيانات
     * @param dataDB
     */
    appendSeries(dataDB: Array<DataJsonChartModel>) {

        let self = this;
        if (this.typeChartBar.type === typeNameChartEnum.Pie){
            this.creatPieChart(dataDB,this.chartBody);
            return;
        }


         if (this.typeChartBar.type === typeNameChartEnum.Pie){
            this.creatPieChart(dataDB,this.chartBody);
            return;
        }



       if (this.typeChartBar.type === typeNameChartEnum.heatMap){
                    this.creatHeatMapChart(dataDB,this.chartBody);
                    return;
       }







        self.initChart();
        self.dataJsonCharts = dataDB;
        self.dataSetsArray = new Array<any>();
        self.mapAsArray = new Array<number>();
        self.chartObject.removeAllSeries();


        for (const dataDBKey in dataDB) {
            let v = dataDB[dataDBKey];
            self.dataSetsArray[dataDBKey] = anychart.data.set(v.data);
            self.mapAsArray[dataDBKey] = self.dataSetsArray[dataDBKey].mapAs(self.mapAsFormat);
        }




        $.each(self.dataSetsArray, function (index: any) {

            let item = dataDB[index];
            self.chartObject.addSeries(self.mapAsArray[index]);
            self.chartObject.getSeries(index).name(item.title).legendItem({
                text: item.title,
                iconSize: 15,
                iconType: 'circle',
                iconTextSpacing: 10,
                paddingRight: 30,
            });
            self.chartObject.getSeries(index).labels().position("center-top").anchor("left-center").offsetY(-10).rotation(-90);

            self.chartObject.getSeries(index).normal().maxLabels(true);
            self.chartObject.getSeries(index).normal().maxLabels().fontColor("blue");


             self.chartObject.getSeries(index).normal().minLabels(true);
            self.chartObject.getSeries(index).normal().minLabels().fontColor("red");



            self.chartObject.getSeries(index).labels().position("center-top").anchor("left-center").offsetY(-10).rotation(-90);


            let sum = collect(item.data).sum('value');
            let avg = collect(item.data).avg('value');

            self.chartObject.getSeries(index).meta('sum', sum);
            self.chartObject.getSeries(index).meta('avg', avg);
            self.chartObject.getSeriesAt(index).seriesType(self.typeChartBar.type);
        });


    }


    public creatPieChart(data:any,container:string) {
        let allData: any = [];
        collect(data).each(function (item: any) {
            collect(item.data).each(function (item: any) {
                allData.push({value: item.value, x: item.x});
            });
        });


            $(this.chartBody).attr('id', this.unqID);
             $(`#${this.unqID}`).empty();
            let chart = anychart.pie(allData);
              chart.innerRadius("30%");
                chart.labels().position("outside");
                this.showDataLabels = true;

            this.configPieChart(chart);
            chart.container(this.unqID);
            chart.draw();
            this.showDataLabels = false;
            this.showTooltip = true;
    }



    public creatHeatMapChart(data:any,container:string) {
        let dataMap = this.initHeatMapData(data);
        console.log('heatMap');
            $(this.chartBody).attr('id', this.unqID);
        // @ts-ignore
            let chart = anychart.heatMap(dataMap);
            this.showDataLabels = false;
            chart.labels().format("{%heat}");
            chart.tooltip().format("{%heat}%  {%title}");
            chart.labelsDisplayMode("clip");
            chart.xZoom().setToPointsCount(10);
            this.configAnyChartType(chart);
            const customColorScale = anychart.scales.linearColor();
            customColorScale.colors(["#00ccff", "#ffcc00"]);
            chart.colorScale(customColorScale);
            chart.labels().useHtml(true);
            chart.container(this.unqID);
            chart.draw();

    }

    /**
     * معالجة بينانات الهيت ماب
     * @param data
     */
    initHeatMapData(data:any){
        // @ts-ignore
        let coll = collect(data);
        // console.log(coll,'coll');
        // @ts-ignore
        let dataMap = [];
        let xxx = 0;
        let yyy = 0;

        coll.each((item:any,key:any) => {
            if (xxx > this.displayHeatMapRows) {
                xxx = 0;
                yyy++;
            }
            // @ts-ignore
            let cc = collect(item).count();
            dataMap.push({ x: xxx, y: yyy, heat: item.value,title:"\n\n"+key+": مبلغ " });
            xxx++;
        });
        // @ts-ignore
        return dataMap;
    }








    public changeChartType(type: any) {
        let self = this;

        // if (type.type === typeNameChartEnum.Pie){
        //     this.creatPieChart(self.dataJsonCharts,self.chartBody);
        //     return;
        // }

        let i = 0;
        while (self.chartObject.getSeriesAt(i)) {
            // rename each series
             if (type.prop === typeNameChartEnum.StackedBar) {
                self.chartObject.yScale().stackMode('value');
                self.chartObject.tooltip().displayMode('union');
            }
             else {
                 self.chartObject.yScale().stackMode(false);
                 self.chartObject.tooltip().displayMode('single');
            }
            self.chartObject.getSeriesAt(i).seriesType(type.type);
            i++;
        }
        this.typeChartBar = type;
        //console.log(type,'self.typeChartBar changeChartType typess')
    }

    public addZoom(start:any,end:any){


      let s = `0.${parseInt(start)}`
      let e = `0.${parseInt(end)}`
        console.log(s,'sss')
        console.log(e,'ee')

        this.chartObject.xZoom().setTo(s, e);
    }



    private resetdataJsonCharts() {
        this.dataJsonCharts = [];
        // this.#chartObject.removeAllSeries();
    }

    escapeHtmlEntities(str: string) {
        return str.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    }
    private  checkIntegerValue(num: any) {
        //console.log(num, 'NBNNNNNNNN')

        if (Number.isNaN(num)) {
            return 0;
        } else {
            let value = Numbro(num).format({mantissa: 2,thousandSeparated:false})
            return parseInt(value);
        }
    }



}