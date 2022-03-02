import * as APIs from "~/utils/endpoints";
import BaseService from "~/services/BaseService";

export default class Progress extends BaseService {
    constructor($axios) {
        super($axios, APIs.ELEARNING_CREATING_PROGRESS);
    }
}