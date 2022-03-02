import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Accept from "~/services/elearning/teaching/Accept";

/**
 * initial state
 */
const state = () => ({});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
    async [actionTypes.TEACHING_ELEARNING_ACCEPT.ADD]({ commit }, payload) {
        try {
            const result = await new Accept(this.$axios)[actionTypes.BASE.ADD](
                payload
            );
            return result;
        } catch (error) {
            console.log("[Accept] add.error", error);
            throw error;
        }
    },
};

/**
 * initial mutations
 */
const mutations = {};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};