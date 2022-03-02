import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import { get } from "lodash";
import { RESPONSE_SUCCESS } from "~/utils/config";
import * as APIs from "~/utils/endpoints";
import Doc from "~/services/elearning/teaching/Doc";

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
    return !state.documents ? [] : state.documents.data.content;
  },
  myDocsPagination(state){
    return !state.documents ? {} : state.documents.data.page;
  }
};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.TEACHING_DOC.ADD]({ commit }, payload) {
    try {
      const result = await new Doc(this.$axios)['postWithFormData'](payload);
      return result;
    } catch (error) {
      console.log("[TEACHING_DOC Add] Add.error", error);
    }
  },

  async [actionTypes.TEACHING_DOCS.LIST]({ commit }, payload) {
    try {
      const { data } = await this.$axios.get(`${APIs.TEACHING_DOCS}`, {
        params: payload
      });
      console.log("[TEACHING_DOCS.LIST]", data.data);
      if (data.success == RESPONSE_SUCCESS) {
        commit(mutationTypes.TEACHING_DOCS.SET_TEACHING_DOCS, data.data);
      }
      return data;
    } catch (error) {
      console.log("[TEACHING_DOCS.LIST] error", error);
    }
  },

  async [actionTypes.TEACHING_DOC.DELETE]({ commit }, payload) {
    try {
      const result = await new Doc(this.$axios)[actionTypes.BASE.DELETE_PAYLOAD2](payload);
      return result;
    } catch (error) {
      console.log("[TEACHING_DOC DELETE] DELETE.error", error);
    }
  },

};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.TEACHING_DOCS.SET_TEACHING_DOCS](state, _data) {
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
