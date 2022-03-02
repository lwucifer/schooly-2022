<template>
  <div class="the-header the-header--course">
    <div class="container-fluid the-header__content">
      <div class="the-header__logo">
        <n-link to="/">
          <Logo />
        </n-link>
      </div>

      <app-divider
        class="the-header__divider"
        color="disabled"
        direction="vertical"
      />

      <h1 class="the-header__course-title">{{ title }}</h1>

      <div class="the-header__function-menu">
        <slot name="functionMenu"></slot>
      </div>

      <div class="the-header__right">
        <div class="d-flex-center">
          <div
            class="percent mr-3"
            :class="{ complete: processPercent == 100 }"
          >
            <svg viewBox="0 0 36 36" class="circular-chart">
              <path
                class="circle-bg circle"
                stroke-dasharray="100 100"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                class="circle"
                :stroke-dasharray="processPercent + ` 100`"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div class="percent-cup">
              <IconCup />
            </div>
          </div>

          <div class="header-dropbox">
            <div class="top">
              <strong class="color-primary">Tiến độ học tập</strong>
              <IconCaretDown class="fill-primary" height="10" width="10" />
            </div>
            <div class="content">
              <IconCaretUp class="fill-white icon-up" />
              <div>
                <IconDone class="icon heading-3 text-primary mr-3" />
                Đã hoàn thành
                {{ learningProgress }} bài học
              </div>
            </div>
          </div>
        </div>

        <app-button class="the-header-btn-exit" @click="handleExitExercise">
          <IconClose class="icon fill-opacity-1 mr-2" />Thoát
        </app-button>
      </div>
    </div>

    <app-modal-confirm
      centered
      v-if="isShowConfirmExit"
      title="Xác nhận thoát?"
      description="Bạn có chắc chắn muốn thoát? Hệ thống sẽ không ghi nhận bài làm của bạn."
      @ok="confirmExit"
      @cancel="isShowConfirmExit = false"
    />
  </div>
</template>

<script>
import IconCup from "~/assets/svg/icons/cup.svg?inline";
import IconCaretDown from "~/assets/svg/icons/caret-down.svg?inline";
import IconCaretUp from "~/assets/svg/icons/caret-up.svg?inline";
import IconDone from "~/assets/svg/v2-icons/done_24px.svg?inline";
import Logo from "~/assets/svg/logo/schoolly.svg?inline";
import IconClose from "~/assets/svg/v2-icons/close_24px.svg?inline";

import { mapState } from "vuex";
import { STUDY_MODE } from "~/utils/constants";
import { ELEARNING_STUDY as ELEARNING_STUDY_MUTATION } from "~/utils/mutation-types";

export default {
  components: {
    IconCup,
    IconCaretDown,
    IconCaretUp,
    IconDone,
    Logo,
    IconClose
  },

  props: {
    data: {}
  },

  data: () => ({
    showLogin: false,
    isShowConfirmExit: false
  }),
  methods: {
    redirectSignin() {
      this.$router.push("/auth/signin");
    },
    handleExitExercise() {
      console.log("[handleExitExercise] HeaderCourse", this.studyMode);
      if (this.studyMode == STUDY_MODE.DO_EXERCISE_DOING) {
        this.isShowConfirmExit = true;
        return;
      } else {
        this.isShowConfirmExit = false;
        this.$emit("exit");

        // exit from full mode if has
        this.$store.commit(
          `elearning/study/study/${ELEARNING_STUDY_MUTATION.SET_FULLSCREEN}`,
          false
        );
      }
    },

    confirmExit() {
      this.$emit("exit");
      // exit from full mode if has
      this.$store.commit(
        `elearning/study/study/${ELEARNING_STUDY_MUTATION.SET_FULLSCREEN}`,
        false
      );
    }
  },

  computed: {
    ...mapState("elearning/study/study-progress", ["progress"]),
    ...mapState("event", ["studyMode"]),

    learningProgress() {
      // console.log("[progress]", this.progress);
      if (!this.progress) return `0/0`;
      const completeLesson = this.progress.completes || 0;
      const totalLessons =
        this.progress.programs.reduce(
          (acc, curr) => acc + curr.total_lessons,
          0
        ) || 0;
      return `${completeLesson}/${totalLessons}`;
    },

    title() {
      const info = this.$store.state.elearning.study["study-info"].info;
      return info && info.name;
    },

    /**
     * processPercent = lessonPercent * 0.9 + testPercent * 0.1
     */
    processPercent() {
      if (!this.progress) return 0;
      const completeLesson = this.progress.completes || 0;
      if (!completeLesson) return 0;

      const totalLessons =
        this.progress.programs.reduce(
          (acc, curr) => acc + curr.total_lessons,
          0
        ) || 0;

      if (!totalLessons) return 0;
      const lessonPercent =
        Math.floor((completeLesson / totalLessons) * 100) * 0.9;

      let testPercent = 0;
      const { test_info } = this.progress;

      if (test_info && test_info.total) {
        testPercent =
          Math.floor((test_info.passed / test_info.total) * 100) * 0.1;
      } else {
        testPercent = 10; // donot have test
      }

      // console.log("[processPercent]", lessonPercent, testPercent);
      return lessonPercent + testPercent;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/header-frame/_header-frame.scss";
@import "~/assets/scss/components/header-course/_header-course.scss";
</style>
