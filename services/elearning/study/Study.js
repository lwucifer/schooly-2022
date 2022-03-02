import * as APIs from "~/utils/endpoints";
import BaseService from "~/services//BaseService";

export default class Study extends BaseService {
  constructor($axios) {
    super($axios, APIs.STUDY_MY_ELEARNING);
  }

  async studyLesson(elearning_id, lesson_id) {
    const { data } = await this.$axios.request({
      url: `${APIs.STUDY_LESSON}/elearning/${elearning_id}/lesson/${lesson_id}/vod`,
      method: "GET",
    });
    return data;
  }
}
