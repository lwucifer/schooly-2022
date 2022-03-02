<template>
  <sub-block-section
    title="Góc học tập"
  >
    <template v-slot:content>
      <div class="manager-side">
        <n-link class="link-gray item pt-2" :to="'/elearning/mycourses/'" :class="active == 1 ? 'active' : ''">
          <IconDashboard width="20" height="20" />Tổng quan
        </n-link>
        <n-link
          class="link-gray item"
          :to="'/elearning/mycourses/courses/'"
          :class="active == 2 ? 'active' : ''"
        >
          <IconBooks width="20" height="20" />Bài giảng và khóa học
        </n-link>
        <n-link
          class="link-gray item"
          :to="'/elearning/mycourses/exams'"
          :class="active == 3 ? 'active' : ''"
        >
          <IconLibraryBooks width="20" height="20" />Bài tập
        </n-link>
        <n-link
          class="link-gray item"
          :to="'/elearning/mycourses/exams'"
          :class="active == 4 ? 'active' : ''"
        >
          <IconBallot24px />Bài kiểm tra
        </n-link>
        <n-link
          class="link-gray item"
          :to="'/elearning/mycourses'"
          :class="active == 5 ? 'active' : ''"
        >
          <IconInsertInvitation24px />Thời khóa biểu
        </n-link>
      </div>
    </template>
  </sub-block-section>
</template>

<script>
import IconDashboard from "~/assets/svg/v2-icons/dashboard_24px.svg?inline";
import IconBooks from "~/assets/svg/v2-icons/collections_bookmark_24px.svg?inline";
import IconLibraryBooks from "~/assets/svg/v2-icons/library_books_24px.svg?inline";
import IconBallot24px from '~/assets/svg/v2-icons/ballot_24px.svg?inline';
import IconInsertInvitation24px from '~/assets/svg/v2-icons/insert_invitation_24px.svg?inline';
export default {
  name: "E-learning",

  components: {
    IconDashboard,
    IconBooks,
    IconLibraryBooks,
    IconBallot24px,
    IconInsertInvitation24px

  },

  props: {
    active: {
      type: [String, Number]
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/manager/_manager-side.scss";
</style>