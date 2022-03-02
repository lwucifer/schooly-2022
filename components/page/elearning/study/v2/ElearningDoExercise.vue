<template>
  <fullscreen :fullscreen.sync="fullscreen">
    <div class="do-exam-wrapper">
      <div v-if="studyMode != submissionMode">
        <div class="do-exam-questions">
          <div
            class="do-exam-questions__title--expand"
            v-if="isExpand || fullscreen"
          >
            <h4>Câu hỏi {{ orderOfQuestion }}:</h4>

            <div class="d-flex align-items-center">
              <div class="countdown-time">
                <p>
                  <span>{{ countdowns[0] }}</span> Giờ
                </p>

                <p>
                  <span>{{ countdowns[1] }}</span> Phút
                </p>

                <p>
                  <span>{{ countdowns[2] }}</span> Giây
                </p>
              </div>

              <div class="list-question" @click="showList = true">
                <div class="body-1">
                  Danh sách câu hỏi
                  <IconKeyboardArrowDown24px
                    class="icon ml-2 fill-primary vertical-middle"
                  />
                </div>
                <ListQuestionSide
                  class="exercise-menu-list-question"
                  v-click-outside="handleCloseList"
                  v-if="showList"
                />
              </div>
              <div class="btn-download-exercise">
                <a class="d-flex align-items-center">
                  <IconDownArrow
                    height="18"
                    width="18"
                    class="fill-primary mr-3"
                  />
                  Tải câu hỏi
                </a>
              </div>
            </div>
          </div>

          <h4 class="do-exam-questions__title" v-else>
            Câu hỏi {{ orderOfQuestion }}:
          </h4>
          <QuestionTrueFalse
            v-if="currentQuestionType == 'YES_NO'"
            :questionChange="isChangeQuestion"
            :class="{ 'height-vh': fullscreen }"
          />
          <QuestionSingleChoice
            v-else-if="currentQuestionType == 'SINGLE_CHOICE'"
            :questionChange="isChangeQuestion"
            :class="{ 'height-vh': fullscreen }"
          />
          <QuestionMultiChoice
            v-if="currentQuestionType == 'MULTIPLE_CHOICE'"
            :questionChange="isChangeQuestion"
            :class="{ 'height-vh': fullscreen }"
          />
          <QuestionFillinBlank
            v-else-if="currentQuestionType == 'FILL_IN_BLANK'"
            :questionChange="isChangeQuestion"
            :class="{ 'height-vh': fullscreen }"
          />
          <QuestionChoiceWord
            v-else-if="currentQuestionType == 'WORD_CHOICE'"
            :questionChange="isChangeQuestion"
            :class="{ 'height-vh': fullscreen }"
          />
          <QuestionEssay
            v-else-if="currentQuestionType == 'ESSAY'"
            :questionChange="isChangeQuestion"
            :class="{ 'height-vh': fullscreen }"
          />
          <QuestionJoinAnswer
            v-else-if="currentQuestionType == 'WORD_MATCH'"
            :questionChange="isChangeQuestion"
            :class="{ 'height-vh': fullscreen }"
          />
          <div class="loading-question" v-else-if="!currentQuestionType">
            <VclList/>
          </div>
          <div class="do-exam-questions__content">
            <div class="view-question text-right">
              <a @click.prevent="toggleExpand"
                ><IconCropLandspace class="mr-2"
              /></a>
              <a @click.prevent="toggleFull"><IconCropFree /></a>
            </div>
          </div>
        </div>
        <div class="mt-4 d-flex align-items-center" v-if="this.fullscreen || this.expand">
          <app-button
            color="default"
            outline
            class="text-primary w-120 mr-3"
            @click.prevent="handleQuestionBack"
            :disabled="isDisableBack"
          >
            <IconArrowLeft class="mr-2" />Quay lại
          </app-button>

          <app-button
            color="primary"
            class="w-120"
            @click.prevent="handleQuestionContinue"
            :disabled="isDisableNext"
          >
            Tiếp tục <IconArrowRight class="ml-2" />
          </app-button>
          <app-button
            class="btn-send-expend"
            @click="handleSubmission"
          >
            <IconSend class="icon mr-2" /> NỘP BÀI
          </app-button>
        </div>
        <div class="mt-4 d-flex align-items-center justify-content-end" v-else>
          <app-button
            color="default"
            outline
            class="text-primary w-120 mr-3"
            @click.prevent="handleQuestionBack"
            :disabled="isDisableBack"
          >
            <IconArrowLeft class="mr-2" />Quay lại
          </app-button>

          <app-button
            color="primary"
            class="w-120"
            @click.prevent="handleQuestionContinue"
            :disabled="isDisableNext"
          >
            Tiếp tục <IconArrowRight class="ml-2" />
          </app-button>
        </div>
      </div>
      <div v-else>
        <ElearningExerciseSubmitSuccess />
      </div>

    </div>
  </fullscreen>
</template>

