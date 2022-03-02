<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <MyCourseSide :active="4" />
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
                  @changedOption="handleChangedOption"
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
  import MyCourseSide from "~/components/page/elearning/mycourses/MyCourseSide"
  import { mapState } from "vuex"
  import * as actionTypes from "~/utils/action-types"
  import { get } from "lodash"
  import { useEffect, getParamQuery } from "~/utils/common"
  import FilterForm from "~/components/page/elearning/mycourses/forms/ExamFilter"
  import ListTable from "~/components/page/elearning/mycourses/tables/Exam"
  import { EXERCISE_CATEGORIES } from '~/utils/constants'
  
  const STORE_NAMESPACE = "elearning/study/study-exercise"
  
  export default {
    components: {
      MyCourseSide,
      FilterForm,
      ListTable
    },
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
        },
        list: [],
        loading: false
      };
    },
    
    computed: {
      ...mapState("auth", ["loggedUser"]),
      ...mapState(STORE_NAMESPACE, {
        detailInfo: 'elearningExercises'
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
        this.updateFilter({ status: val })
      },
      handleSubmitSearch(val) {
        this.updateFilter({ query: val })
      },
      handleChangedOption(val) {
        this.updateFilter({ required: val })
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
          this.params.elearning_id = this.$route.params.id
          let params = { ...this.params }
          
          await this.$store.dispatch(
            `${STORE_NAMESPACE}/${actionTypes.ELEARNING_STUDY_EXERCISE.LIST_ELEARNING_EXERCISE_2}`, this.params
          )
          this.list = this.get(this, 'detailInfo', [])
          this.pagination = { ...this.get(this.detailInfo, 'data.page', {}) }
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
      get
    },
    
    created() {
      this.getList()
    }
  };
</script>

<style lang="scss" scoped>
  @import "~/assets/scss/components/elearning/manager/_elearning-manager-content.scss";
</style>