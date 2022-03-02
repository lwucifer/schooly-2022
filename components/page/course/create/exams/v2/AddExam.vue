<template>
  <div class="cc-panel__body">
    <div class="mb-4">
      <h5 for="title" class="mb-3 d-inline-block">
        Tiêu đề bài kiểm tra
        <span class="caption text-base font-weight-normal">(Tối đa 60 ký tự)</span>
      </h5>
      <app-input
        class="mb-0"
        id="title"
        :counter="60"
        placeholder="Nhập tiêu đề bài kiểm tra"
        v-model="payload.title"
        @input="checkTitle()"
      />
      <app-error :error="get(error, 'title', '')" />
    </div>

    <div class="row">
      <div class="col-md-3">
        <div class="mb-4">
          <h5 for="require" class="mb-3">Loại bài kiểm tra</h5>
          <app-select
            :options="typeOpts"
            v-model="payload.type"
            placeholder="Chọn loại bài kiểm tra"
            bordered
            @change="checkType"
          ></app-select>
          <app-error :error="get(error, 'type', '')" />
        </div>
      </div>

      <div class="col-md-9 col-12">
        <div class="mb-4">
          <h5 for="require" class="mb-3">Bài kiểm tra thuộc?</h5>
          <div class="row">
            <app-radio
              class="col-md-4"
              :checked="checkRadio == 'elearning'"
              name="checkType"
              @input="switchSource('elearning')"
              >Bài giảng khóa học</app-radio
            >
            <app-radio
              class="col-md-4"
              :checked="checkRadio == 'clsgroup'"
              name="checkType"
              @input="switchSource('clsgroup')"
              >Lớp - Nhóm</app-radio
            >
          </div>
          <!-- <app-error :error="get(error, 'elearning', '')" /> -->
        </div>
      </div>
    </div>

    <div class="row">
      <div v-if="checkRadio == 'elearning'" class="col-md-6">
        <div class="mb-4">
          <h5 for="require" class="mb-3">Thuộc</h5>
          <app-select-elearnings
            style="height: 4.2rem;"
            @input="handleSelectElearning"
            v-model="selectedElearning"
          ></app-select-elearnings>
          <app-error :error="get(error, 'elearning', '')" />
        </div>
      </div>
      <div v-if="checkRadio == 'elearning'" class="col-md-6">
        <div class="mb-4">
          <h5 for="require" class="mb-3" style="opacity: 0;">Bài hoc</h5>
          <select-lesson
            @change="handleSelectLesson"
            :disabled="isLoaddingLessons ||
                this.selectedElearning == null"
          >
          </select-lesson>
          <app-error :error="get(error, 'lesson', '')" />
        </div>
      </div>

      <div v-if="checkRadio == 'clsgroup'" class="col-md-12">
        <div class="mb-4">
          <h5 for="require" class="mb-3">Thuộc</h5>
          <div class="cex__select-item">
            <app-select-class-group
              multiple
              style="height: 4.2rem;"
              class="app-vue-select form-item__selection"
              @input="handleChangedClassGroup"
            ></app-select-class-group>
          </div>
            
          <app-error :error="get(error, 'clsgroup', '')" />
        </div>
      </div>
    </div>

    <div class="caculate-point">
      <div class="row">
        <div class="col-md-6">
          <h5 class="mb-4">Chọn cách tính điểm</h5>

          <div class="d-flex mb-4">
            <app-radio
              value="coefficient"
              :checked="typeRadio == 'coefficient'"
              @click="handleSelectType"
              name="caculate-point"
              :disabled="disabledType"
              :class="{ 'mr-6': true, 'disabled-input': disabledType }"
            >
              Theo hệ số
              &nbsp;
              <v-popover placement="right" trigger="hover" class="d-inline-block">
                <IconQuestionCircle
                  width="12px"
                  height="12px"
                  class="fill-gray vertical-middle"
                />

                <template #popover>
                  <p>Các bài kiểm tra được cài đặt theo hệ số 1 hoặc hệ số 2</p>
                  <p class="mb-3">để làm cơ sở tính điểm trung bình cho học sinh.</p>

                  <a href>Xem chi tiết</a>
                </template>
              </v-popover>
            </app-radio>

            <app-radio
              :checked="typeRadio == 'weight'"
              value="weight"
              :disabled="disabledType"
              @click="handleSelectType"
              name="caculate-point"
              :class="{ 'disabled-input': disabledType }"
            >
              Theo trọng số
              &nbsp;
              <v-popover placement="right" trigger="hover" class="d-inline-block">
                <IconQuestionCircle
                  width="12px"
                  height="12px"
                  class="fill-gray vertical-middle"
                />

                <template #popover>
                  <p>Các bài kiểm tra được cài đặt theo trọng số, tính theo %.</p>
                  <p class="mb-3">Tổng trọng số của tất cả các bài kiểm tra là 100%.</p>

                  <a href>Xem chi tiết</a>
                </template>
              </v-popover>
            </app-radio>
          </div>
        </div>

        <div class="col-md-6">
          <div class="mb-5" v-if="typeRadio == 'coefficient'">
            <h5 class="mb-3">Hệ số của bài kiểm tra này</h5>

            <app-select
              class="mr-3"
              size="sm"
              bordered
              :value="payload.coefficient"
              @change="handleChangeCoefficient"
              :options="[
                { value: 1, text: '1' },
                { value: 2, text: '2' }
              ]"
            >
              <template slot="placeholder-icon">
                <IconAngleDown class="icon" />
              </template>
            </app-select>

            <!-- <p class="text-warning">
              * Lưu ý: Bạn sẽ không thể thay đổi cách tính điểm sau khi bài kiểm tra
              đã được tạo
            </p>-->
          </div>

          <div class="mb-5" v-if="typeRadio == 'weight'">
            <h5 class="mb-3">Trọng số của bài kiểm tra này</h5>

            <app-input
              class="mr-3 mb-0 w-90 pr-3 input--modifer"
              size="sm"
              @onFocus="event => event.target.select()"
              v-model="payload.weight"
              @input="checkWeight()"
            >
              <template slot="unit">
                <span class="text-primary">%</span>
              </template>
            </app-input>

            <!-- <p class="text-warning">
              * Lưu ý: Bạn sẽ không thể thay đổi cách tính điểm sau khi bài kiểm tra
              đã được tạo
            </p>-->
            <app-error :error="get(error, 'weight', '')" />
          </div>
        </div>
      </div>
    </div>

    <div class="row align-items-center mb-4" v-show="payload.required">
      <div class="col-12 col-md-4">
        <label for="time" class="heading-5 font-weight-bold text-dark">Thời gian làm bài</label>

        <app-input
          type="text"
          @onFocus="event => event.target.select()"
          class="mb-0 ce-input-with-unit mt-3"
          id="time"
          size="sm"
          style="width: 112px"
          v-model="payload.duration"
          @input="checkDuration"
        >
          <div slot="unit">Phút</div>
        </app-input>
        <app-error :error="get(error, 'duration', '')" />
      </div>

      <div class="col-12 col-md-4">
        <label for="point" class="heading-5 font-weight-bold text-dark">Điểm đạt</label>

        <app-input
          type="text"
          @onFocus="event => event.target.select()"
          min="0"
          max="10"
          class="mb-0 ce-input-with-unit mt-3"
          id="point"
          size="sm"
          style="width: 102px"
          v-model="payload.pass_score"
          @input="checkPassScore"
        >
          <div slot="unit">/10</div>
        </app-input>
        <app-error :error="get(error, 'pass_score', '')" />
      </div>

      <div class="col-12 col-md-4">
        <label for="count" class="heading-5 font-weight-bold text-dark">Số lần làm bài tối đa</label>

        <app-input
          type="text"
          class="mb-0 mt-3 ce-input-with-unit"
          @onFocus="event => event.target.select()"
          id="count"
          size="sm"
          style="width: 102px"
          v-model="payload.reworks"
          @input="checkReworks"
        >
          <div slot="unit">Lần</div>
        </app-input>

        <app-error :error="get(error, 'reworks', '')" />
      </div>
    </div>

    <div class="setup-time mt-5 mb-6">
      <h5 class="mb-4">
        Cài đặt thời gian
        <span class="font-weight-bold">
          (Không bắt buộc)
          <IconQuestionCircle width="12px" height="12px" class="fill-gray" />
        </span>
      </h5>

      <div class="d-flex align-items-center mb-3">
        <p class="w-120">Thời gian bắt đầu:</p>

        <SelectDate
          @onChange="handleChangeOpenTime"
          :value="payload.open_time"
          :disabled="!payload.opentime_enable"
        />
        <app-checkbox v-model="payload.opentime_enable">
          <span class="text-base">Áp dụng</span>
        </app-checkbox>
      </div>
      <app-error class="mb-3" :error="get(error, 'open_time', '')" />

      <div class="d-flex align-items-center">
        <p class="w-120">Thời gian kết thúc:</p>

        <SelectDate
          @onChange="handleChangeCloseTime"
          :value="payload.close_time"
          :disabled="!payload.closetime_enable"
        />

        <app-checkbox v-model="payload.closetime_enable">
          <span class="text-base">Áp dụng</span>
        </app-checkbox>
      </div>
      <app-error :error="get(error, 'close_time', '')" />
    </div>

    <div class="d-flex justify-content-end">
      <app-button
        size="md"
        color="default"
        outline
        class="font-weight-semi-bold mr-4 text-secondary"
        @click="$emit('cancel')"
      >Huỷ</app-button>
      <app-button
        size="md"
        color="primary"
        class="font-weight-semi-bold"
        @click="handleAddExam"
      >Tạo bài kiểm tra</app-button>
    </div>

    <app-modal-confirm
      centered
      v-if="showModalConfirm"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      title="Tạo bài kiểm tra"
      description="Bạn có chắc chắn muốn tạo bài kiểm tra này?"
    />
  </div>
