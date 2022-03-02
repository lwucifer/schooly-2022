<template>
  <div class="container mytutor-olclass">
    <breadcrumb />
    <div class="row">
      <div class="col-md-3">
        <MenuSideMyTutor :active="1" />
      </div>

      <div class="col-md-9">
        <sub-block-section title="Lớp học online">
          <template v-slot:content>
            <div class="d-flex justify-content-between mb-4">
              <div>
                <div class="d-flex-center mb-2">
                  <div class="filter-form__item">
                    <app-search
                      v-model="payload.query"
                      class="w-100 mb-0"
                      :placeholder="'Nhập để tìm kiếm...'"
                      :size="'sm'"
                      bordered
                      @submit="search"
                      @keyup.enter.native="search"
                    ></app-search>
                  </div>

                  <div class="filter-form__item">
                    <app-button
                      :color="showFilter ? 'primary' : 'white'"
                      :size="'sm'"
                      square
                      @click="toggleFilter"
                    >
                      <IconHamberger
                        :class="showFilter ? 'fill-white' : 'fill-primary'"
                        class="mr-2"
                      />
                      <span>Lọc kết quả</span>
                    </app-button>
                  </div>
                </div>

                <div v-if="showFilter" class="d-flex-center mb-2">
                  <div class="filter-form__item">
                    <app-select
                      placeholder="Trạng thái"
                      size="sm"
                      bordered
                      searchable
                      v-model="status"
                      :options="statusOpts"
                      @change="handleChangeStatus"
                    ></app-select>
                  </div>
                  <div class="filter-form__item">
                    <app-select
                      label="text"
                      placeholder="Môn học"
                      size="sm"
                      bordered
                      searchable
                      v-model="subject"
                      :options="subjectOpts"
                      @change="handleChangeSubject"
                    ></app-select>
                  </div>
                  <div class="filter-form__item">
                    <app-select
                      placeholder="Khối"
                      size="sm"
                      bordered
                      searchable
                      v-model="grade"
                      :options="gradeOpts"
                      @change="handleChangeGrade"
                    ></app-select>
                  </div>
                </div>

                <app-button color="pink" size="sm" :disabled="ids.length == 0">
                  <IconRemoveCircleOutline
                    class="icon fill-opacity-1 body-1 mr-2"
                  />Hủy
                </app-button>
              </div>

              <n-link
                :to="'/elearning/mytutor/olclass/create'"
                class="btn btn--size-sm btn--color-primary btn--square btn-right"
              >
                <IconAddCircleOutline class="icon fill-opacity-1 mr-2 body-1" />
                <span class="color-white">Tạo lớp học</span>
              </n-link>
            </div>

            <app-table
              :loading="loading"
              :heads="tableHeads"
              :pagination="pagination"
              :data="elearningList"
              multiple-selection
              @pagechange="onPageChange"
              @selectionChange="selectRow"
              @sort="handleSort"
            >
              <td slot="cell(name)" slot-scope="{ row }" class="row-name">
                {{ row.name }}
              </td>

              <td
                slot="cell(status)"
                slot-scope="{ row }"
                :class="[row.status === 1 ? 'text-primary' : 'text-secondary']"
              >
                {{ row.status === 1 ? "Đang hoạt động" : "Đang hoạt động" }}
              </td>

              <td slot="cell(time)">
                15/11/2019 -
                <br />10/10/2020
              </td>

              <template slot="actions" slot-scope="{ row }">
                <button>
                  <IconBorderColor
                    class="icon fill-opacity-1 mr-3 purple"
                  />Chỉnh sửa
                </button>

                <button @click="modalDetail = true">
                  <IconRemoveRedEye
                    class="icon fill-opacity-1 mr-3 text-info"
                  />Xem chi tiết
                </button>

                <button>
                  <IconPeopleOutline
                    class="icon fill-opacity-1 mr-3 text-warning"
                  />Xem danh sách học sinh
                </button>

                <button>
                  <IconEventNote
                    class="icon fill-opacity-1 mr-3 text-primary"
                  />Xem bài tập bài kiểm tra
                </button>
              </template>
            </app-table>
          </template>
        </sub-block-section>
      </div>
    </div>

    <app-modal
      v-model="modalDetail"
      :footer="false"
      :width="828"
      title="Phòng học đại số lớp 11"
      @close="modalDetail = false"
    >
      <OnlineClassDetail slot="content" @close="modalDetail = false" />
    </app-modal>
  </div>
</template>

<script>
import { initBreadcrumb, createPageTitle, initPageTitle } from "~/utils/common";
import MenuSideMyTutor from "~/components/page/elearning/mytutor/MenuSideMyTutor";
import OnlineClassDetail from "~/components/page/elearning/mytutor/olclass/create/OnlineClassDetail";
import IconAddCircleOutline from "~/assets/svg/v2-icons/add_circle_outline_24px.svg?inline";
import IconHamberger from "~/assets/svg/icons/hamberger.svg?inline";
import IconRemoveCircleOutline from "~/assets/svg/v2-icons/remove_circle_outline_24px.svg?inline";
import IconBorderColor from "~/assets/svg/v2-icons/border_color_24px.svg?inline";
import IconRemoveRedEye from "~/assets/svg/v2-icons/remove_red_eye_24px.svg?inline";
import IconPeopleOutline from "~/assets/svg/v2-icons/people_outline_24px.svg?inline";
import IconEventNote from "~/assets/svg/v2-icons/event_note_24px.svg?inline";
import { get } from "lodash";
import { mapState, mapGetters } from "vuex";
import * as actionTypes from "~/utils/action-types";

