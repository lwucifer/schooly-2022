<template>
  <div class="view-exam-info bg-white px-4 py-4">
    <div class="template-view-exam">
      <h4 class="template-view-exam__title">
        {{ get(test, "name", "") }}
      </h4>

      <div class="template-view-exam__content">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <p class="mb-4 text-dark">
              <IconFlag class="icon mr-2" /> {{ get(test, "grade.name", "") }}
            </p>
            <p class="text-dark">
              <IconDoneAll class="icon mr-2" /> Số lần làm bài tối đa:
              {{ get(test, "participants", 0) }}
            </p>
          </div>

          <div>
            <p class="mb-4 text-dark">
              <IconBorderColor class="icon mr-2" />Môn học:
              {{ get(test, "subject.name", "") }}
            </p>
            <p class="text-dark">
              <IconAlarmOn class="icon mr-2" /> Bắt đầu:
              {{ get(test, "settings.start_time", "") }}
            </p>
          </div>

          <div>
            <p class="mb-4 text-dark">
              <IconImportContacts class="icon mr-2" /> Loại đề thi: Hỗn hợp
            </p>
            <p class="text-dark">
              <IconAlarmOff class="icon mr-2" /> Kết thúc:
              {{ get(test, "settings.end_time", "") }}
            </p>
          </div>
        </div>

        <div class="time-exam text-center">
          <div class="number-question">
            <p>{{ get(test, "questions", 0) }}</p>
            <p>câu hỏi</p>
          </div>

          <div class="line"></div>

          <div class="minutes">
            <p>{{ get(test, "settings.duration", 0) }}</p>
            <p>phút</p>
          </div>
        </div>

        <div class="text-center mb-6">
          <app-button
            @click="handleJoinTest"
            color="primary"
            style="padding: 1.2rem 7rem"
            >BẮT ĐẦU LÀM BÀI</app-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconFlag from "~/assets/svg/v2-icons/flag_24px.svg?inline";
import IconBorderColor from "~/assets/svg/v2-icons/border_color_24px.svg?inline";
import IconImportContacts from "~/assets/svg/v2-icons/import_contacts_24px.svg?inline";
import IconDoneAll from "~/assets/svg/v2-icons/done_all_24px.svg?inline";
import IconAlarmOn from "~/assets/svg/v2-icons/alarm_on_24px.svg?inline";
import IconAlarmOff from "~/assets/svg/v2-icons/alarm_off_24px.svg?inline";
import { get } from "lodash";

export default {
  components: {
    IconFlag,
    IconBorderColor,
    IconImportContacts,
    IconDoneAll,
    IconAlarmOn,
    IconAlarmOff,
  },

  props: {
    test: {},
  },

  methods: {
    get,

    handleJoinTest() {
      this.$router.push(`/elearning/do-test?test_id=${this.$route.query.id}`);
    },
  },
};
</script>

<style lang="scss">
@import "~assets/scss/components/elearning/exams/_template-view-exam.scss";
</style>
