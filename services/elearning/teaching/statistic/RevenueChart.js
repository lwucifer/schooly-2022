import * as APIs from "~/utils/endpoints";
import BaseService from "~/services/BaseService";

export default class RevenueChart extends BaseService {
    constructor($axios) {
        super($axios, APIs.TEACHING_CHART_STATISTIC_REVENUE);
    }
}