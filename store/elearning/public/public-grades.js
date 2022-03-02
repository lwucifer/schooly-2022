import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Category from "~/services/elearning/public/Category";
import { get } from "lodash";
import * as APIs from "~/utils/endpoints";
import { allOptionSelect } from "~/utils/common";

/**
 * initial state
 */
const state = () => ({
  gradesAll: [],
  classes: [],
});

/**
 * initial getters
 */
const getters = {
  gradesAllOpts(state) {
    const tmp = state.gradesAll
      ? state.gradesAll.map(g => {
          return {
            value: g.id,
            text: g.name,
            type: g.type
          };
        })
      : [];

    // return tmp;
    return allOptionSelect(tmp, "khối");
  },
  classessAllOpts(state) {
    const tmp = state.classes
      ? state.classes.map(g => {
          return {
            value: g.id,
            text: g.name,
          };
        })
      : [];

    // return tmp;
    return allOptionSelect(tmp, "lớp");
  }
};

/**
 * initial actions
 */
const actions = {
  // async [actionTypes.PUBLIC_GRADES.GRADES_ALL]({ commit }, params) {
  //   try {
  //     const { data } = await this.$axios.get(APIs.COMMON_GRADES, {
  //       params,
  //     });

  //     if (data.success) {
  //       commit(mutationTypes.PUBLIC_GRADES.SET_GRADES_ALL, data.data);
  //     }
  //   } catch (error) {
  //     return error;
  //   }
  // },
  async [actionTypes.PUBLIC_GRADES.GRADES_ALL]({ commit }, params) {
    try {
      return this.$axios
        .get(APIs.COMMON_GRADES, params)
        .then(res => res.data)
        .then(result => {
          if (result.success) {
            commit(mutationTypes.PUBLIC_GRADES.SET_GRADES_ALL, result.data);
          }
          return result;
        });
    } catch (err) {
      console.log("[PUBLIC.GRADES_ALL] err", err);
      return err;
    }
  },

  async getClasses({ commit }, params = {}) {
    try {
      const res = await this.$axios({
        url: APIs.COMMON_CLASS,
        method: "GET",
        params
      });
      if (get(res, "data.success", false)) {
        const data = get(res, "data.data", []);
        commit("classes", data);
        return;
      }
      commit("classes", []);
    } catch (error) {
      commit("classes", []);
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.PUBLIC_GRADES.SET_GRADES_ALL](state, _data) {
    state.gradesAll = _data;
  },

  classes(state, data) {
    state.classes = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
