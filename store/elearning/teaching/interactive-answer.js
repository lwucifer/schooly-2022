import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import { InteractiveAddAnswer, InteractiveLikeAnswer,InteractiveAnswerList } from "~/services/elearning/teaching/InteractiveAnswer";

/**
 * initial state
 */
const state = () => ({
    listAnswers: [],
    hideFrom: false
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
    async [actionTypes.TEACHING_INTERACTIVE_ANSWER.LIST]({ commit },
        payload
    ) {
        try {
            const result = await new InteractiveAnswerList(this.$axios)[
                actionTypes.BASE.LIST
            ](payload);
            // set to mutation
            commit(
                mutationTypes.TEACHING_INTERACTIVE_LISTANSWER
                .SET_TEACHING_INTERACTIVE_LISTANSWER_LIST,
                result.data
            );
            return result;
        } catch (error) {
            console.log("[TEACHING_INTERACTIVE_LISTQUESTION] list.error", error);
        }
    }
};

/**
 * initial mutations
 */
const mutations = {
    [mutationTypes.TEACHING_INTERACTIVE_LISTANSWER
        .SET_TEACHING_INTERACTIVE_LISTANSWER_LIST
    ](state, data) {
        console.log("SET_TEACHING_INTERACTIVE_LISTANSWER_LIST", data);
        state.listAnswers = data;
    },
    [mutationTypes.ANSWER.HIDE_FROM](state, data) {
        state.hideFrom = !state.hideFrom;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};