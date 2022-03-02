<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <ElearningManagerSide :active="15" />
      </div>
      <div class="col-md-9">
        <sub-block-section>
          <div slot="title" class="exam-manager__title-block">
            <button class="d-flex align-items-center">
              <IconKeyboardArrowLeft24px class="fill-primary mr-3" />
            </button>
            {{get(this,"detailSemester.name",'')}}
          </div>
          <div slot="content" class="exam-manager__content">
            <div class="d-flex">
              <app-button color="secondary" @click="isConfirmDelete=true">
                <IconDelete24px class="mr-2" :height="16" />
                Xóa
              </app-button>
              <app-button class="ml-auto">
                <IconAdd24px class="mr-2" :height="16" />
                Thêm mới
              </app-button>
            </div>
            <div>
              <app-table-extend
                :heads="heads"
                :data="bankExamContent"
                class="mt-4"
                multipleSelection
                :pagination="bankExamPagination"
                @pagechange="changePagination"
                @selectionChange="handleSelect"
                :loading="loading"
              >
                <template v-slot:cell(title)="{ row }">
                  <td>
                    <div class="d-flex align-items-center">
                      {{ row.title }}
                      <IconKeyboardArrowDown />
                    </div>
                  </td>
                </template>
                <td
                  slot="expandedRowRender"
                  slot-scope="{ row }"
                  :colspan="heads.length + 1"
                >
                  <div class="table-extend-content">
                    <p>
                      Thời gian làm bài:
                      <span class="text-primary">{{get(row,"settings.duration",'0')}} phút</span>
                    </p>
                    <p>
                      Số lần làm bài tối đa: <span class="text-primary">{{get(row,"settings.works",'0')}} </span>
                    </p>
                  </div>
                </td>
                <template v-slot:cell(type)="{ row }">
                  <td>
                    <span>{{ get(row,"type","") | exType2Txt }}</span>
                  </td>
                </template>
                <template v-slot:cell(noQuestion)="{ row }">
                  <td>
                    <span>{{get(row,"statistic.questions","0")}}</span>
                  </td>
                </template>
                <template v-slot:cell(noStudent)="{ row }">
                  <td>
                    <span>{{get(row,"statistic.participants","0")}}</span>
                  </td>
                </template>
                <template v-slot:cell(start_time)="{ row }">
                  <td>
                    <span>{{get(row,"settings.start_time","")}}</span>
                  </td>
                </template>
                <template v-slot:cell(end_time)="{ row }">
                  <td>
                    <span>{{get(row,"settings.start_time","")}}</span>
                  </td>
                </template>
                <template v-slot:cell(setting)="{ row }">
                  <td onclick="event.stopPropagation()">
                    <v-popover
                      placement="bottom"
                      popover-class=""
                      popoverBaseClass="dropdown-setting-menu"
                      popover-inner-class="bg-white dropdown-frame-border text-center px-2"
                    >
                      <button
                        class="d-flex align-items-center justify-content-center"
                      >
                        <IconSettings24px :height="15" :width="15" />
                        <IconArrowDropDown24px />
                      </button>
                      <template slot="popover" class="tooltip-detail">
                        <ul class="exam-manager__tooltip">
                          <li @click="handleShowDetail(row)">
                            <a class="d-flex align-items-center">
                              <IconVisibility24px class="fill-primary" />
                              Xem chi tiết
                            </a>
                          </li>
                          <li>
                            <a
                              :href="'./'+row.id+'/joins'"
                              class="d-flex align-items-center"
                            >
                              <IconSupervisedUserCircle24px class="icon__ms" />
                              Quản lí thí sinh
                            </a>
                          </li>
                          <li>
                            <a :href="'./create?id='+semesterID+'&test_id='+row.id" class="d-flex align-items-center">
                              <IconCreate24px class="fill-info" />
                              Chỉnh sửa
                            </a>
                          </li>
                          <li>
                            <a href="" class="d-flex align-items-center">
                              <IconDelete24px class="fill-secondary" />
                              Xóa
                            </a>
                          </li>
                        </ul>
                      </template>
                    </v-popover>
                  </td>
                </template>
              </app-table-extend>
            </div>
          </div>
        </sub-block-section>
      </div>
    </div>
    <ModalExamDetail 
      v-if="showModal" 
      @close="showModal = false"
      :examDetail="examDetail"
    />
    <app-modal-confirm
        v-if="isConfirmDelete"
        title="Bạn có chắc muốn xóa"
        @cancel="isConfirmDelete = false"
        @ok="handleDeleteTest"
    />
  </div>
