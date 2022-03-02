import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import TeachingClass from "~/services/elearning/teaching/TeachingClass";
import { allOptionSelect } from "~/utils/common";
import * as APIs from "~/utils/endpoints";
/**
 * initial state
 */
const state = () => ({
  classes: [],
  classesAll: []
});

/**
 * initial getters
 */
const getters = {
  // classesOpts(state) {
  //   const tmp = state.classesAll ? state.classesAll.map((s) => {
  //     return {
  //       value: s.id,
  //       text: s.name,
  //       type: s.type,
  //     };
  //   }) : [];

  //   // return tmp;
  //   return allOptionSelect(tmp, '');
  // },
};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_TEACHING_CLASS.LIST]({ commit }, payload) {
    try {
      const result = await new TeachingClass(this.$axios)[actionTypes.BASE.LIST](
        payload
      );
      // set to mutation
      commit(mutationTypes.ELEARNING_TEACHING_CLASS.SET_TEACHING_CLASS_LIST, result);
    } catch (error) {
      console.log("[Teaching classes] list.error", error);
    }
  },
  async [actionTypes.ELEARNING_TEACHING_CLASS.CLASS_ALL]({ commit }, params) {
    try {
      return this.$axios
        .get(APIs.COMMON_CLASS, params)
        .then((res) => res.data)
        .then((result) => {
          console.log('ELEARNING_TEACHING_CLASS.CLASS_ALL', result)
          commit(mutationTypes.ELEARNING_TEACHING_CLASS.SET_CLASS_ALL, result.data);
          return result;
        });
    } catch (err) {
      console.log("[ELEARNING_TEACHING_CLASS.CLASS_ALL] err", err);
      return err;
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_TEACHING_CLASS.SET_TEACHING_CLASS_LIST](state, data) {
    console.log("SET_ELEARNING_TEACHING_CLASS_LIST", data);
    state.classes = data;
  },
  [mutationTypes.ELEARNING_TEACHING_CLASS.SET_CLASS_ALL](state, data) {
    console.log("SET_ELEARNING_TEACHING_CLASS_LIST", data);
    state.classesAll = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
