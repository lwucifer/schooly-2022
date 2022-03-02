<template>
  <div class="message-chat__info">
    <div class="message-info">
      <div class="message-info__acc">
        <div class="message-info__acc__image" v-if="typeRoom">
          <!-- v-if="!typeRoom && avatarSrc
          ||
          typeRoom && nameRoom"-->
          <app-avatar :src="avatarSrc" class="comment-item__avatar" />
        </div>
        <div class="message-info__acc__image" v-else>
          <!-- v-if="!typeRoom && avatarSrc
          ||
          typeRoom && nameRoom"-->

          <app-avatar v-if="avatarSrc" :src="avatarSrc" size="md" class="comment-item__avatar" />

          <div class="_7q1j" v-else>
            <div class="_7q0v">
              <img
                :src="avatarDefault && avatarDefault[0] ? avatarDefault[0].low : '' || require('~/assets/svg/images/default-avatar.svg?data')"
                size="md"
                class="comment-item__avatar"
              />
            </div>
            <div class="_7q1i">
              <img
                :src="avatarDefault && avatarDefault[1] ? avatarDefault[1].low : '' || require('~/assets/svg/images/default-avatar.svg?data')"
                size="md"
                class="comment-item__avatar"
              />
            </div>
          </div>

          <app-upload
            class="cgi-upload-avt change-avatar"
            @change="handleUploadChange"
            v-if="!typeRoom"
          >
            <template>
              <div class="cgi-upload-avt-preview">
                <IconPhoto width="16" height="16" />
              </div>
            </template>
          </app-upload>
        </div>

        <div class="message-info__acc__title" v-if="!typeRoom">
          <input v-if="changeName" type="text" v-model="name" />

          <span v-else>
            <a href="#" v-if="name">{{ name.length > 20 ? (name.slice(0, 15) + '...') : name}}</a>
            <span v-else>Đặt tên cho cuộc trò chuyện này</span>
          </span>

          <button v-if="!changeName" @click="changeName = true" class="btn-change-name">
            <IconEditAlt class="fill-primary" width="18px" height="18px" />
          </button>

          <div v-if="changeName" class="mt-3">
            <button @click="changeName = false " class="btn-des-name text-secondary mr-3">HỦY</button>

            <button @click="saveNameGroup" class="btn-save-name text-primary">LƯU</button>
          </div>
        </div>

        <div v-else-if="typeRoom">
          <h4 @click.prevent="goAccount" class="name-pointer">{{nameRoom}}</h4>
          <p class="mb-4">Đang hoạt động</p>
        </div>
      </div>

      <!-- <ListInfoBox class="list-info-box">
        <template #header>TÙY CHỌN</template>

        <template #body>
          <div class="d-flex align-content-center justify-content-between mb-3">
            <div class="d-flex align-content-center">
              <IconNotificationsNone24px class="mr-2" />
              <span class="my-auto color-basse">Thông báo</span>
            </div>

            <app-toggle-switch />
          </div>

          <div class="d-flex align-content-center justify-content-between mb-3">
            <div class="d-flex align-content-center">
              <IconRemoveCircleOutline24px class="mr-2" />
              <span class="my-auto color-basse">Chặn tin nhắn</span>
            </div>

            <app-toggle-switch />
          </div>

          <div class="d-flex align-content-center justify-content-between">
            <div class="d-flex align-content-center">
              <IconRecycle class="mr-2 fill-secondary" />
              <span class="my-auto text-secondary">Xóa cuộc trò chuyện</span>
            </div>

            <div />
          </div>
        </template>
      </ListInfoBox>-->

      <ListInfoBox v-if="!typeRoom">
        <template #header>MỌI NGƯỜI</template>

        <template #button>
          <div @click="visibleAddMember = true">
            <IconAddGreen class="fill-primary mr-2 vertical-middle" width="14px" height="14px" />
            <span class="text-primary">Thêm người</span>
          </div>
        </template>

        <template #body>
          <div
            class="d-flex justify-content-between align-items-center mb-3"
            v-for="(item, index) in filterListMember"
            :key="index"
          >
            <div class="user-add d-flex align-items-center">
              <img
                :src=" item && item.avatar && item.avatar.low ? item.avatar.low : '' ||  require('~/assets/svg/images/default-avatar.svg?data')"
                alt
                class="mr-3"
              />
              <p>{{item.fullname}}</p>
            </div>

            <div class="position text-disabled" v-if="item.creator">Người tạo</div>
            <div class="position" v-else-if="!item.creator && uuidUser == item.id"></div>
            <div v-else>
              <v-popover placement="center" trigger="hover">
                <IconDots class="fill-gray" />

                <template slot="popover">
                  <ul></ul>
                  <p class="mb-3" @click.stop="handleRedirectAccount(item)">
                    <n-link to class="text-dark">Xem trang cá nhân</n-link>
                  </p>
                  <p class="mb-3" @click.stop="handleMessageUser(item)">
                    <n-link to class="text-dark">Nhắn tin</n-link>
                  </p>
                  <p @click.stop="handleRemoveMember(item)" v-if="checkShowLeave">
                    <n-link to class="text-secondary">Xoá khỏi nhóm</n-link>
                  </p>
                </template>
              </v-popover>
            </div>
          </div>
        </template>
      </ListInfoBox>

      <ListInfoBox>
        <template #header>TỆP ĐƯỢC CHIA SẺ</template>

        <template #body>
          <p
            class="mb-3 d-flex align-content-center"
            v-for="(item, index) in fileList"
            :key="index"
          >
            <IconFileBlank class="fill-info mr-2" />
            <span class="my-auto text-info">
              <a
                :href="item.url"
                :download="item.payload.origin_name"
              >{{item && item.payload && item.payload.origin_name ? item.payload.origin_name.slice(0, 20) + '...' : "Lorem, ipsum."}}</a>
            </span>
          </p>
        </template>
      </ListInfoBox>

      <ListInfoBox>
        <template #header>ẢNH ĐƯỢC CHIA SẺ</template>

        <template #body>
          <div class="row">
            <div class="col-4 px-1" v-for="(item, index) in imageList" :key="index">
              <img
                @click="emitPreview(item.url)"
                class="with-height-img"
                :src="item && item.url ? item.url : '/images/tmp/user-photo.png'"
                alt
              />
            </div>
          </div>
        </template>
        <client-only>
          <infinite-loading :identifier="infiniteId" @infinite="membersInfiniteHandler">
            <template slot="no-more">Không còn thành viên.</template>
          </infinite-loading>
        </client-only>
      </ListInfoBox>
    </div>

    <!-- Modal add member -->
    <ModalAddPeople @close="visibleAddMember = false" v-if="visibleAddMember" />
    <!-- <ModalAddMember @close="visibleAddMember = false" v-if="visibleAddMember" /> -->

    <app-modal-confirm
      centered
      v-if="showModal"
      title
      :description="'Bạn có chắc chắn muốn xoá ' + userName + ' ra khỏi nhóm?'"
      @ok="removeMember"
      @cancel="showModal = false"
    />
  </div>
