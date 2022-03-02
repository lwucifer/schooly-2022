import * as APIs from "~/utils/endpoints";
import BaseService from "../../BaseService";

export default class Banned extends BaseService {
    constructor($axios) {
        super($axios, APIs.TEACHING_ELEARNING_BANNED);
    }
}