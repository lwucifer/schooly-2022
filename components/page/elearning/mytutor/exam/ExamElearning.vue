<template>
  <!--List elearnings that have exam-->
  <div>
    <!--Filter form-->
    <!-- <elearning-manager-filter-form
      @submitFilter="submitFilter"
      @changedType="handleChangedType"
      @changedRate="handleChangedRate"
      @submitSearch="handleSubmitSearch"
    />
    <elearning-manager-filter-table
      :pagination="pagination"
      :list="list"
      :loading="loading"
      @changedPagination="updatePagination"
      @changedSort="handleChangedSort"
    /> -->
    <filter-form
      @submitFilter="submitFilter"
      @changedType="handleChangedType"
      @changedRate="handleChangedRate"
      @changedRequired="handleChangedRequired"
      @changedElearning="handleChangedElearning"
      @submitSearch="handleSubmitSearch"
    />
    <list-table
      :pagination="pagination"
      :list="list"
      :loading="loading"
      @deleteItem="handleDeleteItem"
      @changedPagination="updatePagination"
      @changedSort="handleChangedSort"
      @reload="$emit('reload')"
      @donePublish="handleDonePublish"
    />
    
    <app-modal-confirm
      centered
      v-if="isShowDelModal"
      title="Xác nhận xóa?"
      description="Bạn có chắc chắn muốn xóa bài tập."
      :confirmLoading="isDeletingItem"
      @ok="deleteItem"
      @cancel="isShowDelModal = false"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex"
import * as actionTypes from "~/utils/action-types"
import { get } from "lodash"
import FilterForm from "~/components/page/elearning/mytutor/exam/forms/TestFilter"
import ListTable from "~/components/page/elearning/mytutor/exam/tables/Test"
import { EXERCISE_CATEGORIES } from '~/utils/constants'

const STORE_NAMESPACE = "elearning/teaching/exercise"

export default {
  layout: "manage",
    
  components: {
    FilterForm,
    ListTable,
  },
  filters: {
  },
  data() {
    return {
      isShowDelModal: false,
      isDeletingItem: false,
      tmpItem: {},
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
        sort_by: 'CREATED',
        sort_type: 'desc',
        show_statistic: true,
        parent: 'elearning',
        parent_id: null,
        assign_group_id: this.groupIsSelecting ? this.currentGroupClsDetail.id : null,
        assign_class_id: this.classIsSelecting ? this.currentGroupClsDetail.id : null
      },
      list: [],
      loading: false
    };
  },
  watch: {
    currentGroupClsDetail(newVal, oldVal) {
      if (this.groupIsSelecting) {
        this.params.assign_group_id = get(newVal, 'id', null);
        this.updateFilter({
          assign_group_id: get(newVal, 'id', null),
          assign_class_id: null
        })
      } else if (this.classIsSelecting) {
        this.params.assign_class_id = get(newVal, 'id', null);
        this.updateFilter({
          assign_class_id: get(newVal, 'id', null),
          assign_group_id: null
        })
      } else {
        this.updateFilter({
          assign_group_id: null,
          assign_class_id: null
        })
      }
    }
  },
  computed: {
    ...mapState("auth", ["loggedUser"]),
    ...mapState(STORE_NAMESPACE, {
      detailInfo: 'exercises'
    }),
    ...mapGetters('elearning', {
      currentGroupClsDetail: 'currentGroupClsDetail',
    }),
    groupIsSelecting() {
      return this.currentGroupClsDetail && this.currentGroupClsDetail.type ?
        this.currentGroupClsDetail.type == 'GROUP' : false;
    },
    classIsSelecting() {
      return this.currentGroupClsDetail && this.currentGroupClsDetail.type ?
        this.currentGroupClsDetail.type == 'CLASS' : false;
    }
  },

  methods: {
    ...mapActions(STORE_NAMESPACE, {
      destroyItem: actionTypes.ELEARNING_TEACHING_EXERCISE.DELETE
    }),
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
    handleChangedRequired(val) {
      this.updateFilter({ required: val })
      // console.log('change required: ', val)
    },
    handleChangedElearning(val) {
      this.updateFilter({ elearning_id: val });
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
        console.log('Get list test ', e)
      } finally {
        this.loading = false
      }
    },
    initParams() {
      this.params.assign_group_id = this.groupIsSelecting ? get(this, 'currentGroupClsDetail.id', '') : null;
      this.params.assign_class_id = this.classIsSelecting ? get(this, 'currentGroupClsDetail.id', '') : null;
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
    handleDeleteItem(item) {
      this.tmpItem = item;
      this.isShowDelModal = true;
    },
    async deleteItem() {
      try {
        this.isDeletingItem = true;
        const delId = this.tmpItem.id
        const payload = {
          ids: [delId]
        };
        const res = await this.destroyItem(payload);
        if (get(res, 'success', false)) {
          await this.refreshData();
          this.$toasted.success("Xóa bài kiểm tra thành công.");
        } else {
          this.$toasted.error(get(res, 'message', 'Xóa bài kiểm tra không thành công.'))
        }
      } catch (error) {
        console.log('error delete: ', error);
        this.$toasted.error("Xóa bài kiểm tra không thành công.");
      } finally {
        this.isShowDelModal = false;
        this.isDeletingItem = false;
      }
    },
    handleDonePublish() {
      this.getList();
    },
    get
  },

  created() {
    this.initParams();
    this.getList();
  }
};
</script>

<style lang="scss">
</style>