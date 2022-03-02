<template>
  <div class="container elearning-lesson">
    <div class="elearning-lesson__main">
      <div class="row">
        <div class="col-md-8">
          <div class="box11">
            <div class="elearning-lesson_image">
              <img src="https://picsum.photos/750/422" alt />
            </div>
            <div class="elearning-study-tabs">
              <n-link :to="'/elearning/course'">Tổng quan</n-link>
              <a class="active">Hỏi đáp</a>
              <n-link :to="'/elearning/course/notify'">Thông báo</n-link>
              <n-link :to="'/elearning/course/question'">Đánh giá</n-link>
            </div>
            <div class="elearning-lesson__main-content">
              <div class="d-flex-center">
                <strong>154 bình luận</strong>
                <div class="ml-auto d-flex">
                  <app-input class="mr-3 mb-0" size="sm">
                    <button slot="unit">
                      <IconSearch class="fill-999" height="16" width="16" />
                    </button>
                  </app-input>
                  <app-select v-model="opt" :options="opts" size="sm" />
                </div>
              </div>
              <hr class="mt-4 mb-4" />
              <ElearningCourseComment :data="comments" :auth="auth" />
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
import ElearningCourseComment from "~/components/page/elearning/study/Question";
import ElearningCourseSide from "~/components/page/elearning/study/ElearningCourseSide";
import IconSearch from "~/assets/svg/design-icons/search.svg?inline";
import IconLike from "~/assets/svg/icons/like.svg?inline";
import IconCamera from "~/assets/svg/design-icons/camera.svg?inline";
// Import faked data
import { AUTH, COMMENTS, LESSON, COURSE_LESSON } from "~/server/fakedata/elearning/test";
import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";

export default {
  name: "ElearningQuestion",
  layout: "exams",

  components: {
    ElearningCourseComment,
    ElearningCourseSide,
    IconSearch,
    IconCamera
  },

  data() {
    return {
      auth: AUTH,
      comments: COMMENTS,
      lesson: LESSON,
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