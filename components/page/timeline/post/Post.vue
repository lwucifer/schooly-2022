<template>
  <div class="post">
    <div class="post__top">
      <n-link :to="`/social/account/${authorId}`" class="post__avatar-wrapper">
        <app-avatar class="post__avatar" :src="authorAvatar" size="5.5rem"></app-avatar>
      </n-link>

      <div class="post__title">
        <div class="post__title-row mb-2">
          <!--prettyhtml-ignore-->
          <!-- prettier-ignore -->
          <h5 class="post__name font-weight-normal">
            <n-link class="font-weight-bold" :to="`/social/account/${authorId}`">{{ authorName }}</n-link>

            <template v-if="post.feeling">
              <span>
                <!-- <strong v-html="$emoji.replace_colons(post.feeling)"></strong> -->
                <client-only>
                  <emoji :emoji="post.feeling" :size="20"/>
                </client-only>
                <!--
                -->đang cảm thấy {{ getEmojiName(post.feeling).toLowerCase() }}<!--
              --></span>
            </template><!--

            --><PostTags v-if="post.tags && post.tags.length" :tags="post.tags || []" /><!--
            
            --><template v-if="post.feeling || (post.tags && post.tags.length)">.</template>
          </h5>
        </div>

        <div class="post__title-row">
          <n-link class="post__time" :to="`/social/post/${post.id}`">
            {{
            post.created_at | getLocalDateTime | moment("from")
            }}
          </n-link>
          <span
            class="post__share-for"
            :title="
              post.privacy && post.privacy.scope
                ? POST_PRIVACY_TEXT[post.privacy.scope]
                : ''
            "
          >
            <IconGlobe
              v-if="post.privacy && post.privacy.scope === POST_PRIVACY.PUBLIC"
              class="icon fill-opacity-1"
            />
            <IconSupervisorAccount
              v-if="post.privacy && post.privacy.scope === POST_PRIVACY.FRIENDS"
              class="icon fill-opacity-1"
            />
            <IconLock
              v-if="post.privacy && post.privacy.scope === POST_PRIVACY.ONLY_ME"
              class="icon fill-opacity-1"
            />
          </span>
        </div>
      </div>

      <client-only v-if="showMenuDropdown">
        <v-popover
          class="post__menu-dropdown"
          popover-inner-class="tooltip-inner popover-inner pa-0"
          placement="bottom-end"
          :open.sync="menuDropdown"
        >
          <button class="post__menu-dropdown-btn">
            <IconMoreHoriz class="icon" />
          </button>

          <ul slot="popover" class="post__menu-dropdown-list">
            <li>
              <a href @click.prevent="menuDropdown = false; $emit('edit', post)">
                <IconEdit class="icon fill-opacity-1" />Chỉnh sửa
              </a>
            </li>
            <!-- <li>
              <a href @click.prevent>
                <IconNotifications class="icon fill-opacity-1" />Bật thông báo bài viết
              </a>
            </li>
            <li>
              <a href>
                <IconNotificationsOff class="icon fill-opacity-1" />Tắt thông báo bài viết
              </a>
            </li> -->
            <li>
              <a href @click.prevent="menuDropdown = false; handleClickDelete()">
                <IconDeleteForever class="icon fill-opacity-1" />Xoá
              </a>
            </li>
          </ul>
        </v-popover>
      </client-only>
    </div>

    <div class="post__post">
      <div
        v-if="!checkEditorEmpty(post.text)"
        v-html="post.text"
        class="post__post-desc"
        :class="{
          'post__post-desc--truncated': showReadMore && !showFullText
        }"
      ></div>
      <a
        v-if="showReadMore"
        href
        @click.prevent
        class="post__post-readmore"
        @click="showFullText = !showFullText"
      >{{ showFullText ? `Thu gọn` : `Xem thêm` }}</a>

      <slot name="media-content" :link="post.link || {}" />

      <slot />
    </div>

    <div class="post__interactive">
      <div class="post__count">
        <client-only>
          <v-popover
            v-if="reaction > 0"
            trigger="hover click"
            class="mr-auto"
            :popover-inner-class="`tooltip-inner popover-inner pa-0`"
            @show="getReactionList"
          >
            <div class="post__count-like">
              <IconFavorite class="icon heading-3 mr-3 color-primary fill-opacity-1" />
              {{ reaction }} lượt thích
            </div>

            <template slot="popover">
              <div class="suggestion-list">
                <template v-if="reactionListLoading">
                  <div
                    v-for="i in (reaction < PAGE_SIZE.DEFAULT ? reaction : PAGE_SIZE.DEFAULT)"
                    :key="i"
                    class="suggestion-list__item"
                  >
                    <vue-content-loading
                      class="flex-grow"
                      :width="160"
                      :height="20"
                      viewBox="0 0 160 20"
                    >
                      <rect x="0" y="0" rx="20" ry="20" width="20" height="20"></rect>
                      <rect x="30" y="6" rx="4" ry="4" width="130" height="8"></rect>
                    </vue-content-loading>
                  </div>
                </template>

                <template v-else>
                  <n-link
                    v-for="user in reactionList"
                    :key="user.id"
                    :to="`/social/account/${user.id}`"
                    class="suggestion-list__item text-base"
                  >
                    <app-avatar class="mr-3" :size="20" :src="user.avatar" />
                    {{ user.name }}
                  </n-link>

                  <client-only v-if="reactionList.length >= PAGE_SIZE.DEFAULT">
                    <infinite-loading @infinite="reactionInfiniteHandler">
                      <div slot="spinner" class="suggestion-list__item">
                        <vue-content-loading
                          class="flex-grow"
                          :width="160"
                          :height="20"
                          viewBox="0 0 160 20"
                        >
                          <rect x="0" y="0" rx="20" ry="20" width="20" height="20"></rect>
                          <rect x="30" y="6" rx="4" ry="4" width="130" height="8"></rect>
                        </vue-content-loading>
                      </div>
                      <template slot="no-more">Hết danh sách.</template>
                    </infinite-loading>
                  </client-only>
                </template>
              </div>
            </template>
          </v-popover>
        </client-only>

        <div class="ml-auto">
          <span
            v-if="get(post, 'counter.comment', 0) > 0"
            class="post__count-comment"
          >{{ get(post, "counter.comment", 0) }} bình luận</span>
          <span
            v-if="get(post, 'counter.share', 0) > 0"
          >{{ get(post, "counter.share", 0) }} lượt chia sẻ</span>
        </div>
      </div>

      <app-divider class="mt-3 mb-0" />

      <div class="post__actions">
        <button
          class="post__button post__button--reaction"
          :class="{ active: post.reaction }"
          :disabled="btnLikeLoading"
          @click="handleClickLike(':heart:')"
        >
          <IconFavorite
            v-if="post.reaction"
            class="icon fill-opacity-1"
            width="2.1rem"
            height="1.8rem"
          />
          <IconFavoriteBorder v-else class="icon fill-opacity-1" width="2.1rem" height="1.8rem" />Thích
        </button>

        <button
          class="post__button"
          :disabled="isFetchingComment"
          @click="handleClickBtnComment"
        >
          <IconBubble class="icon" width="2.1rem" height="2rem" />Bình luận
        </button>

        <button
          class="post__button"
          @click="
            $emit('share', post.type === POST_TYPES.SHARE ? post.payload : post)
          "
        >
          <IconShare class="icon" width="2.1rem" height="2.1rem" />Chia sẻ
        </button>
      </div>

      <template v-if="isCommentFetched">
        <app-divider class="mt-0 mb-3" />

        <CommentEditor ref="commentEditor" class="post__comment-editor" id="post__comment-editor" @submit="postComment" />

        <div class="post__comment-list">
          <a
            v-if="checkShowMoreTop > 0"
            class="post__comment-more"
            href
            @click.prevent="getCommentBefore"
          >Xem thêm bình luận</a>
        </div>

        <div class="post__comment-list">
          <slot name="comment" v-bind="{ commentTree }"></slot>

          <div class="text-center" v-if="isFetchingComment">
            <app-spin />
          </div>

          <a
            v-if="showViewMoreComment"
            class="post__comment-more"
            href
            @click.prevent="getComment"
          >Xem thêm bình luận</a>

          <div
            v-if="!commentTree.length"
            class="post__comment-empty text-center"
          >Bài viết chưa có bình luận.</div>
        </div>
      </template>

      <div class="text-center py-3" v-else-if="isFetchingComment">
        <app-spin />
      </div>
    </div>
  </div>
