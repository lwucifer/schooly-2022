<template>
  <div class="elearning-wrapper">
    <!--Filter form-->
    <div class="filter-form">
      <div class="d-flex">
        <div class="filter-form__item" style="max-width:36rem;min-width:30rem;">
          <div style="width: 100%">
            <app-search
              :placeholder="'Nhập để tìm kiếm...'"
              v-model="query"
              :size="'sm'"
              @submit="submit"
              @keyup.enter.native="submit"
              bordered
            ></app-search>
          </div>
        </div>

        <div class="filter-form__item">
          <app-button
            :color="showFilter ? 'primary' : 'white'"
            square
            :size="'sm'"
            @click="toggleFilter"
          >
            <IconHamberger :class="showFilter ? 'fill-white' : 'fill-primary'" class="mr-2" />
            <span>Lọc kết quả</span>
          </app-button>
        </div>

        <div class="filter-form__item" style="min-width: 18rem" v-if="showFilter">
          <app-vue-select
            class="app-vue-select filter-form__item__selection"
            v-model="filterCourse"
            :options="courseOpts"
            label="text"
            placeholder="Lớp học"
            @input="handleChangedCourse"
            :all-opt="allOpt"
            has-border
          ></app-vue-select>
        </div>

        <!-- <div class="filter-form__item top" @click="openModal = true">
          <app-button color="info" class="filter-form__item__btn" square :size="'sm'">
            <IconPlusCircle class="mr-2 fill-white" />
            <span class="color-white">Gửi thông báo lịch học</span>
          </app-button>
        </div> -->
      </div>
      <div class="text-right mb-3">
        <i>Danh sách học sinh đã tham gia bài giảng “{{get(stateClassInfo, 'data.name', '')}}” của bạn.</i>
      </div>
    </div>
    <!--End filter form-->

    <!--Table-->
    <app-table
      class="tr-static"
      :loading="loading"
      :heads="heads"
      :pagination="pagination"
      @pagechange="onPageChange"
      @sort="handleSort"
      :data="students"
    >
      <template v-slot:cell(student_name)="{row}">
        <td>
          <span class="isblock">
            {{row.student_name}}
            <IconLock2 class="fill-red" width="14" height="14" v-if="row.banned" />
          </span>
        </td>
      </template>

      <template v-slot:cell(attendance)="{row}">
        <td>
          <div class="attendance-points">
            <div class="points">
              <span class="bg-green">
                {{covertPercent(row, 'num_attendance')}}%
              </span>
              <span class="bg-red">
                {{covertPercent(row, 'num_absent_with_out_permission')}}%
              </span>
              <span class="bg-yellow">
                {{covertPercent(row, 'num_absent_with_permission')}}%
              </span>
              <span class="bg-blue">
                {{covertPercent(row, 'num_late')}}%
              </span>
            </div>
            <div class="desc">
              <div class="content">
                <div class="inner">
                  <h6>Tỷ lệ tham gia {{get(stateClassInfo, 'data.name', '')}}</h6>
                  <div class="row mt-3">
                    <div class="col-6 mb-3 nowrap">
                      Có mặt:
                      <span class="color-primary">
                        {{covertPercent(row, 'num_attendance')}}%
                      </span>
                    </div>
                    <div class="col-6 mb-3">
                      Có phép:
                      <span class="color-yellow nowrap">
                        {{covertPercent(row, 'num_absent_with_permission')}}%
                      </span>
                    </div>
                    <div class="col-6 mb-3 nowrap">
                      Không phép:
                      <span class="color-red">
                        {{covertPercent(row, 'num_absent_with_out_permission')}}%
                      </span>
                    </div>
                    <div class="col-6 mb-3 nowrap">
                      Vào muộn:
                      <span class="color-blue">
                        {{covertPercent(row, 'num_late')}}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </td>
      </template>

      <template v-slot:cell(banned)="{row}">
        <td class="nowrap">
          <button
            class="btn-block"
            type="button"
            @click="block(row.user_id, row.banned)"
            v-if="!row.banned"
          >
            <IconLock2 class="fill-red" width="16" height="16" />
            <span>Chặn học sinh này</span>
          </button>
          <button class="btn-block" type="button" @click="block(row.user_id, row.banned)" v-else>
            <IconLockOpenAlt class="fill-primary" width="16" height="16" />
            <span>Bỏ chặn học sinh này</span>
          </button>
        </td>
      </template>
      <template v-slot:cell(attendance_point)="{row}">
        <td>{{row.attendance_point}}%</td>
      </template>
      <template v-slot:cell(join_date)="{row}">
        <td>{{getDateBirthDay(row.join_date)}}</td>
      </template>
    </app-table>
    <!--End table-->

    <div class="pl-4 pr-4 mt-4 text-center">
      <i>
        *Điểm chuyên cần của học sinh được tính dựa trên tỷ lệ tham gia
        <b>{{get(stateClassInfo, 'data.name', '')}}</b> theo yêu cầu của giáo viên
      </i>
    </div>

    <!-- Modal invite students -->
    <ModalInviteStudent @close="closeModal" v-if="openModal" :title="get(stateClassInfo, 'data.name', '')"/>
    <!-- End -->
  </div>
