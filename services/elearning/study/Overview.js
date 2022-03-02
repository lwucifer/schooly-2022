import * as APIs from "~/utils/endpoints";
import BaseService from "~/services//BaseService";
import { ELEARNING_STURY_OVERVIEW } from "~/utils/action-types";

export default class Overview extends BaseService {
  constructor($axios) {
    super($axios, APIs.STUDY_MY_ELEARNING);
  }
  async [ELEARNING_STURY_OVERVIEW.OVERVIEW_BASE_SERVICE](params) {
    const { data } = await this.$axios.request({
      url: APIs.STUDY_OVERVIEW,
      method: "GET",
      params,
    });
    return data;
  }

  async [ELEARNING_STURY_OVERVIEW.TIME_TABLE_BASE_SERVICE](params) {
    const { data } = await this.$axios.request({
      url: APIs.STUDY_OVERVIEW_TIME_TABLE,
      method: "GET",
      params,
    });
    return data;
  }

  async [ELEARNING_STURY_OVERVIEW.DEADLINE_BASE_SERVICE](params) {
    const { data } = await this.$axios.request({
      url: APIs.STUDY_OVERVIEW_DEADLINE,
      method: "GET",
      params,
    });
    return data;
  }
}