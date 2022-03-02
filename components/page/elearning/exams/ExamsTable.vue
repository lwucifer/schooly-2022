<template>
  <div class="exams-table">
    <app-table-extend
      :heads="heads"
      :data="semesterContent"
      :pagination="semesterPagination"
      @pagechange="onPageChange"
      @checkClick="handleClickRow"
      class="mt-4"
    >
      <template v-slot:cell(action)="{ row }" >
        <td style="width:3rem" v-if="row.status == 'APPROVED'">
          <button
            class="w-100 d-flex align-items-center justify-content-center"
          >
            <IconEllipse2 height="7" width="7" v-if="row.enable" />
            <IconEllipse height="7" width="7" v-else />
          </button>
        </td>
        <!-- <td v-else></td> -->
      </template>
      <td
        slot="expandedRowRender"
        slot-scope="{ row }"
        :colspan="heads.length + 1"
        class="p-0"
      >
         <ExamsCase 
          :tab="tab"
          :detail="row"
        />
        <!-- <div class="wrap-expanded-render">
          <div class="row">
            <div class="col-md-4 exams-case__text">
              <div class="mb-3">
                Trạng thái:
                <span
                  class="font-weight-medium"
                  :class="row.action ? 'text-primary ' : 'text-secondary'"
                  >Đang hoạt động</span
                >
              </div>
              <div>
                Hiển thị:
                <span class="text-primary font-weight-medium">Công khai</span>
              </div>
            </div>
            <div class="col-md-4">
              <div class="mb-3">
                Số đề thi:
                <span class="text-primary font-weight-medium">1</span>
              </div>
              <div>
                Lệ phí:
                <span class="text-primary font-weight-medium">500.00 đ</span>
              </div>
            </div>
            <div class="col-md-4">
              <div class="mb-3">
                Số lượng thi:
                <span class="text-primary font-weight-medium">1</span>
              </div>
              <div>
                Số thí sinh tham gia:
                <span class="text-primary font-weight-medium">2</span>
              </div>
            </div>
          </div>
        </div> -->
      </td>
      <template v-slot:cell(name)="{ row }">
        <td>
          <div class="d-flex align-items-center">
            {{ row.name }}
            <IconKeyboardArrowUp24px class="ml-3 fill-primary" v-if="rowClick.includes(row)"/>
            <IconKeyboardArrowDown class="ml-3" v-else/>
          </div>
        </td>
      </template>
      <template v-slot:cell(grades)="{ row }">
        <td>
          <div class="d-flex align-items-center">
            {{ row.grades.name }}
          </div>
        </td>
      </template>
      <template v-slot:cell(start_time)="{ row }">
        <td>
          <div class="d-flex align-items-center">
            {{ row.settings.start_time }}
          </div>
        </td>
      </template>
      <template v-slot:cell(end_time)="{ row }">
        <td>
          <div class="d-flex align-items-center">
            {{ row.settings.end_time }}
          </div>
        </td>
      </template>
      <template v-slot:cell(subjects)="{ row }">
        <td>
          <div v-for="item in row.subjects" :key="item.id">
            {{ item.name }}
          </div>
        </td>
      </template>
      <template v-slot:cell(setting)="{ row }">
        <td class="wrap-btn-setting" onclick='event.stopPropagation();'>
          <ExamButtonMenu 
            class="btn-setting"
            @manageSemester="handleManageSemester(row)"
            @deleteSemester="$emit('deleteSemester',row.id)"
            @changeEnable="$emit('changeEnable',row)"
            @showReason="showReasonDenied(row)"
            @editSemester="handleEditSemester(row)"
            :tab="tab"
            :enable="row.enable"
          />
        </td>
      </template>
    </app-table-extend>
    <app-modal
      title="Lý do từ chối"
      v-if="isShowModal"
      @close="isShowModal = false"
    >
      <template v-slot:content>
        <p>{{reason}}</p>
      </template>
      <template v-slot:footer>
        <div class="text-center">
          <app-button 
            @click="isShowModal = false"
            style="width:12.9rem"
          >
            Đóng
          </app-button>
        </div>
      </template>
    </app-modal>
  </div>
</template>

<script>
import IconEllipse from "~/assets/svg/icons/ellipse.svg?inline";
import ExamsCase from "~/components/page/elearning/exams/ExamsCase";
import ExamButtonMenu from "~/components/page/elearning/exams/ExamButtonMenu";
import IconKeyboardArrowDown from "~/assets/svg/v2-icons/keyboard_arrow_down_24px.svg?inline";
import IconEllipse2 from "~/assets/svg/icons/ellipse2.svg?inline";
import IconKeyboardArrowUp24px from '~/assets/svg/v2-icons/keyboard_arrow_up_24px.svg?inline';
import { mapGetters } from "vuex";
import { get } from "lodash"
export default {
  components: {
    IconEllipse,
    IconEllipse2,
    IconKeyboardArrowDown,
    IconKeyboardArrowUp24px,
    ExamButtonMenu,
    ExamsCase
  },
  props: {
    tab: {
      type: String,
      default: "APPROVED"
    }
  },
  data() {
    return {
      rowClick:[],
      heads: [
        {
          name: "action",
          text: ""
        },
        {
          name: "name",
          text: "Tên kỳ thi"
        },
        {
          name: "grades",
          text: "Khối"
        },
        {
          name: "subjects",
          text: "Môn học"
        },
        {
          name: "start_time",
          text: "Bắt đầu"
        },
        {
          name: "end_time",
          text: "Kết thúc"
        },
        {
          name: "setting",
          text: ""
        }
      ],
      reason:"",
      isShowModal:false
    };
  },

  computed: {
    ...mapGetters("elearning/semester/manage-exam", [
      "semesterContent",
      "semesterPagination"
    ])
  },

  methods: {
    handleSort(e) {
      this.$emit("sort", e);
    },

    onPageChange(e) {
      this.$emit("pagechange", e);
    },

    handleClickRow(val) {
      if (!val) return;
      if (this.rowClick.includes(val)) {
        this.rowClick = this.rowClick.filter(
          item => item !== val
        );
      } else {
        this.rowClick = [...this.rowClick, val];
      }
    },
    handleManageSemester(val){
      this.$router.push("./semester/"+val.id)
    },
    showReasonDenied(dt){
      this.reason = dt.note;
      this.isShowModal= true;
    },
    handleEditSemester(val){
      this.$router.push("./semester/create?id="+val.id)
      console.log(val.id)
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/exams/_exams-table.scss";
</style>
