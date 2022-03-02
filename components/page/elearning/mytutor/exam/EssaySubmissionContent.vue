<template>
  <div class="elearning-writting-test-result elearning-test-result">
    <div class="item">
      <label for="" class="text-dark content-title">Danh sách câu hỏi</label>
      <div>
        <essay-question-list
          :list="essayQuestions"
          :answers="contents"
        />
      </div>
    </div>

    <div class="item" v-if="note">
      <label for="" class="text-dark content-title">Nhận xét bài làm</label>
      <div class="content--note">
        <div v-if="note" v-html="note"></div>
        <div v-else class="text-center caption text-gray-2">Chưa có nhận xét</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { get } from "lodash"
  import AttachmentAssets from "~/components/page/elearning/mytutor/exam/AttachmentAssets"
  import EssayQuestionList from "~/components/page/elearning/mytutor/exam/tables/EssayQuestionList"
  import { mapGetters } from "vuex" 

  const QUESTION_CREATING_STORE = "elearning/teaching/result"

  export default {
    components: {
      AttachmentAssets,
      EssayQuestionList
    },
    props: {
      contents: {
        type: Array,
        required: true,
        // validator: value => value.every(item => ["content", "index"].every(key => key in item))
      },
      // questions: {
      //   type: Array,
      //   default: () => []
      // },
      note: {
        type: String
      }
    },
    computed: {
      ...mapGetters(QUESTION_CREATING_STORE, {
        essayQuestions: 'essayQuestionsOfSubmission',
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
