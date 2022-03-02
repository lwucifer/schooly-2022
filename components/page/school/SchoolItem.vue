<template>
  <div class="school-item">
    <div class="school-item__thumnail">
      <n-link :to="'/school/' + school.id">
        <img
          v-lazy="get(school, 'cover.high', '')"
          :alt="get(school, 'name', '')"
        />
      </n-link>
    </div>
    <div class="school-item__info">
      <n-link
        v-if="school.name"
        class="school-item__info__title"
        :to="'/school/' + school.id"
        :title="school.name"
      >
        {{ school.name }}
      </n-link>
      <div class="school-item__info__statistic-item">
        <span> <IconLocation /> </span>
        <span class="value">{{ school.ward}}-{{ school.district}}-{{ school.province }}</span>
      </div>
      <div class="school-item__info__statistic-item">
        <span><IconUser /></span>
        <span class="value">{{ get(school, 'teacher_number', '') }} giáo viên </span>
      </div>
      <div class="school-item__info__statistic-item">
        <span><IconUserGroup /></span>
        <span class="value">{{ get(school, 'student_number', '') }} học sinh </span>
      </div>
    </div>
  </div>
</template>

<script>
import IconLocation from "~/assets/svg/icons/location.svg?inline";
import IconUser from "~/assets/svg/icons/user-circle.svg?inline";
import IconUserGroup from "~/assets/svg/icons/user-group1.svg?inline";
import { get } from "lodash";

export default {
  components: {
    IconLocation,
    IconUser,
    IconUserGroup,
  },

  props: {
    school: {
      type: Object,
      required: true,
      default: () => {},
    },
  },

  created() {
    // console.log(this.school);
  },

  methods: {
    get,
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/school/_school-item.scss";
</style>
