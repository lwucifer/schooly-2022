<template>
  <div>
    <div class="info">
      <div class="info-item">
        Chapter:
        <strong class="color-primary">{{ get(program, "chapter", "") }}</strong>
      </div>
      <!-- <div class="info-item">
        Thể loại:
        <strong class="color-primary">{{
          get(program, "subject", "")
        }}</strong>
      </div>
      <div class="info-item">
        Trình độ:
        <strong class="color-primary">{{
          get(program, "level", "")
        }}</strong>
      </div>
      <div class="info-item">
        Môn học:
        <strong class="color-primary">{{
          get(program, "subject", "")
        }}</strong>
      </div>
      <div class="info-item">
        Số bài giảng:
        <strong class="color-primary">{{
          (get(program, "lessons"), "")
        }}</strong>
      </div>
      <div class="info-item">
        Thời lượng:
        <strong class="color-primary">{{
          get(program, "duration", "")
        }}</strong>
      </div> -->
    </div>

    <div
      class="content-item"
      v-for="lesson in get(program, 'lessons', [])"
      :key="get(lesson, 'id', '')"
    >
      <cource-lesson :lesson="lesson" />
    </div>

    <!-- <div class="content-item">
      <IconPlayO class="mr-3" />Bài 1: Tạo và tối ưu tài khoản Instagram trên
      máy tính
      <span class="ml-auto">23:50</span>
    </div>
    <div class="content-item">
      <IconBooks class="fill-primary mr-3" />Tài liệu đính kèm
      <strong class="ml-auto color-primary d-flex-center">
        Tải về
        <IconDownload class="ml-2" />
      </strong>
    </div> -->
  </div>
</template>

<script>
import { get } from "lodash";
import * as actionTypes from "~/utils/action-types";
import { mapState } from "vuex";
import IconPlayO from "~/assets/svg/icons/play-o.svg?inline";
import IconDownload from "~/assets/svg/icons/download.svg?inline";
import IconBooks from "~/assets/svg/icons/books.svg?inline";
import CourceLesson from "~/components/page/course/CourceLesson";

export default {
  components: {
    IconPlayO,
    IconDownload,
    IconBooks,
    CourceLesson
  },
  props: {
    program: {
      type: Object,
      default: null
    }
  },
  created() {
    console.log(this.program);
  },
  methods: {
    get
  }
};
</script>
