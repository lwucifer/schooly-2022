import * as APIs from "~/utils/endpoints";
import BaseService from "~/services/BaseService";

export default class TimeTable extends BaseService {
  constructor($axios) {
    super($axios, APIs.ELEARNING_STUDY_TIMETABLE);
  }
}