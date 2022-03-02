<template>
  <div class="container">
    <breadcrumb />
    <div class="row">
      <div class="col-md-3">
        <ElearningManagerSide active="4" />
      </div>
      <div class="col-md-9">
        <sub-block-section
          title="Tạo kiểm tra"
        >
          <template v-slot:content>
            <div class="elearning-manager-content p-0">
              <div class="elearning-manager-content__main py-2">
                <AddExam
                  @addDone="handleDoneAddExam"
                  @cancel="cancelCreating"
                />
              </div>
            </div>
          </template>
        </sub-block-section>
      </div>
    </div>
  </div>
</template>

<script>
  import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
  import { mapState } from "vuex"
  import * as actionTypes from "~/utils/action-types"
  import { get } from "lodash"
  import { useEffect, getParamQuery, initBreadcrumb, createPageTitle, initPageTitle } from "~/utils/common"
  import AddExam from "~/components/page/course/create/exams/v2/AddExam";

  import { EXERCISE_CATEGORIES } from '~/utils/constants'
  const STORE_NAMESPACE = "elearning/teaching/exercise"
  
  export default {
    layout: "manage",
    
    components: {
      ElearningManagerSide,
      AddExam
    },
    filters: {
    },
    data() {
      return {
        loading: false
      };
    },
    
    computed: {
      
    },
    
    methods: {
      handleDoneAddExam(info) {
        this.$router.push(`/elearning/manager/exams/${info.id}/edit-test`)
      },
      cancelCreating() {
        this.$router.push("/elearning/manager/exams")
      },
      getParamQuery,
      get
    },
    
    created() {
    },
    mounted() {
      const breadcrumb = [
        {
          title: 'Quản lý E-learning',
          to: '/elearning'
        },
        {
          title: 'Bài tập và bài kiểm tra',
          to: '/elearning/manager/exams'
        },
      ]
      initBreadcrumb(this, breadcrumb);
      initPageTitle(this, createPageTitle('Quản lý bài tập & bài kiểm tra'));
    }
  };
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/manager/_elearning-manager-content.scss";
</style>