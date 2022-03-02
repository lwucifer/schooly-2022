<template>
  <app-modal
    title="Sửa ngân hàng đề thi"
    width="607px"
    @close="close"
    :footer="false"
  >
    <template #content>
      <div class="row">
        <div class="col-2">
          <label>Tiêu đề</label>
        </div>

        <div class="col-10 mb-4">
          <app-input
            class="mb-0 w-100"
            placeholder="Nhập tiêu đề"
            :counter="150"
            v-model="payload.name"
            @input="handleName"
          />
          <app-error :error="errorName"></app-error>
        </div>

        <div class="col-2">
          <label>Khối</label>
        </div>

        <div class="col-10 mb-4">
          <app-select
            class="mb-0 w-100"
            placeholder="Chọn khối"
            :default-value="dataEditExam.grade ? dataEditExam.grade.id.toString() : null"
            :options="gradesAddOpts"
            @change="handleChangeGrade"
          />
        </div>

        <div class="col-2">
          <label>Môn học</label>
        </div>

        <div class="col-10 mb-4">
          <app-select
            class="mb-0 w-100"
            placeholder="Chọn loại môn học"
            :options="subjectAddOpts"
            v-model="payload.subject_id"
          />
        </div>

        <div class="col-2">
          <label>Loại đề thi</label>
        </div>

        <div class="col-10 mb-4">
          <app-select
            class="mb-0 w-100"
            placeholder="Chọn loại đề thi"
            :default-value="dataEditExam.type ? dataEditExam.type.toLowerCase() : null"
            disabled
            :options="typeOpts"
            @change="handleChangeType"
          />
        </div>

        <div class="col-2">
          <label>Mô tả</label>
        </div>

        <div class="col-10 mb-4">
          <app-input
            class="mb-0 w-100"
            textarea
            v-model="payload.description"
          />
        </div>

        <div class="col-2"></div>
        <div class="col-10">
          <app-button
            outline
            class="text-secondary mr-4 w-120"
            color="default"
            @click="close"
            >Huỷ</app-button
          >
          <app-button
            class="w-120"
            color="primary"
            @click="acceptAddExam"
            :disabled="!disabledBtn"
            >Xác nhận</app-button
          >
        </div>
      </div>
    </template>
  </app-modal>
</template>

<script>
import * as APIs from "~/utils/endpoints";
import { mapActions, mapState, mapGetters } from "vuex";
import { BANK_EXAM } from "../../../../../../utils/mutation-types";
import result from "../../../../../../store/elearning/teaching/result";
const EXAM_STORE = `elearning/manager/bank/exam`;
export default {
  props: {
    dataEditExam: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      gradesAddOpts: [],
      subjectAddOpts: [],
      typeOpts: [
        { value: "essay", text: "Tư luận" },
        { value: "choise", text: "Trắc nghiệm" },
        { value: "mix", text: "Hỗn hợp" },
      ],
      payload: {
        name: "",
        description: "",
        grade_id: null,
        subject_id: null,
        type: null,
      },
      errorName: "",
    };
  },
  computed: {
    ...mapGetters("auth", ["organizationId", "organizationLevel"]),
    disabledBtn() {
      return (
        !this.errorName &&
        !!this.payload.name &&
        !!this.payload.grade_id &&
        !!this.payload.subject_id &&
        !!this.payload.type
      );
    },
  },
  created() {
    console.log('dataEditExam', this.dataEditExam);
    this.cloneDataEdit();
    this.getGradesAllAdd();
    this.getSubjectAdd();
  },
  methods: {
    ...mapActions(EXAM_STORE, ["bankExamAdd"]),

    async getGradesAllAdd() {
      const doGet = await this.$axios.$get(APIs.COMMON_GRADES, {
        params: {
          school_id: this.organizationId ? this.organizationId : null,
          school_level: this.organizationLevel ? this.organizationLevel : null,
        },
      });

      if (doGet.success) {
        this.gradesAddOpts = doGet.data.map((item) => ({
          value: item.id,
          text: item.name,
        }));
      }
    },
    async getSubjectAdd() {
      const doGet = await this.$axios.$get(APIs.ELEARNING_PUBLIC_SUBJECT);

      if (doGet.success) {
        this.subjectAddOpts = doGet.data.map((item) => ({
          value: item.id,
          text: item.name,
        }));
      }
    },
    cloneDataEdit(){
      this.payload.name = this.dataEditExam.name || '';
      this.payload.grade_id = this.dataEditExam.grade ? this.dataEditExam.grade.id : '';
      this.payload.subject_id = this.dataEditExam.subject ? this.dataEditExam.subject.id : '';
      this.payload.type = this.dataEditExam.type || '';
      this.payload.description = this.dataEditExam.description || '';
    },
    acceptAddExam() {
      const body = new FormData();
      body.append("category", "exam");
      body.append("parent", "bank");
      body.append("name", this.payload.name);
      body.append("description", this.payload.description);
      body.append("type", this.payload.type);
      body.append("grade_id", this.payload.grade_id);
      body.append("subject_id", this.payload.subject_id);
      body.append("id", this.dataEditExam.id);
      this.bankExamAdd(body).then((result) => {
        if (result.success) {
          this.$emit("bankExamEditSuccess");
        }
      });
    },
    handleName(val) {
      console.log("val", val);
      if (val.length > 150) {
        this.errorName = "Bạn đã nhập quá số ký tự cho phép";
      } else {
        this.errorName = "";
      }
    },

    handleChangeGrade(val){
      this.payload.grade_id = val;
    },
    handleChangeType(val){
      this.payload.type = val;
    },

    close() {
      this.$emit("close");
    },
  },
};
</script>

<style></style>
