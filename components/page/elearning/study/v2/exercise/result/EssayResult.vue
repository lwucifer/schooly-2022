<template>
  <div class="modal-result-answer">
    <p v-html="questionName"></p>
    <!-- <div class="drop-extend" @click="handleClickExtend" v-if="extend">
      Thu gọn
      <IconKeyboardArrowUp24px class="fill-primary" />
    </div> -->
    <div class="drop-extend" :class="textStatus">
      Câu trả lời:
      <IconKeyboardArrowDown24px :class="iconStatus" />
    </div>
    <div
      class="content-answer dont-break-out"
      v-html="userAnswer"
      v-if="!!userAnswer"
    ></div>
    <div class="content-answer dont-break-out" v-if="!!userUpload && userUpload.length > 0">
      <fragment v-for="(item, index) in userUpload" :key="index">
        <div class="d-flex align-items-center mb-2">
          <IconCsv height="24" class="mr-3" />
          <a class="dont-break-out" :href="item.link" target="_blank">{{
            item.name
          }}</a>
        </div>
      </fragment>
    </div>
  </div>
</template>

<script>
import IconClose from "~/assets/svg/v2-icons/close_24px.svg?inline";
import IconCheck from "~/assets/svg/design-icons/check.svg?inline";
import IconClose24px from "~/assets/svg/v2-icons/close_24px.svg?inline";
import IconKeyboardArrowUp24px from "~/assets/svg/v2-icons/keyboard_arrow_up_24px.svg?inline";
import IconKeyboardArrowDown24px from "~/assets/svg/v2-icons/keyboard_arrow_down_24px.svg?inline";
import IconCsv from "~/assets/svg/v2-icons/csv.svg?inline";

import { mapState } from "vuex";
import { get } from "lodash";
import { QUESTION_ANSWER_INDEX_TEXT } from "~/utils/config";

export default {
  components: {
    IconClose,
    IconCheck,
    IconClose24px,
    IconKeyboardArrowUp24px,
    IconKeyboardArrowDown24px,
    IconCsv
  },

  props: {
    result: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      extend: false
    };
  },

  computed: {
    ...mapState("elearning/study/study-exercise", ["submissions"]),

    questionName() {
      const index = get(this, "result.index", 0);
      return `Câu hỏi số ${index}. ${get(
        this,
        "result.manual.content",
        "Điền từ vào chỗ trống"
      )}`;
    },

    questionResult() {
      return get(this, "result.userAnswer.result", -1); // kết quả (-1: sai | 0: chưa trả lời | 1: đúng)
    },

    userAnswer() {
      const ans =
        this.result.userAnswer.submissions.length > 0
          ? this.result.userAnswer.submissions[0]
          : null;
      if (ans) return ans.answer;
      console.log("[userAnswer]", ans);
      return "";
    },

    userUpload() {
      const upload =
        !!this.result.userAnswer.upload &&
        this.result.userAnswer.upload.length > 0
          ? this.result.userAnswer.upload
          : [];
      console.log("[userUpload]", upload);
      return upload;
    },

    textStatus() {
      return this.questionResult == 1 ? "text-success" : "text-error";
    },
    iconStatus() {
      return this.questionResult == 1 ? "fill-primary" : "fill-secondary";
    }
  },

  methods: {
    handleClickExtend() {
      this.extend = !this.extend;
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/v2/_elearning-exercise-modal-result.scss";
</style>
