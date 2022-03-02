import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Olclass from "~/services/elearning/mytutor/Olclass";
import * as APIs from '~/utils/endpoints';

/**
 * initial state
 */
const state = () => ({
  olClassList: [],
  olClassListDetail: {}
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.MYTUTOR_OLCLASS.LIST]({ commit }, payload) {
    try {
      const result = await new Olclass(this.$axios)[actionTypes.BASE.LIST](
        payload
      );
      // set to mutation
      commit(
        mutationTypes.MYTUTOR_OLCALSS.SET_MYTUTOR_OLCALSS_LIST,
        result
      );
    } catch (error) {
      console.log("[Mytutor onClass] list.error", error);
    }
  },


  async [actionTypes.MYTUTOR_OLCLASS.LIST_DETAIL]({ commit }, payload) {
    try {
      const result = await new Olclass(this.$axios)[actionTypes.BASE.DETAIL](
        payload
      );
      // set to mutation
      commit(
        mutationTypes.MYTUTOR_OLCALSS.SET_MYTUTOR_OLCALSS_LIST_DETAIL,
        result.data
      );
    } catch (error) {
      console.log("[Mytutor onClass] detail.error", error);
    }

    
  },

  async [actionTypes.MYTUTOR_OLCLASS.ADD]({ commit }, payload) {
    try {
      const result = await new Olclass(this.$axios)[actionTypes.BASE.ADD](
        payload
      );
      return result
    } catch (error) {
      console.log("[Mytutor onClass] add.error", error);
    }
  },


  async [actionTypes.MYTUTOR_OLCLASS.EDIT]({ commit }, payload) {
    try {
      const result = await new Olclass(this.$axios)[actionTypes.BASE.EDIT_PAYLOAD](
        payload
      );
      return result
    } catch (error) {
      console.log("[Mytutor onClass] edit.error", error);
    }
  },

  async [actionTypes.MYTUTOR_OLCLASS.DELETE]({ commit }, id) {
    try {
    //   const {data} = await this.$axios.delete(`${APIs.TEACHING_MODIFY_SCHEDULE}/${id}/cancel`);
    //   return data
    } catch (error) {
      console.log("[Mytutor onClass] delete.error", error);
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.MYTUTOR_OLCALSS.SET_MYTUTOR_OLCALSS_LIST](state, data) {
    console.log("SET_MYTUTOR_OLCALSS_LIST", data);
    state.olClassList = data;
  },

  [mutationTypes.MYTUTOR_OLCALSS.SET_MYTUTOR_OLCALSS_LIST_DETAIL](state, data) {
    console.log("SET_MYTUTOR_OLCALSS_LIST_DETAIL", data);
    state.olClassListDetail = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
