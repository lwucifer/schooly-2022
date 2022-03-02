<template>
  <div class="create-question">
    <div class="d-flex">
      <div class="mr-6 pr-6">
        <p class="label">Loại câu hỏi:</p>
        <div class="d-flex-center">
          <IconQuestion4 />
          <strong class="color-primary ml-3">Ghép đáp án</strong>
        </div>
      </div>
      <!-- <div>
        <p class="label">Chọn cấp độ cho câu hỏi:</p>
        <div class="radios" v-if="data.method == 'SELECT'">
          <app-radio
            name="level"
            @change="handleChangeLevel"
            :value="levels[0]['id']"
            :checked="data.select.level === levels[0]['id']"
            >Dễ</app-radio
          >
          <app-radio
            name="level"
            @change="handleChangeLevel"
            :value="levels[1]['id']"
            :checked="data.select.level === levels[1]['id']"
            >Trung bình</app-radio
          >
          <app-radio
            name="level"
            @change="handleChangeLevel"
            :value="levels[2]['id']"
            :checked="data.select.level === levels[2]['id']"
            >Khó</app-radio
          >
        </div>

        <div class="radios" v-else>
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
        v-if="data.method == 'SELECT'"
        class="bg-input-gray mb-3"
        :sticky-offset="`{ top: 40, bottom: 0 }`"
        v-model="data.select.content"
      />
      <app-editor
        v-else
        class="bg-input-gray mb-3"
        :sticky-offset="`{ top: 40, bottom: 0 }`"
        v-model="data.manual.content"
      />
    </div>
    <div class="row row-center">
      <div class="col-7">
        <p class="label">Câu hỏi:</p>
      </div>
      <div class="col-5">
        <p class="label">Đáp án:</p>
      </div>
    </div>

    <div
      class="row row-center"
      v-for="(item, index) in data.answers"
      :key="index"
    >
      <div class="col-7">
        <span class="pr-3">{{ index + 1 }}.</span>
        <div class="edit" @click="handleEditContent('answer', index)">
          
          <v-popover
            trigger="hover"
            placement="center"
          >
            <span v-html="get(item, 'content', '') ? get(item, 'content', '').slice(0, 50) + '...' : ''"></span>
            <template slot="popover">
              <span v-html="get(item, 'content', '')"></span>
            </template>
          </v-popover>
          
          <IconEdit24
            class="icon-edit"
          />
        </div>
      </div>
      <div class="col-5">
        <span class="pr-3 text-uppercase">{{ alphabet[index] }}.</span>
        <div class="edit" @click="handleEditContent('matching', index)">
          
          <v-popover
            trigger="hover"
            placement="center"
          >
            <span v-html="get(item, 'matching.content', '') ? get(item, 'matching.content', '').slice(0, 30) + '...' : ''"></span>
            <template slot="popover">
              <span v-html="get(item, 'matching.content', '')"></span>
            </template>
          </v-popover>
          <IconEdit24
            class="icon-edit"
          />
        </div>
        <button class="btn-delete" @click="handleDeleteAnswer(index)">
          <IconDelete class="fill-red" />
        </button>
      </div>
    </div>

    <div class="d-flex mt-3">
      <button @click="addItem" class="ml-auto d-flex-center color-primary">
        <IconPlus2 class="fill-primary" />Thêm đáp án
      </button>
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
        v-if="showMemo && (data.method == 'SELECT')"
        rows="3"
        placeholder="Viết ghi chú..."
        v-model="data.select.note"
      />
      <app-input
        textarea
        v-if="showMemo && (data.method != 'SELECT')"
        rows="3"
        placeholder="Viết ghi chú..."
        v-model="data.manual.note"
      />
    </div>

    <ModalUpdateAnswer
      v-if="showEditAnswer"
      @click-close="showEditAnswer = false"
      :data="data"
      :type="type"
      :index="index"
      @handleSaveContent="handleSaveContent"
    />
  </div>
</template>

<script>
import IconHelp from "~/assets/svg/v2-icons/help_24px.svg?inline";
import IconRight from "~/assets/svg/v2-icons/chevron_right_24px.svg?inline";
import IconDown from "~/assets/svg/v2-icons/chevron_down_24px.svg?inline";
import IconEdit24 from "~/assets/svg/v2-icons/edit_24px.svg?inline";
import IconDelete from "~/assets/svg/v2-icons/delete_24px.svg?inline";
import IconPlus2 from "~/assets/svg/icons/plus2.svg?inline";
import ModalUpdateAnswer from "~/components/page/elearning/manager/bank/questions/create/ModalUpdateAnswer";
import IconQuestion4 from "~/assets/svg/images/question4.svg?inline";
import { get, cloneDeep } from "lodash";
import { useEffect } from "~/utils/common";
import { LEVEL_QUESTIONS } from "~/utils/constants";

export default {
  components: {
    IconQuestion4,
    ModalUpdateAnswer,
    IconHelp,
    IconRight,
    IconDown,
    IconEdit24,
    IconDelete,
    IconPlus2,
  },

  props: {
    visible: Boolean,
    question: {},
  },

  data() {
    return {
      alphabet: [..."abcdefghijklmnopqrstuvwxyz"],
      showEditAnswer: false,
      showMemo: false,
      active: 1,
      name: "",
      levels: LEVEL_QUESTIONS,
      level: "1",
      error: {},

      // edit content
      type: "",
      index: "",

      data: {
        manual: {
          content: "",
          //level: "",
          name: "manual",
          note: "",
        },
        answers: [
          {
            content: "",
            index: 0,
            matching: {
              content: "",
              index: 1,
              name: "matching",
            },
            name: "answer",
            position: 0,
            selected: true,
          },
        ],
      },
    };
  },

  mounted() {
    useEffect(this, this.handleChangeQuestion.bind(this), ["question"]);
    useEffect(this, this.handleChangeData.bind(this), ["data"]);
  },

  methods: {
    handleChangeQuestion() {
      if (this.question) {
        let answers = [];
        let _data = cloneDeep(this.question);
        _data.answers ? _data.answers.map((answer) => {
          if (answer.position === -1) {
            let matching = _data.answers.find((_answer) => {
              return _answer.id === answer.matching_answer_id;
            });
            answer.matching = matching;
            answers.push(answer);
          }
        }) : [];
        _data.answers = answers;
        this.data = _data;
      }
    },

    handleChangeData() {
      this.$emit("handleChangeData", this.data);
    },

    handleSaveContent(type, index, content) {
      if (type === "answer") {
        this.data.answers[index]["content"] = content;
      }
      if (type === "matching") {
        this.data.answers[index]["matching"]["content"] = content;
      }
      this.showEditAnswer = false;
    },

    handleEditContent(type, index) {
      this.showEditAnswer = true;
      this.type = type;
      this.index = index;
    },

    handleDeleteAnswer(index) {
      this.data.answers.splice(index, 1);
    },

    // handleChangeLevel(e) {
    //   this.data.manual.level = e.target.value;
    // },

    addItem() {
      const index = +get(this, "data.answers.length", 0);
      let item = {
        content: "",
        index: index,
        matching: {
          content: "",
          index: index,
          name: "matching",
        },
        name: "answer",
        selected: false,
      };
      if (this.data.answers) {
        this.data.answers.push(item);
        return;
      }
      this.data.answers = [item];
    },

    get,
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/bank/_create-question-modal.scss";
@import "~/assets/scss/components/elearning/bank/_questions.scss";
</style>
