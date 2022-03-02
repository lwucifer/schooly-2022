import { get } from "lodash";
import { questionBankType } from "~/utils/common";
import { getLocalDateTime } from "~/utils/moment";
import QuestionBankDetail from "~/services/bank/question/QuestionBank";

/**
 * initial state
 */
const state = () => ({
  questions: null,
  grades: [],
  subjects: [],
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  clearGrades({ commit }) {
    commit("grades", []);
  },

  clearSubjects({ commit }) {
    commit("subjects", []);
  },

  async getGrades({ commit }, params) {
    try {
      const res = await this.$axios({
        url: `/elearning/school/common/grades`,
        method: "get",
        params,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (get(res, "data.success", false)) {
        commit("grades", get(res, "data.data", []));
        return;
      }
      commit("grades", []);
    } catch (error) {
      commit("grades", []);
    }
  },

  async getSubjects({ commit }, params) {
    try {
      const res = await this.$axios({
        url: `/elearning/school/common/apply_subs`,
        method: "get",
        params,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (get(res, "data.success", false)) {
        commit("subjects", get(res, "data.data", []));
        return;
      }
      commit("subjects", []);
    } catch (error) {
      commit("subjects", []);
    }
  },

  async getQuestions({ commit }, params = {}) {
    try {
      const res = await this.$axios({
        url: "/elearning/teaching/manage/question_banks",
        method: "GET",
        params,
      });
      if (get(res, "data.success", false)) {
        let data = get(res, "data.data", []);
        data.content.map((item) => {
          item.typeText = questionBankType[item.type];
          item.created_at = getLocalDateTime(item.created).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        });
        commit("questions", data);
        return;
      }
      commit("questions", []);
    } catch (error) {
      console.log(error);
      commit("questions", []);
    }
  },
  async getQuestionDetail({commit}, id) {
    try {
      const res = await this.$axios({
        url: `/elearning/teaching/manage/question/${id}`,
        method: "GET",
      });
      if (get(res, "data.success", false)) {
        let { data } = res;
        return data;
      }
      return {};
    } catch (error) {
      console.log("[Question Detail]", error);
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  questions(state, data) {
    state.questions = data;
  },
  grades(state, data) {
    state.grades = data;
  },
  subjects(state, data) {
    state.subjects = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
