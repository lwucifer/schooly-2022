<template>
  <div>
    <div class="d-flex">
      <app-avatar :src="get(user_login, 'avatar.low', '')" :size="50" />
      <app-input
        textarea
        v-model="comment"
        placeholder="Bình luận"
        class="ml-3 w-100"
        @keyup.enter.native="handleChangeComment"
      />
    </div>
    <QuestionItem
      :question="question"
      v-for="(question, index) in questions"
      :key="index"
      @addAnswerSuccess="$emit('addAnswerSuccess')"
    />
  </div>
</template>
<script>
import QuestionItem from "~/components/page/elearning/study/QuestionItem";
import IconLike from "~/assets/svg/icons/like.svg?inline";
import IconCamera from "~/assets/svg/design-icons/camera.svg?inline";
import InteractiveQuestionService from "~/services/elearning/study/InteractiveQuestion";
import { get } from "lodash";
import { mapState } from "vuex";

export default {
  components: {
    IconCamera,
    IconLike,
    QuestionItem,
  },
  props: {
    questions: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    ...mapState("auth", { user_login: "token" }),
  },

  created() {
    // console.log(this.user_login);
  },

  data() {
    return {
      comment: "",
      reply: false,
      submit: true,
    };
  },

  methods: {
    async handleChangeComment() {
      if (!this.submit) return;
      this.submit = false;
      const params = {
        content: this.comment,
        elearning_id: get(this, "$router.history.current.params.id", ""),
      };
      const res = await new InteractiveQuestionService(this.$axios)[
        "addQuestion"
      ](params);
      if (get(res, "success", false)) {
        this.$emit("addQuestionSuccess");
        this.$toasted.success("Thành công");
        this.comment = "";
        this.submit = true;
        return;
      }
      this.submit = true;
      this.$toasted.error(get(res, "message", "Có lỗi xảy ra"));
    },
    get,
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/course/_elearning-course-side.scss";
</style>
