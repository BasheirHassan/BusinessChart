/*


Mysql Connection Class


 */


import { collect } from "collect.js";
import StoreConfig from "./StoreConfig";
import * as electron from "electron";

let knex = require("knex")({ client: "mysql" });



export default class MysqlAsyncClass {

  private serverConnection: any;
  private pools: any;
  public dbName: string = "";
  private knexInstance: any;

  constructor(server: string = "serverhost") {
    switch (server) {
      case "serverhost":
        this.serverConnection = StoreConfig.getServerHost();

        break;

      case "localhost":
        this.serverConnection = StoreConfig.getLocalHost();
        break;

    }
    //console.log(this.serverConnection,'this.serverConnection')
    return this;
  }


  async testConnection(host: string) {
    const knexTest = require("knex")({
      client: "mysql2",
      connection: {
        "host": host,
        "user": "root",
        "password": "wasa420807",
        "port": 3309,
        "database": "db_config",
        "charset": "utf8"
      },
      acquireConnectionTimeout: 3000
    });
    // console.log(host, 'this.serverConnection')
    return knexTest.select("*").from("tbl_databases").catch((queryError: any) => {
      electron.ipcRenderer.invoke("saveErrorLog", queryError);
      console.log(queryError, "Errrr");
    });

  }

  private async knexConnection() {

    if (this.knexInstance) {
      return this.knexInstance;
    }


    console.info("knexConnection");

    let conf;
    if (this.dbName === "") {
      conf = await this.serverConnection;
    } else {
      conf = { database: this.dbName };
    }
    // console.log(conf,'conf')
    let dataAsgin = Object.assign(conf, {
      user: "root",
      password: "wasa420807",
      port: 3309,
      dateStrings: true,
      typeCast: function(field: any, next: any) {
        return field.string();
      }

    });
    // //   console.log(dataAsgin, 'dataAsgin')

    this.knexInstance = require("knex")({
      client: "mysql2",
      connection: dataAsgin,
      acquireConnectionTimeout: 10000,
      pool: { min: 2, max: 50 },
      debug: false
    }).on("query-error", (queryError: any) => {
      electron.ipcRenderer.invoke("saveErrorLog", queryError);
      console.log(queryError, "Errrr");
    });


    return this.knexInstance;

  }


  /**
   * تسجيل الخول
   * @param userName
   * @param pass
   * @returns {Promise<*>}
   */
  public async login(userName: string, pass: string) {
    const conn = await this.knexConnection();
    return conn.select("*")
      .from("tbl_users")
      .whereRaw(`us_password=password('${pass}')`)
      .andWhere("us_login_name", "=", userName)
      .where("us_admin", "=", "1");


  }

  /**
   * جلب السنوات المالية
   * @returns {Promise<*>}
   */
  public async getListDB() {
    const conn = await this.knexConnection();
    return conn.select("da_name", "da_title", "da_sysdate")
      .from("tbl_databases")
      .orderBy("da_sysdate", "desc");


  }

  /**
   * جلب انواع لفواتير
   * @returns {Promise<*>}
   */
  public async getInvoiceType() {
    const conn = await this.knexConnection();
    return conn.select(["in_type_name", "in_type_const", "in_type_id"])
      .from("tbl_invoice_type").groupBy("in_type_const");

  }

  /**
   * جلب العملاء
   */
  public async getCustomers(type: string[] = ["0"]) {
    let conn = await this.knexConnection();
    return conn.select("cu_name", "cu_name as label",{pid:'cu_type'}, "cu_id", "cu_id as id")
      .whereIn("cu_type", type)
      .from("tbl_cust");
  }

  /**
   * جلب تصنيفات المواد
   * @returns {Promise<*>}
   */
  public async getItemClass() {
    const conn = await this.knexConnection();
    return conn.select({ name: "it_cl_name" }, { label: "it_cl_name" }, { pid: "it_cl_id_parent" }, { id: "it_cl_id" })
      .from("tbl_item_class");

  }

