<template>
  <div class="cc-tab-panel">
    <app-upload
      @change="handleSelectFile"
      class="clc-upload-video"
      :placeholder="placeholder"
      accept=".zip"
    >
    </app-upload>

    <p class="text-base mt-2 caption">
      <span class="text-gray font-weight-bold">Lưu ý:</span> Upload bài học theo
      đúng chuẩn SCORM, dung lượng tối đa là 3GB.
    </p>
  </div>
</template>

<script>
import { get } from "lodash";

export default {
  props: {
    lesson: {},
  },

  computed: {
    placeholder() {
      if (get(this, "lesson.type", "") === "SCORM") {
        return get(this, "lesson.file_name", "Chưa có scorm nào được chọn");
      }
      return "Chưa có scorm nào được chọn";
    },
  },

  methods: {
    handleSelectFile(files) {
      const data = {
        type: "SCORM",
        lesson: files[0],
      };
      this.$emit("handleSelectFile", data);
    },
    get,
  },
};
</script>
