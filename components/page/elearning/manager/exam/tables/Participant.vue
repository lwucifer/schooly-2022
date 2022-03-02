<template>
  <div>
    <app-table
      :heads="heads"
      :pagination="pagination"
      @pagechange="onPageChange"
      :data="list"
      :loading="updating"
    >
      <template v-slot:cell(name)="{row}">
        <td :title="get(row, 'name', '')">
          {{ get(row, 'name', '') | truncStrFilter(30) }}
        </td>
      </template>
      
      <template v-slot:cell(mark)="{row}">
        <td>
          <!--<v-popover-->
            <!--offset="10"-->
            <!--trigger="hover"-->
          <!--&gt;-->
            <span
              class="font-weight-semi-bold nowrap"
              :class="{
                'score--pass': (get(row, 'result', '') == SUBMISSION_RESULTS.PASSED),
                'score--fail': (get(row, 'result', '') == SUBMISSION_RESULTS.FAILED),
                'score--empty': (get(row, 'result', '') == SUBMISSION_RESULTS.PENDING),
              }"
            >
              <div
                v-if="isNotDo(row)"
              >
              </div>

              <div
                v-if="isPending(row)"
                class="nowrap d-flex align-items-center"
              >
                <span class="d-block">Chưa chấm</span>
                <dropdown-edit-score-menu
                  v-if="allowUploadSubmissionFile"
                  class="ml-2 elm__set-score-dropdown"
                  @submitPoint="submitPoint($event, row)"
                />
              </div>
              
              <div v-if="isMarked(row)">
                {{ get(row, 'mark', 0)}}/{{ get(row, 'points', 10) }}
                ({{ get(row, 'result')  | subResult2Txt }})
              </div>
          </span>
    
            <!--<template slot="popover">-->
              <!--{{ get(row, 'result')  | subResult2Txt }}-->
            <!--</template>-->
  
          <!--</v-popover>-->
          
        </td>
      </template>
      <template v-slot:cell(reworks)="{row}">
        <td class="text-center">
          {{ get(row, 'exams', 0) }}
        </td>
      </template>
      <template v-slot:cell(school_year)="{row}">
        <td>
          {{ get(row, 'school_year', '--') }}
        </td>
      </template>
      <template v-slot:cell(submission)="{row}">
        <td>
          <span v-if="get(row, 'submission')">
            {{ get(row, 'submission', '') | getDateTimeHH_MM_A_DD_MM_YY('en') }}
          </span>
        </td>
      </template>
      <template
        v-if="!allowUploadSubmissionFile"
        v-slot:cell(action)="{row}"
      >
        <td>
          <n-link
            class
            v-if="isPending(row) || isMarked(row)"
            title="Chi tiết"
            :to="`/elearning/manager/exams/${$route.params.id}/results?user_id=${row.id}&elearning_name=${getParamQuery('elearning_name')}&item_name=${getParamQuery('item_name')}&student_name=${get(row, 'name', '')}&student_id=${row.student_id ? row.student_id: ''}`">
            <IconArrow height="13" style="height: 1.5rem;"/>
          </n-link>
        </td>
      </template>
    </app-table>
  </div>
</template>

<script>
  import { SUBMISSION_RESULTS, SCALE_MARK } from "~/utils/constants"
  import IconArrow from "~/assets/svg/v2-icons/arrow_forward_ios_24px.svg?inline"
  import { get } from "lodash"
  import { getParamQuery } from "~/utils/common"
  import DropdownEditScoreMenu from "~/components/page/course/create/common/DropdownEditScoreMenu";
  import * as actionTypes from "~/utils/action-types"
  import { mapState } from "vuex";

  const STORE_NAMESPACE = 'elearning/teaching/evaluation'
  const EXERCISE_STORE_NAMESPACE = "elearning/teaching/exercise";

  export default {
    components: {
      IconArrow,
      DropdownEditScoreMenu
    },

    props: {
      list: {
        type: Array,
        default: () => []
      },
      pagination: {
        type: Object,
        default: () => {
          return {
            total: 0,
            size: 10,
            page: 1,
            total_elements: 0,
            first: 1,
            last: 1,
            number: 0
          }
        }
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        heads: [
          {
            name: "name",
            text: "Học sinh",
          },
          {
            name: "class_name",
            text: "Lớp",
          },
          {
            name: "school_year",
            text: "Năm học",
          },
          {
            name: "mark",
            text: "Kết quả",
          },
          {
            name: "reworks",
            text: "Số lần làm bài",
          },
          {
            name: "submission",
            text: "Thời gian nộp bài",
          },
          {
            name: "action",
            text: "",
          },
        ],
        SUBMISSION_RESULTS: SUBMISSION_RESULTS,
      }
    },

    computed: {
      updating: function () {
        return this.loading
      },
      ...mapState(EXERCISE_STORE_NAMESPACE, {
        exercise: "currentExercise",
      }),
      allowUploadSubmissionFile: function() {
        return get(this, 'exercise.data.submission_type', '') == 'UPLOAD';
      }
    },
    methods: {
      onPageChange(e) {
        this.$emit('changedPagination', e)
      },
      isNotDo(item) {
        let flat = true
        if (item.result) {
          if (this.get(item, 'result') != SUBMISSION_RESULTS.NONE) {
            flat = false
          }
        }
        return flat
      },
      isPending(item) {
        return this.get(item, 'result', false) && this.get(item, 'result') == SUBMISSION_RESULTS.PENDING
      },
      isMarked(item) {
        return this.get(item, 'result', false) &&
          this.get(item, 'result') != SUBMISSION_RESULTS.NONE &&
          this.get(item, 'result') != SUBMISSION_RESULTS.PENDING
      },
      async submitPoint(point, item) {
        console.log('point: ', point, item);
        const checkPoint = this.validatePoint(item, point);
        if (checkPoint) {
          // const choiceMark = get(item, 'choice_mark', 0) >= 0 ? get(item, 'choice_mark') : 0;
          // const actualEssayMark = point - choiceMark;

          const payload = {
            user_id: get(item, 'id', ''),
            test_id: get(this.$route, 'params.id', ''),
            mark: point,
            to_passed: false
          };
          await this.markScore(payload);
        }
      },
      validatePoint(participant, totalScore) {
        if (totalScore < 0 || totalScore > 10) {
          this.$toasted.error('Tổng điểm không hợp lệ');
          return false;
        }
        // const choiceMark = get(participant, 'choice_mark', 0) >= 0 ? get(participant, 'choice_mark') : 0;
        // const essayMax = get(participant, 'essay_point', 0) >= 0 ? get(participant, 'essay_point') : 0;
        // const actualEssayMark = totalScore - choiceMark;
        // if (actualEssayMark < 0) {
        //   this.$toasted.error('Tổng điểm không hợp lệ');
        //   return false;
        // }
        // if (actualEssayMark > essayMax) {
        //   this.$toasted.error('Điểm số phần tự luận không hợp lệ');
        //   return false;
        // }
        return true;
      },
      async markScore(payload) {
        try {
          const res = await this.$store.dispatch(
            `${STORE_NAMESPACE}/${actionTypes.ELEARNING_TEACHING_EVALUATION.ADD}`,
            payload
          )

          if (get(res, "success", false)) {
            this.$emit("doneMark", payload)
            this.$toasted.success(
              get(res, "message", "")
            );
            return;
          } else {
            this.$toasted.error(
              get(res, "message", "")
            );
            return;
          }
        } catch (error) {

        } finally {

        }
      },
      getParamQuery,
      get
    },
  }
</script>

<style lang="scss">
</style>