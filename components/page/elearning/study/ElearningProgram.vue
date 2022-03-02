<template>
  <div class="e-program bg-white shadow-1">
    <div class="box bg-light-2">
      <strong>{{ totalLessons }} Bài học</strong>
      ({{ get(progress, "duration", "") }})
    </div>

    <app-divider class="my-0" color="disabled" />

    <div v-if="totalLessons < 1" class="box caption">Không có bài học nào</div>
    <div v-else-if="progress.type === 'COURSE'">
      <ElearningProgramCourse
        v-for="(program, index) in get(progress, 'programs', [])"
        :program="program"
        :key="index"
        :index="index"
      />
    </div>
    <div v-else>
      <ElearningProgramItem
        class="e-program__item-lecture"
        :lesson="get(progress, 'programs.0.lessons.0', null)"
        :index="1"
      />
    </div>

    <!-- Bai TEST -->
    <a
      v-if="isTestExist"
      class="e-program__test"
      :class="`text-${classExerciseStatus}`"
      href
      @click.prevent="handleExitExercise"
      v-scroll-to="'body'"
    >
      <IconFileAlt class="icon" />
      &nbsp;Làm bài kiểm tra {{ testRate }}
    </a>

    <app-modal-confirm
      centered
      v-if="isShowConfirmExit"
      title="Xác nhận thoát?"
      description="Bạn có chắc chắn muốn thoát? Hệ thống sẽ đánh trượt bài làm của bạn."
      @ok="handleDoTest"
      @cancel="isShowConfirmExit = false"
    />
    
  </div>
</template>

<script>
import { get } from "lodash";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { STUDY_MODE, EXERCISE_CATEGORIES, PAGE_SIZE } from "~/utils/constants";

import IconFileAlt from "~/assets/svg/design-icons/file-alt.svg?inline";
import ElearningProgramItem from "~/components/page/elearning/study/ElearningProgramItem";
import ElearningProgramCourse from "~/components/page/elearning/study/ElearningProgramCourse";

export default {
  components: {
    IconFileAlt,
    ElearningProgramItem,
    ElearningProgramCourse,
  },

  data() {
    return {
      isShowConfirmExit: false,
    }
  },

  computed: {
    ...mapState("elearning/study/study-progress", ["progress"]),
    ...mapState("event", ["studyMode"]),

    totalLessons() {
      // console.log("[progress]", this.progress);
      if (!this.progress) return `0`;
      return (
        this.progress.programs.reduce(
          (acc, curr) => acc + curr.total_lessons,
          0
        ) || 0
      );
    },

    test_info() {
      return get(this, "progress.test_info", {});
    },

    isTestExist() {
      if (!this.test_info || this.test_info.total < 1) return false;
      return true;
    },

    testRate() {
      if (!this.test_info) return "(0/0)";
      const touchedExams =
        this.test_info.passed + this.test_info.failed + this.test_info.pending + this.test_info.working;
      return `(${touchedExams}/${this.test_info.total})`;
    },

    // return primary|secondary|warning
    classExerciseStatus() {
      // debugger;
      if (this.test_info.passed == this.test_info.total) {
        return "primary";
      } else if (this.test_info.failed > 0 || this.test_info.working > 0) {
        return "secondary";
      } else if (this.test_info.pending > 0) {
        return "warning";
      } else {
        return "warning";
      }
    },
  },

  methods: {
    get,

    ...mapMutations("event", ["setStudyMode"]),
    ...mapMutations("elearning/study/study-exercise", [
      "setStudyExerciseCurrentLession",
    ]),

    ...mapActions("elearning/study/study-exercise", [
      "elearningSudyElearningExerciseList",
    ]),

    handleExitExercise() {
      console.log("[handleExitExercise]");
      // need to confirm if user in mode DO_EXERCISE_DOING
      if (this.studyMode == STUDY_MODE.DO_EXERCISE_DOING) {
        this.isShowConfirmExit = true;
        return;
      } else {
        this.handleDoTest();
      }
    },

    handleDoTest() {
      console.log("[handleDoTest]", this.progress);
      this.isShowConfirmExit = false;

      // emit studyMode=DO_EXERCISE
      this.setStudyMode(STUDY_MODE.DO_EXERCISE);
      this.setStudyExerciseCurrentLession(null);

      // get list TEST
      const testReq = {
        elearning_id: this.progress.id,
        category: EXERCISE_CATEGORIES.TEST,
        size: PAGE_SIZE.MAXIMIZE,
      };
      this.elearningSudyElearningExerciseList(testReq);
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/_elearning-program.scss";
</style>
