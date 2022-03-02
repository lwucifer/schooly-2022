import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Info from "~/services/elearning/public/Info";

/**
 * initial state
 */
const state = () => ({
  elearningInfo: {}
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_PUBLIC_INFO.LIST]({ commit }, payload) {
    try {
      // const payload = { params: { elearning_id } };
      const result = await new Info(this.$axios, payload)[actionTypes.BASE.LIST](
        payload
      );
      console.log("[Elearning] info", result);
      // set to mutation
      commit(
        mutationTypes.ELEARNING_PUBLIC_INFO.SET_ELEARNING_PUBLIC_INFO_LIST,
        result.data
      );
      return result;
    } catch (error) {
      console.log("[Elearning] info.error", error);
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_PUBLIC_INFO.SET_ELEARNING_PUBLIC_INFO_LIST](
    state,
    _elearningInfo
  ) {
    console.log("SET_ELEARNING_PUBLIC_INFO_LIST", _elearningInfo);
    state.elearningInfo = _elearningInfo;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
