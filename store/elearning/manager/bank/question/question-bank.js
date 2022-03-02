import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import * as APIs from "~/utils/endpoints";
import QuestionBankDetail from "~/services/bank/question/QuestionBank";

/**
 * initial state
 */
const state = () => ({
  questionBank: {},
});

/**
 * initial getters
 */
const getters = {
};

const actions = {
    async [actionTypes.BANK_QUESTION.INFO]({ commit }, id) {
        try {
          const result = await new QuestionBankDetail(this.$axios)[actionTypes.BASE.DETAIL](
            id
          );
          commit(
            mutationTypes.BANK_QUESTION
              .SET_BANK_QUESTION_INFO,
            result
          );
          return result;
        } catch (error) {
          console.log("[BANK_QUESTION Info] info.error", error);
        }
    },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.BANK_QUESTION.SET_BANK_QUESTION_INFO](state, _info) {
    state.questionBank = _info;
  },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
