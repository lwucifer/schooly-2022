<template>
  <div class="container">
    <breadcrumb />
    <div class="row">
      <div class="col-md-3">
        <ElearningManagerSide :group=2 :active=5 />
      </div>
      <div class="col-md-9">
        <sub-block-section
          title="Kho học liệu"
        >
          <template v-slot:content>
            <div class="elearning-manager-content p-0">
              <div class="elearning-manager-content__main py-2">
                <ElearningManagerUploadFile
                  :on-success="handleDoneAddFile"
                  :max-capacity="get(capacityInfo, 'data.max_repository_capacity', 0)"
                  :used-capacity="get(capacityInfo, 'data.used_repository_capacity', 0)"
                />
                <ElearningManagerFilterTable
                  :list.sync="list"
                  :pagination="pagination"
                  :loading="loading"
                  @submitFilter="submitFilter"
                  @changedPagination="updatePagination"
                  @changedType="handleChangedType"
                  @changedStatus="handleChangedStatus"
                  @submitSearch="handleSubmitSearch"
                  @deletedItems="deleteItems"
                  @changedSort="handleChangedSort"
                  @showupload="modalUpload =true"
                  ref="warehouseTable"
                />
              </div>
            </div>
          </template>
        </sub-block-section>
      </div>
    </div>
    <app-modal-notify
      v-if="modal.notify"
      :type="modal.type"
      :title="modal.title"
      :description="modal.description"
      @ok="modal.notify = false"
      @close="modal.notify = false"
      centered
    >
    </app-modal-notify>
    <!-- <ModalUploadFile 
      v-if="modalUpload"
      @close="modalUpload =false"
      :on-success="handleDoneAddFile"
      :max-capacity="get(capacityInfo, 'data.max_repository_capacity', 0)"
      :used-capacity="get(capacityInfo, 'data.used_repository_capacity', 0)"
    /> -->
  </div>
</template>

<script>
  import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide"
  import ElearningManagerUploadFile from "~/components/page/elearning/manager/materials/ElearningManagerUploadFile"
  import ElearningManagerFilterTable from "~/components/page/elearning/manager/materials/ElearningManagerFilterTable"
   import ModalUploadFile from "~/components/page/elearning/manager/materials/ModalUploadFile"

  import * as actionTypes from "~/utils/action-types"
  import { mapState } from "vuex"
  import { get } from "lodash";
  import { useEffect, initBreadcrumb, createPageTitle, initPageTitle} from "~/utils/common"

  const STORE_NAMESPACE = 'elearning/teaching/repository-files'
  const REPOSITORY_STORE_NAMESPACE = 'elearning/teaching/repository'

  export default {
    layout: "manage",
    
    components: {
      ElearningManagerSide,
      ElearningManagerUploadFile,
      ElearningManagerFilterTable,
      ModalUploadFile
    },
    // middleware: ["teacher-role"],
    data() {
      return {
        pagination: {
          total_elements: 0,
          total_pages: 1,
          number_of_elements: 0,
          last: false,
          size: 10,
          number: 0,
          first: true,
        },
        params: {
          page: 1,
          size: 10,
          sort: 'NEWEST'
        },
        list: [],
        loading: false,
        modal: {
          notify: false,
          type: 'success',
          title: '',
          description: ''
        },
        modalUpload:false
      }
    },
    computed: {
      ...mapState("auth", ["loggedUser"]),
      ...mapState(STORE_NAMESPACE, {
        detailInfo: 'files'
      }),
      ...mapState(REPOSITORY_STORE_NAMESPACE, {
        capacityInfo: 'info'
      }),
    },
    methods: {
      handleUploadChange(fileList, event) {
      },
      async handleDoneAddFile(data) {
        if (get(data, "success", false)) {
          this.params.sort = 'NEWEST'
          await this.refreshData()
          return;
        }
        this.$toasted.error(get(data, "message", ""));
      },
      async getList() {
        try {
          this.loading = true
          let params = {...this.params}
          await this.$store.dispatch(
            `${STORE_NAMESPACE}/${actionTypes.ELEARNING_TEACHING_REPOSITORY_FILE.LIST}`, {params}
          )
          this.$refs['warehouseTable'].resetSelectedItems()
          this.list = this.get(this.detailInfo, 'data.content', [])
          this.pagination.size = this.get(this.detailInfo, 'data.page.size', 10)
          this.pagination.first = this.get(this.detailInfo, 'data.page.first', 1)
          this.pagination.last = this.get(this.detailInfo, 'data.page.last', 1)
          this.pagination.number = this.get(this.detailInfo, 'data.page.number', 0)
          this.pagination.total_pages = this.get(this.detailInfo, 'data.page.total_pages', 0)
          this.pagination.total_elements = this.get(this.detailInfo, 'data.page.total_elements', 0)
          this.pagination.number_of_elements = this.get(this.detailInfo, 'data.page.number_of_elements', 0)
          // this.pagination = {...this.get(this.detailInfo, 'data.page', {})}
        } catch (e) {

        } finally {
          this.loading = false
        }

      },
      async getInfoCapacity() {
        try {
          await this.$store.dispatch(
            `${REPOSITORY_STORE_NAMESPACE}/${actionTypes.ELEARNING_TEACHING_REPOSITORY.INFO}`, {}
          )
        } catch (e) {
        } finally {
        }
      },
      updateFilter(val) {
        this.params = { ...this.params, ...val }
        this.refreshData()
      },
      handleChangedType(val) {
        this.updateFilter({ type: val })
      },
      handleChangedStatus(val) {
        this.updateFilter({ used: val })
      },
      handleSubmitSearch(val) {
        this.updateFilter({ name: val })
      },
      handleChangedSort(val) {
        if (val.sortBy == 'created_at') {
          if (val.order == 'asc') {
            this.updateFilter({ sort: 'OLDEST' })
          } else {
            this.updateFilter({ sort: 'NEWEST' })
          }
        }
      },
      submitFilter(val) {
        this.updateFilter(val)
      },
      updatePagination(val) {
        this.params.size !== val.size ? this.params.page = 1 : this.params.page = val.number + 1
        this.params.size = val.size
        this.getList()
      },
      async deleteItems(data) {
        if (get(data, "success", false)) {
          await this.refreshData()
          this.modal.type = 'success'
          this.modal.title = 'Xóa tài liệu thành công'
        } else {
          this.modal.type = 'error'
          this.modal.title = 'Xóa tài liệu không thành công. Vui lòng thử lại'
        }
        this.modal.notify = true
      },
      refreshData() {
        this.params.page = 1
        this.getList()
        this.getInfoCapacity()
      },
      get
    },
    created() {
      this.getList()
      this.getInfoCapacity()
      // useEffect(this, this.getList.bind(this), [
      //   "params.page",
      //   "params.size",
      //   "params.type",
      //   "params.used",
      //   "params.query",
      // ])
    },
    mounted() {
      const breadcrumb = [
        {
          title: 'Quản lý E-learning',
          to: '/elearning/manager'
        },
        {
          title: 'Kho học liệu',
          to: ''
        },
      ]
      initBreadcrumb(this, breadcrumb);
      initPageTitle(this, createPageTitle('Quản lý kho học liệu'));
    }
  }
</script>

<style lang="scss">
  @import "~/assets/scss/components/elearning/manager/_elearning-manager-content.scss";
  @import "~/assets/scss/components/elearning/manager/_elearning-material.scss";
</style>