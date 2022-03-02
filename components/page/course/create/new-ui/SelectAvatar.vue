<template>
  <div class="cgi-form-group">
    <div class="cgi-upload-avt-preview">
      <template v-if="cropper">
        <span class="cgi-upload-avt-close-preview" @click.stop="removeImage" v-if="cropper">
          <IconClose />
        </span>
      </template>

      <app-upload
        accept=".jpg, .jpeg, .jpg, .bmp, .png"
        class="cgi-upload-avt"
        :fileList="[]"
        :inputText="false"
        :title="text"
        :disabled="!!cropper"
        @change="handleUploadChange"
      >
        <div>
          <img :src="default_image" alt class="d-block w-100" :id="id" />

          <div class="csa-text-desc">
            <a href="javascript:;" class="csa-text-desc__text text-info">Hình đại diện cho bài giảng</a>
            <v-popover
              class="csa-text-desc__popover"
              trigger="hover"
              popover-inner-class="tooltip-inner popover-inner csa-text-desc__popover-inner"
            >
              <IconQuestionFilled class="icon heading-3" />
              <template slot="popover">
                Để được chấp nhận, ảnh phải có kích thước nhỏ nhất là
                <strong>{{ minWidth }}x{{minHeight}}</strong> pixels. Định dạng cho
                phép là .jpg, .jpeg, .jpg, .bmp, hoặc .png. Chúng tôi khuyến cáo không
                nên chèn chữ lên hình ảnh đại diện.
                <strong>Việc tải lên ảnh này là bắt buộc</strong>.
              </template>
            </v-popover>
          </div>
        </div>
      </app-upload>

    </div>

    <div v-if="error || cropper" class="mt-4">
      <app-button
        v-if="cropper"
        size="md"
        :loading="savingCrop"
        :disabled="error"
        @click="saveCrop"
      >
        <IconCrop24px class="mr-2 fill-white" />Crop Ảnh
      </app-button>

      <div v-show="error" class="text-error caption">
        <IconExclamationTriangle class="icon mr-1" />
        Ảnh có thích thước quá
        nhỏ. Kích thước ảnh nhỏ nhất được chấp nhận là {{ minWidth }}x{{
        minHeight
        }}
        px. Hãy tải ảnh khác có kích thước lớn hơn.
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
import IconQuestionFilled from "~/assets/svg/icons/question-circle-filled.svg?inline";
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import { get } from "lodash";

export default {
  components: {
    IconClose,
    IconExclamationTriangle,
    IconCrop24px,
    IconQuestionFilled,
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
      default: "Bài giảng",
    },
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
    default: function () {
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
      this.cropper.getCroppedCanvas().toBlob(function (blob) {
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
