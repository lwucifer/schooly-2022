import * as APIs from "~/utils/endpoints";
import BaseService from "../../BaseService";

export default class TeachingSummary extends BaseService {
    constructor($axios) {
        super($axios, APIs.TEACHING_SUMMARY);
    }
}