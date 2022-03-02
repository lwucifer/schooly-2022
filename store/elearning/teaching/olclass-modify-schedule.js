import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Schedule from "~/services/elearning/teaching/OlclassModifySchedule";
import * as APIs from '~/utils/endpoints';

/**
 * initial state
 */
const state = () => ({
  scheduleList: [],
  scheduleListCounting: 0,
  scheduleListDetail: {}
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.TEACHING_ONLINE_CLASS_MODIFY_SCHEDULE.LIST]({ commit }, payload) {
    try {
      const result = await new Schedule(this.$axios)[actionTypes.BASE.LIST](
        payload
      );
      // set to mutation
      commit(
        mutationTypes.TEACHING_ONLINE_CLASS_SCHEDULE.SET_TEACHING_ONLINE_CLASS_SCHEDULE_LIST,
        result
      );
    } catch (error) {
      console.log("[Teaching modify scheduleList] list.error", error);
    }
  },

  async [actionTypes.TEACHING_ONLINE_CLASS_MODIFY_SCHEDULE.LIST_COUTING]({ commit }, payload) {
    try {
      const { data } = await this.$axios.get(`/elearning/teaching/olclass/request/count`, payload);
      // set to mutation
      commit(
        mutationTypes.TEACHING_ONLINE_CLASS_SCHEDULE.SET_TEACHING_ONLINE_CLASS_SCHEDULE_LIST_COUTING,
        data.data
      );
    } catch (error) {
      console.log("[Teaching modify scheduleList] list.error", error);
    }
  },

  async [actionTypes.TEACHING_ONLINE_CLASS_MODIFY_SCHEDULE.LIST_DETAIL]({ commit }, payload) {
    try {
      const result = await new Schedule(this.$axios)[actionTypes.BASE.DETAIL](
        payload
      );
      // set to mutation
      commit(
        mutationTypes.TEACHING_ONLINE_CLASS_SCHEDULE.SET_TEACHING_ONLINE_CLASS_SCHEDULE_LIST_DEATIL,
        result.data
      );
    } catch (error) {
      console.log("[Teaching modify scheduleList] list.error", error);
    }

    
  },

  async [actionTypes.TEACHING_ONLINE_CLASS_MODIFY_SCHEDULE.ADD]({ commit }, payload) {
    try {
      const result = await new Schedule(this.$axios)[actionTypes.BASE.ADD](
        payload
      );
      return result
    } catch (error) {
      console.log("[Teaching modify scheduleList] list.error", error);
    }
  },

  async [actionTypes.TEACHING_ONLINE_CLASS_MODIFY_SCHEDULE.PROCESS]({ commit }, payload) {
    try {
      const {data} = await this.$axios.post(APIs.TEACHING_MODIFY_SCHEDULE_PROCESS, payload);
      return data
    } catch (error) {
      console.log("[Teaching modify scheduleList] list.error", error);
    }
  },

  async [actionTypes.TEACHING_ONLINE_CLASS_MODIFY_SCHEDULE.EDIT]({ commit }, payload) {
    try {
      const result = await new Schedule(this.$axios)[actionTypes.BASE.EDIT_PAYLOAD](
        payload
      );
      return result
    } catch (error) {
      console.log("[Teaching modify scheduleList] list.error", error);
    }
  },

  async [actionTypes.TEACHING_ONLINE_CLASS_MODIFY_SCHEDULE.CANCEL]({ commit }, id) {
    try {
      const {data} = await this.$axios.delete(`${APIs.TEACHING_MODIFY_SCHEDULE}/${id}/cancel`);
      return data
    } catch (error) {
      console.log("[Teaching modify scheduleList] list.error", error);
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.TEACHING_ONLINE_CLASS_SCHEDULE.SET_TEACHING_ONLINE_CLASS_SCHEDULE_LIST](state, data) {
    console.log("SET_TEACHING_ONLINE_CLASS_SCHEDULE_LIST", data);
    state.scheduleList = data;
  },

  [mutationTypes.TEACHING_ONLINE_CLASS_SCHEDULE.SET_TEACHING_ONLINE_CLASS_SCHEDULE_LIST_COUTING](state, data) {
    console.log("SET_TEACHING_ONLINE_CLASS_SCHEDULE_LIST_COUTING", data);
    state.scheduleListCounting = data;
  },

  [mutationTypes.TEACHING_ONLINE_CLASS_SCHEDULE.SET_TEACHING_ONLINE_CLASS_SCHEDULE_LIST_DEATIL](state, data) {
    console.log("SET_TEACHING_ONLINE_CLASS_SCHEDULE_LIST_DEATIL", data);
    state.scheduleListDetail = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
