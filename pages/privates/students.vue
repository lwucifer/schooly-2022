<template>
  <div class="container">
    <h3>Danh sách học sinh</h3>
    <div class="wrap-header-students">
      <div class="wrap_list-students">
        <app-search
          size="sm"
          v-model="params.query"
          @input="handleChangedSearch"
          @submit="handleSearch"
          placeholder="Tìm kiếm học sinh"
        />
        <filter-button
          class="mr-2"
          :color="isFilter ? 'primary' : 'white'"
          size="sm"
          @click="showFilter"
        />
        <div>
          <app-select
            v-if="isFilter && !checkProcess"
            placeholder="Năm học"
            size="sm"
            :options="filterYears"
            class="mr-2"
            clearable
            :value="filterYears && filterYears[0] ? filterYears[0].value : null"
            @change="handleChangedYear"
          />
          <app-select
            v-else-if="isFilter && checkProcess"
            placeholder="Năm học"
            size="sm"
            :options="filterYearsAll"
            class="mr-2"
            clearable
            @change="handleChangedYearProcess"
          />
          <app-select
            v-if="isFilter && !checkProcess"
            placeholder="Lớp học"
            size="sm"
            class="mr-2"
            v-model="params.class_id"
            :options="filterClasses"
            clearable
            @change="handleChangedClass"
          />
          <app-select
            v-else-if="isFilter && checkProcess && checkClassesProcess"
            placeholder="Lớp học"
            size="sm"
            class="mr-2"
            v-model="params.class_id"
            :options="filterClasses"
            clearable
            @change="handleChangedClass"
          />
        </div>

        <a
          class="ml-auto d-inline-flex align-items-center text-decoration-none text-blue-2"
          @click="handleExport"
        >
          <IconCloudDownload24px class="icon fill-opacity-1 body-1 mr-2" />Xuất
          tệp Excel
        </a>
      </div>
      <div class="filter-avg-mark">
        <h6 class="mt-5 mb-2">Chọn cách tính điểm trung bình và tỷ lệ hoàn thành</h6>
        <div class="d-flex align-items-center">
          <app-select
            size="sm"
            v-model="params.cal_type"
            :options="filterAvgMark"
            @change="handleChangedAvgMark"
            clearable
          />
          <i v-if="checkProcess" class="ml-3">
            * Điểm và tỷ lệ sẽ được tính dựa trên toàn bộ quá trình học tập của
            học sinh tính từ lúc tham gia đến niên khóa mà bạn lựa chọn.
          </i>
          <i v-else class="ml-3">
            * Điểm và tỷ lệ sẽ được tính dựa vào quá trình học tập của học sinh
            trong niên khóa mà bạn lựa chọn.
          </i>
        </div>
      </div>
    </div>
    <div class="wrap-table">
      <app-table
        :heads="heads"
        :data="filterStudentPrivates"
        @pagechange="onPageChange"
        :pagination="filterPagination"
        :pagination-style="{ position: 'right' }"
        bg-table="white"
        :ext-table-cls="{ 'pt-4': true }"
        @sort="sortTable"
      >
        <template v-slot:cell(name)="{ row }">
          <td class="wrap-name__table">{{ get(row, "name", "") }}</td>
        </template>
        <template v-slot:cell(joint_at)="{ row }">
          <td class="wrap-name__table">{{ get(row, "joint_at", "") }}</td>
        </template>
        <template v-slot:cell(year)="{ row }">
          <td class="wrap-name__table">{{ get(row, "school_year", "") }}</td>
        </template>
        <template v-slot:cell(class)="{ row }">
          <td class="wrap-name__table">
            <div class="d-flex align-items-center">
              <span>
                {{ get(row, "class_name", "") }}
                <span
                  v-if="!!row.size"
                >(Sĩ số: {{ get(row, "size", 0) }})</span>
              </span>
              <v-popover
                trigger="hover"
                popoverClass="wrap-name-class__table"
                placement="top"
                v-if="row.homeroom_teacher"
              >
                <IconAccountBox24px class="fill-primary ml-2" />
                <template slot="popover">
                  <span class="text-primary">Giáo viên chủ nhiệm</span>
                </template>
              </v-popover>
            </div>
          </td>
        </template>
        <template v-slot:cell(medium_score)="{ row }">
          <td class="wrap-name__table text-center">{{ get(row, "medium_score", 0) }}</td>
        </template>
        <template v-slot:cell(completion_rate)="{ row }">
          <td class="wrap-name__table">
            <div class="d-flex align-items-center">
              <span class="mr-3">{{ get(row, "completion_rate", "") }}%</span>
              <div class="w-100">
                <app-progress :percentage="row.completion_rate" rounded />
              </div>
            </div>
          </td>
        </template>
      </app-table>
    </div>

    <app-modal
      centered
      :footer="false"
      title="Đang xuất dữ liệu"
      v-if="showModalExport"
    >
      <div slot="content">
        <p>Đang xuất tệp excel. Xin vui lòng chờ....</p>
      </div>
    </app-modal>

  </div>
