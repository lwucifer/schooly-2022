import * as APIs from "~/utils/endpoints";
import BaseService from "~/services/BaseService";
import * as actionTypes from "~/utils/action-types";

export default class Schedule extends BaseService {
  constructor($axios) {
    super($axios, APIs.TEACHING_MODIFY_SCHEDULE);
  }

  async [actionTypes.BASE.LIST](payload) {
    const { data } = await this.$axios.get(`/elearning/teaching/olclass/requests`, payload);

    const result = data ? data : {};
    return result;
  }

}
