<template>
  <div class="eh-teacher-card">
    <div class="eh-teacher-card__img">
      <img v-if="!!image" :src="image" :alt="name" />
      <DefaultAvatar v-else width="100%" height="100%" />
    </div>

    <h3 class="eh-teacher-card__name heading-4">{{ name }}</h3>
    <div class="eh-teacher-card__school">{{ schoolName }}</div>
    <div class="eh-teacher-card__info">
      <div class="eh-teacher-card__count">
        <div class="eh-teacher-card__quantity">{{ numOfLecture }}</div>
        <div>Bài giảng</div>
      </div>
      <div class="eh-teacher-card__count">
        <div class="eh-teacher-card__quantity">{{ numOfCourse }}</div>
        <div>Khoá học</div>
      </div>
      <div class="eh-teacher-card__rating">
        <div class="text-dark mb-1">
          <b>{{ averageRate | numeralFormat("0.0") }}</b>
        </div>
        <app-stars :size="13" :stars="averageRate" />
      </div>
    </div>

    <app-divider class="my-3" color="disabled" />

    <div v-if="!!description" v-html="description" class="eh-teacher-card__desc"></div>
    <div v-else class="eh-teacher-card__desc">
      <div class="text-gray-2 caption text-center">Chưa có nội dung giới thiệu.</div>
    </div>

    <app-button class="eh-teacher-card__btn" nuxt :to="to">Xem thêm</app-button>
  </div>
</template>

<script>
import DefaultAvatar from "~/assets/svg/images/default-avatar.svg?inline";

export default {
  components: {
    DefaultAvatar
  },

  props: {
    to: {
      type: String,
      default: ""
    },
    image: String,
    name: String,
    schoolName: String,
    numOfLecture: Number,
    numOfCourse: Number,
    averageRate: Number,
    totalReview: Number,
    description: String
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/home/_elearning-home-teacher-card.scss";
</style>