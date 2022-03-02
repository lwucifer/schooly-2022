<template>
  <div>
    <sub-block-section class="sub-block-section">
      <template v-slot:title>
        <!-- <div class="sub-block-section__title--editable">
          <h4 class="sub-block-section__title--main">
            <button
              @click="clickBack"
              class="sub-block-section__back-btn d-flex align-items-center"
            >
              <IconArrowLeft style="height: 1.6rem;" />
            </button>
            <span>{{payload.title}}</span>
            <button class="sub-block-section__edit-btn">
              <IconEditAlt />
            </button>
          </h4>
        </div>-->
        <div class="d-flex align-items-center w-100">
          <button @click="clickBack" class="sub-block-section__back-btn d-flex align-items-center">
            <IconArrowLeft style="height: 1.6rem;" />
          </button>
          <edit-name-form :name="payload.title" @change="changeName"></edit-name-form>
        </div>
      </template>

      <template v-slot:content>
        <div>
          <!-- Require -->
          <div class="mb-4">
            <div class="d-flex align-items-center justify-content-between">
              <div>
                <h5 class="mb-3">Cách tính điểm trung bình</h5>
                <div>
                  <app-radio
                    value="coefficient"
                    :checked="filterTypeRadio == 'coefficient'"
                    @click="handleSelectType"
                    :disabled="disabledType"
                    name="caculate-point"
                    style="margin-right: 10rem;"
                    :class="{ 'mr-6': true, 'disabled-input': disabledType }"
                  >
                    Theo hệ số
                    <v-popover placement="right" trigger="hover" class="d-inline-block">
                      <IconQuestionCircle
                        width="20px"
                        height="20px"
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
                    value="weight"
                    :checked="filterTypeRadio == 'weight'"
                    @click="handleSelectType"
                    name="caculate-point"
                    :disabled="disabledType"
                    :class="{ 'disabled-input': disabledType }"
                  >
                    Theo trọng số
                    <v-popover placement="right" trigger="hover" class="d-inline-block">
                      <IconQuestionCircle
                        width="20px"
                        height="20px"
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
                <app-error :error="''" />
              </div>
              <div>
                <button-create-question
                  @handleClick="handleCreateQuestion"
                  :belong-to.sync="payload.type"
                  :creation-method="payload.method"
                  @select="selectCreateQuesOpt"
                />
              </div>
            </div>
          </div>

          <div class="detail-exercise__doing-info">
            <div class="row align-items-center mb-4">
              <div class="col-12">
                <div class v-if="filterTypeRadio == 'coefficient'">
                  <h5 class="mb-3">Hệ số của bài kiểm tra này</h5>

                  <app-select
                    size="sm"
                    bordered
                    placeholder="Chọn hệ số"
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
                </div>
                <div class v-if="filterTypeRadio == 'weight'">
                  <h5 class="mb-3">Trọng số của bài kiểm tra này</h5>

                  <app-input
                    size="sm"
                    class="mr-3 mb-0 w-90 pr-3 input--modifer"
                    @onFocus="event => event.target.select()"
                    v-model="payload.weight"
                    @input="checkWeight()"
                  >
                    <template slot="unit">
                      <span class="text-primary">%</span>
                    </template>
                  </app-input>
                  <!-- <app-error :error="get(error, 'weight', '')" /> -->
                </div>
              </div>
            </div>
          </div>

          <!-- Time -->
          <div class="detail-exercise__doing-info">
            <div class="row align-items-center mb-4">
              <div class="col-12 col-md-3">
                <label for="time" class="heading-5 font-weight-bold text-dark">Thời gian làm bài</label>

                <app-input
                  type="text"
                  @onFocus="(event) => event.target.select()"
                  class="mb-0 ce-input-with-unit mt-3"
                  id="time"
                  size="md"
                  style="width: 12rem;"
                  v-model="payload.duration"
                >
                  <div slot="unit">Phút</div>
                </app-input>
                <app-error :error="get(error, 'duration', '')" />
              </div>

              <div class="col-12 col-md-3">
                <label for="point" class="heading-5 font-weight-bold text-dark">Điểm đạt</label>

                <app-input
                  type="text"
                  @onFocus="(event) => event.target.select()"
                  min="0"
                  max="10"
                  class="mb-0 ce-input-with-unit mt-3"
                  id="point"
                  size="md"
                  style="width: 12rem;"
                  v-model="payload.pass_score"
                >
                  <div slot="unit">/10</div>
                </app-input>
                <app-error :error="get(error, 'pass_score', '')" />
              </div>

              <div class="col-12 col-md-3">
                <label
                  for="count"
                  class="heading-5 font-weight-bold text-dark"
                >Số lần làm bài tối đa</label>

                <app-input
                  type="text"
                  class="mb-0 ce-input-with-unit mt-3"
                  @onFocus="(event) => event.target.select()"
                  id="count"
                  size="md"
                  style="width: 12rem;"
                  v-model="payload.reworks"
                >
                  <div slot="unit">Lần</div>
                </app-input>
                <app-error :error="get(error, 'reworks', '')" />
              </div>
            </div>
          </div>

          <!-- Open/close time -->
          <div class="detail-exercise__doing-info">
            <div class="row mb-4">
              <div class="col-12">
                <div class="setup-time">
                  <h5 class="mb-4">
                    Cài đặt thời gian (Không bắt buộc)
                    <IconQuestionCircle width="20px" height="20px" class="fill-gray" />
                  </h5>

                  <div class="d-flex align-items-center mb-3">
                    <p class="w-120">Thời gian mở đề:</p>

                    <SelectDate
                      @onChange="handleChangeOpenTime"
                      :value="payload.open_time"
                      :disabled="!payload.opentime_enable"
                    />
                    <app-checkbox v-model="payload.opentime_enable">
                      <span class="text-base">Áp dụng</span>
                    </app-checkbox>
                  </div>
                  <app-error :error="get(error, 'open_time', '')" />

                  <div class="d-flex align-items-center">
                    <p class="w-120">Thời gian đóng đề:</p>

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
              </div>
            </div>
          </div>

          <div v-if="hasFile" class="mb-3">
            <div class="d-flex align-items-center">
              <h5 class="nowrap align-self-baseline">File đã tải lên: &nbsp;</h5>
              <div class="align-self-baseline">
                <a
                  class="d-inline-flex align-items-center"
                  v-for="(item, index) in attachments"
                  :key="index"
                  :title="get(item, 'name', '')"
                  :href="get(item, 'url', '')" target="_blank" download>
                  {{ limitLetter(get(item, 'name', ''), 20) }} <IconCheckCircle class="fill-primary ml-2"/> <span v-if="index < attachments.length - 1">,&nbsp;</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- List of question -->
        <hr class="mt-4 mb-2" />
        <question-list
          v-if="get(dataPayload, 'statistic.questions', 0) > 0"
          :dataPayload="dataPayload"
          :filterBankExamChoiceList="filterBankExamChoice"
          :filterBankExamEssayList="filterBankExamEssay"
          @dataChangeIndex="dataChangeIndex"
          @dataEssayIndex="dataEssayIndex"
        />
        <have-no-question v-else sub-title="Bạn chưa hoàn thành nội dung bài kiểm tra" />
        <div class>
          <div class="d-flex justify-content-center mt-4 mb-0">
            <app-button
              color="white"
              class="font-weight-semi-bold mr-4 text-secondary bg-white"
              size="md"
              @click="$emit('goBack')"
              style="min-width: 10rem;"
            >Huỷ</app-button>
            <app-button
              color="primary"
              class="font-weight-semi-bold"
              size="md"
              @click="handleComplete"
              style="min-width: 10rem;"
            >Hoàn thành</app-button>
          </div>
        </div>
      </template>
    </sub-block-section>
    <app-modal-confirm
      v-if="modal"
      @cancel="modal = false"
      @ok="handleOk"
      title="Xác nhận"
      description="Nếu bạn chọn hình thức upload cả đề thi, bạn sẽ phải tạo lại câu hỏi và đáp án từ đầu. Những câu hỏi bạn tạo ra trước đó sẽ bị xoá. Bạn có muốn tiếp tục?"
    />
    <app-modal-confirm
      v-if="modalTestBank"
      @cancel="modalTestBank = false"
      @ok="handleOkTestBank"
      title="Xác nhận"
      description="Nếu bạn chọn hình thức thêm câu hỏi từ ngân hàng đề thi, những câu hỏi bạn tạo ra trước đó sẽ bị xoá. Bạn có muốn tiếp tục?"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ButtonCreateQuestion from "~/components/page/course/create/common/ButtonCreateQuestion";
