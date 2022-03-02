<template>
  <div class="create-step">
    <div
      v-for="(item, index) in steps"
      :key="index"
      class="create-step__item"
      :class="{
        active: step === item.step,
        finished: index < activeIndex
      }"
      @click="handleClickStep(item)"
    >{{ item.text }}</div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { getParamQuery } from "~/utils/common";

export default {
  props: {
    steps: {
      type: Array,
      default: () => [
        { step: 0, text: "Nhập thông tin chung" },
        { step: 1, text: "Tạo nội dung" },
      ],
    },
    currentStepActive: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      step: 0,
    };
  },

  computed: {
    activeIndex() {
      return this.steps.findIndex((item) => item.step === this.step);
    },
    ...mapState("elearning/create", {
      elearningDetail: "elearningDetail",
    }),
    checkElearningId() {
      return this.elearningDetail && this.elearningDetail.id ? true : false;
    },
  },

  methods: {
    ...mapActions("elearning/study/study-progress", [
      "elearningSudyProgressProgramList",
    ]),
    ...mapActions("elearning/creating/creating-lesson", [
      "elearningCreatingLessonsList",
    ]),

    ...mapActions("elearning/create", ["getElearningDetail"]),

    handleClickStep(item) {
      console.log("[handleClickStep]", item);

      // url like: .../create/index-new-ui?elearning_id=xxxxxx
      // elearning_id must exist on step 2.
      const elearning_id = getParamQuery("elearning_id");
      const type = getParamQuery("type");
      if (!elearning_id) return;

      this.step = item.step;
      this.$emit("step", item.step);

      if (type == "COURSE") {
        this.elearningSudyProgressProgramList({ elearning_id });
      } else if (type == "LECTURE") {
        this.elearningCreatingLessonsList({ params: { elearning_id } });
      }
      const params = {
        elearning_id: elearning_id,
      };
      this.getElearningDetail(params);
    },
  },
  watch: {
    currentStepActive(_newVal) {
      this.step = _newVal;
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/course/create/_create-step.scss";
</style>
