import * as APIs from "~/utils/endpoints";
import BaseService from "~/services/BaseService";
import qs from 'qs';

export default class Info extends BaseService {
    constructor($axios, params) {
        super($axios, `${APIs.ELEARNING_PUBLIC_INFO}?${qs.stringify(params)}`);
    }
}