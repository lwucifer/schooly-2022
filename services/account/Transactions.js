import * as APIs from "../../utils/endpoints";
import BaseService from "../BaseService";

export default class Transactions extends BaseService {
    constructor($axios) {
        super($axios, APIs.ACCOUNT_TRANSACTIONS);
    }
}