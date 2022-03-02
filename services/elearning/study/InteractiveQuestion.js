import * as APIs from "~/utils/endpoints";
import BaseService from "~/services//BaseService";

export default class InteractiveQuestion extends BaseService {
  constructor($axios) {
    super($axios, APIs.STUDY_INTERACTIVE_QUESTION);
  }

  async addQuestion(params, image = "") {
    let formData = new FormData();
    formData.append("image", image);
    let options = {
      url: APIs.STUDY_INTERACTIVE_QUESTION_ADD,
      method: "POST",
      params,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    if (image) options.data = formData;
    const { data } = await this.$axios.request(options);
    return data;
  }

  async editQuestion(payload) {
    const { data } = await this.$axios.post(APIs.STUDY_INTERACTIVE_QUESTION_ADD, payload);
    return data;
  }

  async deleteQuestion(payload) {
    const { data } = await this.$axios.request({
      url: `${APIs.STUDY_INTERACTIVE_QUESTION_ADD}/${payload.question_id}`,
      method: "DELETE",
    });
    return data;
  }
}
