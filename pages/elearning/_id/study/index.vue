<template>
  <div
    class="elearning-study"
    :class="{ 'pt-0': expand, fullscreen: fullscreen }"
  >
    <HeaderCourse v-show="!fullscreen" @exit="exitStudy" />

    <div class="container" v-if="pageLoading">
      <div class="row">
        <div class="col-md-8">
          <VclList />
        </div>
        <div class="col-md-4">
          <VclList />
        </div>
      </div>
    </div>

    <template v-else>
      <portal-target
        name="theater"
        :class="{
          'elearning-study-theater': true,
          'elearning-study-theater--fullscreen': fullscreen,
          'elearning-study-theater--active': fullscreen || expand,
        }"
      />

      <div class="container">
        <div class="row">
          <div class="col-md-8">
            <portal to="theater" :disabled="!(expand || fullscreen)">
              <div class="elearning-study-content mb-4">
                <!-- EXERCISE MODE -->
                <!-- <div
                  v-if="isExerciseMode"
                  class="elearning-lesson-screen elearning-lesson-screen--exercise-mode"
                >
                  <ElearningExercise />
                </div> -->
                <div
                  v-if="isExerciseMode"
                  class="elearning-lesson-screen elearning-lesson-screen--exercise-mode"
                >
                  <ElearningExercise />
                </div>

                <div
                  v-else
                  :class="{
                    'elearning-lesson-screen': true,
                    'elearning-lesson-screen--default-mode':
                      studyMode === defaultMode,
                    'elearning-lesson-screen--video-mode':
                      studyMode === videoMode,
                    'elearning-lesson-screen--doc-mode': studyMode === docMode,
                    'elearning-lesson-screen--image-mode':
                      studyMode === imageMode,
                    'elearning-lesson-screen--article-mode':
                      studyMode === articleMode,
                    'elearning-lesson-screen--scorm-mode':
                      studyMode === scormMode,
                  }"
                >
                  <!-- DEFAULT MODE -->
                  <img
                    v-if="studyMode === defaultMode"
                    :src="
                      get(info, 'cover_url.high', '') ||
                        '/images/default-course-image.png'
                    "
                    width="750"
                    alt
                  />

                  <!-- VIDEO MODE -->
                  <Streaming
                    v-if="studyMode == videoMode"
                    :url="get(payload, 'stream_urls.hls_url', '')"
                    :thumbnail="
                      get(info, 'cover_url.high', '') ||
                        '/images/adefltu - course - image.png'
                    "
                  />

                  <!-- DOC MODE -->
                  <ElearningDownload
                    v-if="studyMode == docMode"
                    :link="get(payload, 'link', '')"
                    :name="get(payload, 'name', '')"
                  />

                  <!-- IMAGE MODE -->
                  <img
                    v-if="studyMode === imageMode"
                    :src="get(payload, 'link', '')"
                    alt
                  />

                  <!-- ARTICLE MODE -->
                  <iframe
                    v-if="studyMode == articleMode"
                    :src="get(payload, 'link', '')"
                  ></iframe>

                  <!-- SCORM TEST -->
                  <ScormLecture v-if="studyMode == scormMode" />

                  <!-- AUDIO MODE -->
                  <Streaming
                    v-if="studyMode == audioMode"
                    :url="get(payload, 'link', '')"
                    :thumbnail="
                      get(info, 'cover_url.high', '') ||
                        '/images/adefltu - course - image.png'
                    "
                  />
                </div>

                <!-- DO EXERCISE -->

                <div
                  class="elearning-study-bottom"
                  v-if="studyMode !== defaultMode"
                >
                  <button
                    v-if="!fullscreen"
                    class="elearning-study-bottom__button elearning-study-bottom__button--expand"
                    type="button"
                    @click="setExpand(!expand)"
                  >
                    <IconStudyNarrow
                      v-if="expand"
                      class="icon fill-opacity-1"
                    />
                    <IconStudyExpand v-else class="icon fill-opacity-1" />
                  </button>
                  <button
                    class="elearning-study-bottom__button elearning-study-bottom__button--fullscreen"
                    type="button"
                    @click="setFullscreen(!fullscreen)"
                  >
                    <IconCropFreeReverse
                      v-if="fullscreen"
                      class="icon fill-opacity-1"
                    />
                    <IconCropFree v-else class="icon fill-opacity-1" />
                  </button>
                </div>
              </div>
            </portal>

            <div class="box22">
              <div class="elearning-study-tabs">
                <a
                  :class="{ active: type === 'summary' }"
                  @click="type = 'summary'"
                  >Tổng quan</a
                >
                <a :class="{ active: type === 'qa' }" @click="type = 'qa'"
                  >Hỏi đáp</a
                >
                <a
                  :class="{ active: type === 'notification' }"
                  @click="type = 'notification'"
                  >Thông báo</a
                >
                <a
                  :class="{ active: type === 'review' }"
                  @click="type = 'review'"
                  >Đánh giá</a
                >
              </div>

              <TabSummary :info="info" v-if="type === 'summary'" />
              <TabQA v-if="type === 'qa'" />
              <TabNotification v-if="type === 'notification'" />
              <TabReview v-if="type === 'review'" />
              <!-- <ElearningQuestion
                v-if="type === 'qa'"
                :interactive_questions="interactive_questions"
                @addQuestionSuccess="addQuestionSuccess"
              />-->
            </div>
          </div>

          <div class="col-md-4">
            <!-- <ElearningCourseSide/> -->
            <ElearningCourseSide />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { get } from "lodash";
