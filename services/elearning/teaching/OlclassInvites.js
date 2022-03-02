import * as APIs from "~/utils/endpoints";
import BaseService from "~/services/BaseService";

export default class Invites extends BaseService {
  constructor($axios) {
    super($axios, APIs.TEACHING_OLCLASS_INVITES);
  }
}
