import * as APIs from "~/utils/endpoints";
import BaseService from "~/services/BaseService";
import * as actionTypes from "~/utils/action-types";

export default class RepositoryFile extends BaseService {
  constructor($axios) {
    super($axios, APIs.ELEARNING_TEACHING_REPOSITORY_FILE);
  }

  async [actionTypes.BASE.DELETE](payload) {
    const { data } = await this.$axios.delete(this.$api, payload);
    return data;
  }

  async [actionTypes.BASE.ADD](payload, config = {}) {
    const { data } = await this.$axios.post(this.$api, payload, config);

    return data;
  }
}
