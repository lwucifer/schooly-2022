import * as APIs from "~/utils/endpoints";
import BaseService from "~/services/BaseService";

export default class Doc extends BaseService {
  constructor($axios) {
    super($axios, APIs.ELEARNING_CREATING_DOCS);
  }

  async deleteDoc(options) {
    const { data } = await this.$axios.delete(this.$api, options);
    const result = data ? data : {};
    return result;
  }
}
