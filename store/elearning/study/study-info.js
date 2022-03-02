import InfoService from "~/services/elearning/study/Info";
import * as actionTypes from "~/utils/action-types";
import { RESPONSE_SUCCESS } from "~/utils/config";
import * as mutationTypes from "~/utils/mutation-types";

/**
 * initial state
 */
const state = () => ({
  info: null,
});

/**
 * initial getters
 */
const getters = {
  //
};

const actions = {
  async [actionTypes.ELEARNING_STUDY_INFO.LIST]({ commit }, payload) {
    try {
      const result = await new InfoService(this.$axios)[
        actionTypes.BASE.LIST
      ](payload);

      if (result.success == RESPONSE_SUCCESS) {
        // console.log("[ELEARNING_STUDY_INFO.LIST]", result.data);
        commit(
          mutationTypes.ELEARNING_INFO.SET_ELEARNING_INFO,
          result.data
        );
      }
      return result;
    } catch (error) {
      //
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_INFO.SET_ELEARNING_INFO](
    state,
    _info
  ) {
    state.info = _info;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
