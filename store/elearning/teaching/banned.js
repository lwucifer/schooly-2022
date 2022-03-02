import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Banned from "~/services/elearning/teaching/Banned";

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
    async [actionTypes.TEACHING_ELEARNING_BANNED.ADD]({ commit }, payload) {
        try {
            const result = await new Banned(this.$axios)[actionTypes.BASE.ADD](
                payload
            );
            console.log("payload banned", payload);
            return result;
        } catch (error) {
            console.log("[Banned] add.error", error);
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