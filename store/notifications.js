import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Notifications from "~/services/notification/notifications";
import { isEmpty, uniqWith, omit } from "lodash";
import NotiUnRead from "~/services/notification/NotiUnRead";
import { UPDATE_NOTI } from "~/utils/constants";
import RegisterDevice from "~/services/notification/RegisterDevice";

/**
 * initial state
 */
const state = () => ({
    notis: {
        listNotification: [],
        page: {},
    },
    notiUnread: 0,
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
    async [actionTypes.SOCIAL_NOTIFICATIONS.LIST]({ state, commit }, payload) {
        try {
            const payloadParams = {
                params: omit(payload.params, "payloadCheck"),
            };
            const result = await new Notifications(this.$axios)[
                actionTypes.BASE.LIST
            ](payloadParams);
            console.log("[Notifications] list", result);
            if (result.success && !isEmpty(result.data)) {
                const { page, listNotification } = result.data;
                if (payload.params.payloadCheck) {
                    commit(mutationTypes.SOCIAL_NOTI.SET_SOCIAL_NOTIFICATIONS_LIST, {
                        listNotification: uniqWith(
                            listNotification.concat(state.notis.listNotification),
                            (a, b) => a.id === b.id
                        ),
                        page,
                    });
                } else {
                    commit(mutationTypes.SOCIAL_NOTI.SET_SOCIAL_NOTIFICATIONS_LIST, {
                        listNotification: uniqWith(
                            state.notis.listNotification.concat(listNotification),
                            (a, b) => a.id === b.id
                        ),
                        page,
                    });
                }
            }
            return result;
        } catch (err) {
            console.log("[Notifications] list.err", err);
            return err;
        }
    },
    async [actionTypes.SOCIAL_NOTIFICATIONS.REGISTER_DEVICE]({ commit },
        payload
    ) {
        try {
            const data = await new RegisterDevice(this.$axios)[actionTypes.BASE.ADD](
                payload
            );
            console.log("[RegisterDevice] add", data, payload);
            return data;
        } catch (err) {
            console.log("[RegisterDevice] add.err", err, payload);
            return err;
        }
    },
    async [actionTypes.SOCIAL_NOTIFICATIONS.READ_NOTIFICATION]({ state, commit },
        payload
    ) {
        try {
            const result = await new Notifications(this.$axios)[
                actionTypes.BASE.EDIT_PAYLOAD
            ](payload);
            console.log("[Notifications] edit", result);
            if (result.success) {
                // const { data } = result;
                if (payload.update == UPDATE_NOTI.ONLY_ONE) {
                    const newlistNotification = state.notis.listNotification.map(
                        (item) => {
                            if (item.id === payload.notification_id) {
                                if (item.is_read == 0) {
                                    return {
                                        ...item,
                                        is_read: 1,
                                    };
                                } else {
                                    return {
                                        ...item,
                                        is_read: 0,
                                    };
                                }
                            }
                            return item;
                        }
                    );

                    commit(mutationTypes.SOCIAL_NOTI.SET_SOCIAL_NOTIFICATIONS_LIST, {
                        ...state.notis,
                        listNotification: newlistNotification,
                    });
                } else {
                    const newlistNotification = state.notis.listNotification.map(
                        (item) => {
                            return {
                                ...item,
                                is_read: 1,
                            };
                        }
                    );

                    commit(mutationTypes.SOCIAL_NOTI.SET_SOCIAL_NOTIFICATIONS_LIST, {
                        ...state.notis,
                        listNotification: newlistNotification,
                    });
                }
            }
            return result;
        } catch (err) {
            console.log("[Notifications] edit.err", err);
            return err;
        }
    },
    async [actionTypes.SOCIAL_NOTIFICATIONS.GET_NOTI_UNREAD]({ state, commit },
        payload
    ) {
        try {
            const result = await new NotiUnRead(this.$axios)[actionTypes.BASE.LIST](
                payload
            );
            commit(mutationTypes.SOCIAL_NOTI.SET_NOTI_UNREAD, result.data);
            console.log("[NotiUnRead] list", result.data);
            // if (result.success && !isEmpty(result.data)) {
            //     const { page, listNotification } = result.data;
            //     commit(mutationTypes.SOCIAL_NOTI.SET_SOCIAL_NOTIFICATIONS_LIST, {
            //         listNotification: state.notis.listNotification.concat(
            //             listNotification
            //         ),
            //         page,
            //     });
            // }
            return result;
        } catch (err) {
            console.log("[NotiUnRead] list.err", err);
            return err;
        }
    },
};

/**
 * initial mutations
 */
const mutations = {
    [mutationTypes.SOCIAL_NOTI.SET_SOCIAL_NOTIFICATIONS_LIST](state, _notis) {
        console.log("[state.notis]", _notis);
        state.notis = _notis;
    },
    [mutationTypes.SOCIAL_NOTI.SET_NOTI_UNREAD](state, _notiUnread) {
        state.notiUnread =
            _notiUnread && _notiUnread.total_unread ? _notiUnread.total_unread : 0;
    },
    [mutationTypes.SOCIAL_NOTI.REVICE_NOTI](state, _noti) {
        // console.log("[REVICE_NOTI]", state.notis, _noti);
        if (_noti) {
            state.notiUnread += 1;
        }
        // state.notis.listNotification.unshift(_noti);
    },
    [mutationTypes.SOCIAL_NOTI.COMMIT_NOTI_UNREAD](state, _commitNotiUnread) {
        state.notiUnread = _commitNotiUnread;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};