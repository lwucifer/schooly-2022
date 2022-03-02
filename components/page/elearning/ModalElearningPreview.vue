<template>
  <app-modal
    centered
    :width="750"
    :component-class="{ 'preview-modal': true }"
    :footer="false"
    title="Chi tiết"
    @close="close()"
  >
    <div slot="content">
      <div class="elearning-view" v-if="loading">Loading...</div>
      <div class="elearning-view" v-else>
        <ElearningViewInfo :info="info" :previewInfo="previewData" style="padding: 0"/>

        <ElearningIntroduce/>

        <ElearningContent/>

        <CourseTeacherInfo />

        <ElearningReview/>
      </div>
    </div>
  </app-modal>
</template>

<script>
import { get } from "lodash";
import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { ELEARNING_TYPES } from "~/utils/constants";
import { getDeviceID } from "~/utils/common";

import InfoService from "~/services/elearning/public/Info";
import LevelService from "~/services/elearning/public/Level";
import SubjectService from "~/services/elearning/public/Subject";
import ProgramService from "~/services/elearning/public/Program";
import RelatedService from "~/services/elearning/public/Related";
import TeacherEls from "~/services/elearning/public/TeacherEls";

import CourseTeacherInfo from "~/components/page/course/CourseTeacherInfo";
import ElearningSliderTab from "~/components/page/elearning/ElearningSliderTab";
import ElearningReview from "~/components/page/elearning/ElearningReview";
import ElearningRightSide from "~/components/page/elearning/ElearningRightSide";
import ElearningViewInfo from "~/components/page/elearning/ElearningViewInfoPreview";
import ElearningMainMenu from "~/components/page/elearning/ElearningMainMenu";
import ElearningIntroduce from "~/components/page/elearning/ElearningIntroduce";
import ElearningContent from "~/components/page/elearning/ElearningContent";
// import Breadcrumb from "~/components/layout/breadcrumb/BreadCrumb";

import IconEye from "~/assets/svg/icons/eye.svg?inline";
import IconPlayO from "~/assets/svg/icons/play-o.svg?inline";
import IconDownload from "~/assets/svg/icons/download.svg?inline";
import IconBooks from "~/assets/svg/icons/books.svg?inline";
import IconAngleDown from "~/assets/svg/design-icons/angle-down.svg?inline";
const IconCheckCircle = () =>
  import("~/assets/svg/icons/check-circle.svg?inline");
const IconFileAlt = () =>
  import("~/assets/svg/design-icons/file-alt.svg?inline");
const IconPlayCircle = () =>
  import("~/assets/svg/design-icons/play-circle.svg?inline");

export default {
  name: "E-learningDetail",
  // layout: "manage",

  components: {
    CourseTeacherInfo,
    ElearningSliderTab,
    ElearningReview,
    ElearningRightSide,
    IconEye,
    IconPlayO,
    IconBooks,
    IconDownload,
    IconCheckCircle,
    IconAngleDown,
    IconFileAlt,
    IconPlayCircle,
    ElearningViewInfo,
    ElearningMainMenu,
    ElearningIntroduce,
    ElearningContent
    // Breadcrumb,
  },

  props: {
    previewData: {
      type: Object,
      default: {}
    },
  },

  data() {
    return {
      // info: null,
      loading: true,
      // levels: [],
      // subjects: [],
      // program: [],
      // relatedCourses: [],
      // teacherEls: [],
      sliderOptions: {
        spaceBetween: 20,
        slidesPerView: 3,
        setWrapperSize: true,
        watchOverflow: true,
      },
    };
  },

  computed: {
    ...mapState("elearning/detail", {
      info: "info",
      lectures_of_teacher: "lectures_of_teacher",
      lectures_related: "lectures_related",
    }),

    typeText() {
      if (this.info) {
        switch (this.info.type) {
          case ELEARNING_TYPES.LECTURE:
            return "bài giảng";
            break;
          case ELEARNING_TYPES.COURSE:
            return "khoá học";
            break;
          default:
            break;
        }
      }
    },
  },

  updated() {
    console.log(this.lectures_related);
  },

  async mounted() {
    const isDeviceIdExist = !!getDeviceID();
    !isDeviceIdExist && this.initFingerPrint();

    this.loading = true;
    const options = {
      params: {
        elearning_id: get(this, "previewData.id", ""),
        token: "true",
      },
    };
    await this.$store.dispatch("elearning/detail/getInfo", options);
    // await this.$store.dispatch("elearning/detail/getLectureOfTeacher");
    // await this.$store.dispatch("elearning/detail/getLecturesRelated");
    // await this.$store.dispatch("elearning/detail/getTeacher");
    this.loading = false;
    // this.getData();

    // check whether device_id is set or not?

    // window.addEventListener("scroll", this.bindScrollStatus);
    // if (this.$route.hash && process.browser) {
    //   const hashEl = document.querySelector(this.$route.hash);
    //   hashEl && this.scrollTo(this.$route.hash);
    // }
  },

  // beforeDestroy() {
  //   window.removeEventListener("scroll", this.bindScrollStatus);
  // },

  watch: {
    info: {
      handler: async function() {
        this.loading = true;
        await this.$store.dispatch("elearning/detail/getLectureOfTeacher");
        await this.$store.dispatch("elearning/detail/getLecturesRelated");
        await this.$store.dispatch("elearning/detail/getTeacher");
        await this.$store.dispatch("elearning/detail/getProgram");
        this.loading = false;
      },
      deep: true,
    },
  },

  methods: {
    get,

    close() {
      this.$emit("close");
    },
    async getData() {
      const elearning_id = get(this, "previewData.id", "");

      const params = {
        elearning_id,
        token: "true",
      };

      const getInfo = () =>
        this.$store.dispatch(
          `elearning/public/public-info/${actionTypes.ELEARNING_PUBLIC_INFO.LIST}`,
          params
        );

      const getProgram = () =>
        new ProgramService(this.$axios)[actionTypes.BASE.LIST]({
          params,
        });
      const getRelatedCourses = () =>
        new RelatedService(this.$axios)[actionTypes.BASE.LIST]({
          params,
        });

      this.loading = true;

      const data = await Promise.all([
        getInfo(),
        getProgram(),
        getRelatedCourses(),
      ]);

      this.loading = false;

      this.info = get(data, "0.data", {});
      this.program = get(data, "1.data", []);
      this.relatedCourses = get(data, "2.data.content", []);
    },

    initFingerPrint() {
      if (window.requestIdleCallback) {
        requestIdleCallback(getDeviceID);
      } else {
        setTimeout(getDeviceID, 500);
      }
    },

    // bindScrollStatus(event) {
    //   const navLink = document.querySelector(".elearning-view__main-nav");
    //   const link = document.querySelectorAll('.scroll-link[href^="#"]');
    //   const target = document.getElementsByClassName("scroll-target");
    //   const scrollDistance = window.scrollY + navLink.clientHeight;

    //   for (const el of target) {
    //     const react = el.getBoundingClientRect();

    //     if (window.scrollY + react.top <= scrollDistance + 1) {
    //       Array.from(link).forEach((linkEl) => {
    //         const activeLink = document.querySelector(
    //           `.scroll-link[href="#${el.id}"]`
    //         );
    //         linkEl.classList.remove("active");
    //         activeLink.classList.add("active");
    //       });
    //     }
    //   }
    // },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/_elearning-id.scss";
.preview-modal {
  .app-modal-content {
    max-height: calc(100vh - 100px);
    overflow-y: auto;
  }
}

// .elearning-id-box {
//   padding: 0;
// } 
</style>
