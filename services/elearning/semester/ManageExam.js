import * as APIs from "~/utils/endpoints";
import BaseService from "../../BaseService";

export default class ManageExam extends BaseService {
    constructor($axios) {
        super($axios, APIs.MANAGE_EXAM);
    }
}