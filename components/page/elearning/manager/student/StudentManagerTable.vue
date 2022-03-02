<template>
  <div>
    <app-table
      :heads="heads"
      :pagination="pagination"
      @pagechange="onPageChange"
      :data="list"
      :loading="loading"
    >
      <template v-slot:cell(action)="{row}">
        <td>
          <n-link
            class
            title="Chi tiết"
            :to="`/elearning/manager/courses/students/${row.student_id}?elearning_id=${filterElearningId}&user_id=${row.user_id}`"
          >
            <IconArrow height="13" />
          </n-link>
        </td>
      </template>

      <template v-slot:cell(confirm)="{row}">
        <td style="width:40%;">
          <app-button square size="sm" normal color="transparent" @click="accept(row.user_id)">
            <IconCheckGreen class="icon mr-2" />Đồng ý
          </app-button>
          <app-button
            normal
            square
            size="sm"
            color="transparent"
            class="text-secondary"
            @click="reject(row.user_id)"
          >
            <IconClear24px class="icon mr-2" />Từ chối
          </app-button>
        </td>
      </template>

      <template v-slot:cell(name)="{row}">
        <td style="width:30%">
          <div class="student_name">
           {{ get(row, 'student_name', '') }}
           <IconLock2 class="fill-red" width="14" height="14" v-if="row.banned" />
          </div>
        </td>
      </template>
      <template v-slot:cell(class)="{row}">
        <td style="width:10%">{{ get(row, 'class_name', '') }}</td>
      </template>
      <template v-slot:cell(date)="{row}">
        <td style="width:25%">{{ get(row, 'join_date', '') | moment("DD/MM/YYYY") }}</td>
      </template>
      <template v-slot:cell(question)="{row}">
        <td style="width:25%">{{ get(row, 'questions', '') }}</td>
      </template>
      <template v-slot:cell(question)="{row}">
        <td style="width:25%">{{ get(row, 'questions', '') }}</td>
      </template>
      <template v-slot:cell(request_date)="{row}">
        <td style="width:25%">{{ get(row, 'request_date', '') | moment("DD/MM/YYYY") }}</td>
      </template>
      <template v-slot:cell(progress)="{row}">
        <td>
          <span class="text-primary" v-if="row.progress > 0.5">{{ get(row, 'progress', '') * 100 }} %</span>
          <span
            class="text-secondary"
            v-else-if="row.progress < 0.5"
          >{{ get(row, 'progress', '') * 100 }} %</span>
          <span class="text-warning" v-else-if="row.progress = 0.5">{{ get(row, 'progress', '') * 100}} %</span>
        </td>
      </template>
    </app-table>
    <!--End table-->

    <app-modal-confirm
      v-if="showModalAccept"
      :confirmLoading="confirmLoadingAccept"
      @ok="acceptStudent"
      :width="550"
      @cancel="showModalAccept = false"
      title="Bạn chấp nhận học sinh này?"
      description="Học sinh này sẽ được tham gia học và làm bài"
    />
    <app-modal-confirm
      v-if="showModalReject"
      :confirmLoading="confirmLoadingReject"
      @ok="rejectStudent"
      :width="550"
      @cancel="showModalReject = false"
      title="Bạn từ chối học sinh này?"
      description="Học sinh này sẽ không được tham gia học và làm bài"
    />
  </div>
</template>

<script>
import { get } from "lodash";
import IconArrow from "~/assets/svg/v2-icons/arrow_forward_ios_24px.svg?inline";
import RateStatus from "~/components/page/elearning/manager/exam/RateStatus";
import { ELEARNING_TYPES } from "~/utils/constants";
import IconClear24px from "~/assets/svg/v2-icons/clear_24px.svg?inline";
import IconCheckGreen from "~/assets/svg/v2-icons/check_green.svg?inline";
import IconLock2 from "~/assets/svg/icons/lock2.svg?inline";

import { mapState, mapActions } from "vuex";
const STORE_TEACHING_ACCEPT = "elearning/teaching/accept";
const STORE_TEACHING_REQUEST = "elearning/teaching/request";
export default {
  components: {
    IconArrow,
    IconClear24px,
    IconCheckGreen,
    IconLock2,
    RateStatus
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
    heads: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  filters: {
    exerciseTypeFilter: function(val) {
      const MATCHED_DATA = {
        [ELEARNING_TYPES.COURSE]: "Khóa học",
        [ELEARNING_TYPES.LECTURE]: "Bài giảng"
      };
      if (MATCHED_DATA.hasOwnProperty(val)) return MATCHED_DATA[val];
      return "-";
    }
  },

  data() {
    return {
      confirmLoadingAccept: false,
      confirmLoadingReject: false,
      showModalAccept: false,
      showModalReject: false,
      id: ''
    };
  },

  computed: {
    filterElearningId() {
      return this.$route.query && this.$route.query.elearning_id
        ? this.$route.query.elearning_id
        : "";
    }
  },
  methods: {
    ...mapActions(STORE_TEACHING_ACCEPT, ["teachingElearningAccept"]),
    ...mapActions(STORE_TEACHING_REQUEST, ["teachingElearningRequestsList"]),
    get,
    onPageChange(e) {
      this.$emit("changedPagination", e);
    },
    accept(_id) {
      this.id = _id;
      this.showModalAccept = true;
    },
    reject(_id) {
      this.id = _id;
      this.showModalReject = true;
    },
    acceptStudent() {
      const data = {
        elearning_id: this.filterElearningId,
        user_id: this.id,
        accept: true
      };
      this.confirmLoadingAccept = true;
      this.teachingElearningAccept(data).then(result => {
        if (result && result.success == true) {
          this.showModalAccept = false;
          this.confirmLoadingAccept = false;
          this.teachingElearningRequestsList({
            params: {
              elearning_id: this.filterElearningId
            }
          });
        }
      });
    },
    rejectStudent() {
      const data = {
        elearning_id: this.filterElearningId,
        user_id: this.id,
        accept: false
      };
      this.confirmLoadingReject = true;
      this.teachingElearningAccept(data).then(result => {
        if (result && result.success == true) {
          this.showModalReject = false;
          this.confirmLoadingReject = false;
          this.teachingElearningRequestsList({
            params: {
              elearning_id: this.filterElearningId
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.student_name {
  display: inline-block;
  position: relative;
  .fill-red {
    position: absolute;
    left: calc(100% + 5px);
  }
}
.elearning-manager-content__main {
  .btn:hover,
  .btn:active,
  .btn:focus {
    box-shadow: none;
  }
}
</style>