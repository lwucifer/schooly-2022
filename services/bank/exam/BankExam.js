import * as APIs from "~/utils/endpoints";
import BaseService from "~/services/BaseService";

export default class BankExam extends BaseService {
    constructor($axios) {
        super($axios, APIs.BANK_EXAM_POST);
    }
}