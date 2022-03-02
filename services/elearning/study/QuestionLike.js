import * as APIs from "~/utils/endpoints";
import BaseService from "~/services//BaseService";

export default class QuestionLike extends BaseService {
  constructor($axios) {
    super($axios, APIs.STUDY_QUESTION_LIKE);
  }
}