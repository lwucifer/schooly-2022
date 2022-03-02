<template>
  <div class="account-photo-wrapper">
    <div class="account-photo-wrapper__top">
      <h2 class="account-photo-wrapper__title">
        Ảnh
        <!-- <span class="account-photo-wrapper__title-count">(500)</span> -->
      </h2>

      <app-upload
        v-if="$route.params.uuid === $store.getters['auth/uuidUser']"
        class="account-photo-wrapper__upload"
        accept="video/*, video/x-m4v, video/webm, video/x-ms-wmv, video/x-msvideo, video/3gpp, video/flv, video/x-flv, video/mp4, video/quicktime, video/mpeg, video/ogv, .ts, .mkv, image/*, image/heic, image/heif"
        multiple
        @change="handleUploadChange"
      >
        <span class="account-photo-wrapper__add">
          <IconAdd class="icon fill-opacity-1" />Thêm ảnh / video
        </span>
      </app-upload>
    </div>

    <AccountMenu class="mb-4" :menu="menu" />

    <slot />

    <app-modal
      v-model="modalPostEditor"
      title="Đăng bài"
      :component-class="{ 'account-photo-wrapper__modal': true }"
      :footer="false"
      :width="610"
      @close="!modalPostEditorBusy && closeModalPostEditor()"
    >
      <PostEditor
        slot="content"
        class="mb-0"
        :active="true"
        :initialFileList="initialFileList"
        :initialPreviewList="initialPreviewList"
        :show-avatar="false"
        :show-overlay="false"
        @submit="addPost"
      />
    </app-modal>
  </div>
</template>

<script>
import { getBase64 } from "~/utils/common";
import {
  POST_TYPES,
  ATTACHMENT_TYPES,
  MEDIA_TARGET_TYPES,
} from "~/utils/constants";
import * as actionTypes from "~/utils/action-types";
import { createPost, editPost } from "~/models/post/Post";
import { createPostLink } from "~/models/post/PostLink";
import MediaService from "~/services/social/Media";
import AccountMenu from "~/components/page/social/account/AccountMenu.vue";
import PostEditor from "~/components/page/timeline/postEditor/PostEditor";
import IconAdd from "~/assets/svg/v2-icons/add_24px.svg?inline";

export default {
  components: {
    AccountMenu,
    PostEditor,
    IconAdd,
  },

  data() {
    return {
      modalPostEditor: false,
      modalPostEditorBusy: false,
      initialFileList: [],
      initialPreviewList: [],
    };
  },

  computed: {
    menu() {
      const UUID = this.$route.params.uuid;
      return [
        {
          routePath: `/social/account/${UUID}/photos`,
          title: `Ảnh của bạn`,
        },
        {
          routePath: `/social/account/${UUID}/photos_tagged`,
          title: `Ảnh được gắn thẻ`,
        },
        {
          routePath: `/social/account/${UUID}/videos`,
          title: `Video`,
        },
      ];
    },
  },

  methods: {
    async handleUploadChange(fileList) {
      let previewList = [];
      const arrFileList = Array.from(fileList);

      for (let i = 0; i < arrFileList.length; i++) {
        const type = arrFileList[i].type.includes("image")
          ? ATTACHMENT_TYPES.IMAGE
          : arrFileList[i].type.includes("video")
          ? ATTACHMENT_TYPES.VIDEO
          : ATTACHMENT_TYPES.AUDIO;
        getBase64(arrFileList[i], (src) => {
          previewList.push({
            type,
            src,
          });
        });
      }
      this.initialPreviewList = previewList;
      this.initialFileList = arrFileList;

      this.$nextTick(() => {
        this.modalPostEditor = true;
      });
    },

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

        this.modalPostEditorBusy = true;

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
          this.$emit('add-post-success', doAdd.data || {});
          this.closeModalPostEditor();
        } else {
          this.$toasted.error(doAdd.error.message);
        }

        setLoading(false);
        this.modalPostEditorBusy = false;
      } catch (error) {
        throw error;
      }
    },

    closeModalPostEditor() {
      this.modalPostEditor = false;
      this.initialFileList = [];
      this.initialPreviewList = [];
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/social/account/account-photo-wrapper.scss";
</style>