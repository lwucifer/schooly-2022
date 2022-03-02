import * as APIs from "~/utils/endpoints";
import BaseService from "../../BaseService";

export default class SchoolYear extends BaseService {
    constructor($axios) {
        super($axios, APIs.ELEARNING_PUBLIC_SCHOOL_YEAR);
    }
}