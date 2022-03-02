import * as actionTypes from "../../../utils/action-types";
import * as mutationTypes from "../../../utils/mutation-types";
import * as APIs from "~/utils/endpoints";
import Info from "~/services/elearning/school/Info";

/**
 * initial state
 */
const state = () => ({
  schoolInfo: {},
  announcements: [],
  announcementDetail: {},
  linkWebs: [],
  linkWebDetail: {},
  timetables: [],
  timetableDetail: {},
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.SCHOOL_INFO.INFO]({ commit }, params) {
    commit(mutationTypes.SCHOOL_INFO.SET_SCHOOL_INFO, {});
    try {
      const options = { params };
      const result = await new Info(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      if (result.success) {
        commit(mutationTypes.SCHOOL_INFO.SET_SCHOOL_INFO, result.data);
      }
    } catch (error) {
      console.log("[INFO] info.error", error);
    }
  },

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
      if (result.success) {
        commit(mutationTypes.SCHOOL_INFO.SET_SCHOOL_ANNOUNCEMENT_DETAIL, data.data);
      }
    } catch (error) {
      console.log("[ANNOUNCEMENT_DETAIL] error", error);
    }
  },

  /**
   * LINK WEB 
   */
  async [actionTypes.SCHOOL_INFO.LINK_WEB]({ commit }, params) {
    try {
      const { data } = await this.$axios.get(APIs.SCHOOL_LINKWEBS, { params });
      if (result.success) {
        commit(mutationTypes.SCHOOL_INFO.SET_SCHOOL_LINK_WEB, data.data);
      }
    } catch (error) {
      console.log("[LINK_WEB] error", error);
    }
  },

  /**
   * LINK WEB DETAIL
   */
  async [actionTypes.SCHOOL_INFO.LINK_WEB_DETAIL]({ commit }, params) {
    try {
      const { data } = await this.$axios.get(`${APIs.SCHOOL_LINKWEBS}/${params.id}`);
      if (result.success) {
        commit(mutationTypes.SCHOOL_INFO.SET_SCHOOL_LINK_WEB_DETAIL, data.data);
      }
    } catch (error) {
      console.log("[LINK_WEB_DETAIL] error", error);
    }
  },

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
      if (result.success) {
        commit(mutationTypes.SCHOOL_INFO.SET_SCHOOL_TIMETABLE_DETAIL, data.data);
      }
    } catch (error) {
      console.log("[TIMETABLE_DETAIL] error", error);
    }
  },

  
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.SCHOOL_INFO.SET_SCHOOL_INFO](state, _data) {
    state.schoolInfo = _data;
  },
  [mutationTypes.SCHOOL_INFO.SET_SCHOOL_ANNOUNCEMENT](state, _data) {
    state.announcements = _data;
  },
  [mutationTypes.SCHOOL_INFO.SET_SCHOOL_ANNOUNCEMENT_DETAIL](state, _data) {
    state.announcementDetail = _data;
  },
  [mutationTypes.SCHOOL_INFO.SET_SCHOOL_LINK_WEB](state, _data) {
    state.linkWebs = _data;
  },
  [mutationTypes.SCHOOL_INFO.SET_SCHOOL_LINK_WEB_DETAIL](state, _data) {
    state.linkWebDetail = _data;
  },
  [mutationTypes.SCHOOL_INFO.SET_SCHOOL_TIMETABLE](state, _data) {
    state.timetables = _data;
  },
  [mutationTypes.SCHOOL_INFO.SET_SCHOOL_TIMETABLE_DETAIL](state, _data) {
    state.timetableDetail = _data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
