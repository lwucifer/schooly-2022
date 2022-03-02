import * as APIs from "../../utils/endpoints";
import BaseService from "../BaseService";

export default class Link extends BaseService {
    constructor($axios) {
        super($axios, APIs.ACCOUNT_LINK);
    }
}