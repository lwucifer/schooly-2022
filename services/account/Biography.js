import * as APIs from "../../utils/endpoints";
import BaseService from "../BaseService";

export default class Biography extends BaseService {
    constructor($axios) {
        super($axios, APIs.ACCOUNT_PROFILE_BIOGRAPHY);
    }
}