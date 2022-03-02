import { RESPONSE_SUCCESS } from "~/utils/config";
import InteractiveQuestionService from "~/services/elearning/study/InteractiveQuestion";
import InteractiveNotification from "~/services/elearning/study/InteractiveNotification";
import { get } from "lodash";
// import VoteStudyService from "~/services/elearning/study/Vote.js";

/**
 * initial state
 */
const state = () => ({
  questions: {
    content: [],
    page: {},
  },
  notifications: null,
  reviews: null,
});

/**
 * initial getters
 */
const getters = {
  //
};

const actions = {
  async getReviews({ commit }, params) {
    try {
      const res = await this.$axios({
        url: "/elearning/public/votes",
        params,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (get(res, "data.success", false)) {
        commit("reviews", get(res, "data.data", null));
        return;
      }
      commit("reviews", null);
    } catch (error) {
      commit("reviews", null);
    }
    // try {
    //   const res = await new VoteStudyService(this.$axios)["list"](options);
    //   if (get(res, "success", false)) {
    //     commit("reviews", res.data);
    //     return;
    //   }
    //   commit("reviews", null);
    // } catch (error) {
    //   commit("reviews", null);
    // }
  },

  async getListNotification({ commit }, options) {
    try {
      const res = await new InteractiveNotification(this.$axios)["list"](
        options
      );
      if (get(res, "success", false)) {
        commit("notifications", res.data);
        return;
      }
      commit("notifications", null);
    } catch (error) {
      commit("notifications", null);
    }
  },

  async getListQuestion({ commit }, options) {
    try {
      const result = await new InteractiveQuestionService(this.$axios)["list"](
        options
      );
      if (result.success == RESPONSE_SUCCESS) {
        commit("questions", result.data);
        return;
      }
      commit("questions", null);
    } catch (error) {
      commit("questions", null);
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  questions(state, questions) {
    state.questions.page = get(questions, "page", null);
    if (get(questions, "page.number", 0) > 0) {
      state.questions.content = state.questions.content.concat(
        get(questions, "content", [])
      );
    } else {
      state.questions.content = get(questions, "content", []);
    }
  },

  notifications(state, notifications) {
    state.notifications = notifications;
  },

  reviews(state, reviews) {
    state.reviews = reviews;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
