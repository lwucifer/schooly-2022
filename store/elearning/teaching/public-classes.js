import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import PublicClasses from "~/services/elearning/teaching/PublicClasses";
import Profile from "~/services/account/Profile";

/**
 * initial state
 */
const state = () => ({
    publicClassesList: [],
    profileListPublic: {},
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
    async [actionTypes.PUBLIC_CLASSES.LIST]({ commit }, payload) {
        try {
            const result = await new PublicClasses(this.$axios)[
                actionTypes.BASE.LIST
            ](payload);
            // set to mutation
            commit(mutationTypes.PUBLIC_CLASSES.SET_PUBLIC_CLASSES_LIST, result.data);
        } catch (error) {
            console.log("[PublicClasses] list.error", error);
        }
    },

    async [actionTypes.ACCOUNT_PROFILE.LIST]({ commit }, payload) {
        try {
            const result = await new Profile(this.$axios)[actionTypes.BASE.LIST](
                payload
            );
            commit(
                mutationTypes.ACCOUNT_PROFILE.SET_ACCOUNT_PROFILE_LIST,
                result.data
            );
            return result.data;
        } catch (err) {
            console.log("PROFILE add.err", err);
            return err;
        }
    },
};

/**
 * initial mutations
 */
const mutations = {
    [mutationTypes.PUBLIC_CLASSES.SET_PUBLIC_CLASSES_LIST](state, data) {
        console.log("SET_TEACHING_PUBLIC_LIST", data);
        state.publicClassesList = data;
    },
    [mutationTypes.ACCOUNT_PROFILE.SET_ACCOUNT_PROFILE_LIST](
        state,
        _profileList
    ) {
        // console.log("SET_ACCOUNT_PROFILE_LIST", _profileList);
        state.profileListPublic = _profileList;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};