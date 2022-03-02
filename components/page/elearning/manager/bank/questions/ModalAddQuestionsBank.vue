<template>
  <app-modal
    :width="666"
    :component-class="{ 'modal-create-bank create-question onTop': true }"
    :footer="false"
    title="Thêm mới ngân hàng câu hỏi"
    @close="$emit('click-close')"
  >
    <div slot="content" class="content">
      <div>
        <div class="filter-form__item ml-0 mr-0">
          <label class="label">Tiêu đề</label>
          <div>
            <app-input
              placeholder="Nhập tiêu đề"
              :counter="150"
              v-model="payloadAddQuestionBank.name"
              @input="handleCheckName"
              @handleBlur="handleCheckName"
              class="mb-2"
            />
            <app-error :error="get(error, 'name', '')"></app-error>
          </div>
        </div>
        <div class="d-flex-center">
          <div class="filter-form__item ml-0 mr-4">
            <label class="label">Khối</label>
            <app-vue-select
              style="width: 19rem"
              class="app-vue-select filter-form__item__selection"
              label="name"
              placeholder="Chọn khối"
              has-border
              :options="grades"
              :reduce="(item) => item.id"
              @input="handleChangeGrade"
              :value="payloadAddQuestionBank.grade_id"
            ></app-vue-select>
          </div>
          <div class="filter-form__item ml-auto">
            <label class="label">Môn học</label>
            <app-vue-select
              style="width: 19rem"
              class="app-vue-select filter-form__item__selection"
              label="name"
              placeholder="Chọn môn học"
              has-border
              :options="payloadAddQuestionBank.grade_id ? subjects : []"
              :reduce="(item) => item.id"
              @input="handleChangeSubject"
              :value="payloadAddQuestionBank.subject_id"
            ></app-vue-select>
          </div>
        </div>
      </div>

      <label class="label">Loại câu hỏi</label>
      <div class="row mt-3">
        <div
          class="col-3"
          @click="payloadAddQuestionBank.type = questionBankTypeArr[0]['id']"
        >
          <div
            :class="
              payloadAddQuestionBank.type == questionBankTypeArr[0]['id']
                ? 'active'
                : ''
            "
          >
            <IconQuestion1 />
            <p>{{ questionBankTypeArr[0]["name"] }}</p>
          </div>
        </div>
        <div
          class="col-3"
          @click="payloadAddQuestionBank.type = questionBankTypeArr[1]['id']"
        >
          <div
            :class="
              payloadAddQuestionBank.type == questionBankTypeArr[1]['id']
                ? 'active'
                : ''
            "
          >
            <IconQuestion2 />
            <p>{{ questionBankTypeArr[1]["name"] }}</p>
          </div>
        </div>
        <div
          class="col-3"
          @click="payloadAddQuestionBank.type = questionBankTypeArr[2]['id']"
        >
          <div
            :class="
              payloadAddQuestionBank.type == questionBankTypeArr[2]['id']
                ? 'active'
                : ''
            "
          >
            <IconQuestion3 />
            <p>{{ questionBankTypeArr[2]["name"] }}</p>
          </div>
        </div>
        <div
          class="col-3"
          @click="payloadAddQuestionBank.type = questionBankTypeArr[3]['id']"
        >
          <div
            :class="
              payloadAddQuestionBank.type == questionBankTypeArr[3]['id']
                ? 'active'
                : ''
            "
          >
            <IconQuestion6 />
            <p>{{ questionBankTypeArr[3]["name"] }}</p>
          </div>
        </div>
      </div>
      <div class="row">
        <div
          class="col-3"
          @click="payloadAddQuestionBank.type = questionBankTypeArr[4]['id']"
        >
          <div
            :class="
              payloadAddQuestionBank.type == questionBankTypeArr[4]['id']
                ? 'active'
                : ''
            "
          >
            <IconQuestion5 />
            <p>{{ questionBankTypeArr[4]["name"] }}</p>
          </div>
        </div>
        <div
          class="col-3"
          @click="payloadAddQuestionBank.type = questionBankTypeArr[5]['id']"
        >
          <div
            :class="
              payloadAddQuestionBank.type == questionBankTypeArr[5]['id']
                ? 'active'
                : ''
            "
          >
            <IconQuestion4 />
            <p>{{ questionBankTypeArr[5]["name"] }}</p>
          </div>
        </div>
        <div
          class="col-3"
          @click="payloadAddQuestionBank.type = questionBankTypeArr[6]['id']"
        >
          <div
            :class="
              payloadAddQuestionBank.type == questionBankTypeArr[6]['id']
                ? 'active'
                : ''
            "
          >
            <IconQuestion7 />
            <p>{{ questionBankTypeArr[6]["name"] }}</p>
          </div>
        </div>
      </div>

      <div class="buttons">
        <app-button color="white" class="mr-3" @click="$emit('click-close')"
          >Hủy</app-button
        >
        <app-button @click="handleAddQuestionBank" :disabled="!submit"
          >Xác nhận</app-button
        >
      </div>
    </div>
  </app-modal>
