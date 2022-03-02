<template>
  <div class="list-exam-item" :class="{ 'd-flex': isLandspace }">
    <div class="list-exam-item__img">
      <n-link :to="`/elearning/exam/detail?id=${data.id}`"
        ><img :src="data.avatar" width="266" height="159" alt=""
      /></n-link>

      <span class="absolute-price" :class="{ free: !data.price }">{{
        !data.price ? "Miễn phí" : data.price + "đ"
      }}</span>
    </div>

    <div class="list-exam-item__content">
      <div class="content-top">
        <div class="top-name">
          <n-link :to="`/elearning/exam/detail?id=${data.id}`">{{
            data.name
          }}</n-link>
        </div>

        <div class="top-rating">
          <app-stars :stars="data.rate" :size="13" />

          <span
            ><strong>{{ data.rate }}</strong> ({{ data.votes }})</span
          >
        </div>

        <div class="top-school">
          <app-avatar :size="32" :src="get(data, 'teacher.avatar.low', '')" />
          <a href="">{{ get(data, "teacher.name", "") }}</a>
        </div>

        <div class="top-info">
          <div class="date">
            {{ data.created }}
            <IconPublic class="ml-2 icon" v-if="data.public" />
            <IconSupervisedUserCircle
              class="ml-2 icon vertical-middle"
              v-else
            />
          </div>

          <div class="favourite">
            <span class="mr-3"
              ><IconFavoriteBorder class="icon mr-2 vertical-middle" />{{
                data.likes
              }}</span
            >
            <span
              ><IconChatGreen class="icon mr-2 vertical-middle" />{{
                data.comments
              }}</span
            >
          </div>
        </div>
      </div>

      <div class="content-bottom">
        <div class="bottom-subject">
          <IconClass class="icon mr-2" /><span
            v-html="data.description.substring(0, 10)"
          ></span>
        </div>

        <div class="bottom-number-exam">
          <IconGroup class="icon mr-2" />{{ data.participants }} Lượt thi
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconPublic from "~/assets/svg/v2-icons/publicon/social/24px.svg?inline";
import IconSupervisedUserCircle from "~/assets/svg/v2-icons/supervised_user_circle.svg?inline";
import IconFavoriteBorder from "~/assets/svg/v2-icons/favorite_border_24px.svg?inline";
import IconChatGreen from "~/assets/svg/icons/chat-green.svg?inline";
import IconClass from "~/assets/svg/v2-icons/class_green.svg?inline";
import IconGroup from "~/assets/svg/v2-icons/group_green.svg?inline";
import { get } from "lodash";

export default {
  components: {
    IconPublic,
    IconSupervisedUserCircle,
    IconFavoriteBorder,
    IconChatGreen,
    IconClass,
    IconGroup,
  },

  data() {
    return {
      price: "500.000",
    };
  },

  props: {
    data: {},
    isLandspace: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    get,
  },
};
</script>

<style lang="scss">
@import "~assets/scss/components/elearning/exams/_list-exam-item.scss";
</style>
