<template>
  <div class="elearning-writting-test-result elearning-test-result">
    <div class="item">
      <label for="" class="text-dark content-title">Danh sách câu hỏi</label>

      <div>
        <p class="text-primary mb-3">
          <span>I.</span>&nbsp;Trắc nghiệm
          <span>({{ choiceMax }} điểm)</span>
        </p>
        <choice-question-list
          :list="choiceQuestions"
          :answers="contents"
        />
        <score-box
          :score="choiceMark"
          :status="status"
          needScore
          desc="*Điểm bài tập trắc nghiệm được tính tự động"
          class="mb-3"
        >
        </score-box>
      </div>

      <div>
        <p class="text-primary mb-3">
          <span>I.</span>&nbsp;Tự luận
          <span>({{ essayMax }} điểm)</span>
        </p>
        <essay-question-list
          :list="essayQuestions"
          :answers="contents"
        />
        <score-box
          v-if="hasMark"
          :score="essayMark"
          :status="status"
          class="mb-3"
        >
        </score-box>
      </div>
    </div>

    <!-- <div class="item" v-if="note">
      <label for="" class="text-dark content-title">Nhận xét bài làm</label>
      <div class="content--note">
        <div v-if="note" v-html="note"></div>
        <div v-else class="text-center caption text-gray-2">Chưa có nhận xét</div>
      </div>
    </div> -->
  </div>
</template>

<script>
  import { get } from "lodash"
  import AttachmentAssets from "~/components/page/elearning/manager/exam/AttachmentAssets"
  import EssayQuestionList from "~/components/page/elearning/manager/exam/tables/EssayQuestionList"
  import ChoiceQuestionList from "~/components/page/elearning/manager/exam/tables/ChoiceQuestionList"
  import ScoreBox from "~/components/page/elearning/manager/exam/ScoreBox"
  import { mapGetters } from "vuex" 

  const QUESTION_CREATING_STORE = "elearning/teaching/result"

  export default {
    components: {
      AttachmentAssets,
      EssayQuestionList,
      ChoiceQuestionList,
      ScoreBox
    },
    props: {
      contents: {
        type: Array,
        required: true,
        // validator: value => value.every(item => ["content", "index"].every(key => key in item))
      },
      note: {
        type: String
      },
      status: String, // passed | failed | none | pending
      isPass: Boolean,
      hasMark: Boolean,
      choiceMark: Number|String,
      essayMark: Number|String,
      choiceMax: Number|String,
      essayMax: Number|String
    },
    computed: {
      ...mapGetters(QUESTION_CREATING_STORE, {
        essayQuestions: 'essayQuestionsOfSubmission',
        choiceQuestions: 'choiceQuestionsOfSubmission',
      }),
    },
    data() {
      return {
        QUESTION_CREATING_STORE: Object.freeze(QUESTION_CREATING_STORE)
      }
    },
    methods: {
      get
    }
  }
</script>

<style scoped>
</style>
