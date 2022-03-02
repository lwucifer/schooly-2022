import * as APIs from "~/utils/endpoints";
import BaseService from "~/services/BaseService";

export default class QuestionBankDetail extends BaseService {
    constructor($axios) {
        super($axios, APIs.BANK_QUESTION_BANK);
    }
}