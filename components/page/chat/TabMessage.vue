<template>
  <div class="col-md-12 message-chat__content">
    <div class="aside-box">
      <div class="aside-box__top" v-if="isCreated">
        <div class="aside-box__top__create d-flex-center w-100">
          <span class="color-999 mr-2">Đến:</span>
          <app-select
            mode="tags"
            style="flex: 1"
            :options="tagOptions"
            v-model="tag"
            @change="changeUser"
            @visible-change="handleFriendsVisibleChange"
            @search="handleSearchUser"
          >
            <div slot="option" slot-scope="{ option }" class="d-flex align-items-center">
              <!-- @click.prevent="changeUserChat(option)" -->
              <app-avatar :src="option.avatarFriend" size="sm" class="mr-3"></app-avatar>
              {{ option.text }}
            </div>

            <client-only>
              <infinite-loading
                slot="options-append"
                spinner="spiral"
                :identifier="friendsInfiniteId"
                @infinite="friendsInfiniteHandler"
              />
            </client-only>
          </app-select>
        </div>
      </div>

      <div class="aside-box__top" v-if="!isCreated">
        <div class="message-desc" v-if="!checkId">
          <div class="message-decs__image" v-if="typeRoom">
            <app-avatar :src="avatarSrc" size="md" class="comment-item__avatar" />
          </div>
          <div class="message-decs__image" v-else>
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
          </div>
          <div class="message-decs__title">
            <span>{{nameRoom}}</span>
            <p class="text-base">Đang hoạt động</p>
          </div>
        </div>
        <div class="message-tool" v-if="!checkId">
          <ul class="list-unstyle">
            <li>
              <a href="#">
                <IconPhone width="18px" height="18px" class="fill-primary" />
              </a>
            </li>
            <li>
              <a href="#">
                <IconVideo width="18px" height="18px" class="fill-primary" />
              </a>
            </li>
            <li>
              <!-- @click="visibleAddByPhone = true" -->
              <a href="#" @click="showInfo = !showInfo">
                <IconExclamationCircle width="18px" height="18px" class="fill-primary" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="aside-box__content"
        id="content-message"
        :class="{'padding-show-info': showInfo, 'height-subtract-img': listImgSrc.length > 0, 'height-subtract-reply': isReply}"
      >
        <!-- <h4 style="margin-top:10px; text-align:center">Chức năng đang phát triển</h4> -->
        <client-only>
          <infinite-loading
            direction="top"
            @infinite="messageInfiniteHandler"
            :identifier="infiniteId"
          >
            <template
              slot="no-more"
            >{{countMessage == 0 ? 'Không có tin nhắn.' : 'Không còn tin nhắn.'}}</template>
            <template
              slot="no-results"
            >{{countMessage == 0 ? 'Không có tin nhắn.' : 'Không còn tin nhắn.'}}</template>
          </infinite-loading>
        </client-only>

        <div class="message-box__time">
          <!-- <div class="message-box__time__line"></div> -->
          <div class="message-box__time__content">
            <!-- <span>Thứ 5, Ngày 19/09/2019</span> -->
          </div>
        </div>

        <div class="message-box">
          <!-- message date -->
          <!-- END / message date -->
          <!-- message box item -->
          <div
            class="message-box__item"
            :class="item && item.user_uuid == uuidUser ? 'item__0' : 'item__1'"
            v-for="(item, index) in filterMessageList"
            :key="index"
          >
            <!-- v-show="item.content || (item.img_url && item.img_url.low) || item.file_url" -->
            <div class="message-box__item__content">
              <div class="message-box__item__meta" v-if="index == 0">
                <div class="message-box__item__meta__image">
                  <app-dropdown
                    position="left"
                    v-model="dropdownShow"
                    :content-width="'10rem'"
                    class="link--dropdown"
                  >
                    <button slot="activator" type="button" class="link--dropdown__button">
                      <app-avatar
                        :src="item.user && item.user.avatar && item.user.avatar.low ? item.user.avatar.low : ''"
                        size="sm"
                        class="comment-item__avatar"
                      />
                    </button>
                  </app-dropdown>
                </div>
                <div class="message-box__item__meta__desc">
                  <span>{{item.user && item.user.fullname}}</span>
                </div>
                <div class="message-box__item__meta__time">
                  <span>{{item.sent_at | moment("hh:mm A") }}</span>
                </div>
              </div>
              <div
                class="message-box__item__meta"
                v-else-if="index > 0 && index == filterMessageList.length -1 && filterMessageList[index].user_uuid != filterMessageList[index-1].user_uuid"
              >
                <div class="message-box__item__meta__image">
                  <app-dropdown
                    position="left"
                    v-model="dropdownShow"
                    :content-width="'10rem'"
                    class="link--dropdown"
                  >
                    <button slot="activator" type="button" class="link--dropdown__button">
                      <app-avatar
                        :src="item.user && item.user.avatar && item.user.avatar.low ? item.user.avatar.low : ''"
                        size="sm"
                        class="comment-item__avatar"
                      />
                    </button>
                  </app-dropdown>
                </div>
                <div class="message-box__item__meta__desc">
                  <span>{{item.user && item.user.fullname}}</span>
                </div>
                <div class="message-box__item__meta__time">
                  <span>{{item.sent_at | moment("hh:mm A") }}</span>
                </div>
              </div>
              <div class="message-box__item__meta" v-else-if="item.check">
                <div class="message-box__item__meta__image">
                  <app-dropdown
                    position="left"
                    v-model="dropdownShow"
                    :content-width="'10rem'"
                    class="link--dropdown"
                  >
                    <button slot="activator" type="button" class="link--dropdown__button">
                      <app-avatar
                        :src="item.user && item.user.avatar && item.user.avatar.low ? item.user.avatar.low : ''"
                        size="sm"
                        class="comment-item__avatar"
                      />
                    </button>
                  </app-dropdown>
                </div>
                <div class="message-box__item__meta__desc">
                  <span>{{item.user && item.user.fullname}}</span>
                </div>
                <div class="message-box__item__meta__time">
                  <span>{{item.sent_at | moment("hh:mm A") }}</span>
                </div>
              </div>
              <template v-if="item.text && item.attachments">
                <!-- v-if="item.content && item.img_url && item.img_url.low || item.content && item.file_url" -->
                <div class="message-box__item__desc">
                  <div class="message-box__item__desc__text">
                    <p>{{item.text}}</p>
                  </div>

                  <!-- <div class="message-box__item__desc__actions">
                    <button title="Trả lời" @click="reply()">
                      <IconReply />
                    </button>
                    <button title="Chuyển tiếp">
                      <IconUpload />
                    </button>
                    <button title="Khác">
                      <v-popover
                        position="left"
                        v-model="dropdownEdit"
                        :content-width="'10rem'"
                        class="link--dropdown"
                        trigger="hover"
                      >
                        <IconDots />
                        <template #popover>
                          <ul class="ul-popover">
                            <li
                              class="link--dropdown__content__item"
                              v-if="item.user_uuid == uuidUser"
                            >
                              <a>Sửa tin nhắn</a>
                            </li>
                            <li class="link--dropdown__content__item">
                              <a @click="visibleDelete = true">Xóa tin</a>
                            </li>
                          </ul>
                        </template>
                      </v-popover>
                    </button>
                  </div>-->
                </div>
                <div class="message-box__item__desc">
                  <!-- <div class="message-box__item__desc__text">
                  <p>{{item.content}}</p>
                  </div>-->
                  <div
                    class="message-box__item__desc__image"
                    v-for="(a, b) in item.attachments"
                    :key="b"
                  >
                    <img
                      v-if="a.type == 'IMAGE' && a.url && a.url.low"
                      :src="a.url.low || ''"
                      @click="previewImage(a.url.high)"
                    />
                    <div class="item-file" v-if="a.type == 'FILE'">
                      <div class="icon">
                        <IconFileAlt class="fill-primary" />
                      </div>
                      <span>
                        <a
                          :href="a.url && a.url.low"
                          :download="a.origin_name"
                        >{{a.url && a.origin_name || '' }}</a>
                      </span>
                    </div>
                    <div class="item-video" v-if="a.type == 'VIDEO' && a.url && a.url.low">
                      <app-video :src="a.url.low"></app-video>
                    </div>
                  </div>
                  <!-- <div class="message-box__item__desc__actions">
                    <button title="Trả lời" @click="reply()">
                      <IconReply />
                    </button>
                    <button title="Chuyển tiếp">
                      <IconUpload />
                    </button>
                    <button title="Khác">
                      <v-popover
                        position="left"
                        v-model="dropdownEdit"
                        :content-width="'10rem'"
                        class="link--dropdown"
                        trigger="hover"
                      >
                        <IconDots />
                        <template #popover>
                          <ul class="ul-popover">
                            <li
                              class="link--dropdown__content__item"
                              v-if="item.user_uuid == uuidUser"
                            >
                              <a>Sửa tin nhắn</a>
                            </li>
                            <li class="link--dropdown__content__item">
                              <a @click="visibleDelete = true">Xóa tin</a>
                            </li>
                          </ul>
                        </template>
                      </v-popover>
                    </button>
                  </div>-->
                </div>
              </template>
              <div class="message-box__item__desc" v-else-if="item.text">
                <div class="message-box__item__desc__text">
                  <p>{{item.text}}</p>
                </div>
                <!-- <div class="message" v-if="item.img_url">
                  <img
                    v-if="item.img_url && item.img_url.low"
                    :src="item.img_url && item.img_url.low ? item.img_url.low : ''"
                  />
                </div>-->
                <!-- <div class="message-box__item__desc__actions">
                  <button title="Trả lời" @click="reply()">
                    <IconReply />
                  </button>
                  <button title="Chuyển tiếp">
                    <IconUpload />
                  </button>
                  <button title="Khác">
                    <v-popover
                      position="left"
                      v-model="dropdownEdit"
                      :content-width="'10rem'"
                      class="link--dropdown"
                      trigger="hover"
                    >
                      <IconDots />
                      <template #popover>
                        <ul class="ul-popover">
                          <li
                            class="link--dropdown__content__item"
                            v-if="item.user_uuid == uuidUser"
                          >
                            <a>Sửa tin nhắn</a>
                          </li>
                          <li class="link--dropdown__content__item">
                            <a @click="visibleDelete = true">Xóa tin</a>
                          </li>
                        </ul>
                      </template>
                    </v-popover>
                  </button>
                </div>-->
              </div>
              <div class="message-box__item__desc" v-else-if="item.attachments">
                <!-- <div class="message-box__item__desc__text">
                  <p>{{item.content}}</p>
                </div>-->
                <div
                  class="message-box__item__desc__image"
                  v-for="(a, b) in item.attachments"
                  :key="b"
                >
                  <img
                    v-if="a.type == 'IMAGE' && a.url && a.url.low"
                    :src="a.url.low || ''"
                    @click="previewImage(a.url.high)"
                  />
                  <div class="item-file" v-if="a.type == 'FILE'">
                    <div class="icon">
                      <IconFileAlt class="fill-primary" />
                    </div>
                    <span>
                      <a
                        :href="a.url && a.url.low"
                        :download="a.origin_name"
                      >{{a.url && a.origin_name || '' }}</a>
                    </span>
                  </div>
                  <div class="item-video" v-if="a.type == 'VIDEO' && a.url && a.url.low">
                    <app-video :src="a.url.low"></app-video>
                  </div>
                </div>
                <!-- <div class="message-box__item__desc__actions">
                  <button title="Trả lời" @click="reply()">
                    <IconReply />
                  </button>
                  <button title="Chuyển tiếp">
                    <IconUpload />
                  </button>
                  <button title="Khác">
                    <v-popover
                      position="left"
                      v-model="dropdownEdit"
                      :content-width="'10rem'"
                      class="link--dropdown"
                      trigger="hover"
                    >
                      <IconDots />
                      <template #popover>
                        <ul class="ul-popover">
                          <li
                            class="link--dropdown__content__item"
                            v-if="item.user_uuid == uuidUser"
                          >
                            <a>Sửa tin nhắn</a>
                          </li>
                          <li class="link--dropdown__content__item">
                            <a @click="visibleDelete = true">Xóa tin</a>
                          </li>
                        </ul>
                      </template>
                    </v-popover>
                  </button>
                </div>-->
              </div>
            </div>
          </div>
          <div class="app-spin-messages text-right" v-if="checkLoadingAttach">
            <app-spin />
          </div>
        </div>
      </div>

      <div class="aside-box__bottom">
        <div
          v-if="isReply"
          class="aside-box__bottom__reply d-flex align-items-center justify-content-between"
        >
          <div>
            <p>
              Đang phản hồi
              <b>Minh</b>
            </p>
            <p class="color-999 mt-1 mb-3">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>

          <IconClose @click="isReply = false" class="btn-close" />
        </div>
        <div class="input-group">
          <div class="list-chat-img">
            <div class="item" v-for="(item, i) in listImgSrc" :key="i">
              <template v-if="item.image">
                <button class="btn-remove" @click="removeFile(i)" title="Remove">
                  <IconClose class="fill-white" />
                </button>
                <img :src="item.src" />
              </template>
              <div v-else class="item-file">
                <button class="btn-remove" @click="removeFile(i)" title="Remove">
                  <IconClose class="fill-666" />
                </button>
                <div class="icon">
                  <IconFileAlt class="fill-primary" />
                </div>
                <span>{{item.src}}</span>
              </div>
            </div>
          </div>

          <div class="input-chat">
            <div class="app-files">
              <label for="files">
                <IconImage width="15" height="15" class="fill-white" />
              </label>

              <input
                v-if="input"
                type="file"
                id="files"
                name="files"
                multiple
                @change="handleUploadChange2"
              />
            </div>

            <app-input
              class="mb-0 w-100 bg-light chat-message"
              v-model="textChat"
              @keyup.enter.native="handleEmitMessage"
              placeholder="Nhập tin nhắn..."
            >
              <template #append-inner>
                <IconSmile width="16" height="16" class="fill-primary mr-3" />
              </template>
            </app-input>

            <button class="bg-primary button-send" @click="handleEmitMessage">
              <IconSend24px width="15" height="15" class="fill-white" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <transition
      enter-active-class="animated faster fadeInRight"
      leave-active-class="animated faster fadeOutRight"
    >
      <TabInfo v-if="showInfo" @handleEmitPreview="previewImage" />
    </transition>

    <!-- Modal thêm bạn qua số điện thoại -->
    <ModalAddFriend @close="visibleAddByPhone = false" v-if="visibleAddByPhone" />

    <!-- Modal thêm bạn trong nhóm-->
    <ModalAddFriendByGroup @close="visibleAddByGroup = false" v-if="visibleAddByGroup" />

    <!-- Modal xóa tin nhắn -->
    <app-modal-confirm
      centered
      :component-class="{ 'message-foward-tags-modal': true }"
      v-if="visibleDelete"
      title
      description="Bạn có chắc chắn muốn xóa tin nhắn?"
      @cancel="visibleDelete = false"
    />

    <!-- Modal chuyển tiếp -->
    <app-modal
      centered
      :width="606"
      :component-class="{ 'message-foward-tags-modal': true }"
      v-if="visible"
    >
      <div slot="content">
        <h5 class="mb-4">Chuyển tiếp đến</h5>
        <app-select
          mode="tags"
          placeholder="Gửi cho ai?"
          style="width: 100%"
          :options="tagOptions"
          v-model="tag"
          @visible-change="handleFriendsVisibleChange"
        >
          <div slot="option" slot-scope="{ option }" class="d-flex align-items-center">
            <app-avatar
              :src="option.avatar && option.avatar.low ? option.avatar.low : null"
              size="sm"
              class="mr-3"
            ></app-avatar>
            {{ option.text }}
          </div>

          <client-only>
            <infinite-loading
              slot="options-append"
              :identifier="friendsInfiniteId"
              @infinite="friendsInfiniteHandler"
            />
          </client-only>
        </app-select>
        <div class="text-right mt-4">
          <app-button size="sm" color="info" class="mr-3" square @click="visible = false">Hủy</app-button>
          <app-button size="sm" square @click="foward()">Gửi</app-button>
        </div>
      </div>
    </app-modal>

    <!-- Modal preview img -->
    <app-modal
      :header="false"
      :footer="false"
      :backgroundTransparent="true"
      v-if="previewImg"
      width="auto"
    >
      <div slot="content" class="preview-img-content">
        <IconClose2 class="icon-close" width="20" height="20" @click="previewImg = false" />
        <img :src="srcPreviewImg" alt />
      </div>
    </app-modal>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { Editor, EditorContent } from "tiptap";
