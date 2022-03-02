<template>
  <main class="page-timeline">
    <PostEditor
      v-if="$route.params.uuid === $store.getters['auth/uuidUser']"
      class="shadow-1"
      :active="postEditorActive"
      @submit="addPost"
      @active-change="(active) => (postEditorActive = active)"
    />

    <VclFacebook
      v-if="postLoading || $fetchState.pending"
      class="d-block bg-white w-100 pa-4 mb-15"
    />

    <transition-group
      v-if="!$fetchState.pending"
      enter-active-class="animated faster fadeIn"
      leave-active-class="animated faster fadeOut"
    >
      <template v-for="post in posts">
        <Post
          v-if="post.status !== 'DELETED'"
          :key="post.id"
          :post="post"
          :author-id="socialProfile.id"
          :author-name="socialProfile.fullname"
          :author-avatar="socialProfile.avatar ? socialProfile.avatar.low : ''"
          :show-menu-dropdown="post.created_by === uuidUser"
          @delete="showModalConfirmDelete"
          @like="likePost"
          @edit="editPost"
          @share="openModalShare"
          @get-comment="getComment"
          @post-comment="postComment"
          @get-reaction-list="getReactionList"
          @get-reaction-list-infinite="getReactionListInfinite"
        >
          <template slot="media-content" slot-scope="{ link }">
            <PostImage
              v-if="post.type === POST_TYPES.MEDIA && post.attachments"
              class="my-4"
              :images="
                  post.attachments.map((item) => ({
                    id: item.id,
                    thumb: get(item, 'url.medium', null),
                    object: item.type,
                    url: item.url
                  }))
                "
              @click-item="(...args) => handleClickImage(...args, post)"
            />

            <app-content-box
              v-if="post.type === POST_TYPES.LINK"
              tag="a"
              target="_blank"
              class="post__link-box"
              direction="vertical"
              type="preview-link"
              :href="link.url"
              :image="link.image_url"
              :title="link.title"
              :desc="link.description || link.url"
              :meta-footer="link.site_name"
            />
          </template>

          <PostShareContent
            v-if="post.type === POST_TYPES.SHARE"
            class="post__link-box"
            :post="post.payload"
          >
            <template slot="media-content" slot-scope="{ attachments, sharedPost }">
              <PostImage
                v-if="attachments && attachments.length"
                class="mt-0 mb-4"
                :images="
                    attachments.map((item) => ({
                      id: item.id,
                      thumb: get(item, 'url.medium', null),
                      object: item.type,
                      url: item.url
                    }))
                  "
                @click-item="
                    (...args) => handleClickImage(...args, sharedPost, post)
                  "
              />

              <app-content-box
                v-if="
                    sharedPost.type === POST_TYPES.LINK &&
                      typeof sharedPost.link === 'object'
                  "
                tag="a"
                target="_blank"
                class="mt-0 mb-4"
                direction="vertical"
                type="preview-link"
                :href="sharedPost.link.url"
                :image="sharedPost.link.image_url"
                :title="sharedPost.link.title"
                :desc="sharedPost.link.description || sharedPost.link.url"
                :meta-footer="sharedPost.link.site_name"
              />
            </template>
          </PostShareContent>

          <template slot="comment" slot-scope="{ commentTree }">
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
                  @edit="editComment"
                  @delete="deleteComment"
                  @like="likeComment"
                  @get-child-comment="getChildComment"
                  @post-child-comment="postChildComment"
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
                          @edit="editChildComment"
                          @delete="deleteChildComment"
                          @like="likeChildComment"
                          @reply="handleLevel2Reply"
                        />
                      </template>
                    </transition-group>
                  </template>
                </CommentItem>
              </template>
            </transition-group>
          </template>
        </Post>
      </template>
    </transition-group>

    <div v-if="$fetchState.error" class="text-center">{{ $fetchState.error.message }}</div>

    <client-only v-else-if="!$fetchState.pending">
      <infinite-loading @infinite="feedInfiniteHandler">
        <VclFacebook slot="spinner" class="bg-white pa-4 w-100" />
        <template
          slot="no-more"
        >{{ countVisiblePosts ? `Không còn bài viết.` : `Chưa có bài viết.` }}</template>
        <template
          slot="no-results"
        >{{ countVisiblePosts ? `Không còn bài viết.` : `Chưa có bài viết.` }}</template>
      </infinite-loading>
    </client-only>

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
        :post="modalDetailPost"
        :parent-post="modalDetailParentPost"
        :is-parent-post="modalDetailParentPostId === modalDetailPostId"
        :total-image="modalDetailTotal"
        :index="modalDetailIndex"
        :attachment="modalDetailAttachment"
        :is-own="checkIsOwn()"
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
          :author-id="post.author ? post.author.id : socialProfile.id"
          :author-name="post.author ? post.author.fullname : socialProfile.fullname"
          :author-avatar="post.author ? get(post, 'author.avatar.low', '') : get(socialProfile, 'avatar.low', '')"
          :setEdit="setEdit"
          :is-parent-post="isParentPost"
          @edit="submitEditPostDetail"
          @like="
            (...args) =>
              isParentPost ? likePost(...args) : likeDetailPost(...args)
          "
          @get-comment="
            (...args) =>
              isParentPost ? getComment(...args) : getCommentDetailPost(...args)
          "
          @post-comment="
            (...args) =>
              isParentPost
                ? postComment(...args)
                : postCommentDetailPost(...args)
          "
          @share="openModalShare"
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
                  @edit="
                    (...args) =>
                      isParentPost
                        ? editComment(...args)
                        : editCommentDetailPost(...args)
                  "
                  @delete="
                    (...args) =>
                      isParentPost
                        ? deleteComment(...args)
                        : deleteCommentDetailPost(...args)
                  "
                  @like="
                    (...args) =>
                      isParentPost
                        ? likeComment(...args)
                        : likeCommentDetailPost(...args)
                  "
                  @get-child-comment="
                    (...args) =>
                      isParentPost
                        ? getChildComment(...args)
                        : getChildCommentDetailPost(...args)
                  "
                  @post-child-comment="
                    (...args) =>
                      isParentPost
                        ? postChildComment(...args)
                        : postChildCommentDetailPost(...args)
                  "
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
                          @edit="
                            (...args) =>
                              isParentPost
                                ? editChildComment(...args)
                                : editChildCommentDetailPost(...args)
                          "
                          @delete="
                            (...args) =>
                              isParentPost
                                ? deleteChildComment(...args)
                                : deleteChildCommentDetailPost(...args)
                          "
                          @like="
                            (...args) =>
                              isParentPost
                                ? likeChildComment(...args)
                                : likeChildCommentDetailPost(...args)
                          "
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

    <PostModalShare
      v-if="showModalShare"
      :post="shareData"
      @cancel="cancelShare"
      @share="sharePost"
    >
      <template slot="share-content">
        <app-content-box
          v-if="shareData.type === POST_TYPES.LINK && typeof shareData.link === 'object'"
          tag="a"
          target="_blank"
          class="my-0"
          direction="vertical"
          type="preview-link"
          :href="shareData.link.url"
          :image="shareData.link.image_url"
          :title="shareData.link.title"
          :desc="shareData.link.description || shareData.link.url"
          :meta-footer="shareData.link.site_name"
        />

        <PostShareContent v-else :post="shareData">
          <template slot="media-content">
            <PostImage
              v-if="shareData.type === POST_TYPES.MEDIA || shareData.attachments || shareData.attachment"
              class="mt-0 mb-4"
              :images="
                shareData.attachments ? shareData.attachments.map((item) => ({
                  id: item.id,
                  thumb: get(item, 'url.medium', null),
                  object: item.type,
                  url: item.url
                })) : shareData.attachment ? [{
                  id: shareData.attachment.id,
                  thumb: get(shareData, 'attachment.url.medium', null),
                  object: shareData.attachment.type,
                  url: shareData.attachment.url
                }] : []
              "
            />
          </template>
        </PostShareContent>
      </template>
    </PostModalShare>

    <app-modal
      v-if="showModalEditPost"
      :component-class="{ 'modal-edit-post': true }"
      :width="610"
      title="Sửa bài viết"
      :footer="false"
      @close="closeModalEditPost"
    >
      <PostEditor
        slot="content"
        ref="editEditor"
        class="mb-0"
        mode="edit"
        :active="true"
        :initialValues="editPostInitialValues"
        :initialFileList="editPostInitialFileList"
        :initialPreviewList="editPostInitialPreviewList"
        :shared-post="editPostSharedPost"
        :show-avatar="false"
        :show-overlay="false"
        prefetch
        @submit="handleSubmitEditPost"
      />
      <div slot="footer" class="text-right px-4 pb-3">
        <app-button
          class="mr-3"
          color="info"
          :disabled="modalEditPostLoading"
          size="sm"
          square
          @click="closeModalEditPost"
        >Huỷ</app-button>

        <app-button
          color="primary"
          :loading="modalEditPostLoading"
          size="sm"
          square
          @click="handleClickSaveEditPost"
        >Lưu</app-button>
      </div>
    </app-modal>

    <app-modal-confirm
      v-if="modalConfirmDelete"
      okText="Xoá"
      title="Bạn có chắc chắn muốn xoá?"
      :confirmLoading="modalConfirmDeleteLoading"
      @cancel="hideModalConfirmDelete"
      @ok="deletePost(modalConfirmDeleteId)"
    ></app-modal-confirm>
  </main>
