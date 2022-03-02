import * as APIs from "~/utils/endpoints";
import BaseService from "../../BaseService";
import * as actionTypes from "~/utils/action-types";

export default class Result extends BaseService {
    constructor($axios) {
        super($axios, APIs.ELEARNING_TEACHING_RESULT);
    }
    
    async [actionTypes.BASE.DETAIL](payload) {
        const { data } = await this.$axios.get(this.$api, payload);
        
        const result = data ? data : {};
        return result;
    }
}