<template>
  <div class="post-editor-upload">
    <div class="post-editor-upload__list">
      <div v-for="(media, index) in previewList" :key="index" class="post-editor-upload__list-item">
        <img v-if="media.type === ATTACHMENT_TYPES.IMAGE" :src="media.src" alt />
        <app-video v-if="media.type === ATTACHMENT_TYPES.VIDEO" :src="media.src" />
        <span class="post-editor-upload__list-item-close" @click="handleClickClose(index)">
          <IconClose class="icon" />
        </span>
      </div>
    </div>
    <div class="post-editor-upload__control" @click="handleClickControl">
      <span role="button" tabindex="0" class="post-editor-upload__button">
        <input
          v-if="input"
          v-bind="$attrs"
          ref="inputFile"
          type="file"
          accept="video/*, video/x-m4v, video/webm, video/x-ms-wmv, video/x-msvideo, video/3gpp, video/flv, video/x-flv, video/mp4, video/quicktime, video/mpeg, video/ogv, .ts, .mkv, image/*, image/heic, image/heif"
          class="post-editor-upload__input"
          multiple
          @change="handleChange"
        />
      </span>
      <IconPlus class="icon" />
    </div>
  </div>
</template>

<script>
import { ATTACHMENT_TYPES } from "~/utils/constants";
import IconPlus from "~/assets/svg/design-icons/plus.svg?inline";
import IconClose from "~/assets/svg/icons/close.svg?inline";

export default {
  inheritAttrs: false,

  components: {
    IconClose,
    IconPlus,
  },

  props: {
    fileList: {
      type: Array,
      default: () => [],
    },
    previewList: {
      type: Array,
      default: () => [],
    },
    mode: {
      type: String,
      default: "add",
      validator: (value) => ["add", "edit"].includes(value),
    },
  },

  data() {
    return {
      input: true,
    };
  },

  created() {
    this.ATTACHMENT_TYPES = Object.freeze(ATTACHMENT_TYPES);
  },

  watch: {
    previewList(newValue, oldValue) {
      if (newValue.length >= oldValue.length) {
        this.$nextTick(() => {
          this.scrollToEnd();
        });
      }
    },
  },

  methods: {
    scrollToEnd() {
      this.$el.scrollLeft = this.$el.scrollWidth;
    },

    handleChange(e) {
      this.$emit("change", e);
      this.input = false;
      const timeout = setTimeout(() => {
        this.input = true;
        clearTimeout(timeout);
      });
    },

    handleClickControl() {
      this.$refs.inputFile.click();
    },

    handleClickClose(index) {
      this.$emit("remove-item", index, this.fileList[index]);
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/post-editor/_post-editor-upload.scss";
</style>