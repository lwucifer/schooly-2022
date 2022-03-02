<template>
  <div class="detail-exam-intro">
    <h3 class="detail-exam-intro__title">
      {{ get(data, "name", "") }}
    </h3>

    <div class="detail-exam-intro__info">
      <div class="info-school">
        <app-avatar :size="32" />
        <a href="" class="ml-2">Trường THCS Võ Chí Công</a>
      </div>

      <div class="info-social">
        <div class="rate mr-4">
          <IconGroup class="icon mr-2 vertical-middle" />{{
            get(data, "participants", 0)
          }}
          <app-stars :stars="get(data, 'rate', 0)" :size="13" />

          <span
            ><strong>{{ get(data, "rate", 0) }}</strong> ({{
              get(data, "votes", 0)
            }})</span
          >
        </div>

        <span class="mr-4">
          <IconGroup class="icon mr-2 vertical-middle" />{{
            get(data, "participants", 0)
          }}
          Lượt thi
        </span>

        <span class="mr-4">
          <IconFavoriteBorder class="icon mr-2 vertical-middle" />{{
            get(data, "likes", 0)
          }}
        </span>

        <span>
          <IconChatGreen class="icon mr-2 vertical-middle" />{{
            get(data, "comments", 0)
          }}
        </span>
      </div>
    </div>

    <div class="detail-exam-intro__text">
      <h4 class="mb-4">Mô tả kỳ thi</h4>
      <p v-html="get(data, 'description', '')"></p>
    </div>
  </div>
</template>

<script>
import IconGroup from "~/assets/svg/v2-icons/group_green.svg?inline";
import IconFavoriteBorder from "~/assets/svg/v2-icons/favorite_border_24px.svg?inline";
import IconChatGreen from "~/assets/svg/icons/chat-green.svg?inline";
import { get } from "lodash";
import { mapState } from "vuex";

export default {
  components: {
    IconGroup,
    IconFavoriteBorder,
    IconChatGreen,
  },

  props: {
    data: {
      type: Object,
    },
  },

  methods: {
    get,
  },
};
</script>

<style lang="scss">
@import "~assets/scss/components/elearning/exams/detail/_detail-exam-intro.scss";
</style>