</template>

<script>
import { get } from "lodash";
import * as actionTypes from "~/utils/action-types";
import { mapState, mapActions, mapGetters } from "vuex";
import { getDateFormat } from "~/utils/moment";

const STORE_NAME_YEARS = "elearning/public/public-school-year";
import IconAccountBox24px from "~/assets/svg/v2-icons/account_box_24px.svg?inline";
import IconCloudDownload24px from "~/assets/svg/v2-icons/cloud_download_24px.svg?inline";

const STORE_NAME_STUDENTS = "elearning/teaching/students";
const STORE_NAME_CLASS = "elearning/teaching/teaching-class";

export default {
  async fetch({ params, store }) {
    // const dataUser = await store.dispatch(
    //   `account/${actionTypes.ACCOUNT_PROFILE.LIST}`
    // );
    // const dataProfile = dataUser && dataUser.data ? dataUser.data : {};
    const schoolId = store.getters["auth/organizationId"] || null;
    const dataYear = await store.dispatch(
      `${STORE_NAME_YEARS}/${actionTypes.ELEARNING_PUBLIC_SCHOOL_YEAR.LIST}`,
      {
        school_id: schoolId,
      }
    );
    const school_year_id =
      dataYear && dataYear.data && dataYear.data[0]
        ? dataYear.data[0].id
        : null;
    console.log("school_year_id", school_year_id);
    const queryStudent = {
      cal_type: "SCHOOL_YEAR",
      school_year: school_year_id,
    };
    const queryClass = {
      school_id: schoolId,
      school_year_id: school_year_id,
    };
    await Promise.all([
      store.dispatch(
        `${STORE_NAME_STUDENTS}/${actionTypes.TEACHING_STUDENTS_PRIVATE.LIST}`,
        {
          params: queryStudent,
        }
      ),
      store.dispatch(
        `${STORE_NAME_CLASS}/${actionTypes.ELEARNING_TEACHING_CLASS.CLASS_ALL}`,
        {
          params: queryClass,
        }
      ),
    ]);
  },
  components: {
    IconAccountBox24px,
    IconCloudDownload24px,
  },
  data() {
    return {
      heads: [
        {
          name: "name",
          text: "Họ và tên",
          sort: "true",
        },
        {
          name: "student_code",
          text: "Mã học sinh",
        },
        {
          name: "joint_at",
          text: "Ngày tham gia",
        },
        {
          name: "year",
          text: "Năm học",
        },
        {
          name: "class",
          text: "Lớp",
        },
        {
          name: "medium_score",
          text: "Điểm trung bình",
          sort: "true",
          classTextCenter: "true",
        },
        {
          name: "completion_rate",
          text: "Tỉ lệ hoàn thành các bài học và khóa học",
          sort: "true",
        },
      ],
      params: {
        page: 1,
        limit: 10,
        query: null,
        school_year: null,
        class_id: null,
        cal_type: "SCHOOL_YEAR",
        sort_by: null,
        sort_type: null,
      },
      optionYear: [
        { value: "2018", text: "2018" },
        { value: "2019", text: "2019" },
        { value: "2020", text: "2020" },
      ],
      optionClass: [
        { value: "9A", text: "9A" },
        { value: "8C", text: "8C" },
        { value: "6B", text: "6B" },
        { value: "-1", text: "Khác" },
      ],
      filterAvgMark: [
        { value: "SCHOOL_YEAR", text: "Theo từng năm học" },
        { value: "PROCESS", text: "Theo quá trình học" },
      ],
      isFilter: false,
      checkProcess: false,
      checkChangeYear: false,
      checkChangeClass: false,
      checkClassesProcess: false,
      schoolYearId: null,
      showModalExport: false,
    };
  },
  computed: {
    ...mapState(STORE_NAME_STUDENTS, ["studentPrivates", "studentExport"]),
    ...mapState(STORE_NAME_YEARS, ["years"]),
    ...mapState(STORE_NAME_CLASS, ["classes", "classesAll"]),
    ...mapGetters("auth", ["organizationId"]),
    // ...mapGetters(STORE_NAME_CLASS, ["classesOpts"]),
    filterStudentPrivates() {
      const data =
        this.studentPrivates && this.studentPrivates.content
          ? this.studentPrivates.content
          : [];
      const dataFilter =
        data &&
        data.map((item) => {
          return {
            ...item,
            joint_at: item && item.joint_at ? getDateFormat(item.joint_at) : "",
          };
        });
      return dataFilter;
    },
    filterPagination() {
      return this.studentPrivates && this.studentPrivates.page
        ? this.studentPrivates.page
        : {};
    },
    filterYears() {
      const data =
        this.years &&
        this.years.map((item) => {
          return {
            value: item ? item.id : "",
            text: item ? item.from + " - " + item.to : "",
          };
        });
      return data;
    },
    filterYearsAll() {
      const data =
        this.years &&
        this.years.map((item) => {
          return {
            value: item ? item.id : "",
            text: item ? item.from + " - " + item.to : "",
          };
        });
      data.push({
        value: null,
        text: "Tất cả",
      });
      return data;
    },
    filterClasses() {
      const data = this.classesAll && this.classesAll ? this.classesAll : [];
      const dataMap = data.map((item) => {
        return {
          value: item ? item.id : "",
          text: item ? item.name : "",
        };
      });
      dataMap.push(
        {
          value: "-1",
          text: "Khác",
        },
        {
          value: null,
          text: "Tất cả",
        }
      );
      return dataMap;
    },
    filterCheckData() {
      return this.years ? true : false;
    },
  },
  created() {
    this.params.school_year =
      this.years && this.years[0] ? this.years[0].id : null;
    this.schoolYearId = this.years && this.years[0] ? this.years[0].id : null;
  },

  mounted() {
    // this.handleExport();
  },
  methods: {
    get,
    ...mapActions(STORE_NAME_STUDENTS, [
      "teachingStudentsPrivatesList",
      "teachingStudentsPrivatesExport",
    ]),
    onPageChange(e) {
      console.log("[onPageChange]", e);
      this.params.page = e.number + 1;
      this.teachingStudentsPrivatesList({ params: this.params });
    },
    handleChangedSearch(val) {
      console.log("[handleChangedSearch] val", val);
      if (val == "") {
        this.params.query = null;
        this.teachingStudentsPrivatesList({ params: this.params });
      } else {
        this.params.query = val;
        this.teachingStudentsPrivatesList({ params: this.params });
      }
    },
    handleSearch() {
      this.params.page = 1;
      this.teachingStudentsPrivatesList({ params: this.params });
    },
    async handleChangedYear(val) {
      this.checkChangeYear = true;
      this.params.class_id = null;
      console.log("val", val);
      if (val) {
        this.params.page = 1;
        this.params.school_year = val;
        this.teachingStudentsPrivatesList({
          params: this.params,
        });
        await this.$store.dispatch(
          `${STORE_NAME_CLASS}/${actionTypes.ELEARNING_TEACHING_CLASS.CLASS_ALL}`,
          {
            params: {
              school_id: this.organizationId ? this.organizationId : null,
              school_year_id: val,
            },
          }
        );
      } else {
        this.params.school_year = null;
        this.teachingStudentsPrivatesList({
          params: this.params,
        });
      }
    },
    async handleChangedYearProcess(val) {
      this.checkChangeYear = true;
      this.params.class_id = null;
      console.log("val", val);
      if (val) {
        this.checkClassesProcess = true;
        this.params.page = 1;
        this.params.school_year = val;
        this.teachingStudentsPrivatesList({
          params: this.params,
        });
        await this.$store.dispatch(
          `${STORE_NAME_CLASS}/${actionTypes.ELEARNING_TEACHING_CLASS.CLASS_ALL}`,
          {
            params: {
              school_id: this.organizationId ? this.organizationId : null,
              school_year_id: val,
            },
          }
        );
      } else {
        this.checkClassesProcess = false;
        this.params.school_year = null;
        this.teachingStudentsPrivatesList({
          params: this.params,
        });
      }
    },

    async handleExport() {
      console.log("[handleExport]", this.params.class_id);
      try {
        const payload = {
          class_id: this.params.class_id,
          format_file: "XLSX",
          query: this.params.query
        }
        if(!payload.class_id) {
          this.$toasted.error("Vui lòng chọn lớp học");
          return;
        }
        this.showModalExport = true;
        const result = await this.teachingStudentsPrivatesExport(payload);
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        const fileName = `Student_private_${payload.class_id}.xlsx`;
        link.href = url;
        link.setAttribute("download", fileName); //or any other extension
        document.body.appendChild(link);
        link.click();
      } catch (err) {
        console.log("");
      } finally {
        this.showModalExport = false;
      }
    },

    handleChangedClass(val) {
      this.checkChangeClass = true;
      if (val) {
        this.params.page = 1;
        // this.params.class_id = val;
        this.teachingStudentsPrivatesList({
          params: this.params,
        });
      } else {
        this.params.page = 1;
        this.params.class_id = null;
        this.teachingStudentsPrivatesList({
          params: this.params,
        });
      }
    },
    handleChangedAvgMark(val) {
      console.log("[handleChangedAvgMark] val", val);
      this.params.cal_type = val;
      if (val == "PROCESS") {
        this.checkProcess = true;
        this.params.school_year = null;
        this.teachingStudentsPrivatesList({
          params: this.params,
        });
        // this.isFilter = false;
      } else {
        this.checkProcess = false;
        this.params.class_id = null;
        this.params.school_year = this.schoolYearId;
        this.teachingStudentsPrivatesList({
          params: this.params,
        });
      }
    },
    sortTable(val) {
      console.log("[sortTable] val", val);
      this.params.sort_by = val.sortBy;
      this.params.sort_type = val.order;
      this.teachingStudentsPrivatesList({
        params: this.params,
      });
    },
    showFilter() {
      this.isFilter = !this.isFilter;
      if (!this.isFilter && !this.checkProcess) {
        if (this.checkChangeYear || this.checkChangeClass) {
          this.checkChangeYear = false;
          this.checkChangeClass = false;
          this.params.school_year =
            this.years && this.years[0] ? this.years[0].id : null;
          this.params.class_id = null;
          this.params.page = 1;
          const schoolYearID =
            this.years && this.years[0] ? this.years[0].id : null;
          this.$store.dispatch(
            `${STORE_NAME_CLASS}/${actionTypes.ELEARNING_TEACHING_CLASS.CLASS_ALL}`,
            {
              params: {
                school_id: this.organizationId ? this.organizationId : null,
                school_year_id: schoolYearID,
              },
            }
          );
          this.teachingStudentsPrivatesList({
            params: this.params,
          });
        }
      } else if (!this.isFilter && this.checkProcess) {
        this.checkClassesProcess = false;
        this.params.class_id = null;
        this.params.school_year = null;
        this.teachingStudentsPrivatesList({
          params: this.params,
        });
      }
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/privates/_students.scss";
</style>
