import * as APIs from "~/utils/endpoints";
import BaseService from "../../BaseService";

export default class Standalone extends BaseService {
    constructor($axios) {
        super($axios, APIs.SCHOOL_STANDALONE);
    }
}