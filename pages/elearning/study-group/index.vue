<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <ElearningManagerSide :active="12" :group="4" />
      </div>
      <div class="col-md-9">
        <sub-block-section title="Nhóm học tập">
          <template v-slot:content>
            <div class="elearning-student-content">
              <div class="d-flex mb-4">
                <app-button
                  color="secondary"
                  size="md"
                  :disabled="!canDeleteMember"
                  @click="modalConfirmDelete = true"
                >
                  <IconDelete24px height="16" />Xóa
                </app-button>
                <ModalAddGroup />
              </div>
              <div v-if="loading">
                <vcl-table />
              </div>
              <div v-else>
                <app-table
                  multiple-selection
                  :heads="heads"
                  :pagination="get(groups, 'page', {})"
                  :data="get(groups, 'content', [])"
                  @selectionChange="selectRow"
                  @pagechange="onPageChange"
                >
                  <template slot="cell(created_at)" slot-scope="{ row }">
                    <td>{{ row.created_at | getDateBirthDay }}</td>
                  </template>
                  <template slot="cell(name)" slot-scope="{ row }">
                    <td style="width:50%">{{ row.name }}</td>
                  </template>
                  <template slot="cell(members)" slot-scope="{ row }">
                    <td>
                      <div class="ml-5">{{ row.members }}</div>
                    </td>
                  </template>
                  <template slot="cell(action)" slot-scope="{ row }">
                    <td>
                      <div class="action">
                        <div class="tool">
                          <IconSettings24px class="fill-primary" />
                          <IconArrowDropDown24px class="fill-primary" height="16" />
                        </div>
                        <div class="drop-tools">
                          <div>
                            <!-- <button @click="handleShowView(row.id)">
                              <IconEye class="fill-primary" />Xem chi tiết
                            </button> -->
                            <button @click="gotoStudent(row.id)">
                              <IconPeople class="fill-warning" />D/S học sinh
                            </button>
                            <button @click="handleShowEdit(row.id)">
                              <IconEdit class="fill-blue" />Chỉnh sửa
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </template>
                </app-table>

                <!-- -->
                <ModalEdit v-if="showModalEdit" @close="showModalEdit = false" />
                <!-- <ModalDetail
                  v-if="showModalView"
                  @close="showModalView = false"
                  :loadingElearning="loadingElearningView"
                  :loadingExam="loadingExamView"
                  @searchElearning="handleSearchElearning"
                  @searchExam="handleSearchExams"
                /> -->
              </div>
            </div>
          </template>
        </sub-block-section>
      </div>
    </div>

    <app-modal-confirm
      v-if="modalConfirmDelete"
      okText="Xác nhận"
      title="Bạn chắc chắn muốn xoá nhóm học tập?"
      :confirmLoading="loadingDel"
      @cancel="modalConfirmDelete = false"
      @ok="handleDeleteGroup"
    ></app-modal-confirm>
  </div>
</template>

<script>
import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
import IconDelete24px from "~/assets/svg/v2-icons/delete_24px.svg?inline";
import IconAdd24px from "~/assets/svg/v2-icons/add_24px.svg?inline";
import IconCreate24px from "~/assets/svg/v2-icons/create_24px.svg?inline";
import IconSettings24px from "~/assets/svg/v2-icons/settings_24px.svg?inline";
import IconArrowDropDown24px from "~/assets/svg/v2-icons/arrow_drop_down_24px.svg?inline";
import IconEdit from "~/assets/svg/v2-icons/edit_24px.svg?inline";
import IconEye from "~/assets/svg/v2-icons/remove_red_eye_24px.svg?inline";
import IconPeople from "~/assets/svg/v2-icons/people_outline_24px.svg?inline";

import ModalAddGroup from "~/components/page/elearning/Students/ModalAddGroup";
import ModalEdit from "~/components/page/elearning/Students/ModalEdit";
import ModalDetail from "~/components/page/elearning/Students/ModalDetail";
import { mapState, mapActions } from "vuex";
import { get } from "lodash";
import { VclTable } from "vue-content-loading";
import { RESPONSE_SUCCESS } from "~/utils/config";

