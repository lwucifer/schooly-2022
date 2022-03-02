import * as actionTypes from "~/utils/action-types";
import * as APIs from "~/utils/endpoints";
import * as mutationTypes from "~/utils/mutation-types";
import qs from 'qs';

/**
 * initial state
 */
const state = () => ({
  teachingClgrStudentList: {}
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.TEACHING_CLGR_STUDENT.GET_TEACHING_CLGR_STUDENT](
    { commit },
    params
  ) {
    try {
      return this.$axios
        .get(APIs.TEACHING_CLGR_STUDENT, { params })
        .then(res => res.data)
        .then(result => {
          console.log("TEACHING_CLGR_STUDENT", result);
          commit(
            mutationTypes.TEACHING_CLGR_STUDENT.SET_TEACHING_CLGR_STUDENT_LIST,
            result.data
          );
          return result;
        });
    } catch (err) {
      console.log("[TEACHING_CLGR_STUDENT] err", err);
      return err;
    }
  },

  async [actionTypes.TEACHING_CLGR_STUDENT.EXPORT]({ commit }, payload) {
    try {
      const { data } = await this.$axios.get(
        `${APIs.TEACHING_CLGR_STUDENT_EXPORT}?${qs.stringify(payload)}`,
        { responseType: "arraybuffer" }
      );
      console.log("[TEACHING_CLGR_STUDENT.EXPORT]", data);
      return data;
    } catch (error) {
      console.log("[TEACHING_CLGR_STUDENT.EXPORT] error", error);
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.TEACHING_CLGR_STUDENT.SET_TEACHING_CLGR_STUDENT_LIST](
    state,
    _data
  ) {
    state.teachingClgrStudentList = _data;
  },
  [mutationTypes.TEACHING_CLGR_STUDENT.SET_STUDENT_SORT](state, _data) {
    state.teachingClgrStudentList.content = state.teachingClgrStudentList.content.reverse();
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
