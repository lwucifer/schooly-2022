import * as APIs from "../../utils/endpoints";
import BaseService from "../BaseService";

export default class Message extends BaseService {
    constructor($axios) {
        super($axios, APIs.MESSAGE);
    }
}