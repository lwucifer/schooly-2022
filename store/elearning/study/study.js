import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import * as APIs from "~/utils/endpoints";
import Study from "~/services/elearning/study/Study";

/**
 * initial state
 */
const state = () => ({
  elearningStudy: [],
  timetables: [],
  expand: false,
  fullscreen: false,
  scormItems: [],
  scormItemActive: "",
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_STURY.LIST]({ commit }, payload) {
    try {
      const result = await new Study(this.$axios)[actionTypes.BASE.LIST](
        payload
      );
      commit(mutationTypes.ELEARNING_STUDY.SET_ELEARNING_STUDY, result);
    } catch (error) {
      console.log("[Elearning study] list.error", error);
    }
  },

  async [actionTypes.ELEARNING_STURY.LIST_TIMETABLE]({ commit }, payload) {
    try {
      const { data } = await this.$axios.get(
        APIs.STUDY_OLCLASS_TIMETABLE,
        payload
      );
      commit(
        mutationTypes.ELEARNING_STUDY.SET_ELEARNING_STUDY_TIMETABLE,
        data.data
      );
      return data;
    } catch (error) {
      console.log("[LIST_TIMETABLE] list.error", error);
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_STUDY.SET_ELEARNING_STUDY](state, elearningStudy) {
    state.elearningStudy = elearningStudy;
  },

  [mutationTypes.ELEARNING_STUDY.SET_ELEARNING_STUDY_TIMETABLE](
    state,
    _timetable
  ) {
    state.timetables = _timetable;
  },
  
  [mutationTypes.ELEARNING_STUDY.SET_EXPAND](state, expand) {
    // console.log("[SET_EXPAND]", expand);
    state.expand = expand;
  },

  [mutationTypes.ELEARNING_STUDY.SET_FULLSCREEN](state, fullscreen) {
    state.fullscreen = fullscreen;
  },

  [mutationTypes.ELEARNING_STUDY.SET_SCORM_ITEMS](state, _items) {
    state.scormItems = _items;
  },

  [mutationTypes.ELEARNING_STUDY.SET_SCORM_ITEM_ACTIVE](state, _data) {
    console.log("[SET_SCORM_ITEM_ACTIVE]", _data);
    state.scormItemActive = _data;
  }

};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
