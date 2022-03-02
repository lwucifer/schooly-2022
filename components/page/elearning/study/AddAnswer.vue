<template>
  <div class="elearning-course-comment__input">
    <div class="main">
      <app-avatar :src="get(user_login, 'avatar.low', '')" :size="50" />
      <div class="editor-wrapper">
        <client-only>
          <editor-content :editor="editor" class="editor" />
        </client-only>

        <div class="actions">
          <button type="button">
            <IconCamera class="fill-999" />
          </button>
        </div>
      </div>
    </div>
    <div class="text-right">
      <app-button
        color="info"
        @click="cancel"
        size="xs"
        square
        class="btn-cancel"
        >Hủy</app-button
      >
      <app-button color="info" @click="save" size="xs" square class="color-999"
        >Phản hồi</app-button
      >
    </div>
  </div>
</template>

<script>
import { Editor, EditorContent } from "tiptap";
import { Placeholder, Heading } from "tiptap-extensions";
import EmojiButton from "@joeattardi/emoji-button";

import IconAddImage from "~/assets/svg/icons/add-image.svg?inline";
import IconEmoji from "~/assets/svg/icons/emoji.svg?inline";
import IconLike from "~/assets/svg/icons/like.svg?inline";
import IconCamera from "~/assets/svg/design-icons/camera.svg?inline";
import { mapState } from "vuex";
import { get } from "lodash";
import InteractiveAnswer from "~/services/elearning/study/InteractiveAnswer";

export default {
  components: {
    EditorContent,
    IconAddImage,
    IconEmoji,
    IconCamera,
    IconLike,
  },

  props: {
    tag: Object,
    reply: Boolean,
    question: Object,
  },

  data() {
    return {
      editor: null,
      submit: true,
      editorDefault: null,
      emojiPicker: null,
      testContent: "",
      name: this.tag && this.tag.name ? this.tag.name : "",
    };
  },

  computed: {
    classes() {
      return {
        "comment-editor--reply": this.reply,
      };
    },
    ...mapState("auth", { user_login: "token" }),
  },

  mounted() {
    // Init editor
    this.editor = new Editor({
      extensions: [
        new Heading({ levels: [4, 5, 6] }),
        new Placeholder({
          showOnlyCurrent: false,
          emptyNodeText: "Phản hồi",
        }),
      ],
      content:
        this.tag && this.tag.name
          ? `<p></p><h6>` + this.tag.name + `</h6>`
          : "",
    });

    // Init emoji picker
    this.emojiPicker = new EmojiButton({
      position: "top-end",
      zIndex: 9,
      autoHide: false,
    });

    this.emojiPicker.on("emoji", (emoji) => {
      const currentContent = this.editor.getHTML();
      console.log("currentContent", currentContent);
      console.log("emoji", emoji);
      this.editor.setContent(currentContent + emoji);
    });
  },

  beforeDestroy() {
    this.editor.destroy();
  },

  methods: {
    get,
    async save() {
      if (!this.submit) return;
      this.submit = false;
      const params = {
        content: this.editor
          .getHTML()
          .replace("<p>", "")
          .replace("</p>", ""),
        question_id: get(this, "question.id", ""),
      };
      const res = await new InteractiveAnswer(this.$axios)["addAnswerOfQuestion"](
        params
      );
      this.submit = true;
      if (get(res, "success", false)) {
        this.$emit("addAnswerSuccess");
        this.close();
        return;
      }
      this.$toasted.error(get(res, "message", "Có lỗi xảy ra"));
    },
    cancel() {
      this.close();
    },
    close() {
      this.editor.destroy();
      this.editor = new Editor({
        extensions: [
          new Heading({ levels: [4, 5, 6] }),
          new Placeholder({
            showOnlyCurrent: false,
            emptyNodeText: "Phản hồi",
          }),
        ],
        content:
          this.tag && this.tag.name
            ? `<p></p><h6>` + this.tag.name + `</h6>`
            : "",
      });
      this.$emit("close", false);
    },

    hanleShowEmojiPicker(event) {
      console.log("event", event);
      const { emojiPicker } = this;
      const button =
        event.target.tagName === "svg"
          ? event.target.parentElement
          : event.target;

      emojiPicker.pickerVisible
        ? emojiPicker.hidePicker()
        : emojiPicker.showPicker(button);
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/course/_elearning-comment.scss";
</style>
