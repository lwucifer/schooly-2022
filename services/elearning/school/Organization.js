import * as APIs from "../../../utils/endpoints";
import BaseService from "../../BaseService";
import * as actionTypes from "~/utils/action-types";

export default class News extends BaseService {
    constructor($axios) {
        super($axios, APIs.SCHOOL_ORG_INTRO);
    }
    async [actionTypes.BASE.DETAIL](id) {
        const { data } = await this.$axios.get(`${this.$api}/${id}/intro`);

        const result = data ? data : {};

        // console.log("[BASE.DETAIL]", result);

        return result;
    }

}