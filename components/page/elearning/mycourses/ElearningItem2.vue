<template>
  <!-- <div> -->
  <div class="wrap__elearning-item">
    <div class="img__elearning-item">
      <n-link :to="`/elearning/${elearning && elearning.elearning_id}`">
        <img
          v-lazy="
            elearning && elearning.avatar && elearning.avatar.low
              ? elearning.avatar.low
              : 'https://picsum.photos/20/206'
          "
        />
        <div
          v-if="get(elearning, 'is_streaming', false)"
          class="item-2__livestream"
        >
          <IconCameraOnline class="icon" />Trực tiếp
        </div>

        <!-- <div
          v-if="get(elearning, 'is_streaming', false)"
          class="item-2__online-class"
        >
          Lớp học đang diễn ra
        </div> -->

        <!-- nếu giảm giá 100% thì sẽ ko hiện nữa -->
        <!--
        <div
          v-if="elearning.discount && price.price"
          class="course-item-2__discount"
        >
          -{{ elearning.discount }}%
        </div>
        -->
        <div v-if="price.discount && price.price" class="item-2__discount">
          -{{ elearning.discount }}%
        </div>
      </n-link>
    </div>
    <div class="wrap-content_Elearning">
      <h3 class="name_elearning-item">
        <n-link
          :to="`/elearning/${elearning && elearning.elearning_id}`"
          :title="elearning.name"
          >{{ elearning && elearning.name }}</n-link
        >
      </h3>
      <div class="d-flex align-items-center my-3">
        <n-link
          :to="`/public/profile/teacher?user_id=${elearning.teacher.id}`"
          class="profile-link"
          target="_blank"
        >
          <app-avatar
            :src="
              elearning &&
              elearning.teacher.avatar &&
              elearning.teacher.avatar.low
                ? elearning.teacher.avatar.low
                : 'https://picsum.photos/20/206'
            "
            :size="20"
          />
          <span class="ml-2">{{
            elearning && elearning.teacher.name
              ? elearning && elearning.teacher.name
              : ""
          }}</span>
        </n-link>
        <!--<app-avatar-->
        <!--:src="elearning && elearning.teacher.avatar && elearning.teacher.avatar.low ? elearning.teacher.avatar.low : 'https://picsum.photos/20/206'"-->
        <!--:size="20"-->
        <!--/>-->
        <!--<span-->
        <!--class="ml-2"-->
        <!--&gt;{{elearning && elearning.teacher.name ? elearning && elearning.teacher.name : 'Nguyễn Văn C'}}</span>-->
      </div>
      <div class="d-flex">
        <app-stars
          class="d-inline-flex"
          :stars="get(elearning, 'voting.rate', 0)"
          :size="size === 'sm' ? 12 : 14"
        />
        <span class="text-dark ml-2">
          <strong>{{ get(elearning, "voting.rate", 0) }}</strong>
          ({{ get(elearning, "voting.votes", 0) }})
        </span>
        <div class="ml-auto">
          <app-dropdown
            class="post__menu-dropdown"
            position="right"
            open-on-click
            v-model="menuDropdown"
            :content-width="'15rem'"
          >
            <button slot="activator" slot-scope="{ on }" v-on="on">
              <IconDots class="icon fill-gray" />
            </button>

            <ul class="link--dropdown__ElearningItem">
              <li
                class="item-share__ElearningItem"
                @click.prevent="shareDropdown = !shareDropdown"
                v-if="tab !== 5"
              >
                <v-popover
                  popoverClass="menu-share-elearning-tooltip"
                  placement="right"
                  trigger="hover"
                >
                  <n-link class="pr-2" to>
                    <IconShare24px class="icon" />Chia sẻ
                  </n-link>
                  <template slot="popover">
                    <ul class="share-dropdowm__ElearningItem">
                      <li @click.prevent="shareFb(elearning.elearning_id)">
                        <IconFacebook class="icon fill-info" />Chia sẻ qua
                        Facebook
                      </li>
                      <li @click.prevent="shareSchool(elearning)">
                        <IconSchooly class="icon fill-white" />Chia sẻ qua
                        Schoolly
                      </li>
                    </ul>
                  </template>
                </v-popover>
              </li>
              <li
                v-if="elearning && !elearning.is_favourite && tab !== 5"
                @click.prevent="handleFavourite(elearning.elearning_id)"
              >
                <n-link to> <IconCardsHeart class="icon" />Yêu thích </n-link>
              </li>
              <li
                v-else-if="elearning && elearning.is_favourite && tab !== 5"
                @click.prevent="handleDeleteFavourite(elearning.elearning_id)"
              >
                <n-link to class="text-primary">
                  <IconCardsHeart class="icon" />Bỏ yêu thích
                </n-link>
              </li>
              <li
                v-if="showArchive && tab !== 5"
                @click.prevent="handleArchive(elearning.elearning_id)"
              >
                <n-link to> <IconArchive class="icon" />Lưu trữ </n-link>
              </li>
              <li
                v-else-if="showArchive && tab === 5"
                @click.prevent="handleDeleteArchive(elearning.elearning_id)"
              >
                <n-link to class="text-primary">
                  <IconUnArchive class="icon" />Bỏ lưu trữ
                </n-link>
              </li>
            </ul>
          </app-dropdown>
        </div>
      </div>
      <div>
        <div class="text-right mt-2 mb-3">
          <b v-if="!price.price" class="text-primary body-1 font-weight-bold"
            >Miễn phí</b
          >

          <template v-else>
            <s class="body-3" v-if="price.discount">
              {{ get(price, "original_price") | numeralFormat }}đ
            </s>
            <b class="text-primary body-1 font-weight-bold ml-2"
              >{{ get(price, "price") | numeralFormat }}đ</b
            >
          </template>
        </div>

        <div v-if="!price.price">
          <app-button
            v-if="isStartElearning"
            fullWidth
            normal
            size="sm"
            @click="handleStudy"
            >Tham gia học</app-button
          >
          <app-button
            @click="handleStudy"
            v-if="isStudyElearning"
            fullWidth
            size="sm"
            normal
          >
            Vào học ngay
          </app-button>
          <app-button
            color="primary"
            @click="handleStudy"
            fullWidth
            size="sm"
            normal
            v-if="isDoneElearning"
          >
            Đã hoàn thành
          </app-button>
        </div>

        <app-button
          v-else
          fullWidth
          size="sm"
          normal
          @click.prevent="handleAddToCart"
          >Mua ngay</app-button
        >
      </div>
    </div>

    <PaymentModal
      v-if="showModalPayment"
      :fail="AddCartFail"
      @close-modal="handleCloseModal"
    />
  </div>
