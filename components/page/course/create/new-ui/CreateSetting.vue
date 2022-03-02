<template>
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
            { value: 'PRIVATE', text: 'Riêng tư' },
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
        {{ get(general, "type", "") == "LECTURE" ? "bài giảng" : "khóa học" }}
      </h6>
      <app-radio-group>
        <app-radio
          value="1"
          class="mr-4"
          :checked="payload.comment_allow === true"
          @click="handleChangeCommentAllow(true)"
        >Có</app-radio>
        <app-radio
          value="0"
          :checked="payload.comment_allow === false"
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
            { value: 2, text: 'Miễn phí' },
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
        @onFocus="(event) => event.target.select()"
        @input="handleChangeFee"
        only-number
        class="text-primary font-weight-semi-bold w-100 input-price"
        size="sm"
      >
      </app-input>
    </div>

    <div v-if="this.free == 1">
      <h6 class="mb-2">Giá sau khuyến mại (đ)</h6>

      <div class="d-flex align-item-center">
        <app-input
          :value="numeral(payload.price).format()"
          @onFocus="(event) => event.target.select()"
          @input="handleChangePrice"
          only-number
          class="text-primary font-weight-semi-bold w-100 mb-0 input-price"
          size="sm"
        >
        </app-input>

        <div class="percent_price__ElearningCreate bg-primary text-white ml-3">{{ percent_price }}</div>
      </div>
      <app-error :error="get(error, 'price', '')" />
    </div>
  </div>
</template>

<script>
import IconAngleDown from "~/assets/svg/design-icons/angle-down.svg?inline";
import CreateAction from "~/components/page/course/create/common/CreateAction";
import { getParamQuery, useEffect } from "~/utils/common";
import { get, toNumber } from "lodash";
import numeral from "numeral";
import { createPayloadCourseSetting } from "~/models/course/AddCourse";
import * as actionTypes from "~/utils/action-types";
import { mapState } from "vuex";
import { validatePrice } from "~/utils/validations";
import * as yup from "yup";
import IconArrowLeft from "~/assets/svg/design-icons/arrow-left.svg?inline";
import IconDelete from "~/assets/svg/v2-icons/delete_sweep_2.svg?inline";
import IconSave from "~/assets/svg/v2-icons/save_24px.svg?inline";
import Forward from "~/assets/svg/v2-icons/forward_2.svg?inline";
import IconClose from "~/assets/svg/icons/close.svg?inline";
import IconWarning from "~/assets/svg/icons/warning.svg?inline";
import IconQuestionCircle from "~/assets/svg/design-icons/question-circle.svg?inline";
import IconCalender from "~/assets/svg/v2-icons/calendar_today_24px.svg?inline";
import SelectDate from "~/components/page/course/create/setting/SelectDate";
import {
  getUTCDateTime,
  getUTCDateTimeHH_MM_A,
  getLocalDateTime,
} from "~/utils/moment";
import moment from "moment";

