import * as APIs from "~/utils/endpoints";
import BaseService from "~/services//BaseService";

export default class ExerciseElearning extends BaseService {
  constructor($axios) {
    super($axios, APIs.STUDY_EXERCISE_ELEARNING);
  }
}