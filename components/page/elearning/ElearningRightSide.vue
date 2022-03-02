<template>
  <div class="elearning-right-side body-3">
    <div class="elearning-right-side__img">
      <img
        class="d-block w-100"
        :src="get(info, 'avatar.medium', null)"
        :alt="get(info, 'name', '')"
      />
    </div>

    <template v-if="!get(this, 'info.is_study', true)">
      <template v-if="get(info, 'elearning_price.free', false)">
        <div class="elearning-right-side__price-wrapper">
          <b class="heading-2 text-primary ml-auto">Miễn phí</b>
        </div>
      </template>

      <template v-else>
        <div class="elearning-right-side__price-wrapper">
          <template v-if="get(info, 'elearning_price.discount', 0)">
            <s class="heading-4 text-gray">
              {{
                get(info, "elearning_price.original_price", 0) | numeralFormat
              }}đ
            </s>
            <b class="heading-2 text-primary"
              >{{ get(info, "elearning_price.price", 0) | numeralFormat }}đ</b
            >
          </template>

          <b v-else class="heading-2 text-primary ml-auto">
            {{
              get(info, "elearning_price.original_price", 0) | numeralFormat
            }}đ
          </b>
        </div>
      </template>
    </template>

    <div v-if="isBuyElearning">
      <app-button
        v-if="isStartElearning"
        fullWidth
        class="text-uppercase body-2 font-weight-bold mb-4"
        @click="handleStudy"
        >Tham gia học</app-button
      >
      <app-button
        @click="handleStudy"
        v-if="isStudyElearning"
        color="primary"
        fullWidth
        square
        class="text-uppercase mt-3 mb-3"
      >
        Vào học ngay
      </app-button>
      <app-button
        color="primary"
        @click="handleStudy"
        fullWidth
        square
        class="text-uppercase mt-3 mb-3"
        v-if="isDoneElearning"
      >
        <IconDone24px /> &nbsp; ĐÃ HOÀN THÀNH {{ title.toUpperCase() }}
      </app-button>
    </div>

    <app-button
      v-else
      fullWidth
      class="text-uppercase body-2 font-weight-bold mb-4"
      @click.prevent="handleAddToCart"
      >CHỌN MUA</app-button
    >

    <app-alert
      v-if="get(info, 'is_study', false)"
      class="mb-3 alert-elearning"
      type="warning"
      size="sm"
      >Bạn đã mua {{ title }} này vào ngày
      {{ get(info, "join_date", "") | moment("DD/MM/YYYY") }}</app-alert
    >

    <ul class="info">
      <li>
        <IconPersonOutline class="icon" />
        Trình độ: {{ get(info, "level.name", "") }}
      </li>
      <li>
        <IconBorderColor class="icon" />
        Môn học: {{ get(info, "subject.name", "") }}
      </li>
      <li>
        <IconInsertComment class="icon" />
        Số bài học: {{ get(info, "lessons", 0) }} bài
      </li>
      <li>
        <IconTimer class="icon" />
        Thời lượng:
        {{ get(info, "duration", "01:00") }}
      </li>
      <li v-if="get(info, 'starttime_enable', false)">
        <IconPlayCirleWhite24px class="icon" />
        Bắt đầu: {{ get(info, "start_time", "") | getDateTimeHH_MM_D_M_Y_DASH }}
      </li>
      <li v-else>
        <IconPauseCircleOutline24px class="icon" />
        Bắt đầu:
        {{ get(info, "publish_date", "") | getDateTimeHH_MM_D_M_Y_DASH }}
      </li>
      <li v-if="get(info, 'endtime_enable', false)">
        <IconPauseCircleOutline24px class="icon" />
        Kết thúc: {{ get(info, "end_time", "") | getDateTimeHH_MM_D_M_Y_DASH }}
      </li>
      <li v-else>
        <IconPauseCircleOutline24px class="icon" />
        Kết thúc: Không thời hạn
      </li>
      <li>
        <IconRemoveRedEye class="icon" />Xem được trên máy tính, điện thoại,
        tablet
      </li>
    </ul>

    <app-divider class="elearning-right-side__divider my-0" />

    <div class="py-3 d-flex share-favourite">
      <a class="text-info share favourite">
        <ShareNetwork
          class="d-flex-center text-info "
          network="facebook"
          :url="`${baseUrl}/${get(info, 'elearning_id', '')}`"
          :title="get(info, 'name', '')"
          :description="description"
          :quote="description"
          hashtags="schoolly"
        >
          <IconBxsShare class="icon subheading mr-2" />Chia sẻ
        </ShareNetwork>
      </a>

      <a
        class="text-primary ml-auto d-flex-center favourite"
        @click="handleAddFavouriteElearning"
      >
        <IconFavorite
          v-if="get(info, 'is_favourite', false)"
          class="icon subheading mr-2"
        />
        <IconFavoriteBorder v-else class="icon subheading mr-2" />
        Yêu thích
      </a>
    </div>
    <PaymentModal
      v-if="showModalPayment"
      :fail="AddCartFail"
      @close-modal="handleCloseModal"
    />
    <ElearningRequestCode
      :info="info"
      :showRequestCode="showRequestCode"
      @handleCancel="handleCancelRequestCode"
      @handleSubmit="handleSubmitCode"
    />
  </div>
