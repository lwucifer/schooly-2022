import * as APIs from "../utils/endpoints";
import BaseService from "./BaseService";

export default class Payment extends BaseService {
    constructor($axios) {
        super($axios, APIs.CART_LIST);
    }

}
