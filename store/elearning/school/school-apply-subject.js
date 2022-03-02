import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import { RESPONSE_SUCCESS } from "~/utils/config";
import * as APIs from "~/utils/endpoints";

/**
 * initial state
 */
const state = () => ({
  subjects: []
});

/**
 * initial getters
 */
const getters = {
};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.SCHOOL_APPLY_SUBJECTS.LIST]({ commit }, payload) {
    try {
      const { data } = await this.$axios.get(`${APIs.SCHOOL_APPLY_SUBJECTS}`, {
        params: payload
      });
      console.log("[SCHOOL_APPLY_SUBJECTS.LIST]", data.data);
      if (data.success == RESPONSE_SUCCESS) {
        commit(mutationTypes.SCHOOL_APPLY_SUBJECTS.SET_LIST, data.data);
      }
      return data;
    } catch (error) {
      console.log("[SCHOOL_APPLY_SUBJECTS.LIST] error", error);
    }
  },

};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.SCHOOL_APPLY_SUBJECTS.SET_LIST](state, _data) {
    state.subjects = _data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
