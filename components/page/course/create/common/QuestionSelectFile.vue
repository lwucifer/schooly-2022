<template>
  <div>
    <div v-if="isEdit" class="d-flex align-items-center">
      <div>{{ fileName }}</div>
      <div class="text-sub ml-2" style="font-size: 11px;">
        {{ fileSize | fileSizeFilter }}
      </div>
      <button class="ml-2" @click="handleCloseUpload">
        <IconCloseSquare />
      </button>
    </div>
    <app-upload
      @change="handleUpload"
      class="text-primary"
      style="display: inline-block;"
      :multiple="false"
      v-else
      accept="image/*,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.txt,.pptx,.ppt"
    >
      <div class="d-flex align-items-center">
        <IconCloudDownload24px class="icon fill-opacity-1 body-1 mr-2" />
        Tải lên câu hỏi
      </div>
    </app-upload>
  </div>
</template>

<script>
import IconCloudDownload24px from "~/assets/svg/v2-icons/cloud_download_24px.svg?inline";
import { get } from "lodash";
import IconCloseSquare from "~/assets/svg/icons/close-square.svg?inline";

export default {
  components: {
    IconCloudDownload24px,
    IconCloseSquare,
  },

  computed: {
    fileName() {
      let name =
        get(this, "file.name", "") || get(this, "question.name_file", "");
      if (name.length > 30) return name.substring(0, 30) + "...";
      return name;
    },
    fileSize() {
      return get(this, "file.size", 0) || get(this, "question.size", "");
    },
  },

  props: {
    question: {},
  },

  data() {
    return {
      file: null,
      isEdit: this.file || get(this, "question.name_file", ""),
    };
  },

  methods: {
    handleUpload(data) {
      this.isEdit = true;
      this.file = data[0];
      this.$emit("onChange", this.file);
    },
    handleCloseUpload() {
      this.isEdit = false;
      this.file = null;
      this.$emit("onChange", this.file);
    },
    get,
  },
};
</script>
