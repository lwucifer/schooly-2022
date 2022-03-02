<template>
  <div class="clc-type-tab-panel">
    <div class="cc-tabs">
      <a
        href
        class="cc-tab-item"
        :class="{ active: tabVideo === 'upload' }"
        @click.prevent="changeTabVideo('upload')"
        >Upload bài học</a
      >

      <a
        href
        class="cc-tab-item"
        :class="{ active: tabVideo === 'choose' }"
        @click.prevent="changeTabVideo('choose')"
        >Chọn từ kho học liệu</a
      >
    </div>

    <LessonSelectFileScorm
      @handleSelectFile="handleSelectFile"
      :lesson="lesson"
      v-if="tabVideo === 'upload'"
    />

    <DocumentSelectDoc
      @handleSelectUrl="handleSelectUrl"
      v-if="tabVideo === 'choose'"
      type="SCORM"
    />
  </div>
</template>

<script>
const IconTrashAlt = () =>
  import("~/assets/svg/design-icons/trash-alt.svg?inline");
import LessonSelectFileScorm from "~/components/page/course/create/common/LessonSelectFileScorm";
import DocumentSelectDoc from "~/components/page/course/create/common/DocumentSelectDoc";

export default {
  components: {
    IconTrashAlt,
    LessonSelectFileScorm,
    DocumentSelectDoc,
  },

  data() {
    return {
      tabVideo: "upload",
    };
  },

  props: {
    lesson: {},
  },

  methods: {
    changeTabVideo(type) {
      this.$emit("handleReset");
      this.tabVideo = type;
    },

    handleSelectFile(data) {
      this.$emit("handleSelectFile", data);
    },

    handleSelectUrl(file) {
      this.$emit("handleSelectUrl", file);
    },
  },
};
</script>
