<template>
  <div class="homepage py-0">
    <HomeBanner :isLogin="isAuthenticated" />
    <SubBanner />

    <div v-if="pageLoading" class="container mt-6">
      <div class="row">
        <div v-for="i in 16" :key="i" class="col-md-3 mb-6">
          <div class="bg-white py-6 px-3">
            <VclList />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="container mt-6">
      <ElearningHomeBox class="elearning-home-box" title="Học gì tiếp theo">
        <ul slot="title-right" class="elearning-home-box__tab">
          <li v-for="tab in whatNextsTabs" :key="tab.value">
            <a
              href="javscript:;"
              :class="{ 'active': whatNextsTab === tab.value }"
              @click.prevent="changeWhatNextsTab(tab.value)"
            >{{ tab.text }}</a>
          </li>
        </ul>

        <app-carousel
          :options="{ slidesPerView: 4, spaceBetween: 24, preventClicksPropagation: false }"
          ref="whatNextsCarousel"
        >
          <template slot="default" slot-scope="{ classes }">
            <div
              v-for="item in whatNexts && whatNexts.content || []"
              :key="item.elearning_id"
              :class="classes"
            >
              <div v-if="whatNextsLoading" class="bg-white py-6 px-4">
                <vcl-list />
              </div>

              <CourseItem2 v-else class="my-0" :item="item" :size="'sm'" />
            </div>
          </template>
        </app-carousel>
      </ElearningHomeBox>
    </div>

    <HowToLearn />
    <LearnCoursera :isLogin="isAuthenticated"/>
    <LearnEverywhere />
    <NumberHighlight />
    <Feedback />
    <EveryDevices />
  </div>
</template>

<script>
import { get } from "lodash";
import { mapState, mapGetters, mapActions } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { ELEARNING_TYPES, SUBJECT_CODE } from "~/utils/constants";
import { VclList } from "vue-content-loading";

const IconDefaultSubject = () =>
  import("~/assets/svg/icons/default-subject.svg?inline");
const IconSubjectMath = () =>
  import("~/assets/svg/icons/subject-math.svg?inline");
const IconSubjectPhysical = () =>
  import("~/assets/svg/icons/subject-physical.svg?inline");
const IconSubjectChemistry = () =>
  import("~/assets/svg/icons/subject-chemistry.svg?inline");
const IconSubjectForeignLanguage = () =>
  import("~/assets/svg/icons/subject-foreign-language.svg?inline");
const IconSubjectLiterature = () =>
  import("~/assets/svg/icons/subject-literature.svg?inline");
const IconSubjectBiology = () =>
  import("~/assets/svg/icons/subject-biology.svg?inline");
const IconSubjectGeography = () =>
  import("~/assets/svg/icons/subject-geography.svg?inline");
const IconSubjectHistory = () =>
  import("~/assets/svg/icons/subject-history.svg?inline");
const IconSubjectInformatics = () =>
  import("~/assets/svg/icons/subject-informatics.svg?inline");
const IconSubjectTechnology = () =>
  import("~/assets/svg/icons/subject-technology.svg?inline");
const IconSubjectFineArt = () =>
  import("~/assets/svg/icons/subject-fine-art.svg?inline");
const IconSubjectCivicEducation = () =>
  import("~/assets/svg/icons/subject-civic-education.svg?inline");
const IconSubjectMusic = () =>
  import("~/assets/svg/icons/subject-music.svg?inline");
const IconSubjectScience = () =>
  import("~/assets/svg/icons/subject-science.svg?inline");
import IconArrowForwardIos from "~/assets/svg/v2-icons/arrow_forward_ios_24px.svg?inline";

import HomeBanner from "~/components/page/home/HomeBanner.vue";
import SubBanner from "~/components/page/home/SubBanner";
import ElearningHomeBox from "~/components/page/elearning/home/ElearningHomeBox";
import HowToLearn from "~/components/page/home/HowToLearn";
import LearnCoursera from "~/components/page/home/LearnCoursera";
import LearnEverywhere from "~/components/page/home/LearnEverywhere";
import NumberHighlight from "~/components/page/home/NumberHighlight";
import Feedback from "~/components/page/home/Feedback";
import EveryDevices from "~/components/page/home/EveryDevices";
import CourseItem2 from "~/components/page/course/CourseItem2";

