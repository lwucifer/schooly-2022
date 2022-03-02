import * as actionTypes from "../../../utils/action-types";
import * as mutationTypes from "../../../utils/mutation-types";
import Elearning from "~/services/elearning/school/Elearning";
import { get } from "lodash";

/**
 * initial state
 */
const state = () => ({
  lecture: null,
  course: null
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.SCHOOL_ELEARNING.LIST]({ commit }, options) {
    const elearning_type = get(options, "params.elearning_type", "");
    
    try {
      const result = await new Elearning(this.$axios)[actionTypes.BASE.LIST](
        options
      );

      if (elearning_type === "COURSE") {
        commit(
          mutationTypes.SCHOOL_ELEARNING.SET_SCHOOL_ELEARNING_SOURCE,
          result.data
        );
      }

      if (elearning_type === "LECTURE") {
        commit(
          mutationTypes.SCHOOL_ELEARNING.SET_SCHOOL_ELEARNING_LECTURE,
          result.data
        );
      }

    } catch (error) {
      console.log("[School Info] info.error", error);
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.SCHOOL_ELEARNING.SET_SCHOOL_ELEARNING_SOURCE](state, course) {
    state.course = course;
  },
  [mutationTypes.SCHOOL_ELEARNING.SET_SCHOOL_ELEARNING_LECTURE](
    state,
    lecture
  ) {
    state.lecture = lecture;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
