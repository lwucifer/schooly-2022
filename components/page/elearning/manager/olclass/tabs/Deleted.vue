<template>
  <div class="elearning-wrapper">
    <!--Filter form-->
    <div class="filter-form mb-3">
      <div class="d-flex">
        <div class="filter-form__item">
          <app-date-picker
            v-model="query_date"
            square
            size="sm"
            placeholder="dd/mm/yyyy"
            @input="handleDate"
          >
            <template v-slot:icon-calendar>
              <IconCalendar class="fill-primary" />
            </template>
          </app-date-picker>
        </div>

        <div class="filter-form__item" style="max-width:36rem;min-width:30rem;">
          <div style="width: 100%">
            <app-search
              class
              :placeholder="'Nhập để tìm kiếm...'"
              bordered
              v-model="query"
              :size="'sm'"
              @submit="submit"
              @keyup.enter.native="submit"
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
            <IconHamberger
              :class="showFilter ? 'fill-white' : 'fill-primary'"
              class="mr-2"
            />
            <span>Lọc kết quả</span>
          </app-button>
        </div>

        <div class="filter-form__item" v-if="showFilter">
          <app-vue-select
            class="app-vue-select filter-form__item__selection"
            v-model="filterClass"
            :options="courseClass"
            label="text"
            placeholder="Lớp"
            @input="handleChangedCourse"
            :all-opt="allOpt"
            has-border
          ></app-vue-select>
        </div>

        <div
          class="filter-form__item"
          style="min-width: 11rem"
          v-if="showFilter"
        >
          <app-vue-select
            class="app-vue-select filter-form__item__selection"
            v-model="filterGroup"
            :options="courseGroup"
            label="text"
            placeholder="Nhóm lớp"
            @input="handleChangedGroup"
            :all-opt="allOpt"
            has-border
          ></app-vue-select>
        </div>
      </div>
    </div>
    <!--End filter form-->

    <!--Table-->
    <OnlineClassTable
      :table-heads="tableHeads"
      :loading="loading"
      :pagination="pagination"
      @pagechange="onPageChange"
      @selectionChange="selectRow"
      @sort="handleSort"
      :multipleSelection="false"
      :actions="[0, 0, 1]"
      :data="classList"
    />
    <!--End table-->
  </div>
</template>

<script>
import IconCalendar from "~/assets/svg/icons/calendar2.svg?inline";
import IconTrash from "~/assets/svg/icons/trash-alt.svg?inline";
import IconHamberger from "~/assets/svg/icons/hamberger.svg?inline";
import OnlineClassTable from "~/components/page/elearning/manager/olclass/OnlineClassTable";

import { mapState, mapGetters } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get, reduce } from "lodash";
import { useEffect, allOptionSelect } from "~/utils/common";
import { getUTCDateTime } from "~/utils/moment";

const STORE_NAMESPACE = "elearning/teaching/olclass";
const STORE_PUBLIC_SEARCH = "elearning/public/public-search";

export default {
  components: {
    IconCalendar,
    IconTrash,
    IconHamberger,
    OnlineClassTable,
  },

  data() {
    return {
      allOpt: {
        value: null,
        text: "Tất cả",
      },
      loading: false,
      showFilter: false,
      courses: [],
      filterClass: null,
      filterGroup: null,
      pagination: {
        total: 0,
        number: 0,
        size: 10,
        total_elements: 0,
        first: 0,
        last: 0,
      },
      classList: [],
      lessonList: [],
      ids: [],
      params: {
        page: 1,
        size: 10,
        class_status: "DELETED",
        query: null,
        query_date: null,
        search_type: null,
        sort: "start_time,desc",
      },
      query: "",
      query_date: "",
      checkSubmit: false,
      checkPage: true,
      tableHeads: [
        {
          name: "online_class_name",
          text: "Phòng học",
          sort: true,
        },
        {
          name: "assignment_name",
          text: "Thuộc bài giảng<br/>/khoá học",
          sort: true,
        },
        {
          name: "start_time",
          text: "Thời gian học",
          sort: true,
        },
        {
          name: "num_student",
          text: "Số học sinh<br/>đã mời",
          sort: true,
        },
        {
          name: "teacher_name_assigned",
          text: "Giáo viên",
          sort: true,
        },
      ],
    };
  },
  computed: {
    ...mapState("auth", ["loggedUser"]),
    ...mapState(STORE_NAMESPACE, {
      stateClass: "OnlineClass",
    }),
    ...mapState(STORE_PUBLIC_SEARCH, {
      stateElearnings: "Elearnings",
    }),
    ...mapGetters("elearning", ["groupClsOpts"]),

    courseClass() {
      return allOptionSelect(
        this.groupClsOpts.filter((item) => item.type == "CLASS")
      );
    },
    courseGroup() {
      return allOptionSelect(
        this.groupClsOpts.filter((item) => item.type == "GROUP")
      );
    },
  },

  watch: {
    query() {
      this.checkSubmit = true;
    },
    query_date() {
      this.checkSubmit = true;
    },
  },

  methods: {
    getUTCDateTime,

    handleSort(e) {
      const sortBy = e.sortBy + "," + e.order;
      this.params = { ...this.params, sort: sortBy };
      this.getList();
    },

    toggleFilter() {
      if (
        this.showFilter &&
        (this.filterClass != null || this.filterGroup != null)
      ) {
        this.filterClass = null;
        this.filterGroup = null;
        this.params = { ...this.params, class_id: null, group_id: null };
        this.getList();
      }
      this.showFilter = !this.showFilter;
    },

    onPageChange(e) {
      const that = this;
      that.pagination = { ...that.pagination, ...e };
      that.params.size = that.pagination.size;
      that.params.page = that.pagination.number + 1;
      this.checkPage = false;
      that.getList();
    },

    handleDate() {
      this.getList();
    },

    submit() {
      if (this.checkSubmit) {
        this.getList();
        this.checkSubmit = false;
      }
    },

    handleChangedCourse(val) {
      this.params.class_id = this.filterClass.value;
      this.getList();
    },
    handleChangedGroup() {
      this.params.group_id = this.filterGroup.value;
      this.getList();
    },

    selectRow(data) {
      this.ids = data.map((row, index, data) => {
        return row.online_class_id;
      });
    },

    async getList() {
      const self = this;
      try {
        self.loading = true;
        let params = { ...self.params };
        if (this.query_date) params.query_date = this.query_date;
        if (this.query) params.query = this.query;
        if (this.checkPage) params.page = 1;
        await self.$store.dispatch(
          `${STORE_NAMESPACE}/${actionTypes.TEACHING_OLCLASSES.LIST}`,
          { params }
        );

        this.classList = this.get(self.stateClass, "data.content", []);
        this.pagination.size = this.get(this.stateClass, "data.size", 10);
        this.pagination.first = this.get(this.stateClass, "data.first", 1);
        this.pagination.last = this.get(this.stateClass, "data.last", 1);
        this.pagination.number = this.get(this.stateClass, "data.number", 0);
        this.pagination.total_pages = this.get(
          this.stateClass,
          "data.total_pages",
          0
        );
        this.pagination.total_elements = this.get(
          this.stateClass,
          "data.total_elements",
          0
        );
        this.pagination.number_of_elements = this.get(
          this.stateClass,
          "data.number_of_elements",
          0
        );
      } catch (e) {
      } finally {
        this.loading = false;
        this.checkPage = true;
      }
    },

    get,
  },

  created() {
    this.query_date = "";
    this.query = "";
    this.filterClass = null;
    this.filterGroup = null;
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/_elearning-filter-form.scss";
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
</style>
