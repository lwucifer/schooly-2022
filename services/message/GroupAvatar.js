import * as APIs from "../../utils/endpoints";
import BaseService from "../BaseService";

export default class GroupAvatar extends BaseService {
    constructor($axios) {
        super($axios, APIs.GROUP_AVATAR);
    }
}