import QuestionList from "~/components/page/course/create/exams/QuestionList";
import IconArrowLeft from "~/assets/svg/v2-icons/arrow_back_ios_24px.svg?inline";
import IconAngleDown from "~/assets/svg/design-icons/angle-down.svg?inline";
import IconEditAlt from "~/assets/svg/v2-icons/edit.svg?inline";
import IconPlus2 from "~/assets/svg/icons/plus2.svg?inline";
import IconQuestionCircle from "~/assets/svg/design-icons/question-circle.svg?inline";
import IconCheckCircle from '~/assets/svg/icons/check-circle.svg?inline';
import HaveNoQuestion from "~/components/page/course/create/common/HaveNoQuestion.vue";
import SelectDate from "~/components/page/course/create/setting/SelectDate";
import EditNameForm from "~/components/page/course/create/common/EditNameForm";
import { limitLetter, getParamQuery, useEffect } from "~/utils/common";
import { CATEGORY_TEST, PAGE_SIZE } from "~/utils/constants";
import { get, cloneDeep } from "lodash";
import moment from "moment";
import { getUTCDateTime, getLocalDateTime } from "~/utils/moment";
import * as actionTypes from "~/utils/action-types";
const EXAM_STORE = `elearning/manager/bank/exam`;
export default {
  components: {
    ButtonCreateQuestion,
    QuestionList,
    IconArrowLeft,
    IconEditAlt,
    IconPlus2,
    IconCheckCircle,
    IconQuestionCircle,
    HaveNoQuestion,
    IconAngleDown,
    SelectDate,
    EditNameForm,
  },

  props: {
    dataTest: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    ...mapState("elearning/create", {
      general: "general",
      lesson: "lesson",
      exams: "exams",
      setting: "setting",
    }),
    ...mapState("elearning/create", {
      exam: "exam",
    }),
    ...mapState(EXAM_STORE, ["bankExamDetailList"]),
    // ...mapState(EXAM_STORE, ["getObjBankExamEdit"]),
    isEdittingCourse() {
      return get(this, "general.type", "") === "COURSE";
    },
    isEdittingLecture() {
      return get(this, "general.type", "") === "LECTURE";
    },
    disabledType() {
      return !!(
        get(this, "dataTest.settings.weight", "") !== "" ||
        get(this, "dataTest.settings.coefficient", "") !== ""
      );
    },
    filterTypeRadio() {
      if (get(this, "dataTest.settings.weight", "") !== "") {
        // this.payload.weight = get(this, "exams.content.0.weight", "");
        return "weight";
      }
      if (get(this, "dataTest.settings.coefficient", "") !== "") {
        // this.payload.coefficient = get(this, "exams.content.0.coefficient", "");
        return "coefficient";
      }
    },
    filterBankExamChoice() {
      const data =
        this.bankExamDetailList && this.bankExamDetailList.content
          ? this.bankExamDetailList.content
          : [];
      const dataMap = data.filter((item) => item.category == "CHOICE");
      this.list = cloneDeep(dataMap);
      return dataMap;
    },
    filterBankExamEssay() {
      const data =
        this.bankExamDetailList && this.bankExamDetailList.content
          ? this.bankExamDetailList.content
          : [];
      const dataMap = data.filter((item) => item.category == "ESSAY");
      return dataMap;
    },
    hasFile() {
      return this.dataTest && this.dataTest.upload && this.dataTest.upload.length > 0;
    },
    attachments() {
      if (this.hasFile) {
        return this.dataTest.upload
      }
      return [];
    }
  },

  data() {
    return {
      payload: {
        index: 1,
        id: this.dataTest.id || "",
        elearning_id: "",
        subject_id: (this.dataTest.subject && this.dataTest.subject.id) || "",
        grade_id: (this.dataTest.grade && this.dataTest.grade.id) || "",
        required: true,
        title: this.dataTest.name || "",
        type: this.dataTest.type || "",
        pass_score:
          (this.dataTest.settings && this.dataTest.settings.passing_score) || 0,
        reworks: (this.dataTest.settings && this.dataTest.settings.works) || 1,
        duration:
          (this.dataTest.settings && this.dataTest.settings.duration) || 0,
        category: "TEST",
        open_time:
          (this.dataTest.settings && this.dataTest.settings.start_time) || "",
        opentime_enable:
          (this.dataTest.settings && this.dataTest.settings.starttime_enable) ||
          false,
        close_time:
          (this.dataTest.settings && this.dataTest.settings.end_time) || "",
        closetime_enable:
          (this.dataTest.settings && this.dataTest.settings.endtime_enable) ||
          false,
        coefficient:
          (this.dataTest.settings && this.dataTest.settings.coefficient) || 1,
        weight: (this.dataTest.settings && this.dataTest.settings.weight) || "",
        method: this.dataTest.method || "",
      },
      typeRadio: "",
      error: {
        title: "",
        required: "",
        type: "",
        duration: "",
        pass_score: "",
        reworks: "",
        weight: "",
      },
      heads: [
        {
          name: "order",
          text: "STT",
        },
        {
          name: "title",
          text: "Tiêu đề",
        },
        {
          name: "type",
          text: "Thể loại",
        },
        {
          name: "questionNum",
          text: "Số câu hỏi",
        },
        {
          name: "required",
          text: "Loại bài tập",
        },
        {
          name: "status",
          text: "Trạng thái",
        },
        {
          name: "createdAt",
          text: "Thời gian",
        },
      ],

      showDetailModal: false,
      dataPayload: cloneDeep(this.dataTest),
      dataChange: [],
      dataChangeEssay: [],
      modal: false,
      modalTestBank: false,
    };
  },

  methods: {
    ...mapActions(EXAM_STORE, ["bankExamAdd", "questionSort"]),
    clickBack() {
      this.$emit("goBack");
    },
    initData() {
      this.typeRadio = get(this, "exam.coefficient", false)
        ? "coefficient"
        : "weight";
    },
    initPayload() {
      // this.payload.coefficient = get(this, "exam.coefficient", 0);
      // this.payload.weight = get(this, "exam.weight", 0);
      // this.payload.required = this.exam.required;
      // this.payload.duration = this.exam.duration;
      // this.payload.pass_score = this.exam.pass_score;
      // this.payload.reworks = this.exam.reworks;
      // this.payload.open_time = get(this, "exam.open_time", "");
      // this.payload.open_time = get(this, "exam.close_time", "");
    },
    checkReworks() {
      if (this.payload.required === 0) {
        this.error.reworks = "";
        return true;
      }
      if (this.payload.reworks === "") {
        this.error.reworks = "Số lần làm bài không được để trống";
        return false;
      }
      this.error.reworks = "";
      return true;
    },
    checkType() {
      if (this.payload.type === "") {
        this.error.type = "Loại bài tập không được để trống";
        return false;
      }
      this.error.type = "";
      return true;
    },
    checkRequired() {
      if (this.payload.required === "") {
        this.error.required = "Bài tập bắt buộc không được để trống";
        return false;
      }
      this.error.required = "";
      return true;
    },
    checkWeight(val) {
      if (val != "") {
        this.payload.weight = val;
      } else {
        this.error.weight = "Bạn cần nhập trọng số";
        return false;
      }
    },
    handleCreateQuestion() {
      console.log("[Create Question]");
    },
    handleChangeCoefficient(value) {
      this.payload.coefficient = value;
    },
    handleSelectType(e) {
      const val = e.target.value;
      this.typeRadio = val;
    },
    selectCreateQuesOpt(item) {
      const elearningId = get(this, "$route.query.elearning_id", "");
      const goBackUrl = `/elearning/manager/courses/create?elearning_id=${elearningId}&active_section=exam&active_content=edit-form&exam_id=${this.dataTest.id}`;

      if (item == "FROM_QUESTION_BANK") {
        this.$router.push(
          `/elearning/manager/bank/exams/choose-from-bank?category=TEST&type=${this.dataTest.type}&parent_id=${this.dataTest.id}&elearning_id=${elearningId}&active_section=exam`
        );
      } else if (item == "UPLOAD") {
        this.modal = true;
      } else if (item == "FROM_TEST_BANK") {
        this.modalTestBank = true;
      } else {
        // const goBackUrl = `/elearning/manager/courses/create?elearning_id=${elearningId}&active_section=exam&active_content=edit-form&exam_id=${this.dataTest.id}`;
        this.$router.push(
          `/elearning/manager/courses/create/create-question?type=${item}&parent_id=${this.dataTest.id}&elearning_id=${elearningId}&active_section=exam&active_content=edit-form`
        );
      }
    },
    handleChangeOpenTime(date) {
      console.log("[handleChangeOpenTime]", date);
      this.payload.open_time = date;
      this.checkOpenCloseTime();
    },
    handleChangeCloseTime(date) {
      console.log("[handleChangeCloseTime]", date);
      this.payload.close_time = date;
      this.checkOpenCloseTime();
    },
    checkOpenCloseTime() {
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

      const starttime_enable = get(this, "setting.starttime_enable", true);
      const start_time = get(this, "setting.start_time", "");
      const endtime_enable = get(this, "setting.endtime_enable", true);
      const end_time = get(this, "setting.end_time", "");
      const duration = get(this, "payload.duration", 0);

      // start_time format
      let open_time_timestamp = this.payload.open_time
        ? moment(this.payload.open_time).format("x")
        : null;
      let start_time_timestamp = this.setting.start_time
        ? getLocalDateTime(this.setting.start_time).format("x")
        : null;

      // end_time format
      let close_time_timestamp = this.payload.close_time
        ? moment(this.payload.close_time).format("x")
        : null;
      let end_time_timestamp = this.setting.end_time
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
    isValidTimeEnable(_time, _enable) {
      return _enable && !!_time;
    },
    check2TimeDuration(start_time, end_time, duration) {
      console.log("[check2TimeDuration]", start_time, end_time, duration);
      if (!start_time || !end_time || duration == null || duration == undefined)
        return false;
      const result = end_time - start_time >= duration;
      return result;
    },
    handleComplete() {
      this.payload.elearning_id = get(this, "general.id", "");

      let data = { ...this.payload };
      // if (data.opentime_enable) {
      //   data.open_time = data.open_time.format("YYYY-MM-DD HH:mm:ss");
      // }
      // if (data.closetime_enable) {
      //   data.close_time = data.close_time.format("YYYY-MM-DD HH:mm:ss");
      // }

      if (!data.open_time) delete data.open_time;
      if (!data.close_time) delete data.close_time;
      if (this.filterTypeRadio === "coefficient") delete data.weight;
      if (this.filterTypeRadio === "weight") delete data.coefficient;
      console.log("[data]", data);
      const body = new FormData();
      body.append("id", data.id);
      body.append("category", data.category);
      body.append("parent", "elearning");
      body.append("name", data.title);
      body.append("type", data.type);
      body.append("parent_id", getParamQuery("elearning_id"));
      body.append("duration", data.duration);
      body.append("passing_score", data.pass_score);
      body.append("starttime_enable", data.opentime_enable);
      body.append("endtime_enable", data.closetime_enable);
      body.append("works", data.reworks);
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
      if (data.subject_id) {
        body.append("subject_id", data.subject_id);
      }
      if (data.grade_id) {
        body.append("grade_id", data.grade_id);
      }
      this.bankExamAdd(body).then((result) => {
        if (result.success) {
          console.log("[bankExamAdd]", result);
          this.$toasted.success("Thành công");
          // this.$store.dispatch("elearning/create/getExams");
          this.$store.dispatch(`${EXAM_STORE}/${actionTypes.BANK_EXAM.LIST}`, {
            category: CATEGORY_TEST.TEST,
            parent: "ELEARNING",
            parent_id: getParamQuery("elearning_id"),
            show_statistic: true,
            page: 1,
            size: PAGE_SIZE.MAXIMIZE,
          });
          if (this.dataChange && this.dataChange.length > 0) {
            this.questionSort({ positions: this.dataChange });
          }
          if (this.dataChangeEssay && this.dataChangeEssay.length > 0) {
            this.questionSort({ positions: this.dataChangeEssay });
          }
          this.$emit("goBack");
        } else {
          this.$toasted.error(result.message);
        }
      });
    },
    dataChangeIndex(data) {
      console.log("data", data);
      this.dataChange = data;
    },
    dataEssayIndex(data) {
      console.log("data", data);
      this.dataChangeEssay = data;
    },
    changeName(val) {
      this.payload.title = val;
    },
    handleOk() {
      this.$router.push(
        `/elearning/manager/bank/exams/upload-exam?category=TEST&type=${this.dataTest.type}&parent_id=${this.dataTest.id}&active_section=exam&content_title=${this.dataTest.name}`
      );
    },
    handleOkTestBank() {
      const elearningId = get(this, "$route.query.elearning_id", "");
      this.$router.push(
        `/elearning/manager/bank/exams/choose-from-exam?parent_id=${this.dataTest.id}&type=${this.dataTest.type}&active_section=exam&active_content=edit-form&elearning_id=${elearningId}`
      );
    },
    get,
    limitLetter
  },
  created() {
    this.initPayload();
    this.initData();
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
  },
};
</script>

<style lang="scss">
</style>
