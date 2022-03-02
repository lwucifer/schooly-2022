import * as APIs from "~/utils/endpoints";
import BaseService from "~/services/BaseService";
import * as actionTypes from "~/utils/action-types";

export default class Repository extends BaseService {
  constructor($axios) {
    super($axios, APIs.ELEARNING_TEACHING_REPOSITORY);
  }

  async [actionTypes.REPOSITORY.INFO](payload = {}) {
    const { data } = await this.$axios.get(this.$api, payload);
  
    const result = data ? data : {};
    return result;
  }
}
