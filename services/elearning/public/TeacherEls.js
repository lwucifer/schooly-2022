import * as APIs from "~/utils/endpoints";
import BaseService from "~/services/BaseService";

export default class TeacherEls extends BaseService {
  constructor($axios) {
    super($axios, APIs.ELEARNING_PUBLIC_TEACHER_ELS);
  }
}
