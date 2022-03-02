<template>
  <div class="aside-box">
    <div class="tool-top">
      <n-link to="/" class="tool-top__link">
        <IconLeftArrow class="mr-3 fill-dark" width="5px" height="10px" />Tin nhắn
      </n-link>

      <div class="tool-top__feature">
        <!-- <app-dropdown
          position="left"
          v-model="dropdownEdit"
          :content-width="'10rem'"
          class="link--dropdown"
        >
          <button slot="activator" type="button" class="link--dropdown__button">
            <IconCog class="fill-base mr-3" />
          </button>

          <div class="link--dropdown__content">
            <ul>
              <li class="link--dropdown__content__item">
                <a @click="visibleAddByPhone = true">
                  <IconUsersAlt class="mr-2" />Thêm bạn
                </a>
              </li>
              <li class="link--dropdown__content__item">
                <a @click="visibleAddGroup = true">
                  <IconUserPlus class="mr-2" />Tạo nhóm
                </a>
              </li>
            </ul>
          </div>
        </app-dropdown>-->

        <button @click="create()" title="Viết tin nhắn mới">
          <IconEdit class="fill-base" />
        </button>
      </div>
    </div>

    <div class="search-nav">
      <div class="form-group">
        <div class="input-group">
          <div class="input-group-addon">
            <IconSearch width="15" height="15" class="fill-base" />
          </div>

          <input type="text" placeholder="Tìm kiếm người và nhóm" @input="handleSearchRoom" />

          <!-- <div class="input-group-addon">
            <a href="#">
              <IconCloseOutline class="fill-999" width="15" height="15" />
            </a>
          </div>-->
        </div>
      </div>
    </div>

    <div class="list-chat">
      <div class="tabs">
        <!-- <ul class="nav-tabs list-unstyle" v-if="!isContact">
          <li>
            <a @click="tabClick(1)" :class="tabChat == true ? 'active' : ''">Chat</a>
          </li>
          <li>
            <a @click="tabClick(2)" :class="tabChat == false ? 'active' : ''">Group</a>
          </li>
        </ul>-->

        <!-- <div class="tabs-content" v-if="isContact">
          <div class="align-item" v-for="(item, index) in friends" :key="index">
            <div class="left">
              <div class="align-item__image">
                <app-avatar :src="item.avatar" size="md" class="comment-item__avatar" />
              </div>

              <div class="align-item__meta">
                <h5 class="align-item__title">
                  <n-link slot="title" to>{{ item.name }}</n-link>
                </h5>
              </div>
            </div>

            <div class="right"></div>
          </div>
        </div>-->

        <div>
          <div class="tabs-content">
            <template>
              <div
                class="align-item justify-content-between"
                :class="item.activeClass ? 'active' : ''"
                v-for="(item, index) in mapChatList ? mapChatList : []"
                :key="index"
                @click="pushUrl(item.id)"
              >
                <div class="left d-flex">
                  <div class="align-item__image">
                    <app-avatar
                      v-if="item && item.type == 'PRIVATE'"
                      :src=" item && item.avatar && item.avatar.low ? item.avatar.low : ''"
                      size="md"
                      class="comment-item__avatar"
                    />
                    <app-avatar
                      v-else-if="item && item.type == 'PUBLIC_GROUP' && item.avatar"
                      :src=" item && item.avatar && item.avatar.low ? item.avatar.low : ''"
                      size="md"
                      class="comment-item__avatar"
                    />
                    <div class="_7q1j" v-else>
                      <div class="_7q0v">
                        <img
                          :src="item && item.avatar_default && item.avatar_default[0] ? item.avatar_default[0].low : '' || require('~/assets/svg/images/default-avatar.svg?data')"
                          size="md"
                          class="comment-item__avatar"
                        />
                      </div>
                      <div class="_7q1i">
                        <img
                          :src="item && item.avatar_default && item.avatar_default[1] ? item.avatar_default[1].low : '' || require('~/assets/svg/images/default-avatar.svg?data')"
                          size="md"
                          class="comment-item__avatar"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="align-item__meta">
                    <h5 class="align-item__title">
                      <n-link slot="title" to>{{ item.name ? item.name : '' }}</n-link>
                    </h5>
                    <div class="align-item__desc">
                      <p>{{item.textLast.length > 20 ? (item.textLast.slice(0, 20) + '...') : item.textLast}}</p>
                      <!-- <p v-if="item && item.lastest_message && item.lastest_message.text && item.lastest_message.attachments == null">{{ item && item.lastest_message && item.lastest_message.text ? item.lastest_message.text.length > 20 ? item.lastest_message.text.substring(0, 18) + '...' : item.lastest_message.text : ''}}</p>
                      <p v-else-if="item && item.lastest_message && item.lastest_message.text && item.lastest_message.attachments && item.lastest_message.attachments[item.lastest_message.attachments.length - 1].type == 'IMAGE'">Bạn đã gửi 1 ảnh</p>-->
                    </div>
                  </div>
                </div>

                <!-- <div class="right text-right">
                  <p>
                    <DotActive />
                  </p>
                  <p>25 giây</p>
                </div>-->
                <!-- <app-dropdown
                  position="right"
                  v-model="dropdownActions"
                  :content-width="'12rem'"
                  class="link--dropdown ml-auto pl-2"
                >
                  <button slot="activator" type="button" class="link--dropdown__button">
                    <IconDots class="fill-999" width="16" />
                  </button>
                  <div class="link--dropdown__content">
                    <ul>
                      <li @click.stop="handleNoti(item.allow_notication, item.room_id, item)">
                        <a v-if="item.allow_notication">Tắt thông báo</a>
                        <a v-else>Bật thông báo</a>
                      </li>
                      <li>
                        <a>Ẩn chat</a>
                      </li>
                      <li>
                        <a @click="visibleLeaveGroup = true">Chặn tin nhắn</a>
                      </li>
                    </ul>
                  </div>
                </app-dropdown>-->
              </div>
              <client-only v-if="!checkSearch">
                <infinite-loading @infinite="chatsInfiniteHandler" :identifier="infiniteIdChat">
                  <template slot="no-more">Không còn tin nhắn nào.</template>
                  <template slot="no-results" v-if="mapChatList.length == 0">
                    <div class="btn-create-chat" @click="create()">
                      <div class="btn-create-chat-icon">
                        <IconPlus />
                      </div>Tạo chat mới
                    </div>
                  </template>
                  <template slot="no-results" v-else>
                    <div class="no-results-class">Không còn tin nhắn nào.</div>
                  </template>
                </infinite-loading>
              </client-only>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="aside-box__bottom">
      <ul class="group-button list-unstyle">
        <li>
          <a @click="isContact = true" :class="isContact ? 'active' : ''">
            <IconUsers width="22" height="23" :class="isContact ? 'fill-primary' : 'fill-999'" />
            <p>Contact</p>
          </a>
        </li>
        <li>
          <a @click="isContact = false" :class="isContact ? '' : 'active'">
            <IconChat width="25" height="23" :class="!isContact ? 'fill-primary' : 'fill-999'" />
            <p>Chat</p>
          </a>
        </li>
      </ul>
    </div>-->

    <!-- Modal tạo nhóm chát -->
    <ModalAddGroup
      @close="visibleAddGroup = false"
      v-if="visibleAddGroup"
      :friends="friendList.listFriend ? friendList.listFriend : []"
    />

    <!-- Modal thêm bạn qua số điện thoại -->
    <ModalAddFriend @close="visibleAddByPhone = false" v-if="visibleAddByPhone" />

    <!-- Modal rồi nhớm -->
    <ModalLeaveGroup
      @close="visibleLeaveGroup = false"
      v-if="visibleLeaveGroup"
      @accept="handleLeaveGroup"
      :data="dataGroupLeave"
    />
  </div>
