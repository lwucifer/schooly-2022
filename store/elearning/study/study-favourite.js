import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Favourite from "~/services/elearning/study/Favourite";

/**
 * initial state
 */
const state = () => ({
    favourites: [],
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
    async [actionTypes.ELEARNING_STURY_FAVOURITE.LIST]({ commit }, options) {
        try {
            const result = await new Favourite(this.$axios)[actionTypes.BASE.LIST](
                options
            );
            commit(
                mutationTypes.ELEARNING_STUDY_FAVOURITE
                .SET_ELEARNING_STUDY_FAVOURITE_LIST,
                result.data
            );
        } catch (error) {
            console.log(error);
        }
    },
    async [actionTypes.ELEARNING_STURY_FAVOURITE.ADD]({ commit }, options) {
        try {
            const result = await new Favourite(this.$axios)[actionTypes.BASE.ADD](
                options
            );
            // commit(
            //     mutationTypes.ELEARNING_STUDY_FAVOURITE
            //     .SET_ELEARNING_STUDY_FAVOURITE_ADD,
            //     result
            // );
            return result;
        } catch (error) {
            console.log(error);
        }
    },
    async [actionTypes.ELEARNING_STURY_FAVOURITE.DELETE]({ commit }, payload) {
        try {
            console.log("payload", payload);
            const result = await new Favourite(this.$axios)[
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
    [mutationTypes.ELEARNING_STUDY_FAVOURITE.SET_ELEARNING_STUDY_FAVOURITE_LIST](
        state,
        favourites
    ) {
        state.favourites = favourites;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};