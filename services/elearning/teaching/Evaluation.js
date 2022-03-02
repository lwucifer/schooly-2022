import * as APIs from "~/utils/endpoints";
import BaseService from "../../BaseService";
import * as actionTypes from "~/utils/action-types";

export default class Evaluation extends BaseService {
    constructor($axios) {
        super($axios, APIs.ELEARNING_TEACHING_EVALUATION);
    }
}