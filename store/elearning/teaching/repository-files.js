import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import RepositoryFile from "~/services/elearning/teaching/RepositoryFile";

/**
 * initial state
 */
const state = () => ({
  files: [],
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_TEACHING_REPOSITORY_FILE.LIST](
    { commit },
    payload
  ) {
    try {
      const result = await new RepositoryFile(this.$axios)[
        actionTypes.BASE.LIST
      ](payload);
      commit(
        mutationTypes.ELEARNING_TEACHING_REPOSITORY_FILE
          .SET_TEACHING_REPOSITORY_FILE_LIST,
        result
      );
      return result.data;
    } catch (error) {
      console.log("[Creating docs] list.error", error);
      return null;
    }
  },

  async [actionTypes.ELEARNING_TEACHING_REPOSITORY_FILE.ADD](
    { commit },
    { payload, config }
  ) {
    try {
      const result = await new RepositoryFile(this.$axios)[
        actionTypes.BASE.ADD
      ](payload, config);
      return result;
    } catch (error) {
      console.log("[Creating repository] add.error", error);
      throw error;
    }
  },

  async [actionTypes.ELEARNING_TEACHING_REPOSITORY_FILE.DELETE](
    { commit },
    payload
  ) {
    try {
      const result = await new RepositoryFile(this.$axios)[
        actionTypes.BASE.DELETE_PAYLOAD
      ](payload);
      return result;
    } catch (error) {
      console.log("[Deleting repository] delete.error", error);
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_TEACHING_REPOSITORY_FILE
    .SET_TEACHING_REPOSITORY_FILE_LIST](state, files) {
    state.files = files;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
