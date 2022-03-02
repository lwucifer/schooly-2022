import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Requests from "~/services/elearning/teaching/Requests";

/**
 * initial state
 */
const state = () => ({
    elearningRequest: [],
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
    async [actionTypes.TEACHING_ELEARNING_REQUESTS.LIST]({ commit }, payload) {
        try {
            const result = await new Requests(this.$axios)[actionTypes.BASE.LIST](
                payload
            );
            // set to mutation
            commit(
                mutationTypes.TEACHING_ELEARNING_REQUESTS
                .SET_TEACHING_ELEARNING_REQUESTS_LIST,
                result.data
            );
            return result;
        } catch (error) {
            console.log("[Request] list.error", error);
        }
    },
};

/**
 * initial mutations
 */
const mutations = {
    [mutationTypes.TEACHING_ELEARNING_REQUESTS
        .SET_TEACHING_ELEARNING_REQUESTS_LIST
    ](state, data) {
        console.log("SET_TEACHING_ELEARNING_REQUESTS_LIST", data);
        state.elearningRequest = data;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};