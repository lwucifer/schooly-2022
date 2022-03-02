import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Classes from "~/services/elearning/teaching/Classes";

/**
 * initial state
 */
const state = () => ({
    teachingClasses: [],
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
    async [actionTypes.ELEARNING_TEACHING_CLASS.LIST]({ commit }, payload) {
        try {
            const result = await new Classes(this.$axios)[actionTypes.BASE.LIST](payload);
            commit(
                mutationTypes.ELEARNING_TEACHING_CLASS.SET_TEACHING_CLASS_LIST,
                result.data
            );
            console.log('ELEARNING_TEACHING_CLASS.LIST', result)
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
    [mutationTypes.ELEARNING_TEACHING_CLASS.SET_TEACHING_CLASS_LIST](
        state,
        data
    ) {
        state.teachingClasses = data;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};