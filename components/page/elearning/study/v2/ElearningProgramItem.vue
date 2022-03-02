<template>
  <div class="elearning-program-item-v2">
    <div class="row">
      <div class="col-md-1">
        <app-checkbox
          v-model="lessonStatus"
          :type="2"
          :style="{
            'pointer-events': isLessonCompleted ? 'none' : 'inherit'
          }"
          @click="isShowCompleteStudy = true"
        />
      </div>
      <div class="col-md-11">
        <a
          class="epiv__link"
          :class="lessonStatus ? 'active' : ''"
          @click="handleExitLesson"
          >{{ `${index}.` }} {{ get(lesson, "name", "") }}</a
        >
        <div class="row">
          <div class="col-md-6">
            <div
              class="d-flex align-items-center mt-4"
              v-if="lessonType == 'VIDEO'"
            >
              <IconPlayCircle class="icon  body-1 mr-3" />
              {{ durationTimes }}
            </div>
            <div
              class="d-flex align-items-center mt-4"
              v-else-if="lessonType == 'AUDIO'"
            >
              <IconHeadset24px class="icon  body-1 mr-3" />
              {{ durationTimes }}
            </div>
            <div
              class=" d-flex align-items-center mt-4"
              v-else-if="lessonType == 'SCORM'"
            >
              <IconGridV2 class="" />
              {{ durationTimes }}
            </div>
            <div class=" d-flex align-items-center mt-4" v-else>
              <IconNoteAlt class="icon  body-1 mr-3" />
              01:00
            </div>
          </div>
          <div class="col-md-6">
            <a
              class="d-flex align-items-center mt-4"
              :class="classExerciseStatus"
              v-if="get(lesson, 'exercises', 0)"
              v-scroll-to="'body'"
              @click.prevent="handleExitExercise"
            >
              <IconEditExercise class="body-1 mr-3" />
              Bài tập ({{ completeExecerciseRate }})
            </a>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-md-6">
            <app-dropdown
              class="e-program-item__download-tooltip"
              position="topRight"
              v-if="lesson_docs.length"
            >
              <a slot="activator" class="d-flex align-items-center">
                <IconDownArrow class="icon body-1 mr-3" />
                Tải tài liệu
              </a>
              <template>
                <div v-for="(link, index) in lesson_docs || []" :key="index" class="px-3 py-2">
                  <a
                    :href="link.url"
                    class="d-inline-flex align-items-center caption nowrap"
                    download
                    target="_blank"
                  >
                    <IconFileDownloadAlt class="icon body-1 text-info mr-2" />
                    {{ limitLetter(link.name, 40) }}
                  </a>
                </div>
              </template>
            </app-dropdown>
          </div>
        </div>
      </div>
    </div>

    <app-modal-confirm
      v-if="isShowCompleteStudy"
      title="Hoàn thành bài học"
      :footer="false"
      description="Bạn có chắc là bạn muốn hoàn thành bài học này?"
      @close="closeConfirmCompleteStudy"
      @cancel="closeConfirmCompleteStudy"
      @ok="handleCompleteStudy"
      :confirmLoading="loadingCompleteStudy"
    ></app-modal-confirm>

    <app-modal-notify
      v-if="notify.isShowNotify"
      :type="notify.type"
      title="Hoàn thành bài học"
      :description="notify.description"
      @close="notify.isShowNotify = false"
      @ok="notify.isShowNotify = false"
    />

    <app-modal-confirm
      centered
      v-if="isShowConfirmExit"
      title="Xác nhận thoát?"
      description="Bạn có chắc chắn muốn thoát? Hệ thống sẽ đánh trượt bài làm của bạn."
      @ok="handleGetOkExercises"
      @cancel="isShowConfirmExit = false"
    />

    <app-modal-confirm
      centered
      v-if="isShowConfirmExitLesson"
      title="Xác nhận thoát?"
      description="Bạn có chắc chắn muốn thoát? Hệ thống sẽ đánh trượt bài làm của bạn."
      @ok="handleOkStudy"
      @cancel="isShowConfirmExitLesson = false"
    />
  </div>
