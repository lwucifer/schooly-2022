import * as APIs from "~/utils/endpoints";
import BaseService from "../../BaseService";

export default class Progress extends BaseService {
    constructor($axios) {
        super($axios, APIs.TEACHING_STUDENT_PROGESS);
    }
}