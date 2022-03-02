<template>
  <div>
    <div class="cc-panel bg-white">
      <div class="cc-panel__title">
        <h4 class="cc-panel__heading">
          Thông tin chung
        </h4>
      </div>

      <div class="cc-panel__body">
        <div class="cgi-form-group mb-4">
          <h2 class="cgi-form-title heading-6 mb-3">Loại hình học tập</h2>
          <app-radio
            name="type"
            value="LECTURE"
            @click="handleSelectType"
            :checked="payload.type === 'LECTURE'"
            :class="{ 'mr-6': true, 'disabled-input': general }"
            :disabled="general"
            >Bài giảng</app-radio
          >
          <app-radio
            name="type"
            @click="handleSelectType"
            value="COURSE"
            :class="{ 'disabled-input': general }"
            :disabled="general"
            :checked="payload.type === 'COURSE'"
            >Khoá học</app-radio
          >
          <app-error :error="get(error, 'type', '')"></app-error>
        </div>

        <div class="row">
          <div class="col-md-4 mb-4">
            <div
              class="cgi-form-group d-flex justify-content-start align-items-center"
            >
              <h2 class="cgi-form-title heading-6 mr-4">Trình độ</h2>
              <app-select
                style="width: 60%"
                class="cc-select"
                :options="grades"
                placeholder="Chọn lớp"
                @change="handleChangeGrade"
                label="name"
                :value="payload.grade.toString()"
              >
                <template slot="placeholder-icon">
                  <IconAngleDown class="icon" />
                </template>
              </app-select>
            </div>
            <app-error
              class="mt-2"
              :error="get(error, 'level', '')"
            ></app-error>
          </div>

          <div class="col-md-5 ml-5 mb-4">
            <div
              class="cgi-form-group d-flex justify-content-start align-items-center"
            >
              <h2 class="cgi-form-title heading-6 mr-4">Môn học</h2>
              <app-select
                class="cc-select"
                style="width: 60%"
                :options="subjects"
                placeholder="Chọn môn học"
                @change="handleChangeSubject"
                label="name"
                :value="payload.subject.toString()"
              >
                <template slot="placeholder-icon">
                  <IconAngleDown class="icon" />
                </template>
              </app-select>
            </div>

            <app-error
              class="mt-2"
              :error="get(error, 'subject', '')"
            ></app-error>
          </div>
        </div>

        <div class="cgi-form-group mb-4">
          <h2 class="cgi-form-title heading-6 mb-3">
            Tiêu đề {{ name }}
            <span class="text-base font-weight-normal">(Tối đa 150 ký tự)</span>
          </h2>
          <app-input
            :placeholder="`Nhập tiêu đề của` + ' ' + name"
            :counter="150"
            v-model="payload.name"
            @input="handleCheckName"
            @handleBlur="handleCheckName"
            class="mb-2"
          />
          <app-error :error="get(error, 'name', '')"></app-error>
        </div>

        <CourseBenefit
          :name="name"
          :benefit="payload.benefit"
          @removeBenefit="removeBenefit"
          @addBenefit="addBenefit"
          @cancelInputBenefit="cancelInputBenefit"
        />
        <app-error class="mb-4" :error="get(error, 'benefit', '')"></app-error>

        <div class="cgi-form-group mb-4">
          <h2 class="cgi-form-title heading-6 mb-3">
            Mô tả tổng quát
            <span class="text-base font-weight-normal"
              >(Tối thiểu 100 ký tự)</span
            >
          </h2>
          <app-editor
            class="bg-input-gray mb-3"
            :sticky-offset="`{ top: 70, bottom: 0 }`"
            v-model="payload.description"
            @input="handleCheckDescription"
            @onBlur="handleCheckDescription"
          />
          <app-error :error="get(error, 'description', '')"></app-error>
        </div>

        <CourseSelectImage
          :default_image="
            get(general, 'avatar.medium', '/images/default-course-image.png')
          "
          @onSelectFile="handleSelectAvatar"
          :minWidth="340"
          :minHeight="204"
          :title="'Hình đại diện cho ' + name"
          id="avatar"
        />
        <app-error :error="get(error, 'avatar', '')" class="mb-4"></app-error>

        <CourseSelectImage
          :isCompel="false"
          :default_image="
            get(general, 'cover_url.medium', '/images/default-course-image.png')
          "
          @onSelectFile="handleSelectCover"
          :minWidth="730"
          :minHeight="410"
          :title="'Hình minh hoạ cho ' + name"
          id="cover"
          :name="name"
        />
      </div>
      <app-modal-confirm
        centered
        v-if="showModalConfirm"
        :confirmLoading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
        :title="title_confirm"
        description="Bạn sẽ không thể thay đổi loại hình học tập sau khi xác nhận."
      />
    </div>

    <div class="create-action mt-5">
      <div class="create-action__right d-flex align-items-center">
        <app-button @click="handleCLickSave" class="create-action__btn mr-4"
          ><Forward class="mr-2" /> Lưu & Tiếp tục</app-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import * as yup from "yup";
