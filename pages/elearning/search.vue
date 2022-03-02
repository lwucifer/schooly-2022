<template>
  <div class="elearning-search container">
    <h1 class="elearning-search__heading heading-3">
      <span class="font-weight-semi-bold">Kết quả tìm kiếm</span>
      <span class="body-2 font-weight-normal">
        (
        <b>{{ totalSummary }}</b>
        kết quả )
      </span>
    </h1>

    <div class="elearning-search__toolbar">
      <app-button :color="isFilter ? 'primary' : 'default'" size="sm" @click="isFilter = !isFilter">
        <IconHamberger class="icon mr-1" />&nbsp;Lọc kết quả
      </app-button>

      <template v-if="isFilter">
        <app-select
          v-model="type"
          @change="handleChangeTab"
          :options="types"
          placeholder="Thể loại"
          size="sm"
        />
        <app-select
          v-model="fee"
          @change="handleChangeFee"
          :options="feeOpts"
          placeholder="Học phí"
          size="sm"
        />
        <app-select
          v-model="time"
          @change="handleChangeTimes"
          :options="timeOpts"
          placeholder="Thời lượng"
          size="sm"
        />
        <app-select
          v-model="level"
          @change="handleChangeLevel"
          :options="categoryOpts"
          placeholder="Trình độ"
          size="sm"
        />
        <app-select
          v-model="subject"
          @change="handleChangeSubject"
          :options="subjectOpts"
          placeholder="Môn học"
          size="sm"
        />
      </template>

      <div class="ml-auto">
        <span class="text-dark body-3 mr-3">Sắp xếp</span>
        <app-select
          v-model="sort"
          :options="sortOpts"
          @change="handleChangeSort"
          placeholder
          size="sm"
        />
      </div>
    </div>

    <!-- <div class="elearing-search__tabs">
      <a
        v-for="item in tabs"
        :key="item.tab"
        :href="`#${item.tab}`"
        :class="['elearning-search__tab', tab === item.tab && 'active']"
        @click.prevent="handleChangeTab(item.tab)"
      >{{ item.text }}</a>
    </div>-->

    <div v-if="pageLoading" class="container mt-6">
      <div class="row">
        <div v-for="i in 16" :key="i" class="col-md-3 mb-6">
          <div class="bg-white py-6 px-3">
            <VclList />
          </div>
        </div>
      </div>
    </div>

    <template v-for="item in tabs" v-else>
      <div
        v-show="item.tab === tab"
        class="elearning-search__tab-pane"
        :key="item.tab"
        :id="item.tab"
      >
        <div class="row">
          <div class="col-md-3 elearning-search__col" v-for="item in lessons" :key="item.id">
            <CourseItem2 class="my-0" :item="item" :size="'sm'" />
          </div>
        </div>

        <app-pagination
          :pagination="pagination"
          @pagechange="onPageChange"
          :opts="opts"
          class="mt-3"
        />
      </div>
    </template>
    <template  v-if="totalSummary == 0">
      <div class="text-gray-2 caption text-center">
       <img src="~assets/images/elearning/no-data.png" alt="" />
      </div>
    </template>
  </div>
</template>

<script>
import { get } from "lodash";
import { mapState, mapMutations } from "vuex";
import * as actionTypes from "~/utils/action-types";
import Search from "~/services/elearning/public/Search";
import {
  ELEARNING_TYPES_VALUE,
  PAGE_SIZE,
  ELEARNING_TYPES_TEXT,
  SORT_ELEARNING
} from "~/utils/constants";
import { addAllOptionSelect, optionSelectSubject, redirectWithParams } from "~/utils/common";

import IconHamberger from "~/assets/svg/icons/hamberger.svg?inline";
import CourseItem2 from "~/components/page/course/CourseItem2";

import { VclList } from "vue-content-loading";

