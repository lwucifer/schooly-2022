<template>
  <div class="post">
    <div class="post__top">
      <n-link :to="`/social/account/${authorId}`" class="post__avatar-wrapper">
        <app-avatar class="post__avatar" :src="authorAvatar" size="5.5rem"></app-avatar>
      </n-link>

      <div class="post__title">
        <div class="post__title-row mb-2">
          <h5 class="post__name font-weight-normal">
            <n-link class="font-weight-bold" :to="`/social/account/${authorId}`">{{ authorName }}</n-link>
          </h5>
        </div>

        <div class="post__title-row">
          <n-link
            v-if="post.created_at"
            class="post__time"
            to
          >{{ post.created_at | getLocalDateTime | moment("from") }}</n-link>

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

        <app-select
          v-if="edit && post.privacy"
          v-model="privacy"
          class="post-edit__select-private mt-3"
          size="sm"
          bordered
          :options="POST_PRIVACY_OPTS"
        >
          <component
            slot="prepend"
            slot-scope="{ selected }"
            :is="selected.icon"
            class="icon fill-opacity-1 d-block"
          />
        </app-select>
      </div>
    </div>

    <div class="post__post">
      <div v-show="edit">
        <!-- EDIT EDITOR -->
        <client-only>
          <div class="post__edit-editor">
            <editor-content class="editor" :editor="editor" />
          </div>
        </client-only>
        <!-- END EDIT EDITOR -->

        <!-- SELECT TAGS -->
        <app-select
          class="post__edit-select"
          mode="tags"
          placeholder="Cùng với ai?"
          style="width: 100%"
          :empty-message="!friendsListLoading ? `Không tìm thấy người nào` : null"
          :options="friendsList"
          v-model="tags"
          @visible-change="handleFriendsVisibleChange"
          @search="handleSearchFriends"
        >
          <IconSupervisorAccount slot="prepend" class="post__edit-select-icon icon d-block body-1" />

          <div slot="option" slot-scope="{ option }" class="d-flex align-items-center">
            <app-avatar :src="option.avatar" size="sm" class="mr-3"></app-avatar>
            {{ option.text }}
          </div>

          <div slot="options-append" v-if="friendsListLoading" class="px-4 py-3 text-center">
            <app-spin />
          </div>
        </app-select>
        <app-divider class="ma-0" color="disabled" />
        <!-- END SELECT TAGS -->

        <div class="text-right mt-3">
          <app-button class="mr-3" color="default" size="sm" outline @click.prevent="cancelEdit">Huỷ</app-button>
          <app-button
            color="primary"
            size="sm"
            :loading="btnEditLoading"
            @click.prevent="submitEdit"
          >Chỉnh sửa xong</app-button>
        </div>
      </div>

      <!--prettyhtml-ignore-->
      <!-- prettier-ignore -->
      <div v-show="!edit">
        <div
  v-if="!checkEditorEmpty(post.text)"
  v-html="post.text"
  class="post__post-desc"
  :class="{
            'post__post-desc--truncated': showReadMore && !showFullText
          }"
>
        </div>
        <a
  v-if="showReadMore"
  href
  @click.prevent
  class="post__post-readmore"
  @click="showFullText = !showFullText"
>{{ showFullText ? `Thu gọn` : `Xem thêm` }}</a>

        <template v-if="post.feeling || (post.tags && post.tags.length)">— <!--
          --><span v-if="post.feeling" class="font-weight-normal"><!--
            --><span>
              <!-- <strong v-html="$emoji.replace_colons(post.feeling)"></strong> -->
              <client-only>
                <emoji :emoji="post.feeling" :size="20"/>
              </client-only><!--
              --> đang cảm thấy {{ getEmojiName(post.feeling).toLowerCase() }}<!--
            --></span>
          </span><!--

          --><PostTags v-if="post.tags && post.tags.length" :tags="post.tags || []" /><!--
          -->.
        </template>
      </div>

      <slot name="media-content" />

      <slot />
    </div>

    <div class="post__interactive">
      <div class="post__count">
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

        <!-- <button class="post__button" @click="$emit('share', post)">
          <IconShare class="icon" width="2.1rem" height="2.1rem" />Chia sẻ
        </button>-->
      </div>

      <template v-if="isCommentFetched">
        <app-divider class="mt-0 mb-3" />

        <CommentEditor ref="commentEditor" class="post__comment-editor" @submit="postComment" />

        <div class="post__comment-list">
          <slot name="comment" v-bind="{ commentTree, post }"></slot>

          <div class="text-center" v-if="isFetchingComment">
            <app-spin />
          </div>

          <a
            v-if="showViewMoreComment"
            class="post__comment-more"
            href
            @click.prevent="getComment"
          >Xem thêm bình luận ...</a>

          <div
            v-if="!commentTree.length && !isFetchingComment"
            class="post__comment-empty text-center"
          >Bài viết chưa có bình luận.</div>
        </div>
      </template>

      <div class="text-center" v-else-if="isFetchingComment">
        <app-spin />
      </div>
    </div>
  </div>
