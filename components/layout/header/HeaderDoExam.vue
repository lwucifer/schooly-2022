<template>
  <div class="the-header" v-sticky :sticky-z-index="100">
    <div class="the-header__content justify-content-between">
      <div class="header-do-exam-left">
        <div class="the-header__logo">
          <n-link to="/">
            <Logo />
          </n-link>
        </div>

        <h3 class="title-do-exam text-dark pl-4 font-weight-medium">
          <a href @click.prevent="handleExitExercise">
            <IconArrowBackIos class="icon d-block fill-primary mr-2" />
          </a>
          <span>{{ currentExercise.name }}</span>
        </h3>
      </div>

      <app-button color="primary" size="sm" @click="handleExitExercise">
        <IconClose class="icon mr-2" />Thoát
      </app-button>
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
import Logo from "~/assets/svg/logo/schoolly.svg?inline";
import IconArrowBackIos from "~/assets/svg/v2-icons/arrow_back_ios_24px.svg?inline";
import IconClose from "~/assets/svg/v2-icons/close_24px.svg?inline";

import { mapState, mapMutations } from "vuex";
import { ELEARNING_STUDY as ELEARNING_STUDY_MUTATION } from "~/utils/mutation-types";
import { STUDY_MODE } from "~/utils/constants";

export default {
  components: {
    Logo,
    IconArrowBackIos,
    IconClose,
  },

  data: () => ({
    isShowConfirmExit: false,
  }),

  computed: {
    ...mapState("elearning/study/study-exercise", ["currentExercise"]),
    ...mapState("event", ["studyMode"]),
  },

  methods: {
    // ...mapMutations("event", ["setStudyMode"]),
    ...mapMutations("elearning/study/study-exercise", [
      "setStudyExerciseAutoSubmission",
    ]),

    handleExitExercise() {
      console.log("[handleExitExercise] HeaderDoExam", this.studyMode);
      if (this.studyMode == STUDY_MODE.DO_EXERCISE_DOING) {
        this.isShowConfirmExit = true;
        return;
      } else {
        this.confirmExit();
      }
    },

    confirmExit() {
      this.isShowConfirmExit = false;
      this.setStudyExerciseAutoSubmission(new Date().getTime());

      // exit from full mode if has
      this.$store.commit(
        `elearning/study/study/${ELEARNING_STUDY_MUTATION.SET_FULLSCREEN}`,
        false
      );
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/the-header/_the-header.scss";
@import "~/assets/scss/components/account/_account-info-announcement-item.scss";

.title-do-exam {
  border-left: 1px solid #e0e0e0;
  display: inline-flex;
  align-items: center;
  max-width: calc(100% - 170px);

  > span {
    @include text-overflow;
  }
}

.header-do-exam-left {
  width: calc(100% - 100px);
}
</style>
