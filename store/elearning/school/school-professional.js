import * as actionTypes from "../../../utils/action-types";
import * as mutationTypes from "../../../utils/mutation-types";
import Professional from "~/services/elearning/school/Professional";

/**
 * initial state
 */
const state = () => ({
  schoolProfessional: []
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.SCHOOL_PROFESSIONAL.LIST]({ commit }, params) {
    try {
      const result = await new Professional(this.$axios)[actionTypes.BASE.DETAIL](
        params.id
      );
      // set to mutation
      commit(mutationTypes.SCHOOL_PROFESSIONAL.SET_SCHOOL_PROFESSIONAL_LIST, result.data);
    } catch (error) {
      console.log("[School Professional] list.error", error);
    }
  },

  async [actionTypes.SCHOOL_PROFESSIONAL.ADD]({ commit }, payload) {
    try {
      const result = await new Professional(this.$axios)[actionTypes.BASE.ADD](
        payload
      );
      // set to mutation
      // commit(mutationTypes.SCHOOL_CLASSES.SET_SCHOOL_CLASSES_LIST, result);
    } catch (error) {
      console.log("[School Professional] add.error", error);
    }
  },

  async [actionTypes.SCHOOL_PROFESSIONAL.EDIT]({ commit }, payload) {
    try {
      const result = await new Professional(this.$axios)[actionTypes.BASE.EDIT](
        payload
      );
      // set to mutation
      // commit(mutationTypes.SCHOOL_CLASSES.SET_SCHOOL_CLASSES_LIST, result);
    } catch (error) {
      console.log("[School Professional] edit.error", error);
    }
  },

  async [actionTypes.SCHOOL_PROFESSIONAL.DELETE]({ commit }, payload) {
    try {
      const result = await new Professional(this.$axios)[actionTypes.BASE.DELETE](
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
  [mutationTypes.SCHOOL_PROFESSIONAL.SET_SCHOOL_PROFESSIONAL_LIST](state, schoolProfessional) {
    console.log("SET_SCHOOL_PROFESSIONAL_LIST", schoolProfessional);
    state.schoolProfessional = schoolProfessional;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
