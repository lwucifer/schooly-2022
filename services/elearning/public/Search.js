import * as APIs from "~/utils/endpoints";
import BaseService from "~/services/BaseService";

export default class Search extends BaseService {
    constructor($axios) {
        super($axios, APIs.ELEARNING_PUBLIC_SEARCH);
    }
}