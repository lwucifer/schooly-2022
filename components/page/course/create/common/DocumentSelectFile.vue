<template>
  <div class="cc-tab-panel">
    <app-upload
      accept=".doc, .docx, .pdf, .rtf , .txt, .csv, .xls, .xlsx, .ppt, .pptx, .zip"
      @change="handleSelectFile"
      class="clc-upload-video"
    >
      <!-- <div slot="hint" class="mt-2 caption">
        <b class="text-gray">Lưu ý:</b>
        <span class="text-sub">{{
          `Upload tài liệu bổ trợ cho bài giảng của bạn, dung lượng không quá 1GB cho 1 file`
        }}</span>
      </div> -->
    </app-upload>

    <p class="text-base caption mt-2">
      <span class="text-dark font-weight-semi-bold">Lưu ý:</span> Upload tài
      liệu bổ trợ cho bài học của bạn, dung lượng không quá 50MB cho 1 file
    </p>
  </div>
</template>

<script>
const IconClose = () => import("~/assets/svg/icons/close.svg?inline");
const IconTrashAlt = () =>
  import("~/assets/svg/design-icons/trash-alt.svg?inline");

export default {
  components: {
    IconClose,
    IconTrashAlt,
  },

  methods: {
    handleSelectFile(files) {
      this.$emit("handleSelectFile", files[0]);
    },
  },
};
</script>
