import * as APIs from "~/utils/endpoints";
import BaseService from "~/services/BaseService";

export default class Profile extends BaseService {
    constructor($axios) {
        super($axios, APIs.ACCOUNT_BANK_VALIDATE);
    }
}