</template>

<script>
import ModalAddFriend from "~/components/page/chat/ModalAddFriend";
import ModalAddGroup from "~/components/page/chat/ModalAddGroup";
import ModalLeaveGroup from "~/components/page/chat/ModalLeaveGroup";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import IconSearch from "~/assets/svg/icons/search.svg?inline";
import IconCloseOutline from "~/assets/svg/icons/Close-outline.svg?inline";
import IconUsers from "~/assets/svg/icons/users.svg?inline";
import IconChat from "~/assets/svg/icons/chat-green.svg?inline";
import IconEdit from "~/assets/svg/design-icons/edit.svg?inline";
import IconCog from "~/assets/svg/icons/cog.svg?inline";
import IconUsersAlt from "~/assets/svg/design-icons/users-alt.svg?inline";
import IconUserPlus from "~/assets/svg/design-icons/user-plus.svg?inline";
import IconPlus from "~/assets/svg/design-icons/plus.svg?inline";
import IconLeftArrow from "~/assets/svg/icons/left-arrow.svg?inline";
import IconDots from "~/assets/svg/icons/dots.svg?inline";
import DotActive from "~/assets/svg/v2-icons/elipse.svg?inline";

import GroupService from "~/services/message/Group";
import MessageType from "~/services/message/MessageType";
import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import { get, isEmpty } from "lodash";