</template>

<script>
import IconFilter from "~/assets/svg/icons/filter.svg?inline";
import IconSearch from "~/assets/svg/icons/search.svg?inline";
import IconArrow from "~/assets/svg/icons/arrow.svg?inline";
import IconCalendar from "~/assets/svg/icons/calendar2.svg?inline";
import IconTrash from "~/assets/svg/icons/trash-alt.svg?inline";
import IconPlusCircle from "~/assets/svg/design-icons/plus-circle.svg?inline";
import ModalInviteStudent from "~/components/page/elearning/manager/olclass/ModalInviteStudent";
import IconLock2 from "~/assets/svg/icons/lock2.svg?inline";
import IconLockOpenAlt from "~/assets/svg/design-icons/lock-open-alt.svg?inline";
import IconHamberger from "~/assets/svg/icons/hamberger.svg?inline";

import { get } from "lodash";
import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { useEffect, getParamQuery } from "~/utils/common";
import {
  getDateBirthDay
} from "~/utils/moment";

const STORE_NAMESPACE = "elearning/teaching/olclass";
const STORE_CLASSES = "elearning/teaching/classes";

export default {
  components: {
    IconFilter,
    IconSearch,
    IconArrow,
    IconCalendar,
    IconTrash,
    IconPlusCircle,
    IconLock2,
    IconLockOpenAlt,
    IconHamberger,
    ModalInviteStudent
  },

  middleware: ["teacher-role"],

  data() {
    return {
      query: null,
      allOpt: {
        value: null,
        text: "Tất cả"
      },
      openModal: false,
      showFilter: false,
      heads: [
        {
          name: "student_name",
          text: "Học sinh",
          sort: true
        },
        {
          name: "class_name",
          text: "Lớp",
          sort: true
        },
        {
          name: "join_date",
          text: "Ngày tham gia",
          sort: true
        },
        {
          name: "attendance",
          text: "Điểm chuyên cần",
        },
        {
          name: "banned",
          text: ""
        }
      ],
      courses: [],
      filterCourse: null,
      pagination: {
        total: 0,
        number: 0,
        size: 10,
        total_elements: 0,
        first: 0,
        last: 0
      },
      students: [],
      params: {
        page: 1,
        size: 10,
        query: null,
        sort: 'join_date,desc'
      },
      loading: false,
      listSchoolClasses: [],
      checkFilter: false
    };
  },

  computed: {
    ...mapState("auth", ["loggedUser"]),
    ...mapState(STORE_NAMESPACE, {
      stateInvites: "Students"
    }),
    ...mapState(STORE_CLASSES, {
      stateClasses: "teachingClasses"
    }),
    ...mapState(STORE_NAMESPACE, {
      stateClassInfo: "OnlineClassInfo"
    }),
    courseOpts() {
      return [this.allOpt, ...this.courses];
    },
  },

  watch: {
    query() {
      this.checkFilter = true;
    },
  },
  
  methods: {
    get,
    getDateBirthDay,

    covertPercent(row, feild) {
      return row.total_lesson_finished_from_joined_time ?
             _.round(row[feild] / row.total_lesson_finished_from_joined_time * 100, 0) : 0;
    },

    handleSort(e) {
      const sortBy = e.sortBy + ',' + e.order;
      this.params = {...this.params, sort: sortBy};
      this.getList();
    },

    toggleFilter() {
      if (this.showFilter && this.filterCourse != null) {
        this.filterCourse = null;
        this.params = { ...this.params, class_id: null };
        this.getList();
      }
      this.showFilter = !this.showFilter;
    },

    closeModal(e) {
      this.openModal = false;
      if (e) this.getList();
    },
    onPageChange(e) {
      const that = this;
      that.pagination = { ...that.pagination, ...e };
      that.params.size = that.pagination.size;
      that.params.page = that.pagination.number + 1;
      that.getList();
    },
    submit() {
      if (this.checkFilter) {
        this.getList();
        this.checkFilter = false;
      }
    },
    handleChangedCourse() {
      this.params.class_id = this.filterCourse.value;
      this.getList();
    },
    
    selectRow(data) {
      this.ids = data.map((row, index, data) => {
        return row.online_class_id;
      });
    },

    async block(studentId, isBlock) {
      const online_class_id = this.$route.params.id
        ? this.$route.params.id
        : "";
      const params = {
        online_class_id: online_class_id,
        user_id: parseInt(studentId)
      };
      let doDo;
      if (isBlock) {
        doDo = await this.$store.dispatch(
          `${STORE_NAMESPACE}/${actionTypes.TEACHING_OLCLASSES.UNBLOCK}`,
          params
        );
      } else {
        doDo = await this.$store.dispatch(
          `${STORE_NAMESPACE}/${actionTypes.TEACHING_OLCLASSES.BLOCK}`,
          params
        );
      }
      if (get(doDo, 'success', false)) {
        this.getList();
      } else {
        this.$toasted.error(get(doDo, 'message', ''));
      }
    },

    async getList() {
      try {
        this.loading = true;
        const online_class_id = this.$route.params.id
          ? this.$route.params.id
          : "";
        this.params.online_class_id = online_class_id;
        if (this.query != null) {this.params.query = this.query}
        if (this.filterCourse) {
          this.params.class_id = this.filterCourse.value;
        }
        let params = { ...this.params };
        await this.$store.dispatch(
          `${STORE_NAMESPACE}/${actionTypes.TEACHING_OLCLASS_STUDENTS.LIST}`,
          { params }
        );
        this.students = this.get(this.stateInvites, "data.content", []);
        this.pagination.size = this.get(this.stateInvites, "data.size", 10);
        this.pagination.first = this.get(this.stateInvites, "data.first", 1);
        this.pagination.last = this.get(this.stateInvites, "data.last", 1);
        this.pagination.number = this.get(this.stateInvites, "data.number", 0);
        this.pagination.total_pages = this.get(
          this.stateInvites,
          "data.total_pages",
          0
        );
        this.pagination.total_elements = this.get(
          this.stateInvites,
          "data.total_elements",
          0
        );
        this.pagination.number_of_elements = this.get(
          this.stateInvites,
          "data.number_of_elements",
          0
        );
      } catch (e) {
      } finally {
        this.loading = false;
      }
    },

    async getSchoolClasses() {
      try {
        let params = {
          size: 9999
        };
        await this.$store.dispatch(
          `${STORE_CLASSES}/${actionTypes.ELEARNING_TEACHING_CLASS.LIST}`, {params}
        );
        let lessonList = this.get(this.stateClasses, "content", []);
        let list = [];
        lessonList.forEach(element => {
          list.push({
            value: element.id,
            text: element.name
          });
        });
        this.courses = list;
      } catch (e) {
      } finally {
      }
    },

    async inviteStudents() {
      this.openModal = true;
    },
  },

  created() {
    this.getList();
    this.getSchoolClasses();
  }
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/_elearning-filter-form.scss";
@import "~/assets/scss/components/elearning/olclass/invited.scss";
</style>