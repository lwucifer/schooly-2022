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

        <div class="filter-form__item" style="width: 100%; max-width:21.5rem;">
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

        <div
          class="filter-form__item"
          style="min-width: 26rem"
          v-if="showFilter"
        >
          <app-vue-select
            class="app-vue-select filter-form__item__selection mr-3"
            v-model="filterCourse"
            :options="statusOpts"
            label="text"
            placeholder="Trạng thái"
            @input="handleChangedStatus"
            :all-opt="allOpt"
            has-border
          ></app-vue-select>

          <app-vue-select
            class="app-vue-select filter-form__item__selection"
            v-model="fillterType"
            :options="TypeOpts"
            label="text"
            placeholder="Loại yêu cầu"
            @input="handleChangedType"
            :all-opt="allOpt"
            has-border
          ></app-vue-select>
        </div>
      </div>
    </div>
    <!--End filter form-->

    <!--Table-->
    <app-table
      :loading="loading"
      :heads="tableHeads"
      :pagination="pagination"
      :data="fillterClassList"
    >
      <td slot="cell(teacher)" slot-scope="{ row }">
        {{ row.requester_name || "" }}
      </td>
      <td slot="cell(type)" slot-scope="{ row }">
        {{
          row.type == "CHANGE"
            ? "Đổi lịch"
            : row.type == "EDIT"
            ? "Sửa lịch"
            : "Huỷ lịch"
        }}
      </td>
      <td slot="cell(content)" slot-scope="{ row }" width="25%">
        <span class="two-lines">{{ row.note || "" }}</span>
      </td>
      <td slot="cell(time)" slot-scope="{ row }">
        {{ getLocalTimeHH_MM_A(row.timestamp) }}
        <br />{{ getDateBirthDay(row.timestamp) }}
      </td>
      <td slot="cell(status)" slot-scope="{ row }">
        <span v-if="row.status == 1" class="text-primary">Đã duyệt</span>
        <span v-if="row.status == -1" class="text-secondary">Từ chối</span>
        <span v-if="row.status == 0" class="text-warning">Chờ xử lý</span>
      </td>
      <td slot="cell(action)" slot-scope="{ row }" class="td-action">
        <v-popover
          placement="bottom-end"
          :popover-inner-class="`tooltip-inner popover-inner pa-0`"
        >
          <a href class="d-inline-flex align-items-center" @click.prevent>
            <IconSettings class="icon fill-opacity-1 body-1" />
            <IconArrowDropDown class="icon fill-opacity-1" />
          </a>

          <div slot="popover">
            <a
              v-if="row.owner_request == 0"
              class="popover-link"
              @click.prevent="handleClickProcess(row.request_id)"
            >
              <IconCheck class="icon fill-opacity-1 text-primary mr-3" />Duyệt
            </a>
            <a
              v-if="row.owner_request == 0"
              class="popover-link"
              @click.prevent="handleClickReject(row.request_id)"
            >
              <IconRemoveCircleOutline
                class="icon fill-opacity-1 text-secondary mr-3"
              />Từ chối
            </a>
            <a
              v-if="row.owner_request == 1"
              class="popover-link"
              @click.prevent="handleClickCancel(row.request_id)"
            >
              <IconClose24px
                class="icon fill-opacity-1 text-secondary mr-3"
              />Huỷ gửi yêu cầu
            </a>
          </div>
        </v-popover>
      </td>
      <template slot="actions" slot-scope="{ row }">
        <a
          href
          class="link body-3 font-weight-medium"
          @click.prevent="handleDetail(row.request_id)"
        >
          <IconBorderColor
            class="icon body-1 text-primary mr-2 fill-opacity-1"
          />Xem chi tiết
        </a>
      </template>
    </app-table>
    <!--End table-->

    <app-modal
      v-model="modalDetail"
      :footer="false"
      title="Xem chi tiết"
      size="sm"
      @close="modalDetail = false"
    >
      <OnlineClassDetail
        slot="content"
        :requestId="requestId"
        @close="modalDetail = false"
      />
    </app-modal>
  </div>
</template>

<script>
import IconCalendar from "~/assets/svg/icons/calendar2.svg?inline";
import IconHamberger from "~/assets/svg/icons/hamberger.svg?inline";
import IconBorderColor from "~/assets/svg/v2-icons/border_color_24px.svg?inline";
import IconSettings from "~/assets/svg/v2-icons/settings_24px.svg?inline";
import IconArrowDropDown from "~/assets/svg/v2-icons/arrow_drop_down_24px.svg?inline";
import IconClose24px from "~/assets/svg/v2-icons/close_24px.svg?inline";
import IconCheck from "~/assets/svg/v2-icons/check_24px.svg?inline";
import IconRemoveCircleOutline from "~/assets/svg/v2-icons/remove_circle_outline_24px.svg?inline";
import OnlineClassDetail from "~/components/page/elearning/manager/olclass/OnlineClassDetail";

import { mapState, mapActions } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
import { useEffect } from "~/utils/common";

const STORE_NAMESPACE = "elearning/teaching/olclass";
const STORE_PUBLIC_SEARCH = "elearning/public/public-search";
import { getDateBirthDay, getLocalTimeHH_MM_A } from "~/utils/moment";

