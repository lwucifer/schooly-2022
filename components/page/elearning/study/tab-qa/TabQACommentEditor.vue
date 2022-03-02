<template>
  <div class="tab-qa-comment-editor">
    <app-avatar :size="30" :src="get(user_login, 'avatar.low', '')" />

    <div class="tab-qa-comment-editor__right">
      <div class="tab-qa-comment-editor__editor-wrapper">
        <client-only>
          <editor-content
            :editor="editor"
            class="editor tab-qa-comment-editor__editor"
            v-model="payload.content"
          />
        </client-only>

        <app-upload
          :fileList="uploadFileList"
          accept="image/*, image/heic, image/heif"
          class="tab-qa-comment-editor__upload d-inline-block"
          @change="handleUploadChange"
        >
          <button class="tab-qa-comment-editor__btn">
            <IconCameraAlt class="icon d-block" />
          </button>
        </app-upload>
      </div>

      <!-- Upload Image -->
      <div v-if="uploadImgSrc" class="tab-qa-comment-editor__preview">
        <img :src="uploadImgSrc" alt />
        <span
          class="tab-qa-comment-editor__close-preview"
          @click.stop="removeImgUpload"
        >
          <IconClose class="icon" />
        </span>
      </div>
      
      <!-- End Upload Image -->
    </div>
    <app-button @click.prevent="submit" class="ml-10" size="sm">Gửi</app-button>
  </div>
</template>

<script>
import { Editor, EditorContent } from "tiptap";
import { Placeholder, HardBreak, Mention, History } from "tiptap-extensions";
import { EnterHandler } from "~/utils/tiptap-plugins";
import { getBase64 } from "~/utils/common";
import { get } from "lodash";
import IconCameraAlt from "~/assets/svg/v2-icons/camera_alt_24px.svg?inline";
const IconClose = () => import("~/assets/svg/icons/close.svg?inline");
import { mapState, mapMutations } from "vuex";
import InteractiveAnswer from "~/services/elearning/study/InteractiveAnswer";

export default {
  components: {
    IconCameraAlt,
    IconClose,
    EditorContent,
  },

  data() {
    return {
      editor: null,
      uploadFileList: [],
      uploadImgSrc: null,
      payload: {
        content: "",
        question_id: get(this, "question.id", ""),
      },
      image: "",
    };
  },

  watch: {
    question: {
      handler: function() {
        this.payload.question_id = get(this, "question.id", "");
      },
    },
  },

  props: {
    question: {},
  },

  computed: {
    classes() {
      return {
        "tab-qa-comment-item--level-2": this.level === 2,
      };
    },
    ...mapState("auth", { user_login: "token" }),
  },

  mounted() {
    // Init editor
    this.editor = new Editor({
      content: "",
      autoFocus: true,
      extensions: [
        new Placeholder({
          showOnlyCurrent: true,
          showOnlyWhenEditable: true,
          emptyNodeText: "Viết bình luận",
        }),
        new HardBreak(),
        new History(),
        new EnterHandler({
          onEnter: this.submit,
        }),
      ],
      onPaste: this.handleEditorPaste,
    });
  },

  methods: {
    ...mapMutations('elearning/teaching/interactive-answer', ['hideFrom']),
    reset() {
      this.editor.setContent("");
      this.payload.content = "";
      this.image = "";
      this.uploadFileList = [];
      this.uploadImgSrc = null;
    },
    handleUploadChange(fileList, event) {
      this.image = fileList[0];
      this.uploadFileList = Array.from(fileList);
      getBase64(this.uploadFileList[0], (src) => {
        this.uploadImgSrc = src;
      });
    },

    removeImgUpload() {
      this.image = "";
      this.uploadFileList = [];
      this.uploadImgSrc = null;

      if (this.mode === "edit") {
        this.isDeleteOldImg = true;
      }
    },

    handleEditorPaste(view, event, slice) {
      const { clipboardData } = event;

      if (clipboardData.files && clipboardData.files.length) {
        // Handle paste file here
        return;
      }
    },

    async submit() {
      this.payload.content = this.editor.getHTML().replace("<p></p>", "");
      let body = new FormData();
      body.append("content", this.payload.content);
      body.append("question_id", this.payload.question_id);
      if(this.image){
        body.append("image", this.image);
      }
      const res = await new InteractiveAnswer(this.$axios)["addAnswerOfQuestion"](
        body
      );
      if (res.success == true) {
        this.hideFrom();
        this.$toasted.success("Thành công");
        this.reset();
        const options = {
          params: {
            elearning_id: get(this, "$route.params.id", ""),
          },
        };
        setTimeout(() => {
          this.$store.dispatch(
            `elearning/study/detail/getListQuestion`,
            options
          );
        }, 500);
        
        return;
      }
      this.$toasted.error(get(res, "message", "Có lỗi xảy ra"));
    },

    get,
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/_tab-qa-comment-editor.scss";
</style>
