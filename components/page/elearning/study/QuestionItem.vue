<template>
  <div class="elearning-course-comment__item">
    <app-avatar :src="get(question, 'creator.avatar.low', '')" :size="50" />
    <div class="content">
      <div>
        <strong class="pr-3">{{ get(question, "creator.name", "") }}</strong>
        <span>{{ get(question, "timestamp", "") }}</span>
      </div>
      <div class="text">{{ get(question, "content", "") }}</div>
      <div class="actions mt-3">
        <button>
          <IconLike
            :class="liked ? 'fill-primary' : 'fill-999'"
            @click="handleLikeAnswer"
          />
        </button>
        <span v-if="likes > 0">{{ likes }}</span>
        <button type="button" class="bold color-999 ml-4" @click="reply">
          Phản hồi
        </button>
      </div>
      <div class="reply ml-3" v-if="showReply">
        <button type="button" class="mt-3 mb-3" @click="showReply = false">
          Ẩn câu trả lời
        </button>
        <AddAnswer
          :question="question"
          @addAnswerSuccess="$emit('addAnswerSuccess')"
        />
        <AnswerItem
          :answer="answer"
          v-for="(answer, index) in get(question, 'interactive_answers', [])"
          :key="index"
        />
      </div>
    </div>
  </div>
</template>
<script>
import AnswerItem from "~/components/page/elearning/study/AnswerItem";
import AddAnswer from "~/components/page/elearning/study/AddAnswer";
import IconLike from "~/assets/svg/icons/like.svg?inline";
import IconCamera from "~/assets/svg/design-icons/camera.svg?inline";
import { get } from "lodash";
import QuestionLikeService from "~/services/elearning/study/QuestionLike";
import { useEffect } from "~/utils/common";

export default {
  components: {
    IconCamera,
    IconLike,
    AnswerItem,
    AddAnswer,
  },
  props: {
    question: {
      type: Object,
      default: () => {},
    },
  },

  watch: {
    question: {
      handler: function() {
        this.liked = get(this, "question.liked", false);
        this.likes = get(this, "question.likes", 0);
      },
      deep: true,
    },
  },

  data() {
    return {
      showReply: false,
      liked: get(this, "question.liked", false),
      likes: get(this, "question.likes", 0),
      submit: true,
    };
  },

  methods: {
    reply() {
      this.showReply = true;
    },
    get,
    async handleLikeAnswer() {
      if (!this.submit) return;
      this.submit = false;
      const payload = {
        question_id: this.question.id,
        like: !this.liked,
      };

      const res = await new QuestionLikeService(this.$axios)["add"](payload);

      this.submit = true;

      if (get(res, "success", false)) {
        this.liked = !this.liked;
        this.likes = this.liked ? this.likes + 1 : this.likes - 1;
        return;
      }

      this.$toasted.error(get(res, "message", "Có lỗi xảy ra"));
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/course/_elearning-course-side.scss";
</style>