import numeral from "numeral";
import { toNumber, get, cloneDeep, trim } from "lodash";
import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import {
  useEffect,
  getParamQuery,
  redirectWithParams,
  image,
  stripHtml,
} from "~/utils/common";
import { createPayloadAddCourse } from "~/models/course/AddCourse";
import IconAngleDown from "~/assets/svg/design-icons/angle-down.svg?inline";
const IconCheckCircle = () =>
  import("~/assets/svg/icons/check-circle.svg?inline");
const IconTrashAlt = () =>
  import("~/assets/svg/design-icons/trash-alt.svg?inline");
import CreateAction from "~/components/page/course/create/common/CreateAction";
import CourseSelectGrade from "~/components/page/course/create/info/CourseSelectGrade";
import CourseSelectSubject from "~/components/page/course/create/info/CourseSelectSubject";
import CourseSelectImage from "~/components/page/course/create/info/CourseSelectImage";
import CourseBenefit from "~/components/page/course/create/info/CourseBenefit";
import IconArrowLeft from "~/assets/svg/design-icons/arrow-left.svg?inline";
import IconDelete from "~/assets/svg/v2-icons/delete_sweep_2.svg?inline";
import IconSave from "~/assets/svg/v2-icons/save_24px.svg?inline";
import Forward from "~/assets/svg/v2-icons/forward_2.svg?inline";
import IconCalender from "~/assets/svg/v2-icons/calendar_today_24px.svg?inline";

