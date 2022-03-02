import * as actionTypes from "../../../utils/action-types";
import * as mutationTypes from "../../../utils/mutation-types";
import * as APIs from "~/utils/endpoints";
import Info from "~/services/elearning/school/Info";

/**
 * initial state
 */
const state = () => ({
  announcements: [],
  announcementDetail: {},
  announcementsOther: [],
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
   * ANNOUNCEMENT 
   */
  async [actionTypes.SCHOOL_INFO.ANNOUNCEMENT]({ commit }, params) {
    try {
      const { data } = await this.$axios.get(APIs.SCHOOL_ANNOUCEMENTS, { params });
      if (data.success) {
        commit(mutationTypes.SCHOOL_INFO.SET_SCHOOL_ANNOUNCEMENT, data.data);
      }
    } catch (error) {
      console.log("[ANNOUNCEMENT] error", error);
    }
  },

  /**
   * ANNOUNCEMENT DETAIL
   */
  async [actionTypes.SCHOOL_INFO.ANNOUNCEMENT_DETAIL]({ commit }, params) {
    try {
      const { data } = await this.$axios.get(`${APIs.SCHOOL_ANNOUCEMENTS}/${params.id}`);
      if (data.success) {
        commit(mutationTypes.SCHOOL_INFO.SET_SCHOOL_ANNOUNCEMENT_DETAIL, data.data);
      }
    } catch (error) {
      console.log("[ANNOUNCEMENT_DETAIL] error", error);
    }
  },
  async schoolAnnouncementOther({ commit }, params) {
    try {
      const { data } = await this.$axios.get(APIs.SCHOOL_ANNOUCEMENTS, { params });
      if (data.success) {
        commit("setAnnouncementOtherList", data.data);
      }
    } catch (error) {
      console.log("[ANNOUNCEMENT OTHER] error", error);
    }
  }
  
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.SCHOOL_INFO.SET_SCHOOL_ANNOUNCEMENT](state, _data) {
    state.announcements = _data;
  },
  [mutationTypes.SCHOOL_INFO.SET_SCHOOL_ANNOUNCEMENT_DETAIL](state, _data) {
    state.announcementDetail = _data;
  },
  setAnnouncementOtherList(state, _data) {
    state.announcementsOther = _data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
