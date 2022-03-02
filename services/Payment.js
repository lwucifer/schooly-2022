import * as actionTypes from "~/utils/action-types";
import * as APIs from "../utils/endpoints";
import BaseService from "./BaseService";

export default class Payment extends BaseService {
  constructor($axios) {
    super($axios, null);
  }

  /**
   * Step 2: request to get hashkey
   * @param {*} payload
   */
  async [actionTypes.PAYMENT.POST_HASHKEY](payload) {
    console.log("[Payment][POST_HASHKEY]", payload);
    const { data } = await this.$axios.post(`${APIs.PAYMENT_HASHKEY}`, payload);
    const result = data ? data : {};
    return result;
  }

  /**
   * Step 7: validate result from OnePay and update result
   * @param {*} payload
   */
  async [actionTypes.PAYMENT.VALIDATE_TRANSACTION](payload) {
    const { data } = await this.$axios.post(
      `${APIs.PAYMENT_VALIDATE_TRANSACTION}`,
      payload
    );
    const result = data ? data : {};
    return result;
  }
  /**
   * Step 1: click buy elearning
   * @param {*} payload
   */
  async [actionTypes.PAYMENT.POST_ORDER](payload) {
    console.log("[Payment][VALIDATE_TRANSACTION]", payload);
    const { data } = await this.$axios.post(
      `${APIs.PAYMENT_CREATE_ORDER}`,
      payload
    );
    const result = data ? data : {};
    return result;
  }

  /**
   * to repay if order is pending
   * @param {RePayReq} payload 
   */
  async [actionTypes.PAYMENT.REPAY](payload) {
    console.log("[Payment][REPAY]", payload);
    const { data } = await this.$axios.post(
      `${APIs.PAYMENT_REPAY}`,
      payload
    );
    const result = data ? data : {};
    return result;
  }

  /**
   * to cancel if order is pending
   * @param {RePayReq} payload 
   */
  async [actionTypes.PAYMENT.CANCEL_PAY](transactionId) {
    console.log("[Payment][CANCEL_PAY]", transactionId);
    const { data } = await this.$axios.post(`${APIs.PAYMENT_CANCEL}/${transactionId}`);
    const result = data ? data : {};
    return result;
  }
}
