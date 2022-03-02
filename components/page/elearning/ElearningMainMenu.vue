<template>
  <div class="elearning-view__main-nav">
    <a
      class="scroll-link"
      href="#introduce"
      @click.prevent="scrollTo('#introduce')"
      >Giới thiệu</a
    >
    <a
      class="scroll-link"
      href="#course-content"
      @click.prevent="scrollTo('#course-content')"
      >Nội dung {{ title }}</a
    >
    <a class="scroll-link" href="#teacher" @click.prevent="scrollTo('#teacher')"
      >Giáo viên</a
    >
    <a class="scroll-link" href="#review" @click.prevent="scrollTo('#review')"
      >Đánh giá</a
    >
  </div>
</template>

<script>
import { get } from "lodash";

export default {
  computed: {
    title() {
      switch (get(this, "info.type", "")) {
        case "LECTURE":
          return "bài giảng";
          break;
        case "COURSE":
          return "khoá học";
          break;
        default:
          break;
      }
    },
  },
  methods: {
    scrollTo(id) {
      const target = document.querySelector(id);
      const navLink = document.querySelector(".elearning-view__main-nav");
      const targetTop = target.getBoundingClientRect().top;
      const scrollPosition = targetTop + window.scrollY;
      const hash = this.$route.hash;
      window.scrollTo({
        top: scrollPosition - navLink.clientHeight,
        left: 0,
        behavior: "smooth",
      });
    },
  },
};
</script>
