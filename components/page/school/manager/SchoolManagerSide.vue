<template>
  <div class="manager-side">
    <n-link class="link-gray item" :to="'/school/manager/'" :class="active == 1 ? 'active' : ''">
      <IconDashboard width="20" height="20" />Tổng quan
    </n-link>
    <n-link
      class="link-gray item"
      :to="'/school/manager/course/'"
      :class="active == 2 ? 'active' : ''"
    >
      <IconBook width="20" height="20" />Bài giảng và khóa học
    </n-link>
    <n-link
      class="link-gray item"
      :to="'/school/manager/group/'"
      :class="active == 3 ? 'active' : ''"
    >
      <IconCalendar />Quản lý tổ chuyên môn
    </n-link>
    <div class="item" :class="active == 4? 'active' : ''">
      <div class="d-flex w-100">
        <n-link class="link-gray d-flex-center lv-0" :to="'/school/manager/teacher'">
          <IconBooks />Quản lý giáo viên
        </n-link>
        <button @click="subMenu = !subMenu" class="ml-auto">
          <IconAngleDown v-if="subMenu" height="18" width="18" />
          <IconAngleUp v-else height="18" width="18" />
        </button>
      </div>
      <ul v-if="subMenu">
        <li>
          <n-link class="link-gray" :to="'/school/manager/teacher/'">Hồ sơ giáo viên</n-link>
        </li>
        <li>
          <n-link class="link-gray" :to="'/school/manager/teacher/assigned'">Phân công giảng dạy</n-link>
        </li>
      </ul>
    </div>
    <n-link
      class="link-gray item"
      :to="'/school/manager/classroom'"
      :class="active == 5 ? 'active' : ''"
    >
      <IconFolderCheck />Quản lý lớp học
    </n-link>
    <n-link
      class="link-gray item"
      :to="'/school/manager/student'"
      :class="active == 6 ? 'active' : ''"
    >
      <IconChatUser />Quản lý học sinh
    </n-link>
  </div>
</template>

<script>
import IconFolderCheck from "~/assets/svg/design-icons/folder-check.svg?inline";
import IconCalendar from "~/assets/svg/icons/calendar.svg?inline";
import IconDashboard from "~/assets/svg/design-icons/dashboard.svg?inline";
import IconDollarO from "~/assets/svg/icons/dollar-o.svg?inline";
import IconBooks from "~/assets/svg/icons/books.svg?inline";
import IconBook from "~/assets/svg/icons/book.svg?inline";
import IconChatUser from "~/assets/svg/icons/chat-user.svg?inline";
import IconAngleDown from "~/assets/svg/design-icons/angle-down.svg?inline";
import IconAngleUp from "~/assets/svg/design-icons/angle-up.svg?inline";

export default {
  components: {
    IconFolderCheck,
    IconCalendar,
    IconDashboard,
    IconDollarO,
    IconBooks,
    IconBook,
    IconChatUser,
    IconAngleDown,
    IconAngleUp
  },

  props: {
    active: {
      type: [String, Number]
    }
  },

  data() {
    return {
      subMenu: this.active == 4 ? true : false
    };
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/manager/_manager-side.scss";
</style>