<script>
import IconCropLandspace from "~/assets/svg/v2-icons/crop_landscape_2.svg?inline";
import IconCropFree from "~/assets/svg/v2-icons/crop_free_24px.svg?inline";
import IconArrowLeft from "~/assets/svg/design-icons/arrow-left.svg?inline";
import IconArrowRight from "~/assets/svg/design-icons/arrow-right.svg?inline";
import IconKeyboardArrowDown24px from "~/assets/svg/v2-icons/keyboard_arrow_down_24px.svg?inline";
import IconKeyboardArrowUp24px from "~/assets/svg/v2-icons/keyboard_arrow_up_24px.svg?inline";
import IconDownArrow from "~/assets/svg/design-icons/down-arrow.svg?inline";
import IconSend from "~/assets/svg/v2-icons/send_24px.svg?inline";

import ListQuestionSide from "~/components/page/elearning/study/v2/ListQuestionSide";
import QuestionTrueFalse from "~/components/page/elearning/study/v2/question/QuestionTrueFalse";
import QuestionSingleChoice from "~/components/page/elearning/study/v2/question/QuestionSingleChoice";
import QuestionMultiChoice from "~/components/page/elearning/study/v2/question/QuestionMultiChoice";
import QuestionFillinBlank from "~/components/page/elearning/study/v2/question/QuestionFillinBlank";
import QuestionChoiceWord from "~/components/page/elearning/study/v2/question/QuestionChoiceWord";
import QuestionEssay from "~/components/page/elearning/study/v2/question/QuestionEssay";
import QuestionJoinAnswer from "~/components/page/elearning/study/v2/question/QuestionJoinAnswer";
import ElearningExerciseSubmitSuccess from "~/components/page/elearning/study/v2/exercise/ElearningExerciseSubmitSuccess";
import { VclList } from "vue-content-loading";

import { mapState, mapGetters, mapMutations } from "vuex";
import { get } from "lodash";
import { QUESTION_NAV } from "~/utils/constants";
import { formatCountdown } from "~/utils/moment";
import { STUDY_MODE } from "~/utils/constants";

export default {
  components: {
    IconCropLandspace,
    IconCropFree,
    IconArrowLeft,
    IconArrowRight,
    IconKeyboardArrowDown24px,
    IconKeyboardArrowUp24px,
    IconDownArrow,
    ListQuestionSide,
    QuestionTrueFalse,
    QuestionSingleChoice,
    QuestionMultiChoice,
    QuestionFillinBlank,
    QuestionChoiceWord,
    QuestionEssay,
    QuestionJoinAnswer,
    ElearningExerciseSubmitSuccess,
    IconSend,
    VclList
  },

  props: {
    isExpand: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapState("elearning/study/study-exercise", [
      "currentExerciseQuestion",
      "currentExerciseAnswers",
      "currentExercise"
    ]),
    ...mapGetters("elearning/study/study-exercise", [
      "orderOfQuestion",
      "currentQuestionIndex",
      "numOfQuestion"
    ]),
    ...mapState("event", ["studyMode", "minutes"]),
    ...mapState("elearning/study/study-exercise", ["changeQuestion"]),

    currentQuestionType() {
      return get(this.currentExerciseQuestion, "type", "");
    },

    isDisableBack() {
      // console.log("[isDisableBack]", this.currentQuestionIndex);
      return this.currentQuestionIndex <= 1;
    },

    isDisableNext() {
      return this.currentQuestionIndex >= this.numOfQuestion;
    },

    countdowns() {
      const duration = get(this, "minutes", 0);
      const str = formatCountdown(duration).split("-");
      return str;
    }
  },

  data() {
    return {
      expand: false,
      fullscreen: false,
      showList: false,
      submissionMode: STUDY_MODE.SUBMISSION_SUCCESS,
      isChangeQuestion: null,
      modalConfirmSubmit: false,
      loadingSubmit: false
    };
  },

  methods: {
    ...mapMutations("elearning/study/study-exercise", [
      "setStudyExerciseQuestionNav"
    ]),

    handleSubmission() {
      console.log("[handleSubmission]");
      this.fullscreen = false;
      this.$emit("submission");
    },

    handleQuestionBack() {
      this.setStudyExerciseQuestionNav(QUESTION_NAV.BACK);
    },

    handleQuestionContinue() {
      this.setStudyExerciseQuestionNav(QUESTION_NAV.NEXT);
    },

    toggleExpand() {
      this.expand = !this.expand;
      this.$emit("expand", this.expand);
    },

    toggleFull() {
      this.fullscreen = !this.fullscreen;
    },
    handleCloseList() {
      this.showList = false;
    },
    formatCountdown
  },

  watch: {
    changeQuestion(_newVal, _oldVal) {
      console.log("[changeQuestion] watch", _newVal, _oldVal);
      this.isChangeQuestion = _newVal;
    }
  }
};
</script>

<style lang="scss">
@import "~assets/scss/components/elearning/exams/_do-exam-questions.scss";
@import "~/assets/scss/components/elearning/study/v2/_elearning-do-exercise.scss";
</style>
