import * as mutationTypes from "../utils/mutation-types";

/**
 * initial state
 */
const state = () => ({
  keywordSearchHeader: '',
  checkRouteClearKeyword: ''
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  //
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.KEYWORD.SEARCH_HEADER](state, _keyword) {
    state.keywordSearchHeader = _keyword;
  },

  [mutationTypes.KEYWORD.CHECK_ROUTE_CLEAR_KEYWORK](state, _route) {
    state.checkRouteClearKeyword = _route;
  },

};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
