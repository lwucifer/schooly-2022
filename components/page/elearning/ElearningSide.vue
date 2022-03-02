<template>
  <div class="elearning-side">
    <div class="elearning-side__avatar">
      <app-avatar :src="teacher.avatar" :size="125" />
      <a href>
        <IconPhoto width="14" height="14" />
      </a>
    </div>
    <p class="elearning-side__name">{{teacher.name}}</p>
    <div class="elearning-side__links">
      <n-link class="link-gray" to :class="active == 1 ? 'active' : ''">
        <IconUser3 width="20" height="20"/>Thông tin tài khoản
      </n-link>
      <n-link class="link-gray" to :class="active == 5 ? 'active' : ''">
        <IconDollarAlt width="20" height="20" />Thống kê doanh thu
      </n-link>
      <n-link class="link-gray" to :class="active == 2 ? 'active' : ''">
        <IconBell />Thông báo
      </n-link>
      <n-link class="link-gray" to :class="active == 3 ? 'active' : ''">
        <IconHistory />Lịch sử giao dịch
      </n-link>
      <n-link class="link-gray" to :class="active == 4 ? 'active' : ''">
        <IconExclamation />Trợ giúp
      </n-link>
    </div>
  </div>
</template>

<script>
import IconExclamation from "~/assets/svg/icons/exclamation.svg?inline";
import IconUser3 from "~/assets/svg/icons/user3.svg?inline";
import IconHistory from "~/assets/svg/icons/history.svg?inline";
import IconBell from "~/assets/svg/icons/bell.svg?inline";
import IconPhoto from "~/assets/svg/icons/photo.svg?inline";
import IconFilter from "~/assets/svg/icons/filter.svg?inline";
import IconSearch from "~/assets/svg/icons/search2.svg?inline";
import IconDollarAlt from '~/assets/svg/design-icons/dollar-alt.svg?inline';

export default {
  name: "E-learning",

  components: {
    IconHistory,
    IconBell,
    IconUser3,
    IconExclamation,
    IconPhoto,
    IconSearch,
    IconFilter,
    IconDollarAlt
  },

  props: {
    teacher: {
      type: Object,
      required: true,
      default: () => {}
    },
    active: {
      type: [String, Number]
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/_elearning-side.scss";
</style>