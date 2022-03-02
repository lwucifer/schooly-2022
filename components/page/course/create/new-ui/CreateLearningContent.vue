<template>
  <div>
    <!-- STEP 2 -->
    <div class="cc-panel bg-white mb-4">
      <div class="cc-panel__title">
        <h4 class="cc-panel__heading">Nội dung học tập</h4>
      </div>

      <div class="cc-panel__body">
        <div class="d-flex justify-content-between align-items-start mb-4">
          <h3 class="clc-title">Nội dung học tập</h3>
          <app-button
            size="sm"
            @click="showForm = 1"
            v-if="showForm == 0 && courseType == 'COURSE'"
          >
            <IconAddCircleOutline class="icon fill-opacity-1" />Tạo chương
          </app-button>
          <app-button
            size="sm"
            @click="handleShowForm"
            v-if="showForm == 0 && courseType == 'LECTURE'"
          >
            <IconAddCircleOutline class="icon fill-opacity-1" />Tạo bài học
          </app-button>
        </div>

        <!-- CHAPTER FORM -->
        <div v-if="showForm == 1" class="clc-create-chapper-wrapper">
          <CreateChapter @hide="showForm = 0" />
        </div>

        <!-- LESSON FORM -->
        <div v-if="showForm == 2" class="clc-create-chapper-wrapper">
          <AddLesson ref="addLesson" :chapter="currentChapter" :lesson="currentEditLesson" @hide="handleHideAddLesson"/>
        </div>

        <fragment v-if="courseType == 'LECTURE'">
          <LessonItem
            @create="handleAddLesson"
            v-for="(item, index) in lessons"
            :key="index"
            :lesson="item"
          />
        </fragment>

        <fragment v-else>
          <ChapperItem
            v-for="(item, index) in progressChapters"
            :key="index"
            :chapter="item"
            @create="handleAddLesson"
            @edit="handleEditChapter"
          />
        </fragment>
      </div>
    </div>
    <div class="d-flex justify-content-end create-action pt-3">
      <div class="create-action__right d-flex align-items-center" v-if="elearningApproved">
        <app-button class="mr-4" @click="handleRedirectCourses">Xác nhận</app-button>
      </div>
      <div class="create-action__right d-flex align-items-center" v-else>
        <app-button class="mr-4" @click="handleReqApprove" :disabled="disabledButton">Gửi duyệt</app-button>
        <app-button
          color="white"
          :disabled="disabledButton"
          @click="handleReqApproveAndCreateExercise"
        >Gửi duyệt và Tạo bài tập</app-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getBase64 } from "~/utils/common";
import IconAddCircleOutline from "~/assets/svg/v2-icons/add_circle_outline_24px.svg?inline";

import { mapState, mapActions } from "vuex";
import { useEffect, getParamQuery } from "~/utils/common";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
import { RESPONSE_SUCCESS } from "~/utils/config";

import ChapperItem from "~/components/page/course/create/new-ui/ChapperItem";
import LessonItem from "~/components/page/course/create/new-ui/LessonItem";
import EditCourseName from "~/components/page/course/create/course/EditCourseName";
import CreateChapter from "~/components/page/course/create/course/CreateChapter";
import AddLesson from "~/components/page/course/create/course/AddLesson";

export default {
  components: {
    IconAddCircleOutline,
    ChapperItem,
    CreateChapter,
    AddLesson,
    LessonItem,
  },

  data() {
    return {
      showForm: 0, // 0: default hide, 1: create chapter, 2: create lesson,
      isShowEditCourse: false,
      showModalConfirm: false,
      currentChapter: null,
      currentEditLesson: {}
    };
  },

  created() {},

  computed: {
    ...mapState("elearning/study/study-progress", ["programs"]),
    ...mapState("elearning/creating/creating-lesson", ["lessons"]),
    ...mapState("elearning/create", ["elearningDetail"]),
    name() {
      return get(this, "general.type", "") === "COURSE"
        ? "khoá học"
        : "bài giảng";
    },
    progressChapters() {
      return get(this, "programs", []);
    },
    courseType() {
      return getParamQuery("type");
    },
    disabledButton() {
      const btnDisabled =
        !(this.progressChapters && this.progressChapters.length > 0) &&
        !(this.lessons && this.lessons.length > 0);
      return btnDisabled;
    },
    elearningApproved() {
      return get(this, "elearningDetail.status", "PENDING") == "APPROVED";
    },
  },

  methods: {
    get,
    ...mapActions("elearning/creating/creating-publish", [
      "elearningCreatingPublishPost",
    ]),

    async handleReqApprove() {
      console.log("[handleReqApprove]");
      const elearning_id = getParamQuery("elearning_id");
      const result = await this.elearningCreatingPublishPost({ elearning_id });
      if (result.success == RESPONSE_SUCCESS) {
        this.$toasted.success("Gửi yêu cầu duyệt bài học thành công");
        this.$router.push(`/elearning/manager/courses`);
      } else {
        this.$toasted.error(result.message);
      }
    },

    handleReqApproveAndCreateExercise() {
      console.log("[handleReqApproveAndCreateExercise]");
      this.handleReqApprove().then((res) => {
        this.$router.push(`/elearning/manager/exams/create-exercise`);
      });
    },

    handleAddLesson(chapter) {
      console.log("[handleAddLesson]", chapter);
      this.showForm = 2;
      this.currentChapter = chapter;
      
      // window scroll to form and focus to name input
      this.$nextTick(() => {
        if (this.$refs.addLesson && this.$refs.addLesson.$el.scrollIntoView) {
          const { inputName = {} } = this.$refs.addLesson.$refs;
          this.$refs.addLesson.$el.scrollIntoView({
            block: 'center',
            behavior: 'smooth'
          });
          inputName && inputName.focus();
        }
      })
    },

    handleShowForm() {
      if (this.lessons && this.lessons.length == 0) {
        this.showForm = 2;
      } else {
        this.$toasted.error("Mỗi bài giảng chỉ có một bài học");
      }
    },

    handleRedirectCourses() {
      this.$router.push(`/elearning/manager/courses`);
    },

    handleEditChapter(lesson, chapter) {
      this.currentEditLesson = lesson;
      this.handleAddLesson(chapter);
    },

    handleHideAddLesson() {
      this.showForm = 0;
      this.currentChapter = null;
      this.currentEditLesson = {};
    }
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/course/create/_create-learning-content.scss";
</style>
