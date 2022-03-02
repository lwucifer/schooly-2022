import * as actionTypes from "../../../utils/action-types";
import * as mutationTypes from "../../../utils/mutation-types";
import Classes from "~/services/elearning/school/Classes";

/**
 * initial state
 */
const state = () => ({
  schoolClasses: []
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.SCHOOL_CLASSES.LIST]({ commit }, params) {
    try {
      const options = { params };
      const result = await new Classes(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      // set to mutation
      commit(mutationTypes.SCHOOL_CLASSES.SET_SCHOOL_CLASSES_LIST, result);
    } catch (error) {
      console.log("[School Classes] list.error", error);
    }
  },

  async [actionTypes.SCHOOL_CLASSES.ADD]({ commit }, payload) {
    try {
      const result = await new Classes(this.$axios)[actionTypes.BASE.ADD](
        payload
      );
      // set to mutation
      // commit(mutationTypes.SCHOOL_CLASSES.SET_SCHOOL_CLASSES_LIST, result);
    } catch (error) {
      console.log("[School Classes] add.error", error);
    }
  },

  async [actionTypes.SCHOOL_CLASSES.EDIT]({ commit }, payload) {
    try {
      const result = await new Classes(this.$axios)[actionTypes.BASE.EDIT](
        payload
      );
      // set to mutation
      // commit(mutationTypes.SCHOOL_CLASSES.SET_SCHOOL_CLASSES_LIST, result);
    } catch (error) {
      console.log("[School Classes] edit.error", error);
    }
  },

  async [actionTypes.SCHOOL_CLASSES.DELETE]({ commit }, payload) {
    try {
      const result = await new Classes(this.$axios)[actionTypes.BASE.DELETE](
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
  [mutationTypes.SCHOOL_CLASSES.SET_SCHOOL_CLASSES_LIST](state, schoolClasses) {
    console.log("SET_SCHOOL_CLASSES_LIST", schoolClasses);
    state.schoolClasses = schoolClasses;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
