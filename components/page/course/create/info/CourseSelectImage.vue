<template>
  <div class="cgi-form-group">
    <h2 class="cgi-form-title heading-5 mb-4">{{ title }}</h2>

    <div class="row csa-row">
      <div class="col csa-col csa-col--left mb-2">
        <div class="cgi-upload-avt-preview">
          <img
            :src="default_image"
            alt
            class="d-block w-100"
            :id="id"
          />
          <span
            class="cgi-upload-avt-close-preview"
            @click.stop="removeImage"
            v-if="cropper"
          >
            <IconClose />
          </span>
        </div>
      </div>

      <div class="col csa-col csa-col--right mb-4">
        <p class="csa-desc text-gray" v-if="isCompel">
          Để được chấp nhận, ảnh phải có kích thước nhỏ nhất là
          <strong>{{ minWidth }}x{{ minHeight }} </strong> pixels. Định dạng cho
          phép là .jpg, .jpeg, .jpg, .bmp, hoặc .png. Chúng tôi khuyến cáo không
          nên chèn chữ lên hình ảnh đại diện. <strong>Việc tải lên ảnh này là bắt buộc</strong> .
        </p>

        <p class="csa-desc text-gray" v-else>
          Bạn có thể tải lên hình ảnh minh họa cho {{ name }} của bạn. Hình ảnh
          minh họa phải có kích thước nhỏ nhất là
          <strong>{{ minWidth }}x{{ minHeight }} </strong> pixels. Định dạng cho
          phép là .jpg, .jpeg, .jpg, .bmp, hoặc .png. Việc tải lên ảnh này là
          không bắt buộc.
        </p>

        <div class="mt-4">
          <app-button
            v-if="cropper"
            size="md"
            :loading="savingCrop"
            :disabled="error"
            @click="saveCrop"
            ><IconCrop24px class="mr-2 fill-white" /> Crop Ảnh</app-button
          >

          <template v-else>
            <p class="mb-3 font-weight-normal">Chọn file đính kèm</p>

            <app-upload
              style="display: inline-block"
              accept=".jpg, .jpeg, .jpg, .bmp, .png"
              :fileList="[]"
              class="cgi-upload-avt mb-3"
              @change="handleUploadChange"
              :inputText="false"
              :title="text"
            ></app-upload>
          </template>

          <div v-show="error" class="text-error caption">
            <IconExclamationTriangle class="icon mr-1" />Ảnh có thích thước quá
            nhỏ. Kích thước ảnh nhỏ nhất được chấp nhận là {{ minWidth }}x{{
              minHeight
            }}
            px. Hãy tải ảnh khác có kích thước lớn hơn.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getBase64 } from "~/utils/common";
const IconClose = () => import("~/assets/svg/icons/close.svg?inline");
const IconExclamationTriangle = () =>
  import("~/assets/svg/design-icons/exclamation-triangle.svg?inline");
import { mapState } from "vuex";
import IconCrop24px from "~/assets/svg/v2-icons/crop_24px.svg?inline";
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import { get } from "lodash";

export default {
  components: {
    IconClose,
    IconExclamationTriangle,
    IconCrop24px,
  },

  computed: {
    ...mapState("elearning/create", {
      general: "general",
    }),
    text() {
      if (this.id === "avatar") {
        if (get(this, "general.avatar.low", "") || this.file) {
          return "Thay đổi ảnh";
        }
        return "Chọn file";
      }
      if (this.id === "cover") {
        if (get(this, "general.cover_url.low", "") || this.file) {
          return "Thay đổi ảnh";
        }
        return "Chọn file";
      }
    },
  },

  props: {
    default_image: "",
    minWidth: 0,
    minHeight: 0,
    title: "",
    id: "",
    isCompel: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      default: 'Bài giảng'
    }
  },

  data() {
    return {
      savingCrop: false,
      file: "",
      cropper: null,
      error: false,
    };
  },

  watch: {
    default: function() {
      if (this.default_image) {
        let image = document.getElementById(this.id);
        image.src = this.default_image;
      }
    },
  },

  methods: {
    blobToFile(theBlob, fileName) {
      var file = new File([theBlob], fileName);
      return file;
    },

    handleError() {
      this.pushFileToImage(this.file);
    },

    removeImage() {
      let image = document.getElementById(this.id);
      image.src = this.default_image;
      if (this.cropper) {
        this.cropper.destroy();
      }
      this.error = false;
      this.cropper = null;
      this.file = "";
      this.$emit("onSelectFile", "");
    },

    pushFileToImage(file) {
      if (file) {
        let image = document.getElementById(this.id);
        image.src = URL.createObjectURL(file);
        return image;
      }
      return "";
    },

    handleUploadChange(fileList, event) {
      const that = this;
      that.file = fileList[0];
      let image = this.pushFileToImage(that.file);
      if (!image) return;

      this.cropper = new Cropper(image, {
        aspectRatio: that.minWidth / that.minHeight,
        zoomable: false,
        movable: false,
        autoCropArea: 1,
        crop(event) {
          try {
            that.error = false;
            if (Math.ceil(event.detail.width) < that.minWidth)
              that.error = true;
            if (Math.ceil(event.detail.height) < that.minHeight)
              that.error = true;
          } catch (error) {
            console.log(error);
            that.error = false;
          }
        },
      });
    },

    saveCrop() {
      if (this.error) return;
      this.savingCrop = true;
      const that = this;
      this.cropper.getCroppedCanvas().toBlob(function(blob) {
        const file = that.blobToFile(blob, that.file.name);
        let image = document.getElementById(that.id);
        image.src = URL.createObjectURL(file);
        that.$emit("onSelectFile", file);
        that.cropper.destroy();
        that.cropper = null;
        that.savingCrop = false;
      });
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/course/_couse-select-avatar.scss";
</style>