import { mapState, mapMutations } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { ELEARNING_STUDY as ELEARNING_STUDY_MUTATION } from "~/utils/mutation-types";
import { STUDY_MODE, EXERCISE_CATEGORIES } from "~/utils/constants";
import { useEffect, redirectWithParams, getParamQuery } from "~/utils/common";
import InfoService from "~/services/elearning/study/Info";
import InteractiveQuestionService from "~/services/elearning/study/InteractiveQuestion";
import ProgramService from "~/services/elearning/public/Program";

import { COURSE_LESSON } from "~/server/fakedata/elearning/test";
import { AUTH, COMMENTS, LESSON } from "~/server/fakedata/elearning/test";

import IconSearch from "~/assets/svg/design-icons/search.svg?inline";
import IconLike from "~/assets/svg/icons/like.svg?inline";
import IconCamera from "~/assets/svg/design-icons/camera.svg?inline";
import IconCropFree from "~/assets/svg/v2-icons/crop_free_24px.svg?inline";
import IconCropFreeReverse from "~/assets/svg/icons/crop-free-reverse.svg?inline";
import IconStudyExpand from "~/assets/svg/icons/study-expand.svg?inline";
import IconStudyNarrow from "~/assets/svg/icons/study-narrow.svg?inline";

import ElearningCourseSide from "~/components/page/elearning/study/ElearningCourseSide";
import HeaderCourse from "~/components/layout/header/HeaderCourse";
import TabSummary from "~/components/page/elearning/study/tab-summary/TabSummary";
import TabQA from "~/components/page/elearning/study/tab-qa/TabQA";
import TabNotification from "~/components/page/elearning/study/tab-notification/TabNotification";
import TabReview from "~/components/page/elearning/study/tab-review/TabReview";
import Streaming from "~/components/page/elearning/study/Streaming";
// import ElearningExercise from "~/components/page/elearning/study/exercise/ElearningExercise";
import ElearningExercise from "~/components/page/elearning/study/v2/ElearningExercise";
import ScormLecture from "~/components/page/elearning/study/ScormMode";
import { VclList } from "vue-content-loading";