  /**
   * جلب كل ياام الاسبوع
   * @param Typeconset
   * @returns {Promise<Knex.QueryBuilder<TRecord, TResult>>}
   */
  public async getAllWeeks(Typeconset: string) {
    const conn = await this.knexConnection();
    return conn.select(knex.raw("WEEK(in_list_datetime) as weeks"),knex.raw("WEEK(in_list_datetime) as numberID"))
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset)
      .groupBy("weeks");

  }

  /**
   *
   * جلب كل ايام الشهر
   * @param Typeconset
   * @returns {Promise<Knex.QueryBuilder<TRecord, TResult>>}
   */
  public async getAllDays(Typeconset: string) {
    const conn = await this.knexConnection();
    return conn.select(knex.raw("DAY(in_list_datetime) as day"),{numberID:knex.raw("DAY(in_list_datetime)")},)
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset)
      .distinct()
      .groupBy("day");

  }


  /**
   *جلب كل ايام الاسبوع - سبت - احد - اثنين
   * @param Typeconset
   */
  public async getAllDaysOffWeeks(Typeconset: string) {
    const conn = await this.knexConnection();
    return conn.select(knex.raw("DAYOFWEEK(in_list_datetime) as days"), knex.raw("DAYNAME(in_list_datetime) as dayName"),{numberID:knex.raw("DAYNAME(in_list_datetime)")})
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset)
      .distinct()
      .groupBy("days");


  }


  /**
   * جلب كافة الاشهر
   * @param Typeconset
   * @returns {Promise<*>}
   */
  public async getAllMonths(Typeconset: string) {
    const conn = await this.knexConnection();
    return conn.select({x:knex.raw("DATE_FORMAT(`in_list_datetime`,'%m-%Y')")},{month:knex.raw("MONTH(in_list_datetime)")},{numberID:knex.raw("MONTH(in_list_datetime)")},{year:knex.raw("YEAR(in_list_datetime)")})
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset)
      .groupBy("month");

  }


  /**
   * جلب كل المواد
   * @returns {Promise<*>}
   */
  public async getItems() {
    const conn = await this.knexConnection();
    return conn.select("it_name", "it_id", "it_id_class", { name: "it_name" }, { label: "it_name" }, { pid: "it_id_class" }, { id: "it_id" })
      .from("tbl_item");
  }


  /**
   * اجمالي المنتجات
   */
  public async getCountItems() {
    const conn = await this.knexConnection();
    return conn.count({count:"*"})
      .from("tbl_item")
      .first();
  }





  /**
   * جلب المنتجات اللتي لديها حركة فقط
   */

  public async getItemsInDet() {
    const conn = await this.knexConnection();
    return conn.select("it_name", "it_id", "in_det_item_id", "it_id_class")
      .from("tbl_invoice_det")
      .innerJoin("tbl_item", "tbl_item.it_id", "tbl_invoice_det.in_det_item_id")
      .groupBy("in_det_item_id")
      .distinct("in_det_item_id");
  }


  /**
   * جلب مبيعات الشهر حسب نوع الفاتوة
   * @param Typeconset
   * @returns {Promise<*>}
   */
  public async getSalesMonthly(Typeconset: string) {
    const conn = await this.knexConnection();
    return conn.select({months:knex.raw("MONTH(in_list_datetime)")}, {years:knex.raw("YEAR(in_list_datetime)")})
      .select({x:knex.raw("DATE(`in_list_datetime`)")})
      .sum("in_list_net as value")
      .count("in_list_id as tooltip")
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset)
      .orderBy("years")
      .groupBy("months","years");

  }


  /**
   * جلب المبيعات كل السنة
   * @param Typeconset
   * @returns {Promise<Knex.QueryBuilder<TRecord, TResult>>}
   */
  public async getSalesAll(Typeconset: string) {
    const conn = await this.knexConnection();
    return conn.select({months:knex.raw("MONTH(in_list_datetime)")}, { x: "in_list_datetime" })
      .sum("in_list_net as value")
      .count("in_list_id as tooltip")
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset);


  }


  /**
   * جلب مبيعات الفواتير اسبوع حسب نوع الفاتورة
   * @param Typeconset
   * @returns {Promise<*>}
   */
  public async getSalesWeekly(Typeconset: string) {
    const conn = await this.knexConnection();
    return conn.select({weeks:knex.raw("WEEK(in_list_datetime)")}, {xx:knex.raw("WEEK(in_list_datetime)")},{x:knex.raw("DATE_FORMAT(in_list_datetime, '%v-%y')")})
      .sum("in_list_net as value")
      .count("in_list_id as tooltip")
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset)
      .orderBy("x", "ASC")
      .groupBy("x");

  }

  /**
   * جلب عدد الفاوتير حسب نوع الفاتورة
   * @param Typeconset
   */
  public async getCountInvoice(Typeconset: string) {
    const conn = await this.knexConnection();
    return conn.count({count:"*"})
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset)
      .first()
  }

  /**
   * عدد ايام المبيعات
   * @param Typeconset
   */
  public async getCountInvoiceByDays(Typeconset: string) {
    const conn = await this.knexConnection();
    return conn.select({days:knex.raw("DATE(in_list_datetime)")})
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset)
      .groupBy("days")
  }

 public async getCountYears() {
    const conn = await this.knexConnection();
    return conn.select({years:knex.raw("YEAR(in_list_datetime)")})
      .from("tbl_invoice_list")
      .groupBy("years")

  }


  /**
   * جلب مبيعات كل اسبوع حسب رقم الاسبوع
   * @param Typeconset
   * @param weekID
   * @returns {Promise<Knex.QueryBuilder<TRecord, TResult>>}
   */
  public async getSalesWeeklyByID(Typeconset: string, weekID: string) {


    const conn = await this.knexConnection();

    return conn.select(knex.raw("DATE(in_list_datetime) as weekID"), knex.raw("DATE(in_list_datetime) as x"))
      .sum("in_list_net as value")
      .count("in_list_id as tooltip")
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset)
      .whereRaw(`WEEK(in_list_datetime) = ${weekID}`)
      .orderBy("weekID", "asc")
      .groupByRaw("weekID");
  }

  /**
   * جلب مبيع
   * @param Typeconset
   */
  public async getSalesBySameDataInMonth(Typeconset: string) {
    const conn = await this.knexConnection();
    return conn.select([knex.raw("DAYOFWEEK(in_list_datetime) as dayofweeks"), knex.raw("DATE(in_list_datetime) as date"), knex.raw("MONTH(in_list_datetime) as month"), knex.raw("DAYNAME(in_list_datetime) dayname")])
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset)
      .then((rows: any) => {
        let gr = collect(rows);
        //console.log(gr.all())
      });
  }


  /**
   * جلب مبيعات الفواتير يومي حسب نوع الفاتورة
   * @param Typeconset
   * @returns {Promise<*>}
   */
  public async getSalesDayly(Typeconset: string) {
    const conn = await this.knexConnection();
    return conn.select({x:knex.raw("DATE(in_list_datetime)")})
      .sum("in_list_net as value")
      .count("in_list_id as tooltip")
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset)
      .orderBy('x')
      .groupBy("x");

  }

  /**
   * جلب المبيعات اليومية في هذا الشهر
   * @param Typeconset
   * @returns {Promise<*>}
   */
  public async getSalesDaylyThisMonth(Typeconset: string) {
    const conn = await this.knexConnection();
    return conn.select({ x: "in_list_datetime" }, {dates:knex.raw("DATE(in_list_datetime)")})
      .sum("in_list_net as value")
      .count("in_list_id as tooltip")
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset)
      .andWhereRaw("MONTH(`in_list_datetime`) =  MONTH(CURRENT_DATE())")
      .groupBy("dates");

  }

  /**
   * جلب مبيعات الفواتير بالساعة نوع الفاتورة
   * @param Typeconset
   * @returns {Promise<*>}
   */
  public async getSalesHourly(Typeconset: string) {
    const conn = await this.knexConnection();
    return conn.select({x:knex.raw("HOUR(in_list_datetime)")})
      .sum("in_list_net as value")
      .count("in_list_id as tooltip")
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset)
      .groupBy("x");

  }

  /**
   * كامل مبيغ
   * @returns {Promise<any[]>}
   */
  public async getSalesAndPurchases() {
    const conn = await this.knexConnection();
    return conn.select({ title: "in_type_name" }, { x: "in_list_datetime" })
      .sum("in_list_net as value")
      .from("tbl_invoice_list")
      .leftJoin("tbl_invoice_type", "tbl_invoice_type.in_type_const", "tbl_invoice_list.in_list_type_const")
      .whereRaw("MONTH(in_list_datetime)=MONTH(CURRENT_DATE())")
      .groupBy("in_list_type_const");


  }

  /**
   * جلب مبيعات مشتريات كاملة
   */

  public async getSalesAndPurchasesAll() {
    let sub = this.getInvoiceNameBysubQuery("tbl_invoice_list.in_list_type_const");
    const conn = await this.knexConnection();
    return conn.select({ x: "in_list_datetime" }, sub)
      .sum("in_list_net as value")
      .from("tbl_invoice_list")
      .groupBy("in_list_type_const");

  }






  /**
   * جلب اسم الفاتورة حسب النوع
   * @param whereJoin
   */
  private getInvoiceNameBysubQuery(whereJoin: string) {

    if (!whereJoin) {
      console.error("Empty Where Join");
      return;
    }
    return knex.select("in_type_name")
      .from("tbl_invoice_type")
      .whereRaw("tbl_invoice_type.in_type_const=" + whereJoin)
      .limit(1).as("in_type_name");
  }


  /**
   * جلب اسم المنتج
   * @param whereJoin
   */
  private getItemNameBysubQuery(whereJoin: string) {
    if (!whereJoin) {
      console.error("Empty Where Join");
      return;
    }

    return knex.select("it_name")
      .from("tbl_item")
      .whereRaw("tbl_item.it_id=" + whereJoin)
      .limit(1).as("it_name");
  }


  /**
   * جلب المبيعات والمتشريات لهذا الهر
   * @returns {Promise<*>}
   */
  public async getSalesAndPurchasesThisMonth() {

    let subQuery = this.getInvoiceNameBysubQuery("tbl_invoice_list.in_list_type_const");
    const conn = await this.knexConnection();
    return conn.select("in_list_net", "in_list_type_const", subQuery)
      .from("tbl_invoice_list").as("invoice_list")
      .sum("in_list_net as value")
      .whereRaw("MONTH(in_list_datetime)=MONTH(CURRENT_DATE())")
      .groupBy("in_list_type_const");


  }

  /**
   * مبيعات مشتريات هذه اليوم
   * @returns {Promise<*>}
   */
  public async getSalesAndPurchasesThisDay() {


    const subQuery = knex.select("in_type_name")
      .from("tbl_invoice_type")
      .whereRaw("in_type_const=tbl_invoice_list.in_list_type_const")
      .limit(1).as("x");

    const conn = await this.knexConnection();
    return conn.select(["in_list_net", "in_list_type_const", { x: "in_list_datetime" }, subQuery])
      .from("tbl_invoice_list").as("invoice_list")
      .sum("in_list_net as value")
      .whereRaw("DATE(in_list_datetime)=CURRENT_DATE()")
      .groupBy("in_list_type_const");


  }


  /**
   * جلب ايام الاسبوع
   * @param Typeconset
   * @returns {Promise<Knex.QueryBuilder<TRecord, TResult>>}
   */
  public async getAllDayOffWeeks(Typeconset: string) {
    // 0=Monday, 1=Tuesday, 2=Wednesday, 3=Thursday, 4=Friday, 5=Saturday, 6=Sunday
    const conn = await this.knexConnection();
    return conn.select(knex.raw("DAYOFWEEK(in_list_datetime) as weeks"), { dateTime: "in_list_datetime" }, knex.raw("DAYNAME(in_list_datetime) as daynames"))
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset)
      .groupByRaw("weeks")
      .orderByRaw("FIELD(weeks, '1','2','3', '4', '5', '6', '7')");

  }


  /**
   * جلب المبيعات حسب يوم الاسبوع
   * @param Typeconset
   * @param d
   * @returns {Promise<Knex.QueryBuilder<TRecord, TResult>>}
   */
  public async getSalesDayOffWeeks(Typeconset: string, d: string) {
    const conn = await this.knexConnection();
    return conn.select(knex.raw("DATE(in_list_datetime) as dates"), knex.raw("DAYNAME(in_list_datetime) as DAYNAME"), knex.raw("DATE(in_list_datetime) as x"))
      .sum("in_list_net as value")
      .count("in_list_id as tooltip")
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset)
      .andWhereRaw(`DAYOFWEEK(in_list_datetime) ='${d}'`)
      .orderBy("dates")
      .groupBy("dates");

  }


  public async getSumSalesDayOffWeeks(Typeconset: string) {
    const conn = await this.knexConnection();
    return conn.select({ x: "in_list_datetime" }, knex.raw("DAYOFWEEK(in_list_datetime) as dayofweeks"))
      .sum("in_list_net as value")
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset)
      .orderBy("dayofweeks")
      .groupBy("dayofweeks");

  }


  public async getSalesDayInMonths(Typeconset: string, d: string) {
    const conn = await this.knexConnection();
    return conn.select({days:knex.raw("DAY(in_list_datetime)")}, { dates:knex.raw('DATE(in_list_datetime)') }, {x:knex.raw("DATE(in_list_datetime)")})
      .sum("in_list_net as value")
      .count("in_list_id as tooltip")
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset)
      .andWhereRaw(`DAY(in_list_datetime) ='${d}'`)
      .orderBy("dates", "DESC")
      .groupByRaw("DATE(in_list_datetime)");

  }


  /**
   * مبيعات مشتريات يومي حسب الشهر
   * @param Typeconset
   * @param m
   * @returns {Promise<*>}
   */
  public async getSalesDayInMonthly(Typeconset: string, m: string) {
    const conn = await this.knexConnection();
    return conn.select({ dateTime: "in_list_datetime" },{fullDate:knex.raw("DATE_FORMAT(`in_list_datetime`,'%d-%Y')") }, {days:knex.raw("DAY(in_list_datetime)")}, {x:knex.raw("DATE(in_list_datetime)")})
      .sum("in_list_net as value")
      .count("in_list_id as tooltip")
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset)
      .andWhereRaw(`MONTH(in_list_datetime) = ${m} `)
      .orderBy("days")
      .groupBy("fullDate");

  }

  /**
   * جلب منتج اعلى مبيعا
   * @param Typeconset
   * @param limit
   * @returns {*}
   */
  public async getSalesItemsMax(Typeconset: string, limit: number = 10) {

    let sub = this.getItemNameBysubQuery("tbl_invoice_det.in_det_item_id");

    const conn = await this.knexConnection();
    return conn.select(sub.as("x"))
      .count("in_det_item_id as value")
      .sum("in_det_total_net as tooltip")
      .from("tbl_invoice_det")
      .where("in_det_in_out_type", Typeconset)
      .orderBy("value", "desc")
      .groupBy("in_det_item_id")
      .limit(limit);


  }


  /**
   * جلب منتجات خاملة
   * @param limit
   */

  public async getItemWithoutSales(limit: number = 10) {
    let conn = await this.knexConnection();
    return conn.select({date:knex.raw('DATE(in_det_datetime)') }, {x: 'it_name' })
      .count("in_det_item_id as value")
      .sum("in_det_total_net as tooltip")
      .from("tbl_invoice_det")
      .groupBy("in_det_item_id")
      .rightJoin("tbl_item", "tbl_item.it_id", "tbl_invoice_det.in_det_item_id")
      .havingRaw("COUNT(`in_det_item_id`) > 0")
      .orderBy("value", "ASC")
      .limit(limit);
  }


  /**
   * جلب مبيعات المنتح ششهري حسب رقم المنتج
   * @param Typeconset
   * @param itemID
   * @returns {Promise<*>}
   */
  public async getSalesItemMonthly(Typeconset: string, itemID: string) {
    const conn = await this.knexConnection();
    return conn.select("it_id", "it_name", {x:knex.raw("DATE_FORMAT(`in_det_datetime`,'%m-%Y')") })
      .sum("in_det_total_net as value")
      .sum("in_det_qty as tooltip")
      .from("tbl_invoice_det")
      .leftJoin("tbl_item", "tbl_item.it_id", "tbl_invoice_det.in_det_item_id")
      .where("in_det_in_out_type", Typeconset)
      .andWhere("it_id", itemID)
      .groupByRaw(["MONTH(in_det_datetime)","YEAR(in_det_datetime)"]);


  }

  /**
   * مبيعات منتج اسبوعية
   * @param Typeconset
   * @param itemID
   * @returns {Promise<*>}
   */
  public async getSalesItemWeekly(Typeconset: string, itemID: string) {
    const conn = await this.knexConnection();
    return conn.select({ x:knex.raw('WEEK(in_det_datetime)') }, "it_id", "it_name")
      .sum("in_det_total_net as value")
      .sum("in_det_qty as tooltip")
      .from("tbl_invoice_det")
      .leftJoin("tbl_item", "tbl_item.it_id", "tbl_invoice_det.in_det_item_id")
      .where("in_det_in_out_type", Typeconset)
      .andWhere("it_id", itemID)
      .groupByRaw("WEEK(in_det_datetime)");

  }


  /**
   * جلب مبيعات العى منتج حسب اليوم من الاسبوع
   * @param Typeconset
   * @param weekID
   */
  public async getSalesItemByWeeklyID(Typeconset: string, weekID: string) {
    const conn = await this.knexConnection();
    return conn.select({ x:knex.raw('it_name') }, "it_id", "it_name")
      .sum("in_det_total_net as value")
      .sum("in_det_qty as tooltip")
      .from("tbl_invoice_det")
      .leftJoin("tbl_item", "tbl_item.it_id", "tbl_invoice_det.in_det_item_id")
      .where("in_det_in_out_type", Typeconset)
      .andWhereRaw(`WEEK(in_det_datetime) = ${weekID}`)
      .groupByRaw("WEEK(in_det_datetime),it_id")
      .limit(20)
      .orderBy("value", "desc");


  }


  /**
   * جلب مبيعات العى منتج حسب اليوم من الشهر
   * @param Typeconset
   * @param monthID
   */
  public async getSalesItemByMonthlyID(Typeconset: string, monthID: string) {
    const conn = await this.knexConnection();
    return conn.select({x: knex.raw('it_name') }, "it_id", "it_name")
      .sum("in_det_total_net as value")
      .sum("in_det_qty as tooltip")
      .from("tbl_invoice_det")
      .leftJoin("tbl_item", "tbl_item.it_id", "tbl_invoice_det.in_det_item_id")
      .where("in_det_in_out_type", Typeconset)
      .andWhereRaw(`MONTH(in_det_datetime) = ${monthID}`)
      .groupByRaw("MONTH(in_det_datetime),it_id")
      .limit(30)
      .orderBy("value", "desc");


  }


  /**
   * مبيعات منتجات - اعلى حسب اليوم من الاسبوع
   * @param Typeconset
   * @param dayName
   * @param orderBy
   * @returns {Promise<Knex.QueryBuilder<TRecord, TResult>>}
   */
  public async getSalesItemTopDay(Typeconset: string, dayName: string) {
    const conn = await this.knexConnection();
    return conn.select("it_id", "it_name", { daynames:knex.raw('dayname(in_det_datetime)') }, {x:knex.raw("dayname(in_det_datetime)")})
      .sum("in_det_total_net as value")
      .sum("in_det_qty as tooltip")
      .from("tbl_invoice_det")
      .leftJoin("tbl_item", "tbl_item.it_id", "tbl_invoice_det.in_det_item_id")
      .where("in_det_in_out_type", Typeconset)
      .andWhere(knex.raw("dayname(in_det_datetime)"), dayName)
      .orderBy("value", "desc")
      .groupByRaw(["it_id", "dayname(in_det_datetime)"])
      .limit(1);

  }


  /**
   * جلب المبيعات المنتجات حسب الاعلى ط شهر
   * @param Typeconset
   * @param monthID
   */
  public async getSalesItemTopMonth(Typeconset: string, monthID: string) {
    const conn = await this.knexConnection();
    return conn.select("it_id", "it_name", {months:knex.raw("MONTH(in_det_datetime)")}, {x:knex.raw("MONTH(in_det_datetime)")})
      .sum("in_det_total_net as value")
      .sum("in_det_qty as tooltip")
      .from("tbl_invoice_det")
      .leftJoin("tbl_item", "tbl_item.it_id", "tbl_invoice_det.in_det_item_id")
      .where("in_det_in_out_type", Typeconset)
      .where(knex.raw("MONTH(in_det_datetime)"), monthID)
      .orderBy("value", "desc")
      .groupByRaw(["it_id", "months"])
      .limit(1);

  }


  /**
   * جلب مبيعات المنتح يومي حسب رقم المنتج
   * @param Typeconset
   * @param itemID
   * @returns {Promise<*>}
   */
  public async getSalesItemDayly(Typeconset: string, itemID: string) {
    const conn = await this.knexConnection();
    return conn.select("it_id", "it_name", {x: knex.raw('DATE(in_det_datetime)') })
      .sum("in_det_total_net as value")
      .sum("in_det_qty as tooltip")
      .from("tbl_invoice_det")
      .leftJoin("tbl_item", "tbl_item.it_id", "tbl_invoice_det.in_det_item_id")
      .where("in_det_in_out_type", Typeconset)
      .andWhere("it_id", itemID)
      .groupByRaw("DATE(in_det_datetime)");


  }

  /**
   * جلب مبيعات المنتح ساعة حسب رقم المنتج
   * @param Typeconset
   * @param itemID
   * @returns {Promise<*>}
   */
  public async getSalesItemHourly(Typeconset: string, itemID: string) {

    const conn = await this.knexConnection();
    return conn.select({x: knex.raw('HOUR(in_det_datetime)') }, "it_id", "it_name", {hours:knex.raw('HOUR(in_det_datetime)') })
      .sum("in_det_total_net as value")
      .sum("in_det_qty as tooltip")
      .from("tbl_invoice_det")
      .leftJoin("tbl_item", "tbl_item.it_id", "tbl_invoice_det.in_det_item_id")
      .where("in_det_in_out_type", Typeconset)
      .andWhere("it_id", itemID)
      .groupByRaw("HOUR(in_det_datetime)");


  }

  /**
   * جلب عمليات المنتج حسب رقمه كل انواع العمليات
   * @param itemID
   * @param typeconset
   * @returns {Promise<*>}
   */
  public async getSalesItemByItemID(itemID: string, typeconset: any) {
    const conn = await this.knexConnection();
    return conn.select({ x: "in_det_datetime" }, "it_id", "it_name")
      .sum("in_det_total_net as value")
      .sum("in_det_qty as tooltip")
      .from("tbl_invoice_det")
      .leftJoin("tbl_item", "tbl_item.it_id", "tbl_invoice_det.in_det_item_id")
      .where("in_det_in_out_type", typeconset)
      .andWhere("it_id", itemID)
      .groupByRaw("HOUR(in_det_datetime)");

  }

  /**
   * جلب مبيعات كل المنتجات
   * @returns {Promise<Knex.QueryBuilder<TRecord, TResult>>}
   */
  public async getSalesItemAll() {
    const conn = await this.knexConnection();
    return conn.select({ x: "in_type_name" }, "it_id", "it_name", "in_det_in_out_type")
      .sumDistinct("in_det_total_net as value")
      .sumDistinct("in_det_qty as tooltip")
      .from("tbl_invoice_det")
      .innerJoin("tbl_item", "tbl_item.it_id", "tbl_invoice_det.in_det_item_id")
      .innerJoin("tbl_invoice_type", "tbl_invoice_type.in_type_const", "tbl_invoice_det.in_det_in_out_type")
      .groupBy("it_id", "in_det_in_out_type")
      .orderBy("value", "desc");

  }


  /**
   * جلب مبيعات منتج حسب الرقم
   * @param IDs
   */

  public async getSalesItemAllByID(IDs: string[]) {
    const conn = await this.knexConnection();
    return conn.select({ x: "in_type_name" }, "it_id", "it_name", "in_det_in_out_type")
      .sumDistinct("in_det_total_net as value")
      .sumDistinct("in_det_qty as tooltip")
      .from("tbl_invoice_det")
      .whereIn("in_det_item_id", IDs)
      .innerJoin("tbl_item", "tbl_item.it_id", "tbl_invoice_det.in_det_item_id")
      .innerJoin("tbl_invoice_type", "tbl_invoice_type.in_type_const", "tbl_invoice_det.in_det_in_out_type")
      .groupBy("it_id", "in_det_in_out_type")
      .orderBy("value", "desc");

  }


  public async getNotInPosClose(in_list_type_const: string) {
    const conn = await this.knexConnection();
    return conn.select("in_list_id", "in_list_doc_id", "in_list_type_id", "in_list_acc_cust", "in_list_type_const")
      .from("tbl_invoice_list")
      .where("in_list_type_const", in_list_type_const)
      .orderBy("in_list_datetime", "asc")
      .whereNotExists(function(q: any) {
        q.select("close_inv_source_id")
          .from("tbl_pos_close_inv")
          .whereRaw("tbl_pos_close_inv.close_inv_source_id = tbl_invoice_list.in_list_id");
      });


  }


  /**
   * جلب مجموع الفواتير مع المتوسط
   * @param in_list_type_const
   * @returns {Promise<{average: *, total: *, totalOrder, maxOrder}>}
   */
  public async getTotalOrder(in_list_type_const: string) {

    let notInPosClose = await this.getNotInPosClose(in_list_type_const);
    let rowsArrayNotInPosClose = collect(notInPosClose).pluck("in_list_id").toArray();
    let totalAll = await this.knexConnection().then(conn => {
      return conn.select("*")
        .from("tbl_invoice_list")
        .whereIn("in_list_id", rowsArrayNotInPosClose);
    });
    let collectTotalAll = collect(totalAll);
    //console.log(totalAll, 'totalAll')

    return {
      "total": collectTotalAll.sum("in_list_net"),
      "maxOrder": collectTotalAll.max("in_list_net"),
      "totalItems": collectTotalAll.max("in_list_net"),
      "average": collectTotalAll.average("in_list_net")
    };


  }


  /**
   * مبيعات العملاء شهري
   * @param Typeconset
   * @param CustomersID
   */
  public async getSalesCustomersMonthly(Typeconset: string, customersID: string) {
    let conn = await this.knexConnection();

    return conn.select({ months:knex.raw('MONTH(in_list_datetime)') }, { x:knex.raw('DATE(in_list_datetime)') })
      .sum("in_list_net as value")
      .count("in_list_id as tooltip")
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset)
      .where("in_list_cust_id", customersID)
      .groupBy("months");

  }

  /**
   * مبيعات العملاء اسبوعيا
   * @param Typeconset
   * @param customersID
   */
  public async getSalesCustomersWeekly(Typeconset: string, customersID: string) {
    let conn = await this.knexConnection();
    return conn.select({ weeks:knex.raw('WEEK(in_list_datetime)') }, {x: knex.raw('WEEK(in_list_datetime)') })
      .sum("in_list_net as value")
      .count("in_list_id as tooltip")
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset)
      .where("in_list_cust_id", customersID)
      .orderBy("weeks", "ASC")
      .groupBy("weeks");
  }

  /**
   * مبيعات عملاء يومي
   * @param Typeconset
   * @param customersID
   */
  public async gettSalesCustomersDayly(Typeconset: string, customersID: string) {
    let conn = await this.knexConnection();

    return conn.select({ x:knex.raw('DATE(in_list_datetime)') })
      .sum("in_list_net as value")
      .count("in_list_id as tooltip")
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset)
      .where("in_list_cust_id", customersID)
      .groupByRaw("DATE(in_list_datetime)");
  }


  /**
   * مبيعات العملاء بالساعة
   * @param Typeconset
   * @param customersID
   */
  public async getSalesCustomersHourly(Typeconset: string, customersID: string) {
    let conn = await this.knexConnection();
    return conn.select({x: knex.raw('HOUR(in_list_datetime)') })
      .sum("in_list_net as value")
      .count("in_list_id as tooltip")
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset)
      .where("in_list_cust_id", customersID)
      .groupBy("x");
  }


  /**
   * مبيعات العملاء حسب الاعلى مبيعا
   * @param Typeconset
   * @param limit
   */
  public async getMaxSalesCustomers(Typeconset: string, limit: number = 10) {
    let conn = await this.knexConnection();
    return conn.select({date: knex.raw('DATE(in_list_datetime)') }, {x:'cu_name ' })
      .sum("in_list_net as value")
      .count("in_list_id as tooltip")
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset)
      .groupBy("cu_id")
      .rightJoin("tbl_cust", "tbl_cust.cu_id", "tbl_invoice_list.in_list_cust_id")
      .orderBy("value", "DESC")
      .limit(limit);
  }


  /**
   * مبيعات عملاء اليوم
   * @param Typeconset
   * @param limit
   */
  public async getMaxSalesCustomersToday(Typeconset: string, limit: number = 10) {
    let conn = await this.knexConnection();
    return conn.select({date: knex.raw('DATE(in_list_datetime)') }, {x: 'cu_name' })
      .sum("in_list_net as value")
      .count("in_list_id as tooltip")
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset)
      .where(knex.raw("DATE(in_list_datetime)"), knex.raw("DATE(NOW())"))
      .groupBy("cu_id")
      .rightJoin("tbl_cust", "tbl_cust.cu_id", "tbl_invoice_list.in_list_cust_id")
      .orderBy("value", "DESC")
      .limit(limit);
  }


  /**
   * جلب المبيعات حسب العميل
   * @param customersID
   */

  public async getMaxSalesByCustomersID(customersID: string) {

    let subQuery = this.getInvoiceNameBysubQuery(" tbl_invoice_list.in_list_type_const");
    let conn = await this.knexConnection();

    return conn.select("in_list_net", "in_list_type_const", { x: "in_list_datetime" }, subQuery)
      .from("tbl_invoice_list")
      .sum("in_list_net as value")
      .count("in_list_id as tooltip")
      .where("in_list_cust_id", customersID)
      .groupBy("in_list_type_const");
  }


  /**
   * متوسط مبيع فاتورة
   * @param Typeconset
   */
  public async getAvgInvoices(Typeconset: string) {
    const conn = await this.knexConnection();
    return conn.select({ months:knex.raw('MONTH(in_list_datetime)') }, {x: knex.raw('DATE(in_list_datetime)') })
      .avg("in_list_net as value")
      .count("in_list_id as tooltip")
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset);

  }


  /**
   * جلب متوسط الفاوتير كل الاشهر
   * @param Typeconset
   */

  public async getAvgInvoicesAll(Typeconset: string) {
    const conn = await this.knexConnection();
    return conn.select({ months:knex.raw('MONTH(in_list_datetime)') },{ years:knex.raw('YEAR(in_list_datetime)') },{x:knex.raw("DATE_FORMAT(`in_list_datetime`,'%m-%Y')")})
      .avg("in_list_net as value")
      .count("in_list_id as tooltip")
      .from("tbl_invoice_list")
      .where("in_list_type_const", Typeconset)
      .orderBy('years','DESC')
      .groupBy("months","years");

  }

  /**
   * جلب كل الفواتيرر
   * @param Typeconset
   */
  public async getInvoicesAll(Typeconset: string) {
    const conn = await this.knexConnection();
    return conn.select({ value: 'in_list_net' }, { x: knex.raw('DATE(`in_list_datetime`)') })
      .from('tbl_invoice_list')
      .where('in_list_type_const', Typeconset);


  }


  public async getAccountBalance() {
    const conn = await this.knexConnection();
    return conn.select({ x: "ac_name" }, "ac_current_debit", "ac_current_credit", knex.raw("(ac_current_debit - ac_current_credit) as value "))
      .from("tbl_account_balance")
      .innerJoin("tbl_account", "tbl_account_balance.ac_ba_id_parent", "tbl_account.ac_id");

  }


  /**
   * اغلاق الاتصال
   */
  public closeConnection() {
    // knex.destroy();
  }


  private roundFix(number: number, precision: number) {
    var multi = Math.pow(10, precision);
    return Math.round(Number((number * multi).toFixed(precision + 1))) / multi;
  }


}


