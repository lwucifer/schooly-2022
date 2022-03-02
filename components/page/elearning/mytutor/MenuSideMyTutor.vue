<template>
  <div>
    <sub-block-section
      v-sticky
      sticky-offset="{ top: 88 }"
      :sticy-z-index="9"
      title="Quản lý lớp học online"
      :content-cls="{ 'py-0': true, 'px-0': true}"
      class="manager-side-menu"
    >
      <template v-slot:content>
        <ul class="manager-side">
          <li>
            <n-link :to="'/elearning/mytutor/olclass'" :class="{ active: active == 1 }">
              <IconHome24px width="20" height="20" />Lớp học online
            </n-link>
          </li>
          <li>
            <n-link :to="'/elearning/mytutor/student'" :class="{ active: active == 2 }">
              <IconSupervisorAccount24px width="20" height="20" />Danh sách học sinh
            </n-link>
          </li>
          <li>
            <n-link :to="'/elearning/mytutor/teaching'" :class="{ active: active == 3 }">
              <IconCalendarToday24px width="20" height="20" />Lịch giảng dạy
            </n-link>
          </li>
          <li>
            <n-link :to="'/elearning/mytutor/exams'" :class="{ active: active == 4 }">
              <IconFileCopy24px width="20" height="20" />Bài tập
            </n-link>
          </li>
        </ul>
      </template>
    </sub-block-section>
  </div>
</template>

<script>
import IconHome24px from "~/assets/svg/v2-icons/home_24px.svg?inline";
import IconCalendarToday24px from "~/assets/svg/v2-icons/calendar_today_24px.svg?inline";
import IconFileCopy24px from "~/assets/svg/v2-icons/file_copy_24px.svg?inline";
import IconSupervisorAccount24px from "~/assets/svg/icons/supervisor_account_24px.svg?inline";
export default {
  components: {
    IconHome24px,
    IconCalendarToday24px,
    IconFileCopy24px,
    IconSupervisorAccount24px,
  },
  props: {
    active: {
      type: [String, Number],
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/manager/_manager-side.scss";
</style>