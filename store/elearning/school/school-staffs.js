import * as actionTypes from "../../../utils/action-types";
import * as mutationTypes from "../../../utils/mutation-types";
import Staffs from "~/services/elearning/school/Staffs";

/**
 * initial state
 */
const state = () => ({
  schoolStaffs: []
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.SCHOOL_STAFFS.LIST]({ commit }, params) {
    try {
      const options = { params };
      const result = await new Staffs(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      // set to mutation
      commit(mutationTypes.SCHOOL_STAFFS.SET_SCHOOL_STAFFS, result.data);
    } catch (error) {
      console.log("[School Staffs] list.error", error);
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.SCHOOL_STAFFS.SET_SCHOOL_STAFFS](state, schoolStaffs) {
    console.log("SET_SCHOOL_STAFFS_LIST", schoolStaffs);
    state.schoolStaffs = schoolStaffs;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
