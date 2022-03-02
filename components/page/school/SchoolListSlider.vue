<template>
  <div class="school-list-box" v-if="schools.length > 0">
    <div class="school-list-box__title">
      <div>
        <span class="school-list-box__title__name">{{ category.name }}</span>
        <span class="school-list-box__title__description">
          (
          <b>{{ totalSchool }}</b> trường học -
          <b>{{ totalTeacher }}</b> giáo viên -
          <b>{{ totalStudent }}</b> học sinh )
        </span>
      </div>
      <n-link class="school-list-box__title__submit-btn" :to="`/school/search?type=${category.type}`">
        Xem thêm
        <IconRight class="fill-primary" />
      </n-link>
    </div>
    <!--List schools-->
    <div class="school-list-box__content">
      <app-carousel :options="{ slidesPerView: 4, spaceBetween: 24 }">
        <template slot="default" slot-scope="{ classes }">
          <div
            v-for="(school, index) in schools"
            :key="index"
            :class="classes"
          >
            <school-item :school="school" />
          </div>
        </template>
      </app-carousel>
    </div>
  </div>
</template>

<script>
import { assignIn } from "lodash";
import IconRight from "~/assets/svg/icons/arrow-forward-ios-24px-outlined.svg?inline";
import IconChevronLeft from "~/assets/svg/icons/chevron-left.svg?inline";
import IconChevronRight from "~/assets/svg/icons/chevron-right.svg?inline";
import SchoolItem from "~/components/page/school/SchoolItem";
import { get, toNumber } from "lodash";
import { SCHOOL_TYPE } from "~/server/fakedata/school/test";

export default {
  components: {
    SchoolItem,
    IconRight,
    IconChevronLeft,
    IconChevronRight
  },

  props: {
    category: {
      type: Object,
      required: true
    },
    schools: {
      type: Array,
      default: () => []
    },
    totalSchool: {
      type: String | Number,
      default: 0
    },
    totalTeacher: {
      type: String | Number,
      default: 0
    },
    totalStudent: {
      type: String | Number,
      default: 0
    }
  },

  data() {
    const defaultSwiperOptions = {
      slidesPerView: "auto",
      spaceBetween: 4,
      navigation: true,
      pagination: false,
      showName: false,
      loop: true,
      breakpoints: {
        4000: {
          slidesPerView: 5,
          spaceBetween: 20
        },
        1366: {
          slidesPerView: 5,
          spaceBetween: 20
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 20
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 20
        },
        640: {
          slidesPerView: 2,
          spaceBetween: 10
        },
        320: {
          slidesPerView: 1,
          spaceBetween: 10
        }
      }
    };

    return {
      defaultSwiperOptions,
      currentSwiperOptions: assignIn(defaultSwiperOptions, this.sliderOptions),
      sliderOptions: {
        spaceBetween: 20,
        slidesPerView: 5,
        setWrapperSize: true,
        autoHeight: false,
        watchOverflow: true,
        showName: true
      }
    };
  },

  computed: {
    // schools() {
    //   const type = get(this, "category.type", "");
    //   const schoolList = get(this, `schoolSearch.data.content`, []);
    //   console.log("[schools]", type, schoolList, schoolList.filter(sc => sc.type == type))
    //   return schoolList.filter(sc => sc.type == type);
    // },

    schoolNum() {
      return this.schools.length || 0;
    },

    studentNum() {
      return this.schools.reduce((a, b) => {
        return a + b.student_number;
      }, 0);
    },

    teacherNum() {
      return this.schools.reduce((a, b) => {
        return a + b.teacher_number;
      }, 0);
    }
  },

  methods: {
    showAll() {
      this.$emit("showAll", this.id);
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/school/_school-list-box.scss";
.app-carousel-wrapper {
  width: 100%;
  position: relative;
}
</style>
