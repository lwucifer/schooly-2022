import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import HighlightEls from "~/services/elearning/teaching/statistic/HighlightEls";

/**
 * initial state
 */
const state = () => ({
    elearnings: [],
  });
  
/**
* initial getters
*/
const getters = {};

  /**
   * initial actions
   */
const actions = {
    async [actionTypes.TEACHING_CHART_STATISTIC_HIGHLIGHT_ELS.LIST]({ commit }, payload) {
        try {
          const result = await new HighlightEls(this.$axios)[actionTypes.BASE.LIST](
            payload
          );
          // set to mutation
          commit(mutationTypes.TEACHING_STATISTIC_HIGHLIGHT_ELS.SET_TEACHING_STATISTIC_HIGHLIGHT_ELS_LIST, result.data);
        } catch (error) {
          console.log("[Teaching highlight elearning] list.error", error);
        }
    },
  };

/**
 * initial mutations
 */
  const mutations = {
    [mutationTypes.TEACHING_STATISTIC_HIGHLIGHT_ELS.SET_TEACHING_STATISTIC_HIGHLIGHT_ELS_LIST](state, data) {
      console.log("SET_TEACHING_STATISTIC_HIGHTLIGHT_ELS_LIST", data);
      state.elearnings = data;
    }
  };

  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  };
  