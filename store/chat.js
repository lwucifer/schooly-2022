import * as actionTypes from "../utils/action-types";
import * as mutationTypes from "../utils/mutation-types";
import { isEmpty, uniqWith, isEqual, omit } from "lodash";
import Room from "~/services/chat/Room";
import Member from "~/services/chat/Member";
import Media from "~/services/chat/Media";
import Friends from "~/services/chat/Friends";
import * as APIs from "~/utils/endpoints";

/**
 * initial state
 */
const state = () => ({
  roomList: { list_room: [] },
  memberList: [],
  messageList: [],
  stateIdPush: +new Date(),
  messageEmit: {},
  messageOn: {},
  messageRes: {},
  imageList: [],
  fileList: [],
  friendList: [],
  messageListFetch: [],
  socketLeaveRoom: null,
  stateHideNewRoom: null,
  stateDataEmitJoinRoom: null,
  ckeckGetListRoom: null
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.CHAT.ROOM_LIST]({ commit, state }, payload) {
    try {
      const payloadParams = omit(payload, "reviceMessage");
      // console.log('[payloadParams]', payloadParams)
      const { data: result = {} } = await new Room(this.$axios)[
        actionTypes.BASE.LIST
      ]({ params: payloadParams });
      // console.log("[Room] list", payload);
      if (result) {
        if (!payload.reviceMessage) {
          const { list_room } = result;
          commit(mutationTypes.CHAT.SET_ROOM_LIST, {
            list_room: uniqWith(
              state.roomList.list_room.concat(list_room),
              (a, b) => a.id === b.id
            ),
          });
        } else {
          const { list_room } = result;
          commit(mutationTypes.CHAT.SET_ROOM_LIST, {
            list_room: uniqWith(
              list_room.concat(state.roomList.list_room),
              (a, b) => a.id === b.id
            ),
          });
        }
      }
      if (state.ckeckGetListRoom == true) {
        commit(mutationTypes.CHAT.SET_CHECK_GET_LIST_ROOM, null)
      }
      return result;
    } catch (err) {
      console.log("[Room] list.err", err);
      return err;
    }
  },
  async [actionTypes.CHAT.ROOM_LIST_FETCH]({ commit, state }, payload) {
    try {
      const { data: result = {} } = await new Room(this.$axios)[
        actionTypes.BASE.LIST
      ](payload);
      // console.log("[ROOM_LIST_FETCH] list", result);
      // if (result) {
      //   const { list_room } = result;
      //   commit(mutationTypes.CHAT.SET_ROOM_LIST, {
      //     list_room: uniqWith(
      //       list_room.concat(state.roomList.list_room),
      //       (a, b) => a.id === b.id
      //     ),
      //   });
      // }
      return result;
    } catch (err) {
      console.log("[Room] list.err", err);
      return err;
    }
  },
  async [actionTypes.CHAT.MEMBER_LIST]({ commit, state }, options) {
    try {
      const { data: result = {} } = await new Room(this.$axios)[
        actionTypes.BASE.GET_END
      ](options, options.id, options.end);
      // console.log("[Member] list", result);
      commit(mutationTypes.CHAT.SET_MEMBER_LIST, result);
      return result;
    } catch (err) {
      console.log("[Room] list.err", err);
      return err;
    }
  },
  async [actionTypes.CHAT.MESSAGE_LIST]({ commit, state }, options) {
    try {
      const { data: result = {} } = await new Room(this.$axios)[
        actionTypes.BASE.GET_END
      ](options, options.id, options.end);
      // console.log("[Message] list", result);
      // commit(mutationTypes.CHAT.SET_MESSAGE_LIST, result);
      const messageList = result;
      if (
        result &&
        state.messageList &&
        state.messageList.length > 0 &&
        state.messageList[0].room_id == options.id
      ) {
        commit(
          mutationTypes.CHAT.SET_MESSAGE_LIST,
          state.messageList.concat(messageList)
        );
      } else {
        commit(mutationTypes.CHAT.SET_MESSAGE_LIST, messageList);
      }
      return result;
    } catch (err) {
      console.log("[Message] list.err", err);
      return err;
    }
  },
  async [actionTypes.CHAT.MESSAGE_LIST_FETCH]({ commit, state }, options) {
    try {
      const { data: result = {} } = await new Room(this.$axios)[
        actionTypes.BASE.GET_END
      ](options, options.id, options.end);
      // console.log("[MESSAGE_LIST_FETCH] list", result);
      commit(mutationTypes.CHAT.SET_MESSAGE_LIST_FETCH, result);
      return result;
    } catch (err) {
      console.log("[MESSAGE_LIST_FETCH] list.err", err);
      return err;
    }
  },
  async [actionTypes.CHAT.MESSAGE_LIST_INFINITE]({ commit, state }, options) {
    try {
      const { data: result = {} } = await new Room(this.$axios)[
        actionTypes.BASE.GET_END
      ](options, options.id, options.end);
      // console.log("[Message] list", result);
      // commit(mutationTypes.CHAT.SET_MESSAGE_LIST, result);
      return result;
    } catch (err) {
      console.log("[Message] list.err", err);
      return err;
    }
  },
  async [actionTypes.CHAT.ROOM_DETAIL]({ commit, state }, payload) {
    try {
      const { data: result = {} } = await new Room(this.$axios)[
        actionTypes.BASE.DETAIL
      ](payload);
      // console.log("[ROOM_DETAIL] list", result);
      commit(mutationTypes.CHAT.SET_ROOM_DETAIL, result);
      return result;
    } catch (err) {
      console.log("[ROOM_DETAIL] list.err", err);
      return err;
    }
  },
  async [actionTypes.CHAT.CHANGE_ROOM_NAME]({ commit, state }, options) {
    try {
      const { data: result = {} } = await new Room(this.$axios)[
        actionTypes.BASE.PUT_END
      ](options.payload, options.id, options.end);
      // console.log("[Message] list", result);
      // commit(mutationTypes.CHAT.SET_MESSAGE_LIST, result);
      if (!result.error) {
        const newRoomList = state.roomList.list_room.map((item) => {
          if (item.id == result.id) {
            return {
              ...item,
              name: result && result.name ? result.name : "",
            };
          }
          return item;
        });
        commit(mutationTypes.CHAT.SET_ROOM_LIST, {
          list_room: newRoomList,
        });
      }
      return result;
    } catch (err) {
      console.log("[Message] list.err", err);
      return err;
    }
  },
  async [actionTypes.CHAT.CHANGE_ROOM_AVATAR]({ commit, state }, options) {
    try {
      const { data: result = {} } = await new Room(this.$axios)[
        actionTypes.BASE.PUT_END
      ](options.payload, options.id, options.end);
      // console.log("[CHANGE_ROOM_AVATAR] data", data);
      console.log("[CHANGE_ROOM_AVATAR] result", result);
      // commit(mutationTypes.CHAT.SET_MESSAGE_LIST, result);
      if (!result.error) {
        const newRoomList = state.roomList.list_room.map(item => {
          if (item.id == result.id) {
            return {
              ...item,
              avatar: result && result.avatar ? result.avatar : ''
            }
          }
          return item
        })
        commit(mutationTypes.CHAT.SET_ROOM_LIST, {
          list_room: newRoomList
        });
      }
      return result;
    } catch (err) {
      console.log("[Message] list.err", err);
      return err;
    }
  },
  async [actionTypes.CHAT.FILE_LIST]({ commit, state }, options) {
    try {
      const { data: result = {} } = await new Room(this.$axios)[
        actionTypes.BASE.GET_END
      ](options, options.id, options.end);
      // console.log("[FILE_LIST] list", result);
      commit(mutationTypes.CHAT.SET_FILE_LIST, result);
      return result;
    } catch (err) {
      console.log("[FILE_LIST] list.err", err);
      return err;
    }
  },
  async [actionTypes.CHAT.IMAGE_LIST]({ commit, state }, options) {
    try {
      const { data: result = {} } = await new Room(this.$axios)[
        actionTypes.BASE.GET_END
      ](options, options.id, options.end);
      // console.log("[IMAGE_LIST] list", result);
      commit(mutationTypes.CHAT.SET_IMAGE_LIST, result);
      return result;
    } catch (err) {
      console.log("[IMAGE_LIST] list.err", err);
      return err;
    }
  },
  async [actionTypes.CHAT.ROOM_REMOVE_MEMBER]({ commit, state }, options) {
    try {
      const { data: result = {} } = await new Room(this.$axios)[
        actionTypes.BASE.PUT_END
      ](options.payload, options.id, options.end);
      // console.log("[REMOVE_MEMBER] list", result);
      if (result.success) {
        const newListMembers = state.memberList.filter(
          (item) => item.id !== options.payload.member_ids[0]
        );
        commit(mutationTypes.CHAT.SET_MEMBER_LIST, newListMembers);
      }
      return result;
    } catch (err) {
      console.log("[REMOVE_MEMBER].err", err);
      return err;
    }
  },
  async [actionTypes.CHAT.ROOM_ADD_MEMBER]({ commit, state }, options) {
    try {
      const { data: result = {} } = await new Room(this.$axios)[
        actionTypes.BASE.POST_END
      ](options.payload, options.id, options.end);
      // console.log("[ROOM_ADD_MEMBER] list", result);
      // if(!result.error)
      // commit(mutationTypes.CHAT.SET_MESSAGE_LIST, result);
      // if (!result.error) {
      //   const newRoomList = state.roomList.list_room.map(item => {
      //     if (item.id == result.id) {
      //       return {
      //         ...item,
      //         name: result && result.name ? result.name : ''
      //       }
      //     }
      //     return item
      //   })
      //   commit(mutationTypes.CHAT.SET_ROOM_LIST, {
      //     list_room: newRoomList
      //   });
      // }
      return result;
    } catch (err) {
      console.log("[ROOM_ADD_MEMBER].err", err);
      return err;
    }
  },
  async [actionTypes.CHAT.UPLOAD_MEDIA]({ commit }, payload) {
    try {
      const result = await new Media(this.$axios)[actionTypes.BASE.ADD](
        payload
      );
      // console.log("[Media] add", result);
      return result;
    } catch (err) {
      console.log("[Media] add.err", err);
      return err;
    }
  },

  async [actionTypes.CHAT.FRIENDS_LIST]({ commit }, payload) {
    try {
      const result = await new Friends(this.$axios)[actionTypes.BASE.LIST]({
        params: payload,
      });
      // set to mutation
      // console.log("[Friends] list", result.data);
      commit(mutationTypes.CHAT.SET_FRIENDS_LIST, result.data);
      return result;
    } catch (err) {
      return err;
    }
  },

  async [actionTypes.CHAT.SEARCH_USER_SOCIAL_LIST]({ commit }, params) {
    try {
      return this.$axios
        .get(APIs.SOCIAL_USERS, { params })
        .then((res) => res.data)
        .then((result) => {
          console.log("SEARCH_FRIEND_LIST", result);
          commit(mutationTypes.CHAT.SET_FRIENDS_LIST, result.data);
          return result;
        });
    } catch (err) {
      console.log("[SEARCH_USER_SOCIAL_LIST] err", err);
      return err;
    }
  },

  async [actionTypes.CHAT.CREATE_ROOM]({ commit, state }, payload) {
    try {
      const result = await new Room(this.$axios)[actionTypes.BASE.ADD](payload);
      // console.log("[CREATE_ROOM] list", result);
      return result;
    } catch (err) {
      console.log("[CREATE_ROOM].err", err);
      return err;
    }
  },

  async [actionTypes.CHAT.SEARCH_ROOM_LIST]({ commit }, params) {
    try {
      return this.$axios
        .get(APIs.SEARCHING_ROOM, { params })
        .then((res) => res.data)
        .then((result) => {
          console.log("SEARCH_ROOM_LIST", result);
          commit(mutationTypes.CHAT.SET_ROOM_LIST, result.data);
          return result;
        });
    } catch (err) {
      console.log("[SEARCH_FRIEND_LIST] err", err);
      return err;
    }
  }
};
/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.CHAT.SET_ROOM_LIST](state, _roomList) {
    // console.log('_roomList', _roomList)
    state.roomList = _roomList;
  },
  [mutationTypes.CHAT.SET_MEMBER_LIST](state, _memberList) {
    state.memberList = _memberList;
  },
  [mutationTypes.CHAT.SET_MESSAGE_LIST](state, _messageList) {
    state.messageList = _messageList;
  },
  [mutationTypes.CHAT.SET_ROOM_DETAIL](state, _roomDetail) {
    state.roomDetail = _roomDetail;
  },
  [mutationTypes.CHAT.SET_ID_PUSH](state, _stateIdPush) {
    state.stateIdPush = state.stateIdPush + _stateIdPush;
  },
  [mutationTypes.CHAT.SET_EMIT_MESSAGE](state, _messageEmit) {
    state.messageEmit = _messageEmit;
  },
  [mutationTypes.CHAT.SET_ON_MESSAGE](state, _messageOn) {
    state.messageOn = _messageOn;
    if (state.ckeckGetListRoom == true) {
      state.ckeckGetListRoom = null;
    };
    const newRoomList = state.roomList.list_room.filter(item => item.id == _messageOn.room_id).map(i => {
      return {
        ...i,
        lastest_message: _messageOn ? _messageOn : {}
      }
    })
    console.log('newRoomList', newRoomList)
    // // state.roomList.list_room = [newRoomList, ...state.roomList.list_room, []]
    if (newRoomList.length > 0) {
      state.roomList.list_room = uniqWith(
        newRoomList.concat(state.roomList.list_room),
        (a, b) => a.id === b.id
      )
      console.log('state.roomList.list_room', state.roomList.list_room);
    } else {
      state.ckeckGetListRoom = true;
    }
  },
  [mutationTypes.CHAT.SET_RES_EMIT](state, _messageRes) {
    state.messageRes = _messageRes;
    if (state.ckeckGetListRoom == true) {
      state.ckeckGetListRoom = null;
    };
    const newRoomList = state.roomList.list_room.filter(item => item.id == _messageRes.room_id).map(i => {
      return {
        ...i,
        lastest_message: _messageRes ? _messageRes : {}
      }
    })
    console.log('newRoomList', newRoomList)
    // // state.roomList.list_room = [newRoomList, ...state.roomList.list_room, []]
    if (newRoomList.length > 0) {
      state.roomList.list_room = uniqWith(
        newRoomList.concat(state.roomList.list_room),
        (a, b) => a.id === b.id
      )
      console.log('state.roomList.list_room', state.roomList.list_room);
    } else {
      state.ckeckGetListRoom = true;
    }
  },
  [mutationTypes.CHAT.SET_IMAGE_LIST](state, _imageList) {
    state.imageList = _imageList;
  },
  [mutationTypes.CHAT.SET_FILE_LIST](state, _fileList) {
    state.fileList = _fileList;
  },
  [mutationTypes.CHAT.SET_FRIENDS_LIST](state, _friendList) {
    state.friendList = _friendList;
  },
  [mutationTypes.CHAT.SET_MESSAGE_LIST_FETCH](state, _messageListFetch) {
    state.messageListFetch = _messageListFetch;
  },
  [mutationTypes.CHAT.SET_SOCKET_LEAVE_ROOM](state, _data) {
    state.socketLeaveRoom = _data;
  },
  [mutationTypes.CHAT.SET_HIDE_NEW_ROOM](state, _data) {
    state.stateHideNewRoom = _data;
  },
  [mutationTypes.CHAT.SET_DATA_EMIT_JOIN_ROOM](state, _data) {
    state.stateDataEmitJoinRoom = _data;
  },
  [mutationTypes.CHAT.SET_CHECK_GET_LIST_ROOM](state, _data) {
    state.ckeckGetListRoom = _data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};