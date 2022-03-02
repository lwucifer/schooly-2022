import * as APIs from "../../../utils/endpoints";
import BaseService from "../../BaseService";

export default class Subjects extends BaseService {
    constructor($axios) {
        super($axios, APIs.SCHOOL_SUBJECTS);
    }
}