</template>

<script>
import ModalAddPeople from "~/components/page/chat/ModalAddPeople";
import ModalAddMember from "~/components/page/chat/ModalAddMemberByGroup";
import * as actionTypes from "~/utils/action-types";
import IconPlus from "~/assets/svg/icons/plus.svg?inline";
import { mapState, mapGetters, mapActions } from "vuex";
import IconDots from "~/assets/svg/icons/dots.svg?inline";
import GroupMember from "~/services/message/GroupMember";
import IconPhoto from "~/assets/svg/icons/photo.svg?inline";
import IconEditAlt from "~/assets/svg/icons/edit.svg?inline";
import IconCloseOutline from "~/assets/svg/icons/Close-outline.svg?inline";
import IconTick from "~/assets/svg/icons/tick.svg?inline";
import IconNotificationsNone24px from "~/assets/svg/v2-icons/notifications_none_24px.svg?inline";
import IconRemoveCircleOutline24px from "~/assets/svg/v2-icons/remove_circle_outline_24px.svg?inline";
import IconRecycle from "~/assets/svg/v2-icons/recycle.svg?inline";
import IconFileBlank from "~/assets/svg/design-icons/file-blank.svg?inline";
import IconAddGreen from "~/assets/svg/v2-icons/add_green.svg?inline";

import ListInfoBox from "~/components/page/chat/ListInfoBox";
import { getBase64 } from "~/utils/common";
import * as constants from "~/utils/constants";

