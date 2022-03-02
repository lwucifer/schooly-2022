import * as APIs from "../../utils/endpoints";
import BaseService from "../BaseService";

export default class SocialFollow extends BaseService {
    constructor($axios) {
        super($axios, APIs.SOCIAL_FOLLOW);
    }
}