</template>

<script>
import IconDots from "~/assets/svg/icons/dots.svg?inline";
import IconCardsHeart from "~/assets/svg/v2-icons/cards-heart.svg?inline";
import IconShare24px from "~/assets/svg/v2-icons/share_24px.svg?inline";
import IconUnArchive from "~/assets/svg/v2-icons/un-archive.svg?inline";
import IconArchive from "~/assets/svg/design-icons/archive.svg?inline";
import IconFacebook from "~/assets/svg/design-icons/facebook.svg?inline";
import IconSchooly from "~/assets/svg/icons/schooly.svg?inline";
import { get } from "lodash";
import numeral from "numeral";
import { mapActions, mapState, mapGetters } from "vuex";
import * as actionTypes from "~/utils/action-types";
import ElearningItem2 from "~/components/page/elearning/mycourses/ElearningItem2";
import MenuDropDown from "~/components/page/elearning/mycourses/MenuDropDown";
import IconCameraOnline from "assets/svg/icons/camera-online.svg?inline";
import PaymentModal from "~/components/page/payment/PaymentModal";
import JoinService from "~/services/elearning/Join";

export default {
  components: {
    IconDots,
    IconCardsHeart,
    IconShare24px,
    IconUnArchive,
    IconArchive,
    IconFacebook,
    IconSchooly,
    ElearningItem2,
    MenuDropDown,
    IconCameraOnline,
    PaymentModal
  },
  data() {
    return {
      showModalPayment: false,
      AddCartFail: false,
      menuDropdown: false,
      shareDropdown: false,
      id: "",
      name: "",
      avatar: "",
      teacher: {
        avatar: "",
        name: "",
      },
      progress: null,
      is_favourite: false,
      isLearning: true,
      isFree: true,
      scores: [],
    };
  },
  props: {
    elearning: {
      default: null,
    },
    tab: {
      default: 1,
    },
    size: {
      type: String,
      default: "md",
      validator: (value) => ["sm", "md"].includes(value),
    },
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
    ...mapState("elearning/study/study-student", {
      elearningStudyStudent: "elearningStudyStudent",
    }),
    price() {
      if (this.elearning.elearning_price) return this.elearning.elearning_price;
      return {
        discount: get(this.elearning, "discount", 0),
        original_price: get(this.elearning, "original_price", 0),
        price: get(this.elearning, "price", 0),
      };
    },
    isPoint() {
      return get(this, "elearning.medium_score.apply", false) == true;
    },
    isCaculation() {
      return get(this, "elearning.medium_score.calculation", false) == true;
    },
    showArchive() {
      return get(this, "elearning.is_study", false);
    },

    isStartElearning() {
      if (get(this, "elearning.is_study", false)) return false;
      if (this.isDoneElearning) return false;
      return true;
    },
    isStudyElearning() {
      if (this.isDoneElearning) return false;
      if (this.isStartElearning) return false;
      return true;
    },
    isDoneElearning() {
      if (get(this, "elearning.progress", "-1") >= 100) return true;
      return false;
    },
    noteElearningNotTimeYet() {
      const start_time = get(this, "elearning.start_time", "");
      const type = get(this, "elearning.type", "");
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
    numeral,
    async handleShowDetailExams() {
      const params = {
        elearning_id: get(this, "elearning.elearning_id", ""),
      };
      const { data } = await this.$axios({
        url: "/elearning/study/elearning/score",
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
        params,
      });
      this.scores = get(data, "data.scores", []);
    },

    handleFavourite(id) {
      this.menuDropdown = false;
      this.$emit("handleFavourite", id);
    },
    handleDeleteFavourite(id) {
      this.menuDropdown = false;
      this.$emit("handleDeleteFavourite", id);
    },
    handleArchive(id) {
      this.menuDropdown = false;
      this.$emit("handleArchive", id);
    },
    handleDeleteArchive(id) {
      this.menuDropdown = false;
      this.$emit("handleDeleteArchive", id);
    },
    shareFb(id) {
      this.$emit("shareFb", id);
      // const url =
      //   "https://facebook.com/sharer.php?display=popup&u=" +
      //   window.origin +
      //   `elearning/${id}`;
      // window.open(url, "sharer", "_blank");
    },
    async shareSchool(elearning) {
      this.$emit("shareSchool", elearning);
      // const link = window.origin + `/elearning/${id}`;
      // const doAdd = await this.$store.dispatch(
      //   `social/newfeed/${actionTypes.SOCIAL.ADD_POST}`,
      //   { link: link }
      // );
      // if (doAdd.success) {
      //   this.menuDropdown = false;
      //   this.$toasted.show("Đã chia sẻ thành công.");
      // } else {
      //   this.$toasted.error(doAdd.message);
      // }
    },

    async handleStudy() {
      if (!this.isAuthenticated) {
        this.$router.push("/auth/signin");
        return;
      }

      const elearning_id = get(this, "elearning.elearning_id", "");
      const starttime_enable = get(this, "elearning.starttime_enable", false);
      const start_time = get(this, "elearning.start_time", "");
      const is_private = get(this, "elearning.is_private", false);
      const is_study = get(this, "elearning.is_study", false);
      const free = !this.price.price;

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
      const elearning_id = get(this, "elearning.elearning_id", "");
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
@import "~/assets/scss/components/elearning/_elearning-my-courses";
</style>
