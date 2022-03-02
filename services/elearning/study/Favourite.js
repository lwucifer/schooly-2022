import * as APIs from "~/utils/endpoints";
import BaseService from "~/services//BaseService";

export default class Favourite extends BaseService {
  constructor($axios) {
    super($axios, APIs.STUDY_FAVOURITE);
  }
}