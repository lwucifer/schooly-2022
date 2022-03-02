import * as actionTypes from "~/utils/action-types";
import { RESPONSE_SUCCESS } from "~/utils/config";
import * as APIs from "~/utils/endpoints";
import * as mutationTypes from "~/utils/mutation-types";

/**
 * initial state
 */
const state = () => ({
  setting: null
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.SEMESTER.SETTING_VIEW]({ commit }, payload) {
    try {
      const { data } = await this.$axios.get(
        `${APIs.SETTING_EXAMS_VIEW}`, payload
      );
      console.log("[SEMESTER.SETTING_VIEW]", data.data);
      if (data.success == RESPONSE_SUCCESS) {
        commit(mutationTypes.SEMESTER.SET_SETTING, data.data);
      }
      return data;
    } catch (error) {
      console.log("[SEMESTER.SETTING_VIEW] error", error);
    }
  },

  async [actionTypes.SEMESTER.SETTING_POST]({ commit }, payload) {
    try {
      const { data } = await this.$axios.post(
        `${APIs.SETTING_EXAMS_VIEW}`,
        payload
      );
      console.log("[SEMESTER.SETTING_POST]", data.data, payload);
      return data;
    } catch (error) {
      console.log("[SEMESTER.SETTING_POST] error", error);
    }
  },
  
  async [actionTypes.SEMESTER.DELETE]({ commit }, payload) {
    try {
      const { data } = await this.$axios.post(
        `${APIs.SETTING_EXAMS_VIEW}`,
        payload
      );
      console.log("[SEMESTER.SETTING_POST]", data.data);
      return data;
    } catch (error) {
      console.log("[SEMESTER.SETTING_POST] error", error);
    }
  },

  
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.SEMESTER.SET_SETTING](state, _data) {
    state.setting = _data;
  },
  
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
