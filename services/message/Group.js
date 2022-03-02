import * as APIs from "../../utils/endpoints";
import BaseService from "../BaseService";

export default class Group extends BaseService {
    constructor($axios) {
        super($axios, APIs.GROUP);
    }
}