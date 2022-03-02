<template>
  <div class="tab-qa-comment-item" :class="classes">
    <app-avatar
      :size="level === 1 ? 40 : 30"
      :src="get(question, 'creator.avatar.low', '')"
    />

    <div class="tab-qa-comment-item__right">
      <div class="tab-qa-comment-item__top">
        <div class="tab-qa-comment-item__top-left">
          <h6 class="tab-qa-comment-item__name">
            {{ get(notification, "title", "") }}
          </h6>
          <!-- <app-stars
            v-if="showStars"
            class="tab-qa-comment-item__rate ml-2"
            :stars="stars"
          /> -->
        </div>

        <span class="tab-qa-comment-item__time">
          <IconAccessTime class="icon mr-2" />{{
            get(notification, "timestamp", "") | getDateTimeHH_MM_D_M_Y
          }}
        </span>
      </div>

      <!-- <div class="tab-qa-comment-item__title" v-if="showTitle">{{ title }}</div> -->

      <div class="tab-qa-comment-item__content">
        <div v-html="get(notification, 'description', '')" class="word-break-all"></div>
        <!-- <img
          v-if="get(question, 'image_url', '')"
          class="tab-qa-comment-item__img d-block"
          :src="get(question, 'image_url', '')"
          alt=""
        /> -->
      </div>
      <!-- <div class="tab-qa-comment-item__actions">
        <button
          class="tab-qa-comment-item__like"
          :class="{ active: get(question, 'liked', false) }"
          @click="handleLike"
        >
          <IconThumbUp class="icon" />&nbsp;{{
            numeral(get(question, "likes", 0)).format()
          }}
        </button>
        <button
          v-if="level == 1"
          class="tab-qa-comment-item__reply"
          @click="showReply = !showReply"
        >
          Phản hồi
        </button>
      </div>

      <slot v-bind="{ showReply }" /> -->
    </div>
  </div>
</template>

<script>
import IconThumbUp from "~/assets/svg/v2-icons/thumb_up_24px.svg?inline";
import IconAccessTime from "~/assets/svg/v2-icons/access_time_24px.svg?inline";
import { get } from "lodash";

export default {
  components: {
    IconThumbUp,
    IconAccessTime,
  },

  props: {
    notification: {},
  },

  computed: {
    classes() {
      return {
        "tab-qa-comment-item--level-2": this.level === 2,
      };
    },
  },

  methods: {
    get,
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/_tab-qa-comment-item.scss";
</style>
