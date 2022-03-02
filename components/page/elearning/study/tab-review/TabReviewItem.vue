<template>
  <div class="tab-qa-comment-item" :class="classes">
    <app-avatar
      :size="level === 1 ? 40 : 30"
        :src="avatarCommenter"
    />

    <div class="tab-qa-comment-item__right">
      <div class="tab-qa-comment-item__top">
        <div class="tab-qa-comment-item__top-left">
          <h6 class="tab-qa-comment-item__name">
            {{ get(review, "creator.name", "") }}
          </h6>
          <app-stars
            class="tab-qa-comment-item__rate ml-2"
            :stars="get(review, 'vote', 0)"
          />
        </div>

        <span class="tab-qa-comment-item__time">
          <IconAccessTime class="icon mr-2" />{{
            get(review, "timestamp", "") | getDateTimeHH_MM_D_M_Y
          }}
        </span>
      </div>

      <div class="tab-qa-comment-item__content">
        <div v-html="get(review, 'comment', '')" class="word-break-all"></div>
        <img
          v-if="get(review, 'image_url', '')"
          class="tab-qa-comment-item__img d-block"
          :src="get(review, 'image_url', '')"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
import IconThumbUp from "~/assets/svg/v2-icons/thumb_up_24px.svg?inline";
import IconAccessTime from "~/assets/svg/v2-icons/access_time_24px.svg?inline";
import { get } from "lodash";
import QuestionLikeService from "~/services/elearning/study/QuestionLike";
import InteractiveAnswer from "~/services/elearning/study/InteractiveAnswer";

export default {
  components: {
    IconThumbUp,
    IconAccessTime,
  },

  data() {
    return {
      showReply: false,
      submit: true,
    };
  },

  props: {
    level: {
      type: Number,
      default: 1,
      validator: (value) => [1, 2].includes(value),
    },
    question: {},
    review: {},
  },

  computed: {
    avatarCommenter() {
      return get(this, 'review.creator.avatar.low', "")
    },
    classes() {
      return {
        "tab-qa-comment-item--level-2": this.level === 2,
      };
    },
  },

  methods: {
    handleLike() {
      if (this.level == 1) {
        this.likeQuestion();
      }
      if (this.level == 2) {
        this.likeAnswer();
      }
    },
    async likeQuestion() {
      if (!this.submit) return;
      this.submit = false;
      const payload = {
        question_id: get(this, "question.id", ""),
        like: !get(this, "question.liked", false),
      };

      const res = await new QuestionLikeService(this.$axios)["add"](payload);

      this.submit = true;

      if (get(res, "success", false)) {
        this.updateQuestions();
        return;
      }

      this.$toasted.error(get(res, "message", "Có lỗi xảy ra"));
    },
    async likeAnswer() {
      if (!this.submit) return;
      this.submit = false;

      const payload = {
        like: !get(this, "question.liked", false),
        answer_id: get(this, "question.id", ""),
      };

      const res = await new InteractiveAnswer(this.$axios)["likeAnswer"](payload);

      this.submit = true;

      if (get(res, "success", false)) {
        this.updateQuestions();
        return;
      }

      this.$toasted.error(get(res, "message", "Có lỗi xảy ra"));
    },
    updateQuestions() {
      const options = {
        params: {
          elearning_id: get(this, "$route.params.id", ""),
          page: 1,
          sort_by: "NEWEST",
        },
      };
      this.$store.dispatch(`elearning/study/detail/getListQuestion`, options);
    },
    get,
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/_tab-qa-comment-item.scss";
</style>
