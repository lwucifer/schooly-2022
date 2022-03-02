<template>
  <div class="cc-panel bg-white mb-4">
    <div class="cc-panel__title">
      <h4 class="cc-panel__heading">
        Nội dung học tập
      </h4>
    </div>

    <div class="cc-panel__body">
      <div class="cc-box">
        <div class="cc-box__head">
          <div class="cc-box__head-left flex-grow">
            <EditLectureName :defaultName="get(this, 'general.name', '')" />
          </div>

          <div class="cc-box__head-right">
            <!-- <a
              class="d-flex align-items-center text-primary"
              v-if="isShowButtonAddLesson"
              @click="isShowButtonAddLesson = false"
              ><IconAdd width="14px" height="14px" class="mr-2" /> Thêm bài
              học</a
            > -->

            <button
              class="cc-box__btn cc-box__btn-collapse"
              @click="isShowDetailLesson = !isShowDetailLesson"
              v-if="get(lessons, 'length', 0)"
            >
              <IconAngleDown
                class="icon fill-primary"
                width="20px"
                height="20px"
                v-if="!isShowDetailLesson"
              />
              <IconAngleUp
                class="icon fill-primary"
                width="20px"
                height="20px"
                v-else
              />
            </button>
          </div>
        </div>

        <div class="cc-box__body" style="border-top: 1px solid #E0E0E0">
          <AddLesson
            v-if="!get(this, 'lessons.length', 0)"
            @toggleShowAddLesson="toggleShowAddLesson"
            :lesson="lesson"
          />

          <div v-if="isShowDetailLesson">
            <LessonDetail
              v-for="lesson in lessons"
              :key="lesson.id"
              :lesson="lesson"
              @handleEditLesson="handleEditLesson"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="create-action pt-5">
      <div class="create-action__right d-flex align-items-center">
        <!-- <app-button outline class="mr-4" color="error"
          ><IconDelete class="mr-2" /> Thiết lập lại</app-button
        >
        <app-button class="mr-4" color="primary" outline
          ><IconSave class="mr-2" /> Lưu nháp</app-button
        > -->
        <app-button class="create-action__btn mr-4" @click="handleNextStep"
          ><Forward class="mr-2" /> Lưu & Tiếp tục</app-button
        >
      </div>
    </div>
    <app-modal-confirm
      centered
      v-if="showModalConfirm"
      :confirmLoading="false"
      @ok="handleOk"
      @cancel="handleCancel"
      title="Xác nhận"
      description="Bạn có chắc chắn là đã hoàn thành xong nội dung học tập?"
    />
  </div>
</template>

<script>
import { getBase64 } from "~/utils/common";
import IconCamera from "~/assets/svg/design-icons/camera.svg?inline";
import IconEditAlt from "~/assets/svg/design-icons/edit-alt.svg?inline";
import IconAngleDown from "~/assets/svg/design-icons/angle-down.svg?inline";
import IconAngleUp from "~/assets/svg/design-icons/angle-up.svg?inline";
import IconPlus from "~/assets/svg/design-icons/plus.svg?inline";
const IconClose = () => import("~/assets/svg/icons/close.svg?inline");
const IconVideo = () => import("~/assets/svg/design-icons/video.svg?inline");
const IconFileBlank = () =>
  import("~/assets/svg/design-icons/file-blank.svg?inline");
const IconTrashAlt = () =>
  import("~/assets/svg/design-icons/trash-alt.svg?inline");
const IconCheck = () => import("~/assets/svg/design-icons/check.svg?inline");
const IconTimes = () => import("~/assets/svg/design-icons/times.svg?inline");
const IconAdd = () => import("~/assets/svg/v2-icons/add_green.svg?inline");
import IconDelete from "~/assets/svg/v2-icons/delete_sweep_2.svg?inline";
import IconSave from "~/assets/svg/v2-icons/save_24px.svg?inline";
import Forward from "~/assets/svg/v2-icons/forward_2.svg?inline";

import CreateAction from "~/components/page/course/create/common/CreateAction";
import AddLesson from "~/components/page/course/create/lecture/AddLesson";
import LessonDetail from "~/components/page/course/create/common/LessonDetail";
import { mapState } from "vuex";
import { useEffect, getParamQuery } from "~/utils/common";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
import { createPayloadAddCourse } from "~/models/course/AddCourse";
import EditLectureName from "~/components/page/course/create/lecture/EditLectureName";