</template>

<script>
import { get, debounce, uniqWith } from "lodash";
import { VueContentLoading } from "vue-content-loading";
import { Editor, EditorContent, Extension } from "tiptap";
import {
  Placeholder,
  Mention,
  HardBreak,
  History,
  Link,
} from "tiptap-extensions";
import { BASE as ACTION_TYPE_BASE } from "~/utils/action-types";
import { createComment } from "~/models/social/Comment";
import { getEmojiName, getMentionIds } from "~/utils/common";
import {
  POST_PRIVACY_TEXT,
  POST_PRIVACY,
  PAGE_SIZE,
  POST_TYPES,
  FRIENDS_FETCH_TYPE,
} from "~/utils/constants";
import { checkEditorEmpty } from "~/utils/validations";
import FriendsService from "~/services/social/Friends";

import PostTags from "~/components/page/timeline/post/PostTags";
import CommentItem from "~/components/page/timeline/comment/CommentItem";
import CommentEditor from "~/components/page/timeline/comment/CommentEditor";

import IconGlobe from "~/assets/svg/icons/globe.svg?inline";
import IconLock from "~/assets/svg/icons/lock_24px.svg?inline";
import IconSupervisorAccount from "~/assets/svg/v2-icons/supervisor_account_24px.svg?inline";
import IconFavoriteBorder from "~/assets/svg/v2-icons/favorite_border_24px.svg?inline";
import IconBubble from "~/assets/svg/icons/bubble.svg?inline";
import IconShare from "~/assets/svg/icons/share.svg?inline";
import IconDots from "~/assets/svg/icons/dots.svg?inline";
import IconFavorite from "~/assets/svg/v2-icons/favorite_24px.svg?inline";

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
    IconDots,
    IconFavorite,
    EditorContent,
  },

  props: {
    showEdit: Boolean,
    comments: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
      default: "",
    },
    post: {
      type: Object,
      default: () => ({}),
    },
    authorId: String,
    authorAvatar: String,
    authorName: String,
    edit: Boolean,
    setEdit: Function,
    isParentPost: Boolean,
  },

  data() {
    const friendsListDefault = this.post.tags
      ? this.post.tags.map((item) => ({
          profile: {
            avatar: item.avatar,
            id: item.id,
            fullname: item.fullname,
          },
        }))
      : [];

    return {
      editor: null,
      menuDropdown: false,
      btnLikeLoading: false,
      isFetchingComment: false,
      isCommentFetched: false,
      showViewMoreComment: true,
      friendsListQuery: "",
      friendsList: this.post.tags
        ? this.post.tags.map((item) => ({
            id: item.id,
            value: item.id,
            text: item.fullname,
            avatar: item.avatar ? item.avatar.low : "",
          }))
        : [],
      friendsListLoading: false,
      tmpTagOptions: [],
      reactionList: [], // Format: [{ id: String, avatar: String, name: String }]
      reactionListLoading: false,
      showFullText: false,
      btnEditLoading: false,

      // Edit model data
      tags: this.post.tags ? this.post.tags.map((item) => item.id) : [],
      privacy: get(this.post, "privacy.scope", null),
    };
  },

  computed: {
    commentTree() {
      return this.post.$commentTree || {};
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
    let privacyOpts = [];

    for (const key in POST_PRIVACY_TEXT) {
      privacyOpts.push({
        value: key,
        text: POST_PRIVACY_TEXT[key],
        icon:
          key === POST_PRIVACY.PUBLIC
            ? IconGlobe
            : key === POST_PRIVACY.FRIENDS
            ? IconSupervisorAccount
            : IconLock,
      });
    }
    this.POST_PRIVACY_OPTS = privacyOpts;
  },

  mounted() {
    this.editor = new Editor({
      content: this.post.text,
      autoFocus: "end",
      extensions: [
        new Link(),
        new HardBreak(),
        // Make press enter = insert hard break
        new (class extends Extension {
          keys() {
            return {
              Enter(state, dispatch, view) {
                const { schema, doc, tr } = view.state;

                const hard_break = schema.nodes.hard_break;
                const transaction = tr
                  .replaceSelectionWith(hard_break.create())
                  .scrollIntoView();
                view.dispatch(transaction);
                return true;
              },
            };
          }
        })(),
        new History(),
        new Placeholder({
          showOnlyCurrent: true,
          showOnlyWhenEditable: true,
          emptyNodeText: "Thêm mô tả...",
        }),
      ],
    });
  },

  beforeDestroy() {
    this.editor.destroy();
  },

  watch: {
    post: {
      immediate: true,
      handler: function (newValue, oldValue) {
        const newPostId = get(newValue, "id", null);
        const oldPostId = get(oldValue, "id", null);
        if (newPostId !== oldPostId) {
          this.getComment();
        }
      },
    },

    edit(newValue) {
      if (newValue) {
        this.editor.setContent(this.post.text);
      }
    },

    friendsListQuery: async function (newValue) {
      this.friendsList = [];
      this.friendsListLoading = true;
      const friendsList = newValue
        ? await this.searchFriends(newValue)
        : await this.getFriends();
      this.friendsList = this.formatFriendsList(friendsList);
      this.friendsListLoading = false;
    },

    friendsList: {
      immediate: true,
      handler(newValue) {
        if (!newValue.length) return;
        const tmp = this.tmpTagOptions.concat(newValue);
        this.tmpTagOptions = uniqWith(tmp, (a, b) => a.value === b.value);
      },
    },

    edit(newValue) {
      if (newValue) {
        this.tags = this.post.tags ? this.post.tags.map((item) => item.id) : [];
        this.privacy = get(this.post, "privacy.scope", null);
      }
    },
  },

  methods: {
    get,
    getEmojiName,
    checkEditorEmpty,

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

    getComment() {
      this.$emit(
        "get-comment",
        this.post,
        this.commentTree.length
          ? this.commentTree[this.commentTree.length - 1].id
          : null,
        this.setIsFetchingComment,
        this.setIsCommentFetched,
        this.setShowViewMoreComment
      );
    },

    postComment(...args) {
      this.$emit("post-comment", this.post, ...args);
    },

    async getFriends() {
      try {
        const doGet = await new FriendsService(this.$axios)[
          ACTION_TYPE_BASE.LIST
        ]({
          params: { fetch_size: PAGE_SIZE.DEFAULT },
        });

        if (!doGet.error) {
          return doGet.data;
        } else {
          this.$toasted.error(doGet.message);
          return [];
        }
      } catch (error) {
        this.$toasted.error(error.message);
        return [];
      }
    },

    async searchFriends(name = "") {
      try {
        const doGet = await new FriendsService(this.$axios)[
          ACTION_TYPE_BASE.LIST
        ]({
          params: {
            fetch_type: FRIENDS_FETCH_TYPE.SEARCH,
            q: name,
            fetch_size: PAGE_SIZE.DEFAULT,
          },
        });

        if (!doGet.error) {
          return doGet.data;
        } else {
          this.$toasted.error(doGet.message);
          return [];
        }
      } catch (error) {
        this.$toasted.error(error.message);
        return [];
      }
    },

    handleSearchFriends: debounce(function (name) {
      this.friendsListQuery = name;
    }, 300),

    async handleFriendsVisibleChange(isVisible) {
      if (isVisible) {
        if (!this.friendsListQuery) {
          this.friendsListLoading = true;
          const friendsList = await this.getFriends();
          this.friendsList = this.formatFriendsList(friendsList);
          this.friendsListLoading = false;
        }
      } else {
        this.friendsList = [];
      }
    },

    cancelEdit() {
      this.setEdit(false);
    },

    submitEdit() {
      const text = this.editor.getHTML();
      const mentionIds = getMentionIds(text);
      const tags = [...this.tags, ...mentionIds];

      this.$emit(
        "edit",
        this.post,
        this.isParentPost,
        {
          text,
          tags,
          privacy: {
            scope: this.privacy,
          },
        },
        this.setEdit,
        this.setBtnEditLoading
      );
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
      this.reactionList = data;
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

    setBtnEditLoading(value) {
      this.btnEditLoading = value;
    },

    formatFriendsList(friendsList = []) {
      return friendsList.map((item) => ({
        id: item.profile ? item.profile.id : "",
        value: item.profile ? item.profile.id : "",
        text: item.profile ? item.profile.fullname : "",
        avatar: get(item, "profile.avatar.low"),
      }));
    },

    handleClickBtnComment() {
      // if have not been fetched comment -> get comment
      !this.isCommentFetched && this.getComment();
      // focus to commment editor
      const { editor = {} } = this.$refs.commentEditor || {};
      editor.focus && editor.focus("end");
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/post/_post.scss";
</style>
