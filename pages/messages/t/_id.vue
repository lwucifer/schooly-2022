<template>
  <div class="box">
    <div class="row">
      <TabMessage
        :isCreated="isCreate"
        :isGroup="isGroup"
        @emitMessageTag1="emitMessageTag1"
        @emitMessageTag2="emitMessageTag2"
      />
      <!-- <TabInfo :isGroup="isGroup" /> -->
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

import * as actionTypes from "~/utils/action-types";
import Logo from "~/assets/svg/logo/schoolly.svg?inline";
import IconCaretDown from "~/assets/svg/icons/caret-down.svg?inline";
import IconImage from "~/assets/svg/icons/image.svg?inline";
import TabContact from "~/components/page/chat/TabContact";
import TabMessage from "~/components/page/chat/TabMessage";
import TabInfo from "~/components/page/chat/TabInfo";

import * as constants from "~/utils/constants";

import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

export default {
  components: {
    Logo,
    IconCaretDown,
    IconImage,
    TabMessage,
    TabContact,
    TabInfo,
  },

  async fetch({ params, query, store, route }) {
    const userId = store.state.auth.token ? store.state.auth.token.id : "";
    const room_id = route.params.id;
    const paramsOptions = {};
    const imageOptions = {
      limit: 12,
      type: "IMAGE",
    };
    const fileOptions = {
      limit: 20,
      type: "FILE",
    };
    // const payloadMessage = {
    //   from_message_id: "9a958a79-a3be-11ea-ba28-997cc905388a",
    //   fetch_type: "prior"
    // };
    await Promise.all([
      store.dispatch(`chat/${actionTypes.CHAT.MEMBER_LIST}`, {
        paramsOptions,
        id: room_id,
        end: "members",
      }),
      store.dispatch(`chat/${actionTypes.CHAT.IMAGE_LIST}`, {
        params: imageOptions,
        id: room_id,
        end: "attachments",
      }),
      store.dispatch(`chat/${actionTypes.CHAT.FILE_LIST}`, {
        params: fileOptions,
        id: room_id,
        end: "attachments",
      }),
      //   store.dispatch(`message/${actionTypes.MESSAGE_GROUP.GROUP_LIST}`),
      // store.dispatch(`chat/${actionTypes.CHAT.MESSAGE_LIST_FETCH}`, {
      //   params: paramsOptions,
      //   id: room_id,
      //   end: "messages"
      // }),
      store.dispatch(`chat/${actionTypes.CHAT.FRIENDS_LIST}`, {
        fetch_size: 20,
      }),
      store.dispatch(`chat/${actionTypes.CHAT.ROOM_DETAIL}`, room_id),
      // store.dispatch(`account/${actionTypes.ACCOUNT_PERSONAL.LIST}`, userId)
    ]);
  },
  props: {
    isCreate: {
      type: Boolean,
      default: false,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      // isGroup: false,
      // isCreate: false,
      socket: null,
      dataEmitMess: null,
    };
  },

  mounted() {
    // Connect socket
    this.initSocket();

    // listen socket channel
    // this.socket.on("join_room", (data) => {
    //   console.log("[on join_room]", data);
    // });
  },
  computed: {
    ...mapGetters("auth", [
      "getSocketURIParam",
      "userId",
      "fullName",
      "accessToken",
    ]),
    ...mapState("chat", [
      "messageEmit",
      "socketLeaveRoom",
      "stateDataEmitJoinRoom",
    ]),
  },

  methods: {
    ...mapActions("chat", ["getRoomList"]),
    ...mapMutations("chat", [
      "setOnMessage",
      "setResEmit",
      "setEmitMessage",
      "setSocketLeaveRoom",
      "setDataEmitJoinRoom",
    ]),
    async initSocket() {
      // init socket
      // URI: http://178.128.80.30:9994?user_id=xxx&token=xxx&unique_id=xxx
      // let uriParam = `${process.env.SOCKET_URI}?${this.getSocketURIParam}`;
      // console.log("[socket] [uriParam]", uriParam);
      // this.socket = await io(`${uriParam}`);
      this.socket = await io(`${process.env.SOCKET_URI}`, {
        path: "/ws",
        transports: ["websocket"],
        query: {
          token: `${this.accessToken}`,
        },
      });
      // connect socket
      if (!this.socket.connected) {
        this.socket.connect();
      }

      // on handle status message
      // this.socket.on(constants.CHAT.STATUS_HANDLE, data => {
      //   console.log("[socket]", data);
      // });

      // on handle message
      this.socket.on(constants.CHAT.MESSAGE, (data) => {
        console.log("[socket] messageOn", data);
        // this.getRoomList({ reviceMessage: true });
        this.setOnMessage(data);
      });

      // join room with id
      const params = {
        room_id: this.$route.params.id,
      };
      this.socket.emit(constants.CHAT.JOIN_ROOM, params, (res) => {
        console.log("[socket] User has joined this channel", res);
        if (this.stateDataEmitJoinRoom) {
          this.setEmitMessage(this.stateDataEmitJoinRoom);
        }
      });
    },
    async emitMessageTag1(dataEmit, id, check) {
      if (id != this.$route.params.id) {
        if (check) {
          console.log("[emitMessageTag1]", dataEmit, id, check);
          const params = {
            room_id: this.$route.params.id,
          };
          await this.socket.emit(constants.CHAT.LEAVE_ROOM, params, (res) => {
            console.log("[socket] User has leave this channel", res);
          });
          // this.socket.emit(
          //   constants.CHAT.JOIN_ROOM,
          //   {
          //     room_id: id,
          //   },
          //   (res) => {
          //     console.log("[socket] User has joined this channel", res);
          //     this.setEmitMessage(dataEmit);
          //   }
          // );
          // this.setDataEmitJoinRoom(dataEmit);
          this.setEmitMessage(dataEmit);
          this.$router.push(`/messages/t/${id}`);
        } else {
          console.log("[emitMessageTag1]", dataEmit, id, check);
          const params = {
            room_id: this.$route.params.id,
          };
          await this.socket.emit(constants.CHAT.LEAVE_ROOM, params, (res) => {
            console.log("[socket] User has leave this channel", res);
          });
          // this.socket.emit(
          //   constants.CHAT.JOIN_ROOM,
          //   {
          //     room_id: id,
          //   },
          //   (res) => {
          //     console.log("[socket] User has joined this channel", res);
          //     this.setEmitMessage(dataEmit);
          //   }
          // );
          this.setDataEmitJoinRoom(dataEmit);
          // this.setEmitMessage(dataEmit);
          this.$router.push(`/messages/t/${id}`);
        }
      } else {
        this.setEmitMessage(dataEmit);
      }
    },
    async emitMessageTag2(dataEmit, id) {
      console.log("[emitMessageTag2]", dataEmit, id);
      const params = {
        room_id: this.$route.params.id,
      };
      await this.socket.emit(constants.CHAT.LEAVE_ROOM, params, (res) => {
        console.log("[socket] User has leave this channel", res);
      });
      this.setDataEmitJoinRoom(dataEmit);
      this.$router.push(`/messages/t/${id}`);
      // this.setEmitMessage(dataEmit);
    },
  },

  // beforeDestroy() {
  //   const params = {
  //     room_id: this.$route.params.id
  //   };
  //   this.socket.emit(constants.CHAT.LEAVE_ROOM, params, res => {
  //     console.log("[socket] User has leave this channel", res);
  //   });
  // },
  watch: {
    messageEmit(_newVal) {
      if (_newVal) {
        // const uuidV4 = uuidv4();
        console.log("_newVal", _newVal);
        const paramsMessage = {
          room_id: _newVal.room_id,
          message: {
            text: _newVal.text ? _newVal.text : undefined,
            attachments:
              _newVal.attachments && _newVal.attachments.length > 0
                ? _newVal.attachments
                : undefined,
          },
        };
        // console.log("[socket] params emit message", paramsMessage);
        this.socket.emit(constants.CHAT.MESSAGE, paramsMessage, (res) => {
          console.log("[socket] emit ack", res, res.data);
          if (res) {
            // this.getRoomList({ reviceMessage: true });
            this.setResEmit(res.data);
          }
        });
      }
    },
    socketLeaveRoom(_newVal) {
      console.log("[leave]", _newVal);
      if (_newVal) {
        const params = {
          room_id: this.$route.params.id,
        };
        this.socket.emit(constants.CHAT.LEAVE_ROOM, params, (res) => {
          this.setSocketLeaveRoom(false);
          console.log("[socket] User has leave this channel", res);
        });
      }
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/pages/_page_messages.scss";
</style>
