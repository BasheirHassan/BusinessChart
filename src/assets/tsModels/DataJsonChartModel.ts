/**
 * class
 */



import {collect} from "collect.js";
import moment from "moment";


export default  class DataJsonChartModel {
    private _data: object;
    private _title: string;
    private isSorted:boolean;
    private sortedItems:any;
    constructor(data: object, title: string,dataFormat:string='') {
        this._data = data;
        this._title = title;
        this.isSorted = false;
        if (dataFormat.trim() != ''){
          this._data = this.formatData(dataFormat);
        }

    }



    get data(): any {
        return this._data;
    }

    set data(value: any) {
        this._data = value;
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }



    sortedData() {
        this.sortedItems = collect(this.data).sortByDesc((item:any) => parseInt(item.value));
        this.isSorted = true;
       // console.log(this.sortedItems, 'this.#sortedItems')
    }

    /**
     * جلب اعلى عنصر
     */
    getMaxItem() {

        let self = this;
        self.checkIsSoreted();
        return self.sortedItems.first();
    }

    /**
     * جلب اصغر عصر
     */
    getMinItem() {
        let self = this;
        self.checkIsSoreted();
        return self.sortedItems.last();

    }


    getAvgItem() {
        let self = this;
        self.checkIsSoreted();
        return collect(self.data).avg('value');
    }


    /**
     * التاكد من انه تم فرز البيانات
     */
    private checkIsSoreted() {
        if (!this.isSorted) {
            console.error('Data is Not Sorted');
        }

    }



    formatData(format:string){
               return collect(this._data).each((item:any) => item.x = moment(item.x).format(format)).all();
    }


    public  getTotalAll(data:any){
        let total = [];
         collect(data).each((items:any) => {
            collect(items).each((item:any) => {
                total.push(collect(item.data).sum('value'));
            });
        });
    }






}




