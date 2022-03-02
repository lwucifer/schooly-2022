<template>
  <div class="container">
    <div>
      <school-filter
        class="mb-3"
        title="Danh sách trường học"
        :resultSpan="resultSummary"
        :schoolTypes="categoryOpts"
        :hasSort="true"
        :hasLocation="true"
        :hasSchoolLevel="true"
        :hasSearch="false"
        :hasSearchTitle="true"
        @handleChangeProvince="handleChangeProvince"
        @handleChangedLevel="handleChangedLevel"
        @handleChangedDistrict="handleChangedDistrict"
        @handleChangedWard="handleChangedWard"
        @handleChangeSearch="handleChangeSearch"
        @handleChangedOrder="handleChangeSort"
        @resetForm="handleResetForm"
      ></school-filter>
      <!--Detail school types-->
      <div v-if="pageLoading" class="container mt-6">
        <div class="row">
          <div v-for="i in 16" :key="i" class="col-md-3 mb-6">
            <div class="bg-white py-6 px-3">
              <VclList />
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <template v-if="get(schoolSummary, 'total_school', 0) == 0">
          <div class="text-gray-2 caption text-center">
          <img src="~assets/images/elearning/no-data.png" alt="" />
          </div>
        </template>

        <SchoolListBox v-else :category="selectedCategory"></SchoolListBox>
      </div>
    </div>
  </div>
</template>

<script>
import SchoolFilter from "~/components/page/school/SchoolFilter";
import SchoolListBox from "~/components/page/school/SchoolListBox";
import SchoolSlider from "~/components/page/school/SchoolListSlider";
import { mapState, mapMutations } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
import { useEffect } from "~/utils/common";
import { PAGE_SIZE } from "~/utils/constants";
import { VclList } from "vue-content-loading";

const SCHOOL_SUMMARY_NAMESPACE = "elearning/school/school-summary";

export default {
  name: "School",

  watchQuery: ["school_id"],

  components: {
    SchoolFilter,
    SchoolListBox,
    SchoolSlider,
    VclList
  },

  async asyncData({ store, query }) {
    const { keyword, type } = query; // get keyword, type from url

    return {
      keyword,
      type
    };
  },

  async fetch({ params, query, store }) {
    await store.dispatch(
      `elearning/public/public-category/${actionTypes.ELEARNING_PUBLIC_CATEGORY.LIST}`
    );
  },

  data() {
    return {
      keyword: this.get(this.$router, "query.keyword", ""),
      district_id: null,
      province_id: null,
      type: this.get(this.$router, "query.type", ""),
      ward_id: null,
      pageLoading: true,
      sort_by: null
    };
  },

  computed: {
    ...mapState(SCHOOL_SUMMARY_NAMESPACE, {
      schoolSummary: "elearningSchoolSummary"
    }),
    ...mapState("elearning/public/public-category", {
      categories: "categories"
    }),
     ...mapState("keyword", ["keywordSearchHeader"]),
    resultSummary() {
      const schoolNum = this.schoolSummary.total_school || 0;
      const studentNum = this.schoolSummary.total_student || 0;
      const teacherNum = this.schoolSummary.total_teacher || 0;

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

  beforeDestroy() {
    this.searchHeader();
  },

  watch: {
    keywordSearchHeader(_newVal) {
      this.handleChangeSearch(_newVal);
    }
  },

  async created() {
    this.keywordSearchHeader && this.handleChangeSearch(this.keywordSearchHeader);
    useEffect(this, this.handleGetSchoolsByLocation.bind(this), [
        "type",
        "province_id",
        "district_id",
        "ward_id",
        "keyword",
        "sort_by"
      ]);
  },

  mounted() {
    this.pageLoading = false;
  },
  

  methods: {
    ...mapMutations('keyword', ['searchHeader']),
    handleChangedLevel(level) {
      this.type = level
      // console.log('change level: ', level)
      // this.type = get(level, "type", "");
      this.$router.push({
        path: "/school/search",
        query: { keyword: this.keyword, type: this.type }
      });
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
      // this.$router.query.keyword = keyword;
      this.$router.push({
        path: "/school/search",
        query: { keyword: keyword, type: this.type }
      });
      this.keyword = keyword;
    },
    handleChangeSort(order) {
      this.sort_by = get(order, 'value')
    },
    handleResetForm(data) {
      console.log('reset form: ', data)
      this.district_id = get(data, 'district.id', null);
      this.province_id = get(data, 'province.id', null);
      this.ward_id = get(data, 'ward.id', null);
      this.type = get(data, 'level.type', null);
      this.keyword = this.get(this.$router, "query.keyword", "");
    },
    handleGetSchoolsByLocation() {
      let params = {};
      if (this.province_id) params.province_id = this.province_id;
      if (this.district_id) params.district_id = this.district_id;
      if (this.ward_id) params.ward_id = this.ward_id;
      if (this.keyword) params.keyword = this.keyword;
      if (this.type) params.type = this.type;
      if (this.sort_by) params.sort_by = this.sort_by;
      params.size = PAGE_SIZE.SCHOOL_16;

      const options = { params };
      this.$store.dispatch(
        `elearning/school/school-summary/${actionTypes.ELEARNING_SCHOOL_SUMMARY.LIST}`,
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
