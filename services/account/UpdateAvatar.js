import * as APIs from "../../utils/endpoints";
import BaseService from "../BaseService";

export default class UpdateAvatar extends BaseService {
    constructor($axios) {
        super($axios, APIs.PROFILE_AVATAR);
    }
}