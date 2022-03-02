<template>
  <div class="edq_section">
    <div class="row">
      <div class="col-md-3">
        <h5 class="edq__section-title">Chọn đáp án đúng</h5>
      </div>
      <div class="col-md-9">
        <h5 class="edq__section-title">Nội dung đáp án</h5>
      </div>

      <template v-for="(item, index) in answersOpt">
        <div class="col-md-3" :key="'CHOICE_ALPHA' + index">
          <div class="mt-2">
            <app-checkbox
              v-if="checkType == 'checkbox'"
              :checked="item.selected"
              @change="changeAnsCheckbox(index, ...arguments)"
            >{{ CHOICE_ALPHA[index] }}</app-checkbox>
            <app-radio
              v-else-if="checkType == 'radio'"
              @click="$emit('changeAns', index)"
              :name="'QUESTION_CONTENT'"
              :checked="item.selected"
            >{{ CHOICE_ALPHA[index] }}</app-radio>
          </div>
        </div>

        <div class="col-md-9" :key="'CONTENT' + index">
          <div class="d-flex mb-3">
            <!-- <app-input
              class="w-100 mb-0"
              @input="changeContent(index, ...arguments)"
              :value="item.content"
              @click="handleAddAnswer(index)"
            /> -->
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
                      <div v-html="item.content"></div>
                    </div>
                    <template slot="popover" class="tooltip-detail">
                      <div v-html="item.content"></div>
                    </template>
                  </v-popover>
                  <IconEdit24 title="Chỉnh sửa" @click="editContent(index, item)" class="edq__has-choice-ans-cnt-icon-edit" />
                </div>
              </div>
              <button class="ml-3" @click="deleteAns(index)">
                <IconTrashAlt class="d-block subheading fill-secondary" width="20px" height="20px"/>
              </button>
            </div>
          </div>
        </div>
      </template>

      <div class="col-12 text-right">
        <button @click="handleAddAnswer" class="ml-auto d-flex-center color-primary">
          <IconPlus2 class="fill-primary" />Thêm đáp án
        </button>
      </div>
    </div>

    <!-- Modal -->
    <update-ans-modal
      v-if="isShowEditContentModal"
      :content="get(this, 'currentContent.detail.content', '')"
      @submit="submitEditContent"
      @cancel="cancelEditContent"
      @close="cancelEditContent"
    />
  </div>
</template>
<script>
import IconTrashAlt from "~/assets/svg/design-icons/trash-alt.svg?inline";
import {
  CHOICE_QUESTION_SIZE_MAX,
  CHOICE_QUESTION_SIZE_MIN,
} from "~/utils/config";
import IconEdit24 from "~/assets/svg/v2-icons/edit_24px.svg?inline";
import IconPlus2 from "~/assets/svg/icons/plus2.svg?inline";
import UpdateAnsModal from "~/components/page/course/create/common/UpdateAnsModal";
import { get } from "lodash";

const CHOICE_ALPHA = ["A", "B", "C", "D", "E", "F", "G", "H"];
const MAX_ANS = CHOICE_QUESTION_SIZE_MAX;
const MIN_ANS = CHOICE_QUESTION_SIZE_MIN;

export default {
  components: {
    IconTrashAlt,
    IconEdit24,
    UpdateAnsModal,
    IconPlus2
  },
  props: {
    answers: {
      type: Array | Object,
      default: () => [],
    },
    checkType: {
      type: String,
      default: "radio", // radio | checkbox
      validator: (value) => ["radio", "checkbox"].includes(value),
    },
  },
  data() {
    return {
      CHOICE_ALPHA: Object.freeze(CHOICE_ALPHA),
      MAX_ANS: Object.freeze(MAX_ANS),
      MIN_ANS: Object.freeze(MIN_ANS),
      answersOpt: [],
      isShowEditContentModal: false,
      currentContent: {}
    };
  },
  methods: {
    cloneData() {
      this.answersOpt = this.answers;
    },
    changeContent(index, value) {
      this.$emit("changeContent", index, value);
    },
    handleAddAnswer() {
      const answerCounter = this.answersOpt.length;
      if (answerCounter < this.MAX_ANS) {
        let emptyAns = {
          content: "",
          correct: false,
        };
        this.answersOpt = this.answersOpt.concat([emptyAns]);
      } else {
        this.$toasted.error(`Tối đa ${this.MAX_ANS} đáp án`)
      }
    },
    deleteAns(index) {
      const currentAnsSize = this.answersOpt.length;
      if (currentAnsSize > this.MIN_ANS) {
        this.answersOpt.splice(index, 1);
        this.$emit("deleteAns", index);
      } else {
        this.$toasted.error(`Tối thiểu ${this.MIN_ANS} đáp án`);
      }
    },
    changeAnsCheckbox(index, value) {
      this.$emit('changeAns', index, value);
    },
    editContent(index, item) {
      this.currentContent.detail = item;
      this.currentContent.index = index;
      this.isShowEditContentModal = true;
    },
    submitEditContent(data) {
      this.answersOpt[this.currentContent.index].content = data;
      this.$emit("changeContent", this.currentContent.index, this.currentContent.detail.content);
      this.isShowEditContentModal = false;
    },
    cancelEditContent() {
      this.currentContent = {};
      this.isShowEditContentModal = false;
    },
    get
  },
  created() {
    this.cloneData();
  },
};
</script>
<style lang="scss" scoped>
</style>