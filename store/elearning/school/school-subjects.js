import * as actionTypes from "../../../utils/action-types";
import * as mutationTypes from "../../../utils/mutation-types";
import Subjects from "~/services/elearning/school/Subjects";

/**
 * initial state
 */
const state = () => ({
  schoolSubjects: []
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
    async [actionTypes.SCHOOL_SUBJECTS.LIST]({ commit }, params) {
      try {
        const result = await new Subjects(this.$axios)[actionTypes.BASE.DETAIL](
          params.id
        );
        // set to mutation
        commit(mutationTypes.SCHOOL_SUBJECTS.SET_SCHOOL_SUBJECTS, result.data);
      } catch (error) {
        console.log("[School Subject] list.error", error);
      }
    },
  
  };

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.SCHOOL_SUBJECTS.SET_SCHOOL_SUBJECTS](state, schoolSubjects) {
    console.log("SET_SCHOOL_SUBJECTS", schoolSubjects);
    state.schoolSubjects = schoolSubjects;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};