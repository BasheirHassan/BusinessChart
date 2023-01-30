/**
 * كلاس متعدد البروميس
 */
import {StaticsEnum} from "@/assets/tsModels/StaticsAll";
import DataJsonChartModel from "@/assets/tsModels/DataJsonChartModel";
import {toRaw} from "vue";

export default class PromiseLoopClass {


    // @ts-ignore
    async constructor(row) {
        for (const item of row) {
            console.log(item.month, 'val');
            // @ts-ignore
            let val = await this.PromiseMe(item);
        }
    }

    PromiseMe(f: any) {
        return new Promise((res, rej) => {
            f();
        });
    }


}




