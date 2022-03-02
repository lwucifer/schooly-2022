import * as APIs from "../../utils/endpoints";
import BaseService from "../BaseService";

export default class RegisterDevice extends BaseService {
    constructor($axios) {
        super($axios, APIs.REGISTER_DEVICE);
    }
}