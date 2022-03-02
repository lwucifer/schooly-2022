import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import StudyStudent from "~/services/elearning/study/StudyStudent";
import Statistic from "~/services/elearning/study/Statistic";
import Archive from "~/services/elearning/study/Archive";
import Favourite from "~/services/elearning/study/Favourite";

/**
 * initial state
 */
const state = () => ({
    elearningStudyStudent: [],
    elearningStudyStatistic: [],
    elearningStudyArchive: [],
    elearningStudyFavourite: [],
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
    async [actionTypes.ELEARNING_STUDY_STUDENT.LIST]({ commit }, payload) {
        try {
            const result = await new StudyStudent(this.$axios)[actionTypes.BASE.LIST](
                payload
            );
            commit(
                mutationTypes.ELEARNING_STUDY_STUDENT.SET_ELEARNING_STUDY_STUDENT,
                result.data
            );
            // console.log("[Elearning] list", result.data);
        } catch (error) {
            console.log("[Elearning study student] list.error", error);
        }
    },
    async [actionTypes.ELEARNING_STUDY_STATISTIC.LIST]({ commit }, payload) {
        try {
            const result = await new Statistic(this.$axios)[actionTypes.BASE.LIST](
                payload
            );
            commit(
                mutationTypes.ELEARNING_STUDY_STATISTIC.SET_ELEARNING_STUDY_STATISTIC,
                result.data
            );
            console.log("[ElearningStatistic] list", result.data);
        } catch (error) {
            console.log("[ElearningStatistic] list.error", error);
        }
    },
    async [actionTypes.ELEARNING_STURY_ARCHIVE.LIST]({ commit }, payload) {
        try {
            const result = await new Archive(this.$axios)[actionTypes.BASE.LIST](
                payload
            );
            commit(
                mutationTypes.ELEARNING_STUDY_ARCHIVE.SET_ELEARNING_STUDY_ARCHIVE_LIST,
                result.data
            );
            console.log("[ElearningArchive] list", result.data);
        } catch (error) {
            console.log("[ElearningArchive] list.error", error);
        }
    },
    async [actionTypes.ELEARNING_STURY_FAVOURITE.LIST]({ commit }, payload) {
        try {
            const result = await new Favourite(this.$axios)[actionTypes.BASE.LIST](
                payload
            );
            commit(
                mutationTypes.ELEARNING_STUDY_FAVOURITE
                .SET_ELEARNING_STUDY_FAVOURITE_LIST,
                result.data
            );
            console.log("[ElearningFavourite] list", result.data);
        } catch (error) {
            console.log("[ElearningFavourite] list.error", error);
        }
    },
};

/**
 * initial mutations
 */
const mutations = {
    [mutationTypes.ELEARNING_STUDY_STUDENT.SET_ELEARNING_STUDY_STUDENT](
        state,
        elearningStudyStudent
    ) {
        state.elearningStudyStudent = elearningStudyStudent;
    },
    [mutationTypes.ELEARNING_STUDY_STATISTIC.SET_ELEARNING_STUDY_STATISTIC](
        state,
        elearningStudyStatistic
    ) {
        state.elearningStudyStatistic = elearningStudyStatistic;
    },
    [mutationTypes.ELEARNING_STUDY_ARCHIVE.SET_ELEARNING_STUDY_ARCHIVE_LIST](
        state,
        elearningStudyArchive
    ) {
        state.elearningStudyArchive = elearningStudyArchive;
    },
    [mutationTypes.ELEARNING_STUDY_FAVOURITE.SET_ELEARNING_STUDY_FAVOURITE_LIST](
        state,
        elearningStudyFavourite
    ) {
        state.elearningStudyFavourite = elearningStudyFavourite;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};