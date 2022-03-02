<template>
  <div class="create-question">
    <div class="d-flex">
      <div class="mr-6 pr-6">
        <p class="label">Loại câu hỏi:</p>
        <div class="d-flex-center">
          <IconQuestion1 />
          <strong class="color-primary ml-3">Đúng/Sai</strong>
        </div>
      </div>
      <!-- <div>
        <p class="label">Chọn cấp độ cho câu hỏi:</p>
        <div class="radios">
          <app-radio
            name="level"
            @change="handleChangeLevel"
            :value="levels[0]['id']"
            :checked="data.manual.level === levels[0]['id']"
            >Dễ</app-radio
          >
          <app-radio
            name="level"
            @change="handleChangeLevel"
            :value="levels[1]['id']"
            :checked="data.manual.level === levels[1]['id']"
            >Trung bình</app-radio
          >
          <app-radio
            name="level"
            @change="handleChangeLevel"
            :value="levels[2]['id']"
            :checked="data.manual.level === levels[2]['id']"
            >Khó</app-radio
          >
        </div>
      </div> -->
    </div>
    <div class="mt-5 mb-4">
      <p class="label">Nội dung câu hỏi:</p>
      <app-editor
        class="bg-input-gray mb-3"
        :sticky-offset="`{ top: 40, bottom: 0 }`"
        :value="get(data, 'manual.content', '')"
        @input="handleChangeContent"
      />
    </div>
    <div class="row row-center">
      <div class="col-3">
        <p class="label">Chọn đáp án đúng:</p>
      </div>
      <div class="col-9">
        <p class="label">Nội dung đáp án:</p>
      </div>
      <div class="col-3">
        <app-radio
          name="answer"
          :class="get(data, 'answers.0.selected', false) ? 'avtive' : 'xxx'"
          @change="handleChangeAnswer(0)"
          :checked="get(data, 'answers.0.selected', false)"
          ><span class="pr-3 text-uppercase"
            >{{ alphabet[0] }}
          </span></app-radio
        >
      </div>
      <div class="col-9">
        {{ get(data, "answers.0.content", "") }}
      </div>
      <div class="col-3">
        <app-radio
          name="answer"
          :class="get(data, 'answers.1.selected', false) ? 'avtive' : 'xxx'"
          @change="handleChangeAnswer(1)"
          :checked="get(data, 'answers.1.selected', false)"
          ><span class="pr-3 text-uppercase"
            >{{ alphabet[1] }}
          </span></app-radio
        >
      </div>
      <div class="col-9">
        {{ get(data, "answers.1.content", "") }}
      </div>
    </div>

    <div class="mt-4">
      <div class="label d-flex-center" @click="showMemo = !showMemo">
        <div style="cursor: pointer" class="d-flex-center">
          <IconRight v-if="!showMemo" />
          <IconDown v-else />
          <span class="pr-3">Ghi chú</span>
        </div>
        <div class="tooltip">
          <IconHelp />
          <p class="text">Giải thích đáp án đúng hoặc kiến thức bổ sung</p>
        </div>
      </div>
      <app-input
        textarea
        v-if="showMemo"
        rows="3"
        placeholder="Viết ghi chú..."
        v-model="data.manual.note"
      />
    </div>
  </div>
</template>

<script>
import IconHelp from "~/assets/svg/v2-icons/help_24px.svg?inline";
import IconRight from "~/assets/svg/v2-icons/chevron_right_24px.svg?inline";
import IconDown from "~/assets/svg/v2-icons/chevron_down_24px.svg?inline";
import IconQuestion1 from "~/assets/svg/images/question1.svg?inline";
import { get, cloneDeep, sortBy } from "lodash";
import { useEffect } from "~/utils/common";
import { LEVEL_QUESTIONS } from "~/utils/constants";

export default {
  components: {
    IconQuestion1,
    IconHelp,
    IconRight,
    IconDown,
  },

  props: {
    visible: Boolean,
    question: {},
  },

  data() {
    return {
      alphabet: [..."abcdefghijklmnopqrstuvwxyz"],
      showMemo: false,
      active: 1,
      name: "",
      level: "1",
      error: {},
      levels: LEVEL_QUESTIONS,
      data: {
        manual: {
          //level: "",
          content: "",
          note: "",
        },
        answers: [
          {
            content: "Đúng",
            index: 0,
            matching: {
              content: "Đúng",
              index: 0,
              name: "Đúng",
            },
            name: "Đúng",
            selected: false,
          },
          {
            content: "Sai",
            index: 1,
            matching: {
              content: "Sai",
              index: 1,
              name: "Sai",
            },
            name: "Sai",
            selected: false,
          },
        ],
      },
    };
  },

  mounted() {
    useEffect(this, this.handleChangeData.bind(this), ["data"]);
    useEffect(this, this.handleChangeQuestion.bind(this), ["question"]);
  },

  methods: {
    handleChangeData() {
      this.$emit("handleChangeData", this.data);
    },

    handleChangeQuestion() {
      if (this.question) {
        this.data = cloneDeep(this.question);
        this.data.answers = sortBy(this.data.answers, (answer) => answer.index);
      }
    },

    handleChangeContent(content) {
      this.data.manual.content = content;
    },

    handleChangeAnswer(index) {
      if (+index === 0) {
        this.data.answers[0]["selected"] = true;
        this.data.answers[1]["selected"] = false;
      }
      if (+index === 1) {
        this.data.answers[0]["selected"] = false;
        this.data.answers[1]["selected"] = true;
      }
    },

    // handleChangeLevel(e) {
    //   this.data.manual.level = e.target.value;
    // },
    get,
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/bank/_questions.scss";
</style>
