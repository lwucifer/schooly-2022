<template>
  <section class="elearning-id-box scroll-target" id="teacher">
    <h4 class="mb-4">Thông tin giáo viên</h4>
    <div class="course-teacher-info">
      <div class="teacher-top">
        <app-avatar
          :src="get(teacher, 'avatar.medium', 'https://picsum.photos/125/125')"
          :size="100"
        />
        <div class="info">
          <h5 class="name">
            <n-link
              :to="`/public/profile/teacher?user_id=${get(teacher, 'id', '')}`"
              class="teacher-title"
            >
              {{ get(teacher, "name", "") }}
            </n-link>
          </h5>
          <p class="body-3">
            <n-link
              :to="`/school/${get(teacher, 'school_id', '')}`"
              class="school-title"
            >
              {{ get(teacher, "school_name", "") }}
            </n-link>
          </p>

          <div class="stars">
            <app-stars
              :stars="Math.ceil(get(teacher, 'rate', 0))"
              :size="14"
              class="mr-2"
            />
            <span class="font-weight-bold mb-3">{{
              numeral(get(teacher, "rate", 0)).format("0,0.0")
            }}</span>
          </div>
        </div>

        <div class="right">
          <div>
            <strong class="color-primary">{{
              numeral(get(teacher, "lecture_total", 0)).format()
            }}</strong>
            Bài giảng
          </div>
          <div>
            <strong class="color-primary">{{
              numeral(get(teacher, "course_total", 0)).format()
            }}</strong>
            Khóa học
          </div>
        </div>
      </div>

      <div class="mt-4 teacher-bottom">
        <h4 class="mb-3">Tiểu sử</h4>
        <div v-if="get(teacher, 'biography', '')">
          <div v-html="description"></div>
          <div class="text-center mt-3">
            <a
              @click="handleLoadMore"
              v-if="load_more"
              class="text-decoration-none"
              to=""
              >Xem thêm</a
            >
          </div>
          <div class="text-center mt-3" v-if="hide_description">
            <a @click="handleCompact" class="text-decoration-none">Rút gọn</a>
          </div>
        </div>
        <div v-else class="text-center caption text-gray-2">
          Chưa có nội dung.
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import IconStar from "~/assets/svg/icons/star.svg?inline";
import IconStarO from "~/assets/svg/icons/star-o.svg?inline";
import * as actionTypes from "~/utils/action-types";
import { mapState } from "vuex";
import { get } from "lodash";
import { useEffect } from "~/utils/common";
import numeral from "numeral";

export default {
  components: {
    IconStar,
    IconStarO,
  },

  data() {
    return {
      length_description: 300,
    };
  },

  computed: {
    ...mapState("elearning/detail", {
      teacher: "teacher",
    }),
    load_more() {
      return get(this, "teacher.biography.length", 0) > this.length_description;
    },
    description() {
      return get(this, "teacher.biography", "").substring(
        0,
        this.length_description
      );
    },
    hide_description() {
      return (
        this.lengthDescription == get(this, "info.description.length", 0) &&
        get(this, "teacher.biography.length", 0) > 300
      );
    },
  },

  methods: {
    handleLoadMore() {
      this.length_description = get(this, "teacher.biography.length", 0);
    },
    handleCompact() {
      this.lengthDescription = 300;
    },
    get,
    numeral,
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/course/_course-teacher-info.scss";
</style>
