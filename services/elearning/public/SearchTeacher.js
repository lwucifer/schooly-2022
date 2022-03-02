import * as APIs from "~/utils/endpoints";
import BaseService from "~/services/BaseService";

export default class SearchTeacher extends BaseService {
    constructor($axios) {
        super($axios, APIs.ELEARNING_SEARCH);
    }
}