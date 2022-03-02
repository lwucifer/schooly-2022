import * as actionTypes from "~/utils/action-types";
import { SOCIAL, ELEARNING } from "~/utils/config"
import * as mutationTypes from "~/utils/mutation-types";
import Notifications from "~/services/elearning/study/Notifications";
import { isEmpty, uniqWith, isEqual } from "lodash";

/**
 * initial state
 */
const state = () => ({
    notiElearning: [],
    notiSocial: [],
    countNotiElearning: 0,
    countNotiSocial: 0,
    notiUnread: 0,
    checkfireBase: false
});

/**
 * initial getters
 */
const getters = {
    countSumNoti(state) {
        return parseInt(state.countNotiElearning) + parseInt(state.countNotiSocial)
    },
};

/**
 * initial actions
 */
const actions = {
    async [actionTypes.HEADER_NOTIFICATIONS.LIST]({ state, commit }, payload) {
        try {
            const result = await new Notifications(this.$axios)[
                actionTypes.HEADER_NOTIFICATIONS.LIST
            ](payload);
            if (result.data) {
                // console.log('HEADER_NOTIFICATIONS.LIST', result.data)
                if (payload.service_type == ELEARNING) {
                    commit(mutationTypes.HEADER_NOTI.SET_NOTIFICATIONS_ELEARNING_LIST, result.data);
                }
                if (payload.service_type == SOCIAL) {
                    commit(mutationTypes.HEADER_NOTI.SET_NOTIFICATIONS_SOCIAL_LIST, result.data);
                }
            }
            return result.data

        } catch (err) {
            console.log("[Notifications] list.err", err);
            return err;
        }
    },

    async [actionTypes.HEADER_NOTIFICATIONS.LIST_SCROLL]({ state, commit }, payload) {
        try {
            const result = await new Notifications(this.$axios)[
                actionTypes.HEADER_NOTIFICATIONS.LIST
            ](payload);
            if (result.data) {
                // console.log('HEADER_NOTIFICATIONS.LIST', result.data)
                if (payload.service_type == ELEARNING) {
                    commit(mutationTypes.HEADER_NOTI.SET_NOTIFICATIONS_ELEARNING_LIST,
                        uniqWith(state.notiElearning.concat(result.data), (a, b) => a.id === b.id)
                    );
                }
                if (payload.service_type == SOCIAL) {
                    commit(mutationTypes.HEADER_NOTI.SET_NOTIFICATIONS_SOCIAL_LIST,
                        uniqWith(state.notiSocial.concat(result.data), (a, b) => a.id === b.id)
                    );
                }
            }
            return result.data

        } catch (err) {
            console.log("[Notifications] list.err", err);
            return err;
        }
    },


    async [actionTypes.HEADER_NOTIFICATIONS.LIST_COUNT]({ state, commit }, payload) {
        try {
            const result = await new Notifications(this.$axios)[
                actionTypes.HEADER_NOTIFICATIONS.LIST_COUNT
            ](payload);
            if (payload.service_type == ELEARNING) {
                commit(mutationTypes.HEADER_NOTI.SET_COUNT_NOTI_ELEARNING, result.data);
            }
            if (payload.service_type == SOCIAL) {
                commit(mutationTypes.HEADER_NOTI.SET_COUNT_NOTI_SOCIAL, result.data);
            }
        } catch (err) {
            console.log("[Notifications] list.err", err);
            return err;
        }
    },

    async [actionTypes.HEADER_NOTIFICATIONS.DETAIL_LIST]({ state, commit }, payload) {
        try {
            const result = await new Notifications(this.$axios)[
                actionTypes.BASE.DETAIL
            ](payload);
            commit(mutationTypes.HEADER_NOTI.SET_NOTIFICATIONS_LIST, result.data);
        } catch (err) {
            console.log("[Notifications] list.err", err);
            return err;
        }
    },



    async [actionTypes.HEADER_NOTIFICATIONS.CHECK_IS_READ_NOTIFICATION]({ state, commit }, payload) {
        try {
            const result = await new Notifications(this.$axios)[
                actionTypes.HEADER_NOTIFICATIONS.CHECK_IS_READ_NOTIFICATION
            ](payload);
            return result;
        } catch (err) {
            console.log("[Notifications] PUT.err", err);
            return err;
        }
    },


    async [actionTypes.HEADER_NOTIFICATIONS.DELETE]({ commit }, options) {
        try {
            const result = await new Notifications(this.$axios)[
                actionTypes.HEADER_NOTIFICATIONS.DELETE
            ](options.notification_id, options.body);
            console.log("[HEADER_NOTIFICATIONS.DELETE]", result);
            return result;
        } catch (error) {
            console.log("[Notifications] delete.error", error);
        }
    }
};

/**
 * initial mutations
 */
const mutations = {
    [mutationTypes.HEADER_NOTI.SET_NOTIFICATIONS_ELEARNING_LIST](state, _notis) {
        state.notiElearning = _notis;
        // console.log("[state.notiElearning]", state.notiElearning);
    },
    [mutationTypes.HEADER_NOTI.SET_NOTIFICATIONS_SOCIAL_LIST](state, _notis) {
        // console.log("[state.notis]", _notis);
        state.notiSocial = _notis;
    },
    [mutationTypes.HEADER_NOTI.SET_COUNT_NOTI_ELEARNING](state, _notis) {
        state.countNotiElearning = _notis;
    },
    [mutationTypes.HEADER_NOTI.SET_COUNT_NOTI_SOCIAL](state, _notis) {
        state.countNotiSocial = _notis;
    },

    [mutationTypes.HEADER_NOTI.SET_CHECK_FIREBASE](state, _notis) {
        console.log("[state.checkfireBase]", _notis);
        state.checkfireBase = _notis;
    },

};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};