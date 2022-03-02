import * as APIs from "../../utils/endpoints";
import BaseService from "../BaseService";

export default class MessageType extends BaseService {
    constructor($axios) {
        super($axios, APIs.MESSAGE_TYPE);
    }
}