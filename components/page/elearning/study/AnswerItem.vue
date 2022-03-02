<template>
  <div class="elearning-course-comment__item">
    <app-avatar :src="get(answer, 'creator.avatar.low', '')" :size="50" />
    <div class="content">
      <div>
        <strong class="pr-3">{{ answer.name }}</strong>
        <span>{{ answer.time }}</span>
      </div>
      <div class="text">{{ answer.content }}</div>
      <div class="actions mt-3 mb-3">
        <button>
          <IconLike
            :class="liked ? 'fill-primary' : 'fill-999'"
            @click="handleLikeAnswer"
          />
        </button>
        <span v-if="likes > 0">{{ likes }}</span>
        <!-- <button class="bold color-999 ml-4" @click="reply(data.id, data.name)">
          Phản hồi
        </button> -->
      </div>
      <!-- <CommentInput :tag="data" v-if="showReply" @close="showReply = false" /> -->
    </div>
  </div>
</template>
<script>
import IconLike from "~/assets/svg/icons/like.svg?inline";
import IconCamera from "~/assets/svg/design-icons/camera.svg?inline";
import { get } from "lodash";
import { mapState } from "vuex";
import InteractiveAnswer from "~/services/elearning/study/InteractiveAnswer";

export default {
  components: {
    IconCamera,
    IconLike,
  },
  props: {
    answer: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      liked: get(this, "answer.liked", false),
      likes: get(this, "answer.likes", 0),
      submit: true,
    };
  },

  watch: {
    answer: {
      handler: function() {
        this.liked = get(this, "answer.liked", false);
        this.likes = get(this, "answer.likes", 0);
      },
      deep: true,
    },
  },

  computed: {
    ...mapState("auth", { user_login: "token" }),
  },

  // updated() {
  //   console.log(this.answer);
  // },

  // created() {
  //   console.log(this.answer);
  // },

  methods: {
    get,
    async handleLikeAnswer() {
      if (!this.submit) return;
      this.submit = false;

      const payload = {
        like: !this.liked,
        answer_id: get(this, "answer.id", ""),
      };

      const res = await new InteractiveAnswer(this.$axios)["likeAnswer"](payload);

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
