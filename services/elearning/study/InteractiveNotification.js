import * as APIs from "~/utils/endpoints";
import BaseService from "~/services//BaseService";

export default class InteractiveNotification extends BaseService {
  constructor($axios) {
    super($axios, APIs.STUDY_INTERACTIVE_NOTIFICATION);
  }
}
