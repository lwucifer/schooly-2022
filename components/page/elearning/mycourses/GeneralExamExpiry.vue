<template>
  <div class="wrap-general-exam-expiry">
    <h4 class="mb-4">Bài kiểm tra sắp hết hạn</h4>
    <app-table :heads="heads" :data="deadlineList">
      <template v-slot:cell(title)="{ row }">
        <td style="width:60%">
          <n-link
            :to="`/elearning/${row.elearning_id}/study?elearning_id=${row.elearning_id}&category_type=TEST`"
            style="text-decoration: none"
          >{{row.title}}</n-link>
        </td>
      </template>
      <template v-slot:cell(date)="{ row }">
        <td style="width:25%">
          <span
            v-if="row.deadline"
          >{{ getLocalDateTime(row.deadline) | moment("HH:mm") }} ngày {{ row.deadline | moment("DD/MM/YYYY") }}</span>
        </td>
      </template>
      <template v-slot:cell(status)="{ row }">
        <td style="width:60%">
          <span v-if="row.status == 1" class="text-primary">Đã nộp</span>
          <span v-if="row.status == 0">Chưa nộp</span>
        </td>
      </template>
    </app-table>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
import { getLocalDateTime } from "~/utils/moment";
const STORE_OVERVIEW = "elearning/study/study-overview";
export default {
  data() {
    return {
      heads: [
        {
          name: "title",
          text: "Tiêu đề"
        },
        {
          name: "date",
          text: "Hạn nộp"
        },
        {
          name: "status",
          text: "Trạng thái"
        }
      ]
    };
  },
  computed: {
    ...mapState(STORE_OVERVIEW, ["deadline"]),
    deadlineList() {
      const data = this.deadline.filter(item => item.category == "TEST");
      return data;
    }
  },
  methods: {
    getLocalDateTime
  }
};
</script>

<style lang="scss">
.wrap-general-exam-expiry {
  .app-table {
    th:first-child {
      width: 60%;
    }
    th:nth-child(2) {
      width: 25%;
    }
    th:nth-child(3) {
      width: 15%;
    }
  }
}
</style>