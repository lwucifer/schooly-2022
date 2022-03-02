<template>
  <div class="edq_section">
    <div class="row">
      <div class="col-md-8">
        <h5 class="edq__section-title">Câu hỏi</h5>
      </div>
      <div class="col-md-4">
        <h5 class="edq__section-title">Đáp án</h5>
      </div>

      <template v-for="(item, index) in questionsOpt">
        <div class="col-md-8" :key="'QUESTION' + index">
          <div class="d-flex mb-3">
            <span class="mx-3 mt-3">{{ index + 1 }}.</span>
            <div class="edq__has-choice-ans w-100">
              <div class="edq__has-choice-ans-cnt w-100">
                <div>
                  <v-popover
                    class=""
                    offset="15"
                    trigger="hover"
                    placement="top"
                    popoverBaseClass="tooltip-edit-ans-course tooltip-bordered tooltip-rounded tooltip-has-arrow"
                  >
                    <div class="edq__has-choice-ans-cnt-wrapper">
                      <div v-html="item.content || ''"></div>
                    </div>
                    <template slot="popover" class="tooltip-detail">
                      <div v-html="item.content || ''"></div>
                    </template>
                  </v-popover>
                  <IconEdit24 title="Chỉnh sửa" @click="editQuestionContent(index, item)" class="edq__has-choice-ans-cnt-icon-edit" />
                </div>
              </div>
            </div>

            <!-- <div class="edq__has-choice-ans w-100">
              <div class="edq__has-choice-ans-cnt w-100">
                <span v-html="item.content || ''"></span>
                <IconEdit24
                  title="Chỉnh sửa"
                  @click="editQuestionContent(index, item)"
                  class="edq__has-choice-ans-cnt-icon-edit"
                />
              </div>
            </div> -->

            <!-- <app-input
              class="w-100 mb-0"
              @input="changeContentQuestion(index, ...arguments)"
              :value="item.content || ''"
            />-->
          </div>
        </div>

        <div class="col-md-4" :key="'ANSWER' + index">
          <div class="d-flex mb-3">
            <span class="mx-3 mt-3">{{ CHOICE_ALPHA[index] || 'N/A' }}.</span>
            <div class="edq__has-choice-ans w-100">
              <div class="edq__has-choice-ans-cnt w-100">
                <div>
                  <v-popover
                    class=""
                    offset="15"
                    trigger="hover"
                    placement="top"
                    popoverBaseClass="tooltip-edit-ans-course tooltip-bordered tooltip-rounded tooltip-has-arrow"
                  >
                    <div class="edq__has-choice-ans-cnt-wrapper">
                      <div v-html="item.matching && item.matching.content || ''"></div>
                    </div>
                    <template slot="popover" class="tooltip-detail">
                      <div v-html="item.matching && item.matching.content || ''"></div>
                    </template>
                  </v-popover>
                  <IconEdit24 title="Chỉnh sửa" @click="editContent(index, item)" class="edq__has-choice-ans-cnt-icon-edit" />
                </div>
              </div>
              <!-- <button class="ml-3" @click="deleteAns(index)">
                <IconTrashAlt class="d-block subheading fill-secondary" width="20px" height="20px"/>
              </button> -->
            </div>

            <!-- <div class="edq__has-choice-ans w-100">
              <div class="edq__has-choice-ans-cnt w-100">
                <span v-html="item.matching && item.matching.content || ''"></span>
                <IconEdit24
                  title="Chỉnh sửa"
                  @click="editAnsContent(index, item)"
                  class="edq__has-choice-ans-cnt-icon-edit"
                />
              </div>
            </div> -->

            <!-- <app-input
              class="w-100 mb-0"
              @input="changeContentAnswer(index, ...arguments)"
              :value="item.answer || ''"
            />-->
            <button class="ml-3" @click="deleteQuestion(index)" title="Xóa">
              <IconTrashAlt
                title="Xóa"
                class="d-block subheading fill-secondary"
                width="20px"
                height="20px"
              />
            </button>
          </div>
        </div>
      </template>
      <div class="col-12">
        <div class="text-right">
          <app-button
            color="transparent"
            flat
            square
            style="box-shadow: none;"
            class="p-0"
            @click="addQuestion"
          >
            <slot name="icon">
              <IconPlus
                class="icon--btn icon--btn--pre fill-opacity-1"
                style="height: 1.6rem; width: 1.6rem;"
              />
            </slot>
            <span class="text-primary font-weight-normal heading-5">Thêm đáp án</span>
          </app-button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <update-ans-modal
      v-if="isShowEditQuestionContentModal"
      :content="get(this, 'currentContent.detail.content', '')"
      title="Nhập nội dung câu hỏi"
      @submit="submitEditQuestionContent"
      @cancel="cancelEditQuestionContent"
      @close="cancelEditQuestionContent"
    />
    <update-ans-modal
      v-if="isShowEditAnsContentModal"
      title="Nhập nội dung đáp án"
      :content="get(this, 'currentAns.detail.content', '')"
      @submit="submitEditAnsContent"
      @cancel="cancelEditAnsContent"
      @close="cancelEditAnsContent"
    />
  </div>
