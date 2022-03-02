import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import ELearningParticipant from "~/services/elearning/teaching/ElearningParticipant";
import Progress from "~/services/elearning/teaching/Progress";

/**
 * initial state
 */
const state = () => ({
    progress: [],
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
    async [actionTypes.TEACHING_STUDENT_PROGRESS.LIST]({ commit }, payload) {
        try {
            const result = await new Progress(this.$axios)[actionTypes.BASE.LIST](
                payload
            );
            // set to mutation
            commit(
                mutationTypes.TEACHING_STUDENT_PROGRESS
                .SET_TEACHING_STUDENT_PROGRESS_LIST,
                result.data
            );
        } catch (error) {
            console.log("[Progress] list.error", error);
        }
    },
};

/**
 * initial mutations
 */
const mutations = {
    [mutationTypes.TEACHING_STUDENT_PROGRESS.SET_TEACHING_STUDENT_PROGRESS_LIST](
        state,
        data
    ) {
        console.log("SET_ELEARNING_TEACHING_ELEARNING_PARTICIPANT_LIST", data);
        state.progress = data;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};