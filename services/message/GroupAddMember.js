import * as APIs from "../../utils/endpoints";
import BaseService from "../BaseService";

export default class GroupAddMember extends BaseService {
    constructor($axios) {
        super($axios, APIs.GROUP_ADD_MEMBER);
    }
}