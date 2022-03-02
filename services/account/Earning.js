import * as APIs from "../../utils/endpoints";
import BaseService from "../BaseService";

export default class Earning extends BaseService {
    constructor($axios) {
        super($axios, APIs.ACCOUNT_EARNING);
    }
}