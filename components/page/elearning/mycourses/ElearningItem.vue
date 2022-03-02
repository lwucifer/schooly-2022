<template>
  <!-- <div> -->
  <div class="wrap__elearning-item" v-if="elearning.is_study">
    <div class="img__elearning-item">
      <n-link :to="`/elearning/${elearning && elearning.elearning_id}`">
        <img
          v-lazy="
            elearning && elearning.avatar && elearning.avatar.low
              ? elearning.avatar.low
              : 'https://picsum.photos/20/206'
          "
        />
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
          <span class="ml-2">
            {{ get(elearning, "teacher.name", "") }}
          </span>
        </n-link>
        <!--<app-avatar-->
        <!--:src="elearning && elearning.teacher.avatar && elearning.teacher.avatar.low ? elearning.teacher.avatar.low : 'https://picsum.photos/20/206'"-->
        <!--:size="20"-->
        <!--/>-->
        <!--<span-->
        <!--class="ml-2"-->
        <!--&gt;{{elearning && elearning.teacher.name ? elearning && elearning.teacher.name : 'Nguyễn Văn C'}}</span>-->
      </div>

      <div>
        <div class="proccess-bar-study-border">
          <div
            class="percent-proccess"
            v-bind:style="{
              width: Math.floor(get(elearning, 'progress', 0)) + '%',
            }"
          ></div>
        </div>

        <div class="d-flex py-3 finish-lesson">
          <span>
            Đã hoàn thành
            <strong class="text-primary"
              >{{ Math.floor(get(elearning, "progress", 0)) }}%</strong
            >
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
                          <IconLogo width="13" height="13" />Chia sẻ qua
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
                  v-if="showArchive"
                  @click.prevent="handleArchive(elearning.elearning_id)"
                >
                  <n-link to> <IconArchive class="icon" />Lưu trữ </n-link>
                </li>

                <li
                  v-else-if="+tab === 5"
                  @click.prevent="handleDeleteArchive(elearning.elearning_id)"
                >
                  <n-link to> <IconUnArchive class="icon" />Bỏ lưu trữ </n-link>
                </li>
              </ul>
            </app-dropdown>
          </div>
        </div>

        <div class="d-flex justify-content-between middle-point">
          <p>
            Điểm trung bình:
            <span
              v-if="isPoint && isCaculation"
              class="heading-6 text-primary font-weight-semi-bold"
            >
              {{
                numeral(get(elearning, "medium_score.score", 0)).format("0,0.0")
              }}
            </span>
            <span v-if="isPoint && !isCaculation">Chưa tổng kết</span>
            <span v-if="!isPoint">Không áp dụng</span>
          </p>

          <div v-if="isPoint && isCaculation" class="popover-point">
            <v-popover class="popover-detail" placement="right" trigger="click">
              <IconQuestionCircle
                width="16px"
                height="16px"
                class="fill-base"
                @click="handleShowDetailExams"
              />

              <template #popover>
                <p class="font-weight-semi-bold mb-2">Điểm chi tiết</p>

                <p class="mb-2" v-for="(score, index) in scores" :key="index">
                  {{ get(score, "name", "").substring(0, 20) }}
                  {{ get(score, "name.length", 0) > 20 ? "..." : "" }} :
                  <span class="text-primary"
                    >{{
                      numeral(get(score, "score", 0)).format("0,0.[0]")
                    }}
                    điểm</span
                  >
                </p>
              </template>
            </v-popover>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ElearningItem2
    v-else
    :elearning="elearning"
    @handleFavourite="handleFavourite"
    @handleDeleteFavourite="handleDeleteFavourite"
    @handleArchive="handleArchive"
    @handleDeleteArchive="handleDeleteArchive"
    @shareSchool="shareSchool"
  >
    <template v-slot:mycoursefavourite>
      <MenuDropDown />
    </template>
  </ElearningItem2>
  <!-- </div> -->
</template>

<script>
import IconDots from "~/assets/svg/icons/dots.svg?inline";
import IconCardsHeart from "~/assets/svg/v2-icons/cards-heart.svg?inline";
import IconShare24px from "~/assets/svg/v2-icons/share_24px.svg?inline";
import IconUnArchive from "~/assets/svg/v2-icons/un-archive.svg?inline";
import IconArchive from "~/assets/svg/design-icons/archive.svg?inline";
import IconFacebook from "~/assets/svg/design-icons/facebook.svg?inline";
import IconLogo from "~/assets/svg/icons/logo.svg?inline";
import IconQuestionCircle from "~/assets/svg/design-icons/question-circle.svg?inline";
import { get } from "lodash";
import numeral from "numeral";
import { mapActions, mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import ElearningItem2 from "~/components/page/elearning/mycourses/ElearningItem2";
import MenuDropDown from "~/components/page/elearning/mycourses/MenuDropDown";

export default {
  components: {
    IconDots,
    IconCardsHeart,
    IconShare24px,
    IconUnArchive,
    IconArchive,
    IconFacebook,
    IconLogo,
    IconQuestionCircle,
    ElearningItem2,
    MenuDropDown,
  },
  data() {
    return {
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
      // isPoint: true,
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
  },
  computed: {
    ...mapState("elearning/study/study-student", {
      elearningStudyStudent: "elearningStudyStudent",
    }),
    isPoint() {
      return get(this, "elearning.medium_score.apply", false) == true;
    },
    isCaculation() {
      return get(this, "elearning.medium_score.calculation", false) == true;
    },
    showArchive() {
      return get(this, "elearning.is_study", false) && +this.tab !== 5;
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
  },
  created() {
    // console.log("[props] elearning", this.elearning);
    // this.elearning_id = get(this, "elearning.elearning_id", "");
    // this.name = get(this, "elearning.name", "");
    // this.avatar = get(this, "elearning.avatar.low", "");
    // this.teacher.avatar = get(this, "elearning.teacher.avatar.low", "");
    // this.teacher.name = get(this, "elearning.teacher.name", "");
    // this.progress = get(this, "elearning.progress", "");
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/_elearning-my-courses";
</style>
