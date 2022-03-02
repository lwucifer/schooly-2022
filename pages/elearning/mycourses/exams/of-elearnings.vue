<template>
  <div class="container">
    
    <div class="row">
      <div class="col-md-3">
        <MyCourseSide :active="4"/>
      </div>
      <div class="col-md-9">
        <sub-block-section
          title="Danh sách bài giảng và khóa học có bài kiểm tra"
        >
          <template v-slot:content>
            <div class="elearning-manager-content p-0">
              <div class="elearning-manager-content__main py-2">
                <filter-form
                  @submitFilter="submitFilter"
                  @changedType="handleChangedType"
                  @submitSearch="handleSubmitSearch"
                >
                </filter-form>
                
                <list-table
                  :pagination="pagination"
                  :list.sync="list"
                  :loading="loading"
                  @changedPagination="updatePagination"
                  @changedSort="handleChangedSort"
                >
                </list-table>
              </div>
            </div>
          </template>
        </sub-block-section>
      </div>
    </div>
  </div>
</template>

<script>
  import ListTable from "~/components/page/elearning/mycourses/tables/ExamElearning"
  import MyCourseSide from "~/components/page/elearning/mycourses/MyCourseSide"
  import FilterForm from "~/components/page/elearning/mycourses/forms/ExamElearningFilter"
  import { EXERCISE_CATEGORIES } from '~/utils/constants'

  import {mapState} from "vuex"
  import { useEffect, getParamQuery } from "~/utils/common"
  import * as actionTypes from "~/utils/action-types"
  import { get } from "lodash"
  
  const STORE_NAMESPACE = 'elearning/study/study-exercise-elearning'
  
  export default {
    components: {
      MyCourseSide,
      FilterForm,
      ListTable
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
        },
        list: [],
        loading: false
      }
    },
    computed: {
      ...mapState(STORE_NAMESPACE, {
        detailInfo: 'exerciseElearnings'
      }),
    },
    methods: {
      updateFilter(val) {
        this.params = { ...this.params, ...val }
        this.refreshData()
      },
      submitFilter(val) {
        this.updateFilter(val)
      },
      handleChangedType(val) {
        this.updateFilter({ type: val })
      },
      handleChangedSort(val) {
        if (val.sortBy == 'created_at') {
          if (val.order == 'asc') {
            this.updateFilter({ sort: 1 })
          } else {
            this.updateFilter({ sort: 0 })
          }
        }
      },
      handleSubmitSearch(val) {
        this.updateFilter({ keyword: val })
      },
      updatePagination(val) {
        this.params.size !== val.size ? this.params.page = 1 : this.params.page = val.number + 1
        this.params.size = val.size
        this.getList()
      },
      async getList() {
        try {
          this.loading = true
          let params = { ...this.params }
          
          await this.$store.dispatch(
            `${STORE_NAMESPACE}/${actionTypes.ELEARNING_STUDY_EXERCISE_ELEARNING.LIST}`, { params }
          )
          this.list = this.get(this.detailInfo, 'content', [])
          this.pagination.size = this.get(this.detailInfo, 'size', 10)
          this.pagination.first = this.get(this.detailInfo, 'first', 1)
          this.pagination.last = this.get(this.detailInfo, 'last', 1)
          this.pagination.number = this.get(this.detailInfo, 'number', 0)
          this.pagination.total_pages = this.get(this.detailInfo, 'total_pages', 0)
          this.pagination.total_elements = this.get(this.detailInfo, 'total_elements', 0)
          this.pagination.number_of_elements = this.get(this.detailInfo, 'number_of_elements', 0)
          // this.pagination = { ...this.get(this.detailInfo, 'page', {}) }
        } catch (e) {
        } finally {
          this.loading = false
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
  }
</script>

<style lang="scss" scoped>
  @import "~/assets/scss/components/elearning/manager/_elearning-manager-content.scss";
</style>