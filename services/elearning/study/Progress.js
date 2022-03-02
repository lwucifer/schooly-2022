import * as APIs from "~/utils/endpoints";
import BaseService from "~/services//BaseService";

export default class Progress extends BaseService {
  constructor($axios) {
    super($axios, APIs.STUDY_ELEARNING_PROGRESS);
  }
}