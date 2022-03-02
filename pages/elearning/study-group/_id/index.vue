<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <ElearningManagerSide :group="12" :active="12" />
      </div>
      <div class="col-md-9">
        <sub-block-section :title="nameGroup" has-icon>
          <template v-slot:content>
            <div class="group-students">
              <div class="d-flex">
                <div class="group-students__wrap-search">
                  <app-search
                    placeholder="Nhập để tìm kiếm"
                    bordered
                    class="w-100"
                    color="primary"
                    @input="handleChangeKeyword"
                  ></app-search>
                </div>
                <filter-button
                  @click="clickFilterSubmit"
                  size="lg"
                  class="btn-filter"
                  :color="filterSelect ? 'primary' : 'white'"
                ></filter-button>
                <app-select
                  v-if="filterSelect"
                  :options="classList"
                  placeholder="Lớp"
                  class="select-class"
                  @change="handleChangeClass"
                />
                <app-button class="ml-auto" @click="showModalAddStudent">
                  <IconAdd24px height="16" />
                  Thêm mới học sinh
                </app-button>
              </div>
              <div>
                <app-button
                  color="secondary"
                  class="mt-5"
                  :disabled="!canDeleteMember"
                  @click="modalConfirmDelete = true"
                >
                  <IconDelete24px height="16" />
                  Xóa
                </app-button>
              </div>
              <div class="mt-5">
                <vcl-table v-if="loading" />
                <app-table
                  v-else
                  multiple-selection
                  :heads="heads"
                  :pagination="get(memberGroups, 'page', {})"
                  :data="get(memberGroups, 'content', [])"
                  @selectionChange="selectRow"
                  @pagechange="onPageChange"
                  primaryKey="user_id"
                >
                  <template slot="cell(joined)" slot-scope="{ row }">
                    <td>
                      {{ row.joined}}
                    </td>
                  </template>
                  <template slot="cell(student)" slot-scope="{ row }">
                    <td>
                      {{ get(row,"student",get(row,"name",''))}}
                    </td>
                  </template>
                </app-table>
              </div>
            </div>
          </template>
        </sub-block-section>
      </div>
      <ModalAddStudent
        v-if="showModal"
        @close="closeModal"
        :group_id="payload.group_id"
        @search="handleSearch"
      />

      <app-modal-confirm
        v-if="modalConfirmDelete"
        okText="Xác nhận"
        title="Bạn chắc chắn muốn xoá học sinh này?"
        :confirmLoading="loadingDel"
        @cancel="modalConfirmDelete = false"
        @ok="handleDeleteGroupMember"
      ></app-modal-confirm>
    </div>
  </div>
</template>

<script>
import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
import ModalAddStudent from "~/components/page/elearning/Students/ModalAddStudents";
import IconAdd24px from "~/assets/svg/v2-icons/add_24px.svg?inline";
import IconDelete24px from "~/assets/svg/v2-icons/delete_24px.svg?inline";

import * as actionTypes from "~/utils/action-types";
import { RESPONSE_SUCCESS } from "~/utils/config";
import { mapState, mapActions } from "vuex";
import { get } from "lodash";
import { VclTable } from "vue-content-loading";
import { allOptionSelect } from "~/utils/common";

export default {
  components: {
    ElearningManagerSide,
    ModalAddStudent,
    IconAdd24px,
    IconDelete24px,
    VclTable
  },
  data() {
    return {
      showModal: false,
      filterSelect: false,
      loading: false,
      selectedStudentIds: [],
      payload: {
        keyword: "",
        group_id: null,
        class_id: "",
        page: 1,
        size: 10
      },
      heads: [
        {
          name: "",
          text: "",
          selectAll: true
        },
        {
          name: "student",
          text: "Họ và tên",
          sort: false
        },
        {
          name: "email",
          text: "Email",
          sort: false
        },
        {
          name: "phone",
          text: "Số điện thoại",
          sort: false
        },
        {
          name: "class_name",
          text: "Lớp",
          sort: false
        },
        {
          name: "joined",
          text: "Ngày tham gia",
          sort: false
        }
      ],
      loadingDel: false,
      modalConfirmDelete: false,
    };
  },

  asyncData({ params }) {
    return {
      payload: {
        group_id: params.id
      }
    };
  },

  computed: {
    ...mapState("elearning/study-group/member", ["memberGroups"]),
    ...mapState("auth", {
      userLogin: "token"
    }),

    ...mapState("elearning/study-group/group", [
      "classes",
      "students",
      "participants",
      "detailGroup"
    ]),

    canDeleteMember() {
      return this.selectedStudentIds && this.selectedStudentIds.length > 0;
    },

    classList() {
      console.log("[classList]", this.classes);
      return !this.classes
        ? []
        : allOptionSelect(
            this.classes.map(item => {
              return {
                value: item.id,
                text: item.name
              };
            }),
            "lớp"
          );
    },

    allSelected: {
      set(value) {
        return value;
      },
      get() {
        return this.students && isEqual(this.selectedItems, this.students);
      }
    },
    nameGroup(){
      return this.detailGroup ? this.detailGroup.name : '';
    }
  },

  async created() {
    this.handleSearch();

    const params = {
      school_id: get(this, "userLogin.organization.id", "")
    };
    this.$store.dispatch("elearning/study-group/group/getClasses", params);
    this.$store.dispatch("elearning/study-group/group/getDetailGroup",this.$route.params.id)
  },

  methods: {
    ...mapActions("elearning/study-group/member", [
      "getListStudyGroupMember",
      "deleteStudyGroupMember"
    ]),

    async handleDeleteGroupMember() {
      console.log("[handleDeleteGroupMember]", this.selectedStudentIds);
      this.loadingDel = true;
      const payload = {
        group_id: this.payload.group_id,
        user_ids: this.selectedStudentIds
      };
      const result = await this.deleteStudyGroupMember(payload);
      if (result.success == RESPONSE_SUCCESS) {
        this.selectedStudentIds = [];
        this.handleSearch();
      } else {
        this.$toasted.error("Xoá thành viên trong nhóm thất bại");
      }
      this.loadingDel = false;
      this.modalConfirmDelete = false;
    },

    handleChangeClass(data) {
      console.log("[handleChangeClass]", data);
      this.payload.class_id = data;

      this.handleSearch();
    },

    async handleSearch() {
      this.loading = true;
      await this.getListStudyGroupMember(this.payload);
      this.loading = false;
    },

    handleChangeKeyword(data) {
      console.log("[handleChangeKeyword]", data);
      this.payload.keyword = data;
      this.handleSearch();
    },

    async onPageChange(e) {
      console.log("[onPageChange]", e);
      const { number, size } = e;
      this.payload.page = +number + 1;
      this.payload.size = +size;

      this.handleSearch();
    },

    clickFilterSubmit() {
      this.filterSelect = !this.filterSelect;
      if (!this.filterSelect) {
        // reset search result
        this.payload = {
          ...this.payload,
          ...{
            class_id: "",
            page: 1,
            size: 10
          }
        };

        this.handleSearch();
      }
    },
    closeModal(invite) {
      this.showModal = invite;
    },
    showModalAddStudent() {
      this.showModal = true;
    },
    selectRow(row) {
      this.selectedStudentIds = _.map(row, "user_id");
      console.log("[selectRow]", this.selectedStudentIds);
    },
    get
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/students/_group-study-detail.scss";
</style>