</template>

<script>
import { get, uniqWith } from "lodash";
import { VueContentLoading } from "vue-content-loading";
import {
  BASE as ACTION_TYPE_BASE,
  SOCIAL as ACTION_TYPE_SOCIAL,
} from "~/utils/action-types";
import {
  POST_PRIVACY_TEXT,
  POST_PRIVACY,
  PAGE_SIZE,
  POST_TYPES,
} from "~/utils/constants";
import { mapState } from "vuex";
import { checkEditorEmpty } from "~/utils/validations";
import { createComment } from "~/models/social/Comment";
import { getEmojiName } from "~/utils/common";

import PostTags from "~/components/page/timeline/post/PostTags";
import CommentItem from "~/components/page/timeline/comment/CommentItem";
import CommentEditor from "~/components/page/timeline/comment/CommentEditor";

import IconGlobe from "~/assets/svg/icons/globe.svg?inline";
import IconLock from "~/assets/svg/icons/lock_24px.svg?inline";
import IconSupervisorAccount from "~/assets/svg/v2-icons/supervisor_account_24px.svg?inline";
import IconFavoriteBorder from "~/assets/svg/v2-icons/favorite_border_24px.svg?inline";
import IconBubble from "~/assets/svg/icons/bubble.svg?inline";
import IconShare from "~/assets/svg/icons/share.svg?inline";
import IconFavorite from "~/assets/svg/v2-icons/favorite_24px.svg?inline";
import IconEdit from "~/assets/svg/v2-icons/edit_24px.svg?inline";
import IconNotifications from "~/assets/svg/v2-icons/notifications_24px.svg?inline";
import IconNotificationsOff from "~/assets/svg/v2-icons/notifications_off_24px.svg?inline";
import IconMoreHoriz from "~/assets/svg/v2-icons/more_horiz_24px.svg?inline";
import IconDeleteForever from "~/assets/svg/v2-icons/delete_forever_24px.svg?inline";

