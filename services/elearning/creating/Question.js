import * as APIs from "~/utils/endpoints";
import BaseService from "~/services/BaseService";

export class Question extends BaseService {
    constructor($axios) {
        super($axios, APIs.ELEARNING_CREATING_QUESTIONS);
    }
}

export class QuestionOfBank extends BaseService {
    constructor($axios) {
        super($axios, APIs.ELEARNING_CREATING_QUESTIONS_OF_BANK);
    }
}