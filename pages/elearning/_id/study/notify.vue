<template>
  <div class="container elearning-lesson">
    <div class="elearning-lesson__main">
      <div class="row">
        <div class="col-md-8">
          <div class="box11">
            <ElearningEssayQuestion />
            <div class="elearning-study-tabs">
              <n-link :to="'/elearning/course'">Tổng quan</n-link>
              <n-link :to="'/elearning/course/question'">Hỏi đáp</n-link>
              <a class="active">Thông báo</a>
              <n-link :to="'/elearning/course/question'">Đánh giá</n-link>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <ElearningCourseSide :data="data" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ElearningCourseSide from "~/components/page/elearning/study/ElearningCourseSide";
import ElearningChoiceQuestion from "~/components/page/elearning/course/ElearningChoiceQuestion";
import ElearningEssayQuestion from "~/components/page/elearning/course/ElearningEssayQuestion";
import IconSearch from "~/assets/svg/design-icons/search.svg?inline";
import IconLike from "~/assets/svg/icons/like.svg?inline";
import IconCamera from "~/assets/svg/design-icons/camera.svg?inline";
// Import faked data
import { COURSE_LESSON } from "~/server/fakedata/elearning/test";
import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";

export default {
  name: "ElearningEssay",
  layout: "exams",

  components: {
    ElearningChoiceQuestion,
    ElearningEssayQuestion,
    ElearningCourseSide,
    IconSearch,
    IconCamera
  },

  data() {
    return {
      data: {
        number: 9,
        times: "9 giờ 30 phút",
        classes: [
          {
            id: 1,
            name: "Bài giảng online cho khoá học",
            done: false
          },
          {
            id: 2,
            name: "Bài giảng online cho khoá học",
            done: true
          }
        ],
        list: COURSE_LESSON
      }
    };
  },
  computed: {
    ...mapState("auth", ["loggedUser"])
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/pages/elearning/_study.scss";
</style>