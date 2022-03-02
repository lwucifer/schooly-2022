import * as actionTypes from "../../../utils/action-types";
import * as mutationTypes from "../../../utils/mutation-types";
import Overview from "~/services/elearning/study/Overview";

/**
 * initial state
 */
const state = () => ({
    overview: {},
    timeTable: [],
    deadline: []
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
    async [actionTypes.ELEARNING_STURY_OVERVIEW.LIST]({ commit }, payload) {
        console.log('ELEARNING_STURY_OVERVIEW.LIST');
        try {
            const result = await new Overview(this.$axios)[
                actionTypes.ELEARNING_STURY_OVERVIEW.OVERVIEW_BASE_SERVICE
            ](payload);
            commit(
                mutationTypes.ELEARNING_STUDY_OVERVIEW.SET_ELEARNING_STUDY_OVERVIEW,
                result.data
            );
        } catch (error) {
            console.log(error);
        }
    },

    async [actionTypes.ELEARNING_STURY_OVERVIEW.TIME_TABLE]({ commit }, payload) {
        console.log('ELEARNING_STURY_OVERVIEW.LIST');
        try {
            const result = await new Overview(this.$axios)[
                actionTypes.ELEARNING_STURY_OVERVIEW.TIME_TABLE_BASE_SERVICE
            ](payload);
            commit(
                mutationTypes.ELEARNING_STUDY_OVERVIEW.SET_ELEARNING_STUDY_TIME_TABLE,
                result.data
            );
        } catch (error) {
            console.log(error);
        }
    },

    async [actionTypes.ELEARNING_STURY_OVERVIEW.DEADLINE]({ commit }, payload) {
        console.log('ELEARNING_STURY_OVERVIEW.LIST');
        try {
            const result = await new Overview(this.$axios)[
                actionTypes.ELEARNING_STURY_OVERVIEW.DEADLINE_BASE_SERVICE
            ](payload);
            commit(
                mutationTypes.ELEARNING_STUDY_OVERVIEW.SET_ELEARNING_STUDY_DEADLINE,
                result.data.content
            );
        } catch (error) {
            console.log(error);
        }
    },
};

/**
 * initial mutations
 */
const mutations = {
    [mutationTypes.ELEARNING_STUDY_OVERVIEW.SET_ELEARNING_STUDY_OVERVIEW](state, _data) {
        state.overview = _data;
    },
    [mutationTypes.ELEARNING_STUDY_OVERVIEW.SET_ELEARNING_STUDY_TIME_TABLE](state, _data) {
        state.timeTable = _data;
    },
    [mutationTypes.ELEARNING_STUDY_OVERVIEW.SET_ELEARNING_STUDY_DEADLINE](state, _data) {
        state.deadline = _data;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};