export default {
  components: {
    PostTags,
    CommentItem,
    CommentEditor,
    VueContentLoading,
    IconGlobe,
    IconLock,
    IconSupervisorAccount,
    IconFavoriteBorder,
    IconBubble,
    IconShare,
    IconFavorite,
    IconEdit,
    IconNotifications,
    IconNotificationsOff,
    IconMoreHoriz,
    IconDeleteForever,
  },

  props: {
    showMenuDropdown: Boolean,
    showComment: Boolean,
    post: {
      type: Object,
      default: () => ({
        $commentTree: {},
      }),
    },
    total: Number,
    authorId: String,
    authorAvatar: String,
    authorName: String,
  },

  data() {
    return {
      menuDropdown: false,
      btnLikeLoading: false,
      isFetchingComment: false,
      isCommentFetched: false,
      showViewMoreComment: true,
      showViewMoreCommentBefore: true,
      reactionList: [], // Format: [{ id: String, avatar: String, name: String }]
      reactionListLoading: false,
      showFullText: false,
      commentId: this.$route.query && this.$route.query.commentId ? this.$route.query.commentId : ''
    };
  },

  computed: {
    ...mapState("social/post", ["checkShowMoreTop"]),

    commentTree() {
      return this.post.$commentTree || [];
    },

    reaction() {
      return get(this.post, "counter.reaction", 0);
    },

    showReadMore() {
      const { text = "" } = this.post;
      const stripedHtml = text ? text.replace(/<[^>]+>/g, "") : "";
      return stripedHtml.length > 400;
    },
  },

  created() {
    this.POST_PRIVACY_TEXT = Object.freeze(POST_PRIVACY_TEXT);
    this.POST_PRIVACY = Object.freeze(POST_PRIVACY);
    this.POST_TYPES = Object.freeze(POST_TYPES);
    this.PAGE_SIZE = Object.freeze(PAGE_SIZE);
  },

  async fetch() {
    this.showComment && (await this.getComment());
  },

  fetchOnServer: false,

  methods: {
    get,
    checkEditorEmpty,
    getEmojiName,

    handleClickDelete() {
      this.$emit("delete", this.post.id);
    },

    handleClickLike(emoji = ":heart:") {
      const cb = () => {
        this.btnLikeLoading = false;
      };
      this.$emit("like", !!this.post.reaction, this.post, emoji, cb);
      this.btnLikeLoading = true;
    },

    setIsFetchingComment(value = false) {
      this.isFetchingComment = value;
    },

    setIsCommentFetched(value = false) {
      this.isCommentFetched = value;
    },

    setShowViewMoreComment(value = false) {
      this.showViewMoreComment = value;
    },

    setShowViewMoreCommentBefore(value = false) {
      this.showViewMoreCommentBefore = value;
    },

    getComment() {
      this.$emit(
        "get-comment",
        this.post,
        this.commentTree.length > 0
          ? this.commentTree[this.commentTree.length - 1].id
          : (this.commentId ? this.commentId : null),
        this.setIsFetchingComment,
        this.setIsCommentFetched,
        this.setShowViewMoreComment
      );
    },

    getCommentBefore() {
      console.log('getCommentBefore')
      this.$emit(
        "get-comment-before",
        this.post.id,
        this.commentTree.length > 0
          ? this.commentTree[0].id
          : null,
        this.setIsFetchingComment,
        this.setIsCommentFetched,
        this.setShowViewMoreCommentBefore
      );
    },

    postComment(...args) {
      this.$emit("post-comment", this.post, ...args);
    },

    getReactionList() {
      if (!this.reactionList.length) {
        this.setReactionListLoading(true);
        this.$emit(
          "get-reaction-list",
          this.post.id,
          this.setReactionList,
          this.setReactionListLoading
        );
      }
    },

    setReactionListLoading(value) {
      this.reactionListLoading = value;
    },

    setReactionList(data) {
      this.reactionList = [...this.reactionList, ...data];
    },

    reactionInfiniteHandler($state) {
      const lastReaction = this.reactionList[this.reactionList.length - 1];
      this.$emit(
        "get-reaction-list-infinite",
        this.post.id,
        lastReaction.id,
        this.setReactionList,
        $state
      );
    },

    handleClickBtnComment() {
      // if have not been fetched comment -> get comment
      !this.isCommentFetched && this.getComment();
      // focus to commment editor
      if (this.$refs.commentEditor) {
        const { editor = {}, $el = {} } = this.$refs.commentEditor;
        editor && editor.focus && editor.focus("end");
        $el && $el.scrollIntoView && $el.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/post/_post.scss";
</style>
