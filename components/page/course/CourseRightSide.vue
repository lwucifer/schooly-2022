<template>
  <div class="course-right-side">
    <div>
      <img
        :src="
          get(favourites, 'content.0.avatar', 'https://picsum.photos/330/204')
        "
        alt
        class="w-100"
      />
    </div>
    <div class="price">
      <div class="d-flex justify-content-around" v-if="showPaiedPrice">
        <span class="text-secondary price--primary">
          {{
            numeral(
              get(favourites, "content.0.price.original_price", 0)
            ).format() | numeralFormat("0,0")
          }}đ
        </span>
        <span class="price--secondary">
          {{
            numeral(
              get(favourites, "content.0.price.original_price", 0)
            ).format() | numeralFormat("0,0")
          }}đ
        </span>
      </div>
      <div v-if="showFreePrice">
        <span class="text-secondary price--primary"> Miễn phí </span>
      </div>
    </div>

    <slot name="btnJoin">
      <app-button
        v-if="showBtnBuy"
        color="secondary"
        fullWidth
        square
        class="text-uppercase mt-3 mb-3"
        @click="buy"
      >
        Mua ngay
      </app-button>

      <app-button
        v-if="showBtnJoin"
        color="secondary"
        fullWidth
        square
        class="text-uppercase mt-3 mb-3"
        @click="join"
      >
        Tham gia học
      </app-button>

      <app-button
        v-if="showBtnStartLearning"
        color="secondary"
        fullWidth
        square
        class="text-uppercase mt-3 mb-3"
        @click="learn"
      >
        Vào học ngay
      </app-button>

      <app-button
        v-if="showBtnDone"
        color="secondary"
        fullWidth
        square
        class="text-uppercase mt-3 mb-3"
      >
        <IconTickCircle /> &nbsp; BÀI GIẢNG ĐÃ HOÀN THÀNH
      </app-button>
    </slot>

    <slot name="tooltip"></slot>

    <ul class="info">
      <li>
        <IconBook class="mr-2" />Trình độ:
        {{ get(favourites, "content.0.level", 0) }}
      </li>
      <li>
        <IconSubject class="mr-2" />Môn học:
        {{ get(favourites, "content.0.subject", "") }}
      </li>
      <li>
        <IconLessons class="mr-2" />Số bài giảng:
        {{ get(favourites, "content.0.learning.total_lesson", 0) }}
      </li>
      <li>
        <IconClock class="mr-2" />Thời lượng:
        {{ get(favourites, "content.0.duration", 0) }}
      </li>
      <li>
        <IconEye class="mr-2" />Xem được trên máy tính, điện thoại, tablet
      </li>
    </ul>
    <hr />
    <div class="mt-15 mb-3 d-flex">
      <a class="color-primary d-flex-center" href>
        <IconShare class="fill-primary mr-2" />Chia sẻ
      </a>
      <a class="color-red ml-auto d-flex-center" @click="handleFavourite">
        <IconHeart class="fill-red mr-2" />Yêu thích
      </a>
    </div>
  </div>
</template>
<script>
import BannerImage from "~/assets/images/tmp/money.png";
import IconShare from "~/assets/svg/icons/share.svg?inline";
import IconHeart from "~/assets/svg/icons/heart.svg?inline";
import IconBook from "~/assets/svg/icons/book.svg?inline";
import IconSubject from "~/assets/svg/icons/subject.svg?inline";
import IconLessons from "~/assets/svg/icons/lessons.svg?inline";
import IconClock from "~/assets/svg/icons/clock.svg?inline";
import IconEye from "~/assets/svg/icons/eye.svg?inline";
import IconTickCircle from "~/assets/svg/icons/tick-circle.svg?inline";
import { get } from "lodash";
import * as actionTypes from "~/utils/action-types";
import { mapState } from "vuex";
import numeral from "numeral";
import AppButton from "../../common/button/AppButton";

export default {
  components: {
    AppButton,
    IconShare,
    IconHeart,
    IconEye,
    IconClock,
    IconLessons,
    IconSubject,
    IconBook,
    IconTickCircle,
  },
  props: {
    date: {
      type: Object,
      default: () => {},
    },
    isJoined: {
      type: Boolean,
      default: false,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    isBuyed: {
      type: Boolean,
      default: false,
    },
  },

  created() {
    this.fetchStudyFavourite();
  },

  computed: {
    ...mapState("elearning/study/study-favourite", {
      favourites: "favourites",
    }),
    isFree: function() {
      return (
        numeral(
          get(this.favourites, "content.0.price.original_price", 0)
        ).format() == 0
      );
    },
    showFreePrice: function() {
      return this.isFree && !this.isJoined;
    },
    showPaiedPrice: function() {
      let checked = !this.isFree && !this.isDone;
      return checked;
    },
    showBtnJoin: function() {
      return !this.isJoined;
    },
    showBtnStartLearning: function() {
      return this.isJoined && !this.isDone;
    },
    showBtnDone: function() {
      return this.isDone;
    },
    showBtnBuy: function() {
      return !this.isBuyed && !this.isFree;
    },
  },

  watch: {
    "$route.params.id": {
      handler: function() {
        this.fetchStudyFavourite();
      },
      deep: true,
      immediate: false,
    },
  },

  data() {
    return {
      banner: BannerImage,
    };
  },

  methods: {
    async handleFavourite() {
      const elearning_id = get(this, "$route.params.id", "");
      const options = {
        elearning_id,
      };
      await this.$store.dispatch(
        `elearning/study/study-favourite/${actionTypes.ELEARNING_STURY_FAVOURITE.ADD}`,
        options
      );
      this.$toasted.show("success");
    },
    get,
    numeral,
    fetchStudyFavourite() {
      const elearning_id = get(this, "$route.params.id", "");
      const options = {
        params: {
          elearning_id,
        },
      };
      this.$store.dispatch(
        `elearning/study/study-favourite/${actionTypes.ELEARNING_STURY_FAVOURITE.LIST}`,
        options
      );
    },
    join() {
      this.$emit("joinCourse");
    },
    learn() {
      this.$emit("startLearn");
    },
    buy() {
      this.$emit("buy");
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/course/_course-right-side.scss";
</style>
