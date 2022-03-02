import * as APIs from "~/utils/endpoints";
import BaseService from "../../BaseService";

export default class SettingTest extends BaseService {
  constructor($axios) {
    super($axios, APIs.SETTING_EXAMS_POST);
  }
}