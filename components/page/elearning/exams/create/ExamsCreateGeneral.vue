<template>
  <div class="exams-create-general">
    <sub-block-section title="Thông tin chung">
      <template v-slot:content>
        <div class="ecg__wrapper">
          <p class="ecg__title">Tên kỳ thi <span>(Tối đa 150 ký tự)</span></p>
          <app-input :counter="150" v-model="payload.name" :validate="validate.name"/>
          <div class="d-flex">
            <div class="mr-4">
              <p class="ecg__title">Khối lớp</p>
              <app-select-check
                placeholder="Chọn khối lớp"
                bordered
                :options="gradesOpts"
                v-model="payload.grade_id"
                :class="validate.grade == 2 ? 'border-red' : ''"
              />
            </div>
            <div>
              <p class="ecg__title">Môn học</p>
              <app-select-check
                placeholder="Chọn môn học"
                bordered
                mode="multiple"
                :options="subjectsOpts"
                v-model="payload.subject_ids"
                :class="validate.subject == 2 ? 'border-red' : ''"
              />
            </div>
          </div>
          <div class="mt-4">
            <p class="ecg__title">
              Mô tả kỳ thi <span>(Tối thiểu 100 ký tự)</span>
            </p>
            <app-editor
              class="bg-input-gray mb-3"
              :sticky-offset="`{ top: 70, bottom: 0 }`"
              v-model="payload.description"
              :class="validate.description == 2 ? 'border-red' : ''"
            />
          </div>
          <CourseSelectImage
            :default_image="(examInfo && examInfo.avatar) ? get(examInfo, 'avatar', '') : '/images/default-course-image.png'"
            @onSelectFile="handleSelectAvatar"
            :minWidth="340"
            :minHeight="204"
            :title="'Hình ảnh đại diện'"
            class="mt-4"
            id="avatar"
          />
        </div>
      </template>
    </sub-block-section>
    <div class="w-100 d-flex">
      <app-button class="ml-auto" :loading="loading" @click="handleAdd"
        ><Forward class="mr-2" /> Lưu & Tiếp tục
      </app-button>
    </div>
  </div>
</template>

<script>
import CourseSelectImage from "~/components/page/course/create/info/CourseSelectImage";
import Forward from "~/assets/svg/v2-icons/forward_2.svg?inline";

import { get, toNumber } from "lodash";
import { mapGetters, mapActions, mapState } from "vuex";
import { RESPONSE_SUCCESS } from "~/utils/config";

export default {
  components: {
    CourseSelectImage,
    Forward
  },

  data() {
    return {
      subjectsOpts: [],
      subject_ids: [],
      payload: {
        name: '',
        avatar: null,
        description: "",
        grade_id: null,
        subject_ids: [],
      },
      loading: false,
      first: true,
      first_grade_id: null,
      validate: {
        name: 0, 
        grade: 0,
        subject: 0,
        description: 0,
      },
      error: {
        description: "",
        name: "",
        benefit: "",
        subject: "",
        grade: "",
        type: "",
        avatar: "",
      }
    };
  },
  computed: {
    ...mapState("auth", {
      userLogin: "token",
    }),
    ...mapGetters("elearning/public/public-grades", ["gradesAllOpts"]),
    ...mapState("elearning/semester/manage-exam", {
      examInfo: "detailSemester"
    }),
    gradesOpts() {
      return this.gradesAllOpts.filter(item => item.value != null)
    }
  },

  watch: {
    'payload.name'(newValue, oldValue) {
      this.validate.name = 0
    },
    'payload.grade_id'(newValue, oldValue) {
      this.validate.grade = 0;
      this.getSubjects();
    },
    'payload.subject_ids'(newValue, oldValue) {
      this.validate.subject = 0
    },
    'payload.description'(newValue, oldValue) {
      this.validate.description = 0
    },
    subjectsOpts() {
      this.changeGrade();
    }
  },

  methods: {
    ...mapActions("elearning/school/school-apply-subject", ["schoolApplySubjectList"]),
    ...mapActions("elearning/semester/manage-exam", ["addSemesterExam", "getDetailSemesterExam"]),

    checkValidate() {
      let check = false;

      if (this.payload.name == null || this.payload.name == '') {
        this.validate.name = 2;
        check = true
      }
      if (this.payload.description == null || this.payload.description == '' || this.payload.description == '<p></p>' || this.payload.description.length < 100) {
        this.validate.description = 2;  
        check = true;
      }
      if (this.payload.grade_id == null || this.payload.grade_id == '') {
        this.validate.grade = 2;
        check = true
      }
      if (this.payload.subject_ids.length == 0) {
        this.validate.subject = 2;
        check = true
      }

      return check
    },

    async handleAdd() {
      if (this.checkValidate()) return
      
      this.loading = true;

      const formData = new FormData();
      console.log("[this.payload.subject_ids]", this.payload.subject_ids);
      const subject_ids = this.payload.subject_ids.map(item => {
        return {
          "id": item
        };
      });

      if (get(this.$route, 'query.id', false)) formData.append("id",this.$route.query.id);
      formData.append("name", this.payload.name);
      formData.append("avatar", this.payload.avatar);
      formData.append("description", this.payload.description);
      formData.append("grade_id", this.payload.grade_id);
      formData.append("subject_ids", JSON.stringify(subject_ids));

      const result = await this.addSemesterExam(formData);
      if (result.success == RESPONSE_SUCCESS) {
        this.$toasted.success( 
          get(this.$route, 'query.id', false) ? 
          "Cập nhật kỳ thi thành công" :
          "Thêm mới kỳ thi thành công");
        this.$emit('go-setting', get(result, 'data.id', ''));
      } else {
        this.$toasted.error(get(result, 'message', 'Có lỗi xảy ra'));
      }

      this.loading = false;
    },

    setPayload() {
      this.subject_ids = get(this.examInfo, "subjects", []).map(item => {
        return item.id;
      });

      this.payload.name = get(this.examInfo, "name", "");
      // this.payload.avatar = get(this.examInfo, "avatar", null);
      this.payload.description = get(this.examInfo, "description", "");
      this.payload.grade_id = get(this.examInfo, "grades.id", "") ? get(this.examInfo, "grades.id", "").toString() : null;
      this.payload.subject_ids = [...this.subject_ids];
      this.first_grade_id = this.payload.grade_id;
    },

    handleSelectAvatar(avatar) {
      this.payload.avatar = avatar;
    },
    
    async changeGrade() {
      if (!this.first) {
        if (this.payload.grade_id == this.first_grade_id) {
          this.payload.subject_ids = [...this.subject_ids];
        } else {
           this.payload.subject_ids = [];
        }
      }
      console.log(this.payload.subject_ids)
      console.log(this.subjectsOpts)
      this.first = false;
    },

    async getSubjects() {
      let payload = {};
      payload.school_id = get(this, "userLogin.organization.id", "");
      if (this.payload.grade_id) {
        payload.grade_id = this.payload.grade_id;

        const result = await this.schoolApplySubjectList(payload);
        if (result.success == RESPONSE_SUCCESS) {
          let data = get(result, 'data', []);
          this.subjectsOpts = data.map((item) => ({
            value: toNumber(item.id),
            text: item.name,
          }));
        }
      }
    },

    async handleGetData() {
      if (this.$route.query && this.$route.query.id) {
        const res = await this.getDetailSemesterExam({exam_id: this.$route.query.id});
        await this.setPayload();
        await this.getSubjects();
      }
    },

    get
  },

  created() {
    this.handleGetData();
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/exams/_exams-create-general.scss";
</style>
