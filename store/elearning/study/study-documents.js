import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import { get } from "lodash";
import { RESPONSE_SUCCESS } from "~/utils/config";
import * as APIs from "~/utils/endpoints";

/**
 * initial state
 */
const state = () => ({
  documents: [],
})

/**
 * initial getters
 */
const getters = {
  myDocsContent(state){
    return !state.documents ? [] : state.documents.content;
  },
  myDocsPagination(state){
    return !state.documents ? {} : state.documents.page;
  }
};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.STUDY_DOCS.LIST]({ commit }, payload) {
    try {
      const { data } = await this.$axios.get(`${APIs.STUDY_DOCS}`, {
        params: payload
      });
      console.log("[STUDY_DOCS.LIST]", data.data);
      if (data.success == RESPONSE_SUCCESS) {
        commit(mutationTypes.STUDY_DOCS.SET_STUDY_DOCS, data.data);
      }
      return data;
    } catch (error) {
      console.log("[STUDY_DOCS.LIST] error", error);
    }
  },

};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.STUDY_DOCS.SET_STUDY_DOCS](state, _data) {
    state.documents = _data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
