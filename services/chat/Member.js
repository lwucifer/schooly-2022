import * as APIs from "../../utils/endpoints";
import BaseService from "../BaseService";

export default class Member extends BaseService {
    constructor($axios) {
        super($axios, APIs.ROOM);
    }
}