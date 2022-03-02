<template>
  <div>
    <app-table
      :heads="heads"
      :pagination="pagination"
      @pagechange="onPageChange"
      @sort="sortTable"
      :data="list"
      :loading="loading"
    >
      <template v-slot:cell(name)="{row}">
        <td :title="get(row, 'name', '')">
          <span>
            {{ get(row, 'name', '') | truncStrFilter(30) }}
            <sup
              class="elm--required-symbol"
              v-if="get(row, 'required', false)"
            >
              <icon-star height="14" width="14" />
            </sup>
          </span>
        </td>
      </template>

      <template v-slot:cell(deadline)="{row}">
        <td>
          <span v-if="get(row, 'deadline', false)">{{ get(row, 'deadline') | getDateBirthday }}</span>
          <span v-else>-</span>
        </td>
      </template>

      <template v-slot:cell(status)="{row}">
        <td>
          <span
             v-if="get(row, 'status', '') == SUBMISSION_RESULTS.NONE"
             class="nowrap"
             :class="statusCls(row)"
            >
            <span>{{ getScoreDetail(row)}}</span>
          </span>
          <span v-else>
            <v-popover trigger="hover" placement="bottom-end" popover-class="tooltip--submit-status">
              <span class="nowrap" :class="statusCls(row)">
                <span>{{ getScoreDetail(row)}}</span>
              </span>
              <template slot="popover" class="tooltip-detail">
                <div>
                  <submit-status
                    :timestamp="get(row, 'submission_time', false) ? getDateTimeHhMmDdMmYyDash(get(row, 'submission_time')): null"
                    :scoreDetail="getScoreDetail(row)"
                    :result="get(row, 'status')"
                  ></submit-status>
                </div>
              </template>
            </v-popover>
          </span>
        </td>
      </template>

      <template v-slot:cell(action)="{row}">
        <td>
          <button
            v-if="hasSubmission(row) && !isPending(row)"
            class="text-warning"
            @click="showSubmission(row)"
          >Bài làm</button>
          <n-link
            v-if="!hasSubmission(row) && !isPending(row)"
            class
            title="Làm bài tập"
            :to="`/elearning/do-test?test_id=${row.id}&submission_type=${row.submission_type}`"
          >
            <IconArrow height="13" />
          </n-link>
        </td>
      </template>

      <template v-slot:cell(type)="{row}">
        <td>
          <span class="nowrap">{{ get(row, 'type', '') | exType2Txt }}</span>
        </td>
      </template>

      <template v-slot:cell(created)="{row}">
        <td>{{ get(row, 'created', '') | moment("DD/MM/YYYY") }}</td>
      </template>
    </app-table>
    <!--End table-->
    <p class="elm--text-desc text-center mt-4" v-if="list.length > 0">
      <i>
        Các bài tập có đánh dấu * là các bài tập
        <b>bắt buộc</b>
      </i>
    </p>

    <ModalExerciseResult
      v-if="isShowModal"
      :loading="isLoadingSubmissionList"
      @close="isShowModal = false"
    />
  </div>
</template>

<script>
import { get } from "lodash";
import IconArrow from "~/assets/svg/v2-icons/arrow_forward_ios_24px.svg?inline";
import IconStar from "~/assets/svg/v2-icons/star_rate_18px.svg?inline";
import SubmitStatus from "~/components/page/elearning/mycourses/SubmitStatus";
import { subResult2Txt } from "~/plugins/filters";
import { SUBMISSION_RESULTS, EXERCISE_CATEGORIES } from "~/utils/constants";
import { getDateTimeHhMmDdMmYyDash } from "~/plugins/filters";
import { mapActions, mapGetters } from "vuex";
import { RESPONSE_SUCCESS } from "~/utils/config";
import ModalExerciseResult from "~/components/page/elearning/study/v2/exercise/ModalExerciseResult";

export default {
  components: {
    IconArrow,
    IconStar,
    SubmitStatus,
    ModalExerciseResult
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
        };
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShowModal: false,
      isLoadingSubmissionList: false,
      heads: [
        {
          name: "name",
          text: "Tiêu đề bài tập"
        },
        {
          name: "type",
          text: "Thể loại"
        },
        {
          name: "deadline",
          text: "Hạn nộp"
        },
        {
          name: "status",
          text: "Trạng thái"
        },
        {
          name: "action",
          text: ""
        }
      ],
      SUBMISSION_RESULTS: SUBMISSION_RESULTS,
      EXERCISE_CATEGORIES: EXERCISE_CATEGORIES,
    };
  },

  computed: {
    ...mapGetters("auth", ["isTeacherRole", "isStudentRole"])
  },
  methods: {
    ...mapActions("elearning/study/study-exercise", [
      "elearningSudyExerciseQuestionList",
      "elearningSudyExerciseSubmissionList"
    ]),
    onPageChange(e) {
      this.$emit("changedPagination", e);
    },
    sortTable(info) {
      this.$emit("changedSort", info);
    },
    statusCls(item) {
      return {
        "text-primary": get(item, "status") === SUBMISSION_RESULTS.PASSED,
        "text-warning":
          get(item, "status") === SUBMISSION_RESULTS.PENDING ||
          get(item, "status") === SUBMISSION_RESULTS.NONE,
        "text-pink-2": get(item, "status") === SUBMISSION_RESULTS.FAILED
      };
    },
    hasScore(item) {
      return (
        get(item, "status") === SUBMISSION_RESULTS.PASSED ||
        get(item, "status") === SUBMISSION_RESULTS.FAILED
      );
    },
    getScoreDetail(item) {
      let desc = "";
      if (this.hasScore(item)) {
        desc = `(${get(item, "mark", 0)}/${get(
          item,
          "max_score",
          0
        )}) ${subResult2Txt(get(item, "status", 10))}`;
      } else {
        desc = `${subResult2Txt(get(item, "status"))}`;
      }
      return desc;
    },
    async showSubmission(item) {
      try {
        this.isShowModal = true;
        await this.getExQuestionList(item);
      } catch (error) {

      } finally {

      }
    },
    async getExQuestionList(item) {
      try {
        this.isLoadingSubmissionList = true;
        const test_id = item.id;
        const res = await Promise.all([
          this.elearningSudyExerciseQuestionList({ test_id }),
          this.elearningSudyExerciseSubmissionList({ test_id })
        ])
        if (!res[0].success == RESPONSE_SUCCESS) {
          this.$toasted.error(res[0].message);
        }
        if (!res[1].success == RESPONSE_SUCCESS) {
          this.$toasted.error(res[1].message);
        }
      } catch (error) {

      } finally {
        this.isLoadingSubmissionList = false;
      }
    },
    isPending(item) {
      return (get(item, "status", '') == SUBMISSION_RESULTS.PENDING) ? true : false;
    },
    hasSubmission(item) {
      if (
        (get(item, "status", '') == SUBMISSION_RESULTS.PASSED)
      ) {
        return true;
      } else if (get(item, 'remain_works', 0) <= 0 && get(item, 'required', false)) {
        return true
      }
      return false;
    },
    subResult2Txt,
    getDateTimeHhMmDdMmYyDash,
    get
  }
};
</script>

<style lang="scss">
</style>
