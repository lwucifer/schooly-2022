import * as APIs from "../../../utils/endpoints";
import BaseService from "../../BaseService";

export default class Search extends BaseService {
    constructor($axios) {
        super($axios, APIs.SCHOOL_SEARCH);
    }
}