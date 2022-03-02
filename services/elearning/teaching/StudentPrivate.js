import * as APIs from "~/utils/endpoints";
import BaseService from "../../BaseService";

export default class StudentPrivate extends BaseService {
    constructor($axios) {
        super($axios, APIs.TEACHING_STUDENTS);
    }
}