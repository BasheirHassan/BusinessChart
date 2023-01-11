/**
 *
 *
 * تحويل اليوم من انكليزي الى عربي
 * @param n
 * @constructor
 */

export default function DayNameAr(n:string){

    interface DayNameLocal {
        name:string,
        local:string
    }


    let localName:Array<DayNameLocal> =[
        {name:'Monday',local:'الاثنين'},
        {name:'Tuesday',local:'الثلاثاء'},
        {name:'Wednesday',local:'الاربعاء'},
        {name:'Thursday',local:'الخميس'},
        {name:'Friday',local:'الجمعه'},
        {name:'Saturday',local:'السبت'},
        {name:'Sunday',local:'الاحد'}
    ]
    let objIndex = localName.findIndex((e: DayNameLocal) => e.name == n);

    return localName[objIndex].local;
}