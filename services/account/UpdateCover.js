import * as APIs from "../../utils/endpoints";
import BaseService from "../BaseService";

export default class UpdateCover extends BaseService {
    constructor($axios) {
        super($axios, APIs.UPDATE_COVER);
    }
}