export default {
  components: {
    IconSearch,
    IconCloseOutline,
    IconUsers,
    IconChat,
    IconEdit,
    IconCog,
    IconUsersAlt,
    IconUserPlus,
    ModalAddFriend,
    ModalAddGroup,
    ModalLeaveGroup,
    IconPlus,
    IconLeftArrow,
    IconDots,
    DotActive,
  },
  props: {
    // contacts: {
    //   type: Array,
    //   default: () => [],
    //   required: true
    // },
    // friends: {
    //   type: Array,
    //   default: () => [],
    //   required: true
    // }
  },

  data() {
    return {
      tab: 1,
      isContact: false,
      visibleAddByPhone: false,
      visibleAddGroup: false,
      visibleLeaveGroup: false,
      nameGroup: "",
      dropdownEdit: false,
      dropdownActions: false,
      groupListQuery: {
        page: 1,
        room_type: 2,
      },
      chatListQuery: {
        page: 1,
        room_type: 1,
      },
      groupsListTab: [],
      chatsListTab: [],
      infiniteId: +new Date(),
      infiniteIdChat: +new Date() + 100,
      // dataPushChat: [],
      // dataPushGroup: [],
      dataGroupLeave: {},
      checkGroupList: false,
      roomQuery: {},
      checkSearch: false,
    };
  },
  computed: {
    ...mapState("message", [
      "groupList",
      "listMessageType",
      "tabChat",
      "friendList",
      "groups",
      "chats",
      "ckeckGetListRoom",
    ]),
    ...mapState("chat", ["roomList", "stateHideNewRoom", "ckeckGetListRoom"]),
    ...mapGetters("auth", ["userId", "uuidUser"]),
    // mapGroupList() {
    //   const dataMapGroup =
    //     this.groups &&,
    //     this.groups.listMessage &&
    //     this.groups.listMessage.map(item => {
    //       return {
    //         ...item.message,
    //         ...item.room,
    //         ...item.sender,
    //         message_id: item.message && item.message.id ? item.message.id : "",
    //         room_id: item.room && item.room.id ? item.room.id : ""
    //       };
    //     });
    //   // debugger;
    //   const dataGroup = dataMapGroup.map(item => {
    //     const [dataNoti] =
    //       item &&
    //       item.members &&
    //       item.members.filter(item => item.user_id == this.userId);
    //     // console.log("dataNoti", dataNoti);
    //     const dataRoomName =
    //       (
    //         item.members[0].fullname +
    //         ", " +
    //         item.members[1].fullname
    //       ).substring(0, 15) + "...";
    //     // console.log("[dataRoomName]", dataRoomName);
    //     return {
    //       ...item,
    //       room_name: item.room_name ? item.room_name : dataRoomName,
    //       allow_notication:
    //         dataNoti && dataNoti.allow_notication
    //           ? dataNoti.allow_notication
    //           : 0
    //     };
    //   });
    //   return dataGroup;
    // },
    mapChatList() {
      // const dataMap =
      //   this.roomList &&
      //   this.roomList.list_room &&
      //   this.roomList.list_room.map(item => {
      //     return {
      //       ...item.message,
      //       ...item.room,
      //       ...item.sender,
      //       message_id: item.message && item.message.id ? item.message.id : "",
      //       room_id: item.room && item.room.id ? item.room.id : ""
      //     };
      //   });
      // const data = dataMap.map(item => {
      //   const [dataName] =
      //     item &&
      //     item.members &&
      //     item.members.filter(item => item.user_id != this.userId);
      //   const [dataNoti] = item.members.filter(
      //     item => item.user_id == this.userId
      //   );
      //   return {
      //     ...item,
      //     name_sender: item.id == this.userId ? "Bạn" : item.fullname,
      //     room_name_member: dataName.fullname ? dataName.fullname : "",
      //     room_avatar_member: dataName.avatar.low ? dataName.avatar.low : "",
      //     allow_notication:
      //       dataNoti && dataNoti.allow_notication
      //         ? dataNoti.allow_notication
      //         : 0
      //   };
      // });
      const data =
        this.roomList &&
        this.roomList.list_room.map((item) => {
          return {
            ...item,
            ...item.room,
          };
        });
      const dataRoom = data.map((item) => {
        const dataLengthImage =
          item && item.lastest_message && item.lastest_message.attachments
            ? item.lastest_message.attachments.filter((a) => a.type == "IMAGE")
                .length
            : 0;
        const dataLengthFile =
          item && item.lastest_message && item.lastest_message.attachments
            ? item.lastest_message.attachments.filter((a) => a.type == "FILE")
                .length
            : 0;
        const typeLast =
          item && item.lastest_message && item.lastest_message.attachments
            ? item.lastest_message.attachments[
                item.lastest_message.attachments.length - 1
              ].type
            : "";
        if (item.type == "PRIVATE") {
          return {
            ...item,
            isRead:
              item && item.lastest_message && item.lastest_message.is_read
                ? item.lastest_message.is_read
                : false,
            name: item && item.friend ? item.friend[0] : "",
            avatar:
              item && item.avatar_default[0] ? item.avatar_default[0] : [],
            activeClass:
              item && item.id == this.$route.params.id ? true : false,
            textLast:
              typeLast == ""
                ? item && item.lastest_message && item.lastest_message.text
                  ? item.lastest_message.text
                  : ""
                : typeLast == "IMAGE" &&
                  item.lastest_message &&
                  item.lastest_message.sender_id == this.uuidUser
                ? `Bạn đã gửi ${dataLengthImage} ảnh`
                : typeLast == "IMAGE" &&
                  item.lastest_message &&
                  item.lastest_message.sender_id != this.uuidUser
                ? `Ban đã nhận được ${dataLengthImage} ảnh`
                : typeLast == "FILE" &&
                  item.lastest_message &&
                  item.lastest_message.sender_id == this.uuidUser
                ? `Bạn đã gửi file đính kèm`
                : item.lastest_message &&
                  item.lastest_message.sender_id != this.uuidUser
                ? `Ban đã nhận được file đính kèm`
                : typeLast == "VIDEO" &&
                  item.lastest_message &&
                  item.lastest_message.sender_id == this.uuidUser
                ? `Bạn đã gửi một video`
                : item.lastest_message &&
                  item.lastest_message.sender_id != this.uuidUser
                ? `Ban đã nhận được một video`
                : "",
          };
        } else {
          return {
            ...item,
            isRead:
              item && item.lastest_message && item.lastest_message.is_read
                ? item.lastest_message.is_read
                : false,
            name:
              item && item.name
                ? item.name.length > 12
                  ? item.name.substring(0, 12) + "..."
                  : item.name
                : item.name_default
                ? item.name_default.length > 12
                  ? item.name_default.substring(0, 12) + "..."
                  : item.name_default
                : "",
            activeClass:
              item && item.id == this.$route.params.id ? true : false,
            textLast:
              typeLast == ""
                ? item && item.lastest_message && item.lastest_message.text
                  ? item.lastest_message.text
                  : ""
                : typeLast == "IMAGE" &&
                  item.lastest_message &&
                  item.lastest_message.sender_id == this.uuidUser
                ? `Bạn đã gửi ${dataLengthImage} ảnh`
                : typeLast == "IMAGE" &&
                  item.lastest_message &&
                  item.lastest_message.sender_id != this.uuidUser
                ? `Ban đã nhận được ${dataLengthImage} ảnh`
                : typeLast == "FILE" &&
                  item.lastest_message &&
                  item.lastest_message.sender_id == this.uuidUser
                ? `Bạn đã gửi file đính kèm`
                : item.lastest_message &&
                  item.lastest_message.sender_id != this.uuidUser
                ? `Ban đã nhận được file đính kèm`
                : typeLast == "VIDEO" &&
                  item.lastest_message &&
                  item.lastest_message.sender_id == this.uuidUser
                ? `Bạn đã gửi một video`
                : item.lastest_message &&
                  item.lastest_message.sender_id != this.uuidUser
                ? `Ban đã nhận được một video`
                : "",
          };
        }
      });
      return dataRoom;
    },
  },
  methods: {
    ...mapActions("chat", ["searchRoomList", "getRoomList"]),
    ...mapMutations("message", ["setTabChat"]),
    ...mapMutations("chat", [
      "setMessageList",
      "setIdPush",
      "setSocketLeaveRoom",
      "setRoomList",
    ]),

    leaveGroupModal(_item) {
      this.visibleLeaveGroup = true;
      this.dataGroupLeave = _item;
    },
    handleLeaveGroup() {
      const data = { room_id: this.dataGroupLeave.id };
      this.groupLeave(data).then((result) => {
        if (result.success == true) {
          this.$toasted.show("success");
          this.visibleLeaveGroup = false;
          this.groupListQuery.page = 1;
          this.getGroupList({ params: this.groupListQuery });
        } else {
          this.$toasted.error(result.message);
        }
      });
    },
    handleNoti(noti, roomId, item) {
      const data = {
        room_id: roomId,
        notification: noti == 1 ? 0 : 1,
        user_id: this.userId,
      };
      this.groupNotification(data).then((result) => {
        if (result.success == true) {
          this.$toasted.show("success");
          if (item.type == 2) {
          } else {
            this.chatsListTab = [];
            this.chatListQuery.page = 1;
            this.infiniteIdChat += 1;
          }
        } else {
          this.$toasted.error(result.message);
        }
      });
    },
    tabClick(e) {
      this.tab = e;
      this.$emit("clickTab");
      const tabChat = e == 1 ? true : false;
      this.setTabChat(tabChat);
    },

    create() {
      this.$emit("addMessage");
    },

    async handleUploadChange(fileList, event) {
      this.avatar = Array.from(fileList);

      getBase64(this.avatar[0], (src) => {
        this.avatarSrc = src;
      });
      const body = new FormData();
      body.append("avatar_images", fileList[0]);
      console.log("[avatar_images]", fileList[0]);
      this.accountPersonalEditAvatar(body).then((result) => {});
    },

    // async groupsInfiniteHandler($state) {
    //   const getData = await this.$store.dispatch(
    //     `message/${actionTypes.MESSAGE_GROUP.LIST_MESSAGE_TYPE}`,
    //     {
    //       params: {
    //         page: get(this, "groups.page.number", 0) + 1,
    //         room_type: 2,
    //       },
    //     }
    //   );
    //   console.log("getData", getData);

    //   if (getData.success && !isEmpty(getData.data)) {
    //     $state.loaded();
    //   } else {
    //     $state.complete();
    //   }
    // },

    async chatsInfiniteHandler($state) {
      const getData = await this.$store.dispatch(
        `chat/${actionTypes.CHAT.ROOM_LIST}`,
        this.roomQuery
      );
      console.log("getData room", getData);
      if (getData && getData.list_room && getData.list_room.length > 0) {
        this.roomQuery.lastest_message_id = getData.list_room[
          getData.list_room.length - 1
        ].lastest_message.id
          ? getData.list_room[getData.list_room.length - 1].lastest_message.id
          : null;
        $state.loaded();
      } else {
        if (this.roomList && this.roomList.list_room.length) {
          $state.loaded();
        }
        $state.complete();
      }
    },

    async pushUrl(_id) {
      console.log("id", _id);
      if (_id != this.$route.params.id) {
        await this.setSocketLeaveRoom(true);
        this.setIdPush(1);
        const url = `/messages/t/${_id}`;
        this.$router.push(url);
      }
    },
    handleSearchRoom(e) {
      console.log("val", e.target.value);
      this.checkSearch = false;
      this.setRoomList({ list_room: [] });
      this.roomQuery.lastest_message_id = null;
      const value = e.target.value;
      const data = {
        text_search: e.target.value,
        fetch_size: 20,
        skip_page: 0,
      };
      if (value != "") {
        this.checkSearch = true;
        setTimeout(() => {
          this.searchRoomList(data);
        }, 500);
      } else {
        // this.infiniteIdChat += 1;
        // const paramRoom = {
        //   reviceMessage: false,
        // };
        // setTimeout(() => {
        //   this.getRoomList(paramRoom);
        // }, 500);
      }
    },
  },
  watch: {
    stateHideNewRoom(_newVal) {
      if (_newVal) {
        this.infiniteIdChat += 1;
      }
    },
    ckeckGetListRoom: {
      immediate: true,
      handler(_newVal) {
        if (_newVal) {
          this.getRoomList({ reviceMessage: true });
        }
      },
    },
    // listMessageType(_newval) {
    //   if (_newval) {
    //     this.chatsListTab = [];
    //     this.chatListQuery.page = 1;
    //     this.groupsListTab = [];
    //     this.groupListQuery.page = 1;
    //     this.infiniteIdChat += 1;
    //     this.infiniteId += 1;
    //   }
    // },
  },
};
</script>
<style scoped>
</style>