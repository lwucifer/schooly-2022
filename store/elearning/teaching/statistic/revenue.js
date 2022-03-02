import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Revenue from "~/services/elearning/teaching/statistic/Revenue";
import RevenueChart from "~/services/elearning/teaching/statistic/RevenueChart";

/**
 * initial state
 */
const state = () => ({
    revenueList: [],
    revenueChart: []
  });
  
/**
* initial getters
*/
const getters = {};

  /**
   * initial actions
   */
const actions = {
    async [actionTypes.TEACHING_STATISTIC_REVENUE.LIST]({ commit }, payload) {
        try {
          const result = await new Revenue(this.$axios)[actionTypes.BASE.LIST](
            payload
          );
          // set to mutation
          commit(mutationTypes.TEACHING_STATISTIC_REVENUE.SET_TEACHING_STATISTIC_REVENUE_LIST, result.data);
        } catch (error) {
          console.log("[Teaching statis revenue] list.error", error);
        }
    },
    async [actionTypes.TEACHING_CHART_STATISTIC_REVENUE.INFO]({ commit }, params) {
        try {
          const result = await new RevenueChart(this.$axios)[actionTypes.BASE.LIST](
            params
          );
          // set to mutation
          commit(mutationTypes.TEACHING_CHART_STATISTIC_REVENUE.SET_TEACHING_CHART_STATISTIC_REVENUE, result.data);
        } catch (error) {
          console.log("[Teaching chart statistic] info.error", error);
        }
    }
  };

/**
 * initial mutations
 */
  const mutations = {
    [mutationTypes.TEACHING_STATISTIC_REVENUE.SET_TEACHING_STATISTIC_REVENUE_LIST](state, data) {
      console.log("SET_TEACHING_STATISTIC_REVENUE_LIST", data);
      state.revenueList = data;
    },
    [mutationTypes.TEACHING_CHART_STATISTIC_REVENUE.SET_TEACHING_CHART_STATISTIC_REVENUE](state, data) {
      console.log("SET_TEACHING_CHART_STATISTIC_REVENUE", data);
      state.revenueChart = data;
    }
  };

  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  };
  