export default {
  components: {
    IconCamera,
    IconClose,
    IconEditAlt,
    IconAngleDown,
    IconPlus,
    IconVideo,
    IconFileBlank,
    IconTrashAlt,
    IconCheck,
    IconTimes,
    CreateAction,
    AddLesson,
    LessonDetail,
    EditLectureName,
    IconAngleUp,
    IconAdd,
    IconDelete,
    IconSave,
    Forward,
  },

  data() {
    return {
      avatar: [],
      avatarSrc: null,
      tabType: "video",
      tabVideo: "upload",
      tabDocument: "typing",
      tabAddDocument: "upload",
      isShowDetailLesson: true,
      isEditCourseName: false,
      courseNameModel: "",
      lesson: null,
      showModalConfirm: false,
    };
  },

  watch: {
    lessons: {
      handler: function() {
        if (get(this, "lessons.length", 0)) {
          this.isShowDetailLesson = true;
          return;
        }
        this.isShowDetailLesson = false;
      },
      deep: true,
    },
    general: {
      handler: function() {
        // this.$store.dispatch(`elearning/create/getContent`);
        this.courseNameModel = get(this, "general.name", "");
      },
      deep: true,
    },
  },

  computed: {
    ...mapState("elearning/create", {
      general: "general",
      lessons: "lessons_lecture",
      progress: "progress",
    }),
    disabled_all() {
      return this.$store.getters["elearning/create/disabled_all"];
    },
    isNextStep() {
      if (get(this, "progress.general_status", false) != 1) return false;
      if (get(this, "progress.content_status", false) != 1) return false;
      return true;
    },
    name() {
      return get(this, "general.type", "") === "COURSE"
        ? "khoá học"
        : "bài giảng";
    },
  },

  methods: {
    get,

    handleCancel() {
      if (this.disabled_all) return;
      this.showModalConfirm = false;
    },

    handleOk() {
      this.showModalConfirm = false;
      if (this.disabled_all) return;
      this.$emit("nextStep", "settings");
    },

    handleNextStep() {
      if (this.disabled_all) {
        this.$toasted.error(`${this.name} đã đăng, không được phép sửa`);
        return;
      }
      if (!this.isNextStep) {
        this.$toasted.error(`Bạn chưa hoàn thiện hết nội dung ${this.name}`);
        return;
      }
      this.showModalConfirm = true;
    },

    async handleSaveCourseName() {
      if (this.disabled_all) return;
      const data = {
        name: this.courseNameModel,
        elearning_id: getParamQuery("elearning_id"),
      };
      const payload = createPayloadAddCourse(data);
      const result = await this.$store.dispatch(
        `elearning/create/${actionTypes.ELEARNING_CREATING_GENERAL.ADD}`,
        payload
      );

      if (get(result, "success", false)) {
        this.$toasted.success(get(result, "message", ""));
        this.isEditCourseName = false;
        const options = {
          params: {
            elearning_id: getParamQuery("elearning_id"),
          },
        };
        this.$store.dispatch(`elearning/create/getGeneral`, options);
        return;
      }
      this.$toasted.error(get(result, "message", ""));
    },

    handleHideEditNameCourse() {
      if (this.disabled_all) return;
      this.isShowButtonEditNameCourse = false;
    },

    handleShowEditNameCourse() {
      if (this.disabled_all) return;
      this.isShowButtonEditNameCourse = true;
    },

    getLesson() {
      this.$store.dispatch(`elearning/create/getContent`);
    },

    handleEditLesson(lesson) {
      if (this.disabled_all) return;
      this.isShowDetailLesson = false;
      this.lesson = lesson;
    },

    handleUploadChange(event) {
      if (this.disabled_all) return;
      this.avatar = Array.from(event.target.files);

      getBase64(this.avatar[0], (src) => {
        this.avatarSrc = src;
      });
    },

    removeAvatar() {
      if (this.disabled_all) return;
      this.avatar = [];
    },

    changeTabType(type) {
      if (this.disabled_all) return;
      this.tabType = type;
    },

    changeTabVideo(type) {
      if (this.disabled_all) return;
      this.tabVideo = type;
    },

    changeTabDocument(type) {
      if (this.disabled_all) return;
      this.tabDocument = type;
    },

    changeTabAddDocument(type) {
      if (this.disabled_all) return;
      this.tabAddDocument = type;
    },

    // handleAddLesson(e) {
    //   e.preventDefault();
    // },

    toggleShowAddLesson() {
      if (this.disabled_all) return;
      const elearning_id = getParamQuery("elearning_id");
      if (elearning_id && get(this, "lessons.length", 0)) {
        this.isShowDetailLesson = true;
        return;
      }
      this.isShowDetailLesson = false;
    },

    editCourseName() {
      if (this.disabled_all) return;
      this.isEditCourseName = true;
      this.courseNameModel = get(this.general, "name", "");

      const timeout = setTimeout(() => {
        this.$refs.inputCourseName.focus();
        clearTimeout(timeout);
      });
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/course/create/_create-learning-content.scss";
</style>
