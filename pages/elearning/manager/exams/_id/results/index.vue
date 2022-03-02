<template>
  <div class="container">
    <breadcrumb />
    <div class="row">
      <div class="col-md-3">
        <ElearningManagerSide active="3"/>
      </div>
      <div class="col-md-9">
        <sub-block-section
          title="Kết quả làm bài"
          has-icon
        >
          <template v-slot:content>
            <div v-if="pageLoading">
              <div class="row">
                <div class="col-md-6"><vcl-facebook /></div>
                <div class="col-md-6"><vcl-list /></div>
                <div class="col-12"><vcl-table /></div>
              </div>
            </div>
            
            <div v-else class="elearning-manager-content p-0">
              <div class="elearning-manager-content__main py-2">
                <component
                  :is="currentComponent"
                  :detail="result"
                  @refreshSubmission="refreshData"
                >
                </component>
              </div>
            </div>
          </template>
        </sub-block-section>
      </div>
    </div>
  </div>
</template>

<script>
  import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide"
  import HeaderBreadcrumb from "~/components/page/elearning/HeadBreadcrumb"
  import { VclFacebook, VclList, VclTable } from "vue-content-loading"
  import { mapState, mapActions } from "vuex"
  import * as actionTypes from "~/utils/action-types"
  import { get, isEmpty } from "lodash"
  import { EXERCISE_TYPES, PAGE_SIZE } from "~/utils/constants"
  import { getParamQuery, initBreadcrumb, createPageTitle, initPageTitle } from "~/utils/common"
  import { exCate2Txt } from "~/plugins/filters"

  const ChoiceSubmission = () => import('~/components/page/elearning/manager/exam/ChoiceResult')
  const EssaySubmission = () => import('~/components/page/elearning/manager/exam/EssayResult')
  const MixSubmission = () => import('~/components/page/elearning/manager/exam/MixResult')
  
  const STORE_NAMESPACE = "elearning/teaching/result"
  const EXERCISE_STORE_NAMESPACE = "elearning/teaching/exercise"
  const QUESTION_CREATING_STORE = "elearning/teaching/result"
  
  export default {
    layout: "manage",
    
    components: {
      ElearningManagerSide,
      HeaderBreadcrumb,
      ChoiceSubmission,
      EssaySubmission,
      MixSubmission,
      VclFacebook,
      VclList,
      VclTable
    },
    
    data() {
      return {
        pageLoading: true,
        item: {},
      }
    },
    computed: {
      ...mapState("auth", ["loggedUser"]),
      ...mapState(EXERCISE_STORE_NAMESPACE, {
        exercise: 'currentExercise'
      }),
      ...mapState(STORE_NAMESPACE, {
        result: 'currentResult'
      }),
      currentComponent: function () { // either Objective Test or Writing Test
        const MATCHED_COMPONENTS = {
          [EXERCISE_TYPES.CHOICE]: "ChoiceSubmission",
          [EXERCISE_TYPES.ESSAY]: "EssaySubmission",
          [EXERCISE_TYPES.MIX]: "MixSubmission",
        }
        
        return MATCHED_COMPONENTS[get(this, 'result.type')]
      },
      breadcrumb: function() {
        let data = [
          {
            text: exCate2Txt(this.get(this.exercise, 'category', '')),
            link: '/elearning/manager/exams'
          },
          {
            text: get(this, 'exercise.title', ''),
            link: `/elearning/manager/exams/${this.exercise.id}/participant`
          },
          {
            text: get(this, 'result.name', ''),
            link: '/elearning/manager/exams'
          }
        ]
        return data
      }
    },
    mounted() {
      // const elearningName = getParamQuery('elearning_name')
      // const exerciseName = getParamQuery('item_name')
      // const studentName = this.get(this, 'result.name', '')
      const breadcrumb = [
        {
          title: 'Quản lý E-learning',
          to: '/elearning'
        },
        {
          title: 'Bài tập và bài kiểm tra',
          to: '/elearning/manager/exams'
        },
        // {
        //   title: elearningName,
        //   to: `/elearning/manager/exams/exercise?elearning_id=${getParamQuery('elearning_id')}&elearning_name=${elearningName}`
        // },
        // {
        //   title: exerciseName,
        //   to: '/'
        //   // to: '/elearning/manager/exams/exercise?elearning_id=${getParamQuery('elearning_id')}&elearning_name=${elearningName}'
        // },
        // {
        //   title: studentName,
        //   to: ''
        // }
      ]
      initBreadcrumb(this, breadcrumb);
      initPageTitle(this, createPageTitle('Quản lý bài tập & bài kiểm tra'));
      this.pageLoading = false;
    },
    methods: {
      ...mapActions(QUESTION_CREATING_STORE, {
        getQuestionsOfSubmission: actionTypes.ELEARNING_TEACHING_RESULT.SUBMISSION_QUESTION,
      }),
      async getDetail() {
        const exerciseId = this.$route.params.id;
        const studentId = getParamQuery('student_id');
        const userId = getParamQuery('user_id');
        const userUuId = getParamQuery('sender_id');
        const params = {
          test_id: exerciseId,
          // student_id: studentId,
          user_id: userId,
          user_uuid: userUuId
        }
        await this.$store.dispatch(
          `${STORE_NAMESPACE}/${actionTypes.ELEARNING_TEACHING_RESULT.DETAIL}`,
          { params }
        )
      },
      async getExerciseDetail() {
        const exerciseId = this.$route.params.id
        if (isEmpty(this.exercise) || get(this, 'exercise.id') != exerciseId) {
          await this.$store.dispatch(
            `${EXERCISE_STORE_NAMESPACE}/${actionTypes.ELEARNING_TEACHING_EXERCISE.DETAIL}`, exerciseId
          )
        }
      },
      async getQuestions() {
        try {
          const exerciseId = this.$route.params.id;
          const userId = this.$route.query.user_id;
          const res = await this.getQuestionsOfSubmission({
            test_id: exerciseId,
            user_id: userId,
            size: PAGE_SIZE.MAXIMIZE,
            page: 1
          });
        } catch (error) {
          this.$toasted.error('Xảy ra lỗi khi lấy dữ liệu câu hỏi. Vui lòng thử lại');
        } finally {
        }
      },
      async refreshData() {
        await Promise.all([
          this.getDetail(),
          this.getQuestions()
        ])
        // this.getExerciseDetail();
      },
      get
    },
    
    async created() {
      await Promise.all([
        this.refreshData()
      ]);
    }
  };
</script>

<style lang="scss">
  @import "~/assets/scss/components/elearning/manager/_elearning-manager-content.scss";
  @import "~/assets/scss/components/elearning/manager/_elearning-manager-result.scss";
</style>