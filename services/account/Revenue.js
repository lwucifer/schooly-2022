import * as APIs from "../../utils/endpoints";
import BaseService from "../BaseService";

export default class Revenue extends BaseService {
    constructor($axios) {
        super($axios, APIs.ACCOUNT_REVENUE);
    }
}