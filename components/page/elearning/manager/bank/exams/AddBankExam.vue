<template>
  <app-modal 
    title="Thêm mới ngân hàng đề thi" 
    width="607px" 
    @close="close" 
    :footer="false"
    centered
    >
    <template #content>
      <div class="row mb-4">
        <div class="col-2" style="margin: auto 0">
          <label>Tiêu đề</label>
        </div>

        <div class="col-10">
          <app-input
            class="mb-0 w-100"
            placeholder="Nhập tiêu đề"
            :counter="150"
            v-model="payload.name"
            @input="handleName"
          />
          <app-error :error="errorName"></app-error>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-2" style="margin: auto 0">
          <label>Khối</label>
        </div>

        <div class="col-10">
          <app-select
            bordered
            class="mb-0 w-100"
            placeholder="Chọn khối"
            :options="gradesAddOpts"
            v-model="payload.grade_id"
          />
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-2" style="margin: auto 0">
          <label>Môn học</label>
        </div>

        <div class="col-10">
          <app-select
            bordered
            class="mb-0 w-100"
            placeholder="Chọn môn học"
            :options="subjectAddOpts"
            v-model="payload.subject_id"
          />
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-2" style="margin: auto 0">
          <label>Loại đề thi</label>
        </div>

        <div class="col-10">
          <app-select
            bordered
            class="mb-0 w-100"
            placeholder="Chọn loại đề thi"
            :options="typeOpts"
            v-model="payload.type"
          />
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-2" style="margin: auto 0">
          <label>Mô tả</label>
        </div>

        <div class="col-10">
          <app-input class="mb-0 w-100" textarea v-model="payload.description" />
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-2"></div>
        <div class="col-10">
          <app-button outline class="text-secondary mr-4 w-120" color="default" @click="close">Huỷ</app-button>
          <app-button
            class="w-120"
            color="primary"
            @click="acceptAddExam"
            :disabled="!disabledBtn"
          >Xác nhận</app-button>
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
  data() {
    return {
      gradesAddOpts: [],
      subjectAddOpts: [],
      typeOpts: [
        { value: "essay", text: "Tư luận" },
        { value: "choice", text: "Trắc nghiệm" },
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
    this.getGradesAllAdd();
    this.getSubjectAdd();
  },
  methods: {
    ...mapActions(EXAM_STORE, ["bankExamAdd"]),
    close() {
      this.$emit("close");
    },
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
    acceptAddExam() {
      const body = new FormData();
      body.append("category", "exam");
      body.append("parent", "bank");
      body.append("name", this.payload.name);
      body.append("description", this.payload.description);
      body.append("type", this.payload.type);
      body.append("grade_id", this.payload.grade_id);
      body.append("subject_id", this.payload.subject_id);
      this.bankExamAdd(body).then((result) => {
        if (result.success) {
          this.$emit("bankExamAddSuccess");
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
  },
};
</script>

<style>
</style>