export default {
  components: {
    IconPlus,
    ModalAddPeople,
    IconDots,
    IconPhoto,
    IconEditAlt,
    IconCloseOutline,
    IconTick,
    ListInfoBox,
    IconNotificationsNone24px,
    IconRemoveCircleOutline24px,
    IconRecycle,
    IconFileBlank,
    IconAddGreen,
    ModalAddMember,
  },

  props: {
    noMessage: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      visibleAddMember: false,
      dropdownActions: false,
      changeName: false,
      memberListTab: [],
      infiniteId: +new Date(),
      memberListQuery: {
        page: 1,
      },
      name: "",
      avatarSrc: null,
      checkMemberList: false,
      showModal: false,
      userName: "",
      idUser: "",
      avatarUrl: "",
    };
  },
  created() {
    this.name = this.roomDetail && this.roomDetail ? this.roomDetail.name : "";
    if (this.typeRoom) {
      this.avatarSrc =
        this.roomDetail &&
        this.roomDetail.avatar_default &&
        this.roomDetail.avatar_default[0] &&
        this.roomDetail.avatar_default[0].low
          ? this.roomDetail.avatar_default[0].low
          : "";
    } else {
      this.avatarSrc =
        this.roomDetail && this.roomDetail.avatar && this.roomDetail.avatar.low
          ? this.roomDetail.avatar.low
          : "";
    }
  },
  computed: {
    ...mapState("message", ["memberList", "groupListDetail", "tabChat"]),
    ...mapGetters("auth", ["userId", "uuidUser"]),
    ...mapState("chat", ["memberList", "roomDetail", "imageList", "fileList"]),
    listImage() {
      return this.groupListDetail && this.groupListDetail.listImage
        ? this.groupListDetail.listImage
        : [];
    },
    listFile() {
      return this.groupListDetail && this.groupListDetail.listFile
        ? this.groupListDetail.listFile
        : [];
    },
    typeRoom() {
      const data = this.roomDetail ? this.roomDetail : {};
      if (data && data.type == constants.CHAT.PRIVATE_GROUP) {
        return true;
      } else {
        return false;
      }
    },
    nameRoom() {
      const data = this.roomDetail ? this.roomDetail : {};
      if (data && data.type == constants.CHAT.PUBLIC_GROUP) {
        return data.name;
      } else if (data && data.type == constants.CHAT.PRIVATE_GROUP) {
        return data.name ? data.name : "";
      }
    },
    filterListMember() {
      const data = this.memberList
        ? this.memberList.filter((item) => item.member_status == "ACTIVE")
        : [];
      const dataRoom =
        this.roomDetail && this.roomDetail ? this.roomDetail : {};
      const dataMap = data.map((item) => {
        if (item.id == dataRoom.created_by) {
          return {
            ...item,
            creator: true,
          };
        } else {
          return {
            ...item,
            creator: false,
          };
        }
      });
      return dataMap;
    },
    avatarDefault() {
      return this.roomDetail && this.roomDetail.avatar_default
        ? this.roomDetail.avatar_default
        : [];
    },
    checkShowLeave() {
      const data = this.roomDetail && this.roomDetail ? this.roomDetail : {};
      return data.created_by && data.created_by == this.uuidUser ? true : false;
    },
    idFriend() {
      if (this.roomDetail && this.roomDetail.type == "PRIVATE") {
        const [data] = this.memberList
          ? this.memberList.filter((item) => item.id != this.uuidUser)
          : null;
        return data ? data.id : null;
      }
    },
  },
  methods: {
    ...mapActions("message", [
      "groupRemoveMember",
      "getMemberList",
      "editName",
      "getGroupListDetail",
      "editAvatarGroup",
    ]),
    ...mapActions("chat", [
      "changeRoomName",
      "getRoomDetail",
      "roomRemoveMember",
      "uploadMedia",
      "changeRoomAvatar",
      "getMemberList",
      "getRoomList",
      "getRoomListFetch",
    ]),
    async membersInfiniteHandler($state) {
      // this.memberListQuery.room_id = this.$route.params.id;
      const { data: getData = {} } = this.$store.dispatch(
        `chat/${actionTypes.CHAT.MEMBER_LIST}`,
        {
          memberListQuery,
          id: "f6a3b88b-b6cd-49c5-988a-6864e58e429a",
          end: "members",
        }
      );
      console.log("getData member", getData);
      // if (getData && !getData.listMember && this.memberListTab.length == 0) {
      //   this.checkMemberList = true;
      // }
      if (getData) {
        this.memberListQuery.page += 1;
        // this.memberListTab.push(...getData.listMember);
        // this.groupsListTab = this.dataPushGroup.map(item => item);
        $state.loaded();
      } else {
        $state.complete();
      }
    },

    saveNameGroup() {
      const dataEdit = {
        id: this.$route.params.id,
        payload: { value: this.name },
        end: "name",
      };
      this.changeRoomName(dataEdit).then((result) => {
        console.log("result", result);
        if (!result.error) {
          this.$toasted.show("success");
          this.changeName = false;
          this.getRoomDetail(this.$route.params.id);
        } else {
          this.$toasted.error(result.message);
        }
      });
    },

    async handleUploadChange(fileList, event) {
      this.avatar = Array.from(fileList);

      getBase64(this.avatar[0], (src) => {
        this.avatarSrc = src;
      });
      const body = new FormData();
      body.append("media", fileList[0]);
      body.append("target_id", this.$route.params.id);
      body.append("target_type", "room");
      body.append("target_sub", "avatar");
      // console.log("[room_avatar]", fileList[0]);
      await this.uploadMedia(body).then((result) => {
        if (result.data) {
          this.avatarUrl =
            result.data[0] && result.data[0].full_path
              ? result.data[0].full_path.low
              : "";
          const data = {
            id: this.$route.params.id,
            payload: {
              avatar_url:
                result.data[0] && result.data[0].path
                  ? result.data[0].path
                  : "",
            },
            end: "avatar",
          };
          this.changeRoomAvatar(data).then((result) => {
            if (!result.error) {
              setTimeout(() => {
                this.$toasted.success("Thành công");
                this.getRoomDetail(this.$route.params.id);
                // this.getRoomList();
              }, 2500);
            } else {
              this.$toasted.error(result.message);
            }
          });
        }
      });
    },
    handleRemoveMember(item) {
      this.showModal = true;
      this.userName = item.fullname;
      this.idUser = item.id;
    },
    removeMember() {
      const data = {
        id: this.$route.params.id,
        payload: {
          member_id: this.idUser,
          type: "REMOVE",
        },
        end: "members",
      };
      this.roomRemoveMember(data).then((result) => {
        const query = {
          room_id: this.$route.params.id,
        };
        if (!result.error) {
          this.showModal = false;
          this.getMemberList({
            id: this.$route.params.id,
            end: "members",
          });
        }
      });
    },
    handleMessageUser(item) {
      const data = {
        friend_id: item.id,
        fetch_type: constants.CHAT.FETCH_PRIVATE_ROOM_BY_FRIEND_ID,
      };
      this.getRoomListFetch({ params: data }).then((result) => {
        if (result) {
          console.log("[result]", result);
          const roomId = result.room ? result.room.id : "";
          this.$router.push(`/messages/t/${roomId}`);
          // this.roomId = result.room ? result.room.id : "";

          this.getMemberList({
            id: result.room ? result.room.id : null,
            end: "members",
          });
        }
      });
    },
    handleRedirectAccount(item) {
      this.$router.push(`/social/account/${item.id}`);
    },
    goAccount() {
      this.$router.push(`/social/account/${this.idFriend}`);
    },
    emitPreview(_src) {
      this.$emit("handleEmitPreview", _src);
    },
  },
  watch: {
    memberList(_newval) {
      this.memberListTab = [];
      this.memberListQuery.page = 1;
      this.infiniteId += 1;
    },
    tabChat(_newval) {
      if (_newval) {
        this.memberListTab = [];
        this.memberListQuery.page = 1;
        this.infiniteId += 1;
      }
    },
  },
};
</script>
<style scoped>
._7q1l {
  border-radius: 50% !important;
  overflow: hidden !important;
  position: absolute !important;
  right: 0 !important;
}
/* ._7q1j {
  display: flex;
  flex-shrink: 0;
  position: relative;
}
._7q1p {
  align-items: center;
  background-color: rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
  border: 4px solid white;
  height: 80px;
  width: 80px;
}
._7q1m {
  border-radius: 50%;
  left: 50%;
  overflow: hidden;
  position: absolute;
  border: 4px solid white;
  height: 80px;
  width: 80px;
  left: 64px;
}
._7q1n {
  border-radius: 50%;
  left: 0;
  overflow: hidden;
  position: absolute;
  border: 4px solid white;
  height: 80px;
  width: 80px;
} */
</style>
