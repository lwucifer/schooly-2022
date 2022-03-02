import * as APIs from "~/utils/endpoints";
import BaseService from "../../BaseService";

export default class Requests extends BaseService {
    constructor($axios) {
        super($axios, APIs.TEACHING_ELEARNING_REQUESTS);
    }
}