import ElearningDownload from "~/components/page/elearning/study/ElearningDownload";
// http://localhost:5000/elearning/79408a5d-12d7-4498-a2b3-faf4b9a9d1bd/study?lession_id=xxx&start_time=yyyy
export default {
  name: "Elearning",

  layout: "studying",

  components: {
    ElearningCourseSide,
    IconSearch,
    IconCamera,
    HeaderCourse,
    TabSummary,
    TabQA,
    TabNotification,
    TabReview,
    Streaming,
    // ElearningExercise,
    VclList,
    ElearningDownload,
    IconCropFree,
    IconCropFreeReverse,
    IconStudyExpand,
    IconStudyNarrow,
    ScormLecture,
    ElearningExercise

  },

  data() {
    return {
      type: this.$route.query && this.$route.query.type ? this.$route.query.type : "summary",
      pageLoading: true,
      videoMode: STUDY_MODE.VIDEO_PLAYING,
      exerciseMode: STUDY_MODE.DO_EXERCISE,
      defaultMode: STUDY_MODE.DEFAULT,
      docMode: STUDY_MODE.DOCS,
      articleMode: STUDY_MODE.ARTICLE,
      imageMode: STUDY_MODE.IMAGE,
      scormMode: STUDY_MODE.SCORM,
      audioMode: STUDY_MODE.AUDIO_PLAYING,
      // doExercise :true
    };
  },

  computed: {
    ...mapState("auth", ["loggedUser"]),
    ...mapState("event", ["payload", "studyMode"]),
    ...mapState("elearning/study/study-info", ["info"]),
    ...mapState("elearning/study/study", ["expand", "fullscreen"]),

    isExerciseMode() {
      const isExerciseScreen =
        this.studyMode &&
        [
          STUDY_MODE.DO_EXERCISE,
          STUDY_MODE.DO_EXERCISE_BEFORE_BEGIN,
          STUDY_MODE.DO_EXERCISE_DOING,
          STUDY_MODE.REVIEW_EXERCISE_RESULT,
        ].includes(this.studyMode);

      return isExerciseScreen;
    },
  },

  mounted() {
    console.log("[mounted] index", this.studyMode);
    this.getData(get(this, "$router.history.current.params.id", ""));
    const typeParams = getParamQuery("question_id");
    // document.addEventListener(
    //   "fullscreenchange",
    //   this.handleFullscreenChange,
    //   true
    // );
  },

  destroyed() {
    this.setStudyMode("");
    this.setPayload(null);
    this.setExpand(false);
    this.setFullscreen(false);
    document.removeEventListener(
      "fullscreenchange",
      this.handleFullscreenChange,
      true
    );

    // window.removeEventListener('beforeunload', this.warningF5);
  },

  watch: {
    payload: {
      handler: function() {
        console.log(this.payload);
      },
      deep: true,
    },

    fullscreen(newValue) {
      console.log("[fullscreen] watch", newValue);
      if (newValue) {
        if (document.fullscreenElement === null) {
          const el = document.documentElement;
          this.openFullscreen(el);
          window.scrollTo(0, 0);
        }
      } else {
        document.fullscreenElement != null && this.closeFullscreen();
      }
    },

    studyMode(_newVal) {
      console.log("[studyMode] watch", _newVal);
      if (_newVal !== this.videoMode) {
        document.addEventListener(
          "fullscreenchange",
          this.handleFullscreenChange,
          true
        );
      } else {
        document.removeEventListener(
          "fullscreenchange",
          this.handleFullscreenChange,
          true
        );
      }
    },
    type(newVal) {
      this.$route.query && this.$route.query.type
        ? redirectWithParams({ type: newVal ? newVal : "" })
        : "";
    },
  },

  methods: {
    ...mapMutations("event", ["setStudyMode", "setPayload"]),
    get,

    async getData(elearning_id) {
      const options = {
        params: {
          elearning_id,
        },
      };
      const getInfo = this.$store.dispatch(
        `elearning/study/study-info/${actionTypes.ELEARNING_STUDY_INFO.LIST}`,
        options
      );
      const getProgress = this.$store.dispatch(
        `elearning/study/study-progress/${actionTypes.ELEARNING_STUDY_PROGRESS.LIST}`,
        options
      );

      this.pageLoading = true;

      const data = await Promise.all([getInfo, getProgress]);

      this.pageLoading = false;
    },

    async addQuestionSuccess() {
      const res = await new InteractiveQuestionService(this.$axios)[
        actionTypes.BASE.LIST
      ]({
        params: {
          elearning_id: get(this, "$router.history.current.params.id", ""),
        },
      });
    },

    exitStudy() {
      this.$router.push("/elearning/mycourses");
    },

    setExpand(value) {
      // console.log("[setExpand]", value);
      this.$store.commit(
        `elearning/study/study/${ELEARNING_STUDY_MUTATION.SET_EXPAND}`,
        value
      );
    },

    setFullscreen(value) {
      // console.log("[setFullscreen]", value);
      this.$store.commit(
        `elearning/study/study/${ELEARNING_STUDY_MUTATION.SET_FULLSCREEN}`,
        value
      );
    },

    /* View in fullscreen */
    openFullscreen(el) {
      // console.log("[openFullscreen]", el);
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.mozRequestFullScreen) {
        /* Firefox */
        el.mozRequestFullScreen();
      } else if (el.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        el.webkitRequestFullscreen();
      } else if (el.msRequestFullscreen) {
        /* IE/Edge */
        el.msRequestFullscreen();
      }
    },

    /* Close fullscreen */
    closeFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
      }
    },

    handleFullscreenChange() {
      console.log("[handleFullscreenChange] 1", document.fullscreenElement);
      if (document.fullscreenElement !== null) {
        this.setFullscreen(true);
      } else {
        this.setFullscreen(false);
      }
    },

    // warningF5(event) {
    //   console.log("[warningF5]", event.keyCode);
    //   alert(event.keyCode);
    //   alert(this.studyMode);
    //   if(116 == event.keyCode && this.studyMode == STUDY_MODE.DO_EXERCISE_DOING) { // enter key code
    //     console.log("[warningF5] prevent exit");
    //   }
    // }
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/pages/elearning/_study.scss";
</style>
