import * as APIs from "~/utils/endpoints";
import BaseService from "~/services/BaseService";

export default class Import extends BaseService {
    constructor($axios) {
        super($axios, APIs.BANK_QUESTION_IMPORT);
    }
}