</template>

<script>
import { get } from "lodash";
import qs from "qs";
import IconShare from "~/assets/svg/icons/share.svg?inline";
import IconFavoriteBorder from "~/assets/svg/v2-icons/favorite_border_24px.svg?inline";
import IconFavorite from "~/assets/svg/v2-icons/favorite_24px.svg?inline";
import IconPersonOutline from "~/assets/svg/v2-icons/person_outline_24px.svg?inline";
import IconBorderColor from "~/assets/svg/v2-icons/border_color_24px.svg?inline";
import IconInsertComment from "~/assets/svg/v2-icons/insert_comment_24px.svg?inline";
import IconTimer from "~/assets/svg/v2-icons/timer_24px.svg?inline";
import IconRemoveRedEye from "~/assets/svg/v2-icons/remove_red_eye_24px.svg?inline";
import IconBxsShare from "~/assets/svg/icons/bxs-share.svg?inline";
import IconDone24px from "~/assets/svg/v2-icons/done_24px.svg?inline";
import IconPlayCirleWhite24px from "~/assets/svg/v2-icons/play_circle_filled_white_24px.svg?inline";
import IconPauseCircleOutline24px from "~/assets/svg/v2-icons/pause_circle_outline_24px.svg?inline";
import Favourite from "~/services/elearning/study/Favourite";
import { mapActions, mapGetters, mapState } from "vuex";
import { createOrderPaymentReq } from "~/models/payment/OrderPaymentReq";
import { createHashKeyReq } from "~/models/payment/HashKeyReq";
import { RESPONSE_SUCCESS } from "~/utils/config.js";
import JoinService from "~/services/elearning/Join";
import ElearningRequestCode from "~/components/page/elearning/ElearningRequestCode";
import PaymentModal from "~/components/page/payment/PaymentModal";
import { getLocalDateTime } from "~/utils/moment";
import moment from "moment";

