<template>
  <app-modal
    centered
    :width="815"
    :component-class="{ 'invite-student-modal': true }"
    :footer="false"
    @close="close"
    title="Chi tiết nhóm học tập"
  >
    <div slot="content">
      <div class="add-student__menu-tab">
        <div class="wrap-menu-tab">
          <button
            class="btn-tab"
            @click="changeTab(1)"
            :class="tab == 1 ? 'active' : ''"
          >
            Danh sách kỳ thi
          </button>
          <button
            class="btn-tab"
            @click="changeTab(2)"
            :class="tab == 2 ? 'active' : ''"
          >
            Danh sách bài giảng/khoá học
          </button>
        </div>
      </div>
      <div class="add-student__content add-student__wrap-table" v-if="tab == 1">
        <app-table-extend
          :heads="heads"
          :pagination="semesterPagination"
          :data="semesterContent"
          :loading="loadingExam"
          @pagechange="onPageChangeSemester"
          @checkClick="handleClickRow"
        >
          <td
            slot="expandedRowRender"
            slot-scope="{ row }"
            :colspan="heads.length + 1"
          >
            <ExamsCase 
              :detail="row"
            />
            <!-- <div class="wrap-expanded-render">
              <div class="row">
                <div class="col-md-4 exams-case__text">
                  <div class="mb-3">
                    Trạng thái:
                    <span
                      class="font-weight-medium"
                      :class="row.action ? 'text-primary ' : 'text-secondary'"
                      >{{ row.status }}</span
                    >
                  </div>
                  <div>
                    Hiển thị:
                    <span class="text-primary font-weight-medium">{{
                      row.settings.privacy
                    }}</span>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    Số đề thi:
                    <span class="text-primary font-weight-medium">{{
                      row.exams
                    }}</span>
                  </div>
                  <div>
                    Lệ phí:
                    <span class="text-primary font-weight-medium"
                      >500.00 đ</span
                    >
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    Số lượng thi:
                    <span class="text-primary font-weight-medium">{{
                      row.exams
                    }}</span>
                  </div>
                  <div>
                    Số thí sinh tham gia:
                    <span class="text-primary font-weight-medium">{{
                      row.participants
                    }}</span>
                  </div>
                </div>
              </div>
            </div> -->
          </td>
          <template v-slot:cell(order)="{ row }">
            <td style="width:3rem">
              <button
                @click="handleClick(row)"
                class="w-100 d-flex align-items-center justify-content-center"
              >
                <IconEllipse height="7" width="7" v-if="!row.order" />
                <IconEllipse2 height="7" width="7" v-else />
              </button>
            </td>
          </template>
          <template slot="cell(name)" slot-scope="{ row }">
            <td>
              <div class="d-flex align-items-center">
                {{ row.name }}
                <IconKeyboardArrowUp24px class="ml-3 fill-primary" v-if="rowClick.includes(row)"/>
                <IconKeyboardArrowDown class="ml-3" v-else/>
              </div>
            </td>
          </template>
          <template slot="cell(grades)" slot-scope="{ row }">
            <td>
              {{ row.grades.name }}
            </td>
          </template>
          <template slot="cell(subject)" slot-scope="{ row }">
            <td>
              <span v-for="(item,key) in row.subjects" :key="key">{{ item.name }},</span>
            </td>
          </template>
          <template slot="cell(start_time)" slot-scope="{ row }">
            <td v-if="row.settings.start_time">{{ row.settings.start_time | getDateTimeHH_MM_D_M_Y }}</td>
            <td v-else>Không xác định</td>
          </template>
          <template slot="cell(end_time)" slot-scope="{ row }">
            <td v-if="row.settings.end_time">{{ row.settings.end_time | getDateTimeHH_MM_D_M_Y }}</td>
            <td v-else>Không xác định</td>
          </template>
        </app-table-extend>
      </div>
      <div class="add-student__content add-student__wrap-table" v-if="tab == 2">
        <app-table
          :heads="heads2"
          :pagination="elearningPagination"
          :data="elearningContent"
          :loading="loadingElearning"
          @pagechange="onPageChangeElearning"
        >
          <template v-slot:cell(order)="{ index }">
            <td>
              <p class="text-center">
                <span class="nowrap">{{ index + 1 }}</span>
              </p>
            </td>
          </template>
          <template v-slot:cell(publish_date)="{row}">
            <td>
              <span v-if="row.publish_date">{{row.publish_date | getDateBirthDay}}</span>
              <span v-else>Không xác định</span>
            </td>
          </template>
          <template v-slot:cell(end_time)="{row}">
            <td>
              <span v-if="row.end_time">{{row.end_time | getDateBirthDay}}</span>
              <span v-else>Không xác định</span>
            </td>
          </template>
          <template v-slot:cell(type)="{row}">
            <td>
              <span>{{row.type | getElearningTypeText}}</span>
            </td>
          </template>
        </app-table>
      </div>
      <div class="add-student__action">
        <app-button class="pl-5 pr-5" @click="close">
          Đóng
        </app-button>
      </div>
    </div>
  </app-modal>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { get, isEqual, pickBy, identity } from "lodash";
