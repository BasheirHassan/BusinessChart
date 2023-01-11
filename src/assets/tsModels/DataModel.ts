/**
 * class
 */
import {collect} from "collect.js";


interface Info {
    index:string
    title:string
    total:string

}

export default abstract class DataModel {


    public static  getMax(data:any){
        let total:any = [];
        let ID =0;
         collect(data).each((items:any) => {
            collect(items).each((item:any) => {
                total.push({index:ID,total:collect(item.data).sum('value')});
            });
             ID ++;
        });
         let max =  collect(total).sortByDesc('total').first();
         let min =  collect(total).sortByDesc('total').last();
         let avg =  collect(total).avg('total');


        //console.log(max,'max')

         let info = [];
         // @ts-ignore
        info.push({index:max.index,title:'اعلى مبيع',total:max.total})
         // @ts-ignore
        info.push({index:min.index,title:'اقل مبيع',total:min.total})
         info.push({index:null,title:'متوسط',total:avg})

         return info;


    }






}