export default {
  components: {
    MenuSideMyTutor,
    OnlineClassDetail,
    IconAddCircleOutline,
    IconHamberger,
    IconRemoveCircleOutline,
    IconBorderColor,
    IconRemoveRedEye,
    IconPeopleOutline,
    IconEventNote,
  },

  data() {
    const allOpt = {
      value: null,
      text: "Tất cả",
    };

    return {
      allOpt,
      showFilter: false,
      keyword: "",
      status: null,
      subject: null,
      grade: null,
      statusOpts: [allOpt, { value: 123, text: "Trạng thái 1" }],
      subjectOpts: [allOpt, { value: 456, text: "Môn toán" }],
      gradeOpts: [allOpt, { value: 789, text: "Khối 6" }],
      ids: [],
      loading: false,
      tableHeads: [
        { name: "name", text: "Tên lớp học" },
        { name: "subject", text: "Môn học" },
        { name: "grade", text: "Khối" },
        { name: "price", text: "Học phí/Buổi" },
        { name: "status", text: "Trạng thái" },
        { name: "time", text: "Thời gian" },
      ],
      pagination: {
        total_pages: 0,
        number: 0,
        size: 10,
        total_elements: 0,
        first: 0,
        last: 0,
      },
      elearningList: [
        {
          name:
            "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet",
          subject: "Toán",
          grade: 6,
          price: "1.500.000đ",
          status: 1,
          time: "15/11/2019 - 10/10/2020",
        },
      ],
      olclassList: [],
      modalDetail: false,
      payload: {
        page: 1,
        size: 10,
        query: "",
        subject_id: null,
        grade_id: null,
        status: null,
      },
    };
  },

  created() {
    this.getList();
  },

  methods: {
    get,

    async getList() {
      const self = this;
      try {
        self.loading = true;
        Object.keys(this.payload).map((k) => {
          if (this.payload[k] == null || this.payload[k] == -1) {
            delete this.payload[k];
          }
        });
        let params = { ...this.payload };
        await this.$store.dispatch(
          `elearning/mytutor/olclass/${actionTypes.MYTUTOR_OLCLASS.LIST}`,
          { params }
        );

        self.olclassList = self.get(self.stateClass, "data.content", []);
        self.pagination.size = self.get(self.stateClass, "data.size", 10);
        self.pagination.first = self.get(self.stateClass, "data.first", 1);
        self.pagination.last = self.get(self.stateClass, "data.last", 1);
        self.pagination.number = self.get(self.stateClass, "data.number", 0);
        self.pagination.total_pages = self.get(
          self.stateClass,
          "data.total_pages",
          0
        );
        self.pagination.total_elements = self.get(
          self.stateClass,
          "data.total_elements",
          0
        );
        self.pagination.number_of_elements = self.get(
          self.stateClass,
          "data.number_of_elements",
          0
        );
      } catch (e) {
      } finally {
        self.loading = false;
      }
    },

    toggleFilter() {
      if (this.showFilter && (this.status != null || this.subject != null || this.grade != null) ) {
        this.payload.subject_id = null;
        this.payload.grade_id = null;
        this.payload.status = null;
        this.getList();
      }
      this.showFilter = !this.showFilter;
    },

    search() {
      this.getList();
    },

    handleChangeStatus(_val){
      console.log('handleChangeStatus', _val);
      this.payload.status = _val;
    },

    handleChangeSubject(_val){
      console.log('handleChangeSubject', _val);
      this.payload.subject_id = _val;
    },

    handleChangeGrade(_val){
      console.log('handleChangeGrade', _val);
      this.payload.grade_id = _val;
    },


    onPageChange() {
      const that = this;
      that.pagination = { ...that.pagination, ...e };
      that.params.size = that.pagination.size;
      that.params.page = that.pagination.number + 1;
      this.checkPage = false;
      that.getList();
    },
    selectRow(data) {
      console.log('selectRow', data)
    },
    handleSort() {},
  },

  mounted() {
    const breadcrumb = [
      {
        title: "E-learning",
        to: "/elearning",
      },
      {
        title: "Quản lý lớp học online",
        to: "/elearning/mytutor",
      },
      {
        title: "Lớp học online",
        to: "/elearning/mytutor/olclass",
      },
    ];
    initBreadcrumb(this, breadcrumb);
    initPageTitle(this, createPageTitle("Quản lý lớp học online"));
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/manager/_elearning-manager.scss";
@import "~/assets/scss/components/elearning/_elearning-filter-form.scss";

.row-name {
  width: 22.4rem;
}

.purple {
  color: #9b51e0;
}
</style>
