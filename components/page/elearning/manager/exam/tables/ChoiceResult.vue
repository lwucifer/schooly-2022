<template>
  <div class="elearning-test-result elearning-choice-test-result">
    <div class="item">
      <label for="" class="text-dark content-title">Danh sách câu hỏi</label>
      <div>
        <choice-question-list
          :list="choiceQuestions"
          :answers="contents"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import IconClose from "~/assets/svg/icons/close2.svg?inline"
  import ChoiceQuestionDetail from "~/components/page/elearning/manager/exam/ChoiceQuestionDetail"
  import ChoiceQuestionList from "~/components/page/elearning/manager/exam/tables/ChoiceQuestionList"
  import { mapGetters } from "vuex" 
  import { get } from "lodash"

  const QUESTION_CREATING_STORE = "elearning/teaching/result"
  const ANS_KEYS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']

  export default {
    components: {
      IconClose,
      ChoiceQuestionDetail,
      ChoiceQuestionList
    },
    filters: {
      trueAns(info) {
        const opts = info.answers
        const optsLeng = opts.length
        
        for(let i = 0; i < optsLeng; i++) {
          const tmp = opts[i]
          if (get(tmp, 'correct', false)) {
            return ANS_KEYS[i]
          }
        }
        return '-'
      },
      ansKey(info) {
        const opts = info.answers
        const optsLeng = opts.length
        const ans = get(info, 'student.answer', '')
  
        for(let i = 0; i < optsLeng; i++) {
          const tmp = opts[i]
          if (tmp.id == ans) {
            return ANS_KEYS[i]
          }
        }
        return '-'
      }
    },
    props: {
      contents: {
        type: Array,
        // validator: value => value.every(item => ["content", "index", "student"].every(key => key in item))
      },
      loading: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        QUESTION_CREATING_STORE: Object.freeze(QUESTION_CREATING_STORE),
        currentQuestionIndex: null,
        loadingQuestion: false,
        selectedQuestion: null,
      }
    },
    
    computed: {
      ...mapGetters(QUESTION_CREATING_STORE, {
        choiceQuestions: 'choiceQuestionsOfSubmission',
        // essayQuestions: 'essayQuestionsOfBank',
        // filterPointChoice: 'choiceQuestionsPointTotal',
        // filterPointEssay: 'essayQuestionsPointTotal',
        // filterPoint: 'allPointTotal'
      }),
      updating: function () {
        return this.loading
      },
    },
    methods: {
      get
    },
  }
</script>

<style lang="scss">
</style>