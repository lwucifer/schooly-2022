import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Setting from "~/services/elearning/creating/Setting";

/**
 * initial state
 */
const state = () => ({
  setting: null,
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_CREATING_SETTING.LIST]({ commit }, options) {
    commit(mutationTypes.BASE.RESET);
    try {
      const result = await new Setting(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      if (result.success) {
        commit(
          mutationTypes.ELEARNING_CREATING_SETTING
            .SET_ELEARNING_CREATING_SETTING_LIST,
          result.data
        );
      }
    } catch (error) {
      console.log("[Creating general] list.error", error);
    }
  },

  async [actionTypes.ELEARNING_CREATING_SETTING.ADD]({ commit }, options) {
    try {
      const result = await new Setting(this.$axios)[actionTypes.BASE.ADD](
        options
      );
      return result;
    } catch (error) {
      console.log("[Creating general] add.error", error);
    }
  },

  [actionTypes.BASE.RESET]({ commit }) {
    commit(mutationTypes.BASE.RESET);
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_CREATING_SETTING
    .SET_ELEARNING_CREATING_SETTING_LIST](state, setting) {
    state.setting = setting;
  },

  [mutationTypes.BASE.RESET]: function(state) {
    this.setting = null;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