</template>

<script>
import IconPlayCircle from "~/assets/svg/design-icons/play-circle.svg?inline";
import IconHeadset24px from "~/assets/svg/v2-icons/headset_24px.svg?inline";
import IconGridV2 from "~/assets/svg/icons/grid-v2.svg?inline";
import IconNoteAlt from "~/assets/svg/icons/note-alt.svg?inline";
import IconEditExercise from "~/assets/svg/icons/edit-exercise.svg?inline";
import IconDownArrow from "~/assets/svg/design-icons/down-arrow.svg?inline";
import IconQuestionCircle from "~/assets/svg/design-icons/question-circle.svg?inline";

import { get } from "lodash";
import {
  getCountdown_MM_SS,
  limitLetter,
  redirectWithParams,
  getParamQuery
} from "~/utils/common";
import { STUDY_MODE, LESSION_TYPE, PAGE_SIZE, EXERCISE_CATEGORIES } from "~/utils/constants";
const parseManifest = require("xml-js");
import * as actionTypes from "~/utils/action-types";
import { mapActions, mapMutations, mapState } from "vuex";

import StudyService from "~/services/elearning/study/Study";
import ProgressService from "~/services/elearning/study/Progress";
import { ERRORS } from "~/utils/error-code";
const IconFileDownloadAlt = () =>
  import("~/assets/svg/design-icons/file-download-alt.svg?inline");


