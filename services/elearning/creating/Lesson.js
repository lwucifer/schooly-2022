import * as APIs from "~/utils/endpoints";
import BaseService from "~/services/BaseService";

export default class Lesson extends BaseService {
  constructor($axios) {
    super($axios, APIs.ELEARNING_CREATING_LESSONS);
  }

  async deleteLesson(options) {
    const { data } = await this.$axios.delete(`${this.$api}`, options);
    return data;
  }
}
