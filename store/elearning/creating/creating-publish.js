import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Publish from "~/services/elearning/creating/Publish";

/**
 * initial state
 */
const state = () => ({
  publish: null,
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_CREATING_PUBLISH.POST]({ commit }, data) {
    try {
      const result = await new Publish(this.$axios)['postPublish'](
        data
      );
      return result;
    } catch (error) {
      //
    }
  },
};

/**
 * initial mutations
 */
const mutations = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