</template>
<script>
import IconPlus from "~/assets/svg/design-icons/plus.svg?inline";
import IconTrashAlt from "~/assets/svg/design-icons/trash-alt.svg?inline";
import IconEdit24 from "~/assets/svg/v2-icons/edit_24px.svg?inline";
import UpdateAnsModal from "~/components/page/course/create/common/UpdateAnsModal";
import {
  MATCH_WORD_QUESTION_SIZE_MAX,
  MATCH_WORD_QUESTION_SIZE_MIN,
} from "~/utils/config";
import { get, cloneDeep } from "lodash";
import { useEffect, questionBankTypeArr } from "~/utils/common";

const CHOICE_ALPHA = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
];
const MAX_ANS = MATCH_WORD_QUESTION_SIZE_MAX;
const MIN_ANS = MATCH_WORD_QUESTION_SIZE_MIN;

export default {
  components: {
    IconTrashAlt,
    IconPlus,
    IconEdit24,
    UpdateAnsModal,
  },
  props: {
    questions: {
      type: Array | Object,
      default: () => [],
    },
  },
  data() {
    return {
      CHOICE_ALPHA: Object.freeze(CHOICE_ALPHA),
      MAX_ANS: Object.freeze(MAX_ANS),
      MIN_ANS: Object.freeze(MIN_ANS),
      questionsOpt: [
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
      isShowEditQuestionContentModal: false,
      isShowEditAnsContentModal: false,
      currentContent: {},
      currentAns: {},
    };
  },
  mounted() {
    useEffect(this, this.handleChangeQuestion.bind(this), ["questions"]);
  },
  methods: {
    handleChangeQuestion() {
      if (this.questions) {
        let answers = [];
        let _data = cloneDeep(this.questions);
        _data.map((answer) => {
          if (answer.position === -1) {
            let matching = _data.find((_answer) => {
              return _answer.id === answer.matching_answer_id;
            });
            answer.matching = matching;
            answers.push(answer);
          }
        });
        _data = answers;
        this.questionsOpt = _data;
      }
    },
    changeContentQuestion(index, value) {
      this.$emit("changeContentQuestion", index, value);
    },
    changeContentAnswer(index, value) {
      this.$emit("changeContentAnswer", index, value);
    },
    addQuestion(index) {
      const questionCounter = this.questionsOpt.length;
      if (questionCounter < this.MAX_ANS) {
        const index = +get(this, "questionsOpt.length", 0);
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
        // if (this.questionsOpt) {
        //   this.questionsOpt.push(item);
        //   this.$emit("addQuestion", this.questionsOpt);
        //   return;
        // }
        // this.questionsOpt = [item];
        this.questionsOpt.push(item);
        this.$emit("addQuestion", this.questionsOpt);
      } else {
        this.$toasted.error(`Tối đa ${this.MAX_ANS} đáp án`);
      }
    },
    handleAddAnswer() {
      const answerCounter = this.questionsOpt.length;
      if (answerCounter < this.MAX_ANS - 1) {
        let emptyAns = {
          content: "",
          correct: false,
        };
        this.questionsOpt = this.questionsOpt.concat([emptyAns]);
      } else {
        this.$toasted.error(`Tối đa ${this.MAX_ANS} đáp án`);
      }
    },
    deleteQuestion(index) {
      const currentQuestionSize = this.questionsOpt.length;
      if (currentQuestionSize > this.MIN_ANS) {
        this.questionsOpt.splice(index, 1);
        this.$emit("deleteQuestion", index);
      } else {
        this.$toasted.error(`Tối thiểu ${this.MIN_ANS} đáp án`);
      }
    },
    editQuestionContent(index, item) {
      this.currentContent.detail = item;
      this.currentContent.index = index;
      this.isShowEditQuestionContentModal = true;
    },
    submitEditQuestionContent(data) {
      this.questionsOpt[this.currentContent.index].content = data;
      this.$emit("changeContentQuestion", this.questionsOpt);
      this.isShowEditQuestionContentModal = false;
    },
    cancelEditQuestionContent() {
      this.currentContent = {};
      this.isShowEditQuestionContentModal = false;
    },

    editAnsContent(index, item) {
      this.currentAns.detail = item;
      this.currentAns.index = index;
      console.log("current ans", this.currentAns);
      this.isShowEditAnsContentModal = true;
    },
    submitEditAnsContent(data) {
      this.questionsOpt[this.currentContent.index].matching.content = data;
      this.$emit("changeContentAnswer", this.questionsOpt);
      this.isShowEditAnsContentModal = false;
    },
    cancelEditAnsContent() {
      this.currentAns = {};
      this.isShowEditAnsContentModal = false;
    },
    get,
  },
  created() {
    // this.cloneData();
  },
};
</script>
<style lang="scss" scoped>
</style>