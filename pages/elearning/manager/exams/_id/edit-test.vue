<template>
  <div class="container">
    <breadcrumb />
    <div class="row">
      <div class="col-md-3">
        <ElearningManagerSide active="4" />
      </div>
      <div class="col-md-9">
        <EditExam
          :dataTest="getObjBankExamEdit"
          @goBack="goBack"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
  import { mapState, mapActions } from "vuex"
  import * as actionTypes from "~/utils/action-types"
  import { get } from "lodash"
  import { useEffect, getParamQuery, initBreadcrumb, createPageTitle, initPageTitle } from "~/utils/common"
  import EditExam from "~/components/page/course/create/exams/v2/EditExam";

  import { CATEGORY_TEST, EXERCISE_CATEGORIES, PAGE_SIZE } from '~/utils/constants'

  const EXERCISE_CREATING_STORE = "elearning/creating/creating-excercises"; // to CRUD exercises into bank
  const QUESTION_CREATING_STORE = "elearning/creating/creating-question"; // to CRUD question into bank
  const EXAM_STORE = `elearning/manager/bank/exam`;

  export default {
    layout: "manage",
    
    components: {
      ElearningManagerSide,
      EditExam
    },
    filters: {
    },
    data() {
      return {
        EXERCISE_CREATING_STORE: Object.freeze(EXERCISE_CREATING_STORE),
        QUESTION_CREATING_STORE: Object.freeze(QUESTION_CREATING_STORE),
        isLoadingExerciseDetail: false,
        isLoadingQuestionList: false,
      }
    },
    computed: {
      ...mapState(EXAM_STORE, ["getObjBankExamEdit"]),
    },
    
    methods: {
      ...mapActions(EXERCISE_CREATING_STORE, {
        getExerciseDetail: actionTypes.ELEARNING_CREATING_EXERCISES.DETAIL,
        updateExercise: actionTypes.ELEARNING_CREATING_EXERCISES.UPDATE
      }),
      ...mapActions(QUESTION_CREATING_STORE, {
        getQuestions: actionTypes.ELEARNING_CREATING_QUESTIONS_OF_BANK.LIST,
      }),
      async getExeDetail() {
        try {
          this.isLoadingExerciseDetail = true;
          const examId = this.$route.params.id;
          await Promise.all([
            // Get detail of current exercise
            this.$store.dispatch(
              `${EXAM_STORE}/${actionTypes.BANK_EXAM.DETAIL_EXAM_EDIT}`,
              examId
            ),
            // Get list questions of exercise
            this.$store.dispatch(
              `${EXAM_STORE}/${actionTypes.BANK_EXAM.DETAIL_EXAM}`,
              {
                parent_id: examId,
                parent: CATEGORY_TEST.TEST,
                size: PAGE_SIZE.MAXIMIZE,
                page: 1,
              }
            ),
          ]);
        } catch (error) {
          this.$toasted.error('Xảy ra lỗi khi lấy dữ liệu bài tập. Vui lòng thử lại');
        } finally {
          this.isLoadingExerciseDetail = false;
        }
      },
      async getQuestionsOfExe() {
        try {
          this.isLoadingQuestionList = true;
          const exerciseId = this.$route.params.id;
          const res = await this.getQuestions({
            parent_id: exerciseId,
            parent: "TEST",
            size: PAGE_SIZE.MAXIMIZE,
            page: 1
          });
          if (!get(res, 'success', false)) {
            this.$toasted.error(get(res, 'message', 'Xảy ra lỗi khi lấy dữ liệu câu hỏi. Vui lòng thử lại'));
          }
        } catch (error) {
          this.$toasted.error('Xảy ra lỗi khi lấy dữ liệu câu hỏi. Vui lòng thử lại');
        } finally {
          this.isLoadingQuestionList = false;
        }
      },
      goBack() {
        this.$router.push("/elearning/manager/exams")
      },
      getParamQuery,
      get
    },
    
    async created() {
      await this.getExeDetail();
    },
    mounted() {
      const breadcrumb = [
        {
          title: 'Quản lý E-learning',
          to: '/elearning'
        },
        {
          title: 'Bài tập và bài kiểm tra',
          to: '/elearning/manager/exams'
        },
      ]
      initBreadcrumb(this, breadcrumb);
      initPageTitle(this, createPageTitle('Quản lý bài tập & bài kiểm tra'));
    }
  };
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/manager/_elearning-manager-content.scss";
</style>