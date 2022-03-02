import * as APIs from "~/utils/endpoints";
import BaseService from "~/services/BaseService";

export default class ImportValid extends BaseService {
    constructor($axios) {
        super($axios, APIs.BANK_QUESTION_IMPORT_VALID);
    }
}