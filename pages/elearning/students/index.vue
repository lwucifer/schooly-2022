<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <ElearningManagerSide :active="11" :group="4" />
      </div>
      <div class="col-md-9">
        <sub-block-section title="Danh sách học sinh">
          <template v-slot:content>
            <div class="d-flex">
              <app-search
                bordered
                size="sm"
                style="width:35rem"
                placeholder="Nhập để tìm kiếm"
                @input="searchStudent"
              />
              <app-button size="sm" color="transparent" class="ml-auto color-blue" @click="handleExport">
                <IconLocalPrintshop24px class="mr-3" />Xuất Excel
              </app-button>
            </div>
            <app-table-extend
              :heads="heads"
              :data="filterClgrStudentList"
              :pagination="filterPagination"
              @pagechange="onPageChange"
              @sort="sortTable"
              :order="'desc'"
            >
              <template v-slot:cell(students)="{ row }">
                <td>
                  <div class="d-flex align-items-center">
                    <span
                      v-if="row.linked"
                    >{{row.profile && row.profile.name ? row.profile.name : '--'}}</span>
                    <span
                      v-else
                    >{{ row.profile && row.profile.name ? row.profile.name : row.account && row.account.name ? row.account.name : '--'}}</span>
                    <IconKeyboardArrowDown24px class="ml-3 records-table-arrow" />
                    <!-- <IconKeyboardArrowUp24px class="ml-3" v-else /> -->
                  </div>
                </td>
              </template>
              <template v-slot:cell(code)="{ row }">
                <td>
                  <div
                    class="d-flex align-items-center"
                  >{{row.profile && row.profile.student_number ? row.profile.student_number : '--'}}</div>
                </td>
              </template>
              <template v-slot:cell(sex)="{ row }">
                <td>
                  <div class="d-flex align-items-center">
                    <span
                      v-if="row.linked"
                    >{{row.profile && row.profile.sex ? row.profile.sex == 'MALE' ? 'Nam' : "Nữ" : '--'}}</span>
                    <span
                      v-else
                    >{{ row.profile && row.profile.sex ? row.profile.sex == 'MALE' ? 'Nam' : "Nữ" : row.account && row.account.sex ? row.account.sex == 'MALE' ? 'Nam' : "Nữ" : '--'}}</span>
                  </div>
                </td>
              </template>
              <template v-slot:cell(class)="{ row }">
                <td>
                  <div
                    class="d-flex align-items-center"
                  >{{row.profile && row.profile.classes ? row.profile.classes : '--'}}</div>
                </td>
              </template>
              <template v-slot:cell(birthday)="{ row }">
                <td>
                  <div class="d-flex align-items-center">
                    <span
                      v-if="row.linked"
                    >{{row.profile && row.profile.birthday ? getDateBirthDayUTC(row.profile.birthday) : '--'}}</span>
                    <span
                      v-else
                    >{{row.profile && row.profile.birthday ? getDateBirthDayUTC(row.profile.birthday) : row.account && row.account.birthday ? getDateBirthDayUTC(row.account.birthday) : '--'}}</span>
                  </div>
                </td>
              </template>
              <td
                slot="expandedRowRender"
                slot-scope="{ row }"
                :colspan="heads.length + 1"
                class="pa-0"
              >
                <div class="students-table-extend-content row">
                  <div class="col-md-4">
                    <p class="mb-3">
                      Tình trạng liên kết:
                      <span
                        :class="row.linked ? 'text-primary' : 'text-error'"
                      >{{row.linked ? 'Đã liên kết' : 'Chưa liên kết'}}</span>
                    </p>
                    <p>
                      Mã liên kết:
                      <span
                        class="text-primary"
                      >{{row.linked ? row.profile && row.profile.code ? row.profile.code : '-' : '-'}}</span>
                    </p>
                  </div>
                  <div class="col-md-4">
                    <p class="mb-3">
                      Tên đăng nhập:
                      <span
                        class="text-primary"
                        v-if="row.linked"
                      >{{row.account && row.account.email ? row.account.email : '-'}}</span>
                      <span
                        class="text-primary"
                        v-else
                      >{{ row.profile && row.profile.email ? row.profile.email : row.account && row.account.email ? row.account.email : '--'}}</span>
                    </p>
                    <p>
                      Số điện thoại:
                      <span
                        class="text-primary"
                      >{{row.account && row.account.phone ? row.account.phone : '-'}}</span>
                    </p>
                    <!-- <p>
                      Email :
                      <span
                        class="text-primary"
                      >{{row.account && row.account.email ? row.account.email : '-'}}</span>
                    </p>-->
                  </div>
                  <div class="col-md-4">
                    <p class="mb-3">
                      Mật khẩu:
                      <span
                        class="text-primary"
                      >{{row.account && row.account.type ? row.account.type == 'AUTO' ? row.account.pwd : '-' : '-'}}</span>
                    </p>
                  </div>
                </div>
              </td>
            </app-table-extend>
          </template>
        </sub-block-section>
      </div>
    </div>

    <app-modal
      centered
      :footer="false"
      title="Đang xuất dữ liệu"
      v-if="showModalExport"
    >
      <div slot="content">
        <p>Đang xuất tệp excel. Xin vui lòng chờ....</p>
      </div>
    </app-modal>

  </div>
