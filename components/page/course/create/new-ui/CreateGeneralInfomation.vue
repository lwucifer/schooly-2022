<template>
  <div class="row">
    <div class="col col-md-4 cgi-col-aside">
      <CreateAsideCollapse title="Hình đại diện">
        <SelectAvatar
          id="select-avatar"
          :default_image="
            checkId ? get(
              elearningDetail,
              'avatar.medium',
              require('~/assets/svg/images/default-course-image.svg?data')
            ) : require('~/assets/svg/images/default-course-image.svg?data')
          "
          :minWidth="340"
          :minHeight="204"
          @onSelectFile="handleSelectAvatar"
        />
        <app-error :error="get(error, 'avatar', '')"></app-error>
      </CreateAsideCollapse>

      <CreateAsideCollapse title="Cài đặt">
        <div>
          <div class="mb-15">
            <h5 class="mb-2">Chế độ hiển thị</h5>

            <app-select
              class="cc-select"
              @change="handleChangePrivacy"
              :disabled="disabled_all"
              :value="payload.privacy"
              :options="[
                { value: '', text: 'Chọn chế độ hiển thị' },
                { value: 'PUBLIC', text: 'Công khai' },
                { value: 'PRIVATE', text: 'Riêng tư' }
              ]"
              placeholder="Chọn chế độ hiển thị"
              size="sm"
            >
              <template slot="placeholder-icon">
                <IconAngleDown class="icon" />
              </template>
            </app-select>
            <app-error :error="get(error, 'privacy', '')" />
          </div>

          <div class="mb-15">
            <h6 class="mb-3">
              Cho phép viết bình luận tại
              {{
              get(general, "type", "") == "LECTURE" ? "bài giảng" : "khóa học"
              }}
            </h6>
            <app-radio-group>
              <app-radio
                value="1"
                class="mr-4"
                :checked="payload.allow_comment === true"
                @click="handleChangeCommentAllow(true)"
              >Có</app-radio>
              <app-radio
                value="0"
                :checked="payload.allow_comment === false"
                @click="handleChangeCommentAllow(false)"
              >Không</app-radio>
            </app-radio-group>
            <app-error :error="get(error, 'comment_allow', '')" />
          </div>

          <div class="mb-15">
            <h6 class="mb-2">Học phí</h6>

            <app-select
              class="cc-select w-120"
              @change="handleChangeFree"
              :value="free"
              :options="[
                { value: '', text: 'Chọn học phí' },
                { value: 1, text: 'Trả phí' },
                { value: 2, text: 'Miễn phí' }
              ]"
              placeholder="Chọn học phí"
              size="sm"
            >
              <template slot="placeholder-icon">
                <IconAngleDown class="icon" />
              </template>
            </app-select>
            <app-error :error="get(error, 'free', '')" />
          </div>

          <div class="mb-15" v-if="this.free == 1">
            <h6 class="mb-2">Giá bán (đ)</h6>

            <app-input
              :value="numeral(payload.fee).format()"
              @onFocus="event => event.target.select()"
              @input="handleChangeFee"
              only-number
              class="text-primary font-weight-semi-bold w-100 input-price"
              size="sm"
            ></app-input>
          </div>

          <div v-if="this.free == 1">
            <h6 class="mb-2">Giá sau khuyến mại (đ)</h6>

            <div class="d-flex align-item-center">
              <app-input
                :value="numeral(payload.price).format()"
                @onFocus="event => event.target.select()"
                @input="handleChangePrice"
                only-number
                class="text-primary font-weight-semi-bold w-100 mb-0 input-price"
                size="sm"
              ></app-input>

              <app-button
                class="percent_price__ElearningCreate bg-primary text-white ml-3"
                size="sm"
              >{{ percent_price }}</app-button>
            </div>
            <app-error :error="get(error, 'price', '')" />
          </div>
        </div>
      </CreateAsideCollapse>
    </div>

    <div class="col col-md-8 cgi-col-content">
      <div class="cc-panel bg-white">
        <div class="cc-panel__title">
          <h4 class="cc-panel__heading">Tạo bài giảng khóa học</h4>
        </div>

        <div class="cc-panel__body">
          <div class="cgi-form-group mb-5">
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

          <div class="cgi-form-group mb-5">
            <h2 class="cgi-form-title heading-6 mb-3">Loại hình học tập</h2>
            <app-radio
              name="type"
              value="LECTURE"
              @click="Calc"
              :checked="payload.type === 'LECTURE'"
              :class="{ 'mr-6': true, 'disabled-input': general }"
              :disabled="general"
            >Bài giảng</app-radio>
            <app-radio
              name="type"
              @click="Calc"
              value="COURSE"
              :class="{ 'disabled-input': general }"
              :disabled="general"
              :checked="payload.type === 'COURSE'"
            >Khoá học</app-radio>
            <app-error :error="get(error, 'type', '')"></app-error>
          </div>

          <div class="row mb-3">
            <div class="col-auto mr-5 mb-4">
              <div class="cgi-form-group flex-column">
                <h2 class="cgi-form-title heading-6 mb-3">Trình độ</h2>
                <app-vue-select
                  class="cc-select"
                  style="width: 14rem"
                  label="text"
                  :options="gradesOptNoAll"
                  placeholder="Chọn khối"
                  @change="handleChangeGrade"
                  :reduce="item => item.value"
                  v-model="payload.grade_id"
                  size="sm"
                  has-border
                ></app-vue-select>
              </div>
              <app-error class="mt-2" :error="get(error, 'level', '')"></app-error>
            </div>

            <div class="col-auto mr-5 mb-4">
              <div class="cgi-form-group flex-column">
                <h2 class="cgi-form-title heading-6 mb-3">Môn học</h2>
                <app-vue-select
                  class="cc-select"
                  style="width: 14rem"
                  label="text"
                  :options="subjectsOpt"
                  placeholder="Chọn môn học"
                  @change="handleChangeSubject"
                  :reduce="item => item.value"
                  v-model="payload.subject_id"
                  size="sm"
                  has-border
                ></app-vue-select>
              </div>

              <app-error class="mt-2" :error="get(error, 'subject', '')"></app-error>
            </div>

            <div class="col-auto mb-4" v-if="checkPrivacyPrivate === 'PRIVATE'">
              <div class="cgi-form-group flex-column">
                <h2 class="cgi-form-title heading-6 mb-3">Lớp - Nhóm học tập</h2>
                <app-vue-select
                  multiple
                  style="width: 20.1rem"
                  class="app-vue-selec h-100 app-select-elearnings filter-form__item__selection"
                  label="text"
                  placeholder="Chọn lớp - Nhóm học tập"
                  @input="handleChangeGroup"
                  :options="groupClsOpts"
                  :reduce="item => item.value"
                  v-model="payload.assign_group_ids"
                  has-border
                ></app-vue-select>
              </div>

              <!-- <app-error class="mt-2" :error="get(error, 'subject', '')"></app-error> -->
            </div>
          </div>

          <div class="cgi-form-group mb-5">
            <h2 class="cgi-form-title heading-6 mb-3">
              Mô tả tổng quát
              <span class="text-base font-weight-normal">(Tối thiểu 100 ký tự)</span>
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

          <div class="caculate-point">
            <div class="row">
              <div class="col-md-6">
                <h5 class="mb-4">Chọn cách tính điểm</h5>

                <div class="d-flex mb-4">
                  <app-radio
                    value="coefficient"
                    name="caculate-point"
                    :class="{ 'mr-6': true, 'disabled-input': disabledType }"
                    :checked="typeRadio == 'coefficient'"
                    :disabled="disabledType"
                    @click="handleSelectCalcType"
                  >
                    Theo hệ số
                    <v-popover placement="right" trigger="hover" class="d-inline-block ml-2">
                      <IconQuestionCircle
                        class="fill-opacity-1 fill-gray-3 vertical-middle"
                        width="2rem"
                        height="2rem"
                      />

                      <template #popover>
                        <p>
                          Các bài kiểm tra được cài đặt theo hệ số 1 hoặc hệ số
                          2
                        </p>
                        <p class="mb-3">để làm cơ sở tính điểm trung bình cho học sinh.</p>

                        <a href>Xem chi tiết</a>
                      </template>
                    </v-popover>
                  </app-radio>

                  <app-radio
                    :checked="typeRadio == 'weight'"
                    value="weight"
                    :disabled="disabledType"
                    @click="handleSelectCalcType"
                    name="caculate-point"
                    :class="{ 'disabled-input': disabledType }"
                  >
                    Theo trọng số
                    <v-popover placement="right" trigger="hover" class="d-inline-block ml-2">
                      <IconQuestionCircle
                        class="fill-opacity-1 fill-gray-3 vertical-middle"
                        width="2rem"
                        height="2rem"
                      />

                      <template #popover>
                        <p>
                          Các bài kiểm tra được cài đặt theo trọng số, tính theo
                          %.
                        </p>
                        <p class="mb-3">Tổng trọng số của tất cả các bài kiểm tra là 100%.</p>

                        <a href>Xem chi tiết</a>
                      </template>
                    </v-popover>
                  </app-radio>
                </div>
              </div>

              <!-- <div class="col-12">
                <div class="d-flex align-items-center mb-5" v-if="typeRadio == 'coefficient'">
                  <p class="mr-3">Chọn hệ số:</p>

                  <app-select
                    class="mr-3"
                    size="sm"
                    :value="payload.coefficient"
                    :options="[
                      { value: 1, text: '1' },
                      { value: 2, text: '2' }
                    ]"
                    bordered
                    placeholder="Hệ số"
                    @change="handleChangeCoefficient"
                  >
                    <template slot="placeholder-icon">
                      <IconAngleDown class="icon" />
                    </template>
                  </app-select>

                  <p class="text-warning">
                    * Lưu ý: Bạn sẽ không thể thay đổi cách tính điểm sau khi
                    bài kiểm tra đã được tạo
                  </p>
                </div>

                <div class="d-flex align-items-center mb-5" v-if="typeRadio == 'weight'">
                  <p class="mr-3">Nhập trọng số:</p>

                  <app-input
                    class="mr-3 mb-0 w-80 pr-3"
                    size="sm"
                    v-model="payload.weight"
                    @input="checkWeight()"
                  >
                    <template slot="unit">
                      <span class="text-primary">%</span>
                    </template>
                  </app-input>

                  <p class="text-warning">
                    * Lưu ý: Bạn sẽ không thể thay đổi cách tính điểm sau khi
                    bài kiểm tra đã được tạo
                  </p>
                </div>
              </div>-->
            </div>
          </div>

          <div class="cgi-form-group">
            <h2 class="cgi-form-title heading-6 mb-3">Lợi ích (Tuỳ chọn)</h2>
            <app-editor
              class="bg-input-gray mb-3"
              :sticky-offset="`{ top: 70, bottom: 0 }`"
              v-model="payload.benefit"
            />
            <app-error :error="get(error, 'benefit', '')"></app-error>
          </div>
        </div>
      </div>

      <div class="create-action mt-5">
        <div class="create-action__right d-flex align-items-center">
          <app-button
            class="create-action__btn text-base mr-4"
            color="disabled"
            @click="handleCancel"
          >Huỷ</app-button>
          <app-button
            @click="handleSubmitGeneralStep"
            class="create-action__btn"
            :loading="confirmLoading"
          >Lưu</app-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as yup from "yup";
