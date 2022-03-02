import * as actionTypes from "../../../utils/action-types";
import * as mutationTypes from "../../../utils/mutation-types";
import Student from "~/services/elearning/school/Student";

/**
 * initial state
 */
const state = () => ({
  schoolStudents: []
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.SCHOOL_STUDENTS.LIST]({ commit }, params) {
    try {
      const options = { params };
      const result = await new Student(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      // set to mutation
      commit(mutationTypes.SCHOOL_STUDENTS.SET_SCHOOL_STUDENTS_LIST, result);
    } catch (error) {
      console.log("[School Students] list.error", error);
    }
  },

  async [actionTypes.SCHOOL_STUDENTS.ADD]({ commit }, payload) {
    try {
      const result = await new Student(this.$axios)[actionTypes.BASE.ADD](
        payload
      );
      // set to mutation
      // commit(mutationTypes.SCHOOL_CLASSES.SET_SCHOOL_CLASSES_LIST, result);
    } catch (error) {
      console.log("[School Students] add.error", error);
    }
  },

  async [actionTypes.SCHOOL_STUDENTS.EDIT]({ commit }, payload) {
    try {
      const result = await new Student(this.$axios)[actionTypes.BASE.EDIT](
        payload
      );
      // set to mutation
      // commit(mutationTypes.SCHOOL_CLASSES.SET_SCHOOL_CLASSES_LIST, result);
    } catch (error) {
      console.log("[School Students] edit.error", error);
    }
  },

  async [actionTypes.SCHOOL_STUDENTS.DELETE]({ commit }, payload) {
    try {
      const result = await new Student(this.$axios)[actionTypes.BASE.DELETE](
        payload
      );
      // set to mutation
      // commit(mutationTypes.SCHOOL_CLASSES.SET_SCHOOL_CLASSES_LIST, result);
    } catch (error) {
      console.log("[School Classes] delete.error", error);
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.SCHOOL_STUDENTS.SET_SCHOOL_STUDENTS_LIST](state, schoolStudents) {
    console.log("SET_SCHOOL_STUDENTS_LIST", schoolStudents);
    state.schoolStudents = schoolStudents;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
