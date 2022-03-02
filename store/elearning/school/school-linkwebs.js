import * as actionTypes from "../../../utils/action-types";
import * as mutationTypes from "../../../utils/mutation-types";
import LinkWebsite from "~/services/elearning/school/LinkWebsite";

/**
 * initial state
 */
const state = () => ({
  schoolLinkWebs: []
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.SCHOOL_LINK_WEBSITE.LIST]({ commit }, params) {
    try {
      const options = { params };
      const result = await new LinkWebsite(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      // set to mutation
      commit(mutationTypes.SCHOOL_LINK_WEBSITE.SET_SCHOOL_LINK_WEBSITE, result.data);
    } catch (error) {
      console.log("[School LinkWebs] list.error", error);
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.SCHOOL_LINK_WEBSITE.SET_SCHOOL_LINK_WEBSITE](state, schoolLinkWebs) {
    console.log("SET_SCHOOL_LINKWEBS_LIST", schoolLinkWebs);
    state.schoolLinkWebs = schoolLinkWebs;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};