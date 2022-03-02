<template>
  <div class="container teacher-profile">
    <div v-if="pageLoading" class="teacher-profile__overview mb-3">
      <div class="bg-white px-3"><VclFacebook :height="100"/></div>
    </div>

    <div v-else class="teacher-profile__overview">
      <ProfileTeacherHead :info="teacher"/>
      <app-divider class="my-4"/>
      <div class="">
        <p class="mb-3"><span class="h5">Thông tin giáo viên</span></p>
        <div>
          <div v-if="description" v-html="description" class="dont-break-out teacher-story"></div>
          <div v-else class="text-center caption text-gray-2">Chưa có nội dung.</div>

          <div class="text-center mt-3" v-if="load_more">
            <a @click="handleLoadMore" class="btn-load-more">Xem thêm</a>
          </div>

          <div class="text-center mt-3" v-if="hide_description">
            <a @click="handleCompact" class="btn-load-more">Rút gọn</a>
          </div>
        </div>
      </div>
    </div>

    <!--slide-->
    <div v-if="pageLoading || elearningLoading" class="container">
      <div class="row">
        <div v-for="i in 12" :key="i" class="col-md-3 mb-6">
          <div class="bg-white py-6 px-3">
            <VclList/>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="mb-3">
        <h5>Bài giảng và khóa học ({{ totalElearnings }})</h5>
      </div>
      <div class="row">
        <div
          class="col-md-3 teacher-elearnings"
          v-for="(item, index) in list"
          :key="index"
        >
          <CourseItem2 class="my-0" :item="item" :size="'sm'" />
        </div>
      </div>
      <app-pagination
          :pagination="pagination"
          @pagechange="onPageChange"
          class="mt-3"
        />
    </div>
    
    <!-- <ProfileSliderTab
      :items="get(elearnings, 'content', [])"
      :name="`Bài học và khóa giảng (${get(elearnings, 'page.total_elements', 0)})`"
    /> -->
  </div>
</template>

<script>
  import ProfileTeacherHead from "~/components/page/profile/teacher/ProfileTeacherHead";
  import ProfileSliderTab from "~/components/page/profile/ProfileSliderTab";
  import CourseItem2 from "~/components/page/course/CourseItem2";
  import {VclFacebook, VclList} from "vue-content-loading";
  import {mapState} from "vuex";
  import * as actionTypes from "~/utils/action-types";
  import {get} from "lodash"
  import {
    PAGE_SIZE,
    SORT_ELEARNING
  } from "~/utils/constants"
import { getParamQuery } from '~/utils/common';

  export default {
    // layout:"backhome",
    data() {
      return {
        pageLoading: true,
        elearningLoading: false,
        lengthDescription: 300,
        totalElearnings: 0,
        list: [],
        pagination: {
          first: true,
          last: false,
          number: 0,
          number_of_elements: 0,
          size: 10,
          total_elements: 0,
          total_pages: 0
        },
        payload: {
          page: 1,
          size: PAGE_SIZE.ELEARNING_12,
          teacher_id: null,
          // sort: this.$route.query.sort
            // ? this.$route.query.sort
            // : null,
          // keyword: null,
          // hidden: false
        },
      }
    },
    async fetch({params, query, store}) {
      const userId = query.user_id
      const getProfile = () =>
        store.dispatch(
          `elearning/public/public-elearning-teacher/${actionTypes.ELEARNING_PUBLIC_ELEARNING_TEACHER.LIST}`,
          {
            params: {
              teacher_id: userId
            }
          }
        );

      // const getElearnings = () =>
      //   store.dispatch(
      //     `elearning/public/public-teacher-els/${actionTypes.ELEARNING_PUBLIC_TEACHER_ELS.LIST}`,
      //     {
      //       params: {
      //         teacher_id: userId,
      //         size: PAGE_SIZE.ELEARNING_12,
      //         page: 1
      //       }
      //     }
      //   );

      return await Promise.all([
        getProfile(),
        // getElearnings()
      ])
    },
    components: {
      ProfileTeacherHead,
      ProfileSliderTab,
      CourseItem2,
      VclFacebook,
      VclList
    },
    computed: {
      ...mapState("elearning/public/public-elearning-teacher", ["teacher"]),
      ...mapState("elearning/public/public-teacher-els", ["elearnings"]),
      description() {
        let string = get(this, "teacher.biography", "").substring(
          0,
          this.lengthDescription
        );
        if (this.load_more) string += "...";
        return string;
      },
      load_more() {
        return get(this, "teacher.biography.length", 0) > this.lengthDescription;
      },
      hide_description() {
        return (
          this.lengthDescription == get(this, "teacher.biography.length", 0) &&
          get(this, "teacher.biography.length", 0) > 300
        );
      },
    },
    methods: {
      handleLoadMore() {
        this.lengthDescription = get(this, "teacher.biography.length", 0);
      },
      handleCompact() {
        this.lengthDescription = 300;
      },
      async getElearnings() {
        try {
          this.elearningLoading = true
          const userId = getParamQuery('user_id')
          this.payload.teacher_id = userId
          const res = await this.$store.dispatch(
            `elearning/public/public-teacher-els/${actionTypes.ELEARNING_PUBLIC_TEACHER_ELS.LIST}`, { params: this.payload }
          );
          this.totalElearnings = get(res, 'data.page.total_elements', 0)
          this.list = get(res, "data.content", [])
          this.pagination = {
            total_pages: get(res, "data.page.total_pages", 0),
            size: get(res, "data.page.size", 10),
            total_elements: get(res, "data.page.total_elements", 0),
            first: get(res, "data.page.first", false),
            last: get(res, "data.page.last", false),
            number: get(res, "data.page.number", 0)
          }
        } catch(error) {

        } finally {
          this.elearningLoading = false
        }
      },
      onPageChange(e) {
        this.payload.page = e.number + 1;
        this.payload.size = PAGE_SIZE.ELEARNING_12;

        this.getElearnings();
      },
      get
    },
    mounted() {
      this.pageLoading = false;
    },
    async created() {
      await this.getElearnings()
    }
  }
</script>

<style lang="scss">
  @import "~/assets/scss/components/profile/_profile-teacher.scss";
</style>