export default {
  components: {
    ElearningManagerSide,
    IconDelete24px,
    IconAdd24px,
    ModalAddGroup,
    ModalEdit,
    ModalDetail,
    VclTable,
    IconSettings24px,
    IconCreate24px,
    IconArrowDropDown24px,
    IconEdit,
    IconEye,
    IconPeople,
  },

  data() {
    return {
      heads: [
        {
          name: "name",
          text: "Tiêu đề",
          sort: false,
        },
        {
          name: "members",
          text: "Số thành viên",
          sort: false,
        },
        {
          name: "created_at",
          text: "Ngày tạo",
          sort: false,
        },
        {
          name: "action",
          text: "",
        },
      ],
      selectedGroupIds: [],
      loading: false,
      showModalEdit: false,
      showModalView: false,
      payload: {
        query: "",
        page: 1,
        size: 10,
      },
      loadingDel: false,
      loadingElearningView: false,
      loadingExamView: false,
      payloadElearning: {
        hide: false,
        sorted: "created_at_desc",
        status: "APPROVED",
        page: 1,
        limit: 10,
      },
      payloadExam: {
        // status: "APPROVED"
      },
      modalConfirmDelete: false,
    };
  },

  computed: {
    ...mapState("elearning/study-group/group", {
      groups: "groups",
    }),
    ...mapState("auth", {
      userLogin: "token",
    }),

    canDeleteMember() {
      return this.selectedGroupIds && this.selectedGroupIds.length > 0;
    },
  },

  async mounted() {
    this.handleSearch();

    const params = {
      school_id: get(this, "userLogin.organization.id", ""),
    };
    this.$store.dispatch("elearning/study-group/group/getClasses", params);
  },

  methods: {
    ...mapActions("elearning/study-group/group", [
      "getListStudyGroup",
      "deleteStudyGroup",
      "getDetailGroup",
    ]),
    ...mapActions("elearning/teaching/elearning", ["teachingElearningsList"]),
    ...mapActions("elearning/semester/manage-exam", ["getListSemesterExam"]),

    async handleShowView(id) {
      this.showModalView = true;
      this.handleSearchElearning();
      this.handleSearchExams();
    },

    async handleShowEdit(id) {
      const result = await this.getDetailGroup(id);
      if (result.success != RESPONSE_SUCCESS) {
        this.$toasted.error("Lấy thông tin nhóm thất bại");
      } else {
        this.showModalEdit = true;
      }
    },

    async handleSearch() {
      this.loading = true;
      await this.getListStudyGroup(this.payload);
      this.loading = false;
    },

    async handleDeleteGroup() {
      console.log("[handleDeleteGroup]", this.selectedGroupIds);
      this.loadingDel = true;
      const payload = {
        group_ids: this.selectedGroupIds,
      };
      const result = await this.deleteStudyGroup(payload);
      if (result.success == RESPONSE_SUCCESS) {
        this.selectedGroupIds = [];
        this.handleSearch();
      } else {
        this.$toasted.error("Xoá nhóm thất bại");
      }
      this.loadingDel = false;
      this.modalConfirmDelete = false;
    },

    async handleSearchElearning(data) {
      this.loadingElearningView = true;
      const payload = { ...this.payloadElearning, ...data };
      await this.teachingElearningsList(payload);
      this.loadingElearningView = false;
    },

    async handleSearchExams(data) {
      this.loadingExamView = true;
      const payload = { ...this.payloadExam, ...data };
      await this.getListSemesterExam(payload);
      this.loadingExamView = false;
    },

    onPageChange(e) {
      console.log("[onPageChange]", e);
      const { number, size } = e;
      this.payload.page = +number + 1;
      this.payload.size = +size;

      this.handleSearch();
    },

    gotoStudent(id) {
      this.$router.push(`/elearning/study-group/${id}`);
    },

    selectRow(data) {
      this.selectedGroupIds = _.map(data, "id");
      console.log("[selectRow]", this.selectedGroupIds);
    },
    get,
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/students/_group-study.scss";
</style>
