import * as APIs from "../../utils/endpoints";
import BaseService from "../BaseService";

export default class Notifications extends BaseService {
    constructor($axios) {
        super($axios, APIs.NOTIFICATIONS);
    }
}