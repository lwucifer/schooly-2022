<template>
  <div>
    <elearning-manager-filter-form
      @changedFilter="updateFilter"
      @submitFilter="submitFilter"
      @changedType="handleChangedType"
      @changedQuery="handleChangedSearch"
      @changedStatus="handleChangedStatus"
      @submitSearch="handleSubmitSearch"
      class="px-0"
      @showupload="$emit('showupload')"
    />
    <div class="mb-4" v-if="additionalActions.delete">
      <v-popover
        :disabled="additionalActions.delete"
        trigger="hover"
        placement="top"
        offset="5"
      >
        <app-button
          size="sm"
          normal
          :disabled="!additionalActions.delete"
          :color="additionalActions.delete ? 'pink' : 'disabled'"
          @click="handleDelete"
        >
          <IconTrashAlt style="fill: #fff; height: 16px;"/>
          <span style="color: #FBFBFB;">Xóa tài liệu</span>
        </app-button>

        <template slot="popover">
          <span>Bạn vui lòng chọn tài liệu cần xóa</span>
        </template>
      </v-popover>
      
    </div>

    <app-table
      :heads="heads"
      :pagination="pagination"
      :data.sync="list"
      :loading="loading"
      multiple-selection
      @pagechange="onPageChange"
      @selectionChange="selectRow"
      @sort="sortTable"
      order="asc"
      ref="warehouseListTable"
    >
      <template v-slot:cell(name)="{row}">
        <td :title="get(row, 'name', '')">
          {{ get(row, 'name', '' ) | truncStrFilter(40) }}
        </td>
      </template>
      
      <template v-slot:cell(status)="{row}">
        <td>
          <span class="nowrap">{{ get(row, 'used', false ) | statusFilter }}</span>
        </td>
      </template>
      <template v-slot:cell(size)="{row}">
        <td>
          {{ get(row, 'size', 0 ) }} MB
        </td>
      </template>
      <template v-slot:cell(created_at)="{row}">
        <td>
          {{ get(row, 'created_at', '-') | moment("DD/MM/YYYY") }}
        </td>
      </template>
    </app-table>

    <app-modal-confirm
      v-if="visible.delete"
      @cancel="cancelDel"
      @ok="confirmDel"
      title="Bạn chắc chắn muốn xóa tài liệu?"
      description="Tài liệu bị xóa sẽ không thể khôi phục"
      ok-text="Đồng ý"
      :confirm-loading="confirmLoading"
      centered
    >
    </app-modal-confirm>
    
    <app-modal-notify
      v-if="visible.canDelete"
      type="warning"
      title="Không thể xóa file này!"
      description="Bạn không thể xóa tài liệu đang được sử dụng."
      @ok="visible.canDelete = false"
      @close="visible.canDelete = false"
      centered
    >
      <template v-slot:icon>
      
      </template>
    </app-modal-notify>
  </div>
</template>

<script>
  import IconTrashAlt from "~/assets/svg/design-icons/trash-alt.svg?inline"
  import ElearningManagerFilterForm from "./ElearningManagerFilterForm";

  import {mapState} from "vuex"
  import { get } from "lodash"
  import * as actionTypes from "~/utils/action-types"

  const STORE_NAMESPACE = 'elearning/teaching/repository-files'

  export default {
    components: {
      IconTrashAlt,
      ElearningManagerFilterForm
    },

    props: {
      list: {
        type: Array,
        default: () => []
      },
      pagination: {
        type: Object,
        default: () => {
          return {
            total: 0,
            size: 10,
            page: 1,
            total_elements: 0,
            first: 1,
            last: 1,
            number: 0
          }
        }
      },
      loading: {
        type: Boolean,
        default: false
      }
    },

    filters: {
      statusFilter: function(val) {
        return val ? 'Đã sử dụng' : 'Chưa sử dụng'
      }
    },

    data() {
      return {
        heads: [
          {
            name: "name",
            text: "Tên file",
          },
          {
            name: "type",
            text: "Loại",
          },
          {
            name: "status",
            text: "Trạng thái",
          },
          {
            name: "size",
            text: "Dung lượng",
          },
          {
            name: "created_at",
            text: "Ngày tải lên",
            sort: true
          },
        ],
        selectedItems: [],
        visible: {
          delete: false,
          canDelete: false
        },
        confirmLoading: false
      }
    },

    computed: {
      ...mapState("auth", ["loggedUser"]),
      additionalActions: function() {
        let data = {
          delete: this.selectedItems.length > 0
        }
        return data
      },
      updating: function () {
        return this.loading
      }
    },
    methods: {
      onPageChange(e) {
        this.resetData()
        this.$emit('changedPagination', e)
      },
      selectRow(data) {
        this.selectedItems = data
      },
      handleChangedSearch(val) {
        this.$emit('changedQuery', val)
      },
      handleChangedType(val) {
        this.$emit('changedType', val)
      },
      handleChangedStatus(val) {
        this.$emit('changedStatus', val)
      },
      handleSubmitSearch(val) {
        this.$emit('submitSearch', val)
      },
      updateFilter(val) {
        this.$emit('changedFilter', val)
      },
      submitFilter(val) {
        this.$emit('submitFilter', val)
      },
      sortTable(data) {
        this.$emit('changedSort', data)
      },
      async deleteItems(items) {
        const delIds = _.map(items, 'id')
        let data = {
          ids: delIds
        }
        const res = await this.$store.dispatch(
          `${STORE_NAMESPACE}/${actionTypes.ELEARNING_TEACHING_REPOSITORY_FILE.DELETE}`, { ids: delIds }
        )
        return res
      },
      async confirmDel() {
        try {
          this.confirmLoading = true
          const res = await this.deleteItems(this.selectedItems)
          this.visible.delete = false
          if (get(res, "success", false)) {
            this.resetSelectedItems()
            this.$emit('deletedItems', res)
            this.selectedItems = []
          }
        } catch (e) {
        
        } finally {
          this.confirmLoading = false
        }
      },
      cancelDel() {
        this.visible.delete = false
      },
      resetData() {
        this.selectedItems = []
      },
      handleDelete() {
        if (this.selectedItems.some(item => item.used == true)) {
          this.visible.canDelete = true
        } else {
          this.visible.delete = true
        }
      },
      resetSelectedItems() {
        this.$refs['warehouseListTable']['selectedItems'] = []
      },
      get
    },
  }
</script>

<style lang="scss">
</style>