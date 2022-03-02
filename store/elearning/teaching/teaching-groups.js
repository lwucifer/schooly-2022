import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import { get } from "lodash";
import { RESPONSE_SUCCESS } from "~/utils/config";
import * as APIs from "~/utils/endpoints";

/**
 * initial state
 */
const state = () => ({
  groups: [],
})

/**
 * initial getters
 */
const getters = {
};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.TEACHING_GROUPS.LIST]({ commit }, payload) {
    try {
      const { data } = await this.$axios.get(`${APIs.ELEARNING_TEACHING_GROUPS}`, {
        params: payload
      });
      console.log("[TEACHING_GROUPS.LIST]", data.data);
      if (data.success == RESPONSE_SUCCESS) {
        commit(mutationTypes.TEACHING_GROUPS.SET_TEACHING_GROUPS, data.data);
      }
      return data;
    } catch (error) {
      console.log("[TEACHING_GROUPS.LIST] error", error);
    }
  },

};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.TEACHING_GROUPS.SET_TEACHING_GROUPS](state, _data) {
    state.groups = _data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
