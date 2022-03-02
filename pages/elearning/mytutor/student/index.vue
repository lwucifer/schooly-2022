<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <MenuSideMyTutor :active="2" :group="2" />
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
              <app-button
                size="sm"
                color="transparent"
                class="ml-auto color-blue"
                @click="handleExport"
              >
                <IconLocalPrintshop24px class="mr-3" />Xuất Excel
              </app-button>
            </div>
            <app-table
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
                    <span>{{get(row, "student_name", '--')}}</span>

                    <!-- <IconKeyboardArrowDown24px class="ml-3 records-table-arrow" /> -->
                    <!-- <IconKeyboardArrowUp24px class="ml-3" v-else /> -->
                  </div>
                </td>
              </template>
              <template v-slot:cell(code)="{ row }">
                <td>
                  <div class="d-flex align-items-center">{{get(row, "student_number", '--')}}</div>
                </td>
              </template>
              <template v-slot:cell(sex)="{ row }">
                <td>
                  <div class="d-flex align-items-center">
                    <span>{{get(row, "sex_vi", '')}}</span>
                  </div>
                </td>
              </template>
              <template v-slot:cell(class)="{ row }">
                <td>
                  <div class="d-flex align-items-center">{{get(row, "class_groups", '')}}</div>
                </td>
              </template>
              <template v-slot:cell(birthday)="{ row }">
                <td>
                  <div class="d-flex align-items-center">
                    <span>{{get(row, "date", '') ? getDateBirthDayUTC(get(row, "date", '')) : '--'}}</span>
                  </div>
                </td>
              </template>
            </app-table>
          </template>
        </sub-block-section>
      </div>
    </div>

    <app-modal centered :footer="false" title="Đang xuất dữ liệu" v-if="showModalExport">
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
import { debounce, get } from "lodash";
import * as actionTypes from "~/utils/action-types";
import { getDateBirthDayUTC } from "~/utils/moment";
import MenuSideMyTutor from "~/components/page/elearning/mytutor/MenuSideMyTutor";
const STORE_NAMESPACE_OLCLASS = "elearning/teaching/olclass";
export default {
  components: {
    ElearningManagerSide,
    IconLocalPrintshop24px,
    IconKeyboardArrowDown24px,
    IconKeyboardArrowUp24px,
    MenuSideMyTutor,
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
        page: 1,
        limit: 10,
        query: null,
        sort: null,
      },
      nameKeyword: "",
      showModalExport: false,
    };
  },
  async fetch({ params, query, store, route }) {
    const onlineClassId = query.online_class_id ? query.online_class_id : null;
    await Promise.all([
      store.dispatch(
        `${STORE_NAMESPACE_OLCLASS}/${actionTypes.TEACHING_OLCLASS_STUDENTS.LIST}`,
        {
          params: {
            page: 1,
            online_class_id: onlineClassId,
            size: 10,
          },
        }
      ),
    ]);
  },
  computed: {
    ...mapState(STORE_NAMESPACE_OLCLASS, ["Students"]),
    // ...mapState("elearning/students", ["teachingClgrStudentList"]),
    // ...mapState("elearning", ["currentGroupCls"]),
    // ...mapGetters("elearning", ["currentGroupClsDetail"]),
    filterClgrStudentList() {
      const dataStudentList = get(this, "Students.data.content", []);
      const dataMap = dataStudentList.map((item) => {
        return {
          ...item,
          class_groups:
            get(item, "class_name", "") && get(item, "groups", "")
              ? get(item, "class_name", "") + ", " + get(item, "groups", "")
              : "--",
          sex_vi: get(item, "sex", "")
            ? get(item, "sex", "") == "MALE"
              ? "Nam"
              : "Nữ"
            : "--",
        };
      });
      return dataMap;
    },
    filterPagination() {
      return {
        size: get(this, "Students.data.size", 10),
        total_pages: get(this, "Students.data.total_pages", 1),
        total_elements: get(this, "Students.data.total_elements", 0),
        first: get(this, "Students.data.first", 1),
        last: get(this, "Students.data.last", 1),
        number_of_elements: get(this, "Students.data.number_of_elements", 0),
        number: get(this, "Students.data.number", 0),
      };
    },
  },
  created() {
    this.paramStudent.online_class_id = get(
      this,
      "$route.query.online_class_id",
      null
    );
  },
  methods: {
    get,
    getDateBirthDayUTC,
    ...mapActions(STORE_NAMESPACE_OLCLASS, ["teachingOlclassStudentList"]),
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
      console.log("val", val.order);
      this.paramStudent.sort = `student_name,${val.order}`;

      this.teachingOlclassStudentList({ params: this.paramStudent });
      // this.setStudentSort();
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
        this.paramStudent.query = newValue;
        this.teachingOlclassStudentList({ params: this.paramStudent });
      } else {
        this.paramStudent.page = 1;
        this.paramStudent.query = null;
        this.teachingOlclassStudentList({ params: this.paramStudent });
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