<template>
  <div class="cc-tab-panel">
    <app-upload
      @change="handleSelectFile"
      class="clc-upload-video"
      :placeholder="placeholder"
      accept=".mp4, .f4v, .mov, .m4a, .m4v, .mp4a, .mp4v, .3gp, .3g2, .flv, .smil"
    >
    </app-upload>

    <p class="text-base mt-2 caption">
      <span class="text-gray font-weight-bold">Lưu ý:</span> Video phải có độ
      phân giải tối thiểu là 480p, dung lượng tối đa là 3GB.
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
      if (get(this, "lesson.type", "") === "VIDEO") {
        return get(this, "lesson.file_name", "Chưa có video nào được chọn");
      }
      return "Chưa có video nào được chọn";
    },
  },

  methods: {
    handleSelectFile(files) {
      const data = {
        type: "VIDEO",
        lesson: files[0],
      };
      this.$emit("handleSelectFile", data);
    },
    get,
  },
};
</script>