export default {
  components: {
    IconCalendar,
    IconHamberger,
    IconBorderColor,
    IconSettings,
    IconArrowDropDown,
    IconCheck,
    IconRemoveCircleOutline,
    OnlineClassDetail,
    IconClose24px,
  },

  data() {
    return {
      allOpt: {
        value: null,
        text: "Tất cả",
      },
      requestId: "",
      showFilter: false,
      rowClassId: null,
      courses: [],
      filterCourse: null,
      fillterType: null,
      pagination: {
        total: 0,
        number: 0,
        size: 10,
        total_elements: 0,
        first: 0,
        last: 0,
      },
      classList: [],
      lessonList: [],
      ids: [],
      leassonIds: [],
      params: {
        page: 1,
        size: 10,
        object_id: null,
        type: null,
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
          name: "teacher",
          text: "Người yêu cầu",
        },
        {
          name: "type",
          text: "Loại yêu cầu",
        },
        {
          name: "content",
          text: "Nội dung",
        },
        {
          name: "time",
          text: "Thời gian",
          sort: true,
        },
        {
          name: "status",
          text: "Trạng thái",
        },
        {
          name: "action",
          text: "",
        },
      ],
      statusOpts: [
        {
          text: "Tất cả",
          value: null,
        },
        {
          text: "Từ chối",
          value: -1,
        },
        {
          text: "Chờ xử lý",
          value: 0,
        },
        {
          text: "Duyệt",
          value: 1,
        },
      ],
      TypeOpts: [
        {
          text: "Tất cả",
          value: null,
        },
        {
          text: "Đổi lịch",
          value: "CHANGE",
        },
        {
          text: "Sửa lịch",
          value: "EDIT",
        },
        {
          text: "Huỷ lịch",
          value: "CANCEL",
        },
      ],
      modalDetail: false,
    };
  },
  computed: {
    ...mapState("auth", ["loggedUser"]),
    ...mapState("elearning/teaching/olclass-modify-schedule", ["scheduleList"]),
    ...mapState(STORE_NAMESPACE, {
      stateClass: "OnlineClass",
    }),
    ...mapState(STORE_PUBLIC_SEARCH, {
      stateElearnings: "Elearnings",
    }),
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
    getDateBirthDay,
    getLocalTimeHH_MM_A,

    handleSort(e) {
      const sortBy = e.sortBy + "," + e.order;
      this.params = { ...this.params, sort: sortBy };
      this.getList();
    },

    toggleFilter() {
      if (
        this.showFilter &&
        (this.filterCourse != null || this.fillterType != null)
      ) {
        this.filterCourse = null;
        this.fillterType = null;
        this.params.status = null;
        this.params.type = null;
        this.params = { ...this.params, object_id: null };
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

    handleDate() {
      this.getList();
    },

    submit() {
      if (this.checkSubmit) {
        this.getList();
        this.checkSubmit = false;
      }
    },

    handleChangedStatus(val) {
      console.log("handleChangedStatus", val);
      this.params.status = val.value;
      this.getList();
    },

    handleChangedType(val) {
      this.params.type = val.value;
      this.getList();
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
          `elearning/teaching/olclass-modify-schedule/${actionTypes.TEACHING_ONLINE_CLASS_MODIFY_SCHEDULE.LIST}`,
          { params }
        );

        this.classList = this.get(self.scheduleList, "data.content", []);
        this.pagination.size = this.get(this.scheduleList, "data.size", 10);
        this.pagination.first = this.get(this.scheduleList, "data.first", 1);
        this.pagination.last = this.get(this.scheduleList, "data.last", 1);
        this.pagination.number = this.get(this.scheduleList, "data.number", 0);
        this.pagination.total_pages = this.get(
          this.scheduleList,
          "data.total_pages",
          0
        );
        this.pagination.total_elements = this.get(
          this.scheduleList,
          "data.total_elements",
          0
        );
        this.pagination.number_of_elements = this.get(
          this.scheduleList,
          "data.number_of_elements",
          0
        );
      } catch (e) {
      } finally {
        this.loading = false;
        this.checkPage = true;
      }
    },

    handleClickProcess(_request_id) {
      const payload = {
        process: 1,
        reason: "",
        request_id: _request_id,
      };
      this.$store
        .dispatch(
          `elearning/teaching/olclass-modify-schedule/${actionTypes.TEACHING_ONLINE_CLASS_MODIFY_SCHEDULE.PROCESS}`,
          payload
        )
        .then((res) => {
          if (res.success) {
            this.$toasted.success("Thành công");
            this.getList();
          } else {
            this.$toasted.error(res.message);
          }
        });
    },

    handleClickReject(_request_id) {
      const payload = {
        process: -1,
        reason: "",
        request_id: _request_id,
      };
      this.$store
        .dispatch(
          `elearning/teaching/olclass-modify-schedule/${actionTypes.TEACHING_ONLINE_CLASS_MODIFY_SCHEDULE.PROCESS}`,
          payload
        )
        .then((res) => {
          if (res.success) {
            this.$toasted.success("Thành công");
            this.getList();
          } else {
            this.$toasted.error(res.message);
          }
        });
    },

    handleClickCancel(_request_id) {
      this.$store
        .dispatch(
          `elearning/teaching/olclass-modify-schedule/${actionTypes.TEACHING_ONLINE_CLASS_MODIFY_SCHEDULE.CANCEL}`,
          _request_id
        )
        .then((res) => {
          if (res.success) {
            this.$toasted.success("Thành công");
            this.getList();
          } else {
            this.$toasted.error(res.message);
          }
        });
    },

    handleDetail(_request_id) {
      this.modalDetail = true;
      this.requestId = _request_id;
    },

    get,
  },

  created() {
    this.query_date = "";
    this.query = "";
    this.filterCourse = null;
    this.fillterType = null;
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

.two-lines {
  @include set-line(
    (
      "lineClamp": 2,
    )
  );
}

.popover-link {
  padding: 0.5rem 1.5rem;
  color: $color-text;
  display: flex;
  align-items: center;

  .icon {
    font-size: 2rem;
  }

  &:hover {
    background-color: #f9f9f9;
  }
}

.td-action {
  position: relative;
  z-index: 1;
}
</style>
