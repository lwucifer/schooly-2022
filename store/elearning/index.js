import { get } from "lodash";
import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import * as APIs from "~/utils/endpoints";
import { allOptionSelect } from "~/utils/common";
import { uniqWith } from "lodash";

/**
 * initial state
 */
const state = () => ({
  groupCls: {},
  currentGroupCls: {}
});

/**
 * initial getters
 */
const getters = {
  groupClsOpts(state) {
    const allGroupCls = uniqWith(
      state.groupCls,
      (a, b) => a.id === b.id
    );
    const parsedData = allGroupCls.map(item => {
      item.type = item.type;
      item.value = item.id;
      item.text = item.name;
      return item;
    });
    return allOptionSelect(allGroupCls);
  },
  currentGroupClsDetail(state) {
    return state.currentGroupCls;
  },
  currentGroupClsSummary(state, getters, rootState, rootGetters) {
    if (state.currentGroupCls && state.currentGroupCls.value != null) {
      return state.currentGroupCls;
    } else { // all groups/class
      const allGroupCls = rootGetters['elearning/groupClsOpts'];
      const totalStudents = allGroupCls.reduce((sum, item) => sum + get(item, 'students', 0), 0);
      return {
        homeroom: false,
        students: totalStudents
      }
    }
  }
};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.TEACHER_CLASS_GROUP.LIST]({ commit }, payload = {}) {
    try {
      const { data } = await this.$axios.get(
        `${APIs.TEACHING_TEACHER_CLASS_GROUP}`,
        payload
      );
      // set to mutation
      commit(mutationTypes.TEACHER_CLASS_GROUP.SET_TEACHER_CLASS_GROUP_LIST, data.data);
      return data;
    } catch (error) {
      console.log("[CLASSES/GROUPES OF TEACHER] error", error);
      return error;
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.TEACHER_CLASS_GROUP.SET_TEACHER_CLASS_GROUP_LIST](state, data) {
    state.groupCls = data;
  },
  [mutationTypes.TEACHER_CLASS_GROUP.SET_CURRENT_GROUP_CLASS](state, data) {
    state.currentGroupCls = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
