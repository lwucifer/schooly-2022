<template>
  <div
    v-if="isEdit"
    :class="{
      'comment-item-edit': true,
      'comment-item-edit--level-2': level === 2,
    }"
  >
    <CommentEditor
      mode="edit"
      :initialValues="data"
      :reply="level === 2"
      @submit="editComment"
    />
    <a
      class="caption comment-item-edit__cancel"
      href="javascript:;"
      @click.prevent="cancelEdit"
      >Huỷ</a
    >
  </div>

  <div v-else class="comment-item" :class="classes">
    <app-avatar
      class="comment-item__avatar"
      :src="get(data, 'author.avatar.low', null)"
      :size="level === 2 ? '3rem' : 'sm'"
      nuxt
      :to="`/social/account/${get(data, 'author.id')}`"
    />

    <div class="comment-item__right">
      <div class="comment-item__box">
        <div class="comment-item__right-top">
          <n-link class="comment-item__name" :to="`/social/account/${get(data, 'author.id')}`">{{
            get(data, "author.fullname", "")
          }}</n-link>

          <app-dropdown
            v-if="uuidUser === get(data, 'author.id', null)"
            class="comment-item__menu-dropdown"
            position="left"
            open-on-click
            v-model="menuDropdown"
          >
            <button
              slot="activator"
              slot-scope="{ on }"
              class="comment-item__menu-dropdown-btn d-block"
              v-on="on"
            >
              <IconDots class="icon d-block" />
            </button>

            <ul class="comment-item__menu-dropdown-list">
              <li>
                <a href="javascript:;" @click.prevent="switchToEdit"
                  >Chỉnh sửa bình luận</a
                >
              </li>
              <li>
                <a href="javascript:;" @click="deleteComment">Xoá</a>
              </li>
            </ul>
          </app-dropdown>

          <span class="comment-item__like-count">
            <IconFavorite class="icon fill-opacity-1" />
            {{ get(data, "counter.reaction", 0) }}
          </span>
        </div>

        <div class="comment-item__content" v-html="data.text"></div>

        <div v-if="data.attachment" class="comment-item__image">
          <!-- <img class="d-block" :src="data.comment_image.medium" alt /> -->
        </div>

        <app-content-box
          v-if="!isEmpty(link)"
          tag="a"
          target="_blank"
          class="mb-3"
          size="sm"
          :href="link.url"
          :image="link.image"
          :title="link.title"
          :desc="link.description"
          :meta-footer="link.siteName"
        />
      </div>

      <div class="comment-item__actions">
        <a
          href
          class="comment-item__action"
          :class="{ active: data.reaction }"
          @click.prevent="() => like()"
          >Thích</a
        >

        <a href class="comment-item__action" @click.prevent="handleClickReply"
          >Trả lời</a
        >

        <n-link to class="comment-item__time">{{
          data.created_at | moment("from")
        }}</n-link>
      </div>

      <template v-if="isCommentFetched">
        <CommentEditor
          v-if="isCommentFetched"
          ref="commentEditor"
          class="mt-3"
          reply
          @submit="postComment"
        />

        <slot
          name="child-comment"
          v-bind="{ commentTree, handleLevel2Reply }"
        ></slot>

        <a
          v-if="showViewMoreComment"
          class="post__comment-more"
          href
          @click.prevent="getChildComment(data.id)"
          >Xem thêm bình luận</a
        >
      </template>

      <CommentItemReplied
        v-else-if="!commentTree.length && get(data, 'counter.comment', 0)"
        :data="data.$children[0]"
        :total="get(data, 'counter.comment', 0)"
        @click="getChildComment(data.id)"
      />

      <div v-if="isFetchingComment" class="text-center">
        <app-spin />
      </div>
    </div>
  </div>
</template>

<script>
import { get, uniqWith, isEmpty } from "lodash";
import {
  BASE as ACTION_TYPE_BASE,
  SOCIAL as ACTION_TYPE_SOCIAL,
} from "~/utils/action-types";
import { PAGE_SIZE } from "~/utils/constants";
import { createComment, editComment } from "~/models/social/Comment";
import { mapGetters } from "vuex";

import CommentItemReplied from "~/components/page/timeline/comment/CommentItemReplied";
import CommentEditor from "~/components/page/timeline/comment/CommentEditor";
import IconDots from "~/assets/svg/icons/dots.svg?inline";
import IconFavorite from "~/assets/svg/v2-icons/favorite_24px.svg?inline";

