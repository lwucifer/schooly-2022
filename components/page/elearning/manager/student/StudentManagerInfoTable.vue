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
        <td class="text-primary">
          <n-link
            class="text-decoration-none"
            title="Chi tiết"
            :to="'/elearning/manager/exams/' + row.exercise_id + '/results?user_id=' + user_id + '&student_id=' + $route.params.id"
          >Xem chi tiết</n-link>
        </td>
      </template>

      <template v-slot:cell(name)="{row}">
        <td style="width:60%">{{ get(row, 'name', '') }}</td>
      </template>

      <template v-slot:cell(mark)="{row}">
        <td style="width:25%">
          <span v-if="row.point < 0" class="text-warning">Chưa chấm điểm</span>
          <span
            v-else-if="row.point > 4"
            class="text-primary"
          >{{ get(row, 'point', '') }}/{{row.max_score}}</span>
          <span
            v-else-if="row.point < 5"
            class="text-secondary"
          >{{ get(row, 'point', '') }}/{{row.max_score}}</span>
        </td>
      </template>
    </app-table>
    <!--End table-->
  </div>
</template>

<script>
import { get } from "lodash";
import IconArrow from "~/assets/svg/v2-icons/arrow_forward_ios_24px.svg?inline";
import RateStatus from "~/components/page/elearning/manager/exam/RateStatus";
import { ELEARNING_TYPES } from "~/utils/constants";
import { mapState } from "vuex";

export default {
  components: {
    IconArrow,
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
    },
  },

  data() {
    return {
      user_id: this.get(this.$store.state.auth.token, 'id', '')
    };
  },

  computed: {
    ...mapState("auth", ["loggedUser"]),
  },
  methods: {
    onPageChange(e) {
      this.$emit("onPageChange", e);
    },
    get
  }
};
</script>