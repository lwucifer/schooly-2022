<template>
  <div class="elearning-wrapper">
    <!--Filter form-->
    <div class="filter-form mb-3">
      <div class="d-flex">
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
      :joinClass="true"
      :data="classList"/>
    <!--End table-->

    <ModalJoinClass :id="rowClassId" v-if="modalShow" @close="modalShow = false" :info="modalData"/>
    
  </div>
</template>

<script>
import IconFilter from "~/assets/svg/icons/filter.svg?inline";
import IconSearch from "~/assets/svg/icons/search.svg?inline";
import IconArrow from "~/assets/svg/icons/arrow.svg?inline";
import IconCalendar from "~/assets/svg/icons/calendar2.svg?inline";
import IconTrash from "~/assets/svg/icons/trash-alt.svg?inline";
import IconHamberger from '~/assets/svg/icons/hamberger.svg?inline';
import IconTimesCircle from '~/assets/svg/design-icons/times-circle.svg?inline';
import OnlineClassTable from "~/components/page/elearning/mycourses/tables/OnlineClassTable";

import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get, reduce } from "lodash";
import { useEffect } from "~/utils/common";

const STORE_NAMESPACE = "elearning/study/study-olclass";

export default {
  components: {
    IconTimesCircle,
    IconFilter,
    IconSearch,
    IconArrow,
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
      rowClassId: null,
      showFilter: false,
      modalShow: false,
      modalData: {},
      filterCourse: null,
      courses: [],
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
        status: 1,
        query: null,
      },
      loading: false,
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
    handleChangedCourse() {
      this.params.elearning_id = this.filterCourse.value;
      this.getList();
    },
    handleFocusSearchInput() {},
    handleBlurSearchInput() {},
    handleSearch() {},
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
        if(this.checkPage) params.page = 1;
        await self.$store.dispatch(
          `${STORE_NAMESPACE}/${actionTypes.STUDY_ELEARNING_OLCLASSES.LIST}`,
          { params }
        );
        self.classList = self.get(self.stateClass, "content", []);
        self.pagination.size = self.get(self.stateClass, "size", 10);
        self.pagination.first = self.get(self.stateClass, "first", 1);
        self.pagination.last = self.get(self.stateClass, "last", 1);
        self.pagination.number = self.get(self.stateClass, "number", 0);
        self.pagination.total_pages = self.get(
          self.stateClass,
          "total_pages",
          0
        );
        self.pagination.total_elements = self.get(
          self.stateClass,
          "total_elements",
          0
        );
        self.pagination.number_of_elements = self.get(
          self.stateClass,
          "number_of_elements",
          0
        );
      } catch (e) {
      } finally {
        self.loading = false;
        self.checkPage = true;
      }
    },

    openModal(row) {
      this.rowClassId = row.online_class_id;
      this.modalData = row;
      this.modalShow = true;
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