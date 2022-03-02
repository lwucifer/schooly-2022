<template>
  <div class="container">
    <div>
      <school-filter
        title="Danh sách trường học"
        :schoolTypes="schoolTypes"
        :hasSort="true"
        @handleChangeProvince="handleChangeProvince"
        @handleChangedDistrict="handleChangedDistrict"
        @handleChangedWard="handleChangedWard"
        @handleChangeSearch="handleChangeSearch"
      >
      </school-filter>

      
      <div class="school-list-box mb-0">
        <div class="school-list-box__title">
          <span class="school-list-box__title__name">Tất cả trường tiểu học</span>
          <span class="school-list-box__title__description">
            (
            <b>10</b> trường học -
            <b>0</b> giáo viên -
            <b>0</b> học sinh )
          </span>
        </div>
      </div>

      <!--Detail school types-->
      <SchoolListBox
          :category="categories[1]"
          @showAll="showAll"
          :schoolSearch="schoolSearch"
        >
        </SchoolListBox>
    </div>
  </div>
</template>

<script>
import SchoolFilter from "~/components/page/school/SchoolFilter";
import SchoolListBox from "~/components/page/school/SchoolListBox";
import SchoolSlider from "~/components/page/school/SchoolListSlider";
import { mapState } from "vuex";
// Import faked data
import {
  VILLAGES,
  DISTRICTS,
  PROVINCES,
  SCHOOL_TYPES,
  SCHOOL_TYPE_DETAILS,
} from "~/server/fakedata/school/test";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
import { useEffect } from "~/utils/common";

export default {
  name: "School",

  watchQuery: ["school_id"],

  components: {
    SchoolFilter,
    SchoolListBox,
    SchoolSlider
  },

  async fetch({ params, query, store }) {
    await store.dispatch(
      `elearning/public/public-category/${actionTypes.ELEARNING_PUBLIC_CATEGORY.LIST}`
    );
  },

  data() {
    return {
      isAuthenticated: true,
      schoolTypes: SCHOOL_TYPES,
      // list: SCHOOL_TYPE_DETAILS,
      province_id: "",
      district_id: "",
      ward_id: "",
      keyword: "",
    };
  },

  computed: {
    ...mapState("elearning/school/school-search", {
      schoolSearch: "elearningSchoolSearch",
    }),
    ...mapState("elearning/public/public-category", {
      categories: "categories",
    }),
  },

  created() {
    useEffect(this, this.handleGetSchoolsByLocation.bind(this), [
      "province_id",
      "district_id",
      "ward_id",
      "keyword",
    ]);
  },

  methods: {
    showAll(id) {
      console.log("[Page School] show all a type of school: ", id);
    },
    handleChangedWard(ward) {
      this.ward_id = get(ward, "id", "");
    },
    handleChangedDistrict(district) {
      this.district_id = get(district, "id", "");
    },
    handleChangeProvince(province) {
      this.province_id = get(province, "id", "");
    },
    handleChangeSearch(keyword) {
      this.keyword = keyword;
    },
    handleGetSchoolsByLocation() {
      let params = {};
      if (this.province_id) params.province_id = this.province_id;
      if (this.district_id) params.district_id = this.district_id;
      if (this.ward_id) params.ward_id = this.ward_id;
      if (this.keyword) params.keyword = this.keyword;
      const options = { params };
      this.$store.dispatch(
        `elearning/school/school-search/${actionTypes.ELEARNING_SCHOOL_SEARCH.LIST}`,
        options
      );
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/school/_school.scss";
</style>
