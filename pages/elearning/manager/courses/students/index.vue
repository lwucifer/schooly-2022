<template>
    <student-list />
</template>

<script>
import StudentList from "./student";
import { mapState } from "vuex";
import { get } from "lodash";
import { initBreadcrumb, createPageTitle, initPageTitle, getParamQuery } from "~/utils/common";

import * as actionTypes from "~/utils/action-types";
const STORE_NAMESPACE = "elearning/teaching/elearning-participant";
const STORE_TEACHING_REQUEST = "elearning/teaching/request";
const STORE_PUBLIC_CLASSES = "elearning/teaching/public-classes";
const STORE_STUDY_INFO = "elearning/study/study-info";

export default {
  layout: "manage",

  components: {
    StudentList
  },

   async fetch({ params, query, store, route }) {
    const elearningId = query.elearning_id;
    const dataProfile = await store.dispatch(
      `${STORE_PUBLIC_CLASSES}/${actionTypes.ACCOUNT_PROFILE.LIST}`
    );
    const dataOrgan =
      dataProfile && dataProfile.organization ? dataProfile.organization : {};
    const schoolId = dataOrgan && dataOrgan.id ? dataOrgan.id : "";
    const listQuery = {
      params: {
        elearning_id: elearningId
      }
    };

    await Promise.all([
      store.dispatch(`elearning/detail/getInfo`,
        listQuery
      ),
      store.dispatch(
        `${STORE_NAMESPACE}/${actionTypes.TEACHING_ELEARNING_PARTICIPANT.LIST}`,
        listQuery
      ),
      // store.dispatch(
      //   `${STORE_SCHOOL_CLASSES}/${actionTypes.SCHOOL_CLASSES.LIST}`
      // ),
      // store.dispatch(
      //   `${STORE_PUBLIC_CLASSES}/${actionTypes.PUBLIC_CLASSES.LIST}`,
      //   {
      //     params: {
      //       school_id: schoolId
      //     }
      //   }
      // )
    ]);
  },


  data() {
    return {};
  },
  
  computed: {
    ...mapState("elearning/detail", {
      elearningInfo: "info"
    }),
  },

  methods: {get},
  mounted() {
    const elearningId = getParamQuery('elearning_id')
    const elearningName = get(this, 'elearningInfo.name', '')
    const breadcrumb = [
      {
        title: 'Quản lý E-learning',
        to: '/elearning/manager'
      },
      {
        title: 'Bài giảng và khóa học',
        to: '/elearning/manager/courses'
      },
      // {
      //   title: `Danh sách học sinh - ${elearningName}`,
      //   to: `/elearning/manager/courses/students?elearning_id=${elearningId}`
      // },
    ]
    initBreadcrumb(this, breadcrumb);
    initPageTitle(this, createPageTitle('Quản lý bài tập và bài kiểm tra'));
  }
};
</script>

<style lang="scss" scoped>
</style>