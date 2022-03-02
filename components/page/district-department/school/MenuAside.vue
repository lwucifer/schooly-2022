<template>
  <div class="manager-side">
    <div
      class="link-gray item"
      :class="actived == 'overview' ? 'active' : ''"
      @click="selectMenu({ name: 'overview'})"
    >
      <IconDashboard width="20" height="20"/>
      <span>
        Tổng quan
      </span>
    </div>
    <div
      class="link-gray item"
      :class="actived == 'course' ? 'active' : ''"
      @click="selectMenu({ name: 'course'})"
    >
      <IconBook width="20" height="20"/>
      <span>
        Bài giảng và khóa học
      </span>
    </div>

    <div
      class="link-gray item"
      :class="actived == 'field' ? 'active' : ''"
      @click="selectMenu({ name: 'field'})"
    >
      <IconCalendar/>
      <span>
        Quản lý tổ chuyên môn
      </span>
    </div>

    <div
      class="item"
      :class="['teacher-resume', 'teacher-task'].includes(actived) ?' active' : ''"
    >
      <div class="d-flex w-100">
        <IconBooks/>
        <span>
          Quản lý giáo viên
        </span>
        <button @click="subMenu = !subMenu" class="ml-auto">
          <IconAngleDown v-if="subMenu" height="18" width="18"/>
          <IconAngleUp v-else height="18" width="18"/>
        </button>
      </div>
      <ul v-if="subMenu">
        <li
          class="link-gray sub-item"
          :class="actived == 'teacher-resume' ? 'active' : ''"
          @click="selectMenu({ name: 'teacher-resume'})"
        >
          <span>
            Hồ sơ giáo viên
          </span>
        </li>
        <li
          class="link-gray sub-item"
          :class="actived == 'teacher-task' ? 'active' : ''"
          @click="selectMenu({ name: 'teacher-task'})"
        >
          <span>
            Phân công giảng dạy
          </span>
        </li>
      </ul>
    </div>

    <div
      class="link-gray item"
      :class="actived == 'classroom' ? 'active' : ''"
      @click="selectMenu({ name: 'classroom'})"
    >
      <IconFolderCheck/>
      <span>
        Quản lý lớp học
      </span>
    </div>
    <div
      class="link-gray item"
      :class="actived == 'student' ? 'active' : ''"
      @click="selectMenu({ name: 'student'})"
    >
      <IconChatUser/>
      <span>
        Quản lý học sinh
      </span>
    </div>
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
      actived: {
        type: String,
        default: 'overview',
        validator: value => ['overview', 'course', 'field', 'teacher-resume', 'teacher-task', 'classroom', 'student'].includes(value)
      }
    },

    data() {
      return {
        subMenu: false
      }
    },
    methods: {
      selectMenu({name}) {
        this.$emit('selectMenu', name)
      }
    }
  };
</script>

<style lang="scss">
  @import "~/assets/scss/components/district-department/school/_menu-aside.scss";
</style>