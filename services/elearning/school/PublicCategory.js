import * as APIs from "~/utils/endpoints";
import BaseService from "~/services/BaseService";

export default class PublicCategory extends BaseService {
    constructor($axios) {
        super($axios, APIs.PUBLIC_CATEGORY);
    }
}