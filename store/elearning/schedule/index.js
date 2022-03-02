import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import * as APIs from "~/utils/endpoints";

const state = () => ({
  stateSchedule: null,
  scheduleList: []
});

const actions = {
  async [actionTypes.SCHEDULE.GET_SCHEDULE_LIST]({ commit }, payload) {
    try {
      return this.$axios
        .get(APIs.ELEARNING_TEACHING_SCHEDULES, payload)
        .then((res) => res.data)
        .then((result) => {
          console.log("SCHEDULE list", result.data);
          commit(
            mutationTypes.SCHEDULE.SET_SCHEDULE_LIST,
            result.data
          );
          return result;
        });
    } catch (err) {
      console.log("SCHEDULE.err", err);
      return err;
    }
  },
};

const mutations = {
  [mutationTypes.SCHEDULE.SET_STATE_SCHEDULE](state, _data) {
    state.stateSchedule = _data;
  },
  [mutationTypes.SCHEDULE.SET_SCHEDULE_LIST](state, _data) {
    state.scheduleList = _data;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