</template>

<script>
import { get, isEmpty } from "lodash";
import { mapState, mapGetters } from "vuex";
import { VclFacebook } from "vue-content-loading";
import * as actionTypes from "~/utils/action-types";
import { MODAL_POST_DETAIL as MUTATION_MODAL_POST_DETAIL } from "~/utils/mutation-types";
import {
  POST_TYPES,
  PAGE_SIZE,
  ATTACHMENT_TYPES,
  MEDIA_TARGET_TYPES,
} from "~/utils/constants";
import { POSTS as ENDPOINT_POSTS } from "~/utils/endpoints";
import { createReaction } from "~/models/social/Reaction";
import { createPost, editPost } from "~/models/post/Post";
import { createComment, editComment } from "~/models/social/Comment";
import { createPostLink } from "~/models/post/PostLink";
import MediaService from "~/services/social/Media";

import PostEditor from "~/components/page/timeline/postEditor/PostEditor";
import AsideBox from "~/components/layout/asideBox/AsideBox";
import Post from "~/components/page/timeline/post/Post";
import PostSlider from "~/components/page/timeline/post/PostSlider";
import PostDetail from "~/components/page/timeline/post/PostDetail";
import PostImage from "~/components/page/timeline/post/PostImage";
import PostModalShare from "~/components/page/timeline/post/PostModalShare";
import PostShareContent from "~/components/page/timeline/post/PostShareContent";
import PostDetailPost from "~/components/page/timeline/post/PostDetailPost";
import CommentItem from "~/components/page/timeline/comment/CommentItem";

