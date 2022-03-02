import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";

/**
 * initial state
 */
const state = () => ({
  breadcrumb: [],
  titlePg: ''
});

/**
 * initial getters
 */
const getters = {
  breadcrumb: state => {
    return state.breadcrumb
  },
  titlePg: state => {
    return state.titlePg
  }
};

const actions = {
  
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.COMMON.SET_BREADCRUMB](state, data) {
    console.log('state.breadcrumb', data)
    state.breadcrumb = data
  },
  [mutationTypes.COMMON.SET_TITLE_PAGE](state, data) {
    console.log('state.titlePg', data)
    state.titlePg = data
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
