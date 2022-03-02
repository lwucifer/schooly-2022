import * as actionTypes from "../utils/action-types";
import * as mutationTypes from "../utils/mutation-types";
import GroupAddMember from "~/services/message/GroupAddMember";
import GroupAvatar from "~/services/message/GroupAvatar";
import GroupName from "~/services/message/GroupName";
import Group from "~/services/message/Group";
import GroupMember from "~/services/message/GroupMember";
import GroupLeave from "~/services/message/GroupLeave";
import GroupRemoveMember from "~/services/message/GroupRemoveMember";
import GroupNotification from "~/services/message/GroupNotification";
import Message from "~/services/message/Message";
import GroupDetail from "~/services/message/GroupDetail";
import MessageSendImg from "~/services/message/MessageSendImg";
import Personal from "../services/account/Personal";
import MessageType from "~/services/message/MessageType";
import MessageSendFile from "~/services/message/MessageSendFile";
import Friends from "~/services/social/Friends";
import { isEmpty, uniqWith, isEqual, omit } from "lodash";

/**
 * initial state
 */
const state = () => ({
    memberList: {},
    groupList: {},
    messageList: {},
    groupListDetail: {},
    messageEmit: {},
    messageOn: {},
    closeCreate: true,
    isGroupState: false,
    listMessageType: {},
    tabChat: true,
    friendList: {},
    groups: {
        listMessage: [],
        page: {},
    },
    chats: {
        listMessage: [],
        page: {},
    },
    isCreated: false,
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
    async [actionTypes.MESSAGE_GROUP.ADD_MEMBER]({ commit }, payload) {
        try {
            const result = await new GroupAddMember(this.$axios)[
                actionTypes.BASE.ADD
            ](payload);
            console.log("[AddMember] add", result);
            return result;
        } catch (err) {
            console.log("[AddMember] add.err", err);
            return err;
        }
    },
    async [actionTypes.MESSAGE_GROUP.EDIT_AVATAR_GROUP]({ commit }, payload) {
        try {
            const result = await new GroupAvatar(this.$axios)[
                actionTypes.BASE.EDIT_PAYLOAD
            ](payload);
            console.log("[GroupAvatar] edit", result);
            return result;
        } catch (err) {
            console.log("[GroupAvatar] edit.err", err);
            return err;
        }
    },
    async [actionTypes.MESSAGE_GROUP.EDIT_NAME]({ commit }, payload) {
        try {
            const result = await new GroupName(this.$axios)[
                actionTypes.BASE.EDIT_PAYLOAD
            ](payload);
            console.log("[GroupName] edit", result);
            return result;
        } catch (err) {
            console.log("[GroupName] edit.err", err);
            return err;
        }
    },
    async [actionTypes.MESSAGE_GROUP.CREATE_GROUP]({ commit }, payload) {
        try {
            const result = await new Group(this.$axios)[actionTypes.BASE.ADD](
                payload
            );
            console.log("[Group] add", result);
            return result;
        } catch (err) {
            console.log("[Group] add.err", err);
            return err;
        }
    },
    async [actionTypes.MESSAGE_GROUP.GROUP_LIST]({ commit }, payload) {
        try {
            const { data: result = {} } = await new Group(this.$axios)[
                actionTypes.BASE.LIST
            ](payload);
            // console.log("[Group] list", result);

            // set to mutation
            commit(mutationTypes.MESSAGE_GROUP.SET_GROUP_LIST, result);
            return result;
        } catch (err) {
            console.log("[Group] list.err", err);
            return err;
        }
    },
    async [actionTypes.MESSAGE_GROUP.MEMBER_LIST]({ commit }, payload) {
        try {
            const { data: result = {} } = await new GroupMember(this.$axios)[
                actionTypes.BASE.LIST
            ](payload);
            // console.log("[GroupMember] list", result);

            // set to mutation
            commit(mutationTypes.MESSAGE_GROUP.SET_MEMBER_LIST, result);
            return result;
        } catch (err) {
            console.log("[GroupMember] list.err", err);
            return err;
        }
    },
    async [actionTypes.MESSAGE_GROUP.GROUP_LEAVE]({ commit }, payload) {
        try {
            const result = await new GroupLeave(this.$axios)[
                actionTypes.BASE.EDIT_PAYLOAD
            ](payload);
            // console.log("[GroupLeave] edit", result);
            return result;
        } catch (err) {
            console.log("[GroupLeave] edit.err", err);
            return err;
        }
    },
    async [actionTypes.MESSAGE_GROUP.GROUP_REMOVE_MEMBER]({ commit }, payload) {
        try {
            const result = await new GroupRemoveMember(this.$axios)[
                actionTypes.BASE.EDIT_PAYLOAD
            ](payload);
            // console.log("[GroupRemoveMember] edit", result);
            return result;
        } catch (err) {
            console.log("[GroupRemoveMember] edit.err", err);
            return err;
        }
    },
    async [actionTypes.MESSAGE_GROUP.GROUP_NOTIFICATION]({ state, commit },
        payload
    ) {
        try {
            const result = await new GroupNotification(this.$axios)[
                actionTypes.BASE.EDIT_PAYLOAD
            ](omit(payload, "user_id"));
            console.log("[GroupNotification] payload", payload);
            if (result.success) {
                // const { data } = result;
                if (state.tabChat == false) {
                    const newlistMessage = state.groups.listMessage.map((item) => {
                        if (item.room.id === payload.room_id) {
                            if (payload.notification == 1) {
                                const newMemberNoti = item.room.members.map((i) => {
                                    if (i.user_id == payload.user_id) {
                                        return {
                                            ...i,
                                            allow_notication: 1,
                                        };
                                    }
                                    return i;
                                });
                                return {
                                    message: item.message,
                                    sender: item.sender,
                                    room: {
                                        ...item.room,
                                        members: newMemberNoti,
                                    },
                                };
                            } else {
                                const newMemberNoti = item.room.members.map((i) => {
                                    if (i.user_id == payload.user_id) {
                                        return {
                                            ...i,
                                            allow_notication: 0,
                                        };
                                    }
                                    return i;
                                });
                                return {
                                    message: item.message,
                                    sender: item.sender,
                                    room: {
                                        ...item.room,
                                        members: newMemberNoti,
                                    },
                                };
                            }
                        }
                        return item;
                    });
                    commit(mutationTypes.MESSAGE_GROUP.SET_LIST_MESSAGE_TYPE_GROUP, {
                        ...state.groups,
                        listMessage: newlistMessage,
                    });
                } else {
                    const newlistMessage = state.chats.listMessage.map((item) => {
                        if (item.room.id === payload.room_id) {
                            if (payload.notification == 1) {
                                const newMemberNoti = item.room.members.map((i) => {
                                    if (i.user_id == payload.user_id) {
                                        return {
                                            ...i,
                                            allow_notication: 1,
                                        };
                                    }
                                    return i;
                                });
                                return {
                                    message: item.message,
                                    sender: item.sender,
                                    room: {
                                        ...item.room,
                                        members: newMemberNoti,
                                    },
                                };
                            } else {
                                const newMemberNoti = item.room.members.map((i) => {
                                    if (i.user_id == payload.user_id) {
                                        return {
                                            ...i,
                                            allow_notication: 0,
                                        };
                                    }
                                    return i;
                                });
                                return {
                                    message: item.message,
                                    sender: item.sender,
                                    room: {
                                        ...item.room,
                                        members: newMemberNoti,
                                    },
                                };
                            }
                        }
                        return item;
                    });
                    commit(mutationTypes.MESSAGE_GROUP.SET_LIST_MESSAGE_TYPE_CHAT, {
                        ...state.chats,
                        listMessage: newlistMessage,
                    });
                }
            }
            return result;
        } catch (err) {
            console.log("[GroupNotification] edit.err", err);
            return err;
        }
    },
    async [actionTypes.MESSAGE_GROUP.MESSAGE_LIST]({ commit }, payload) {
        try {
            const { data: result = {} } = await new Message(this.$axios)[
                actionTypes.BASE.LIST
            ](payload);
            console.log("[Message] list", result);

            // set to mutation
            commit(mutationTypes.MESSAGE_GROUP.SET_MESSAGE_LIST, result);
            return result;
        } catch (err) {
            console.log("[Message] list.err", err);
            return err;
        }
    },
    async [actionTypes.MESSAGE_GROUP.GROUP_LIST_DETAIL]({ commit }, payload) {
        try {
            const { data: result = {} } = await new GroupDetail(this.$axios)[
                actionTypes.BASE.LIST
            ](payload);
            console.log("[GroupDetail] list", result);

            // set to mutation
            commit(mutationTypes.MESSAGE_GROUP.SET_GROUP_LIST_DETAIL, result);
            if (result.room) {
                if (result.room.type == 1) {
                    commit(mutationTypes.MESSAGE_GROUP.SET_TAB_CHAT, true);
                } else {
                    commit(mutationTypes.MESSAGE_GROUP.SET_TAB_CHAT, false);
                }
            } else {
                commit(mutationTypes.MESSAGE_GROUP.SET_TAB_CHAT, true);
            }
            return result;
        } catch (err) {
            console.log("[GroupDetail] list.err", err);
            return err;
        }
    },
    async [actionTypes.MESSAGE_GROUP.MESSAGE_SEND_IMG]({ commit }, payload) {
        try {
            const result = await new MessageSendImg(this.$axios)[
                actionTypes.BASE.ADD
            ](payload);
            console.log("[MessageSendImg] post", result);
            return result;
        } catch (err) {
            console.log("[MessageSendImg] edit.err", err);
            return err;
        }
    },
    async [actionTypes.MESSAGE_GROUP.MESSAGE_SEND_FILE]({ commit }, payload) {
        try {
            const result = await new MessageSendFile(this.$axios)[
                actionTypes.BASE.ADD
            ](payload);
            console.log("[MessageSendFile] post", result);
            return result;
        } catch (err) {
            console.log("[MessageSendFile] edit.err", err);
            return err;
        }
    },
    async [actionTypes.ACCOUNT_PERSONAL.LIST]({ commit }, payload) {
        try {
            const result = await new Personal(this.$axios)[actionTypes.BASE.DETAIL](
                payload
            );
            return result;
        } catch (err) {
            console.log("[Personal Message] list.err", err);
            return err;
        }
    },
    async [actionTypes.MESSAGE_GROUP.LIST_MESSAGE_TYPE]({ state, commit },
        payload
    ) {
        const payloadParams = { params: omit(payload.params, "payloadCheck") };
        try {
            const result = await new MessageType(this.$axios)[actionTypes.BASE.LIST](
                payloadParams
            );
            console.log("payload", payload);
            if (payload.params.room_type == 2) {
                if (result.success && !isEmpty(result.data)) {
                    const { page, listMessage } = result.data;
                    if (payload.params.payloadCheck) {
                        commit(mutationTypes.MESSAGE_GROUP.SET_LIST_MESSAGE_TYPE_GROUP, {
                            listMessage: uniqWith(
                                listMessage.concat(state.groups.listMessage),
                                isEqual
                            ),
                            page,
                        });
                    } else {
                        commit(mutationTypes.MESSAGE_GROUP.SET_LIST_MESSAGE_TYPE_GROUP, {
                            listMessage: uniqWith(
                                state.groups.listMessage.concat(listMessage),
                                isEqual
                            ),
                            page,
                        });
                    }
                }
            } else {
                // set to mutation
                if (result.success && !isEmpty(result.data)) {
                    const { page, listMessage } = result.data;
                    if (payload.params.payloadCheck) {
                        commit(mutationTypes.MESSAGE_GROUP.SET_LIST_MESSAGE_TYPE_CHAT, {
                            listMessage: uniqWith(
                                listMessage.concat(state.chats.listMessage),
                                isEqual
                            ),
                            page,
                        });
                    } else {
                        commit(mutationTypes.MESSAGE_GROUP.SET_LIST_MESSAGE_TYPE_CHAT, {
                            listMessage: uniqWith(
                                state.chats.listMessage.concat(listMessage),
                                isEqual
                            ),
                            page,
                        });
                    }
                }
            }
            console.log("[MessageType] post", result);
            return result;
        } catch (err) {
            console.log("[MessageType] edit.err", err);
            return err;
        }
    },
    async [actionTypes.SOCIAL_FRIEND.LIST]({ commit }, payload) {
        try {
            const { data: result = {} } = await new Friends(this.$axios)[
                actionTypes.BASE.LIST
            ](payload);
            console.log("[SocialFriend] list", result);

            // set to mutation
            commit(mutationTypes.MESSAGE_GROUP.SET_SOCIAL_FRIEND_LIST, result || []);
            return result;
        } catch (err) {
            console.log("[SocialFriend] list.err", err);
            return err;
        }
    },
};

/**
 * initial mutations
 */
const mutations = {
    [mutationTypes.MESSAGE_GROUP.SET_MEMBER_LIST](state, _memberList) {
        state.memberList = _memberList;
    },
    [mutationTypes.MESSAGE_GROUP.SET_GROUP_LIST](state, _groupList) {
        state.groupList = _groupList;
    },
    [mutationTypes.MESSAGE_GROUP.SET_MESSAGE_LIST](state, _messageList) {
        state.messageList = _messageList;
    },
    [mutationTypes.MESSAGE_GROUP.SET_GROUP_LIST_TYPE](state, _groupListType) {
        state.groupListType = _groupListType;
    },
    [mutationTypes.MESSAGE_GROUP.SET_GROUP_LIST_DETAIL](state, _groupListDetail) {
        state.groupListDetail = _groupListDetail;
    },
    [mutationTypes.MESSAGE_GROUP.SET_EMIT_MESSAGE](state, _messageEmit) {
        state.messageEmit = _messageEmit;
    },
    [mutationTypes.MESSAGE_GROUP.SET_ON_MESSAGE](state, _messageOn) {
        state.messageOn = _messageOn;
    },
    [mutationTypes.MESSAGE_GROUP.EMIT_CLOSE_FALSE](state, _close, _isGroup) {
        state.closeCreate = _close;
        state.closeCreate = _isGroup;
    },
    [mutationTypes.MESSAGE_GROUP.SET_LIST_MESSAGE_TYPE](state, _listMessageType) {
        state.listMessageType = _listMessageType;
    },
    [mutationTypes.MESSAGE_GROUP.SET_TAB_CHAT](state, _tabChat) {
        console.log("tabChat", _tabChat);
        state.tabChat = _tabChat;
    },
    [mutationTypes.MESSAGE_GROUP.SET_SOCIAL_FRIEND_LIST](state, _friendList) {
        state.friendList = _friendList;
    },
    [mutationTypes.MESSAGE_GROUP.SET_LIST_MESSAGE_TYPE_GROUP](state, _groups) {
        state.groups = _groups;
    },
    [mutationTypes.MESSAGE_GROUP.SET_LIST_MESSAGE_TYPE_CHAT](state, _chats) {
        state.chats = _chats;
    },
    [mutationTypes.MESSAGE_GROUP.SET_IS_CREATED](state, _isCreated) {
        state.isCreated = _isCreated;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};