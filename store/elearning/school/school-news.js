import * as actionTypes from "../../../utils/action-types";
import * as mutationTypes from "../../../utils/mutation-types";
import * as APIs from "~/utils/endpoints";
import News from "~/services/elearning/school/News";

/**
 * initial state
 */
const state = () => ({
  schoolNews: [],
  schoolNewsDetail: {},
  schoolNewsest:[],
  schoolNewsOther:[],

});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.SCHOOL_NEWS.LIST]({ commit }, params) {
    try {
      const options = { params };
      const result = await new News(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      if (result.success) {
        commit(mutationTypes.SCHOOL_NEWS.SET_SCHOOL_NEWS, result.data);
      }
    } catch (error) {
      console.log("SCHOOL_NEWS.error", error);
    }
  },

  async [actionTypes.SCHOOL_NEWS.DETAIL]({ commit }, params) {
    try {
      const { data } = await this.$axios.get(`${APIs.SCHOOL_NEWS}/${params.id}`);
      if (data.success) {
        console.log('SCHOOL_NEWS_DETAIL',data.data)
        commit(mutationTypes.SCHOOL_NEWS.SET_SCHOOL_NEWS_DETAIL, data);
      }
    } catch (error) {
      console.log("[SCHOOL_NEWS_DETAIL] error", error);
    }
  },
  async schoolNewsestList({ commit }, params) {
    try {
      const options = { params };
      const result = await new News(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      if (result.success) {
        commit("setNewsestList", result.data);
      }
    } catch (error) {
      console.log("SCHOOL_NEWSEST.error", error);
    }
  },
  async schoolNewsOtherList({ commit }, params) {
    try {
      const options = { params };
      const result = await new News(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      if (result.success) {
        commit("setNewsOtherList", result.data);
      }
    } catch (error) {
      console.log("SCHOOL_NEWSOTHER.error", error);
    }
  }
}
/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.SCHOOL_NEWS.SET_SCHOOL_NEWS](state, _data) {
    state.schoolNews = _data;
  },
  [mutationTypes.SCHOOL_NEWS.SET_SCHOOL_NEWS_DETAIL](state, _data) {
    state.schoolNewsDetail = _data;
  },
  setNewsestList(state, _data) {
    state.schoolNewsest = _data;
  },
  setNewsOtherList(state, _data) {
    state.schoolNewsOther = _data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
