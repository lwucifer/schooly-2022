import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import TeachingPublic from "~/services/elearning/teaching/TeachingPublic";

/**
 * initial state
 */
const state = () => ({
    teachingPublicList: [],
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
    async [actionTypes.TEACHING_PUBLIC_LIST.LIST]({ commit }, payload) {
        try {
            const result = await new TeachingPublic(this.$axios)[
                actionTypes.BASE.LIST
            ](payload);
            // set to mutation
            commit(
                mutationTypes.TEACHING_PUBLIC_LIST.SET_TEACHING_PUBLIC_LIST,
                result.data
            );
            return result;
        } catch (error) {
            console.log("[TeachingPublic] list.error", error);
        }
    },
};

/**
 * initial mutations
 */
const mutations = {
    [mutationTypes.TEACHING_PUBLIC_LIST.SET_TEACHING_PUBLIC_LIST](state, data) {
        console.log("SET_TEACHING_PUBLIC_LIST", data);
        state.teachingPublicList = data;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};