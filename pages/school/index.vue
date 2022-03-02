<template>
  <div class="container">
    <school-filter
      title="Danh sách trường học"
      :schoolTypes="[]"
      :hasSort="false"
      :hasSearch="true"
      :hasSchoolLevel="false"
      :hasLocation="false"
      :hasFilterBtn="false"
      @handleChangeProvince="handleChangeProvince"
      @handleChangedDistrict="handleChangedDistrict"
      @handleChangedWard="handleChangedWard"
      @handleSubmitSearch="handleSubmitSearch"
    ></school-filter>
    <!--Detail school types-->
    <!--v-for="(category, index) in categories" :key="index"-->
    <div v-if="pageLoading" class="container mt-6">
      <div class="row">
        <div v-for="i in 16" :key="i" class="col-md-3 mb-6">
          <div class="bg-white py-6 px-3">
            <VclList />
          </div>
        </div>
      </div>
    </div>

    <div v-for="(value, name, index) in list" :key="index" v-else>
      <SchoolSlider
        :category="{ name: get(value, 'name', ''), type: get(value, 'name_en', '') }"
        :total-school="get(value, 'total_school', 0)"
        :total-teacher="get(value, 'total_teacher', 0)"
        :total-student="get(value, 'total_student', 0)"
        @showAll="showAll"
        :schools="get(value, 'schools', [])"
      ></SchoolSlider>
    </div>
  </div>
</template>

<script>
import SchoolFilter from "~/components/page/school/SchoolFilter";
import SchoolListBox from "~/components/page/school/SchoolListBox";
import SchoolSlider from "~/components/page/school/SchoolListSlider";
import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
import { useEffect } from "~/utils/common";
import { VclList } from "vue-content-loading";

const NAMESPACE_SCHOOL_STANDALONE = "elearning/school/school-standalone";

export default {
  name: "School",

  watchQuery: ["school_id"],

  components: {
    SchoolFilter,
    SchoolListBox,
    SchoolSlider,
    VclList,
  },

  async fetch({ params, query, store }) {
    await store.dispatch(
      `${NAMESPACE_SCHOOL_STANDALONE}/${actionTypes.ELEARNING_SCHOOL_STANDALONE.LIST}`,
      { size: 16 }
    );
  },

  data() {
    return {
      isAuthenticated: true,
      pageLoading: true,
      province_id: "",
      district_id: "",
      ward_id: "",
      keyword: ""
    };
  },

  computed: {
    ...mapState(NAMESPACE_SCHOOL_STANDALONE, {
      list: "standaloneSchools"
    }),
    ...mapState("elearning/public/public-category", {
      categories: "categories"
    }),
    ...mapState("elearning/school/school-summary", {
      schoolSummary: "elearningSchoolSummary"
    }),
    schools() {
      return get(this, `schoolSummary.data.content`, []);
    },
    resultSummary() {
      const schoolNum = this.schoolSummary.total_school;
      const studentNum = this.schoolSummary.total_student;
      const teacherNum = this.schoolSummary.total_teacher;

      return `(${schoolNum} trường - ${teacherNum} giáo viên - ${studentNum} học sinh)`;
    },
    categoryOpts() {
      return this.categories;
    },
    selectedCategory() {
      if (this.type) return this.categories.find(c => c.type == this.type);
      return {};
    },

    selectedType() {
      return this.type;
    }
  },

  created() {
    // useEffect(this, this.handleGetSchoolsByLocation.bind(this), [
    //   "province_id",
    //   "district_id",
    //   "ward_id",
    //   "keyword",
    // ]);
  },

  mounted() {
    this.pageLoading = false;
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
    handleSubmitSearch(keyword) {
      this.keyword = keyword;
      this.$router.push(`/school/search?keyword=${this.keyword}`);
    },
    handleGetSchoolsByLocation() {
      console.log("[handleGetSchoolsByLocation]")
      this.pageLoading = true;

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
    get
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/school/_school.scss";
</style>
