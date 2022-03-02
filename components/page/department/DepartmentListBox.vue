<template>
  <div class="school-list-box">
    <div class="school-list-box__title">
      <h4>
        <span class="school-list-box__title__name">{{ category.name }}</span>
        <span class="school-list-box__title__description">
          (
          {{ schoolNum }} trường học - {{ teacherNum }} giáo viên -
          {{ studentNum }} học sinh )
        </span>
      </h4>
    </div>
    <!--List schools-->
    <div class="school-list-box__content">
      <div class="row row--school-list">
        <div
          class="custom-col-lg-5 col-3 col-sm-6 col-xs-12"
          v-for="(school, index) in schools"
          :key="index"
        >
          <school-item :school="school" />
        </div>
      </div>
    </div>
    <div class="school-list-box__footer">
      <div class="text-center">
        <app-button
          square
          class="mt-3 school-list-box__footer__submit-btn"
          @click="showAll"
        >
          <span class="">Xem tất cả</span>
        </app-button>
      </div>
    </div>
  </div>
</template>

<script>
import SchoolItem from "~/components/page/school/SchoolItem";
import { get, toNumber } from "lodash";
import { SCHOOL_TYPE } from "~/server/fakedata/school/test";

export default {
  components: {
    SchoolItem
  },

  props: {
    category: {
      type: Object,
      required: true
    },
    schoolSearch: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    schoolNum() {
      const type = get(this, "category.type", "");
      const schoolNumKey = get(SCHOOL_TYPE[type], "schoolNumKey", "");
      return get(this, `schoolSearch.data.${schoolNumKey}`, 0);
    },
    studentNum() {
      const type = get(this, "category.type", "");
      const studentNumKey = get(SCHOOL_TYPE[type], "studentNumKey", "");
      return get(this, `schoolSearch.data.${studentNumKey}`, 0);
    },
    teacherNum() {
      const type = get(this, "category.type", "");
      const teacherNumKey = get(SCHOOL_TYPE[type], "teacherNumKey", "");
      return get(this, `schoolSearch.data.${teacherNumKey}`, 0);
    },
    schools() {
      const type = get(this, "category.type", "");
      const schoolsKey = get(SCHOOL_TYPE[type], "schoolsKey", "");
      return get(this, `schoolSearch.data.${schoolsKey}`, []);
    }
  },

  methods: {
    showAll() {
      this.$emit("showAll", this.id);
    }
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/school/_school-list-box.scss";
</style>