</template>

<script>
import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
import IconLocalPrintshop24px from "~/assets/svg/v2-icons/local_printshop_24px.svg?inline";
import IconKeyboardArrowDown24px from "~/assets/svg/v2-icons/keyboard_arrow_down_24px.svg?inline";
import IconKeyboardArrowUp24px from "~/assets/svg/v2-icons/keyboard_arrow_up_24px.svg?inline";
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";
import { debounce } from "lodash";
import * as actionTypes from "~/utils/action-types";
import { getDateBirthDayUTC } from "~/utils/moment";

export default {
  components: {
    ElearningManagerSide,
    IconLocalPrintshop24px,
    IconKeyboardArrowDown24px,
    IconKeyboardArrowUp24px,
  },
  data() {
    return {
      heads: [
        {
          name: "students",
          text: "Học sinh",
          sort: "true",
        },
        {
          name: "code",
          text: "Mã học sinh",
        },
        {
          name: "sex",
          text: "Giới tính",
        },
        {
          name: "class",
          text: "Lớp/Nhóm",
        },
        {
          name: "birthday",
          text: "Ngày sinh",
        },
      ],
      pagination: {
        total_elements: 20,
        last: false,
        total_pages: 2,
        size: 10,
        number: 0,
        first: true,
        number_of_elements: 20,
      },
      paramStudent: {
        class_id: null,
        group_id: null,
        page: 1,
        limit: 10,
        keyword: null,
        sorted_by: null,
      },
      nameKeyword: "",
      showModalExport: false
    };
  },
  async fetch({ params, query, store, route }) {
    await Promise.all([
      store.dispatch(
        `elearning/students/${actionTypes.TEACHING_CLGR_STUDENT.GET_TEACHING_CLGR_STUDENT}`
      ),
    ]);
  },
  computed: {
    ...mapState("elearning/students", ["teachingClgrStudentList"]),
    ...mapState("elearning", ["currentGroupCls"]),
    ...mapGetters("elearning", ["currentGroupClsDetail"]),
    filterClgrStudentList() {
      return this.teachingClgrStudentList &&
        this.teachingClgrStudentList.content
        ? this.teachingClgrStudentList.content
        : [];
    },
    filterPagination() {
      return {
        size:
          this.teachingClgrStudentList &&
          this.teachingClgrStudentList.page &&
          this.teachingClgrStudentList.page.size
            ? this.teachingClgrStudentList.page.size
            : 10,
        total_pages:
          this.teachingClgrStudentList &&
          this.teachingClgrStudentList.page &&
          this.teachingClgrStudentList.page.total_pages
            ? this.teachingClgrStudentList.page.total_pages
            : 1,
        total_elements:
          this.teachingClgrStudentList &&
          this.teachingClgrStudentList.page &&
          this.teachingClgrStudentList.page.total_elements
            ? this.teachingClgrStudentList.page.total_elements
            : 0,
        first:
          this.teachingClgrStudentList &&
          this.teachingClgrStudentList.page &&
          this.teachingClgrStudentList.page.first
            ? this.teachingClgrStudentList.page.first
            : 1,
        last:
          this.teachingClgrStudentList &&
          this.teachingClgrStudentList.page &&
          this.teachingClgrStudentList.page.last
            ? this.teachingClgrStudentList.page.last
            : 1,
        number_of_elements:
          this.teachingClgrStudentList &&
          this.teachingClgrStudentList.page &&
          this.teachingClgrStudentList.page.number_of_elements
            ? this.teachingClgrStudentList.page.number_of_elements
            : 0,
        number:
          this.teachingClgrStudentList &&
          this.teachingClgrStudentList.page &&
          this.teachingClgrStudentList.page.number
            ? this.teachingClgrStudentList.page.number
            : 0,
      };
    },
  },
  methods: {
    getDateBirthDayUTC,
    ...mapActions("elearning/students", ["getTeachingClgrStudent", "exportTeachingClgrStudent"]),
    ...mapMutations("elearning/students", ["setStudentSort"]),
    getListClgrStudent() {
      this.getTeachingClgrStudent(this.paramStudent);
    },
    onPageChange(e) {
      this.paramStudent.page = e && e.number ? e.number + 1 : 1;
      this.getListClgrStudent();
    },
    searchStudent: debounce(function (name) {
      this.nameKeyword = name;
    }, 300),
    sortTable(val) {
      this.setStudentSort();
    },

    async handleExport() {
      console.log("[handleExport]", this.paramStudent);
      try {
        delete this.paramStudent.page;
        delete this.paramStudent.limit;

        this.showModalExport = true;
        const result = await this.exportTeachingClgrStudent(this.paramStudent);

        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        const fileName = `Student_List.xlsx`;
        link.href = url;
        link.setAttribute("download", fileName); //or any other extension
        document.body.appendChild(link);
        link.click();
      } catch (err) {
        console.log("");
        this.$toasted.error(err);
      } finally {
        this.showModalExport = false;
      }
    },
  },
  watch: {
    nameKeyword: async function (newValue) {
      if (newValue) {
        this.paramStudent.page = 1;
        this.paramStudent.keyword = newValue;
        this.getTeachingClgrStudent(this.paramStudent);
      } else {
        this.paramStudent.page = 1;
        this.paramStudent.keyword = null;
        this.getTeachingClgrStudent(this.paramStudent);
      }
    },
    currentGroupCls(newVal) {
      if (newVal && newVal.value != null) {
        if (newVal.type == "CLASS") {
          this.paramStudent.page = 1;
          this.paramStudent.group_id = null;
          this.paramStudent.class_id = newVal.value;
          this.getTeachingClgrStudent(this.paramStudent);
        } else {
          this.paramStudent.page = 1;
          this.paramStudent.class_id = null;
          this.paramStudent.group_id = newVal.value;
          this.getTeachingClgrStudent(this.paramStudent);
        }
      } else {
        this.paramStudent.page = 1;
        this.paramStudent.class_id != null
          ? (this.paramStudent.class_id = null)
          : (this.paramStudent.group_id = null);
        this.getTeachingClgrStudent(this.paramStudent);
      }
    },
  },
};
</script>

<style lang="scss">
.students-table-extend-content {
  background: #fafafa;
  padding: 2rem;
}
.records-table-arrow {
  font-size: 2.4rem;
  color: rgba(0, 0, 0, 0.54);
  margin-left: 3px;
  transition: transform 0.3s;
  tr.expanded & {
    transform: rotate(-180deg);
  }
}
</style>