export default {
  middleware: "authenticated",

  components: {
    PostEditor,
    AsideBox,
    Post,
    PostSlider,
    PostDetail,
    PostImage,
    VclFacebook,
    PostModalShare,
    PostShareContent,
    CommentItem,
    PostDetailPost,
  },

  data() {
    return {
      postEditorActive: false,
      postLoading: false,
      // Modal post detail
      modalDetailShow: false,
      modalDetailParentPostId: null,
      modalDetailPostId: null,
      modalDetailSharedPost: {},
      modalDetailIndex: -1,
      modalDetailTotal: 0,
      modalDetailAttachment: {},
      modalDetailLoading: false,
      // Edit post
      showModalEditPost: false,
      modalEditPostLoading: false,
      editPostSharedPost: {},
      editPostInitialValues: {},
      editPostInitialPreviewList: [],
      editPostInitialFileList: [],
      // Share post
      showModalShare: false,
      shareData: {},
      // Delete post
      modalConfirmDelete: false,
      modalConfirmDeleteId: null,
      modalConfirmDeleteLoading: false,
      // For check uuid change because of cached page
      lastUuidParam: this.$route.params.uuid,
    };
  },

  computed: {
    ...mapState("social/account/timeline", ["posts"]),
    ...mapState("social/account/profile", ["socialProfile"]),
    ...mapGetters("auth", ["uuidUser"]),

    modalDetailPost() {
      return this.$store.state.social.modalPostDetail.post;
    },

    modalDetailParentPost() {
      return (
        this.$store.getters[`social/account/timeline/post`](
          this.modalDetailParentPostId
        ) || this.modalDetailSharedPost
      );
    },

    countVisiblePosts() {
      return this.posts.reduce((sum, post) => {
        if (post.allow_access) {
          sum += 1;
        }
        return sum;
      }, 0);
    },
  },

  async fetch() {
    const result = await this.$store.dispatch(
      `social/account/timeline/${actionTypes.ACCOUNT_TIMELINE.GET_POSTS}`,
      {
        uuid: this.$route.params.uuid,
      }
    );

    if (result.error) {
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

  created() {
    this.POST_TYPES = Object.freeze(POST_TYPES);
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

  watch: {
    "$route.params.uuid": function (newValue) {
      if (this.lastUuidParam !== newValue && !this._inactive) {
        this.lastUuidParam = newValue;
        this.$fetch();
      }
    },
  },

  methods: {
    get,
    isEmpty,

    /**
     * Click image -> change url
     * @param { Object } imageObj - { id, thumb, object }
     * @param { Object } post
     */
    async handleClickImage({ id, url, object }, index, total, post, parentSharePost) {
      // Set data modal
      this.modalDetailLoading = true;
      this.modalDetailIndex = index;
      this.modalDetailTotal = total;
      this.modalDetailAttachment = {
        src: url.high,
        type: object
      };

      // Save this parent shared post to calculate how many attachments in post
      if (parentSharePost) {
        this.modalDetailSharedPost = post;
      }

      this.$nextTick(() => {
        this.modalDetailShow = true;
      });

      // Change url
      if (typeof window.history.pushState != "undefined") {
        this.modalDetailParentPostId = post.id;

        window.history.pushState(
          { theater: true },
          "",
          `${window.location.origin}/social/post/${post.id}?photo_id=${id}`
        );
      } else {
        this.$router.push(`social/post/${post.id}?photo_id=${id}`);
      }

      // Set data of modal detail
      // If post has 1 attachment -> show it to ModalDetail
      if (post.attachments.length === 1) {
        if (parentSharePost) {
          this.modalDetailPostId = null;

          // get data from api
          const getPost = await this.$axios.$get(
            `${ENDPOINT_POSTS}/${post.id}`
          );

          if (!getPost.error) {
            this.$store.commit(
              `social/modalPostDetail/${MUTATION_MODAL_POST_DETAIL.SET_POST}`,
              { ...(getPost.data || {}), $commentTree: [] }
            );
          }
        } else {
          this.modalDetailPostId = post.id;
        }
      } else {
        this.modalDetailPostId = id;
        await this.$store.dispatch(
          `social/modalPostDetail/${actionTypes.MODAL_POST_DETAIL.GET_POST}`,
          {
            postId: id,
            parentPostId: post.id,
          }
        );
      }

      this.modalDetailLoading = false;
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
        // const isTheater = document.location.search.includes("&theater");

        if (event.state.theater) {
          // this.modalDetailShow = true;
        } else {
          this.modalDetailShow = false;
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
          `${window.location.origin}/social/account/${this.uuidUser}`
        );
      }

      this.modalDetailShow = false;
      this.modalDetailParentPostId = null;
      this.modalDetailPostId = null;
      this.modalDetailSharedPost = {};
      this.modalDetailIndex = -1;
      this.modalDetailTotal = 0;
      this.modalDetailAttachment = {};
      this.$store.dispatch(
        `social/modalPostDetail/${actionTypes.MODAL_POST_DETAIL.CLEAR_POST}`
      );
    },

    /**
     * on click prev arrow on modal post detail -> get prev image info
     * @param { Number } index - index of attachment in parent post
     */
    handleClickPrev(index, total) {
      const prevAttachment = this.modalDetailParentPost.attachments[index - 1];
      this.handleClickImage(
        { ...prevAttachment, object: prevAttachment.type },
        index - 1,
        total,
        this.modalDetailParentPost
      );
    },

    /**
     * on click next arrow on modal post detail -> get next image info
     * @param { Number } index - index of attachment in parent post
     */
    handleClickNext(index, total) {
      const nextAttachment = this.modalDetailParentPost.attachments[index + 1];
      this.handleClickImage(
        { ...nextAttachment, object: nextAttachment.type },
        index + 1,
        total,
        this.modalDetailParentPost
      );
    },

    showModalConfirmDelete(id) {
      this.modalConfirmDelete = true;
      this.modalConfirmDeleteId = id;
    },

    hideModalConfirmDelete() {
      this.modalConfirmDelete = false;
      this.modalConfirmDeleteId = null;
    },

    editPost(post) {
      this.editPostSharedPost = post.payload || {};

      this.editPostInitialValues = {
        postId: post.id,
        htmlContent: post.text,
        link: post.link
          ? {
              url: post.link.url,
              detect: post.link.detect,
              siteName: post.link.site_name,
              title: post.link.title,
              description: post.link.description,
              imageUrl: post.link.image_url,
            }
          : {},
        tags: post.tags && post.tags.length ? post.tags : [],
        // checkIn: null,
        privacy: get(post, "privacy.scope", null),
        feeling: post.feeling || null,
      };

      this.editPostInitialPreviewList = post.attachments
        ? post.attachments.map((item) => ({
            type: ATTACHMENT_TYPES.IMAGE,
            src: item.url.medium,
          }))
        : [];

      this.editPostInitialFileList = post.attachments || [];

      this.showModalEditPost = true;
    },

    closeModalEditPost() {
      if (!this.modalEditPostLoading) {
        this.showModalEditPost = false;
        this.editPostInitialValues = {};
        this.editPostInitialPreviewList = [];
        this.editPostInitialFileList = [];
        this.editPostSharedPost = {};
      }
    },

    handleClickSaveEditPost() {
      this.$refs.editEditor && this.$refs.editEditor.submit();
    },

    async handleSubmitEditPost(data, clearData, setLoading) {
      try {
        setLoading(true);
        this.modalEditPostLoading = true;
        const postId = this.editPostInitialValues.postId;
        const { tags = [], privacy = {} } = data;
        const dataWithModel = { ...editPost(data) };
        const postTagIds = this.editPostInitialValues.tags.map(
          (item) => item.id
        );
        const isChangeTags = tags
          ? JSON.stringify(tags) !== JSON.stringify(postTagIds)
          : false;
        const newFiles = data.fileList.filter((item) => item instanceof File);

        // Upload new files
        if (newFiles.length) {
          const uploadMedia = await new MediaService(this.$axios).upload({
            targetId: postId,
            targetType: MEDIA_TARGET_TYPES.POST,
            fileList: newFiles,
          });

          if (uploadMedia.data && uploadMedia.data.length) {
            const uploadMediaFormated = uploadMedia.data.map((item) => ({
              type: item.type,
              url: item.path,
            }));

            let newAttachments = [];
            let index = 0;
            for (let i = 0; i < data.fileList.length; i++) {
              if (data.fileList[i] instanceof File) {
                newAttachments.push(uploadMediaFormated[index]);
                index++;
              } else {
                newAttachments.push({ id: data.fileList[i].id });
              }
            }

            dataWithModel.attachments = newAttachments;
          }
        } else {
          data.fileList.length &&
            (dataWithModel.attachments = data.fileList.map((item) => ({
              id: item.id,
            })));
        }

        const doEdit = async () =>
          await this.$store.dispatch(
            `social/account/timeline/${actionTypes.ACCOUNT_TIMELINE.EDIT_POST}`,
            { postId, model: dataWithModel }
          );

        const result = await Promise.all([
          doEdit(),
          isChangeTags &&
            this.editTagsOfPost({
              post: { id: postId },
              isParentPost: true,
              tags,
            }),
          privacy &&
            this.editPostInitialValues.privacy !== privacy.scope &&
            this.$store.dispatch(
              `social/account/timeline/${actionTypes.ACCOUNT_TIMELINE.EDIT_POST_PRIVACY}`,
              {
                postId,
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
          this.showModalEditPost = false;
        }

        setLoading(false);
        this.modalEditPostLoading = false;
      } catch (error) {
        setLoading(false);
        this.modalEditPostLoading = false;
        throw error;
      }
    },

    openModalShare(post) {
      this.shareData = post;
      this.$nextTick(() => {
        this.showModalShare = true;
      });
    },

    cancelShare() {
      this.showModalShare = false;
      this.shareData = {};
    },

    async sharePost(data, cb) {
      const dataWithModel = createPost(data);

      const doShare = await this.$store.dispatch(
        `social/account/timeline/${actionTypes.ACCOUNT_TIMELINE.ADD_POST}`,
        dataWithModel
      );

      if (!doShare.error) {
        this.cancelShare();
      } else {
        this.$toasted.error(doShare.error.message);
      }

      typeof cb === "function" && cb();
    },

    //
    //
    //
    //
    //
    /**
     * Infinite scroll handler
     */
    async feedInfiniteHandler($state) {
      const lastPostInFeed = this.posts[this.posts.length - 1]
        ? this.posts[this.posts.length - 1].id
        : null;
      const getData = await this.$store.dispatch(
        `social/account/timeline/${actionTypes.ACCOUNT_TIMELINE.GET_POSTS_INIFINITE}`,
        {
          uuid: this.$route.params.uuid,
          params: { from_post_id: lastPostInFeed },
        }
      );

      if (getData.data && getData.data.length) {
        $state.loaded();
      } else {
        if (this.posts.length) {
          $state.loaded();
        }
        $state.complete();
      }
    },

    /**
     * To Submit POST a post
     */
    async addPost(data, clearData, setLoading) {
      try {
        const type =
          data.fileList && data.fileList.length
            ? POST_TYPES.MEDIA
            : data.link && data.link.url
            ? POST_TYPES.LINK
            : POST_TYPES.TEXT;
        const link = data.link ? createPostLink(data.link) : null;
        const dataWithModel = { ...createPost({ ...data, type, link }) };

        this.postLoading = true;
        this.postEditorActive = false;

        // Upload attachments
        if (data.fileList && data.fileList.length) {
          const uploadMedia = await new MediaService(this.$axios).upload({
            targetType: MEDIA_TARGET_TYPES.POST,
            fileList: data.fileList,
          });

          if (uploadMedia.data && uploadMedia.data.length) {
            dataWithModel.id = uploadMedia.data[0].target_id;
            dataWithModel.attachments = uploadMedia.data.map((item) => ({
              type: item.type,
              url: item.path,
            }));
          }
        }

        const doAdd = await this.$store.dispatch(
          `social/account/timeline/${actionTypes.ACCOUNT_TIMELINE.ADD_POST}`,
          dataWithModel
        );

        if (!doAdd.error) {
          clearData();
        } else {
          this.$toasted.error(doAdd.error.message);
        }

        setLoading(false);
        this.postLoading = false;
      } catch (error) {
        throw error;
      }
    },

    /**
     * To DELETE a post
     */
    async deletePost(id) {
      this.modalConfirmDeleteLoading = true;
      const doDelete = await this.$store.dispatch(
        `social/account/timeline/${actionTypes.ACCOUNT_TIMELINE.DELETE_POST}`,
        id
      );

      if (doDelete.error) {
        this.$toasted.error(
          get(doDelete, "error.message", "Không xoá được bài viết")
        );
      }

      this.hideModalConfirmDelete();
      this.modalConfirmDeleteLoading = false;
    },

    /**
     * To remove Reaction a POST
     */
    async likePost(isLiked, post, emoji, cb) {
      const likeModel = createReaction(emoji);

      await this.$store.dispatch(
        `social/account/timeline/${
          isLiked
            ? actionTypes.ACCOUNT_TIMELINE.DELETE_LIKE_POST
            : actionTypes.ACCOUNT_TIMELINE.LIKE_POST
        }`,
        {
          parentPostId: post.main_post_id,
          postId: post.id,
          model: likeModel,
        }
      );

      // Have to run cb
      cb();
    },

    /**
     * To GET comment of post
     */
    async getComment(
      post,
      fromId,
      setIsFetchingComment,
      setIsCommentFetched,
      setShowViewMoreComment
    ) {
      setIsFetchingComment && setIsFetchingComment(true);

      const getComment = await this.$store.dispatch(
        `social/account/timeline/${actionTypes.ACCOUNT_TIMELINE.GET_COMMENT}`,
        {
          id: post.id,
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
     * To POST a comment to post
     */
    async postComment(post, { content, listTags, image, link }, clearEditor) {
      const model = createComment(content);

      const doPostComment = await this.$store.dispatch(
        `social/account/timeline/${actionTypes.ACCOUNT_TIMELINE.ADD_COMMENT}`,
        {
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
     * To EDIT a comment of post
     */
    async editComment({ postId, commentId, content }, cancelEdit) {
      const model = editComment(content);

      const doEdit = await this.$store.dispatch(
        `social/account/timeline/${actionTypes.ACCOUNT_TIMELINE.EDIT_COMMENT}`,
        {
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
     * To DELETE a comment of post
     */
    async deleteComment({ id, postId }) {
      const doDelete = await this.$store.dispatch(
        `social/account/timeline/${actionTypes.ACCOUNT_TIMELINE.DELETE_COMMENT}`,
        { id, postId }
      );

      if (doDelete.error) {
        this.$toasted.error(doDelete.error.message);
      }
    },

    /**
     * To LIKE a comment of post
     */
    async likeComment(isLiked, postId, parentCommentId, commentId, emoji, cb) {
      const model = createReaction(emoji);

      await this.$store.dispatch(
        `social/account/timeline/${
          isLiked
            ? actionTypes.ACCOUNT_TIMELINE.DELETE_LIKE_COMMENT
            : actionTypes.ACCOUNT_TIMELINE.LIKE_COMMENT
        }`,
        {
          postId,
          commentId,
          model,
        }
      );

      typeof cb === "function" && cb();
    },

    /**
     * To GET child comment list of post
     */
    async getChildComment(
      postId,
      commentId,
      fromId,
      setIsFetchingComment,
      setIsCommentFetched,
      setShowViewMoreComment
    ) {
      setIsFetchingComment && setIsFetchingComment(true);

      const doGet = await this.$store.dispatch(
        `social/account/timeline/${actionTypes.ACCOUNT_TIMELINE.GET_CHILD_COMMENT}`,
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
     * To POST a child comment of post
     */
    async postChildComment({ content, postId, commentId }, clearEditor) {
      const model = createComment(content);
      const doAction = await this.$store.dispatch(
        `social/account/timeline/${actionTypes.ACCOUNT_TIMELINE.ADD_CHILD_COMMENT}`,
        {
          postId,
          commentId,
          model,
        }
      );

      if (!doAction.error) {
        clearEditor();
      } else {
        this.$toasted.error(doAction.error.message);
      }
    },

    /**
     * To EDIT a child comment of post
     */
    async editChildComment(
      { postId, commentId, content, parentCommentId },
      cancelEdit
    ) {
      const model = editComment(content);

      const doEdit = await this.$store.dispatch(
        `social/account/timeline/${actionTypes.ACCOUNT_TIMELINE.EDIT_CHILD_COMMENT}`,
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
     * To DELETE a child comment of post
     */
    async deleteChildComment({ id, postId, parentCommentId }) {
      const doDelete = await this.$store.dispatch(
        `social/account/timeline/${actionTypes.ACCOUNT_TIMELINE.DELETE_CHILD_COMMENT}`,
        { id, postId, parentCommentId }
      );

      if (doDelete.error) {
        this.$toasted.error(doDelete.error.message);
      }
    },

    /**
     * To LIKE a child comment of post
     */
    async likeChildComment(
      isLiked,
      postId,
      parentCommentId,
      commentId,
      emoji,
      cb
    ) {
      const model = createReaction(emoji);
      const doLike = await this.$store.dispatch(
        `social/account/timeline/${
          isLiked
            ? actionTypes.ACCOUNT_TIMELINE.DELETE_LIKE_CHILD_COMMENT
            : actionTypes.ACCOUNT_TIMELINE.LIKE_CHILD_COMMENT
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
     * To edit tags of post
     */
    async editTagsOfPost({ post, isParentPost, tags }) {
      return isParentPost
        ? await this.$store.dispatch(
            `social/account/timeline/${actionTypes.ACCOUNT_TIMELINE.EDIT_POST_TAGS}`,
            {
              postId: post.id,
              tags,
            }
          )
        : await this.$store.dispatch(
            `social/modalPostDetail/${actionTypes.MODAL_POST_DETAIL.EDIT_POST_TAGS}`,
            {
              postId: post.id,
              mainPostId: post.main_post_id,
              tags,
            }
          );
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
        setLoading(true);
        const postTagIds = post.tags ? post.tags.map((item) => item.id) : [];
        const isChangeTags =
          JSON.stringify(tags) !== JSON.stringify(postTagIds);
        const model = editPost({
          text,
        });
        const doEdit = async () =>
          await this.$store.dispatch(
            isParentPost
              ? `social/account/timeline/${actionTypes.ACCOUNT_TIMELINE.EDIT_POST}`
              : `social/modalPostDetail/${actionTypes.MODAL_POST_DETAIL.EDIT_POST}`,
            {
              postId: post.id,
              childPath: `${post.main_post_id || ""}/children/${post.id}`,
              model,
            }
          );

        const result = await Promise.all([
          post.text !== text && doEdit(),
          isChangeTags && this.editTagsOfPost({ post, isParentPost, tags }),
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

    checkIsOwn() {
      if (this.modalDetailParentPost) {
        if (this.modalDetailParentPost.type === POST_TYPES.SHARE) {
          return (
            get(this.modalDetailPost, "payload.author.id") === this.uuidUser
          );
        } else {
          return this.modalDetailParentPost.author
            ? this.modalDetailParentPost.author.id === this.uuidUser
            : this.$route.params.uuid === this.uuidUser;
        }
      }

      if (this.modalDetailPost && this.modalDetailPost.author) {
        return this.modalDetailPost.author.id === this.uuidUser;
      }

      return this.$route.params.uuid === this.uuidUser;
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
