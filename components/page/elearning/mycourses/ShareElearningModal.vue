<template>
  <app-modal width="606px" @close="$listeners.cancel ? $listeners.cancel() : null">
    <div class="d-flex" slot="header">
      <h3>Chia sẻ</h3>
      <app-select v-model="share" class="ml-auto" :options="shareOpts" size="sm">
        <IconAngleDown slot="placeholder-icon" class="icon" />
      </app-select>
    </div>

    <div slot="content">
      <editor-content class="editor pms-editor" :editor="editor" v-model="content" />

      <div class="wrap-post-elearning">
        <img
          :src="dataModal.avatar && dataModal.avatar.low ? dataModal.avatar.low : 'https://picsum.photos/530/297'"
        />
        <h3 class="mt-3">{{dataModal.name}}</h3>
        <p class="color-text mb-3" v-html="dataModal.description"></p>
        <a style="color: #656565;">SCHOOLY.COM</a>
      </div>
    </div>

    <div slot="footer" class="pms-footer">
      <div class="ml-auto">
        <app-button
          class="pms-footer__btn mr-4"
          size="sm"
          color="white"
          @click="$emit('cancel')"
        >Huỷ bỏ</app-button>
        <app-button
          class="pms-footer__btn"
          size="sm"
          color="primary"
          :loading="btnSubmitLoading"
          @click="submit"
          :disabled="true"
        >Chia sẻ</app-button>
      </div>
    </div>
  </app-modal>
</template>

<script>
import { get } from "lodash";
import { Editor, EditorContent } from "tiptap";
import { Placeholder } from "tiptap-extensions";

import { SHARE_OPTS, POST_TYPES } from "~/utils/constants";

import IconAngleDown from "~/assets/svg/design-icons/angle-down.svg?inline";
import IconUserGroup from "~/assets/svg/icons/user-group.svg?inline";
import IconPinLocation from "~/assets/svg/icons/pin-location.svg?inline";
import IconEmoji from "~/assets/svg/icons/emoji.svg?inline";

import Post from "~/components/page/timeline/post/Post";
import { clearEmptyTag } from "~/utils/validations";
import { removeTagHtml } from "~/utils/common";

export default {
  components: {
    IconAngleDown,
    EditorContent,
    IconUserGroup,
    IconPinLocation,
    IconEmoji,
    Post
  },

  props: {
    dataModal: {
      type: Object,
      default: () => ({})
      // validator: value =>
      //   [
      //     "post_id",
      //     "author",
      //     "created_at",
      //     "total_like",
      //     "total_comment",
      //     "content",
      //     "privacy"
      //   ].every(key => key in value)
    }
  },

  data() {
    return {
      editor: null,
      btnSubmitLoading: false,
      share: SHARE_OPTS.TIMELINE,
      shareOpts: [
        {
          value: SHARE_OPTS.TIMELINE,
          text: "Trên dòng thời gian của bạn"
        },
        {
          value: SHARE_OPTS.FRIEND,
          text: "Chia sẻ trên dòng thời gian của bạn bè"
        },
        {
          value: SHARE_OPTS.MESSAGE,
          text: "Chia sẻ trong tin nhắn riêng"
        }
      ],
      content: ""
    };
  },

  mounted() {
    this.editor = new Editor({
      content: "",
      extensions: [
        new Placeholder({
          showOnlyCurrent: true,
          showOnlyWhenEditable: true,
          emptyNodeText: "Nói gì đó về nội dung  ..."
        })
      ]
    });
  },

  methods: {
    submit() {
      const html = this.editor.getHTML();
      const content = removeTagHtml(html);
      this.$emit("submit", content);
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/post/_post-modal-share.scss";
.wrap-post-elearning {
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  padding: 20px;
  img {
    width: 100%;
  }
}
</style>