import { Placeholder } from "tiptap-extensions";

import { getBase64 } from "~/utils/common";
import { BASE as ACTION_TYPE_BASE } from "~/utils/action-types";
import FriendService from "~/services/social/Friends";

import ModalAddFriend from "~/components/page/chat/ModalAddFriend";
import ModalAddFriendByGroup from "~/components/page/chat/ModalAddFriendByGroup";
import TabInfo from "~/components/page/chat/TabInfo";

import IconPhone from "~/assets/svg/v2-icons/phone_24px.svg?inline";
import IconVideo from "~/assets/svg/v2-icons/videocam_24px.svg?inline";
// import IconAddUser from "~/assets/svg/icons/add-user-green.svg?inline";
import IconSmile from "~/assets/svg/icons/smile.svg?inline";
import IconImage from "~/assets/svg/design-icons/image-v.svg?inline";
import IconUpload from "~/assets/svg/icons/upload.svg?inline";
import IconReply from "~/assets/svg/icons/reply.svg?inline";
import IconDots from "~/assets/svg/icons/dots.svg?inline";
import IconClose from "~/assets/svg/icons/close.svg?inline";
import IconCamera from "~/assets/svg/design-icons/camera.svg?inline";
import IconFileAlt from "~/assets/svg/design-icons/file-alt.svg?inline";
import IconExclamationCircle from "~/assets/svg/design-icons/exclamation-circle.svg?inline";
import IconSend24px from "~/assets/svg/v2-icons/send_24px.svg?inline";
import IconClose2 from "~/assets/svg/v2-icons/close-2.svg?inline";

