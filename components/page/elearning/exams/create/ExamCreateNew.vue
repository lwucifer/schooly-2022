<template>
  <div class="exam-create-new">
    <sub-block-section title="Thêm đề thi">
      <template v-slot:content>
        <div class="exam-create-new__content">
          <p class="ecn__title">
            Tiêu đề
            <span>(Tối đa 150 ký tự)</span>
          </p>
          <app-input :counter="150" v-model="payload.name" :validate="validate.name"/>
          <div class="row mx-0 my-5">
            <div class="cold-md-3 mb-4">
              <label for="grade" class="heading-5 font-weight-bold text-dark"
                >Khối lớp</label
              >
              <app-input
                id="grade"
                disabled
                class="mt-3 mb-0 w-100"
                style="width:13rem;height:4rem;"
                :value="get(examInfo, 'grades.name', '')"
              />
            </div>
            <div class="col-md-3 ml-4">
              <label for="subject" class="heading-5 font-weight-bold text-dark"
                >Môn học</label
              >
              <app-select
                placeholder="Chọn môn học"
                class="mt-3 mb-0 w-100"
                bordered
                :class="validate.subject == 2 ? 'border-red':''"
                :options="subjectsAllOpts"
                v-model="payload.subject_id"
              />
            </div>
            <div class="col-md-3 ml-3">
              <label for="type" class="heading-5 font-weight-bold text-dark"
                >Loại đề thi</label
              >
              <app-select
                placeholder="Chọn loại đề thi"
                class="mt-3 mb-0 w-100"
                bordered
                :options="typeOpts"
                v-model="payload.type"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-md-3">
              <label for="time" class="heading-5 font-weight-bold text-dark"
                >Thời gian làm bài</label
              >
              <app-input
                class="mb-0 ce-input-with-unit mt-3"
                size="md"
                style="width: 12rem;"
                min="0"
                max="180"
                type="number"
                id="time"
                v-model="payload.duration"
              >
                <div slot="unit">phút</div>
              </app-input>
            </div>

            <div class="col-12 col-md-3">
              <label for="count" class="heading-5 font-weight-bold text-dark"
                >Số lần làm bài tối đa</label
              >

              <app-input
                type="number"
                min="0"
                max="10"
                class="mb-0 ce-input-with-unit mt-3"
                size="md"
                style="width: 12rem;"
                id="count"
                v-model="payload.works"
              >
                <div slot="unit">Lần</div>
              </app-input>
            </div>
          </div>
          <p class="heading-5 font-weight-bold text-dark mt-5 mb-4">
            Cài đặt thời gian (Không bắt buộc)
          </p>
          <div class="d-flex align-items-center mb-4">
            <span class="text-left font-weight-normal">Thời gian mở đề</span>
            <app-date-picker
              class="mr-4"
              :class="validate.start_time == 2 ? 'border-red':''"
              v-model="payload.start_time"
              :valueFormat="'YYYY-MM-DD HH:mm:ss'"
              :type="'datetime'"
              :disabled="!payload.starttime_enable"
              :clearDate="!payload.starttime_enable"
            >
              <template v-slot:icon-calendar>
                <IconCalendarV2 />
              </template>
            </app-date-picker>
            <app-checkbox
              label="Áp dụng"
              class="ml-5"
              v-model="payload.starttime_enable"
            ></app-checkbox>
          </div>
          <div class="d-flex align-items-center">
            <span class="text-left font-weight-normal">Thời gian đóng đề</span>
            <app-date-picker
              class="mr-4"
              :class="validate.end_time == 2 ? 'border-red':''"
              v-model="payload.end_time"
              :valueFormat="'YYYY-MM-DD HH:mm:ss'"
              :type="'datetime'"
              :disabled="!payload.endtime_enable"
              :clearDate="!payload.endtime_enable"
            >
              <template v-slot:icon-calendar>
                <IconCalendarV2 />
              </template>
            </app-date-picker>
            <app-checkbox
              label="Áp dụng"
              class="ml-5"
              v-model="payload.endtime_enable"
            ></app-checkbox>
          </div>
          <div class="text-right mt-5">
            <app-button
              class="mr-4 px-5 text-secondary"
              color="white"
              @click="$emit('go-form')"
              >Hủy</app-button
            >
            <app-button
              @click="handleAddTest"
              class="px-4"
              >Xác nhận</app-button
            >
          </div>
        </div>
      </template>
    </sub-block-section>
  </div>