export default {
  components: {
    IconAngleDown,
    CreateAction,
    CourseSelectGrade,
    CourseSelectSubject,
    CourseSelectImage,
    IconCheckCircle,
    IconTrashAlt,
    CourseBenefit,
    IconArrowLeft,
    IconDelete,
    IconSave,
    Forward,
    IconCalender,
  },

  data() {
    return {
      initChangeGrade: true,
      error: {
        description: "",
        name: "",
        benefit: "",
        subject: "",
        grade: "",
        type: "",
        avatar: "",
      },
      payload: {
        avatar: "",
        benefit: [],
        description: "",
        grade: "",
        name: "",
        subject: "",
        cover_image: "",
        type: "",
      },
      showModalConfirm: false,
      confirmLoading: false,
    };
  },

  mounted() {
    this.$store.dispatch(`elearning/create/resetSubjects`);
    this.initChangeGrade = true;
    useEffect(this, this.handleChangeGeneral.bind(this), ["general"]);
  },

  computed: {
    ...mapState("elearning/create", {
      general: "general",
      progress: "progress",
      subjects: "subjects",
      grades: "grades",
    }),

    ...mapState("auth", {
      userLogin: "token",
    }),

    disabled_all() {
      return this.$store.getters["elearning/create/disabled_all"];
    },

    name() {
      return this.payload.type === "COURSE" ? "khoá học" : "bài giảng";
    },

    title_confirm() {
      let title = "Xác nhận";
      if (get(this, "general.id", "")) {
        title = "Bạn có muốn tiếp tục?";
      }
      return title;
    },
  },

  methods: {
    handleCheckPayload() {
      const name = this.handleCheckName();
      const description = this.handleCheckDescription();
      const benefit = this.handleCheckBenefit();
      const subject = this.handleCheckSubject();
      const grade = this.handleCheckGrade();
      const type = this.handleCheckType();
      const avatar = this.handleCheckAvatar();
      return (
        name && description && benefit && subject && grade && type && avatar
      );
    },

    handleCheckAvatar() {
      let check = true;
      if (!get(this, "payload.avatar", true) && !this.general) {
        check = false;
        this.error.avatar = "Bạn cần chọn hình đại diện cho " + this.name;
      } else {
        this.error.avatar = "";
      }
      return check;
    },

    handleCheckType() {
      let check = true;
      if (!get(this, "payload.type", true)) {
        check = false;
        this.error.type = "Bạn cần chọn loại hình học tập";
      } else {
        this.error.type = "";
      }
      return check;
    },

    handleCheckSubject() {
      let check = true;
      if (!get(this, "payload.subject", true)) {
        check = false;
        this.error.subject = "Bạn cần chọn môn học";
      } else {
        this.error.subject = "";
      }
      return check;
    },

    handleCheckGrade() {
      let check = true;
      if (!get(this, "payload.grade", true)) {
        check = false;
        this.error.grade = "Bạn cần chọn trình độ";
      } else {
        this.error.grade = "";
      }
      return check;
    },

    handleCheckBenefit() {
      let check = true;
      if (!get(this, "payload.benefit.length", true)) {
        check = false;
        this.error.benefit = "Bạn cần thêm lợi ích";
      } else {
        this.error.benefit = "";
      }
      return check;
    },

    handleChangeGeneral() {
      this.payload.benefit = [...get(this, "general.benefit", [])];
      this.payload.description = get(this, "general.description", "");
      this.payload.name = get(this, "general.name", "");
      this.payload.grade = get(this, "general.grade.id", "");
      this.payload.subject = get(this, "general.subject.id", "");
      this.payload.type = get(this, "general.type", "");
      this.payload.elearning_id = get(this, "general.id", "");
    },

    handleCheckDescription() {
      let value = get(this, "payload.description", "").replace("<p></p>", "");
      let check = true;
      if (!value) {
        check = false;
        this.error.description = "Bạn cần nhập mô tả";
      } else if (get(value, "length", 0) > 0 && get(value, "length", 0) < 100) {
        check = false;
        this.error.description = "Mô tả tổng quát không được ít hơn 100 ký tự.";
      } else if (get(value, "length", 0) > 2000) {
        check = false;
        this.error.description = "Mô tả vượt quá số ký tự cho phép";
      } else {
        this.error.description = "";
      }
      return check;
    },

    handleCheckName(value) {
      let check = true;
      if (!get(this, "payload.name", true)) {
        check = false;
        this.error.name = "Bạn cần nhập tên" + " " + this.name;
      } else if (get(this, "payload.name.length", 0) > 150) {
        check = false;
        this.error.name = "Tên " + this.name + " vượt quá số ký tự cho phép";
      } else {
        this.error.name = "";
      }
      return check;
    },

    removeBenefit(index) {
      this.payload.benefit = this.payload.benefit.filter(
        (item, i) => i !== index
      );
      this.handleCheckBenefit();
    },

    cancelInputBenefit() {
      this.handleCheckBenefit();
    },

    addBenefit(html) {
      this.payload.benefit.push(html);
      this.handleCheckBenefit();
    },

    handleFetchElearningGeneral(elearning_id) {
      const options = {
        params: {
          elearning_id,
        },
      };
      this.$store.dispatch(`elearning/create/getGeneral`, options);
    },

    handleChangeGrade(grade) {
      this.payload.grade = grade;
      this.handleCheckGrade();
      if (!this.initChangeGrade) {
        this.payload.subject = "";
      }
      this.initChangeGrade = false;
      this.getSubjects();
    },

    getSubjects() {
      if (!this.payload.grade) {
        this.$store.dispatch(`elearning/create/resetSubjects`);
      }

      const params = {
        school_id: get(this, "userLogin.organization.id", ""),
        grade: this.payload.grade,
      };
      this.$store.dispatch(`elearning/create/getSubjects`, params);
    },

    handleSelectType(e) {
      this.payload.type = e.target.value;
      this.handleCheckType();
    },

    handleSelectAvatar(avatar) {
      this.payload.avatar = avatar;
      this.handleCheckAvatar();
    },

    handleSelectCover(cover) {
      this.payload.cover_image = cover;
    },

    handleChangeSubject(subject) {
      this.payload.subject = subject;
      this.handleCheckSubject();
    },

    handleCLickSave() {
      if (this.disabled_all) {
        this.$toasted.error(`${this.name} đã đăng, không được phép sửa`);
        return;
      }
      if (!this.handleCheckPayload()) {
        this.$toasted.error("Invalid params");
        return;
      }
      this.showModalConfirm = true;
    },

    async handleOk() {
      try {
        this.confirmLoading = true;
        let payload = createPayloadAddCourse(this.payload);
        const result = await this.$store.dispatch(
          `elearning/creating/creating-general/${actionTypes.ELEARNING_CREATING_GENERAL.ADD}`,
          payload
        );
        this.confirmLoading = false;
        this.showModalConfirm = false;

        if (get(result, "success", false)) {
          const elearning_id = get(result, "data.elearning_id", "");
          const options = {
            params: {
              elearning_id,
            },
          };
          await this.$store.dispatch(`elearning/create/getGeneral`, options);
          // await this.$store.dispatch(`elearning/create/getProgress`);
          redirectWithParams({ elearning_id });

          this.$toasted.success(get(result, "message", ""));

          if (this.payload.type === "LECTURE") {
            this.$emit("nextStep", "content-lecture");
          }
          if (this.payload.type === "COURSE") {
            this.$emit("nextStep", "content-course");
          }

          return;
        }
        this.$toasted.error(get(result, "message", ""));
      } catch (error) {
        this.$toasted.error("Có lỗi xảy ra");
        return;
      }
    },

    handleCancel() {
      this.showModalConfirm = false;
      this.confirmLoading = false;
    },

    numeral,
    get,
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/course/create/_create-general-information.scss";
</style>