export default {
  name: "ELearningSearch",

  components: {
    IconHamberger,
    CourseItem2,
    VclList
  },

  data() {
    return {
      fee: null,
      feeOpts: [
        { value: null, text: "Tất cả" },
        { value: 1, text: "Miễn phí" },
        { value: 0, text: "Có phí" }
      ],
      time: null,
      timeOpts: [
        { value: null, text: "Tất cả" },
        { value: "0h-1h", text: "0 - 1 giờ" },
        { value: "1h-2h", text: "1 - 2 giờ" },
        { value: "2h-4h", text: "2 - 4 giờ" },
        { value: "4h+", text: "Trên 4 giờ" }
      ],
      level: null,
      // levelOpts: [
      //   { value: 0, text: "Trình độ 1" },
      //   { value: 1, text: "Trình độ 2" },
      //   { value: 2, text: "Trình độ 3" },
      //   { value: 3, text: "Trình độ 4" }
      // ],
      subject: null,
      sort: this.$route.query.sort
        ? this.$route.query.sort
        : SORT_ELEARNING.RELATED,
      sortOpts: [
        { value: SORT_ELEARNING.RELATED, text: "Liên quan nhất" },
        { value: SORT_ELEARNING.RATE, text: "Đánh giá cao nhất" },
        { value: SORT_ELEARNING.COMMENT, text: "Nhiều bình luận nhất" },
        { value: SORT_ELEARNING.NEWEST, text: "Mới nhất" },
        { value: SORT_ELEARNING.PRICE_ASC, text: "Giá thấp nhất" },
        { value: SORT_ELEARNING.PRICE_DESC, text: "Giá cao nhất" }
      ],
      isFilter: false,
      lessons: [],
      tab: "lecture",
      tabs: [
        { tab: null, text: "Tất cả" },
        {
          tab: ELEARNING_TYPES_VALUE.LECTURE,
          text: "Bài giảng"
        },
        {
          tab: ELEARNING_TYPES_VALUE.COURSE,
          text: "Khoá học"
        }
      ],
      type: this.$route.query.type
        ? this.$route.query.type
        : null,
      types: [
        { value: null, text: "Tất cả" },
        {
          value: ELEARNING_TYPES_VALUE.LECTURE,
          text: "Bài giảng"
        },
        {
          value: ELEARNING_TYPES_VALUE.COURSE,
          text: "Khoá học"
        }
      ],
      payload: {
        subject: this.$route.query.subject ? this.$route.query.subject : null,
        type: this.$route.query.type
          ? this.$route.query.type
          : null,
        duration: null,
        level: null,
        free: null,
        page: 1,
        limit: PAGE_SIZE.ELEARNING_12,
        sort: this.$route.query.sort
          ? this.$route.query.sort
          : null,
        keyword: null,
        hidden: false
      },

      pagination: {
        first: true,
        last: false,
        number: 0,
        number_of_elements: 0,
        size: 10,
        total_elements: 0,
        total_pages: 0
      },

      opts: [
        { value: 10, text: "10" },
        { value: 20, text: "20" },
        { value: 30, text: "30" },
        { value: 50, text: "50" }
      ],

      pageLoading: true
    };
  },

  async asyncData({ store, query }) {
    const { subject } = query; // get keyword, type from url
    return {
      subject
    };
  },

  async fetch({ params, query, store }) {
    await store.dispatch(
      `elearning/public/public-levels/${actionTypes.ELEARNING.LEVEL}`
    );
    await store.dispatch(
      `elearning/public/public-subject/${actionTypes.ELEARNING.SUBJECT}`
    );
  },

  async created() {
    this.payload.keyword = await this.keywordSearchHeader ? this.keywordSearchHeader : null;
    this.getLessons();
  },

  computed: {
    ...mapState("elearning/public/public-levels", {
      levels: "levels"
    }),
    ...mapState("elearning/public/public-subject", {
      subjects: "subjects",
    }),

    ...mapState("elearning/public/public-voted-subjects", ["votedSubjects"]),
    ...mapState("keyword", ["keywordSearchHeader"]),

    categoryOpts() {
      const alls = optionSelectSubject(this.levels);
      return alls.map(c => {
        return {
          value: c.id,
          text: c.name
        };
      });
    },
    subjectOpts(){
      this.subject = this.$route.query.subject ? this.$route.query.subject : null;
      const alls = addAllOptionSelect(this.subjects);
      return alls.map(c => {
        return {
          value: c.code,
          text: c.name,
        };
      });
    },

    totalSummary() {
      return get(this, "pagination.total_elements", 0);
    },
    lessonType() {
      const lessionType = this.payload.type;
      console.log("[lessonType]", lessionType);
      return ELEARNING_TYPES_TEXT[lessionType];
    }
  },

  watch: {
    keywordSearchHeader(_newVal) {
      this.payload.page = 1;
      this.payload.keyword = _newVal ? _newVal : null;
      this.getLessons();
    },
    isFilter(_newVal){
      if(!_newVal){
        this.level = null;
        this.fee = null;
        this.time = null;
        this.payload.page = 1;
        this.payload.free = null;
        this.payload.duration = null;
        this.payload.level = null;
        this.payload.keyword = _newVal ? _newVal : null;
        this.getLessons();
      }
    }
  },

  beforeDestroy() {
    this.searchHeader();
  },

  mounted() {
    // this.pageLoading = true;
    // setTimeout(() => {
    //   this.pageLoading = false;
    // }, 5000);
  },

  methods: {
    get,
    ...mapMutations('keyword', ['searchHeader']),
    async getLessons() {
      this.pageLoading = true;
      Object.keys(this.payload).map(k => {
        if (this.payload[k] == null || this.payload[k] == -1) {
          delete this.payload[k];
        }
      });
      if (this.payload.free != undefined) {
        this.payload.free = !!this.payload.free;
      }

      const res = await new Search(this.$axios)[actionTypes.BASE.ADD](
        this.payload
      );
      console.log('res', res)
      this.lessons = get(res, "data.content", []);
      this.pagination = {
        total_pages: get(res, "data.page.total_pages", 0),
        size: get(res, "data.page.size", 10),
        total_elements: get(res, "data.page.total_elements", 0),
        first: get(res, "data.page.first", false),
        last: get(res, "data.page.last", false),
        number: get(res, "data.page.number", 0)
      };
      console.log("[this.pagination]", this.pagination);

      this.pageLoading = false;
    },

    handleChangeFee(_newVal, _selectedVal) {
      console.log("[handleChangeFee]", _newVal, _selectedVal);
      this.payload.page = 1;
      this.payload.free = _newVal;
      this.getLessons();
    },

    handleChangeTimes(_newVal, _selectedVal) {
      console.log("[handleChangeTimes]", _newVal, _selectedVal);
      this.payload.page = 1;
      this.payload.duration = _newVal;
      this.getLessons();
    },

    handleChangeLevel(_newVal, _selectedVal) {
      console.log("[handleChangeLevel]", _newVal, _selectedVal);
      this.payload.page = 1;
      this.payload.level = _newVal;
      this.getLessons();
    },
    handleChangeSubject(_newVal, _selectedVal){
      console.log("[handleChangeSubject]", _newVal, _selectedVal);
      redirectWithParams({subject:_newVal ? _newVal : ''})
      this.payload.page = 1;
      this.payload.subject = _newVal;
      console.log('this.subject', this.subject)
      this.getLessons();
    },

    handleChangeTab(_newVal) {
      console.log("[handleChangeTab]", _newVal);
      redirectWithParams({type:_newVal ?_newVal : ''})
      this.payload.page = 1;
      this.tab = _newVal;
      this.payload.type = _newVal;
      this.getLessons();
    },

    handleChangeSort(_newVal, _selectedVal) {
      console.log("[handleChangeSort]", _newVal, _selectedVal);
      redirectWithParams({sort:_newVal ?_newVal : ''})
      this.payload.page = 1;
      this.payload.sort = _newVal;
      this.getLessons();
    },

    onPageChange(e) {
      console.log("[onPageChange]", e);
      this.payload.page = e.number + 1;
      this.payload.limit = PAGE_SIZE.ELEARNING_12;

      this.getLessons();
    },

    calcDiscount(elearning) {
      const { price = {} } = elearning;
      const currentPrice = price.price || 0;
      const originPrice = price.original_price || 0;
      return (currentPrice / originPrice) * 100;
    },

    isDiscount(elearning) {
      const { price = {} } = elearning;
      return price.price != price.original_price;
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/_elearning-search.scss";
</style>
