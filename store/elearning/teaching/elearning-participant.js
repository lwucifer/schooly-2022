import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import ELearningParticipant from "~/services/elearning/teaching/ElearningParticipant";

/**
 * initial state
 */
const state = () => ({
    elearningParti: [],
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
    async [actionTypes.TEACHING_ELEARNING_PARTICIPANT.LIST]({ commit }, payload) {
        try {
            const result = await new ELearningParticipant(this.$axios)[
                actionTypes.BASE.LIST
            ](payload);
            // set to mutation
            commit(
                mutationTypes.TEACHING_ELEARNING_PARTICIAPANT
                .SET_TEACHING_ELEARNING_PARTICIPANT_LIST,
                result.data
            );
        } catch (error) {
            console.log("[Teaching ELEARNING participants] list.error", error);
        }
    },
};

/**
 * initial mutations
 */
const mutations = {
    [mutationTypes.TEACHING_ELEARNING_PARTICIAPANT
        .SET_TEACHING_ELEARNING_PARTICIPANT_LIST
    ](state, data) {
        console.log("SET_ELEARNING_TEACHING_ELEARNING_PARTICIPANT_LIST", data);
        state.elearningParti = data;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};