import * as APIs from "../../../utils/endpoints";
import BaseService from "../../BaseService";

export default class SchoolStudent extends BaseService {
    constructor($axios) {
        super($axios, APIs.TEACHING_SCHOOL_STUDENTS);
    }
}