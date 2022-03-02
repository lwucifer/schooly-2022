<template>
  <sub-block-section
    v-sticky
    sticky-offset="{ top: 88, bottom: 30 }"
    :sticy-z-index="9"
    class="my-course-side"
    title="Góc học tập"
  >
    <template slot="content">
      <ul class="my-course-side-menu-list">
        <li class="my-course-side-menu-item">
          <n-link to="/elearning/mycourses/" :class="active == 1 ? 'active' : ''">
            <IconDashboard class="icon fill-opacity-1" />Tổng quan
          </n-link>
        </li>

        <li class="my-course-side-menu-item">
          <n-link to="/elearning/mycourses/courses" :class="active == 2 ? 'active' : ''">
            <IconBooks class="icon fill-opacity-1" />Bài giảng và khóa học
          </n-link>
        </li>

        <li class="my-course-side-menu-item">
          <n-link to="/elearning/mycourses/exercises" :class="active == 3 ? 'active' : ''">
            <IconLibraryBooks class="icon fill-opacity-1" />Bài tập
          </n-link>
        </li>

        <li class="my-course-side-menu-item">
          <n-link to="/elearning/mycourses/exams" :class="active == 4 ? 'active' : ''">
            <IconBallot24px class="icon fill-opacity-1" />Bài kiểm tra
          </n-link>
        </li>

        <li class="my-course-side-menu-item">
          <n-link to="/elearning/mycourses/documents" :class="active == 7 ? 'active' : ''">
            <IconCreateNewFolder24px class="icon fill-opacity-1" />Tài liệu học tập
          </n-link>
        </li>
        <li class="my-course-side-menu-item">
          <n-link to="/elearning/mycourses/olclass" :class="active == 8 ? 'active' : ''">
            <IconLaptopMac24px class="icon fill-opacity-1" />Lớp học online
          </n-link>
        </li>

        <li class="my-course-side-menu-item">
          <n-link to="/elearning/mycourses/contest" :class="active == 5 ? 'active' : ''">
            <IconVerticalSplit class="icon fill-opacity-1" />Kỳ thi
          </n-link>
        </li>

        <li class="my-course-side-menu-item">
          <n-link to="/elearning/mycourses/timetable" :class="active == 6 ? 'active' : ''">
            <IconToday24px class="icon fill-opacity-1" />Thời khóa biểu
          </n-link>
        </li>
      </ul>

      <slot name="calendar"></slot>
    </template>
  </sub-block-section>
</template>

<script>
import IconFolderCheck from "~/assets/svg/design-icons/folder-check.svg?inline";
import IconCalendar from "~/assets/svg/icons/calendar.svg?inline";
import IconDashboard from "~/assets/svg/v2-icons/dashboard_24px.svg?inline";
import IconDollarO from "~/assets/svg/icons/dollar-o.svg?inline";
import IconBooks from "~/assets/svg/v2-icons/collections_bookmark_24px.svg?inline";
import IconLibraryBooks from "~/assets/svg/v2-icons/library_books_24px.svg?inline";
import IconBallot24px from "~/assets/svg/v2-icons/ballot_24px.svg?inline";
import IconToday24px from "~/assets/svg/v2-icons/today_24px.svg?inline";
import IconVerticalSplit from '~/assets/svg/v2-icons/vertical_split_24px.svg?inline';
import IconBook from "~/assets/svg/icons/book.svg?inline";
import IconChatUser from "~/assets/svg/icons/chat-user.svg?inline";
import IconLaptopMac24px from '~/assets/svg/v2-icons/laptop_mac_24px.svg?inline';
import IconCreateNewFolder24px from '~/assets/svg/v2-icons/create_new_folder_24px.svg?inline';

export default {
  name: "E-learning",

  components: {
    IconFolderCheck,
    IconCalendar,
    IconDashboard,
    IconDollarO,
    IconBooks,
    IconBook,
    IconLibraryBooks,
    IconChatUser,
    IconToday24px,
    IconBallot24px,
    IconVerticalSplit,
    IconCreateNewFolder24px,
    IconLaptopMac24px
  },

  props: {
    active: {
      type: [String, Number]
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/mycourses/_my-course-side.scss";
</style>