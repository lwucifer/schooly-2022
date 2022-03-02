<template>
  <div class="elearning-wrapper">
    <!--Filter form-->
    <div class="filter-form">
      <div class="d-flex">
        <div class="filter-form__item">
          <app-date-picker
            v-model="query_date"
            square
            size="sm"
            placeholder="dd/mm/yyyy"
            @input="handleDate"
          >
            <template v-slot:icon-calendar>
              <IconCalendar class="fill-primary" />
            </template>
          </app-date-picker>
        </div>

        <div class="filter-form__item" style="max-width:36rem;min-width:30rem;">
          <div style="width: 100%">
            <app-search
              class
              :placeholder="'Nhập để tìm kiếm...'"
              bordered
              v-model="query"
              :size="'sm'"
              @submit="submit"
              @keyup.enter.native="submit"
            ></app-search>
          </div>
        </div>

        <div class="filter-form__item">
          <app-button
            :color="showFilter ? 'primary' : 'white'"
            square
            :size="'sm'"
            @click="toggleFilter"
          >
            <IconHamberger
              :class="showFilter ? 'fill-white' : 'fill-primary'"
              class="mr-2"
            />
            <span>Lọc kết quả</span>
          </app-button>
        </div>

        <div class="filter-form__item" v-if="showFilter">
          <app-vue-select
            class="app-vue-select filter-form__item__selection"
            v-model="filterClass"
            :options="courseClass"
            label="text"
            placeholder="Lớp"
            @input="handleChangedCourse"
            :all-opt="allOpt"
            has-border
          ></app-vue-select>
        </div>

        <div
          class="filter-form__item"
          style="min-width: 11rem"
          v-if="showFilter"
        >
          <app-vue-select
            class="app-vue-select filter-form__item__selection"
            v-model="filterGroup"
            :options="courseGroup"
            label="text"
            placeholder="Nhóm lớp"
            @input="handleChangedGroup"
            :all-opt="allOpt"
            has-border
          ></app-vue-select>
        </div>
      </div>
    </div>
    <!--End filter form-->

    <!--Options group-->
    <div class="filter-form">
      <div class="filter-form__item">
        <app-button
          class="filter-form__item__btn m-0 mr-4"
          color="pink"
          square
          :size="'sm'"
          :disabled="ids.length == 0"
          @click="showModalConfirm = true"
        >
          <IconTrash class="fill-white" />
          <span class="ml-3">Hủy phòng học</span>
        </app-button>

        <app-button
          class="filter-form__item__btn m-0 color-666"
          color="disabled"
          square
          :size="'sm'"
          :disabled="ids.length == 0"
          @click="showModalConfirmSchedules = true"
        >
          <IconCalendarDelete />
          <span class="ml-3">Hủy lịch học</span>
        </app-button>
      </div>
    </div>
    <!--Options group-->

    <!--Table-->
    <OnlineClassTable
      :table-heads="tableHeads"
      :loading="loading"
      :pagination="pagination"
      @pagechange="onPageChange"
      @selectionChange="selectRow"
      @sort="handleSort"
      @changeSchedule="changeSchedule"
      @editSchedule="editSchedule"
      @requestCancelSchedule="requestCancelSchedule"
      :actions="[0, 1, 1, 0, 1, 1, 1]"
      :cols="[5, 25, 23, 20, 12, 15]"
      :data="fillterClassList"
    />
    <!--End table-->

    <app-modal-confirm
      v-if="showModalConfirm"
      @ok="deleteRows"
      :width="550"
      @cancel="showModalConfirm = false"
      title="Xác nhận hủy phòng học"
      description="Bạn có chắc chắn muốn hủy tất cả các lịch học của phòng học này"
    />

    <app-modal-confirm
      v-if="showModalConfirmSchedules"
      @ok="deleteSchedules"
      :width="550"
      @cancel="showModalConfirmSchedules = false"
      :footer="false"
      :header="false"
      title="Xác nhận hủy lịch học"
      description="Bạn chắc chắn muốn hủy lịch học"
    />

    <app-modal
      v-model="modalCancel"
      size="sm"
      :footer="false"
      title="Yêu cầu huỷ lịch"
      :width="607"
      @close="modalCancel = false"
    >
      <FormCancelSchedule
        slot="content"
        @close="modalCancel = false"
        @addSucces="addSucces"
        :dataRowSchedule="dataRowSchedule"
      />
    </app-modal>

    <app-modal
      v-if="modalEdit"
      size="sm"
      :footer="false"
      title="Sửa lịch"
      :width="607"
      @close="modalEdit = false"
    >
      <FormEditSchedule
        slot="content"
        @close="modalEdit = false"
        @addSucces="addSucces"
        :dataRowSchedule="dataRowSchedule"
      />
    </app-modal>

    <app-modal
      v-if="modalChange"
      size="sm"
      :footer="false"
      title="Đổi lịch"
      :width="607"
      @close="modalChange = false"
    >
      <FormChangeSchedule
        slot="content"
        @close="modalChange = false"
        @addSucces="addSucces"
        :dataRowSchedule="dataRowSchedule"
      />
    </app-modal>

    <app-modal-notify
      v-if="notify.showNotify"
      :type="notify.type"
      :description="notify.description"
      :title="notify.message"
      @close="closeNotify"
      @ok="closeNotify"
    />
  </div>
