<template>
  <div>
    <app-table
        :loading="loading"
        :heads="joinClass ? heads2 : heads"
        :pagination="pagination"
        @pagechange="onPageChange"
        @selectionChange="selectRow"
        @sort="handleSort"
        :data="data"
        primaryKey="online_lesson_id"
      >
        <template v-slot:cell(name)="{row}">
          <td class="pr-5">
            <span class="link">
              {{row.name}}
              <span class="sub">{{row.lesson_position}}</span>
            </span>
          </td>
        </template>
        <template v-slot:cell(next_schedule)="{row}">
          <td>
            <div style="white-space: nowrap">
              {{getLocalTimeHH_MM_A(row.next_schedule)}} - 
              {{getEndTime2(getLocalTimeHH_MM_A(row.next_schedule), row.duration)}}
            </div>
            <div>
              {{getDateBirthDay(row.next_schedule)}}
            </div>
          </td>
        </template>
        <template v-slot:cell(actions)="{row}">
          <td>
            <a class="color-primary" @click="openModal(row)" style="white-space: nowrap">
              Vào phòng học
            </a>
          </td>
        </template>
      </app-table>

      <ModalJoinClass :id="rowClassId" v-if="modalShow" @close="modalShow = false" :info="modalData"/>
    </div>
</template>

<script>
import IconEdit from "~/assets/svg/v2-icons/edit_24px.svg?inline";
import IconCalendar from "~/assets/svg/icons/calendar.svg?inline";
import IconPeople from '~/assets/svg/v2-icons/people_24px.svg?inline';
import IconSwapHorizontalCircle from '~/assets/svg/v2-icons/swap_horizontal_circle_24px.svg?inline';
import ModalJoinClass from "~/components/page/elearning/mycourses/ModalJoinClass";

import {
  getEndTime2,
  getDateBirthDay,
  getLocalTimeHH_MM_A
} from "~/utils/moment";
import { get } from "lodash";

export default {
  components: {
    IconEdit,
    IconPeople,
    IconCalendar,
    IconSwapHorizontalCircle,
    ModalJoinClass
  },

  props: {
    data: {
      type: Array,
      default: []
    },
    pagination: {
      type: Object,
      default: {}
    },
    loading: {
      type: Boolean,
      default: false
    },
    joinClass: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
      modalShow: false,
      modalData: {},
      heads: [
        {
          name: "name",
          text: "Phòng học",
        },
        {
          name: "assignment_name",
          text: "Thuộc bài giảng/khoá học",
        },
        {
          name: "next_schedule",
          text: "Thời gian học",
          sort: true
        }
      ],
      heads2: [
        {
          name: "name",
          text: "Phòng học",
        },
        {
          name: "assignment_name",
          text: "Thuộc bài giảng/khoá học",
        },
        {
          name: "next_schedule",
          text: "Thời gian học",
          sort: true
        },
        {
          name: "actions",
          text: "",
        }
      ],
    };
  },
  computed: {
  },

  methods: {
    getEndTime2,
    getDateBirthDay,
    getLocalTimeHH_MM_A,

    handleSort(e) {
      this.$emit("sort", e);
    },

    onPageChange(e) {
      this.$emit("pagechange", e);
    },

    selectRow(e) {
      this.$emit("selectionChange", e);
    },

    openModal(row) {
      this.rowClassId = row.lesson_id;
      this.modalData = row;
      this.modalShow = true;
    },

    get
  },

  created() {
  }
};
</script>

<style lang="scss" scoped>
.appended-col {
  p {
    max-width: 15rem;
  }
  .text-description {
    color: #999;
    font-size: 1.2rem;
    line-height: 1.6rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.link {
  position: relative;
  .sub {
    position: absolute;
    background: $color-blue;
    padding: 5px;
    border-radius: 10px;
    font-size: 1rem;
    display: flex;
    align-items: center;
    line-height: 15px;
    height: 15px;
    top: -6px;
    color: #fff;
    left: calc(100% + 5px);
  }
}
</style>