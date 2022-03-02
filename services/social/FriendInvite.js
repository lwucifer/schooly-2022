import * as APIs from "../../utils/endpoints";
import BaseService from "../BaseService";

export default class FriendInvite extends BaseService {
    constructor($axios) {
        super($axios, APIs.SOCIAL_FRIEND_INVITE);
    }
}