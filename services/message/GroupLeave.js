import * as APIs from "../../utils/endpoints";
import BaseService from "../BaseService";

export default class GroupLeave extends BaseService {
    constructor($axios) {
        super($axios, APIs.GROUP_LEAVE);
    }
}