export default {
  components: {
    IconShare,
    IconFavoriteBorder,
    IconFavorite,
    IconPersonOutline,
    IconBorderColor,
    IconInsertComment,
    IconTimer,
    IconRemoveRedEye,
    IconBxsShare,
    PaymentModal,
    IconDone24px,
    ElearningRequestCode,
    IconPlayCirleWhite24px,
    IconPauseCircleOutline24px,
  },

  data() {
    return {
      showModalPayment: false,
      AddCartFail: false,
      showRequestCode: false,
      baseUrl: process.env.BASE_ORIGIN_LOCATION,
    };
  },

  computed: {
    ...mapGetters("cart", ["cartCheckout"]),
    ...mapGetters("auth", ["isAuthenticated"]),
    ...mapState("elearning/detail", {
      info: "info",
      program: "program",
    }),
    isBuyElearning() {
      if (get(this, "info.elearning_price.free", false)) return true;
      if (get(this, "info.is_study", false)) return true;
      return false;
    },
    isStartElearning() {
      if (get(this, "info.is_study", false)) return false;
      if (this.isDoneElearning) return false;
      return true;
    },
    isStudyElearning() {
      if (this.isDoneElearning) return false;
      if (this.isStartElearning) return false;
      return true;
    },
    isDoneElearning() {
      if (get(this, "info.progress", "-1") >= 100) return true;
      return false;
    },

    description() {
      return get(this, "info.description", "");
      // let html = get(this, "info.description", "");
      // let div = document && document.createElement("div");
      // div.innerHTML = html;
      // let text = div.textContent || div.innerText || "";
      // return text;
    },

    title() {
      switch (get(this, "info.type", "")) {
        case "LECTURE":
          return "bài giảng";
          break;
        case "COURSE":
          return "khoá học";
          break;
        default:
          break;
      }
    },

    noteElearningNotTimeYet() {
      const start_time = get(this, "info.start_time", "");
      const type = get(this, "info.type", "");
      const start_time_format = getLocalDateTime(start_time).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      if (type === "LECTURE") {
        return `Bài giảng sẽ bắt đầu vào lúc ${start_time_format}. Xin vui lòng quay lại sau !`;
      }
      return `Khoá học sẽ bắt đầu vào lúc ${start_time_format}. Xin vui lòng quay lại sau !`;
    },
  },

  methods: {
    get,

    handleCancelRequestCode() {
      this.showRequestCode = false;
    },

    handleSubmitCode(pass_code) {
      const elearning_id = get(this, "info.id", "");
      const payload = {
        elearning_id,
        pass_code,
      };
      this.handleJoinElearning(payload);
    },

    async handleAddFavouriteElearning() {
      if (!get(this, "info.is_favourite", true)) {
        this.addFavourite();
        return;
      }
      this.removeFavourite();
    },

    async removeFavourite() {
      const payload = {
        elearning_ids: [get(this, "info.id", "")],
      };
      const res = await new Favourite(this.$axios)["deletePayload"](payload);
      if (get(res, "success", false)) {
        this.$toasted.success("Thành công");
        const options = {
          params: {
            elearning_id: get(this, "info.id", ""),
            token: "true",
          },
        };
        this.$store.dispatch("elearning/detail/getInfo", options);
        return;
      }
      this.$toasted.error(get(res, "message", "Có lỗi xảy ra"));
    },

    async addFavourite() {
      const payload = {
        elearning_id: get(this, "info.id", ""),
      };
      const res = await new Favourite(this.$axios)["add"](payload);
      if (get(res, "success", false)) {
        this.$toasted.success("Thành công");
        const options = {
          params: {
            elearning_id: get(this, "info.id", ""),
            token: "true",
          },
        };
        this.$store.dispatch("elearning/detail/getInfo", options);
        return;
      }
      this.$toasted.error(get(res, "message", "Có lỗi xảy ra"));
    },

    async handleStudy() {
      if (!this.isAuthenticated) {
        this.$router.push("/auth/signin");
        return;
      }

      const elearning_id = get(this, "info.id", "");
      const starttime_enable = get(this, "info.starttime_enable", false);
      const start_time = get(this, "info.start_time", "");
      const is_private = get(this, "info.is_private", false);
      const is_study = get(this, "info.is_study", false);
      const free = get(this, "info.elearning_price.free", false);

      if (starttime_enable) {
        try {
          const start_time_timestamp = moment(
            getLocalDateTime(start_time)
          ).format("x");
          const now_timestamp = moment().format("x");
          if (now_timestamp < start_time_timestamp) {
            this.$toasted.error(this.noteElearningNotTimeYet);
            return;
          }
        } catch (error) {
          console.log(error);
        }
      }

      if (is_study) {
        this.$router.push(`/elearning/${elearning_id}/study`);
        return;
      }

      if (is_private) {
        this.showRequestCode = true;
        return;
      }

      if (free) {
        const payload = {
          elearning_id,
        };
        this.handleJoinElearning(payload);
        return;
      }
    },

    async handleJoinElearning(payload) {
      const elearning_id = get(this, "info.id", "");
      const res = await new JoinService(this.$axios)["add"](payload);

      if (get(res, "success", false)) {
        this.$router.push(`/elearning/${elearning_id}/study`);
        return;
      }

      if (get(res, "code", "") === "SCLC_1127") {
        this.$router.push(`/elearning/${elearning_id}/study`);
        return;
      }

      if (get(res, "code", "") === "SCLC_1245") {
        this.$toasted.error(this.noteElearningNotTimeYet);
        return;
      }

      this.$toasted.error(get(res, "message", "Có lỗi xảy ra"));
    },

    ...mapActions("cart", ["cartAdd"]),
    ...mapActions("cart", ["cartList"]),

    handleAddToCart() {
      const payload = {
        product_id: get(this, "info.id", ""),
        product: "elearning",
      };
      this.cartAdd(payload).then((result) => {
        this.cartList();
        this.showModalPayment = true;
        if (!result.success) {
          this.AddCartFail = true;
        }
      });
    },
    handleCloseModal() {
      this.showModalPayment = false;
      this.AddCartFail = false;
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/_elearning-right-side.scss";
</style>