export default {
  components: {
    VclList,
    HomeBanner,
    SubBanner,
    ElearningHomeBox,
    HowToLearn,
    LearnCoursera,
    LearnEverywhere,
    NumberHighlight,
    CourseItem2,
    IconArrowForwardIos,
    Feedback,
    EveryDevices,
  },

  async fetch({ params, query, store }) {
    const getWhatNexts = () =>
      store.dispatch(
        `elearning/public/public-what-nexts/${actionTypes.ELEARNING_PUBLIC_WHAT_NEXTS.LIST}`,
        {
          params: {
            type: ELEARNING_TYPES.LECTURE
          }
        }
      );
    const getForYou = () =>
      store.dispatch(
        `elearning/public/public-for-you/${actionTypes.ELEARNING_PUBLIC_FOR_YOU.LIST}`
      );
    const getVotedSubjects = () =>
      store.dispatch(
        `elearning/public/public-voted-subjects/${actionTypes.ELEARNING_PUBLIC_VOTED_SUBJECTS.LIST}`
      );
    const getNewestLecture = () =>
      store.dispatch(
        `elearning/public/public-newest/${actionTypes.ELEARNING_PUBLIC_NEWEST.LIST_LECTURE}`,
        {
          params: {
            type: ELEARNING_TYPES.LECTURE
          }
        }
      );
    const getNewestCourse = () =>
      store.dispatch(
        `elearning/public/public-newest/${actionTypes.ELEARNING_PUBLIC_NEWEST.LIST_COURSE}`,
        {
          params: {
            type: ELEARNING_TYPES.COURSE
          }
        }
      );
    const getHightlightTeachers = () =>
      store.dispatch(
        `elearning/public/public-highlight-teachers/${actionTypes.ELEARNING_PUBLIC_HIGHLIGHT_TEACHERS.LIST}`
      );

    return await Promise.all([
      getWhatNexts(),
      getForYou(),
      getVotedSubjects(),
      getNewestLecture(),
      getNewestCourse(),
      getHightlightTeachers()
    ]);
  },

  data() {
    return {
      ELEARNING_TYPES: Object.freeze(ELEARNING_TYPES),
      pageLoading: true,
      whatNextsLoading: false,
      whatNextsTab: ELEARNING_TYPES.LECTURE,
      whatNextsTabs: [
        {
          value: ELEARNING_TYPES.LECTURE,
          text: "Bài giảng nổi bật"
        },
        {
          value: ELEARNING_TYPES.COURSE,
          text: "Khóa học nổi bật"
        }
      ]
    };
  },

  computed: {
    ...mapState("elearning/public/public-summary", {
      elearnings: "elearnings",
    }),
    ...mapState("elearning/public/public-what-nexts", ["whatNexts"]),
    ...mapState("elearning/public/public-for-you", ["forYou"]),
    ...mapState("elearning/public/public-voted-subjects", ["votedSubjects"]),
    ...mapState("elearning/public/public-newest", [
      "newestLecture",
      "newestCourse"
    ]),
    ...mapState("elearning/public/public-highlight-teachers", [
      "highlightTeachers"
    ]),
    ...mapGetters("auth", ["isAuthenticated"])
  },

  mounted() {
    this.pageLoading = false;
    this.elearningPublicSummaryStatistic();
  },

  methods: {
    get,
    ...mapActions("elearning/public/public-summary", [
      "elearningPublicSummaryStatistic"
    ]),

    async changeWhatNextsTab(tab) {
      const { whatNextsCarousel = {} } = this.$refs;

      this.whatNextsTab = tab;
      this.whatNextsLoading = true;

      await this.$store.dispatch(
        `elearning/public/public-what-nexts/${actionTypes.ELEARNING_PUBLIC_WHAT_NEXTS.LIST}`,
        {
          params: {
            type: tab
          }
        }
      );

      if (whatNextsCarousel.mySwiper) {
        whatNextsCarousel.mySwiper.update();
        whatNextsCarousel.mySwiper.slideTo(0);
      }

      this.whatNextsLoading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/pages/_homepage.scss";
</style>
