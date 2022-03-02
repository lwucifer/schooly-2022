<template>
  <AccountPhotoWrapper @add-post-success="handleAddPostSuccess">
    <div v-if="$fetchState.pending" class="row social-photo-row">
      <div class="col-6 col-md-3 social-photo-col" v-for="i in 8" :key="i">
        <VueContentLoading class="d-block" viewBox="0 0 100 100">
          <rect x="0" y="0" rx="2" ry="2" width="100" height="100" />
        </VueContentLoading>
      </div>
    </div>

    <div v-else-if="$fetchState.error" class="text-center">{{ $fetchState.error.message }}</div>

    <template v-else>
      <div class="row social-photo-row">
        <div class="col-6 col-md-3 social-photo-col" v-for="i in loadingCount" :key="i">
          <VueContentLoading class="d-block" viewBox="0 0 100 100">
            <rect x="0" y="0" rx="2" ry="2" width="100" height="100" />
          </VueContentLoading>
        </div>

        <div
          class="col-6 col-md-3 social-photo-col"
          v-for="(attachment, index) in attachmentsList"
          :key="attachment.id"
        >
          <a
            :href="`/social/post/${attachment.post_id}?photo_id=${attachment.id}`"
            class="social-photo-item"
            @click.prevent="handleClickImage(attachment, index)"
          >
            <img :src="attachment.url.medium" alt />
          </a>
        </div>
      </div>

      <div v-if="!attachmentsList.length" class="text-center">Danh sách ảnh trống.</div>

      <client-only>
        <infinite-loading
          v-if="attachmentsList.length >= SOCIAL_DEFAULT_PHOTO_FETCH_SIZE"
          @infinite="infiniteHandler"
        >
          <template slot="spinner">
            <div class="row social-photo-row">
              <div class="col-6 col-md-3 social-photo-col" v-for="i in 8" :key="i">
                <VueContentLoading class="d-block" viewBox="0 0 100 100">
                  <rect x="0" y="0" rx="2" ry="2" width="100" height="100" />
                </VueContentLoading>
              </div>
            </div>
          </template>
          <template slot="no-more">Hết danh sách.</template>
          <template slot="no-results">Danh sách ảnh trống.</template>
        </infinite-loading>
      </client-only>
    </template>

    <app-modal
      v-if="modalDetailShow"
      centered
      :header="false"
      :footer="false"
      :width="1140"
      :component-class="{ 'post-detail-modal': true }"
      @close="handleCloseModal"
    >
      <PostDetail
        slot="content"
        :post="post"
        :is-parent-post="modalDetailAttachment.depend_on_parent || false"
        :total-image="attachmentsList.length"
        :index="attachmentsList.indexOf(modalDetailAttachment)"
        :attachment="postDetailAttachment"
        :is-own="post && post.author ? post.author.id === $store.getters['auth/uuidUser'] : false"
        :loading="modalDetailLoading"
        @click-close="handleCloseModal"
        @click-prev="handleClickPrev"
        @click-next="handleClickNext"
        @delete="showModalConfirmDelete"
      >
        <PostDetailPost
          slot="post"
          slot-scope="{ post, isParentPost, edit, setEdit }"
          show-edit
          show-comment
          :edit="edit"
          :post="post"
          :author-id="post.author ? post.author.id : ''"
          :author-name="post.author ? post.author.fullname : ''"
          :author-avatar="get(post, 'author.avatar.low', '')"
          :setEdit="setEdit"
          :is-parent-post="isParentPost"
          @edit="submitEditPostDetail"
          @like="likeDetailPost"
          @get-comment="getCommentDetailPost"
          @post-comment="postCommentDetailPost"
          @get-reaction-list="getReactionList"
          @get-reaction-list-infinite="getReactionListInfinite"
        >
          <template slot="comment" slot-scope="{ commentTree, post }">
            <transition-group
              enter-active-class="animated faster fadeIn"
              leave-active-class="animated faster fadeOut"
            >
              <template v-for="comment in commentTree || []">
                <CommentItem
                  v-if="comment.status !== 'DELETED'"
                  :key="comment.id"
                  :post="post"
                  :data="comment"
                  @edit="editCommentDetailPost"
                  @delete="deleteCommentDetailPost"
                  @like="likeCommentDetailPost"
                  @get-child-comment="getChildCommentDetailPost"
                  @post-child-comment="postChildCommentDetailPost"
                >
                  <template slot="child-comment" slot-scope="{ commentTree, handleLevel2Reply }">
                    <transition-group
                      enter-active-class="animated faster fadeIn"
                      leave-active-class="animated faster fadeOut"
                    >
                      <template v-for="childComment in commentTree || []">
                        <CommentItem
                          v-if="childComment.status !== 'DELETED'"
                          :key="childComment.id"
                          :level="2"
                          :post="post"
                          :parentComment="comment"
                          :data="childComment"
                          @reply="handleLevel2Reply"
                          @edit="editChildCommentDetailPost"
                          @delete="deleteChildCommentDetailPost"
                          @like="likeChildCommentDetailPost"
                        />
                      </template>
                    </transition-group>
                  </template>
                </CommentItem>
              </template>
            </transition-group>
          </template>
        </PostDetailPost>
      </PostDetail>
    </app-modal>
  </AccountPhotoWrapper>
