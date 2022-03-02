<template>
  <div>
    <app-table
        :loading="loading"
        :heads="tableHeads"
        :pagination="pagination"
        @pagechange="onPageChange"
        @selectionChange="selectRow"
        @sort="handleSort"
        :data="data"
        primaryKey="online_lesson_id"
        :multiple-selection="multipleSelection"
        :cols="tableCols"
      >
        <template v-slot:cell(online_class_name)="{row}">
          <td class="pr-5">
            <n-link
              :to="'/elearning/manager/online-class/' + row.online_class_id + '/invites'"
              class="link"
            >
            {{row.online_class_name}}
            <span class="sub">{{row.lesson_index}}</span>
            </n-link>
          </td>
        </template>

        <template v-slot:cell(assignment_name)="{row}">
          <td class="pr-5">
            {{row.assignment_name || ''}}
          </td>
        </template>
        <template v-slot:cell(start_time)="{row}">
          <td>
            <div style="white-space: nowrap">
              {{getLocalTimeHH_MM_A(row.start_time)}} - {{getLocalTimeHH_MM_A(row.end_time)}}
            </div>
            <div>
              {{getDateBirthDay(row.start_time)}}
            </div>
          </td>
        </template>

        <template v-slot:cell(teacher_name_assigned)="{row}">
          <td>
            {{row.teacher_name_assigned || ''}}
          </td>
        </template>
        
        <template v-slot:actions="{row}">
          <a class="link body-3 font-weight-medium" @click="openModal(row)" v-if="actions[0]">
            <IconSwapHorizontalCircle class="icon body-1 text-primary mr-2"/>Vào phòng học
          </a>
          <n-link class="link body-3 font-weight-medium" :to="'/elearning/manager/online-class/edit/' + row.online_class_id"
            v-if="actions[1] && row.is_owner_class">
            <IconBorderColor class="icon body-1 text-primary mr-2" />Chỉnh sửa
          </n-link>
          <n-link :to="'/elearning/manager/online-class/' + row.online_class_id + '/invites'" class="link body-3 font-weight-medium"
            v-if="actions[2]">
            <IconPeople class="icon body-1 text-warning mr-2"/>Xem danh sách học sinh
          </n-link>
          <n-link class="link body-3 font-weight-medium" :to="'/elearning/manager/online-class/edit/' + row.online_class_id"
            v-if="actions[3]">
            <IconEdit class="icon body-1 text-primary mr-2" />Thêm lịch học
          </n-link>
          <a v-if="actions[4] && row.is_owner_lesson" @click.prevent="$emit('changeSchedule', row)" class="link body-3 font-weight-medium">
            <IconBxCalendarCheck class="icon body-1 mr-2" />Đổi lịch
          </a>
          <a v-if="actions[5] && row.is_owner_lesson && !row.is_owner_class" @click.prevent="$emit('editSchedule', row)" class="link body-3 font-weight-medium">
            <IconBxCalendarEdit class="icon text-info body-1 mr-2" />Sửa lịch
          </a>
          <a v-if="actions[6] && row.is_owner_lesson && !row.is_owner_class" @click.prevent="$emit('requestCancelSchedule', row)" class="link body-3 font-weight-medium">
            <IconBxCalendarX class="icon text-secondary body-1 mr-2" />Yêu cầu huỷ lịch
          </a>
        </template>
      </app-table>

      <ModalJoinClass :id="rowClassId" v-if="modalShow && actions[0]" @close="modalShow = false" :info="modalData"/>
    </div>
</template>

<script>
import IconEdit from "~/assets/svg/v2-icons/edit_24px.svg?inline";
import IconCalendar from "~/assets/svg/icons/calendar.svg?inline";
import IconPeople from '~/assets/svg/v2-icons/people_24px.svg?inline';
import IconSwapHorizontalCircle from '~/assets/svg/v2-icons/swap_horizontal_circle_24px.svg?inline';
import IconBxCalendarCheck from '~/assets/svg/icons/bx-calendar-check.svg?inline';
import IconBxCalendarEdit from '~/assets/svg/icons/bx-calendar-edit.svg?inline';
import IconBxCalendarX from '~/assets/svg/icons/bx-calendar-x.svg?inline';
import IconBorderColor from '~/assets/svg/v2-icons/border_color_24px.svg?inline';
import ModalJoinClass from "~/components/page/elearning/manager/olclass/ModalJoinClass";

import {
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
    IconBxCalendarCheck,
    IconBxCalendarEdit,
    IconBxCalendarX,
    IconBorderColor,
    ModalJoinClass
  },

  props: {
    actions: {
      type: Array,
      default: [0,0,1]
    },
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
    multipleSelection: {
      type: Boolean,
      default: true
    },
    cols: {
      type: Array
    },
    tableHeads: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      modalShow: false,
      modalData: {},
    };
  },
  computed: {
    tableCols () {
      if (this.cols) return this.cols
      if (this.multipleSelection) return [5,25,23,20,12,15]
      return [28,25,20,12,15]
    }
  },

  methods: {
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
      this.rowClassId = row.online_class_id;
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