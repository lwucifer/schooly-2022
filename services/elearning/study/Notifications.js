import * as APIs from "~/utils/endpoints";
import BaseService from "~/services//BaseService";
import * as actionTypes from "~/utils/action-types";
export default class Notifications extends BaseService {
  constructor($axios) {
    super($axios, APIs.NOTIFICATIONS_HEADER);
  }

  async [actionTypes.HEADER_NOTIFICATIONS.LIST](params) {
    const { data } = await this.$axios.request({
      url: APIs.NOTIFICATIONS_HEADER,
      method: "GET",
      params,
    });
    return data;
  }

  async [actionTypes.HEADER_NOTIFICATIONS.LIST_COUNT](params) {
    const { data } = await this.$axios.request({
      url: APIs.COUNT_NOTIFICATIONS_HEADER,
      method: "GET",
      params,
    });
    return data;
  }

  async [actionTypes.HEADER_NOTIFICATIONS.CHECK_IS_READ_NOTIFICATION](payload) {
    const { data } = await this.$axios.put(`${APIs.NOTIFICATIONS_HEADER}`, payload);
    return data;
  }

  async [actionTypes.HEADER_NOTIFICATIONS.DELETE](id, payload) {
    console.log(payload);
    const { data } = await this.$axios.request({
      url: `${APIs.NOTIFICATIONS_HEADER}/${id}`,
      data: payload,
      method: "DELETE",
      // headers: {
      //   "sc-response-format": "v1",
      // },
    });
    return data;
  }
}