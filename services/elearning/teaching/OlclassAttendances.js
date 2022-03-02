import * as APIs from "~/utils/endpoints";
import BaseService from "~/services/BaseService";

export default class Attendances extends BaseService {
  constructor($axios) {
    super($axios, APIs.TEACHING_OLCLASS_LESSON_ATTENDANCES);
  }
}