</template>

<script>
import IconAngleDown from "~/assets/svg/design-icons/angle-down.svg?inline";
import IconEvent24px from "~/assets/svg/v2-icons/event_24px.svg?inline";
import IconQuestionCircle from "~/assets/svg/design-icons/question-circle.svg?inline";
import IconCalender from "~/assets/svg/v2-icons/calendar_today_24px.svg?inline";
import SelectDate from "~/components/page/course/create/setting/SelectDate";
import SelectLesson from "~/components/page/course/create/exercise/v2/SelectLesson";
import moment from "moment";
import * as actionTypes from "~/utils/action-types";
import { getParamQuery, useEffect } from "~/utils/common";
import { get } from "lodash";
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import { createPayloadExercise } from "~/models/course/AddCourse";
import numeral from "numeral";
import { getUTCDateTime, getLocalDateTime } from "~/utils/moment";
import { EXAM_CONFIG } from "~/utils/config";
import { CATEGORY_TEST, PAGE_SIZE } from "~/utils/constants";
const EXAM_STORE = `elearning/manager/bank/exam`;
export default {
  components: {
    IconAngleDown,
    IconEvent24px,
    IconQuestionCircle,
    IconCalender,
    SelectDate,
    SelectLesson
  },

  computed: {
    ...mapState("elearning/create", {
      general: "general",
      lesson: "lesson",
      exams: "exams",
      setting: "setting",
    }),
    ...mapState(EXAM_STORE, ["getListBankExam"]),
    ...mapState("elearning/study-group/group", {
      classes: "classes",
      groups: "groups",
      teacher: "teacher",
    }),
    ...mapGetters("auth", ["organizationId", "assignableCheck"]),
    classList() {
      console.log("[classList]", this.classes);
      return this.classes && this.classes.filter(item => !item.homeroom);
    },
    classGroup() {
      return this.groups && this.groups.content && this.groups.content.filter(item => !item.is_hidden);
    },
    disabledType() {
      return !!(
        get(this, "getListBankExam.content.0.settings.weight", "") !== "" ||
        get(this, "getListBankExam.content.0.settings.coefficient", "") !== ""
      );
    },
  },

  mounted() {
    useEffect(this, this.watchExams.bind(this), ["exams"]);
  },

  data() {
    return {
      checkRadio: "elearning",
      selectedElearning: null,
      payload: {
        // index: 1,
        elearning_id: "",
        lesson_id: "",
        required: true,
        title: "",
        type: null,
        pass_score: 0,
        reworks: 1,
        duration: 0,
        category: "TEST",
        open_time: "",
        opentime_enable: false,
        close_time: "",
        closetime_enable: false,
        coefficient: 1,
        // id: "",
        weight: "",
        assign_class_ids: [],
        assign_group_ids: []
      },
      showModalConfirm: false,
      confirmLoading: false,
      typeRadio: "coefficient",
      error: {
        title: "",
        type: "",
        weight: "",
        opent_time: "",
        close_time: "",
        elearning: "",
        lesson: "",
        clsgroup: "",
        duration: "",
        pass_score: "",
        reworks: ""
      },
      typeOpts: [
        { text: "Tự luận", value: "ESSAY" },
        { text: "Trắc nghiệm", value: "CHOICE" },
        { text: "Hỗn hợp", value: "MIX" },
      ],
      isLoaddingLessons: false
    };
  },
  methods: {
    ...mapActions('elearning/creating/creating-lesson', {
      getLessonsByElearning: 'elearningCreatingLessonsList'
    }),
    ...mapMutations("elearning/creating/creating-excercises", {
      setSelectedElearning: "setCurrentElearningForCreating",
    }),
    ...mapActions(EXAM_STORE, ["bankExamAdd"]),
    handleChangeType(type) {
      this.payload.type = type;
      this.checkType();
    },

    checkPayload() {
      const title = this.checkTitle();
      const type = this.checkType();
      const weight = this.checkWeight();
      const openCloseTime = this.checkOpenCloseTime();
      const elearning = this.checkElearning();
      const lesson = this.checkLesson();
      const cls_group = this.checkClsGroup();
      const duration = this.checkDuration();
      const pass_score = this.checkPassScore();
      const reworks = this.checkReworks();
      return title && type && weight && openCloseTime && elearning && lesson && cls_group && duration && pass_score && reworks;
    },

    checkOpenCloseTime() {
      return true; // tmp disable validate
      console.log("[checkOpenCloseTime]");
      this.error.open_time = "";
      this.error.close_time = "";

      // if donot enable opentime
      if (!this.payload.opentime_enable && !this.payload.closetime_enable)
        return true;
      if (!this.payload.open_time && this.payload.opentime_enable) {
        this.error.open_time = "Bạn chưa chọn thời gian mở đề";
        return false;
      }
      if (!this.payload.close_time && this.payload.closetime_enable) {
        this.error.close_time = "Bạn chưa chọn thời gian đóng đề";
        return false;
      }

      const starttime_enable = get(this, "setting.starttime_enable", false);
      const start_time = get(this, "setting.start_time", "");
      const endtime_enable = get(this, "setting.endtime_enable", false);
      const end_time = get(this, "setting.end_time", "");
      const duration = get(this, "payload.duration", 0);

      // start_time format
      let open_time_timestamp = this.payload.open_time
        ? moment(this.payload.open_time).format("x")
        : null;
      let start_time_timestamp = this.setting && this.setting.start_time
        ? getLocalDateTime(this.setting.start_time).format("x")
        : null;

      // end_time format
      let close_time_timestamp = this.payload.close_time
        ? moment(this.payload.close_time).format("x")
        : null;
      let end_time_timestamp = this.setting && this.setting.end_time
        ? getLocalDateTime(this.setting.end_time).format("x")
        : null;

      // 1. if starttime_enable == true && endtime_enable == true
      if (starttime_enable && endtime_enable) {
        // Thời gian mở đề > thời gian bắt đầu bài giảng/khóa học (ít nhất 24 giờ)
        if (
          this.isValidTimeEnable(
            open_time_timestamp,
            this.payload.opentime_enable
          ) &&
          !this.check2TimeDuration(
            start_time_timestamp,
            open_time_timestamp,
            EXAM_CONFIG.TIME_TO_START_OPEN_QUESTION
          )
        ) {
          this.error.open_time =
            "Thời gian mở đề phải lớn hơn thời gian bắt đầu bài giảng/khoá học ít nhất 24 giờ";
          return false;
        }
        // Thời gian mở đề < thời gian kết thúc bài giảng (interval ít nhất là 24 giờ)
        if (
          this.isValidTimeEnable(
            open_time_timestamp,
            this.payload.opentime_enable
          ) &&
          !this.check2TimeDuration(
            open_time_timestamp,
            end_time_timestamp,
            EXAM_CONFIG.TIME_TO_START_CLOSE_QUESTION
          )
        ) {
          this.error.open_time =
            "Thời gian mở đề phải nhỏ hơn thời gian kết thúc bài giảng/khoá học ít nhất 24 giờ";
          return false;
        }
        // Thời gian đóng đề > thời gian bắt đầu bài giảng/khóa học (ít nhất 24 giờ)
        if (
          this.isValidTimeEnable(
            close_time_timestamp,
            this.payload.closetime_enable
          ) &&
          !this.check2TimeDuration(
            start_time_timestamp,
            close_time_timestamp,
            EXAM_CONFIG.TIME_TO_START_OPEN_QUESTION
          )
        ) {
          this.error.close_time =
            "Thời gian đóng đề tra phải lớn hơn thời gian bắt đầu bài giảng/khoá học ít nhất 24 giờ";
          return false;
        }
        // Thời giao đóng đề - thời gian mở đề >= thời gian làm bài
        if (
          this.isValidTimeEnable(
            open_time_timestamp,
            this.payload.opentime_enable
          ) &&
          this.isValidTimeEnable(
            close_time_timestamp,
            this.payload.closetime_enable
          ) &&
          !this.check2TimeDuration(
            open_time_timestamp,
            close_time_timestamp,
            duration * 60 * 1000
          )
        ) {
          this.error.open_time =
            "Cài đặt lượng thời gian làm bài cho phép không đúng";
          return false;
        }
        // Thời gian đóng đề <= thời gian kết thúc bài giảng/khóa học
        if (
          this.isValidTimeEnable(
            close_time_timestamp,
            this.payload.closetime_enable
          ) &&
          !this.check2TimeDuration(close_time_timestamp, end_time_timestamp, 0)
        ) {
          this.error.close_time =
            "Thời gian đóng đề tra phải nhỏ hơn thời gian kết thúc bài giảng/khoá học";
          return false;
        }
      }

      // 2. if starttime_enable == false && endtime_enable == false
      if (!starttime_enable && !endtime_enable) {
        // Thời gian mở đề > thời gian tạo bài giảng/khóa học (interval ít nhất là 24 giờ)
        // if(open_time_timestamp && !this.check2TimeDuration(new Date().getTime(), open_time_timestamp, EXAM_CONFIG.TIME_TO_START_OPEN_QUESTION)) {
        //   this.error.open_time =
        //     "Thời gian mở đề phải lớn hơn thời gian tạo giảng/khoá học ít nhất 24 giờ";
        //   return false;
        // }
        // Thời gian đóng đề > Thời gian bắt đầu (interval ít nhất là 24 giờ)
        // Thời gian đóng đề > thời gian mở đề
        if (
          this.isValidTimeEnable(
            open_time_timestamp,
            this.payload.opentime_enable
          ) &&
          this.isValidTimeEnable(
            close_time_timestamp,
            this.payload.closetime_enable
          ) &&
          !this.check2TimeDuration(open_time_timestamp, close_time_timestamp, 0)
        ) {
          this.error.close_time =
            "Thời gian đóng đề phải lớn hơn thời gian mở đề";
          return false;
        }
        // Thời giao đóng đề - thời gian mở đề >= thời gian làm bài
        if (
          this.isValidTimeEnable(
            open_time_timestamp,
            this.payload.opentime_enable
          ) &&
          this.isValidTimeEnable(
            close_time_timestamp,
            this.payload.closetime_enable
          ) &&
          !this.check2TimeDuration(
            open_time_timestamp,
            close_time_timestamp,
            duration * 60 * 1000
          )
        ) {
          this.error.open_time =
            "Cài đặt lượng thời gian làm bài cho phép không đúng";
          return false;
        }
      }

      // 3. if starttime_enable == true && endtime_enable == false
      if (starttime_enable && !endtime_enable) {
        // Thời gian mở đề > thời gian bắt đầu bài giảng/khóa học (ít nhất 24 giờ)
        if (
          this.isValidTimeEnable(
            open_time_timestamp,
            this.payload.opentime_enable
          ) &&
          !this.check2TimeDuration(
            start_time_timestamp,
            open_time_timestamp,
            EXAM_CONFIG.TIME_TO_START_OPEN_QUESTION
          )
        ) {
          this.error.open_time =
            "Thời gian bắt đầu bài kiểm tra phải lớn hơn thời gian bắt đầu giảng/khoá học ít nhất 24 giờ";
          return false;
        }
        // Thời gian đóng đề > thời gian mở đề
        if (
          this.isValidTimeEnable(
            open_time_timestamp,
            this.payload.opentime_enable
          ) &&
          this.isValidTimeEnable(
            close_time_timestamp,
            this.payload.closetime_enable
          ) &&
          !this.check2TimeDuration(open_time_timestamp, close_time_timestamp, 0)
        ) {
          this.error.close_time =
            "Thời gian kết thúc bài kiểm tra phải lớn hơn thời gian bắt đầu bài kiểm tra";
          return false;
        }
        // Thời giao đóng đề - thời gian mở đề >= thời gian làm bài
        if (
          this.isValidTimeEnable(
            open_time_timestamp,
            this.payload.opentime_enable
          ) &&
          this.isValidTimeEnable(
            close_time_timestamp,
            this.payload.closetime_enable
          ) &&
          !this.check2TimeDuration(
            open_time_timestamp,
            close_time_timestamp,
            duration * 60 * 1000
          )
        ) {
          this.error.open_time =
            "Cài đặt lượng thời gian làm bài cho phép không đúng";
          return false;
        }
      }

      // 4. if starttime_enable == false && endtime_enable == true
      if (!starttime_enable && endtime_enable) {
        // Thời gian mở đề > thời gian tạo bài giảng/khóa học (interval ít nhất là 24 giờ)
        // if(open_time_timestamp && !this.check2TimeDuration(new Date().getTime(), open_time_timestamp, EXAM_CONFIG.TIME_TO_START_OPEN_QUESTION)) {
        //   this.error.open_time =
        //     "Thời gian mở đề phải lớn hơn thời gian tạo giảng/khoá học ít nhất 24 giờ";
        //   return false;
        // }
        // Thời gian đóng đề > thời gian mở đề
        if (
          this.isValidTimeEnable(
            open_time_timestamp,
            this.payload.opentime_enable
          ) &&
          this.isValidTimeEnable(
            close_time_timestamp,
            this.payload.closetime_enable
          ) &&
          !this.check2TimeDuration(open_time_timestamp, close_time_timestamp, 0)
        ) {
          this.error.close_time =
            "Thời gian kết thúc bài kiểm tra phải lớn hơn thời gian bắt đầu bài kiểm tra";
          return false;
        }
        // Thời giao đóng đề - thời gian mở đề >= thời gian làm bài
        if (
          this.isValidTimeEnable(
            open_time_timestamp,
            this.payload.opentime_enable
          ) &&
          this.isValidTimeEnable(
            close_time_timestamp,
            this.payload.closetime_enable
          ) &&
          !this.check2TimeDuration(
            open_time_timestamp,
            close_time_timestamp,
            duration * 60 * 1000
          )
        ) {
          this.error.close_time =
            "Cài đặt lượng thời gian làm bài cho phép không đúng";
          return false;
        }
        // Thời gian đóng đề <= thời gian kết thúc bài giảng/khóa học
        if (
          this.isValidTimeEnable(
            close_time_timestamp,
            this.payload.closetime_enable
          ) &&
          !this.check2TimeDuration(close_time_timestamp, end_time_timestamp, 0)
        ) {
          this.error.close_time =
            "Thời gian đóng đề tra phải nhỏ hơn thời gian kết thúc bài giảng/khoá học";
          return false;
        }
      }

      return true;
    },

    check2TimeDuration(start_time, end_time, duration) {
      console.log("[check2TimeDuration]", start_time, end_time, duration);
      if (!start_time || !end_time || duration == null || duration == undefined)
        return false;
      const result = end_time - start_time >= duration;
      return result;
    },

    checkWeight() {
      if (this.typeRadio !== "weight") {
        this.error.weight = "";
        return true;
      }

      if (!this.payload.weight) {
        this.error.weight = "Bạn cần nhập trọng số";
        return false;
      }

      const checkInteger = Number.isInteger(+this.payload.weight);
      if (!checkInteger) {
        this.error.weight = "Trọng số phải là số nguyên";
        return false;
      }

      if (+this.payload.weight <= 0) {
        this.error.weight = "Trọng số phải lớn hơn 0";
        return false;
      }

      if (+this.payload.weight > 100) {
        this.error.weight = "Trọng số không được lớn hơn 100";
        return false;
      }

      this.error.weight = "";
      return true;
    },

    checkDuration() {
       if (this.payload.duration <= 0) {
        this.error.duration = "Bạn cần nhập thời gian làm bài kiểm tra";
        return false;
      } else if (parseInt(this.payload.duration) <= 0) {
        this.error.duration = "Thời gian làm bài kiểm tra không hợp lệ";
        return false;
      }
      this.error.duration = "";
      return true;
    },

    checkPassScore() {
       if (this.payload.pass_score <= 0) {
        this.error.pass_score = "Bạn cần nhập điểm đạt bài kiểm tra";
        return false;
      } else if (parseInt(this.payload.pass_score) <= 0) {
        this.error.pass_score = "Điểm đạt bài kiểm tra không hợp lệ";
        return false;
      } else if (parseInt(this.payload.pass_score) > 10) {
        this.error.pass_score = "Điểm đạt bài kiểm tra không hợp lệ";
        return false;
      }
      this.error.pass_score = "";
      return true;
    },

    checkType() {
      if (this.payload.type == null) {
        this.error.type = "Bạn cần nhập loại bài kiểm tra";
        return false;
      }
      this.error.type = "";
      return true;
    },

    checkTitle() {
      if (!this.payload.title) {
        this.error.title = "Bạn cần nhập tiêu đề";
        return false;
      }
      this.error.title = "";
      return true;
    },

    checkElearning() {
      if (this.checkRadio == 'elearning') {
        if (get(this, 'selectedElearning', null) == null) {
          this.error.elearning = "Bài giảng/khóa học bắt buộc không được để trống";
          return false;
        }
      }
      this.error.elearning = "";
      return true;
    },

    checkClsGroup() {
      if (this.checkRadio == 'clsgroup') {
        if (
          get(this, 'payload.assign_class_ids', []).length <= 0 &&
          get(this, 'payload.assign_group_ids', []).length <= 0
        ) {
          this.error.clsgroup = "Lớp/Nhóm học tập bắt buộc không được để trống";
          return false;
        }
      }
      this.error.clsgroup = "";
      return true;
    },

    checkLesson() {
      if (this.checkRadio == 'elearning') {
        if (get(this, 'selectedElearning', null) != null) {
          if (get(this, 'payload.lesson_id', "") == "") {
            this.error.lesson = "Bài học bắt buộc không được để trống";
            return false;
          }
        }
      }
      this.error.lesson = "";
      return true;
    },

    checkReworks() {
      if (this.payload.reworks == "") {
        this.error.reworks = "Bạn cần nhập số lần làm bài";
        return false;
      } else if (parseInt(this.payload.reworks) <= 0) {
        this.error.reworks = "Số lần làm bài không hợp lệ";
        return false;
      }
      this.error.reworks = "";
      return true;    
    },

    watchExams() {
      if (get(this, "getListBankExam.content.0.settings.weight", "") !== "") {
        // this.payload.weight = get(this, "exams.content.0.weight", "");
        this.typeRadio = "weight";
      }
      if (
        get(this, "getListBankExam.content.0.settings.coefficient", "") !== ""
      ) {
        // this.payload.coefficient = get(this, "exams.content.0.coefficient", "");
        this.typeRadio = "coefficient";
      }
    },

    handleChangeCoefficient(value) {
      this.payload.coefficient = value;
    },

    handleChangeOpenTime(date) {
      this.payload.open_time = date;
      this.checkOpenCloseTime();
    },

    handleChangeCloseTime(date) {
      this.payload.close_time = date;
      this.checkOpenCloseTime();
    },

    async handleAddExam() {
      if (!this.checkPayload()) {
        this.$toasted.error("Invalid params");
        return;
      }
      this.showModalConfirm = true;
    },

    handleSelectDate(date) {
      this.date = date;
    },

    handleSelectTime(time) {
      this.time = time;
    },

    async handleOk() {
      this.confirmLoading = true;

      this.payload.elearning_id = this.selectedElearning;

      let data = { ...this.payload };
      if (data.opentime_enable) {
        data.open_time = getUTCDateTime(data.open_time).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      if (data.closetime_enable) {
        data.close_time = getUTCDateTime(data.close_time).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }

      if (!data.open_time) delete data.open_time;
      if (!data.close_time) delete data.close_time;
      if (this.typeRadio === "coefficient") delete data.weight;
      if (this.typeRadio === "weight") delete data.coefficient;
      const body = new FormData();
      body.append("category", data.category);
      body.append("parent", this.checkRadio == 'elearning' ? "ELEARNING" : 'ASSIGN');
      body.append("name", data.title);
      body.append("type", this.payload.type);
      body.append("parent_id", this.checkRadio == 'elearning' ? get(this, 'selectedElearning', '') : null);
      body.append("lesson_id", get(this, 'payload.lesson_id', ''));
      body.append("duration", data.duration);
      body.append("passing_score", data.pass_score);
      body.append("starttime_enable", data.opentime_enable);
      body.append("endtime_enable", data.closetime_enable);
      body.append("works", this.payload.reworks);
      body.append("assign_class_ids", get(this, 'payload.assign_class_ids', []));
      body.append("assign_group_ids", get(this, 'payload.assign_group_ids', []));
      if (data.opentime_enable) {
        body.append("start_time", data.open_time);
      }
      if (data.closetime_enable) {
        body.append("end_time", data.close_time);
      }
      if (data.coefficient) {
        body.append("coefficient", data.coefficient);
      }
      if (data.weight) {
        body.append("weight", data.weight);
      }
      // if (this.general && this.general.subject && this.general.subject.id) {
      //   body.append("subject_id", this.general.subject.id);
      // }
      // if (this.general && this.general.grade && this.general.grade.id) {
      //   body.append("grade_id", this.general.grade.id);
      // }
      await this.bankExamAdd(body).then((result) => {
        if (result.success) {
          this.$toasted.success('Thành công');
          this.$emit('addDone', get(result, 'data', {}));
          console.log("[bankExamAdd]", result);
          // this.$store.dispatch("elearning/create/getExams");
          this.$store.dispatch(`${EXAM_STORE}/${actionTypes.BANK_EXAM.LIST}`, {
            category: CATEGORY_TEST.TEST,
            parent: "ELEARNING",
            parent_id: this.selectedElearning,
            show_statistic: true,
            page: 1,
            size: PAGE_SIZE.MAXIMIZE,
          });
          const data = {
            apply: true,
            calculation_method:
              this.typeRadio === "coefficient" ? "COEFFICIENT" : "WEIGHT",
            elearning_id: this.selectedElearning,
          };
          this.handleCalculatePoint(data);
          this.$emit("cancel");
          return;
        } else {
          this.$toasted.error(result.message);
        }
      });

      // const res = await this.$axios({
      //   url: "/elearning/creating/test",
      //   method: "post",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   data,
      // });

      this.handleCancel();

      // if (get(res, "data.success", false)) {
      //   this.$toasted.success(get(res, "data.message", "Thành công"));
      // this.$store.dispatch("elearning/create/getExams");
      // const data = {
      //   apply: true,
      //   calculation_method:
      //     this.typeRadio === "coefficient" ? "COEFFICIENT" : "WEIGHT",
      //   elearning_id: this.payload.elearning_id,
      // };
      // await this.handleCalculatePoint(data);
      // this.$emit("cancel");
      // return;
      // }

      // this.$toasted.error(get(res, "data.message", "Có lỗi xảy ra"));
    },

    async handleCalculatePoint(data) {
      const res = await this.$axios({
        url: "/elearning/creating/point_calculation",
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data,
      });
      return res;
    },

    handleCancel() {
      this.showModalConfirm = false;
      this.confirmLoading = false;
    },

    handleSelectType(e) {
      this.typeRadio = e.target.value;
    },

    isValidTimeEnable(_time, _enable) {
      return _enable && !!_time;
    },

    handleSelectElearning(val) {
      this.setSelectedElearning(val);
      this.checkElearning();
      this.payload.elearning_id = val;
      this.payload.lesson_id = "";
    },
    handleSelectLesson(val) {
      this.payload.lesson_id = val;
      this.checkLesson();
    },
    handleChangedClassGroup(val) {
      const list = val;
      const valSize = list.length;
      let groups = [], classes = [];
      for (let i = 0; i < valSize; i++) {
        const tmp = list[i];
        if (get(tmp, 'type', '') == 'GROUP') {
          groups.push(tmp);
        }
        if (get(tmp, 'type', '') == 'CLASS') {
          classes.push(tmp);
        }
      }
      const groupIds = groups.map(item => item.id);
      const classIds = classes.map(item => item.id);
      this.payload.assign_group_ids = groupIds;
      this.payload.assign_class_ids = classIds;
      this.checkClsGroup();
    },
    async getLessonList() {
      try {
        this.isLoaddingLessons = true;
        let params = {
          elearning_id: this.selectedElearning
        };
        const res = await this.getLessonsByElearning(
          {
            params: params
          }
        );
      } catch (error) {

      } finally {
        this.isLoaddingLessons = false;
      }
    },
    switchSource(source) {
      this.checkRadio = source;
      this.payload.assign_class_ids = [];
      this.payload.assign_group_ids = [];
    },
    getCurrentSource() {
      const elearningId = getParamQuery('elearning_id');
      if (elearningId) {
        this.checkRadio = 'elearning';
        this.selectedElearning = elearningId
      }
    },
    get,
  },

  watch: {
    "payload.opentime_enable"(_newVal) {
      console.log("[payload.opentime_enable]", _newVal);
      this.checkOpenCloseTime();
    },
    "payload.closetime_enable"(_newVal) {
      console.log("[payload.closetime_enable]", _newVal);
      this.checkOpenCloseTime();
    },
    selectedElearning(newVal, oldVal) {
      this.getLessonList();
    }
  },
  async created() {
    const params = {
      school_id: get(this, "organizationId", ""),
      type: "CLASS"
    };
    await Promise.all([
      this.$store.dispatch("elearning/study-group/group/getClassesAssignment", params),
      this.$store.dispatch(
        `elearning/study-group/group/${actionTypes.STUDY_GROUP.LIST}`,
        params
      )
    ]);
    this.getCurrentSource();
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/course/creat/_form-creat-excercise.scss";
</style>