</template>

<script>
import IconCalendarV2 from "~/assets/svg/icons/calendar-v2.svg?inline";
import { get } from "lodash";
import { mapGetters, mapActions, mapState } from "vuex";
import { RESPONSE_SUCCESS } from "~/utils/config";

export default {
  components: {
    IconCalendarV2
  },
  
  data() {
    return {
      grade: "",
      typeOpts: [
        {
          value: "MIX",
          text: "Kết hợp"
        },
        {
          value: "ESSAY",
          text: "Tự luận"
        },
        {
          value: "CHOICE",
          text: "Trắc nghiệm"
        }
      ],
      payload: {
        parent: "EXAM",
        parent_id: "",
        category: "EXAM",
        type: null,
        name: "",
        grade_id: null,
        subject_id: null,
        works: 1,
        start_time: "",
        starttime_enable: false,
        end_time: "",
        status: 0,
        endtime_enable: false,
        duration: 60
      },
      validate: {
        start_time: 0,
        end_time: 0,
        subject: 0,
        name: 0
      }
    };
  },

  computed: {
    ...mapState("elearning/semester/manage-exam", {
        examInfo: "detailSemester"
    }),
    subjectsAllOpts() {
      const data = get(this.examInfo, "subjects", []);
      const subjects = data.map(item => {
        return {
          value: item.id,
          text: item.name
        };
      });

      return subjects;
    }
  },

  watch: {
    'payload.start_time'(newValue, oldValue) {
      this.validate.start_time = 0
    },
    'payload.starttime_enable'(newValue, oldValue) {
      this.validate.start_time = 0
    },
    'payload.end_time'(newValue, oldValue) {
      this.validate.end_time = 0
    },
    'payload.endtime_enable'(newValue, oldValue) {
      this.validate.end_time = 0
    },
    'payload.name'(newValue, oldValue) {
      this.validate.name = 0
    },
    'payload.subject_id'(newValue, oldValue) {
      this.validate.subject = 0
    }
  },

  methods: {
    ...mapActions("elearning/manager/bank/exam", ["addExamTest"]),
    ...mapActions("elearning/semester/manage-exam", ["getDetailSemesterExam"]),

    checkValidate() {
      let check = false;
      
      if (this.payload.name == null || this.payload.name == '') {
        this.validate.name = 2;
        check = true
      }
      if (this.payload.subject_id == null || this.payload.subject_id == '') {
        this.validate.subject = 2;
        check = true
      }
      if (
        (this.payload.start_time == null || this.payload.start_time == '')
        && this.payload.starttime_enable == true
      ) {
        this.validate.start_time = 2;
        check = true
      }
      if (
        (this.payload.end_time == null || this.payload.end_time == '')
        && this.payload.endtime_enable == true
      ) {
        this.validate.end_time = 2;
        check = true
      }

      return check
    },

    async handleAddTest() {
      if (this.checkValidate()) return

      this.loading = true;

      this.payload.parent_id = get(this.examInfo, "id", "");
      this.payload.grade_id = get(this.examInfo, "grades.id", "");

      const result = await this.addExamTest(this.payload);

      if (result.success == RESPONSE_SUCCESS) {
        this.$toasted.success("Tạo đề thi thành công");
        this.$emit("go-step2", get(result, "data.id", ""));
      } else {
        this.$toasted.error(get(result, 'message', 'Tạo đề thi thất bại'));
      }

      this.loading = false;
    },

    get
  },

  created () {
    if (get(this.$route, 'query.id', false) && !get(this.examInfo, 'id', false)) {
        this.getDetailSemesterExam({exam_id: this.$route.query.id});
    }
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/exams/_exams-create-new.scss";
</style>
