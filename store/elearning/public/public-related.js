import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Related from "~/services/elearning/public/Related";

/**
 * initial state
 */
const state = () => ({
  elearningRelated: []
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_PUBLIC_RELATED.LIST]({ commit }, params) {
    try {
      const options = { params };
      const result = await new Related(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      commit(
        mutationTypes.ELEARNING_PUBLIC_RELATED
          .SET_ELEARNING_PUBLIC_RELATED_LIST,
        result.data
      );
    } catch (error) {
      console.log("[Elearning related] list.error", error);
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_PUBLIC_RELATED.SET_ELEARNING_PUBLIC_RELATED_LIST](
    state,
    _elearningRelated
  ) {
    state.elearningRelated = _elearningRelated;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
