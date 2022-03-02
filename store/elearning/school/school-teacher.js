import * as actionTypes from "../../../utils/action-types";
import * as mutationTypes from "../../../utils/mutation-types";
import Teacher from "~/services/elearning/school/Teacher";

/**
 * initial state
 */
const state = () => ({
  schoolTeachers: []
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.SCHOOL_TEACHERS.LIST]({ commit }, params) {
    try {
      const options = { params };
      const result = await new Teacher(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      // set to mutation
      commit(mutationTypes.SCHOOL_TEACHERS.SET_SCHOOL_TEACHERS_LIST, result);
    } catch (error) {
      console.log("[School Students] list.error", error);
    }
  },

  async [actionTypes.SCHOOL_TEACHERS.ADD]({ commit }, payload) {
    try {
      const result = await new Teacher(this.$axios)[actionTypes.BASE.ADD](
        payload
      );
      // set to mutation
      // commit(mutationTypes.SCHOOL_CLASSES.SET_SCHOOL_CLASSES_LIST, result);
    } catch (error) {
      console.log("[School Teachers] add.error", error);
    }
  },

  async [actionTypes.SCHOOL_TEACHERS.EDIT]({ commit }, payload) {
    try {
      const result = await new Teacher(this.$axios)[actionTypes.BASE.EDIT](
        payload
      );
      // set to mutation
      // commit(mutationTypes.SCHOOL_CLASSES.SET_SCHOOL_CLASSES_LIST, result);
    } catch (error) {
      console.log("[School Teachers] edit.error", error);
    }
  },

  async [actionTypes.SCHOOL_TEACHERS.DELETE]({ commit }, payload) {
    try {
      const result = await new Teacher(this.$axios)[actionTypes.BASE.DELETE](
        payload
      );
      // set to mutation
      // commit(mutationTypes.SCHOOL_CLASSES.SET_SCHOOL_CLASSES_LIST, result);
    } catch (error) {
      console.log("[School Teachers] delete.error", error);
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.SCHOOL_TEACHERS.SET_SCHOOL_TEACHERS_LIST](state, schoolTeachers) {
    console.log("SET_SCHOOL_TEACHERS_LIST", schoolTeachers);
    state.schoolTeachers = schoolTeachers;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
