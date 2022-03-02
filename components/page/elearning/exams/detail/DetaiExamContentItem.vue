<template>
  <div class="detail-content-item bg-input-gray">
    <div class="row">
      <div class="col-md-9">
        <div class="item-text">
          <div class="body-1 mb-3 font-weight-medium" :class="classTestName">
            {{ get(test, "name", "") }}
          </div>

          <div
            class="item-text__content d-flex align-items-center justify-content-between"
          >
            <div>
              <p>
                <span>Thể loại:</span>
                <span>{{ get(test, "category", "") }}</span>
              </p>

              <p>
                <span>Số câu hỏi:</span>
                <span>{{
                  get(test, "choice_questions", 0) +
                    get(test, "essay_questions", 0)
                }}</span>
              </p>

              <p>
                <span>Số lần làm bài tối đa:</span>
                <span>{{ get(test, "settings.works", 0) }}</span>
              </p>
            </div>

            <div>
              <p>
                <span>Bắt đầu:</span>
                <span>{{ get(test, "start_time", "") }}</span>
              </p>

              <p>
                <span>Kết thúc:</span>
                <span>{{ get(test, "end_time", "") }}</span>
              </p>

              <p>
                <span>Thời gian làm bài:</span>
                <span>{{ get(test, "settings.duration", 0) }} phút</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="item-btn">
          <p class="mb-3 text-center">
            <IconGroup class="mr-2 icon vertical-middle" />
            {{ get(test, "workings", 0) }} Lượt thi
          </p>
          <app-button
            @click="handleJoinTest"
            fullWidth
            :color="colorButtonJoinTest"
            :class="classButtonJoinTest"
          >
            {{ contentButtonJoinTest }}
          </app-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconGroup from "~/assets/svg/v2-icons/group_24px.svg?inline";
import { get } from "lodash";

export default {
  components: {
    IconGroup,
  },

  computed: {
    classTestName() {
      return get(this, "test.result.status", "") == "PASSED"
        ? "text-primary"
        : "" || get(this, "test.result.status", "") == "PENDING"
        ? "text-warning"
        : "" || get(this, "test.result.status", "") == "NONE"
        ? "text-dark"
        : "";
    },
    contentButtonJoinTest() {
      if (get(this, "test.result.status", "") == "PASSED") {
        return "Xem kết quả";
      }
      if (get(this, "test.result.status", "") == "PENDING") {
        return "Chờ chấm điểm";
      }
      return "Vào thi";
    },
    classButtonJoinTest() {
      return get(this, "test.result.status", "") == "NONE"
        ? "border-button"
        : "";
    },
    colorButtonJoinTest() {
      return "primary";
      return get(this, "test.result.status", "") == "PASSED"
        ? "primary"
        : "" || get(this, "test.result.status", "") == "PENDING"
        ? "warning"
        : "" || get(this, "test.result.status", "") == "NONE"
        ? "default"
        : "";
    },
  },

  props: {
    propOutline: {
      type: Boolean,
      default: false,
    },
    test: {},
  },

  methods: {
    handleJoinTest() {
      this.$router.push(`/elearning/exam/test?id=${this.test.id}`);
    },

    get,
  },
};
</script>

<style lang="scss">
@import "~assets/scss/components/elearning/exams/detail/_detail-exam-content-item.scss";
</style>
