import * as APIs from "~/utils/endpoints";
import BaseService from "~/services/BaseService";

export default class Withdraw extends BaseService {
    constructor($axios) {
        super($axios, APIs.ACCOUNT_WITHDRAW);
    }
}