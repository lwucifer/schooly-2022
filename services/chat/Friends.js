import * as APIs from "../../utils/endpoints";
import BaseService from "../BaseService";

export default class Friends extends BaseService {
  constructor($axios) {
    super($axios, APIs.SOCIAL_FRIENDS);
  }
}