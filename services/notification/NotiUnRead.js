import * as APIs from "../../utils/endpoints";
import BaseService from "../BaseService";

export default class NotiUnRead extends BaseService {
    constructor($axios) {
        super($axios, APIs.NOTIFICATION_UNREAD);
    }
}