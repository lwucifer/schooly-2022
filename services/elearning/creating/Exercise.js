import * as APIs from "~/utils/endpoints";
import BaseService from "~/services/BaseService";

export class Exercise extends BaseService {
    constructor($axios) {
        super($axios, APIs.ELEARNING_CREATING_EXERCISE);
    }
}

export class Exercises extends BaseService {
    constructor($axios) {
        super($axios, APIs.ELEARNING_CREATING_EXERCISES);
    }
}