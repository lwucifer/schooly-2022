import * as APIs from "../../utils/endpoints";
import BaseService from "../BaseService";

export default class SocialFeed extends BaseService {
    constructor($axios) {
        super($axios, APIs.FEED);
    }
}