export default {
  name: "CommentItem",

  components: {
    CommentItemReplied,
    CommentEditor,
    IconDots,
    IconFavorite,
  },

  props: {
    level: {
      type: Number,
      default: 1, // 1 | 2
    },
    post: {
      type: Object,
      default: () => ({}),
    },
    parentComment: {
      type: Object,
      default: () => ({}),
    },
    data: {
      type: Object,
      default: () => ({
        id: null,
        attachment: null,
        created_by: "",
        emoji: null,
        text: "",
        author: {
          id: null,
          fullname: "",
          avatar: {
            high: "",
            medium: "",
            low: "",
          },
          cover: null,
        },
        reaction: null,
        counter: {
          comment: 0,
          reaction: 0,
        },
        created_at: null,
      }),
      validator: (value) =>
        ["id", "author", "text", "created_at"].every((key) => key in value),
    },
  },

  data() {
    return {
      isFetchingComment: false,
      menuDropdown: false,
      // Edit comment data
      isEdit: false,
      isCommentFetched: false,
      editData: {},
      reactionLoading: false,
      showViewMoreComment: true,
    };
  },

  computed: {
    ...mapGetters("auth", ["uuidUser"]),

    classes() {
      const levelClasses = {
        "comment-item--level-2": this.level === 2,
      };
      return { ...levelClasses };
    },

    commentTree() {
      return get(this.data, "$children", []);
    },

    link() {
      return this.data && this.data.comment_link
        ? JSON.parse(this.data.comment_link)
        : {};
    },
  },

  methods: {
    isEmpty,
    get,

    setIsFetchingComment(value = false) {
      this.isFetchingComment = value;
    },

    setIsCommentFetched(value = false) {
      this.isCommentFetched = value;
    },

    setShowViewMoreComment(value = false) {
      this.showViewMoreComment = value;
    },

    getChildComment(id) {
      this.$emit(
        "get-child-comment",
        this.post.id,
        id,
        this.commentTree.length
          ? this.commentTree[this.commentTree.length - 1].id
          : null,
        this.setIsFetchingComment,
        this.setIsCommentFetched,
        this.setShowViewMoreComment
      );
    },

    async postComment({ content }, clearEditor) {
      const dataModel = {
        postId: this.post.id,
        commentId: this.data.id,
        content,
      };

      this.$emit("post-child-comment", dataModel, clearEditor);
    },

    editComment({ content }) {
      const dataModel = {
        parentPostId: this.post.main_post_id,
        postId: this.post.id,
        commentId: this.data.id,
        content,
        parentCommentId: this.parentComment.id,
      };

      this.$emit("edit", dataModel, this.cancelEdit);
    },

    deleteComment(event) {
      event.preventDefault();

      if (this.level === 1) {
        this.$emit("delete", {
          parentPostId: this.post.main_post_id,
          postId: this.post.id,
          id: this.data.id,
        });
      } else {
        this.$emit("delete", {
          parentPostId: this.post.main_post_id,
          postId: this.post.id,
          parentCommentId: this.parentComment.id,
          id: this.data.id,
        });
      }
    },

    switchToEdit() {
      this.editData = this.post;
      this.isEdit = true;
    },

    cancelEdit() {
      this.isEdit = false;
      this.editData = {};
      this.menuDropdown = false;
    },

    like(emoji = ":heart:") {
      if (this.reactionLoading) return;
      this.reactionLoading = true;
      const cb = () => {
        this.reactionLoading = false;
      };

      this.$nextTick(() => {
        this.$emit(
          "like",
          !!this.data.reaction,
          this.post,
          this.parentComment.id || null,
          this.data.id,
          emoji,
          cb
        );
      });
    },

    handleClickReply() {
      if (this.level === 1) {
        if (!this.isCommentFetched && !this.isFetchingComment) {
          this.getChildComment(this.data.id);
        } else {
          const { editor = {} } = this.$refs.commentEditor || {};
          editor.focus && editor.focus("end");
        }
      } else {
        this.$emit("reply", this.data);
      }
    },

    handleLevel2Reply(comment) {
      if (this.level === 1 && this.$refs.commentEditor) {
        const { editor = {}, $el = {} } = this.$refs.commentEditor;

        if (editor && editor.focus && editor.commands) {
          // Tag clicked friend
          // editor.commands.mention && editor.commands.mention({
          //   id: comment.id,
          //   label: get(comment, 'author.fullname', '')
          // });
          editor.focus && editor.focus("end");
        }

        $el && $el.scrollIntoView && $el.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/comment/_comment-item.scss";
</style>