export default {
  components: {
    IconAngleDown,
    CreateAction,
    IconArrowLeft,
    IconDelete,
    IconSave,
    Forward,
    IconClose,
    IconWarning,
    IconQuestionCircle,
    IconCalender,
    SelectDate,
  },

  data() {
    return {
      showModalConfirm: false,
      confirmLoading: false,
      free: "",
      payload: {
        comment_allow: "",
        price: 0,
        elearning_id: get(this, "general.id", ""),
        fee: 0,
        privacy: "",
        end_time: "",
        endtime_enable: false,
        start_time: "",
        starttime_enable: false,
      },
      error: {
        privacy: "",
        price: "",
        comment_allow: "",
        free: "",
        end_time: "",
      },
    };
  },
  mounted() {
    useEffect(this, this.handleChangeSetting.bind(this), ["setting"]);
  },

  computed: {
    ...mapState("elearning/create", {
      general: "general",
      progress: "progress",
      setting: "setting",
    }),
    disabled_all() {
      return this.$store.getters["elearning/create/disabled_all"];
    },
    percent_price() {
      let percent_price = "100%";
      const _fee = numeral(get(this, "payload.fee", 0)).value();
      const _price = numeral(get(this, "payload.price", 0)).value();
      if (_fee && _price) {
        percent_price = numeral((_price - _fee) / _fee).format("0%");
      }
      return percent_price;
    },
    textButton() {
      if (!this.nextStep) return "Lưu & gửi lên";
      return "Lưu & tiếp tục";
    },
    nextStep() {
      if (get(this, "progress.elearning_status", "") === "APPROVED") {
        return false;
      }
      return true;
    },
  },

  watch: {
    "payload.starttime_enable": {
      handler: function () {
        if (!this.payload.starttime_enable) {
          this.payload.start_time = "";
        }
      },
      deep: true,
    },
    "payload.endtime_enable": {
      handler: function () {
        if (!this.payload.endtime_enable) {
          this.payload.end_time = "";
        }
      },
      deep: true,
    },
  },

  methods: {
    get,

    handleCheckPayload() {
      const privacy = this.handleCheckPrivacy();
      const comment_allow = this.handleCheckCommentAllow();
      const price = this.handleCheckPrice();
      const end_date = this.handleCheckEndDate();
      return privacy && comment_allow && price && end_date;
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

    handleCheckPrivacy() {
      if (get(this, "payload.privacy", "") === "") {
        this.error.privacy = "Bạn chưa chọn chế độ hiển thị";
        return false;
      }
      this.error.privacy = "";
      return true;
    },

    handleCheckCommentAllow() {
      if (get(this, "payload.comment_allow", "") === "") {
        this.error.comment_allow = "Bạn chưa chọn cho phép bình luận";
        return false;
      }
      this.error.comment_allow = "";
      return true;
    },

    handleCheckEndDate() {
      this.error.end_time = "";
      // if (!this.payload.start_time) return true;
      if (!this.payload.end_time) return true;
      // if (!this.payload.starttime_enable) return true;
      if (!this.payload.endtime_enable) return true;
      const start_time_timestamp = this.payload.start_time
        ? moment(this.payload.start_time).format("x")
        : moment().format("x");
      const end_time_timestamp = moment(this.payload.end_time).format("x");
      if (end_time_timestamp - start_time_timestamp < 24 * 7 * 3600 * 1000) {
        this.error.end_time =
          "Thời gian kết thúc phải hơn thời gian bắt đầu 7 ngày";
        return false;
      }
      return true;
    },

    handleChangeStartDate(date) {
      this.payload.start_time = date;
    },

    handleChangeEndDate(date) {
      this.payload.end_time = date;
      this.handleCheckEndDate();
    },

    handleChangePrice(e) {
      this.payload.price = numeral(e).format();
      this.handleCheckPrice();
    },

    handleChangeCommentAllow(comment_allow) {
      this.payload.comment_allow = comment_allow;
      this.handleCheckCommentAllow();
    },

    handleChangeFee(e) {
      this.payload.fee = numeral(e).format();
      this.payload.price = numeral(e).format();
      this.handleCheckPrice();
    },

    handleChangeSetting() {
      if (get(this, "setting.setting", false)) {
        this.payload = { ...this.setting };
        if (this.payload.starttime_enable) {
          this.payload.start_time = getLocalDateTime(
            this.payload.start_time
          ).format("YYYY-MM-DD HH:mm:ss");
        }
        if (this.payload.endtime_enable) {
          this.payload.end_time = getLocalDateTime(
            this.payload.end_time
          ).format("YYYY-MM-DD HH:mm:ss");
        }
        if (get(this, "setting.price", "") === 0) {
          this.free = 2;
        }
        if (get(this, "setting.price", "") > 0) {
          this.free = 1;
        }
      }
    },

    handleChangePrivacy(privacy) {
      if (this.disabled_all) return;
      this.payload.privacy = privacy;
      this.handleCheckPrivacy();
    },

    handleChangeFree(free) {
      this.free = free;
      if (free != 1) {
        this.payload.fee = 0;
        this.payload.price = 0;
      }
      this.handleCheckPrice();
    },

    handleCLickSave() {
      if (!this.handleCheckPayload()) {
        this.$toasted.error("Invalid params");
        return;
      }
      this.showModalConfirm = true;
    },

    async requestElearning() {
      const elearning_id = getParamQuery("elearning_id");
      const data = {
        elearning_id,
      };

      await this.$store.dispatch(
        `elearning/creating/creating-publish/${actionTypes.ELEARNING_CREATING_PUBLISH.POST}`,
        data
      );
      // cập nhật setting mới sẽ tự động cập nhật progress
      // this.$store.dispatch("elearning/create/getProgress");
    },

    async handleSaveSetting() {
      this.confirmLoading = true;
      this.payload.elearning_id = getParamQuery("elearning_id");
      this.payload.fee = numeral(this.payload.fee).value();
      this.payload.price = numeral(this.payload.price).value();
      if (this.payload.price == 0 && !this.free) {
        this.payload.price = this.payload.fee;
      }
      if (this.payload.comment_allow !== "") {
        this.payload.comment_allow =
          this.payload.comment_allow == 1 ? true : false;
      }

      if (this.free == 1) {
        this.payload.price = numeral(this.payload.price).value();
        this.payload.fee = numeral(this.payload.fee).value();
      }

      if (this.free == 2) {
        this.payload.price = 0;
        this.payload.fee = 0;
      }

      let payload = { ...this.payload };

      if (payload.end_time) {
        payload.end_time = getUTCDateTime(payload.end_time).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }

      if (payload.start_time) {
        payload.start_time = getUTCDateTime(payload.start_time).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }

      if (this.disabled_all) {
        delete payload.privacy;
        delete payload.endtime_enable;
        delete payload.end_time;
        delete payload.start_time;
        delete payload.starttime_enable;
      }

      const result = await this.$store.dispatch(
        `elearning/creating/creating-setting/${actionTypes.ELEARNING_CREATING_SETTING.ADD}`,
        payload
      );

      if (!this.nextStep) {
        this.requestElearning();
      }

      this.handleCancelSetting();

      if (get(result, "success", false)) {
        this.$store.dispatch(`elearning/create/getSetting`);
        this.$toasted.success(get(result, "message", "Thành công"));
        if (this.nextStep && !this.disabled_all) {
          this.$emit("nextStep", "exercise");
        }
        return;
      }
      this.$toasted.error(get(result, "message", "Có lỗi xảy ra"));
    },

    handleCancelSetting() {
      this.showModalConfirm = false;
      this.confirmLoading = false;
    },

    handleReset() {
      this.free = "";
      this.handleChangeSetting();
    },

    numeral,
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/elearning/course/creat/_creat-setting.scss";
</style>
