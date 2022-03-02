<template>
  <div class="container">
    <breadcrumb />

    <div class="row">
      <div class="col-md-3">
        <!-- <ElearningManagerSide :group="2" :active="4" /> -->
        <MenuSideMyTutor :active="4" />
      </div>
      <div class="col-md-9">
        <sub-block-section title="Bài tập và bài kiểm tra">
          <template v-slot:content>
            <div class="elearning-manager-content p-0">
              <div class="elearning-manager-content__title">
                <head-tabs
                  :tabs="tabs"
                  :active.sync="tab"
                  @selectedItem="changeTab"
                />
              </div>

              <div class="elearning-manager-content__main">
                <keep-alive>
                  <component v-bind:is="currentTabComponent" @reload="getList"></component>
                </keep-alive>
              </div>
            </div>
          </template>
        </sub-block-section>
      </div>
    </div>
  </div>
</template>

<script>
import MenuSideMyTutor from "~/components/page/elearning/mytutor/MenuSideMyTutor"
import ElearningManagerFilterForm from "~/components/page/elearning/mytutor/exam/forms/ExerciseElearningFilter";
import ElearningManagerFilterTable from "~/components/page/elearning/mytutor/exam/tables/ExerciseElearning";
import { redirectWithParams } from "~/utils/common";
// import Breadcrumb from "~/components/layout/breadcrumb/BreadCrumb";
import HeadTabs from "~/components/page/elearning/HeadTab";
import { mapState } from "vuex";
import { get } from "lodash";
import * as actionTypes from "~/utils/action-types";
// import ExerciseTab from './tabs/exercise-elearning'

const ExerciseTab = () =>
  import("~/components/page/elearning/mytutor/exam/ExerciseElearning");
const ExamTab = () =>
  import("~/components/page/elearning/mytutor/exam/ExamElearning");

const STORE_NAMESPACE = "elearning/teaching/exercise-elearning";

export default {
  layout: "manage",

  components: {
    // Breadcrumb,
    HeadTabs,
    MenuSideMyTutor,
    ElearningManagerFilterForm,
    ElearningManagerFilterTable,
    ExerciseTab,
    ExamTab,
  },

  data() {
    return {
      tab: "exercise",
      tabs: [
        {
          key: "exercise",
          text: "Bài tập",
        },
        {
          key: "exam",
          text: "Bài kiểm tra",
        },
      ],
      pagination: {
        total_elements: 0,
        total_pages: 1,
        number_of_elements: 0,
        last: false,
        size: 10,
        number: 0,
        first: true,
      },
      params: {
        page: 1,
        size: 10,
      },
      list: [],
      loading: false,
    };
  },
  computed: {
    ...mapState("auth", ["loggedUser"]),
    ...mapState(STORE_NAMESPACE, {
      detailInfo: "elearnings",
    }),
    currentTabComponent: function() {
      const MATCHED_TABS = {
        exercise: "ExerciseTab",
        exam: "ExamTab",
      };
      return MATCHED_TABS[this.tab];
    },
  },

  methods: {
    updateFilter(val) {
      this.params = { ...this.params, ...val };
      this.refreshData();
    },
    handleChangedType(val) {
      this.updateFilter({ type: val });
    },
    handleSubmitSearch(val) {
      this.updateFilter({ query: val });
    },
    submitFilter(val) {
      this.updateFilter(val);
    },
    updatePagination(val) {
      this.params.size !== val.size
        ? (this.params.page = 1)
        : (this.params.page = val.number + 1);
      this.params.size = val.size;
      this.getList();
    },
    async getList() {
      try {
        this.loading = true;
        let params = { ...this.params };
        console.log("[getList]", params);

        await this.$store.dispatch(
          `${STORE_NAMESPACE}/${actionTypes.ELEARNING_TEACHING_EXERCISE_ELEARNING.LIST}`,
          { params }
        );
        this.list = this.get(this.detailInfo, "data.content", []);
        this.pagination.size = this.get(this.detailInfo, "data.page.size", 10);
        this.pagination.first = this.get(this.detailInfo, "data.page.first", 1);
        this.pagination.last = this.get(this.detailInfo, "data.page.last", 1);
        this.pagination.number = this.get(
          this.detailInfo,
          "data.page.number",
          0
        );
        this.pagination.total_pages = this.get(
          this.detailInfo,
          "data.page.total_pages",
          0
        );
        this.pagination.total_elements = this.get(
          this.detailInfo,
          "data.page.total_elements",
          0
        );
        this.pagination.number_of_elements = this.get(
          this.detailInfo,
          "data.page.number_of_elements",
          0
        );
        // this.pagination = { ...this.get(this.detailInfo, 'data.page', {}) }
      } catch (e) {
        console.log("Get list exercise elearning", e);
      } finally {
        this.loading = false;
      }
    },
    refreshData() {
      this.params.page = 1;
      this.getList();
    },
    changeTab(key) {
      const tab =
        this.$route.query && this.$route.query.tab
          ? redirectWithParams({ tab: key ? key : "" })
          : "";
      this.tab = key;
    },
    get,
  },
  created() {
    this.tab =
      this.$route.query && this.$route.query.tab == "exam"
        ? "exam"
        : "exercise";
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/manager/_elearning-manager-content.scss";
</style>
