import * as APIs from "~/utils/endpoints";
import BaseService from "../../BaseService";
import * as actionTypes from "~/utils/action-types";

export default class InteractiveAnnouncement extends BaseService {
    constructor($axios) {
        super($axios, APIs.TEACHING_INTERACTIVE_ANNOUNCEMENTS);
    }
    async [actionTypes.BASE.DELETE](payload) {
        const { data } = await this.$axios.delete(this.$api, payload);
        return data;
     }
}
export class InteractiveAddAnnouncement extends BaseService {
    constructor($axios) {
        super($axios, APIs.TEACHING_INTERACTIVE_ADD_ANNOUNCEMENT);
    }
}