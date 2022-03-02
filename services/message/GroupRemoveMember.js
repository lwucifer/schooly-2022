import * as APIs from "../../utils/endpoints";
import BaseService from "../BaseService";

export default class GroupRemoveMember extends BaseService {
    constructor($axios) {
        super($axios, APIs.GROUP_REMOVE_MEMBER);
    }
}