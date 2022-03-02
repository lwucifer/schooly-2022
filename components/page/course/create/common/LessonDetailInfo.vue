<template>
  <div class="clc-video">
    <div class="clc-video__image">
      <img :src="thumnail" alt />
    </div>

    <div class="clc-video__right w-100">
      <div class="d-flex justify-content-between clc-video__name">
        <p class="mb-3">
          <span class="heading-6 mb-3 font-weight-bold"
            >Bài {{ index + 1 + ": " }}</span
          >
          <span>
            {{
              get(lesson, "name", "").length > 60
                ? get(lesson, "name", "").slice(0, 40) + "..."
                : get(lesson, "name", "")
            }}
          </span>
        </p>

        <div class="clc-video__actions">
          <a
            href
            class="clc-video__btn-edit text-primary mr-2"
            @click="handleEditLesson($event)"
          >
            <IconEdit class="icon" style="width: 18px; height: 18px" />
          </a>
          <a
            href
            class="clc-video__btn-delete text-secondary"
            @click="handleDeleteLesson($event)"
          >
            <IconTrashAlt class="icon" />
          </a>
        </div>
      </div>

      <div class="clc-video__type text-dark mt-2" v-if="showFileName">
        {{ fileName }}
      </div>

      <div class="clc-video__type text-dark mt-2" v-else>
        {{ get(lesson, "type", "") }}
      </div>

      <div class="clc-video__time text-gray mb-3 mt-3">
        <IconClock width="15px" height="15px" class="mr-2" />
        {{ duration }}
      </div>
    </div>

    <app-modal-confirm
      centered
      v-if="showModalConfirm"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      title="Xác nhận"
      @cancel="handleCancelModal"
      description="Bạn có chắc chắn muốn xóa bài học này?"
    />
  </div>
</template>

<script>
import IconEdit from "~/assets/svg/v2-icons/edit.svg?inline";
const IconTrashAlt = () =>
  import("~/assets/svg/design-icons/trash-alt.svg?inline");
import IconClock from "~/assets/svg/icons/clock.svg?inline";
import { mapState } from "vuex";
import { get } from "lodash";
import * as actionTypes from "~/utils/action-types";

export default {
  components: {
    IconEdit,
    IconTrashAlt,
    IconClock,
  },

  props: {
    lesson: {
      type: Object,
      default: null,
    },
    index: {
      type: Number,
      default: null,
    },
  },

  computed: {
    fileName() {
      return get(this, "lesson.file_name", "").length > 60
        ? get(this, "lesson.file_name", "").slice(0, 60) +
            "..." +
            get(this, "lesson.format", "").toLowerCase()
        : get(this, "lesson.file_name", "");
    },

    duration() {
      if (+get(this, "lesson.is_upload", 2) === 0) {
        return "Đang cập nhật";
      }
      if (+get(this, "lesson.is_upload", 2) === -1) {
        return "Upload file thất bại";
      }
      return get(this, "lesson.duration", "");
    },

    disabled_all() {
      return this.$store.getters["elearning/create/disabled_all"];
    },

    thumnail() {
      switch (get(this, "lesson.type", "")) {
        case "DOCS":
          return "/images/thumnail-doc.png";
          break;
        case "AUDIO":
          return "/images/thumnail-audio.jpg";
          break;
        case "VIDEO":
          return "/images/thumnail-video.jpg";
          break;
        case "SCORM":
          return "/images/thumnail-scorm.jpg";
          break;
        default:
          return "/images/thumnail-doc.png";
      }
    },

    showFileName() {
      return (
        get(this, "lesson.type", "") === "VIDEO" ||
        get(this, "lesson.type", "") === "DOCS" ||
        get(this, "lesson.type", "") === "AUDIO" ||
        get(this, "lesson.type", "") === "SCORM"
      );
    },
  },

  data() {
    return {
      showModalConfirm: false,
      confirmLoading: false,
    };
  },

  methods: {
    handleEditLesson($event) {
      $event.preventDefault();
      if (this.disabled_all) return;
      this.$emit("handleEditLesson", this.lesson);
    },

    async handleDeleteLesson($event) {
      $event.preventDefault();
      if (this.disabled_all) return;
      this.showModalConfirm = true;
    },

    async handleOk() {
      if (this.disabled_all) return;
      this.confirmLoading = true;
      const options = {
        data: {
          id: get(this, "lesson.id", ""),
        },
      };
      const res = await this.$store.dispatch(
        `elearning/creating/creating-lesson/${actionTypes.ELEARNING_CREATING_LESSONS.DELETE}`,
        options
      );

      this.handleCancelModal();

      if (get(res, "success", false)) {
        this.$toasted.success(get(res, "message", "Thành công"));
        this.$store.dispatch(`elearning/create/getContent`);
        // this.$store.dispatch(`elearning/create/getProgress`);
        return;
      }
      this.$toasted.error(get(res, "message", "Có lỗi xảy ra"));
    },

    handleCancelModal() {
      if (this.disabled_all) return;
      this.showModalConfirm = false;
      this.confirmLoading = false;
    },

    get,
  },
};
</script>
