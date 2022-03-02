<template>
  <div class="post-detail">
    <div class="post-detail__left">
      <!-- <app-video
        v-if="item.type === 'video'"
        :posterSrc="item.src"
        @click="$emit('click-item', item, index)"
      ></app-video>

      <div v-else class="slider-item" @click="$emit('click-item', item, index)">
        <img :src="item.src" alt />
      </div>-->

      <template v-if="totalImage > 1">
        <button
          type="button"
          class="post-detail__prev"
          :disabled="!showPrevArrow"
          @click.prevent="handleClickPrev"
        >
          <IconChevronLeft class="icon d-block fill-opacity-1" />
        </button>

        <button
          type="button"
          class="post-detail__next"
          :disabled="!showNextArrow"
          @click.prevent="handleClickNext"
        >
          <IconChevronRight class="icon d-block fill-opacity-1" />
        </button>
      </template>

      <div v-if="showAttachment" class="post-detail__media">
        <div v-if="attachment.type === ATTACHMENT_TYPES.IMAGE" class="post-detail__img">
          <div class="post-detail__img-bg">
            <img :src="attachment.src" alt />
          </div>
          <img class="d-block mx-auto" :src="attachment.src" alt />
        </div>

        <app-video
          v-if="attachment.type === ATTACHMENT_TYPES.VIDEO"
          class="post-detail__video"
          autoplay
          :src="attachment.src"
          size="md"
        />
      </div>
    </div>

    <div class="post-detail__right">
      <vue-content-loading
        v-if="loading"
        class="d-block pa-4 w-100"
        viewBox="0 0 324 324"
        :width="324"
        :height="324"
      >
        <rect x="0" y="0" rx="55" ry="55" width="55" height="55"></rect>
        <rect x="70" y="10" rx="4" ry="4" width="200" height="13"></rect>
        <rect x="70" y="33" rx="4" ry="4" width="130" height="13"></rect>
        <rect x="0" y="80" rx="3" ry="3" width="280" height="10"></rect>
        <rect x="0" y="100" rx="3" ry="3" width="324" height="10"></rect>
        <rect x="0" y="120" rx="3" ry="3" width="300" height="10"></rect>
      </vue-content-loading>
      <slot v-else name="post" v-bind="{ post: localPost, isParentPost, edit, setEdit }"></slot>
    </div>

    <div class="post-detail__actions">
      <client-only>
        <v-popover
          class="post-detail__actions-menu"
          placement="bottom-end"
          :popover-inner-class="`tooltip-inner popover-inner pa-0`"
          :open.sync="dropdownShow"
        >
          <button type="button" class="post-detail__actions-btn">
            <IconMoreHoriz class="icon" />
          </button>

          <ul slot="popover" class="post-detail__actions-list">
            <li v-if="isOwn">
              <a href @click.prevent="handleClickEdit">
                <IconEdit class="icon fill-opacity-1" />Chỉnh sửa
              </a>
            </li>
            <!-- <li>
              <a href @click.prevent>
                <IconNotifications class="icon fill-opacity-1" />Bật thông báo bài viết
              </a>
            </li>-->
            <!-- <li>
              <a href>
                <IconNotificationsOff class="icon fill-opacity-1"/>Tắt thông báo bài viết</a>
            </li>-->
            <li>
              <a :href="attachment.src" download>
                <IconDownload class="icon fill-opacity-1" />Tải xuống
              </a>
            </li>
          </ul>
        </v-popover>
      </client-only>

      <button type="button" class="post-detail__actions-btn" @click="$emit('click-close')">
        <IconClose class="icon" />
      </button>
    </div>
  </div>
</template>

<script>
import { get } from "lodash";
import { VueContentLoading } from "vue-content-loading";
import {
  BASE as ACTION_TYPE_BASE,
  SOCIAL as ACTION_TYPE_SOCIAL,
} from "~/utils/action-types";
import { ATTACHMENT_TYPES } from "~/utils/constants";

import IconClose from "~/assets/svg/v2-icons/close_24px.svg?inline";
import IconChevronLeft from "~/assets/svg/icons/chevron-left.svg?inline";
import IconChevronRight from "~/assets/svg/icons/chevron-right.svg?inline";
import IconEdit from "~/assets/svg/v2-icons/edit_24px.svg?inline";
import IconNotifications from "~/assets/svg/v2-icons/notifications_24px.svg?inline";
import IconNotificationsOff from "~/assets/svg/v2-icons/notifications_off_24px.svg?inline";
import IconDownload from "~/assets/svg/v2-icons/download_24px.svg?inline";
import IconMoreHoriz from "~/assets/svg/v2-icons/more_horiz_24px.svg?inline";

export default {
  components: {
    VueContentLoading,
    IconMoreHoriz,
    IconClose,
    IconChevronLeft,
    IconChevronRight,
    IconEdit,
    IconNotifications,
    IconNotificationsOff,
    IconDownload,
  },

  props: {
    loading: Boolean,
    isParentPost: Boolean,
    parentPost: {
      type: Object,
      // required: true,
      default: () => ({
        attachments: [],
      }),
    },
    post: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    totalImage: {
      type: Number,
      default: 0,
    },
    index: {
      type: Number,
      default: -1,
    },
    attachment: {
      type: Object,
      default: () => ({
        type: '',
        src: ''
      }),
    },
    isOwn: Boolean,
  },

  data() {
    return {
      dropdownShow: false,
      localPost: {},
      edit: false,
      showAttachment: true,
    };
  },

  created() {
    this.ATTACHMENT_TYPES = Object.freeze(ATTACHMENT_TYPES);
  },

  computed: {
    showPrevArrow() {
      return this.index > 0;
    },

    showNextArrow() {
      return this.index < this.totalImage - 1;
    },
  },

  watch: {
    post: {
      immediate: true,
      handler: function (newValue) {
        this.localPost = newValue || {};
      },
    },

    parentPost: {
      immediate: true,
      handler: function (newValue) {
        if (this.isParentPost) {
          this.localPost = newValue;
        }
      },
    },

    attachment(newValue) {
      this.showAttachment = false;
      const timeout = setTimeout(() => {
        this.showAttachment = true;
        clearTimeout(timeout);
      });
    },
  },

  methods: {
    get,

    handleClickPrev() {
      this.$emit("click-prev", this.index, this.totalImage);
    },

    handleClickNext() {
      this.$emit("click-next", this.index, this.totalImage);
    },

    handleClickEdit() {
      this.edit = true;
      this.dropdownShow = false;
    },

    setEdit(value = false) {
      this.edit = value;
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/post/_post-detail.scss";
</style>
