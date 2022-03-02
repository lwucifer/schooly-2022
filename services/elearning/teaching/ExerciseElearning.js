import * as APIs from "~/utils/endpoints";
import BaseService from "../../BaseService";

export default class ExerciseElearning extends BaseService {
    constructor($axios) {
        super($axios, APIs.ELEARNING_TEACHING_EXERCISE_ELEARNING);
    }
}