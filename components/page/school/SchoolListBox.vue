<template>
  <div class="school-list-box">
    <!--List schools-->
    <div class="school-list-box__content">
      <div class="row row--school-list">
        <div
          class="col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-3"
          v-for="(school, index) in schools"
          :key="index"
        >
          <school-item :school="school" />
        </div>
      </div>

      <app-pagination
        :pagination="pagination"
        @pagechange="onPageChange"
        :opts="opts"
        class="mt-3"
      />
    </div>
  </div>
</template>

<script>
import IconRight from "~/assets/svg/icons/arrow-forward-ios-24px-outlined.svg?inline";

import SchoolItem from "~/components/page/school/SchoolItem";
import { get, toNumber } from "lodash";
import { mapState, mapActions } from "vuex";
import { PAGE_SIZE } from '~/utils/constants';


export default {
  components: {
    SchoolItem,
    IconRight
  },

  props: {
    category: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      opts: [
        { value: 10, text: "10" },
        { value: 20, text: "20" },
        { value: 30, text: "30" },
        { value: 50, text: "50" }
      ]
    };
  },

  computed: {
    ...mapState("elearning/school/school-summary", ["elearningSchoolSummary"]),

    schools() {
      const type = get(this.$route, "query.type", "");
      const schoolList = get(this, `elearningSchoolSummary.schools.content`, []);
      // console.log("[schoolList]", schoolList, type);
      if (!type) return schoolList;
      return schoolList.filter(sc => sc.type == type) || [];
    },
    pagination() {
      const pagination = {
        total_pages: get(this.elearningSchoolSummary, "schools.total_pages", 0),
        size: get(this.elearningSchoolSummary, "schools.size", 10),
        total_elements: get(this.elearningSchoolSummary, "schools.total_elements", 0),
        first: get(this.elearningSchoolSummary, "schools.first", false),
        last: get(this.elearningSchoolSummary, "schools.last", false),
        number: get(this.elearningSchoolSummary, "schools.number", 0)
      };

      console.log("[pagination]", pagination, this.elearningSchoolSummary);
      return pagination;
    }
  },

  methods: {
    ...mapActions("elearning/school/school-summary", [
      "elearningSchoolSummaryList"
    ]),

    onPageChange(e) {
      // this.$emit("pagechange", e);
      console.log("[onPageChange]", e);

      const params = {};
      const type = get(this.$route, "query.type", "");
      const keyword = get(this.$route, "query.keyword", "");
      const page = e.number + 1;
      const size = e.size;
      if (type) params.type = type;
      if (keyword) params.keyword = keyword;
      if (page) params.page = page;
      if (size) params.size = size;
      params.size = PAGE_SIZE.SCHOOL_16;

      this.elearningSchoolSummaryList({ params });
    },
    showAll() {
      // this.$emit("showAll", this.id);
      console.log("[showAll]", e);
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/school/_school-list-box.scss";
</style>
