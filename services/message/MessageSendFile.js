import * as APIs from "../../utils/endpoints";
import BaseService from "../BaseService";

export default class MessageSendFile extends BaseService {
    constructor($axios) {
        super($axios, APIs.MESSAGE_SEND_FILE);
    }
}