</template>

<script>
import IconCalendar from "~/assets/svg/icons/calendar2.svg?inline";
import IconTrash from "~/assets/svg/icons/trash-alt.svg?inline";
import IconHamberger from "~/assets/svg/icons/hamberger.svg?inline";
import IconCalendarDelete from "~/assets/svg/v2-icons/calendar-delete.svg?inline";
import OnlineClassTable from "~/components/page/elearning/manager/olclass/OnlineClassTable";
import FormCancelSchedule from "~/components/page/elearning/manager/olclass/FormCancelSchedule";
import FormEditSchedule from "~/components/page/elearning/manager/olclass/FormEditSchedule";
import FormChangeSchedule from "~/components/page/elearning/manager/olclass/FormChangeSchedule";

import { mapState, mapGetters } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
import { useEffect, allOptionSelect } from "~/utils/common";

const STORE_NAMESPACE = "elearning/teaching/olclass";
const STORE_PUBLIC_SEARCH = "elearning/public/public-search";

export default {
  components: {
    IconCalendar,
    IconTrash,
    IconHamberger,
    IconCalendarDelete,
    OnlineClassTable,
    FormCancelSchedule,
    FormEditSchedule,
    FormChangeSchedule,
  },

  data() {
    return {
      allOpt: {
        value: null,
        text: "Tất cả",
      },
      showFilter: false,
      showModalConfirm: false,
      showModalConfirmSchedules: false,
      rowClassId: null,
      courses: [],
      filterClass: null,
      filterGroup: null,
      pagination: {
        total: 0,
        number: 0,
        size: 10,
        total_elements: 0,
        first: 0,
        last: 0,
      },
      dataRowSchedule: {},
      onlineClassId: "",
      onlineLessonId: "",
      classList: [],
      lessonList: [],
      ids: [],
      leassonIds: [],
      params: {
        page: 1,
        size: 10,
        class_status: "SCHEDULED",
        status: null,
        query_date: null,
        query: null,
        sort: "start_time,desc",
      },
      loading: false,
      query: "",
      query_date: "",
      checkSubmit: false,
      checkPage: true,
      tableHeads: [
        {
          name: "online_class_name",
          text: "Phòng học",
          sort: true,
        },
        {
          name: "assignment_name",
          text: "Thuộc bài giảng<br/>/khoá học",
          sort: true,
        },
        {
          name: "start_time",
          text: "Thời gian học",
          sort: true,
        },
        {
          name: "num_student",
          text: "Số học sinh<br/>đã mời",
          sort: true,
        },
        {
          name: "teacher_name_assigned",
          text: "Giáo viên",
          sort: true,
        },
      ],
      modalCancel: false,
      modalEdit: false,
      modalChange: false,
      notify: {
        type: "",
        message: "",
        description: "",
        showNotify: false,
      },
    };
  },
  computed: {
    ...mapState("auth", ["loggedUser"]),
    ...mapState(STORE_NAMESPACE, {
      stateClass: "OnlineClass",
    }),
    ...mapState(STORE_PUBLIC_SEARCH, {
      stateElearnings: "Elearnings",
    }),
    ...mapGetters("elearning", ["groupClsOpts"]),

    courseClass() {
      return allOptionSelect(
        this.groupClsOpts.filter((item) => item.type == "CLASS")
      );
    },
    courseGroup() {
      return allOptionSelect(
        this.groupClsOpts.filter((item) => item.type == "GROUP")
      );
    },
    fillterClassList() {
      const tmp =
        (this.classList &&
          this.classList.map((item) => {
            return {
              ...item,
              id: item.online_schedule_id,
            };
          })) ||
        [];
      return tmp;
    },
  },

  watch: {
    query() {
      this.checkSubmit = true;
    },
    query_date() {
      this.checkSubmit = true;
    },
  },

  methods: {
    changeSchedule(data) {
      this.dataRowSchedule = data;
      this.modalChange = true;
    },
    editSchedule(data) {
      this.dataRowSchedule = data;
      this.modalEdit = true;
    },
    requestCancelSchedule(data) {
      this.dataRowSchedule = data;
      this.modalCancel = true;
    },
    handleSort(e) {
      const sortBy = e.sortBy + "," + e.order;
      this.params = { ...this.params, sort: sortBy };
      this.getList();
    },

    toggleFilter() {
      if (
        this.showFilter &&
        (this.filterClass != null ||
        this.filterGroup != null)
      ) {
        this.filterClass = null;
        this.filterGroup = null;
        this.params = { ...this.params, class_id: null, group_id: null };
        this.getList();
      }
      this.showFilter = !this.showFilter;
    },

    onPageChange(e) {
      const that = this;
      that.pagination = { ...that.pagination, ...e };
      that.params.size = that.pagination.size;
      that.params.page = that.pagination.number + 1;
      this.checkPage = false;
      that.getList();
    },

    handleDate(){
      this.getList();
    },

    submit() {
      if (this.checkSubmit) {
        this.getList();
        this.checkSubmit = false;
      }
    },

    handleChangedCourse(val) {
      this.params.class_id = this.filterClass.value;
      this.getList();
    },
    handleChangedGroup() {
      this.params.group_id = this.filterGroup.value;
      this.getList();
    },

    selectRow(data) {
      this.ids = data.map((row, index, data) => {
        return row.online_class_id;
      });
      this.leassonIds = data.map((row, index, data) => {
        return row.online_lesson_id;
      });
      console.log("selectRow", this.ids);
    },

    async getList() {
      const self = this;
      try {
        self.loading = true;
        let params = { ...self.params };
        if (this.query_date) params.query_date = this.query_date;
        if (this.query) params.query = this.query;
        if (this.checkPage) params.page = 1;
        await self.$store.dispatch(
          `${STORE_NAMESPACE}/${actionTypes.TEACHING_OLCLASSES.LIST}`,
          { params }
        );

        this.classList = this.get(self.stateClass, "data.content", []);
        this.pagination.size = this.get(this.stateClass, "data.size", 10);
        this.pagination.first = this.get(this.stateClass, "data.first", 1);
        this.pagination.last = this.get(this.stateClass, "data.last", 1);
        this.pagination.number = this.get(this.stateClass, "data.number", 0);
        this.pagination.total_pages = this.get(
          this.stateClass,
          "data.total_pages",
          0
        );
        this.pagination.total_elements = this.get(
          this.stateClass,
          "data.total_elements",
          0
        );
        this.pagination.number_of_elements = this.get(
          this.stateClass,
          "data.number_of_elements",
          0
        );
      } catch (e) {
      } finally {
        this.loading = false;
        this.checkPage = true;
      }
    },

    async deleteRows() {
      let ids = { online_class_ids: [...this.ids] };
      console.log("deleteRows", ids);

      const doDelete = await this.$store.dispatch(
        `${STORE_NAMESPACE}/${actionTypes.TEACHING_OLCLASSES.DELETE}`,
        ids
      );

      console.log("doDelete", doDelete);

      if (doDelete.success) {
        this.ids = [];
        this.leassonIds = [];
        this.showModalConfirm = false;
        this.getList();
      } else {
        this.$toasted.error(doDelete.message);
      }
      this.showModalConfirm = false;
    },

    addSucces(_type) {
      this.modalEdit = false;
      this.modalChange = false;
      this.modalCancel = false;
      if (_type == "success") {
        this.notify = {
          showNotify: true,
          type: "success",
          message: "Gửi yêu cầu thành công",
        };
        this.getList();
      } else {
        this.notify = {
          showNotify: true,
          type: "error",
          message: "Gửi yêu cầu không thành công",
          description: _type,
        };
      }
    },

    closeNotify() {
      this.notify.showNotify = false;
    },

    async deleteSchedules() {
      let ids = { online_lesson_ids: [...this.leassonIds] };
      console.log("deleteSchedules", ids);

      const doDelete = await this.$store.dispatch(
        `${STORE_NAMESPACE}/${actionTypes.TEACHING_SCHEDULES.DELETE}`,
        JSON.stringify(ids)
      );

      if (doDelete.success) {
        this.ids = [];
        this.leassonIds = [];
        this.showModalConfirmSchedules = false;
        this.getList();
      } else {
        this.$toasted.error(doDelete.message);
      }
      this.showModalConfirmSchedules = false;
    },

    get,
  },

  created() {
    this.query_date = "";
    this.query = "";
    this.filterClass = null;
    this.filterGroup = null;
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/manager/_elearning-manager-content.scss";
@import "~/assets/scss/components/elearning/_elearning-filter-form.scss";
.appended-col {
  p {
    max-width: 15rem;
  }
  .text-description {
    color: #999;
    font-size: 1.2rem;
    line-height: 1.6rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
