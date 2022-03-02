import * as APIs from "~/utils/endpoints";
import BaseService from "~/services/BaseService";

export default class Setting extends BaseService {
    constructor($axios) {
        super($axios, APIs.ACCOUNT_SETTING);
    }
}