</template>

<script>
import IconQuestion1 from "~/assets/svg/images/question1.svg?inline";
import IconQuestion2 from "~/assets/svg/images/question2.svg?inline";
import IconQuestion3 from "~/assets/svg/images/question3.svg?inline";
import IconQuestion4 from "~/assets/svg/images/question4.svg?inline";
import IconQuestion5 from "~/assets/svg/images/question5.svg?inline";
import IconQuestion6 from "~/assets/svg/images/question6.svg?inline";
import IconQuestion7 from "~/assets/svg/images/question7.svg?inline";
import { get } from "lodash";
import { mapState } from "vuex";
import { questionBankType, questionBankTypeArr } from "~/utils/common";

export default {
  components: {
    IconQuestion1,
    IconQuestion2,
    IconQuestion3,
    IconQuestion4,
    IconQuestion5,
    IconQuestion6,
    IconQuestion7,
  },

  props: {
    visible: Boolean,
  },

  computed: {
    ...mapState("auth", {
      userLogin: "token",
    }),
    ...mapState("elearning/manager/bank/question/questions", {
      grades: "grades",
      subjects: "subjects",
    }),
  },

  data() {
    return {
      questionBankTypeArr,
      questionBankType,
      submit: true,
      error: {
        name: "",
      },
      payloadAddQuestionBank: {
        type: "ESSAY", // ESSAY, SINGLE_CHOICE, MULTIPLE_CHOICE, WORD_CHOICE, YES_NO, FILL_IN_BLANK, WORD_MATCH
        name: "",
        grade_id: "",
        subject_id: "",
      },
    };
  },

  watch: {
    "payloadAddQuestionBank.grade_id": {
      handler: function() {
        const params = {
          school_id: get(this, "userLogin.organization.id", ""),
          grade: this.payloadAddQuestionBank.grade_id,
        };
        this.$store.dispatch(
          "elearning/manager/bank/question/questions/getSubjects",
          params
        );
      },
    },
  },

  methods: {
    get,

    async handleAddQuestionBank() {
      this.submit = false;
      try {
        const res = await this.$axios({
          url: "/elearning/teaching/manage/question_bank",
          method: "POST",
          data: this.payloadAddQuestionBank,
        });
        this.submit = true;
        if (get(res, "data.success", false)) {
          this.$store.dispatch(
            "elearning/manager/bank/question/questions/getQuestions"
          );
          this.$toasted.success("Thành công");
          this.$emit("click-close");
          return;
        }
        this.$toasted.error(get(res, "data.message", "Có lỗi xảy ra"));
      } catch (error) {
        this.submit = true;
        this.$toasted.error("Có lỗi xảy ra");
      }
    },

    handleChangeSubject(subject_id) {
      this.payloadAddQuestionBank.subject_id = subject_id;
    },

    handleChangeGrade(grade_id) {
      this.payloadAddQuestionBank.grade_id = grade_id;
    },

    handleCheckName(value) {
      let check = true;
      this.error.name = "";

      if (!get(this, "payloadAddQuestionBank.name", true)) {
        check = false;
        this.error.name = "Bạn cần nhập tiêu đề ngân hàng câu hỏi";
        return check;
      }

      if (get(this, "payloadAddQuestionBank.name.length", 0) > 150) {
        check = false;
        this.error.name =
          "Tiêu đề ngân hàng câu hỏi vượt quá số ký tự cho phép";
        return check;
      }

      return check;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/bank/_questions.scss";
</style>
