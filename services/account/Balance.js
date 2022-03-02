import * as APIs from "~/utils/endpoints";
import BaseService from "~/services/BaseService";

export default class Balance extends BaseService {
    constructor($axios) {
        super($axios, APIs.ACCOUNT_BALANCE);
    }
}