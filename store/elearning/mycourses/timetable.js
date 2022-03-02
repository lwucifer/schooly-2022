import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import TimeTable from "~/services/elearning/mycourses/TimeTable";

const state = () => ({
  stateTimeTable: null,
  timeTableList: []
});

const actions = {
  async [actionTypes.TIMETABLE.TIMETABLE_LIST]({ commit }, payload) {
    try {
      const result = await new TimeTable(this.$axios)[actionTypes.BASE.LIST](
        payload
      );
      console.log("TimeTable list", result.data);
      commit(
        mutationTypes.TIMETABLE.SET_TIMETABLE_LIST,
        result.data
      );
    } catch (err) {
      console.log("TimeTable.err", err);
      return err;
    }
  },
};

const mutations = {
  [mutationTypes.TIMETABLE.SET_STATE_TIMETABLE](state, _stateTimeTable) {
    state.stateTimeTable = _stateTimeTable;
  },
  [mutationTypes.TIMETABLE.SET_TIMETABLE_LIST](state, _timeTableList) {
    state.timeTableList = _timeTableList;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