import Message from "~/services/message/Message";
import * as actionTypes from "~/utils/action-types";
import * as constants from "~/utils/constants";
import { cloneDeep, debounce } from "lodash";

export default {
  components: {
    IconPhone,
    IconVideo,
    // IconAddUser,
    IconSmile,
    IconImage,
    IconReply,
    IconUpload,
    IconDots,
    IconClose,
    IconCamera,
    IconFileAlt,
    ModalAddFriend,
    ModalAddFriendByGroup,
    IconExclamationCircle,
    IconSend24px,
    TabInfo,
    IconClose2,
  },

  props: {
    checkId: {
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
      previewImg: false,
      dropdownShow: false,
      dropdownEdit: false,
      textChat: "",
      isReply: false,
      tag: [],
      visible: false,
      visibleDelete: false,
      visibleAddByPhone: false,
      visibleAddGroup: false,
      visibleAddByGroup: false,
      friendsInfiniteId: +new Date(),
      friendsListQuery: {
        page: 1,
      },
      messageListQuery: {
        page: 1,
        room_id: "",
      },
      friendsList: [],
      listImgSrc: [],
      messagesList: [],
      imgSrc: "",
      listImage: [],
      urlEmitMessage: "",
      urlFileUpload: "",
      urlFileNameUpload: "",
      messageId: "",
      name: "",
      roomIdPush: "",
      fileList: [],
      dataCheck: false,
      showInfo: false,
      messageQuery: {
        from_message_id: null,
        fetch_type: null,
      },
      infiniteId: +new Date(),
      roomId: "",
      avatarUrlEmit: "",
      listImg: [],
      arrUrlMessage: [],
      input: true,
      nameSearch: "",
      srcPreviewImg: "",
      checkLoadingAttach: false,
    };
  },

  computed: {
    ...mapState("social", [{ labelList: "labels" }]),
    ...mapState("message", ["groupListDetail", "isCreated"]),
    ...mapState("chat", [
      "messageList",
      "memberList",
      "roomDetail",
      "stateIdPush",
      "messageRes",
      "messageOn",
      "friendList",
      "messageListFetch",
      "stateDataEmitJoinRoom",
    ]),
    ...mapState("account", ["personalList"]),
    ...mapGetters("auth", ["userId", "fullName", "avatarUser", "uuidUser"]),
    selectedTags() {
      return this.tag.map((item) => {
        const [resultItem = {}] = this.tagOptions.filter(
          (i) => i.value === item
        );
        return resultItem;
      });
    },

    selectedCheckin() {
      const [result = {}] = this.checkinOptions.filter(
        (item) => item.value === this.checkin
      );
      return result.text;
    },

    tagOptions() {
      return (
        this.friendList &&
        this.friendList.map((item) => ({
          value: item && item.profile && item.profile.id ? item.profile.id : "",
          text:
            item && item.profile && item.profile.fullname
              ? item.profile.fullname
              : "",
          avatarFriend:
            item &&
            item.profile &&
            item.profile.avatar &&
            item.profile.avatar.low
              ? item.profile.avatar.low
              : "",
        }))
      );
    },
    nameRoom() {
      const data = this.roomDetail ? this.roomDetail : {};
      const dataTotal =
        this.roomDetail && this.roomDetail.total_member
          ? this.roomDetail.total_member
          : 0;
      if (data && data.type == constants.CHAT.PUBLIC_GROUP) {
        if (data.name == null) {
          if (dataTotal > 3) {
            return data.name_default + ", " + (dataTotal - 3) + " người khác";
          } else {
            return data.name_default;
          }
        } else {
          return data.name;
        }
      } else if (data && data.type == constants.CHAT.CLOSE_GROUP) {
        if (data.name == null) {
          if (dataTotal > 3) {
            return data.name_default + ", " + (dataTotal - 3) + " người khác";
          } else {
            return data.name_default;
          }
        } else {
          return data.name;
        }
      } else if (data && data.type == constants.CHAT.PRIVATE_GROUP) {
        return data.name_default ? data.name_default : "";
      }
    },
    avatarSrc() {
      if (this.roomDetail && this.roomDetail.type == "PRIVATE") {
        return this.roomDetail.avatar_default &&
          this.roomDetail.avatar_default[0] &&
          this.roomDetail.avatar_default[0].low
          ? this.roomDetail.avatar_default[0].low
          : "";
      } else if (this.roomDetail && this.roomDetail.type == "PUBLIC_GROUP") {
        return this.roomDetail.avatar && this.roomDetail.avatar.low
          ? this.roomDetail.avatar.low
          : "";
      }
    },
    filterMessageList() {
      const dataMap = this.messagesList.map((item) => {
        const [tmpUser] =
          this.memberList &&
          this.memberList.filter((i) => i.id == item.sender_id);
        return {
          ...item,
          user: tmpUser,
          user_uuid: tmpUser && tmpUser.id ? tmpUser.id : "",
        };
      });
      let filterData = [];
      dataMap.forEach((i, index) => {
        if (index == 0 || index == dataMap.length - 1) {
          filterData.push({
            ...i,
          });
        } else {
          const dataCheckIndex =
            dataMap[index].user_uuid != dataMap[index - 1].user_uuid
              ? true
              : false;
          filterData.push({
            ...i,
            check: dataCheckIndex,
          });
        }
      });
      // console.log("filterData", filterData);
      return filterData;
    },
    typeRoom() {
      const data = this.roomDetail ? this.roomDetail : {};
      if (data && data.type == constants.CHAT.PRIVATE_GROUP) {
        return true;
      } else {
        return false;
      }
    },
    avatarDefault() {
      return this.roomDetail && this.roomDetail.avatar_default
        ? this.roomDetail.avatar_default
        : [];
    },
    countMessage() {
      return this.filterMessageList.length;
    },
  },

  methods: {
    ...mapActions("message", [
      "messageSendImg",
      "accountPersonalList",
      "createGroup",
      "getGroupList",
      "getMessageList",
      "getGroupListDetail",
      "messageSendFile",
      "getListMessageType",
    ]),
    ...mapActions("chat", [
      "getRoomList",
      "getRoomListFetch",
      "getMessageListFetch",
      "createRoom",
      "getMemberList",
      "uploadMedia",
      "searchUserSocialList",
      "getFriendsList",
      "getImageList",
      "getFileList",
    ]),
    ...mapMutations("message", ["emitCloseFalse", "setIsCreated"]),
    ...mapMutations("chat", [
      "setMessageList",
      "setEmitMessage",
      "setDataEmitJoinRoom",
    ]),
    async messageInfiniteHandler($state) {
      // const room_id = this.roomIdPush ? this.roomIdPush : this.$route.params.id;
      if (this.tag.length < 2) {
        if (this.roomId) {
          const getData = await this.$store.dispatch(
            `chat/${actionTypes.CHAT.MESSAGE_LIST_INFINITE}`,
            {
              params: this.messageQuery,
              id: this.roomId,
              end: "messages",
            }
          );
          console.log("getData Message", getData);
          // console.log("getData id", getData[getData.length - 1].id);
          if (getData && getData.length) {
            this.messageQuery.from_message_id = getData[0].id;
            this.messageQuery.fetch_type = "prior";
            const dataClone = cloneDeep(getData);
            // this.messagesList.push(...dataClone.reverse());
            if (this.messagesList.length >= 30) {
              this.messagesList = dataClone.reverse().concat(this.messagesList);
            } else {
              this.messagesList.push(...getData);
            }

            $state.loaded();
          } else {
            $state.complete();
          }
        } else {
          $state.complete();
        }
      } else {
        $state.complete();
      }
    },
    reply() {
      this.isReply = true;
    },

    foward() {},

    handleUploadChange2(fileList, event) {
      this.input = false;
      const timeout = setTimeout(() => {
        this.input = true;
        clearTimeout(timeout);
      });
      let listFile = fileList.target.files;
      this.listImage = Array.from(listFile);
      if (this.listImage) {
        this.listImg = [...this.listImg, ...this.listImage];
        this.listImage.forEach((element, index) => {
          const fileType = element["type"];
          const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
          let dataCheck = validImageTypes.includes(fileType);
          getBase64(element, (src) => {
            this.listImgSrc.push({
              src: dataCheck ? src : element.name,
              image: dataCheck,
            });
          });
        });
        // this.uploadFile();
      }
    },

    async uploadFile() {
      const body = new FormData();
      this.listImg.forEach((file) => {
        body.append("media", file);
      });
      body.append(
        "target_id",
        this.$route.params.id ? this.$route.params.id : this.roomIdPush
      );
      body.append("target_type", "room");
      await this.uploadMedia(body).then((result) => {
        if (result.data) {
          this.checkLoadingAttach = false;
          this.arrUrlMessage = result.data.map((item) => {
            return {
              type: item && item.type ? item.type : "",
              url: item && item.path ? item.path : "",
            };
          });
          console.log("[sendFile]", result.data);
        }
      });
    },
    async handleUploadChange(fileList, event) {
      this.listImage = Array.from(fileList);

      getBase64(this.listImage[0], (src) => {
        this.imgSrc = src;
      });
      const body = new FormData();
      body.append("media", fileList[0]);
      body.append("target_id", this.$router.params.id);
      body.append("target_type", "room");
      await this.uploadMedia(body).then((result) => {
        if (result.data) {
          this.avatarUrlEmit = result.data[0].path ? result.data[0].path : "";
        }
      });
    },

    async friendsInfiniteHandler($state) {
      const { data = {} } = await new FriendService(this.$axios)[
        ACTION_TYPE_BASE.LIST
      ]({
        params: this.friendsListQuery,
      });

      if (data.listFriend && data.listFriend.length) {
        this.friendsListQuery.page += 1;
        this.friendsList = this.friendsList.concat(data.listFriend);
        $state.loaded();
      } else {
        $state.complete();
      }
    },

    handleFriendsVisibleChange(isVisible) {
      console.log("handleFriendsVisibleChange", isVisible);

      if (isVisible) {
        this.friendsInfiniteId += 1;
      } else {
        this.friendsList = [];
        this.friendsListQuery.page = 1;
      }
    },
    async handleEmitMessage() {
      if (this.listImg && this.listImg.length > 0) {
        if (this.textChat != "") {
          const dataEmit = {
            room_id: this.$route.params.id,
            text: this.textChat,
            attachments: this.arrUrlMessage ? this.arrUrlMessage : [],
          };
          this.setEmitMessage(dataEmit);
          this.textChat = "";
        }
        this.listImgSrc = [];
        this.$nextTick(() => {
          const el = document.getElementById("content-message");
          if (
            el &&
            el.scrollTop &&
            el.scrollHeight &&
            el.scrollTop != el.scrollHeight
          ) {
            el.scrollTop = el.scrollHeight;
          } else if (el && el.scrollHeight && el.scrollTop == 0) {
            el.scrollTop = el.scrollHeight;
          }
        });
        this.checkLoadingAttach = true;
        await this.uploadFile();
      }
      if (this.tag.length == 0) {
        if (
          this.textChat != "" ||
          (this.arrUrlMessage && this.arrUrlMessage.length > 0)
        ) {
          const dataEmit = {
            room_id: this.$route.params.id,
            text: this.textChat,
            attachments: this.arrUrlMessage ? this.arrUrlMessage : [],
          };
          this.setEmitMessage(dataEmit);
          // this.getRoomList({ reviceMessage: true });
        }
        if (this.arrUrlMessage && this.arrUrlMessage.length > 0) {
          this.getAttachments();
        }
      } else if (this.tag.length == 1) {
        if (
          this.textChat != "" ||
          (this.arrUrlMessage && this.arrUrlMessage.length > 0)
        ) {
          const dataEmit = {
            room_id: this.roomIdPush,
            text: this.textChat,
            attachments: this.arrUrlMessage ? this.arrUrlMessage : [],
          };
          const dataCheckList = this.messagesList.length > 0 ? true : false;
          this.$emit(
            "emitMessageTag1",
            dataEmit,
            this.roomIdPush,
            dataCheckList
          );
          this.setIsCreated(false);
          // this.$router.push(`/messages/t/${this.roomIdPush}`);
          this.tag = [];
          if (this.arrUrlMessage && this.arrUrlMessage.length > 0) {
            this.getAttachments();
          }
        }
      } else {
        if (
          this.textChat != "" ||
          (this.arrUrlMessage && this.arrUrlMessage.length > 0)
        ) {
          const dataTextEmit = this.textChat;
          const data = {
            type: constants.CHAT.PUBLIC_GROUP,
            member_ids: this.tag,
          };
          this.createRoom(data).then((result) => {
            console.log("result", result, this.textChat);
            if (result.data) {
              const idPush = result.data.id ? result.data.id : "";
              const dataEmit = {
                room_id: idPush,
                text: dataTextEmit,
                attachments: this.arrUrlMessage ? this.arrUrlMessage : [],
              };
              console.log("dataEmit emitMessageTag2", dataEmit);
              this.$emit("emitMessageTag2", dataEmit, idPush);
              this.setIsCreated(false);
              this.tag = [];
              if (this.arrUrlMessage && this.arrUrlMessage.length > 0) {
                this.getAttachments();
              }
            }
          });
        }
      }
      this.textChat = "";
      this.removeImgSrc();
    },
    changeUser() {
      this.nameSearch = "";
      console.log("[option]", this.tag, this.tag.length);
      if (this.tag.length == 0) {
        this.getMemberList({
          id: this.$route.params.id,
          end: "members",
        });
        this.roomId = this.$route.params.id;
        this.roomIdPush = "";
        this.messagesList = [];
        this.infiniteId += 1;
        this.messageQuery.from_message_id = null;
        this.messageQuery.fetch_type = null;
        // const data = {
        //   id: this.$route.params.id,
        //   end: "messages",
        //   params: {}
        // };
        // this.getMessageListFetch(data);
      } else if (this.tag.length == 1) {
        const data = {
          friend_id: this.tag[0],
          fetch_type: constants.CHAT.FETCH_PRIVATE_ROOM_BY_FRIEND_ID,
        };
        this.getRoomListFetch({ params: data }).then((result) => {
          if (result) {
            console.log("[result]", result);
            this.roomIdPush = result.room ? result.room.id : "";
            this.roomId = result.room ? result.room.id : "";
            if (this.roomIdPush != this.$route.params.id) {
              this.getMemberList({
                id: result.room ? result.room.id : null,
                end: "members",
              });
              this.messagesList = [];
              this.infiniteId += 1;
              this.messageQuery.from_message_id = null;
              this.messageQuery.fetch_type = null;
            }
          } else {
            this.$toasted.error(result.message);
          }
        });
      } else {
        this.messagesList = [];
        this.roomId = "";
      }
    },
    removeImgSrc() {
      this.imgSrc = "";
      this.fileList = [];
      this.urlEmitMessage = "";
      this.message_id = "";
      this.listImgSrc = [];
      this.listImg = [];
      this.listImage = [];
      this.arrUrlMessage = [];
    },
    removeFile(i) {
      console.log("i", i);
      this.listImgSrc = this.listImgSrc.filter((item, index) => index != i);
      // this.listImage = this.listImage.filter((item, index) => index != i);
      this.listImg = this.listImg.filter((item, index) => index != i);
    },
    handleSearchUser: debounce(function (name) {
      console.log("name", name);
      this.nameSearch = name;
    }, 300),
    getAttachments() {
      const imageOptions = {
        limit: 12,
        type: "IMAGE",
      };
      const fileOptions = {
        limit: 20,
        type: "FILE",
      };
      this.getImageList({
        params: imageOptions,
        id: this.$route.params.id,
        end: "attachments",
      });
      this.getFileList({
        params: fileOptions,
        id: this.$route.params.id,
        end: "attachments",
      });
    },
    previewImage(_src) {
      this.previewImg = true;
      this.srcPreviewImg = _src;
    },
  },
  created() {
    this.roomId = this.$route.params.id;
  },
  watch: {
    nameSearch(newValue) {
      if (newValue) {
        const data = {
          fetch_type: "search",
          q: newValue,
          fetch_size: 20,
        };
        this.searchUserSocialList(data);
      } else {
        this.getFriendsList({ fetch_size: 20 });
      }
    },
    messageOn(_newVal) {
      if (_newVal) {
        console.log("[messageOn]", _newVal);
        if (_newVal.room_id == this.$route.params.id) {
          this.messagesList.push(_newVal);
          this.$nextTick(() => {
            const el = document.getElementById("content-message");
            if (el && el.scrollHeight - el.scrollTop <= 500) {
              el.scrollTop = el.scrollHeight;
            }
          });
        }
      }
    },
    messageRes(_newVal) {
      console.log("[messageRes]", _newVal, this.$route.params.id);
      if (_newVal) {
        console.log("[stateDataEmitJoinRoom]", this.stateDataEmitJoinRoom);
        if (this.stateDataEmitJoinRoom) {
          this.setDataEmitJoinRoom(null);
        }
        if (_newVal.room_id == this.$route.params.id) {
          this.messagesList.push(_newVal);
          this.$nextTick(() => {
            const el = document.getElementById("content-message");
            if (
              el &&
              el.scrollTop &&
              el.scrollHeight &&
              el.scrollTop != el.scrollHeight
            ) {
              el.scrollTop = el.scrollHeight;
            } else if (el && el.scrollHeight && el.scrollTop == 0) {
              el.scrollTop = el.scrollHeight;
            }
          });
        }
      }
    },
    messageListFetch(_newVal) {
      this.messagesList = [];
      this.$nextTick(() => {
        this.infiniteId += 1;
        this.messageQuery.from_message_id = null;
        this.messageQuery.fetch_type = null;
      });
    },
  },
};
</script>