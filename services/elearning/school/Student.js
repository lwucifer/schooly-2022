import * as APIs from "../../../utils/endpoints";
import BaseService from "../../BaseService";

export default class Student extends BaseService {
    constructor($axios) {
        super($axios, APIs.SCHOOL_STUDENT);
    }
}