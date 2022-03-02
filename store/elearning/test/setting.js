import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import { get } from "lodash";
import { RESPONSE_SUCCESS } from "~/utils/config";
import * as APIs from "~/utils/endpoints";
import SettingTest from "~/services/elearning/test/SettingTest";

/**
 * initial state
 */
const state = () => ({
  settingTestList: {}
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.SETTING_TEST.LIST]({ commit }, payload) {
    try {
      const { data: result = {} } = await new SettingTest(this.$axios)[
        actionTypes.BASE.LIST
      ](payload);
      if (result.success == RESPONSE_SUCCESS) {
        commit(mutationTypes.SETTING_TEST.SET_SETTING_TEST_LIST, result);
      }
      return result;
    } catch (err) {
      console.log("[SETTING_TEST] list.err", err);
      return err;
    }
  },

  async [actionTypes.SETTING_TEST.ADD]({ commit }, payload) {
    try {
      const result = await new SettingTest(this.$axios)[actionTypes.BASE.ADD](
        payload
      );
      console.log("[SettingTest.ADD]", result.data);
      return result;
    } catch (error) {
      console.log("[SettingTest.ADD] error", error);
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.SETTING_TEST.SET_SETTING_TEST_LIST](state, _data) {
    state.settingTestList = _data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
