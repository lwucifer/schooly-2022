import * as APIs from "../../utils/endpoints";
import BaseService from "../BaseService";

export default class Support extends BaseService {
    constructor($axios) {
        super($axios, APIs.INFO_SUPPORT);
    }
}