</template>

<script>
import { get } from "lodash";
import { mapState } from "vuex";
import { VueContentLoading } from "vue-content-loading";
import * as actionTypes from "~/utils/action-types";
import {
  SOCIAL_USERS as ENDPOINT_SOCIAL_USERS,
  POSTS as ENDPOINT_POSTS,
} from "~/utils/endpoints";
import {
  ATTACHMENT_TYPES,
  SOCIAL_DEFAULT_PHOTO_FETCH_SIZE,
  POST_TYPES,
  PAGE_SIZE,
} from "~/utils/constants";
import { createReaction } from "~/models/social/Reaction";
import { editPost } from "~/models/post/Post";
import { createComment, editComment } from "~/models/social/Comment";
import AccountPhotoWrapper from "~/components/page/social/account/AccountPhotoWrapper";
import PostDetail from "~/components/page/timeline/post/PostDetail";
import PostDetailPost from "~/components/page/timeline/post/PostDetailPost";
import CommentItem from "~/components/page/timeline/comment/CommentItem";

export default {
  components: {
    AccountPhotoWrapper,
    VueContentLoading,
    PostDetail,
    PostDetailPost,
    CommentItem,
  },

  data() {
    return {
      attachmentsList: [],
      lastUuidParam: this.$route.params.uuid,
      modalDetailShow: false,
      loadingCount: 0,
      // Delete post
      modalConfirmDelete: false,
      modalConfirmDeleteId: null,
      modalConfirmDeleteLoading: false,
      modalDetailLoading: false,
      modalDetailAttachment: {}
    };
  },

  computed: {
    ...mapState("social/modalPostDetail", ["post"]),

    postDetailAttachment() {
      return {
        type: this.modalDetailAttachment.type,
        src: get(this.modalDetailAttachment, 'url.high')
      }
    }
  },

  created() {
    this.SOCIAL_DEFAULT_PHOTO_FETCH_SIZE = SOCIAL_DEFAULT_PHOTO_FETCH_SIZE;
    this.POST_TYPES = Object.freeze(POST_TYPES);
  },

  async fetch() {
    const result = await this.getAttachments();

    if (!result.error) {
      this.attachmentsList = result.data || [];
    } else {
      if (process.server) {
        this.$nuxt.context.res.statusCode = 404;
      }
      throw new Error(result.error.message);
    }
  },

  fetchOnServer: false,

  activated() {
    if (this.lastUuidParam !== this.$route.params.uuid) {
      this.lastUuidParam = this.$route.params.uuid;
      this.$fetch();
      return;
    }

    if (this.$fetchState.timestamp <= Date.now() - 20000) {
      this.$fetch();
    }
  },

  deactivated() {
    window.removeEventListener("popstate", this.handlePopstate);
  },

  mounted() {
    if (process.browser) {
      window.addEventListener("popstate", this.handlePopstate);
    }
  },

  beforeDestroy() {
    if (process.browser) {
      window.removeEventListener("popstate", this.handlePopstate);
    }
  },

  methods: {
    get,

    async getAttachments(from = null) {
      try {
        const result = await this.$axios.$get(
          `${ENDPOINT_SOCIAL_USERS}/${this.$route.params.uuid}/attachments`,
          {
            params: {
              type: ATTACHMENT_TYPES.IMAGE,
              fetch_size: SOCIAL_DEFAULT_PHOTO_FETCH_SIZE,
              from_attachment_id: from,
            },
          }
        );

        return result;
      } catch (error) {
        this.$toasted.error(error.message);
        throw error;
      }
    },

    async infiniteHandler($state) {
      const lastPhoto = this.attachmentsList.length
        ? this.attachmentsList[this.attachmentsList.length - 1]
        : {};
      const result = await this.getAttachments(lastPhoto.id || null);

      if (!result.error) {
        if (result.data && result.data.length) {
          this.attachmentsList = [
            ...this.attachmentsList,
            ...(result.data || []),
          ];
          $state.loaded();
        } else {
          $state.complete();
        }

        return;
      }

      $state.complete();
    },

    async handleAddPostSuccess(dataResponse) {
      const { attachments = [] } = dataResponse;
      this.loadingCount =
        attachments && attachments.length
          ? attachments.filter((item) => item.type === ATTACHMENT_TYPES.IMAGE)
              .length
          : 0;

      const result = await this.getAttachments();

      if (!result.error) {
        this.attachmentsList = result.data || [];
      } else {
        this.$toasted.error(result.error.message);
      }

      this.loadingCount = 0;
    },

    /**
     * Click image -> change url, open modal detail
     * @param { Object } attachment - attachment get from api
     */
    async handleClickImage(attachment, index) {
      try {
        // Set data of modal detail
        this.modalDetailLoading = true;
        this.modalDetailAttachment = attachment;

        this.$nextTick(() => {
          this.modalDetailShow = true;
        });

        if (typeof window.history.pushState != "undefined") {
          window.history.pushState(
            { theater: true },
            "",
            `${window.location.origin}/social/post/${attachment.post_id}?photo_id=${attachment.id}`
          );
        } else {
          this.$router.push(
            `social/post/${attachment.post_id}?photo_id=${attachment.id}`
          );
          return;
        }

        const getPost = await this.$store.dispatch(
          `social/modalPostDetail/${actionTypes.MODAL_POST_DETAIL.GET_POST}`,
          {
            postId: attachment.depend_on_parent ? attachment.post_id : attachment.id,
            parentPostId: attachment.depend_on_parent ? null : attachment.post_id,
          }
        );

        if (getPost.error) {
          this.$toasted.error(getPost.error.message);
        }

        this.modalDetailLoading = false;
      } catch (error) {
        this.handleCloseModal();
        this.modalDetailLoading = false;
        this.$toasted.error(error.message);
      }
    },

    /**
     * Hande click nav button of browser
     * @param { Object } event - event emited
     */
    handlePopstate(event) {
      const timeout = setTimeout(() => {
        console.log("event.state", event.state);
        const fullPath = document.location.href.replace(
          window.location.origin,
          ""
        );

        if (event.state.theater) {
          // this.modalDetailShow = true;
        } else {
          // this.modalDetailShow = false;
        }

        clearTimeout(timeout);
      });
    },

    /**
     * Click close modal -> set url in browser to '/'
     */
    handleCloseModal() {
      if (typeof window.history.pushState != "undefined") {
        window.history.pushState(
          {},
          "",
          `${window.location.origin}/social/account/${this.$route.params.uuid}/photos`
        );
      }

      this.modalDetailShow = false;
      this.modalDetailAttachment = {};
      this.$store.dispatch(
        `social/modalPostDetail/${actionTypes.MODAL_POST_DETAIL.CLEAR_POST}`
      );
    },

    /**
     * on click prev arrow on modal post detail -> get prev image info
     * @param { Number } id - postId of image post
     * @param { Object } post - parent post
     */
    handleClickPrev(index) {
      this.handleClickImage(this.attachmentsList[index - 1], index - 1);
    },

    /**
     * on click next arrow on modal post detail -> get next image info
     * @param { Number } id - postId of image post
     * @param { Object } post - parent post
     */
    handleClickNext(index) {
      this.handleClickImage(this.attachmentsList[index + 1], index + 1);
    },

    showModalConfirmDelete(id) {
      this.modalConfirmDelete = true;
      this.modalConfirmDeleteId = id;
    },

    hideModalConfirmDelete() {
      this.modalConfirmDelete = false;
      this.modalConfirmDeleteId = null;
    },

    /**
     * To LIKE detail post modal
     */
    async likeDetailPost(isLiked, post, emoji, cb) {
      const model = createReaction(emoji);

      await this.$store.dispatch(
        `social/modalPostDetail/${
          isLiked
            ? actionTypes.MODAL_POST_DETAIL.DELETE_LIKE_POST
            : actionTypes.MODAL_POST_DETAIL.LIKE_POST
        }`,
        { parentPostId: post.main_post_id, postId: post.id, model }
      );

      // Have to run cb
      typeof cb === "function" && cb();
    },

    /**
     * To GET comment of detail post modal
     */
    async getCommentDetailPost(
      post,
      fromId,
      setIsFetchingComment,
      setIsCommentFetched,
      setShowViewMoreComment
    ) {
      setIsCommentFetched && setIsFetchingComment(true);

      const getComment = await this.$store.dispatch(
        `social/modalPostDetail/${actionTypes.MODAL_POST_DETAIL.GET_COMMENT}`,
        {
          parentPostId: post.main_post_id,
          postId: post.id,
          from_comment_id: fromId,
          fetch_size: PAGE_SIZE.DEFAULT,
        }
      );
      const { data = [] } = getComment;

      if (setShowViewMoreComment && data.length < PAGE_SIZE.DEFAULT) {
        setShowViewMoreComment(false);
      } else {
        setShowViewMoreComment(true);
      }

      setIsFetchingComment && setIsFetchingComment(false);
      setIsCommentFetched && setIsCommentFetched(true);
    },

    /**
     * To POST comment of detail post modal
     */
    async postCommentDetailPost(
      post,
      { content, listTags, image, link },
      clearEditor
    ) {
      const model = createComment(content);

      const doPostComment = await this.$store.dispatch(
        `social/modalPostDetail/${actionTypes.MODAL_POST_DETAIL.ADD_COMMENT}`,
        {
          parentPostId: post.main_post_id,
          postId: post.id,
          model,
        }
      );

      if (!doPostComment.error) {
        clearEditor();
      } else {
        this.$toasted.error(doPostComment.error.message);
      }
    },

    /**
     * To EDIT comment of detail post modal
     */
    async editCommentDetailPost({ parentPostId, postId, commentId, content }, cancelEdit) {
      const model = editComment(content);

      const doEdit = await this.$store.dispatch(
        `social/modalPostDetail/${actionTypes.MODAL_POST_DETAIL.EDIT_COMMENT}`,
        {
          parentPostId,
          postId,
          commentId,
          model,
        }
      );

      if (!doEdit.error) {
        cancelEdit();
      } else {
        this.$toasted.error(doEdit.error.message);
      }
    },

    /**
     * To DELETE comment of detail post modal
     */
    async deleteCommentDetailPost({ parentPostId, postId, id }) {
      const doDelete = await this.$store.dispatch(
        `social/modalPostDetail/${actionTypes.MODAL_POST_DETAIL.DELETE_COMMENT}`,
        { parentPostId, postId, id }
      );

      if (doDelete.error) {
        this.$toasted.error(doDelete.error.message);
      }
    },

    /**
     * To LIKE comment of detail post modal
     */
    async likeCommentDetailPost(
      isLiked,
      post,
      parentCommentId,
      commentId,
      emoji,
      cb
    ) {
      const model = createReaction(emoji);

      await this.$store.dispatch(
        `social/modalPostDetail/${
          isLiked
            ? actionTypes.MODAL_POST_DETAIL.DELETE_LIKE_COMMENT
            : actionTypes.MODAL_POST_DETAIL.LIKE_COMMENT
        }`,
        {
          parentPostId: post.main_post_id,
          postId: post.id,
          commentId,
          model,
        }
      );

      typeof cb === "function" && cb();
    },

    /**
     * To GET child comment list of post modal
     */
    async getChildCommentDetailPost(
      postId,
      commentId,
      fromId,
      setIsFetchingComment,
      setIsCommentFetched,
      setShowViewMoreComment
    ) {
      setIsFetchingComment && setIsFetchingComment(true);

      const doGet = await this.$store.dispatch(
        `social/modalPostDetail/${actionTypes.MODAL_POST_DETAIL.GET_CHILD_COMMENT}`,
        {
          postId,
          commentId,
          fromId,
          size: PAGE_SIZE.DEFAULT,
        }
      );
      const { data = [] } = doGet;

      if (setShowViewMoreComment && data.length < PAGE_SIZE.DEFAULT) {
        setShowViewMoreComment(false);
      } else {
        setShowViewMoreComment(true);
      }

      setIsFetchingComment && setIsFetchingComment(false);
      setIsCommentFetched && setIsCommentFetched(true);
    },

    /**
     * To POST a child comment of post modal
     */
    async postChildCommentDetailPost(
      { content, postId, commentId },
      clearEditor
    ) {
      const model = createComment(content);
      const doAction = await this.$store.dispatch(
        `social/modalPostDetail/${actionTypes.MODAL_POST_DETAIL.ADD_CHILD_COMMENT}`,
        { postId, commentId, model }
      );

      if (!doAction.error) {
        clearEditor();
      } else {
        this.$toasted.error(doAction.error.message);
      }
    },

    /**
     * To EDIT a child comment of post modal
     */
    async editChildCommentDetailPost(
      { postId, commentId, content, parentCommentId },
      cancelEdit
    ) {
      const model = editComment(content);

      const doEdit = await this.$store.dispatch(
        `social/modalPostDetail/${actionTypes.MODAL_POST_DETAIL.EDIT_CHILD_COMMENT}`,
        {
          postId,
          commentId,
          parentCommentId,
          model,
        }
      );

      if (!doEdit.error) {
        cancelEdit();
      } else {
        this.$toasted.error(doEdit.error.message);
      }
    },

    /**
     * To DELETE a child comment of post modal
     */
    async deleteChildCommentDetailPost({ id, postId, parentCommentId }) {
      const doDelete = await this.$store.dispatch(
        `social/modalPostDetail/${actionTypes.MODAL_POST_DETAIL.DELETE_CHILD_COMMENT}`,
        { id, postId, parentCommentId }
      );

      if (doDelete.error) {
        this.$toasted.error(doDelete.error.message);
      }
    },

    /**
     * To LIKE a child comment of post modal
     */
    async likeChildCommentDetailPost(
      isLiked,
      postId,
      parentCommentId,
      commentId,
      emoji,
      cb
    ) {
      const model = createReaction(emoji);
      const doLike = await this.$store.dispatch(
        `social/modalPostDetail/${
          isLiked
            ? actionTypes.MODAL_POST_DETAIL.DELETE_LIKE_CHILD_COMMENT
            : actionTypes.MODAL_POST_DETAIL.LIKE_CHILD_COMMENT
        }`,
        {
          model,
          postId,
          parentCommentId,
          commentId,
        }
      );

      typeof cb === "function" && cb();
    },

    /**
     * To handle PostDetailPost submit edit
     */
    async submitEditPostDetail(
      post,
      isParentPost,
      { text, tags, privacy },
      editDone,
      setLoading
    ) {
      try {
        console.log('submitEditPostDetail', post, isParentPost)
        setLoading(true);
        const postTagIds = post.tags ? post.tags.map((item) => item.id) : [];
        const isChangeTags =
          JSON.stringify(tags) !== JSON.stringify(postTagIds);
        const model = editPost({
          text,
        });
        const doEdit = async () =>
          await this.$store.dispatch(`social/modalPostDetail/${actionTypes.MODAL_POST_DETAIL.EDIT_POST}`,
            {
              childPath: isParentPost ? post.id : `${post.main_post_id || ""}/children/${post.id}`,
              model,
            }
          );

        const result = await Promise.all([
          post.text !== text && doEdit(),
          // isChangeTags && this.editTagsOfPost({ post, isParentPost, tags }),
          isChangeTags && await this.$store.dispatch(
            `social/modalPostDetail/${actionTypes.MODAL_POST_DETAIL.EDIT_POST_TAGS}`,
            {
              postId: post.id,
              mainPostId: isParentPost ? null : post.main_post_id,
              tags,
            }
          ),
          post.privacy &&
            privacy &&
            post.privacy.scope !== privacy.scope &&
            this.$store.dispatch(
              `social/account/timeline/${actionTypes.ACCOUNT_TIMELINE.EDIT_POST_PRIVACY}`,
              {
                postId: isParentPost ? post.id : post.main_post_id,
                privacy,
              }
            ),
        ]);
        const resultError = result.filter((item) => item && item.error);

        if (resultError.length) {
          resultError.forEach((item) => {
            this.$toasted.error(item.error.message);
          });
        } else {
          typeof editDone === "function" && editDone();
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
        throw error;
      }
    },

    /**
     * To get reactionList pass to Post.vue
     */
    async getReactionList(
      postId,
      setComponentReactionList,
      setComponentReactionListLoading
    ) {
      try {
        const result = await this.$axios.$get(
          `${ENDPOINT_POSTS}/${postId}/reactions`,
          {
            params: {
              emoji: ":heart:",
            },
          }
        );

        if (!result.error) {
          setComponentReactionList(
            result.data
              ? result.data.map((item) => ({
                  id: item.id,
                  avatar: item.avatar ? item.avatar.low : "",
                  name: item.fullname,
                }))
              : []
          );
          setComponentReactionListLoading(false);
        }
      } catch (error) {
        throw error;
      }
    },

    async getReactionListInfinite(
      postId,
      fromId,
      setComponentReactionList,
      $state
    ) {
      try {
        const result = await this.$axios.$get(
          `${ENDPOINT_POSTS}/${postId}/reactions`,
          {
            params: {
              emoji: ":heart:",
              fetch_size: PAGE_SIZE.DEFAULT,
              from_actor_id: fromId,
            },
          }
        );

        if (result.data && result.data.length) {
          setComponentReactionList(
            result.data.map((item) => ({
              id: item.id,
              avatar: item.avatar ? item.avatar.low : "",
              name: item.fullname,
            }))
          );
          $state.loaded();
        } else {
          $state.complete();
        }
      } catch (error) {
        throw error;
      }
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/social/_social-photo.scss";
</style>