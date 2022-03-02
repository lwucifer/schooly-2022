import * as actionTypes from "../../../utils/action-types";
import * as mutationTypes from "../../../utils/mutation-types";
import Archive from "~/services/elearning/study/Archive";

/**
 * initial state
 */
const state = () => ({
    archives: [],
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
    async [actionTypes.ELEARNING_STURY_ARCHIVE.LIST]({ commit }, options) {
        try {
            const result = await new Archive(this.$axios)[actionTypes.BASE.LIST](
                options
            );
            commit(
                mutationTypes.ELEARNING_STUDY_ARCHIVE.SET_ELEARNING_STUDY_ARCHIVE_LIST,
                result.data
            );
        } catch (error) {
            console.log(error);
        }
    },
    async [actionTypes.ELEARNING_STURY_ARCHIVE.ADD]({ commit }, options) {
        try {
            const result = await new Archive(this.$axios)[actionTypes.BASE.ADD](
                options
            );
            return result;
        } catch (error) {
            console.log(error);
        }
    },
    async [actionTypes.ELEARNING_STURY_ARCHIVE.DELETE]({ commit }, payload) {
        try {
            const result = await new Archive(this.$axios)[
                actionTypes.BASE.DELETE_PAYLOAD
            ](payload);
            return result;
        } catch (error) {
            console.log(error);
        }
    },
};

/**
 * initial mutations
 */
const mutations = {
    [mutationTypes.ELEARNING_STUDY_ARCHIVE.SET_ELEARNING_STUDY_ARCHIVE_LIST](
        state,
        archives
    ) {
        state.archives = archives;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};