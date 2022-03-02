import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Program from "~/services/elearning/public/Program";

/**
 * initial state
 */
const state = () => ({
  elearningProgram: {}
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_PUBLIC_PROGRAM.LIST]({ commit }, elearning_id) {
    try {
      const payload = { params: { elearning_id } };
      const result = await new Program(this.$axios)[actionTypes.BASE.LIST](
        payload
      );
      commit(
        mutationTypes.ELEARNING_PUBLIC_PROGRAM.SET_ELEARNING_PUBLIC_PROGRAM_LIST,
        result.data
      );
    } catch (error) {
      console.log("[Elearning] Program.error", error);
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_PUBLIC_PROGRAM.SET_ELEARNING_PUBLIC_PROGRAM_LIST](
    state,
    _elearningProgram
  ) {
    state.elearningProgram = _elearningProgram;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