import * as actionTypes from "~/utils/action-types";
import { useEffect, getParamQuery } from "~/utils/common";
import IconAdd24px from "~/assets/svg/v2-icons/add_24px.svg?inline";
import IconEllipse from "~/assets/svg/icons/ellipse.svg?inline";
import IconEllipse2 from "~/assets/svg/icons/ellipse2.svg?inline";
import IconKeyboardArrowDown from "~/assets/svg/v2-icons/keyboard_arrow_down_24px.svg?inline";
import IconKeyboardArrowUp24px from '~/assets/svg/v2-icons/keyboard_arrow_up_24px.svg?inline';
import ExamsCase from "~/components/page/elearning/exams/ExamsCase";

import { ELEARNING_TEACHING_GROUPS } from "~/utils/endpoints";
import { RESPONSE_SUCCESS } from "~/utils/config";
import { allOptionSelect } from "~/utils/common";

export default {
  components: {
    IconAdd24px,
    IconEllipse,
    IconEllipse2,
    IconKeyboardArrowDown,
    IconKeyboardArrowUp24px,
    ExamsCase
  },

  data() {
    return {
      tab: 1,
      heads: [
        {
          name: "order",
          text: "STT",
          sort: false
        },
        {
          name: "name",
          text: "Tên kỳ thi",
          sort: false
        },
        {
          name: "grades",
          text: "Khối",
          sort: false
        },
        {
          name: "subject",
          text: "Môn học",
          sort: false
        },
        {
          name: "start_time",
          text: "Bắt đầu",
          sort: false
        },
        {
          name: "end_time",
          text: "Kết thúc",
          sort: false
        }
      ],
      heads2: [
        {
          name: "order",
          text: "STT",
          sort: false
        },
        {
          name: "name",
          text: "Tên bài giảng/khoá học",
          sort: false
        },
        {
          name: "type",
          text: "Thể loại",
          sort: false
        },
        {
          name: "publish_date",
          text: "Ngày bắt đầu",
          sort: false
        },
        {
          name: "end_time",
          text: "Ngày kết thúc",
          sort: false
        }
      ],
      rowClick: [],
    };
  },

  props: {
    loadingElearning: {
      type: Boolean,
      default: false
    },
    loadingExam: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters("elearning/teaching/elearning", [
      "elearningContent",
      "elearningPagination"
    ]),
    ...mapGetters("elearning/semester/manage-exam", [
      "semesterContent",
      "semesterPagination"
    ])
  },

  methods: {
    onPageChangeSemester(e) {
      console.log("[onPageChangeSemester]", e);
      const { number, size } = e;
      this.payload.page = +number + 1;
      this.payload.limit = +size;

      this.$emit("searchExam");
    },

    onPageChangeSemester(e) {
      console.log("[onPageChangeSemester]", e);
      const { number, size } = e;
      this.$emit("searchExam", { page: +number + 1, limit: +size });
    },

    onPageChangeElearning(e) {
      console.log("[onPageChangeElearning]", e);
      const { number, size } = e;
      this.$emit("searchElearning", { page: +number + 1, limit: +size });
    },

    handleClick(val) {
      console.log("hell", val);
    },

    handleClickRow(val) {
      if (!val) return;
      if (this.rowClick.includes(val)) {
        this.rowClick = this.rowClick.filter(
          item => item !== val
        );
      } else {
        this.rowClick = [...this.rowClick, val];
      }
    },

    close() {
      this.$emit("close");
    },

    changeTab(tab) {
      this.tab = tab;
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/students/_add-student.scss";
</style>
