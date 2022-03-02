<template>
  <div class="container">
    <breadcrumb />
    <div class="row">
      <div class="col-md-3">
        <MenuSideMyTutor active="3" />
      </div>
      <div class="col-md-9">
        <sub-block-section
          title="Danh sách bài kiểm tra"
          has-icon
        >
          <template v-slot:content>
            <div class="elearning-manager-content p-0">
              <div class="elearning-manager-content__main py-2">
                <!--Filter form-->
                <filter-form
                  @submitFilter="submitFilter"
                  @changedType="handleChangedType"
                  @changedRate="handleChangedRate"
                  @submitSearch="handleSubmitSearch"
                />
                <list-table
                  :pagination="pagination"
                  :list="list"
                  :loading="loading"
                  @changedPagination="updatePagination"
                  @changedSort="handleChangedSort"
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
  import MenuSideMyTutor from "~/components/page/elearning/mytutor/MenuSideMyTutor";
  import HeadTabs from "~/components/page/elearning/HeadTab";
  import { mapState } from "vuex"
  import * as actionTypes from "~/utils/action-types"
  import { get } from "lodash"
  import { useEffect, getParamQuery, initBreadcrumb, createPageTitle, initPageTitle } from "~/utils/common"
  import FilterForm from "~/components/page/elearning/manager/exam/forms/TestFilter"
  import ListTable from "~/components/page/elearning/manager/exam/tables/Test"
  import { EXERCISE_CATEGORIES } from '~/utils/constants'
  
  const STORE_NAMESPACE = "elearning/teaching/exercise"
  
  export default {
    layout: "manage",
    
    components: {
      HeadTabs,
      MenuSideMyTutor,
      FilterForm,
      ListTable
    },
    middleware: ["teacher-role"],
    filters: {
    },
    data() {
      return {
        pagination: {
          total_elements: 0,
          last: false,
          total_pages: 1,
          size: 10,
          number: 0,
          first: true,
          number_of_elements: 0
        },
        params: {
          page: 1,
          size: 10,
          category: EXERCISE_CATEGORIES.TEST,
          elearning_id: null,
          sort_by: 'CREATED',
          sort_type: 'asc'
        },
        list: [],
        loading: false
      };
    },
    
    computed: {
      ...mapState("auth", ["loggedUser"]),
      ...mapState(STORE_NAMESPACE, {
        detailInfo: 'exercises'
      }),
    },
    
    methods: {
      updateFilter(val) {
        this.params = { ...this.params, ...val }
        this.refreshData()
      },
      handleChangedType(val) {
        this.updateFilter({ type: val })
      },
      handleChangedRate(val) {
        this.updateFilter({ rate: val })
      },
      handleSubmitSearch(val) {
        this.updateFilter({ query: val })
      },
      submitFilter(val) {
        this.updateFilter(val)
      },
      updatePagination(val) {
        this.params.size !== val.size ? this.params.page = 1 : this.params.page = val.number + 1
        this.params.size = val.size
        this.getList()
      },
      async getList() {
        try {
          this.loading = true
          this.params.elearning_id = getParamQuery('elearning_id')
          let params = { ...this.params }
          
          await this.$store.dispatch(
            `${STORE_NAMESPACE}/${actionTypes.ELEARNING_TEACHING_EXERCISE.LIST}`, { params }
          )
          this.list = this.get(this.detailInfo, 'data.content', [])
          this.pagination.size = this.get(this.detailInfo, 'data.page.size', 10)
          this.pagination.first = this.get(this.detailInfo, 'data.page.first', 1)
          this.pagination.last = this.get(this.detailInfo, 'data.page.last', 1)
          this.pagination.number = this.get(this.detailInfo, 'data.page.number', 0)
          this.pagination.total_pages = this.get(this.detailInfo, 'data.page.total_pages', 0)
          this.pagination.total_elements = this.get(this.detailInfo, 'data.page.total_elements', 0)
          this.pagination.number_of_elements = this.get(this.detailInfo, 'data.page.number_of_elements', 0)
          // this.pagination = { ...this.get(this.detailInfo, 'data.page', {}) }
        } catch (e) {
          console.log('Get list exercise ', e)
        } finally {
          this.loading = false
        }
      },
      handleChangedSort(val) {
        const sortBy = get(val, 'sortBy', 'created')
        const sortType = get(val, 'order', 'asc')
        switch (sortBy) {
          case 'created':
            this.updateFilter({
              sort_by: 'CREATED',
              sort_type: sortType
            })
            break;
          case 'participants':
            this.updateFilter({
              sort_by: 'PARTICIPANTS',
              sort_type: sortType
            })
            break;
        }
      },
      refreshData() {
        this.params.page = 1
        this.getList()
      },
      getParamQuery,
      get
    },
    
    created() {
      this.getList()
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