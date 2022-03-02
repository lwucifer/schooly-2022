import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import * as APIs from "~/utils/endpoints";
import Import from "~/services/bank/question/Import";
import ImportComplete from "~/services/bank/question/ImportComplete";
import ImportValid from "~/services/bank/question/ImportValid";

/**
 * initial state
 */
const state = () => ({
    importFile: {},
    sampleFile: {},
});

/**
 * initial getters
 */
const getters = {
};

const actions = {
    async [actionTypes.BANK_QUESTION.IMPORT]({ commit }, payload) {
        try {
          const result = await new Import(this.$axios)['postWithFormData'](payload);
          return result;
        } catch (error) {
          console.log("[BANK_QUESTION Import] import.error", error);
        }
    },
    async [actionTypes.BANK_QUESTION.VALID]({ commit }, payload) {
        try {
          const result = await new ImportValid(this.$axios)['postWithFormData'](payload);
          return result;
        } catch (error) {
          console.log("[BANK_QUESTION ImportValid] import.error", error);
        }
    },
    async [actionTypes.BANK_QUESTION.COMPLETE]({ commit }, payload) {
        try {
          const result = await new ImportComplete(this.$axios)['postWithFormData'](payload);
          return result;
        } catch (error) {
          console.log("[BANK_QUESTION ImportComplete] import.error", error);
        }
    },
    async [actionTypes.BANK_QUESTION.DOWNLOAD_SAMPLE]({ commit }, params) {
      try {
        return await this.$axios({
          url: `${APIs.BANK_QUESTION_DOWNLOAD_SAMPLES}`,
          method: "GET",
          params,
        }).then((res) => res.data)
          .then((result) => {
            if (result.success) {
              commit(mutationTypes.BANK_QUESTION.SET_BANK_QUESTION_DOWNLOAD_SAMPLES, result.data);
            }
            return result;
          });
      } catch (error) {
        console.log("[BANK_QUESTION] download", error);
      }
    },
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.BANK_QUESTION.SET_BANK_QUESTION_DOWNLOAD_SAMPLES](
    state,
    data
  ) {
      state.sampleFile = data;
  },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
