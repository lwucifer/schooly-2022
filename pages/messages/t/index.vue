<template>
  <!-- <div class="page-message">
    <div class="container">
      <div class="row">
        <div class="col-md-3 col-sidebar">
          <TabContact :contacts="[]" :friends="[]" />
        </div>
  <div class="col-md-9 col-content">-->
  <div class="box">
    <div class="row">
      <TabMessage
        :checkId="true"
        @emitMessageTag1="emitMessageTag1"
        @emitMessageTag2="emitMessageTag2"
      />
      <!-- <TabInfo :isGroup="isGroup" :noMessage="true" /> -->
    </div>
  </div>
  <!-- </div>
      </div>
    </div>
  </div>-->
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Logo from "~/assets/svg/logo/schoolly.svg?inline";
import IconCaretDown from "~/assets/svg/icons/caret-down.svg?inline";
import IconImage from "~/assets/svg/icons/image.svg?inline";
import TabContact from "~/components/page/chat/TabContact";
import TabMessage from "~/components/page/chat/TabMessage";
// import TabInfo from "~/components/page/chat/TabInfo";

import * as constants from "~/utils/constants";
import { redirectWithParams } from "../../../utils/common";

import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

export default {
  components: {
    Logo,
    IconCaretDown,
    IconImage,
    TabMessage,
    TabContact,
    // TabInfo
  },

  async fetch({ params, query, store, redirect }) {
    const data = await store.dispatch(`chat/${actionTypes.CHAT.ROOM_LIST}`, {
      reviceMessage: false,
    });
    const dataRooms = data.list_room ? data.list_room : [];
    // console.log("dataRooms", dataRooms, data);
    const id = dataRooms[0] ? dataRooms[0].id : "";
    if (id) {
      this.hasRooms = true;
      return redirect(`/messages/t/${id}`);
    } else {
      // store.dispatch(`chat/${mutationTypes.CHAT.SET_ROOM_LIST}`, {
      //   list_room: [],
      // });
      return false;
    }
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
      hasRooms: false,
    };
  },

  mounted() {
    // Connect socket
    !this.hasRooms && this.initSocket();

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
    ...mapState("chat", ["messageEmit", "socketLeaveRoom"]),
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
    async emitMessageTag1(dataEmit, id) {
      if (id != this.$route.params.id) {
        console.log("[emitMessageTag1]", dataEmit, id);
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
        this.$router.push(`/messages/t/${id}`);
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
        console.log("[socket] params emit message", paramsMessage);
        this.socket.emit(constants.CHAT.MESSAGE, paramsMessage, (res) => {
          console.log("[socket] emit ack", res, res.data);
          if (res) {
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