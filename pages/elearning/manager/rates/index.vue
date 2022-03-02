<template>
  <div class="container">
    <breadcrumb />
    
    <div class="row">
      <div class="col-md-3">
        <ElearningManagerSide :group=2 :active=7 />
      </div>
      <div class="col-md-9">
        <sub-block-section
          title="Đánh giá và bình luận"
        >
          <template v-slot:content>
            <div class="elearning-manager-content p-0">
              <div class="elearning-manager-content__main py-2">
                <filter-form
                  @submitFilter="submitFilter"
                  @changedCmt="handleChangedCmt"
                  @changedRate="handleChangedRate"
                  @changedClass="handleChangedClass"
                  @changedElearning="handleChangedElearning"
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
  import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide"
  import FilterForm from "~/components/page/elearning/manager/ratecomment/forms/VoteFilter"
  import ListTable from "~/components/page/elearning/manager/ratecomment/tables/Vote"
  
  import {mapState} from "vuex"
  import { useEffect, getParamQuery, initBreadcrumb, createPageTitle, initPageTitle } from "~/utils/common"
  import * as actionTypes from "~/utils/action-types"
  import { get } from "lodash"

  const STORE_NAMESPACE = 'elearning/teaching/vote'

  export default {
    layout: "manage",
    components: {
      ElearningManagerSide,
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
          // elearning_id: "39fe1dd5-2df2-465f-8cf7-59d4ead68189"
          elearning_id: null
        },
        list: [],
        loading: false
      }
    },
    computed: {
      ...mapState("auth", ["loggedUser"]),
      ...mapState(STORE_NAMESPACE, {
        detailInfo: 'votes'
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
      handleChangedCmt(val) {
        this.updateFilter({ has_cmt: val })
      },
      handleChangedRate(val) {
        this.updateFilter({ rate: val })
      },
      handleChangedClass(val) {
        this.updateFilter({ class_id: val })
      },
      handleChangedElearning(val) {
        this.updateFilter({ elearning_id: val })
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
            `${STORE_NAMESPACE}/${actionTypes.ELEARNING_TEACHING_VOTE.LIST}`, { params }
          )
          this.list = this.get(this.detailInfo, 'data.content', [])
          // this.pagination = { ...this.get(this.detailInfo, 'page', {}) }
          this.pagination.size = this.get(this.detailInfo, 'data.size', 10)
          this.pagination.first = this.get(this.detailInfo, 'data.first', 1)
          this.pagination.last = this.get(this.detailInfo, 'data.last', 1)
          this.pagination.number = this.get(this.detailInfo, 'data.number', 0)
          this.pagination.total_pages = this.get(this.detailInfo, 'data.total_pages', 0)
          this.pagination.total_elements = this.get(this.detailInfo, 'data.total_elements', 0)
          this.pagination.number_of_elements = this.get(this.detailInfo, 'data.number_of_elements', 0)
        } catch (e) {
          console.log('Get votes ', e)
        } finally {
          this.loading = false
        }
      },
      refreshData() {
        this.params.page = 1
        this.getList()
      },
      setBreadcrumb() {
        const breadcrumb = [
          {
            title: 'Quản lý E-learning',
            to: '/elearning/manager'
          },
          {
            title: 'Đánh giá và bình luận',
            to: ''
          }
        ]
        initBreadcrumb(this, breadcrumb);
        initPageTitle(this, createPageTitle('Quản lý đánh giá và bình luận'));
      },
      get
    },
    created() {
      this.getList()
    },
    mounted() {
      this.setBreadcrumb()
    }

  }
</script>

<style lang="scss" scoped>
  @import "~/assets/scss/components/elearning/manager/_elearning-manager-content.scss";
</style>