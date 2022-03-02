import * as actionTypes from "../../../utils/action-types";
import * as mutationTypes from "../../../utils/mutation-types";
import Organization from "~/services/elearning/school/Organization";

/**
 * initial state
 */
const state = () => ({
    schoolOrganization: []
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.SCHOOL_ORGANIZATION.LIST]({ commit }, params) {
    try {
      const result = await new Organization(this.$axios)[actionTypes.BASE.DETAIL](
        params.id
      );
      // set to mutation
      commit(mutationTypes.SCHOOL_ORGANIZATION.SET_SCHOOL_ORGANIZATION, result.data);
    } catch (error) {
      console.log("[School Organization] list.error", error);
    }
  },

};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.SCHOOL_ORGANIZATION.SET_SCHOOL_ORGANIZATION](state, schoolOrganization) {
    console.log("SET_SCHOOL_ORGANIZATION", schoolOrganization);
    state.schoolOrganization = schoolOrganization;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
