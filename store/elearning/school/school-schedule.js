import * as actionTypes from "../../../utils/action-types";
import * as mutationTypes from "../../../utils/mutation-types";
import * as APIs from "~/utils/endpoints";
import Info from "~/services/elearning/school/Info";

/**
 * initial state
 */
const state = () => ({
  timetables: [],
  timetableDetail: {},
  timetablesOther:[]
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  /**
   * TIME TABLE
   */
  async [actionTypes.SCHOOL_INFO.TIMETABLE]({ commit }, params) {
    try {
      const { data } = await this.$axios.get(APIs.SCHOOL_TIMETABLE, { params });
      if (data.success) {
        commit(mutationTypes.SCHOOL_INFO.SET_SCHOOL_TIMETABLE, data.data);
      }
    } catch (error) {
      console.log("[TIMETABLE] error", error);
    }
  },

  /**
   * TIME TABLE DETAIL
   */
  async [actionTypes.SCHOOL_INFO.TIMETABLE_DETAIL]({ commit }, params) {
    try {
      const { data } = await this.$axios.get(`${APIs.SCHOOL_TIMETABLE}/${params.id}`);
      if (data.success) {
        commit(mutationTypes.SCHOOL_INFO.SET_SCHOOL_TIMETABLE_DETAIL, data.data);
      }
    } catch (error) {
      console.log("[TIMETABLE_DETAIL] error", error);
    }
  },
  async timeTableOtherList({ commit }, params) {
    try {
      const { data } = await this.$axios.get(APIs.SCHOOL_TIMETABLE, { params });
      if (data.success) {
        commit("setTimeTableOtherList", data.data);
      }
    } catch (error) {
      console.log("[TIMETABLE] error", error);
    }
  },

  
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.SCHOOL_INFO.SET_SCHOOL_TIMETABLE](state, _data) {
    state.timetables = _data;
  },
  [mutationTypes.SCHOOL_INFO.SET_SCHOOL_TIMETABLE_DETAIL](state, _data) {
    state.timetableDetail = _data;
  },
  setTimeTableOtherList(state, _data) {
    state.timetablesOther = _data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
