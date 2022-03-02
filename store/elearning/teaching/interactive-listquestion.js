import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import InteractiveListQuesiton from "~/services/elearning/teaching/InteractiveListQuesiton";
import { isEmpty, uniqWith, omitBy } from "lodash";
/**
 * initial state
 */
const state = () => ({
    listQuestions: [],
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
    async [actionTypes.TEACHING_INTERACTIVE_LISTQUESTION.LIST]({ commit },
        payload
    ) {
        try {
            const result = await new InteractiveListQuesiton(this.$axios)[
                actionTypes.BASE.LIST
            ](payload);
            // set to mutation
            commit(
                mutationTypes.TEACHING_INTERACTIVE_LISTQUESTION
                .SET_TEACHING_INTERACTIVE_LISTQUESTION_LIST,
                result.data
            );
            return result;
        } catch (error) {
            console.log("[TEACHING_INTERACTIVE_LISTQUESTION] list.error", error);
        }
    },
};

/**
 * initial mutations
 */
const mutations = {
    [mutationTypes.TEACHING_INTERACTIVE_LISTQUESTION
        .SET_TEACHING_INTERACTIVE_LISTQUESTION_LIST
    ](state, data) {
        console.log("SET_TEACHING_INTERACTIVE_LISTQUESTION_LIST", data);
        state.listQuestions = data;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};