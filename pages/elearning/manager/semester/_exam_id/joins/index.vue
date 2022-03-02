<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <ElearningManagerSide />
      </div>
      <div class="col-md-9 exam-manager-student">
        <sub-block-section>
          <div slot="title" class="ems__title-block">
            <button class="d-flex align-items-center">
              <IconKeyboardArrowLeft24px class="fill-primary mr-3" />
            </button>
            Kỳ thi học số 1
          </div>
          <div slot="content" class="ems_content-block">
            <div class="d-flex align-items-center">
              <app-search
                class="ems_app-search"
                :placeholder="'Nhập để tìm kiếm'"
                bordered
                :size="'sm'"
                v-model="payload.query"
                @submit="search"
                @keyup.enter.native="search"
              />
              <filter-button
                @click="clickFilterSubmit"
                size="sm"
                class="btn-filter"
                :color="filterSelect ? 'primary' : 'white'"
              ></filter-button>
              <div class="d-flex group-select" v-if="filterSelect">
                <app-vue-select
                  class="ems_app-select mx-3"
                  label="text"
                  placeholder="Lớp"
                  has-border
                  :options="classessAllOpts"
                  @input="handleChangeClass"
                />
                <app-vue-select
                  class="ems_app-select"
                  label="text"
                  placeholder="Trạng thái"
                  has-border
                  :options="[
                    {value: 'PENDING', text: 'Chờ duyệt'},
                    {value: 'PASSED', text: 'Đạt'},
                    {value: 'FAILED', text: 'Không đạt'},
                  ]"
                  @input="handleChangeStatus"
                />
              </div>
              <app-upload
                :multiple="false"
                accept=".csv, .xls, .xlsx,"
                class="ml-auto"
              >
                <div class="d-flex align-items-center">
                  <IconExcel />
                  <span style="color:#4880FF;">Tải Excel</span>
                </div>
              </app-upload>
            </div>

            <app-table
              :heads="heads"
              :data="studentJoinContent"
              :pagination="studentJoinPagination"
              class="mt-5"
            >
              <template v-slot:cell(action)="{ row }">
                <td style="width:2.4rem">
                  <n-link :to="`/elearning/manager/semester/${payload.test_id}/joins/result/${row.id}`">
                    <IconKeyboardArrowRight24px />
                  </n-link>
                </td>
              </template>
              <template v-slot:cell(mark)="{ row }">
                <td>
                  <span v-if="row.mark > 5" class="text-primary"
                    >{{ row.mark.toFixed(1) }}/10</span
                  >
                  <span v-else-if="row.mark < 5" class="text-secondary"
                    >{{ row.mark.toFixed(1) }}/10</span
                  >
                  <span v-else-if="!row.mark" class="text-info"
                    >Chưa làm bài</span
                  >
                </td>
              </template>
            </app-table>
          </div>
        </sub-block-section>
      </div>
    </div>
  </div>
</template>

<script>
import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
import IconKeyboardArrowLeft24px from "~/assets/svg/v2-icons/keyboard_arrow_left_24px.svg?inline";
import IconExcel from "~/assets/svg/icons/excel.svg?inline";
import IconKeyboardArrowRight24px from "~/assets/svg/v2-icons/keyboard_arrow_right_24px.svg?inline";

import * as actionTypes from "~/utils/action-types";
import { mapState, mapActions, mapGetters } from "vuex";
import { get } from 'lodash';

export default {
  components: {
    ElearningManagerSide,
    IconKeyboardArrowLeft24px,
    IconExcel,
    IconKeyboardArrowRight24px
  },
  data() {
    return {
      filterSelect: false,
      payload: {
        test_id: null,
        class_id: null,
        page: 1,
        size: 999,
        result: null,
        query: null
      },
      heads: [
        {
          name: "name",
          text: "Họ và tên"
        },
        {
          name: "class_name",
          text: "Lớp"
        },
        {
          name: "mark",
          text: "Điểm"
        },
        {
          name: "action",
          text: ""
        }
      ],
      selectedClass: null
    };
  },

  created() {
    this.payload.test_id = this.$route.params ? this.$route.params.exam_id : "";
    this.getListStudentJoin();
    
    const payloadClasses = {
      school_id: get(this, "userLogin.organization.id", "")
    };

    // get list filter options
    this.getClasses(payloadClasses);
  },

  computed: {
    ...mapGetters("elearning/semester/join", [
      "studentJoinContent",
      "studentJoinPagination"
    ]),

    ...mapGetters("elearning/public/public-grades", ["classessAllOpts"]),
    ...mapState("auth", {
      userLogin: "token"
    }),
  },

  methods: {
    ...mapActions("elearning/semester/join", ["teachingTestParticipantList"]),
    ...mapActions("elearning/public/public-grades", ["getClasses"]),


    getListStudentJoin() {
      Object.keys(this.payload).map((k) => {
        if (this.payload[k] == null || this.payload[k] == -1) {
          delete this.payload[k];
        }
      });
      this.teachingTestParticipantList(this.payload)
    },

    clickFilterSubmit() {
      this.filterSelect = !this.filterSelect;
      this.payload.class_id = null;
      this.payload.result = null;
      this.getListStudentJoin();
    },

    search(val) {
      console.log("val", val)
      if(val.length > 0) {
        this.payload.page = 1;
        this.payload.query = val;
        this.getListStudentJoin()
      }
    },

    handleChangeClass(val) {
      this.payload.page = 1;
      this.payload.class_id = val.value;
      console.log("[handleChangeClass]", this.payload);
      this.getListStudentJoin()
    },

    handleChangeStatus(val) {
      this.payload.page = 1;
      this.payload.result = val.value;
      this.getListStudentJoin()
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/exams/_semester-manager-student.scss";
</style>
