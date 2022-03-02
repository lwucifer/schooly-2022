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
            >
              <template v-slot:icon-calendar>
                <IconCalendar class="fill-primary"/>
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
        <filter-button
            @click="toggleFilter"
            :color="showFilter ? 'primary': 'white'"
          ></filter-button>
      </div>

      <div class="filter-form__item" style="min-width: 19rem" v-if="showFilter">
        <app-vue-select
          class="app-vue-select filter-form__item__selection"
          v-model="filterCourse"
          :options="courseOpts"
          label="text"
          placeholder="Bài giảng/khóa học"
          @input="handleChangedCourse"
          :all-opt="allOpt"
          has-border
        ></app-vue-select>
      </div>
    </div>
    </div>
    <!--End filter form-->

    <!--Table-->
    <OnlineClassTable 
      :loading="loading" 
      :pagination="pagination" 
      @pagechange="onPageChange"
      @selectionChange="selectRow"
      @sort="handleSort"
      :data="classList"/>
    <!--End table-->
    
  </div>
</template>

<script>
import IconCalendar from "~/assets/svg/icons/calendar2.svg?inline";
import IconTrash from "~/assets/svg/icons/trash-alt.svg?inline";
import IconHamberger from '~/assets/svg/icons/hamberger.svg?inline';
import OnlineClassTable from "~/components/page/elearning/mycourses/tables/OnlineClassTable";

import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get, reduce } from "lodash";
import { useEffect } from "~/utils/common";
import {
  getUTCDateTime,
  getDateFormat
} from "~/utils/moment";

const STORE_NAMESPACE = "elearning/study/study-olclass";
const STORE_PUBLIC_SEARCH = "elearning/public/public-search";

export default {
  components: {
    IconCalendar,
    IconTrash,
    IconHamberger,
    OnlineClassTable
  },

  data() {
    return {
      allOpt: {
        value: null,
        text: 'Tất cả'
      },
      loading: false,
      showFilter: false,
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
      classList: [],
      lessonList: [],
      ids: [],
      params: {
        page: 1,
        size: 10,
        status: 0,
        query: null,
        from: null
      },
      query: '',
      query_date: '',
      checkSubmit: false,
      checkPage: true
    };
  },

  computed: {
    ...mapState("auth", ["loggedUser"]),
    ...mapState(STORE_NAMESPACE, {
      stateClass: "OnlineClasses"
    }),
    ...mapState('elearning/study/study-elearning', {
      stateElearnings: "Elearnings"
    }),

    courseOpts() {
      let data = get(this, 'stateElearnings.content', []).map((item) => ({
        value: item.elearning_id,
        text: item.name,
      }));
      return [this.allOpt, ...data]
    }
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
    getDateFormat,
    
    handleSort(e) {
      const sortBy = e.sortBy + ',' + e.order;
      this.params = {...this.params, sort: sortBy};
      this.getList();
    },

    toggleFilter() {
      if (this.showFilter && this.filterCourse != null) {
        this.filterCourse = null;
        this.params = {...this.params,
          elearning_id: null
        }
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

    submit() {
      if (this.checkSubmit) {
        this.getList();
        this.checkSubmit = false;
      }
    },
    
    handleChangedCourse(val) {
      this.params.object_id = this.filterCourse.value;
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
        let params = { ...self.params};
        if (this.query_date) params.from = this.getDateFormat(this.query_date);
        if (this.query) params.query = this.query;
        if(this.checkPage) params.page = 1;
        await self.$store.dispatch(
          `${STORE_NAMESPACE}/${actionTypes.STUDY_ELEARNING_OLCLASSES.LIST}`,
          { params }
        );

        this.classList = this.get(self.stateClass, "content", []);
        this.pagination.size = this.get(this.stateClass, "size", 10);
        this.pagination.first = this.get(this.stateClass, "first", 1);
        this.pagination.last = this.get(this.stateClass, "last", 1);
        this.pagination.number = this.get(this.stateClass, "number", 0);
        this.pagination.total_pages = this.get(
          this.stateClass,
          "total_pages",
          0
        );
        this.pagination.total_elements = this.get(
          this.stateClass,
          "total_elements",
          0
        );
        this.pagination.number_of_elements = this.get(
          this.stateClass,
          "number_of_elements",
          0
        );
      } catch (e) {
      } finally {
        this.loading = false;
        this.checkPage = true;
      }
    },

    get
  },

  created() {
    this.getList();
  }
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