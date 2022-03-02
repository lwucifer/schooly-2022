<template>
  <div class="e-study-tab-qa-editor d-flex">
    <app-avatar
      :size="40"
      class="mr-4"
      :src="avatarCommenter"
    />

    <div class="flex-grow e-study-tab-qa-editor__right">
      <template>
        <h6 class="font-weight-medium mb-3">Mức độ hài lòng</h6>
        <app-select-stars
          class="mb-4"
          @handleInput="handleSelectStar"
          :value="payload.vote"
        />
      </template>

      <app-input
        class="mb-3"
        textarea
        rows="4"
        placeholder="Viết đánh giá"
        v-model="payload.comment"
        v-if="isAllowComment"
      />

      <div class="d-flex justify-content-between mt-4">
        <app-button @click="handleAddVote" class="ml-auto" size="sm"
          >Gửi đánh giá</app-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getBase64 } from "~/utils/common";
import { get } from "lodash";
import IconCameraAlt from "~/assets/svg/v2-icons/camera_alt_24px.svg?inline";
const IconClose = () => import("~/assets/svg/icons/close.svg?inline");
import { mapState } from "vuex";
import InteractiveQuestionService from "~/services/elearning/study/InteractiveQuestion";
import VoteStudyService from "~/services/elearning/study/Vote.js";

export default {
  components: {
    IconCameraAlt,
    IconClose,
  },

  computed: {
    ...mapState("auth", { user_login: "token" }),
    ...mapState("elearning/study/study-info", ["info"]),

    isAllowComment() {
      return get(this, "info.allow_comment", false);
    },

    avatarCommenter() {
      return get(this, "$store.state.auth.token.avatar.low", "");
    }
  },

  data() {
    return {
      payload: {
        elearning_id: get(this, "$route.params.id", ""),
        comment: "",
        vote: 0,
      },
    };
  },

  methods: {
    handleSelectStar(vote) {
      this.payload.vote = vote;
    },

    reset() {
      this.payload.comment = "";
      this.payload.vote = "";
    },

    async handleAddVote() {
      if (!this.payload.comment) delete this.payload.comment;

      const res = await new VoteStudyService(this.$axios)["add"](this.payload);
      if (get(res, "success", false)) {
        this.$toasted.success("Thành công");
        this.reset();
        const params = {
          elearning_id: get(this, "$route.params.id", ""),
        };
        this.$store.dispatch(`elearning/study/detail/getReviews`, params);
        return;
      }
      this.$toasted.error(get(res, "message", "Có lỗi xảy ra"));
    },

    get,
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/study/_tab-qa-editor.scss";
</style>