import numeral from "numeral";
import { toNumber, get, cloneDeep, trim } from "lodash";
import { mapState, mapGetters, mapActions } from "vuex";
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
import IconQuestionCircle from "~/assets/svg/design-icons/question-circle.svg?inline";

import CourseBenefit from "~/components/page/course/create/info/CourseBenefit";
import CreateAsideCollapse from "~/components/page/course/create/new-ui/CreateAsideCollapse";
import SelectAvatar from "~/components/page/course/create/new-ui/SelectAvatar";
import { uniqWith } from "lodash";

export default {
  components: {
    IconAngleDown,
    IconCheckCircle,
    IconTrashAlt,
    CourseBenefit,
    CreateAsideCollapse,
    SelectAvatar,
    IconQuestionCircle,
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
      free: "",
      payload: {
        avatar: "",
        benefit: "",
        description: "",
        grade: null,
        name: "",
        subject: null,
        cover_image: "",
        type: "",
        allow_comment: "",
        fee: "",
        grade_id: "",
        point_calculation: "COEFFICIENT",
        price: "",
        subject_id: "",
        assign_class_ids: null,
        assign_group_ids: null,
        id: "",
      },
      showModalConfirm: false,
      confirmLoading: false,
      typeRadio: "coefficient",
      checkPrivacyPrivate: "",
      checkId: false,
    };
  },

  mounted() {
    // this.$store.dispatch(`elearning/create/resetSubjects`);
    this.initChangeGrade = true;
    // useEffect(this, this.handleChangeGeneral.bind(this), ["general"]);
    // useEffect(this, this.getGrades.bind(this), ["userLogin"]);
    // this.getGrades();
    // this.$store.dispatch("elearning/study-group/group/getListGroupClass");
    const elearning_id = getParamQuery("elearning_id");
    this.payload.id = elearning_id;
    this.checkId = elearning_id ? true : false;
    useEffect(this, this.handleElearningDetail.bind(this), ["elearningDetail"]);
  },

  computed: {
    ...mapState("elearning/create", {
      general: "general",
      progress: "progress",
      subjects: "subjects",
      grades: "grades",
      elearningDetail: "elearningDetail",
    }),

    ...mapState("auth", {
      userLogin: "token",
    }),
    ...mapState("elearning/study-group/group", ["groupClasses"]),

    ...mapGetters("elearning/create", ["gradesOptNoAll", "subjectsOpt"]),
    ...mapGetters("elearning/study-group/group", ["groupClassOpt"]),
    // ...mapGetters("elearning", ["groupClsOpts"]),
    ...mapState("elearning", ["groupCls"]),
    percent_price() {
      let percent_price = "100%";
      const _fee = numeral(get(this, "payload.fee", 0)).value();
      const _price = numeral(get(this, "payload.price", 0)).value();
      if (_fee && _price) {
        percent_price = numeral((_price - _fee) / _fee).format("0%");
      }
      return percent_price;
    },

    groupClsOpts(state) {
      const allGroupCls = uniqWith(this.groupCls, (a, b) => a.id === b.id);
      const parsedData = allGroupCls.map((item) => {
        item.value = item.id;
        item.text = item.name;
        return item;
      });
      return parsedData;
    },

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

    disabledType() {
      return false;
    },
    checkElearningID() {
      return this.$route.query && this.$route.query.elearning_id ? false : true;
    },
  },

  methods: {
    // ...mapActions("elearning/create", ["getGrades"]),
    ...mapActions("elearning/creating/creating-lesson", [
      "elearningCreatingLessonsList",
    ]),
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

    handleChangeFee(e) {
      this.payload.fee = e;
      this.payload.price = e;
      this.handleCheckPrice();
    },

    handleCheckSubject() {
      let check = true;
      if (!get(this, "payload.subject_id", true)) {
        check = false;
        this.error.subject = "Bạn cần chọn môn học";
      } else {
        this.error.subject = "";
      }
      return check;
    },

    handleChangeCommentAllow(allow_comment) {
      this.payload.allow_comment = allow_comment;
    },

    handleChangeFree(free) {
      this.free = free;
      if (free != 1) {
        this.payload.fee = 0;
        this.payload.price = 0;
      }
      this.handleCheckPrice();
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

    handleElearningDetail() {
      this.payload.benefit = get(this, "elearningDetail.benefit.0", "");
      this.payload.description = get(this, "elearningDetail.description", "");
      this.payload.name = get(this, "elearningDetail.name", "");
      this.payload.grade_id = get(this, "elearningDetail.grade.id", "")
        ? get(this, "elearningDetail.grade.id").toString()
        : null;
      this.payload.subject_id = get(this, "elearningDetail.subject.id", "")
        ? get(this, "elearningDetail.subject.id").toString()
        : null;
      this.payload.type = get(this, "elearningDetail.type", "");
      this.payload.elearning_id = get(this, "elearningDetail.id", "");
      this.payload.assign_group_ids = get(
        this,
        "elearningDetail.assign_group_ids",
        []
      )
        ? (this.payload.assign_group_ids = get(
            this,
            "elearningDetail.assign_group_ids",
            []
          ).map((item) => {
            return item.id;
          }))
        : [];
      if (get(this, "elearningDetail.price", "") === 0) {
        this.free = 2;
      }
      if (get(this, "elearningDetail.price", "") > 0) {
        this.free = 1;
      }
      this.payload.fee = get(this, "elearningDetail.fee", 0);
      this.payload.price = get(this, "elearningDetail.price", 0);
      this.payload.point_calculation = get(
        this,
        "elearningDetail.point_calculation",
        "COEFFICIENT"
      );
      this.payload.privacy = get(this, "elearningDetail.privacy", "");
      this.payload.allow_comment = get(
        this,
        "elearningDetail.comment_allow",
        ""
      );
      this.typeRadio = get(
        this,
        "elearningDetail.point_calculation",
        "coefficient"
      ).toLowerCase();
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

    handleChangePrivacy(privacy) {
      this.checkPrivacyPrivate = privacy;
      if (this.disabled_all) return;
      this.payload.privacy = privacy;
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

    handleChangeGrade(grade_id) {
      console.log("[handleChangeGrade]", grade_id);
      this.payload.grade_id = grade_id;
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
        grade: this.payload.grade_id,
      };
      this.$store.dispatch(`elearning/create/getSubjects`, params);
    },

    Calc(e) {
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

    handleChangeSubject(subject_id) {
      this.payload.subject_id = subject_id;
      this.handleCheckSubject();
    },

    // getGrades() {
    //   const params = {
    //     school_id: get(this, "userLogin.organization.id", ""),
    //     school_level: get(this, "userLogin.organization.level", "")
    //   };
    //   this.$store.dispatch(`elearning/create/getGrades`, params);
    // },

    async handleSubmitGeneralStep() {
      this.confirmLoading = true;
      try {
        const res = await this.$axios({
          url: "/elearning/teaching/elearning",
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: this.createFormPayload(this.payload),
        });

        console.log("[handleSubmitGeneralStep]", this.payload);
        if (get(res, "data.success", false)) {
          this.confirmLoading = false;
          const elearning_id = get(res, "data.data.elearning_id", "");
          redirectWithParams({ elearning_id, type: this.payload.type });
          await this.elearningCreatingLessonsList({ params: { elearning_id } });
          this.$toasted.success("Thành công");
          this.$emit("nextStep");
          return;
        }
        this.confirmLoading = false;
        this.$toasted.error(get(res, "data.message", ""));
      } catch (error) {
        this.confirmLoading = false;
        console.log(error);
      }
    },

    createFormPayload(payload) {
      const dataPush = [];
      payload.assign_group_ids.forEach((item) => dataPush.push({ id: item }));
      console.log("dataPush", dataPush);
      var formData = new FormData();
      formData.append("name", payload.name);
      formData.append("avatar", payload.avatar);
      formData.append("benefits", JSON.stringify([payload.benefit]));
      formData.append("description", payload.description);
      formData.append("grade_id", payload.grade_id);
      formData.append("type", payload.type);
      formData.append("allow_comment", payload.allow_comment);
      if (payload.privacy == "PRIVATE" && payload.assign_class_ids) {
        formData.append(
          "assign_class_ids",
          JSON.stringify([{ id: payload.assign_class_ids }])
        );
      }
      if (payload.privacy == "PRIVATE" && payload.assign_group_ids) {
        formData.append("assign_group_ids", JSON.stringify(dataPush));
      }
      formData.append("fee", payload.fee);
      formData.append("point_calculation", payload.point_calculation);
      formData.append("price", payload.price);
      if (this.checkId) {
        formData.append("id", payload.id);
      }
      formData.append("subject_id", payload.subject_id);
      formData.append("privacy", payload.privacy);
      return formData;
    },

    handleCancel() {
      this.confirmLoading = false;
    },

    handleSelectCalcType(e) {
      this.typeRadio = e.target.value;
      this.payload.point_calculation = e.target.value.toUpperCase();
    },

    handleChangePrice(e) {
      this.payload.price = numeral(e).format();
      this.handleCheckPrice();
    },

    handleChangeGroup(group_id) {
      console.log("[handleChangeGroup]", group_id);
      const groupObj = this.groupClsOpts.find((g) => g.id == group_id);
      if (groupObj) {
        if (groupObj.type == "CLASS") {
          this.payload.assign_class_ids = group_id;
        } else if (groupObj.type == "GROUP") {
          this.payload.assign_group_ids = group_id;
        }
      }
    },

    handleCheckPrice() {
      if (get(this, "free", "") === "") {
        this.error.free = "Bạn chưa chọn loại học phí";
        return false;
      }
      this.error.free = "";
      if (
        this.free == 1 &&
        numeral(get(this, "payload.price", 0)).value() < 10000
      ) {
        this.error.price = "Học phí tối thiểu là 10,000đ";
        return false;
      }

      if (
        this.free == 1 &&
        numeral(get(this, "payload.fee", 0)).value() < 10000
      ) {
        this.error.price = "Học phí tối thiểu là 10,000đ";
        return false;
      }

      this.error.price = "";
      return true;
    },

    handleCancel() {
      this.$router.push("/elearning/manager/courses");
    },

    numeral,
    get,
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/course/create/_create-general-information.scss";
</style>
