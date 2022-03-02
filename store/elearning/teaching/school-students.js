import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import SchoolStudent from "~/services/elearning/school/SchoolStudent";

/**
 * initial state
 */
const state = () => ({
    students: [],
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
    async [actionTypes.TEACHING_SCHOOL_STUDENTS.LIST]({ commit }, payload) {
        try {
            const result = await new SchoolStudent(this.$axios)[
                actionTypes.BASE.LIST
            ](payload);
            console.log("SchoolStudent", result)
            // set to mutation
            commit(
                mutationTypes.TEACHING_SCHOOL_STUDENTS.SET_TEACHING_SCHOOL_STUDENTS_LIST,
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
    [mutationTypes.TEACHING_SCHOOL_STUDENTS.SET_TEACHING_SCHOOL_STUDENTS_LIST](
        state,
        data
    ) {
        state.students = data;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};