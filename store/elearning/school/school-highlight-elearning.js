import * as actionTypes from "../../../utils/action-types";
import * as mutationTypes from "../../../utils/mutation-types";
import HightlightElearning from "~/services/elearning/school/HightlightElearning";
import { get } from "lodash";

/**
 * initial state
 */
const state = () => ({
  highlightLecture: null,
  highlightCourse: null
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.SCHOOL_HIGHTLIGHT_ELEARNING.LIST]({ commit }, options) {
    const elearning_type = get(options, "params.type", "");
    
    try {
      const result = await new HightlightElearning(this.$axios)[actionTypes.BASE.LIST](
        options
      );

      if (elearning_type === "COURSE") {
        commit(
          mutationTypes.SCHOOL_HIGHTLIGHT_ELEARNING.SET_SCHOOL_HIGHTLIGHT_ELEARNING_COURSE,
          result.data
        );
      }

      if (elearning_type === "LECTURE") {
        commit(
          mutationTypes.SCHOOL_HIGHTLIGHT_ELEARNING.SET_SCHOOL_HIGHTLIGHT_ELEARNING_LECTURE,
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
  [mutationTypes.SCHOOL_HIGHTLIGHT_ELEARNING.SET_SCHOOL_HIGHTLIGHT_ELEARNING_COURSE](state, hightlightCourse) {
    state.highlightCourse = hightlightCourse;
  },
  [mutationTypes.SCHOOL_HIGHTLIGHT_ELEARNING.SET_SCHOOL_HIGHTLIGHT_ELEARNING_LECTURE](
    state,
    hightlightLecture
  ) {
    state.highlightLecture = hightlightLecture;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