</template>

<script>
import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
import IconKeyboardArrowLeft24px from "~/assets/svg/v2-icons/keyboard_arrow_left_24px.svg?inline";
import IconDelete24px from "~/assets/svg/v2-icons/delete_24px.svg?inline";
import IconAdd24px from "~/assets/svg/v2-icons/add_24px.svg?inline";
import IconSettings24px from "~/assets/svg/v2-icons/settings_24px.svg?inline";
import IconArrowDropDown24px from "~/assets/svg/v2-icons/arrow_drop_down_24px.svg?inline";
import IconKeyboardArrowDown from "~/assets/svg/v2-icons/keyboard_arrow_down_24px.svg?inline";
import IconVisibility24px from "~/assets/svg/v2-icons/visibility_24px.svg?inline";
import IconSupervisedUserCircle24px from "~/assets/svg/v2-icons/supervised_user_circle_24px.svg?inline";
import IconCreate24px from "~/assets/svg/v2-icons/create_24px.svg?inline";
import ModalExamDetail from "~/components/page/elearning/exams/ModalExamDetail";
import { mapActions, mapGetters, mapState } from "vuex";
import { get,map } from "lodash";

export default {
  components: {
    ElearningManagerSide,
    IconKeyboardArrowLeft24px,
    IconDelete24px,
    IconAdd24px,
    IconSettings24px,
    IconArrowDropDown24px,
    IconKeyboardArrowDown,
    IconVisibility24px,
    IconSupervisedUserCircle24px,
    IconCreate24px,
    ModalExamDetail
  },

  data() {
    return {
      loading: false,
      payload: {
        category: "EXAM",
        parent: "EXAM",
        parent_id: null,
        page: 1,
        size: 10
      },
      showModal: false,
      heads: [
        {
          name: "name",
          text: "Tiêu đề"
        },
        {
          name: "type",
          text: "Thể loại"
        },
        {
          name: "noQuestion",
          text: "Số câu hỏi"
        },
        {
          name: "noStudent",
          text: "số thí sinh"
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
      pagination: {
        size: 10,
        total_pages: 5,
        total_elements: 50,
        first: true,
        last: false,
        number_of_elements: 50,
        number: 1
      },
      examDetail:null,
      ids:[],
      isConfirmDelete:false,
      semesterID: this.$route.params.exam_id
    };
  },
  computed:{
    ...mapGetters("elearning/manager/bank/exam",["bankExamContent","bankExamPagination"]),
    ...mapState("elearning/semester/manage-exam",["detailSemester"])
  },
  asyncData({ params }) {
    return {
      payload: {
        parent_id: params.exam_id,
        category:'exam',
        page:1
      }
    };
  },

  created() {
    console.log("[created]", this.payload);
    this.fetchTest();
    this.fetchDetailSemester();
  },

  methods: {
    ...mapActions("elearning/manager/bank/exam", ["bankExamlist"]),
    ...mapActions("elearning/manager/bank/exam", ["bankExamDetail"]),
    ...mapActions("elearning/manager/bank/exam", ["bankExamDeleteMultile"]),
    ...mapActions("elearning/semester/manage-exam",["getDetailSemesterExam"]),
    async fetchTest() {
      console.log("[handleSearch]", this.payload);
      this.loading = true;
      await this.bankExamlist(this.payload);
      this.loading = false;
    },
    async handleShowDetail(val) {
      this.showModal = true;
      this.examDetail = val;
      console.log(this.examDetail)
      const data = {
        parent_id: val.id,
        parent: 'test',
        size:9999
      }
      await this.bankExamDetail(data);
    },
    changePagination(val){
      console.log(val)
      this.payload.page = val.number + 1;
      this.fetchTest();
    },
    handleSelect(val){
      this.ids = _.map(val, 'id');
    },
    async handleDeleteTest(){
      console.log(this.ids)
      let data = {
        ids: this.ids
      }
      const res = await this.bankExamDeleteMultile(data)
      if (get(res, "success", false)) {
        this.$toasted.success('Thành công')
        this.fetchTest();
        return;
      }
      this.$toasted.error(get(res, "message", "Có lỗi xảy ra"))
    },
    async fetchDetailSemester(){
      const  data = {
        exam_id : this.semesterID
      }
      await this.getDetailSemesterExam(data)
    },
    get
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/course/create/_setting-menu.scss";
@import "~/assets/scss/components/elearning/exams/_semester-manager.scss";
</style>