export default {
  components: {
    IconPlayCircle,
    IconHeadset24px,
    IconGridV2,
    IconNoteAlt,
    IconEditExercise,
    IconDownArrow,
    IconFileDownloadAlt
  },

  props: {
    lesson: {
      type: Object,
      default: () => {}
    },
    index: {}
  },

  data() {
    return {
      result: "FAILED", //PENDING, FAILED, PASSED,
      lessonStatus: false,
      isShowConfirmExitLesson: false,
      isShowCompleteStudy: false,
      isShowConfirmExit: false,
      notify: {
        type: "",
        description: "",
        isShowNotify: false
      },
      loadingCompleteStudy: false,
    };
  },

  mounted() {
    this.handleInitStudy();
  },

  computed: {
    ...mapState("elearning/study/study-exercise", ["isReloadExerciseList"]),
    ...mapState("event", ["studyMode"]),

    passedExercise() {
      return get(this.lesson, "passed", 0);
    },
    pendingExercise() {
      return get(this.lesson, "pending", 0);
    },
    failedExercise() {
      return get(this.lesson, "failed", 0);
    },
    workingExercise() {
      return get(this.lesson, "working", 0);
    },
    exercises() {
      return get(this.lesson, "exercises", 0);
    },
    completeExecerciseRate() {
      const totalExDid =
        this.passedExercise +
        this.pendingExercise +
        this.failedExercise +
        this.workingExercise;
      return `${totalExDid}/${this.exercises}`;
    },

    // return exercise-pending|exercise-passed|exercise-failed
    classExerciseStatus() {
      // debugger;
      if (this.passedExercise == this.exercises) {
        return "exercise-passed";
      } else if (this.failedExercise > 0 || this.workingExercise > 0) {
        return "exercise-failed";
      } else if (this.pendingExercise > 0) {
        return "exercise-pending";
      } else {
        return "exercise-pending";
      }
    },

    durationTimes() {
      const duration = get(this.lesson, "duration", 0);
      return getCountdown_MM_SS(duration);
    },
    lessonType() {
      return get(this.lesson, "type", "");
    },
    isLessonCompleted() {
      return !!get(this.lesson, "status", 0);
    },
    lesson_docs() {
      return get(this.lesson, "lesson_docs", []);
    }
  },
  methods: {
    ...mapActions("elearning/study/study-exercise", [
      "elearningSudyElearningExerciseList"
    ]),

    ...mapMutations("event", [
      "setStudyMode",
      "setPayload",
      "setExerciseLoading",
      "setStudyCategory"
    ]),
    ...mapMutations("elearning/study/study-exercise", [
      "setStudyExerciseCurrentLession"
    ]),
    ...mapMutations("elearning/study/study", [
      "setElearningStudyScormItems",
      "setElearningStudyScormItemActive"
    ]),

    handleExitExercise() {
      console.log("[handleExitExercise]");
      // need to confirm if user in mode DO_EXERCISE_DOING
      if (this.studyMode == STUDY_MODE.DO_EXERCISE_DOING) {
        this.isShowConfirmExit = true;
        return;
      } else {
        this.handleGetExercises();
      }
    },

    handleExitLesson() {
      console.log("[handleExitLesson]", this.studyMode);
      if (this.studyMode == STUDY_MODE.DO_EXERCISE_DOING) {
        this.isShowConfirmExitLesson = true;
        return;
      } else {
        this.handleStudy();
      }
    },

    handleOkStudy() {
      console.log("[handleOkStudy]")
      this.getProgress();
      this.handleStudy();
    },

    handleGetOkExercises() {
      this.getProgress();
      this.handleGetExercises();
    },

    async handleStudy() {
      this.isShowConfirmExitLesson = false;
      redirectWithParams({ lesson_id: get(this.lesson, "id", "") });

      // reset SET_SCORM_ITEM_ACTIVE, SET_SCORM_ITEMS
      // this.setElearningStudyScormItems([]);
      // this.setElearningStudyScormItemActive("");

      if (get(this.lesson, "type", "") === LESSION_TYPE.DOCS) {
        this.setStudyMode(STUDY_MODE.DOCS);
        this.setPayload(this.lesson);
        this.setExerciseLoading(false); // turnoff loading
        return;
      }

      if (get(this.lesson, "type", "") === LESSION_TYPE.ARTICLE) {
        this.setStudyMode(STUDY_MODE.ARTICLE);
        this.setPayload(this.lesson);
        this.setExerciseLoading(false); // turnoff loading
        return;
      }

      if (get(this.lesson, "type", "") === LESSION_TYPE.IMAGE) {
        this.setStudyMode(STUDY_MODE.IMAGE);
        this.setPayload(this.lesson);
        this.setExerciseLoading(false); // turnoff loading
        return;
      }

      if (get(this.lesson, "type", "") === LESSION_TYPE.VIDEO) {
        const elearning_id = get(this, "$router.history.current.params.id", "");
        const lesson_id = get(this.lesson, "id", "");
        const res = await new StudyService(this.$axios)["studyLesson"](
          elearning_id,
          lesson_id
        );
        if (get(res, "success", false)) {
          this.setStudyMode(STUDY_MODE.VIDEO_PLAYING);
          this.setPayload(get(res, "data", null));
          return;
        }
        this.$toasted.error(get(res, "message", "Có lỗi xảy ra"));
      }

      if (get(this.lesson, "type", "") === LESSION_TYPE.SCORM) {
        this.setStudyMode(STUDY_MODE.SCORM);
        this.fetchScormItems(
          `${process.env.BASE_ORIGIN_LOCATION}${this.lesson.link}`,
          this.setExerciseLoading
        );
        return;
      }

      if (get(this.lesson, "type", "") === LESSION_TYPE.AUDIO) {
        this.setStudyMode(STUDY_MODE.AUDIO_PLAYING);
        this.setPayload(this.lesson);
        return;
      }
    },

    // get list exercise of elearning lession
    async handleGetExercises() {
      console.log("[handleGetExercises]", this.lesson);
      this.isShowConfirmExit = false;

      const elearning_id = get(this, "$router.history.current.params.id", "");
      const lesson_id = get(this, "lesson.id", "");
      const category = EXERCISE_CATEGORIES.EXERCISE;
      const elearningReq = {
        elearning_id,
        lesson_id,
        category,
        size: PAGE_SIZE.MAXIMIZE,
      };

      this.setStudyMode(STUDY_MODE.DO_EXERCISE); // change display exercise list instead of video_playing
      // this.setStudyExerciseCurrentLession(this.lesson); // set current lesson to return list exercise after submission success
      this.elearningSudyElearningExerciseList(elearningReq); // get list exercises of lession
      this.setStudyCategory("EXERCISE");
    },

    async handleInitStudy() {
      console.log("[handleInitStudy]", this.isLessonCompleted);
      this.lessonStatus = this.isLessonCompleted;

      const elearning_id = getParamQuery("elearning_id");
      const category_type = getParamQuery("category_type");
      const lesson_id = getParamQuery("lesson_id");
      // go to lesson
      if (lesson_id && lesson_id === this.lesson.id && !elearning_id) {
        this.handleStudy(this.lesson);
        return;
        // window.scrollTo(0, 0);
      }

      // goto exercise of lesson
      if (elearning_id && category_type) {
        let exerciseReq = null;
        this.setStudyMode(STUDY_MODE.DO_EXERCISE);
        if (category_type == EXERCISE_CATEGORIES.EXERCISE) {
          exerciseReq = {
            elearning_id,
            category: category_type,
            lesson_id,
            size: PAGE_SIZE.MAXIMIZE
          };

          // this.setStudyExerciseCurrentLession({
          //   id: lesson_id
          // }); // set current lesson to return list exercise after submission success
        } else if (category_type == EXERCISE_CATEGORIES.TEST) {
          exerciseReq = {
            elearning_id,
            category: category_type,
            size: PAGE_SIZE.MAXIMIZE,
          };
          // this.setStudyExerciseCurrentLession(null);
        }

        console.log("[exerciseReq]", exerciseReq);
        await this.elearningSudyElearningExerciseList(exerciseReq);
      }
    },

    getProgress() {
      console.log("[getProgress]")
      const elearning_id = get(this, "$router.history.current.params.id", "");
      const options = {
        params: {
          elearning_id
        }
      };
      this.$store.dispatch(
        `elearning/study/study-progress/${actionTypes.ELEARNING_STUDY_PROGRESS.LIST}`,
        options
      );
    },

    async handleCompleteStudy() {
      const payload = {
        completed: true,
        lesson_id: get(this, "lesson.id", "")
      };
      this.loadingCompleteStudy = true;
      const res = await new ProgressService(this.$axios)["add"](payload);
      console.log("[handleCompleteStudy]", res);
      this.handleResultCompleteStudy(res);
      this.loadingCompleteStudy = false;

    },

    handleResultCompleteStudy(res) {
      console.log("[handleResultCompleteStudy]", res);
      // if false
      if (!get(res, "success", false)) {
        let msgErr = "Có lỗi xảy ra";
        switch (res.code) {
          case ERRORS.EXERCISE.MUST_COMPLETE_ALL_REQUIRED_EXERCISES:
            msgErr =
              "Bạn phải nộp bài tập bắt buộc trước khi hoàn thành bài học này";
            break;

          default:
            break;
        }
        this.lessonStatus = false;
        this.notify = {
          type: "warning",
          title: "Hoàn thành bài học",
          description: msgErr,
          isShowNotify: true
        };
      } else {
        this.getProgress();
      }

      // always do these things
      this.isShowCompleteStudy = false;
    },

    closeConfirmCompleteStudy() {
      this.isShowCompleteStudy = false;
      this.lessonStatus = false;
      // this.$refs.completedCheckbox.checked = false;
      console.log("[closeConfirmCompleteStudy]", this.$refs);
    },

    getProgress() {
      const elearning_id = get(this, "$router.history.current.params.id", "");
      const options = {
        params: {
          elearning_id
        }
      };
      this.$store.dispatch(
        `elearning/study/study-progress/${actionTypes.ELEARNING_STUDY_PROGRESS.LIST}`,
        options
      );
    },

    handleCheck(val) {
      this.check = val;
    },
    handleShowExercise() {
      this.$emit("showexercise");
      console.log("hello");
    },
    get,
    limitLetter
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/v2/_elearning-program-item.scss";
</style>
