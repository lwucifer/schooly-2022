import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import * as APIs from "~/utils/endpoints";

/**
 * initial state
 */
const state = () => ({
  getListUploadExam: {},
});

/**
 * initial getters
 */
const getters = {
};

const actions = {
  async [actionTypes.UPLOAD_EXAM.LIST]({ commit }, params) {
    try {
      return await this.$axios({
        url: `${APIs.UPLOAD_EXAM}`,
        method: "GET",
        params,
      }).then((res) => res.data)
        .then((result) => {
          if (result.success) {
            commit(mutationTypes.UPLOAD_EXAM.SET_UPLOAD_EXAM, result.data);
          }
          return result;
        });
    } catch (error) {
      console.log("[UPLOAD_EXAM] list", error);
    }
  },

  async [actionTypes.UPLOAD_EXAM.ADD]({ commit }, payload) {
    try {
      return this.$axios.post(`${APIs.UPLOAD_EXAM}`, payload).then((res) => res.data)
        .then((result) => {
          console.log("[UPLOAD_EXAM.ADD]", result);
          return result;
        })
    } catch (error) {
      console.log("[UPLOAD_EXAM.ADD.error", error);
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.UPLOAD_EXAM.SET_UPLOAD_EXAM](state, _data) {
    state.getListUploadExam = _data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
