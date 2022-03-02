import * as APIs from "~/utils/endpoints";
import BaseService from "~/services/BaseService";

export default class HighlightEls extends BaseService {
    constructor($axios) {
        super($axios, APIs.TEACHING_STATISTIC_HIGHLIGHT_ELS);
    }
}