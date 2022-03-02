import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import { RESPONSE_SUCCESS } from "~/utils/config";
import * as APIs from "~/utils/endpoints";

const state = () => ({
    teachingSchedules: [],
})

const actions = {
    async [actionTypes.TEACHING_ONLINE_SCHEDULES.LIST]({ commit }, payload) {
      try {
        const { data } = await this.$axios.get(`${APIs.TEACHING_ONLINE_SCHEDULES}`, {
          params: payload
        });
        console.log("[TEACHING_ONLINE_SCHEDULES.LIST]", data.data);
        if (data.success == RESPONSE_SUCCESS) {
          commit(mutationTypes.TEACHING_ONLINE_SCHEDULES.SET_TEACHING_SCHEDULE, data.data);
        }
        return data;
      } catch (error) {
        console.log("[TEACHING_ONLINE_SCHEDULES.LIST] error", error);
      }
    },
  
  };
  
  /**
   * initial mutations
   */
  const mutations = {
    [mutationTypes.TEACHING_ONLINE_SCHEDULES.SET_TEACHING_SCHEDULE](state, _data) {
      state.teachingSchedules = _data;
    },
  };
  
  export default {
    namespaced: true,
    state,
    actions,
    mutations
  };