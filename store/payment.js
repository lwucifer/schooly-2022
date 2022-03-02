import * as actionTypes from "~/utils/action-types";
import Payment from '~/services/Payment';

/**
 * initial state
 */
const state = () => ({
});

/**
 * initial getters
 */
const getters = {};

const actions = {
  /**
   * post to generate haskey transaction
   * 
   * {
      "again_link": "string",
      "title": "string",
      "vpc_access_code": "string",
      "vpc_amount": "string",
      "vpc_card_list": "string",
      "vpc_command": "string",
      "vpc_currency": "string",
      "vpc_customer_email": "string",
      "vpc_customer_id": "string",
      "vpc_customer_phone": "string",
      "vpc_locale": "string",
      "vpc_merch_txn_ref": "string",
      "vpc_merchant": "string",
      "vpc_order_info": "string",
      "vpc_return_url": "string",
      "vpc_secure_hash": "string",
      "vpc_ticket_no": "string",
      "vpc_txn_response_code": "string",
      "vpc_version": "string"
    }
   */
  async [actionTypes.PAYMENT.POST_HASHKEY]({ commit }, payload) {
    try {
      const result = await new Payment(this.$axios)[actionTypes.PAYMENT.POST_HASHKEY](
        payload
      );
      console.log("[POST_HASHKEY] list", result);
      return result;
    } catch (error) {
      console.log("[POST_HASHKEY] list.error", error);
      return error;
    }
  },

  /**
   * {
      "cost": 0,
      "method": "string",
      "note": "string",
      "orders": [
        {
          "elearning_id": "string",
          "price": 0
        }
      ]
    }
   * @param {*} param0 
   * @param {*} payload 
   */
  async [actionTypes.PAYMENT.POST_ORDER]({ commit }, payload) {
    try {
      const result = await new Payment(this.$axios)[actionTypes.PAYMENT.POST_ORDER](
        payload
      );
      console.log("[POST_ORDER] list", result);
      return result;
    } catch (error) {
      console.log("[POST_ORDER] list.error", error);
      return error;
    }
  },

  /**
   * {
        "vpc_amount": "string",
        "vpc_card": "string",
        "vpc_card_uid": "string",
        "vpc_command": "string",
        "vpc_currency_code": "string",
        "vpc_locale": "string",
        "vpc_merch_txn_ref": "string",
        "vpc_merchant": "string",
        "vpc_message": "string",
        "vpc_order_info": "string",
        "vpc_pay_channel": "string",
        "vpc_secure_hash": "string",
        "vpc_transaction_no": "string",
        "vpc_txn_response_code": "string"
      }
   * @param {*} param0 
   * @param {*} payload 
   */
  async [actionTypes.PAYMENT.VALIDATE_TRANSACTION]({ commit }, payload) {
    try {
      const result = await new Payment(this.$axios)[actionTypes.PAYMENT.VALIDATE_TRANSACTION](
        payload
      );
      console.log("[VALIDATE_TRANSACTION] list", result);
      return result;
    } catch (error) {
      console.log("[VALIDATE_TRANSACTION] list.error", error);
      return error;
    }
  },

  async [actionTypes.PAYMENT.REPAY]({ commit }, payload) {
    try {
      const result = await new Payment(this.$axios)[actionTypes.PAYMENT.REPAY](
        payload
      );
      console.log("[REPAY] result", result);
      return result;
    } catch (error) {
      console.log("[REPAY] error", error);
      return error;
    }
  },

  async [actionTypes.PAYMENT.CANCEL_PAY]({ commit }, payload) {
    try {
      const result = await new Payment(this.$axios)[actionTypes.PAYMENT.CANCEL_PAY](
        payload
      );
      console.log("[CANCEL_PAY] result", result);
      return result;
    } catch (error) {
      console.log("[CANCEL_PAY] error", error);
      return error;
    }
  },

};

/**
 * initial mutations
 */
const mutations = {
  // [mutationTypes.ELEARNING_SUMMARY.SET_ELEARNING_SUMMARY_LIST](
  //   state,
  //   _earningSummaryList
  // ) {
  //   console.log("SET_EARNING_SUMMARY_LIST", _earningSummaryList);
  //   state.earningSummaryList = _earningSummaryList;
  // }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
