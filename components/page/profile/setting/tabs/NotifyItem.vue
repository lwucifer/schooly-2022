<template>
  <div class="form-dropdown">
    <!--<div class="d-flex">-->
    <div class="form-dropdown__title">
      <p class="fd__title-main">{{ notify.title }}</p>
      <p class="fd__title-des">{{ text }}</p>
      <button
        class="form-dropdown__indicator"
        @click.prevent="showFormNotify = !showFormNotify"
      >
        <IconCaretUp class="icon" v-if="showFormNotify" />
        <IconCaretDown class="icon" v-else />
      </button>
    </div>
    <div v-show="showFormNotify" class="form-dropdown__expand">
      <p class="fd__title-des mb-4">{{ notify.describe }}</p>
      <div class="ml-4">
        <p class="fd__title-main">Hình thức nhận thông báo</p>
        <div class="icon-title__account-info">
          <IconDatabase />
          <span class="">Thông báo đẩy</span>
          <app-toggle-switch
            class="ml-auto"
            :value="'Thông báo đẩy'"
            :checked="checkNotify"
            @change="handleChangeNoti"
          />
        </div>
        <div class="icon-title__account-info">
          <IconEnvelope />
          <span class="">Email</span>
          <app-toggle-switch
            class="ml-auto"
            :value="'Email'"
            :checked="checkEmail"
            @change="handleChangeEmail"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconDatabase from "~/assets/svg/design-icons/database.svg?inline";
import IconEnvelope from "~/assets/svg/design-icons/envelope-alt.svg?inline";
import IconCaretDown from "~/assets/svg/icons/caret-down.svg?inline";
import IconCaretUp from "~/assets/svg/icons/caret-up.svg?inline";
import { get, map } from "lodash";
import { useEffect } from "~/utils/common";

export default {
  components: {
    IconDatabase,
    IconEnvelope,
    IconCaretDown,
    IconCaretUp,
  },
  props: {
    notify: {
      type: Object,
      default: null,
    },
    payload: {},
  },

  mounted() {
    useEffect(this, this.handleSetCheckMailAndPush.bind(this), [
      "notify",
      "payload",
    ]);
  },

  data() {
    return {
      showFormNotify: false,
      checkEmail: true,
      checkNotify: false,
      typeNotifies: [],
    };
  },

  computed: {
    text() {
      let text = "Tắt";
      if (this.checkEmail) text = "Email";
      if (this.checkNotify) text = "Thông báo đẩy";
      if (this.checkNotify && this.checkEmail) text = "Email, Thông báo đẩy";
      return text;
    },
  },

  methods: {
    handleSetCheckMailAndPush() {
      let key = get(this, "notify.key", "");
      if (get(this, `payload.${key}`, "") === "ALL") {
        this.checkEmail = true;
        this.checkNotify = true;
        return;
      }
      if (get(this, `payload.${key}`, "") === "EMAIL") {
        this.checkEmail = true;
        this.checkNotify = false;
        return;
      }
      if (get(this, `payload.${key}`, "") === "PUSH") {
        this.checkEmail = false;
        this.checkNotify = true;
        return;
      }
      if (get(this, `payload.${key}`, "") === "NONE") {
        this.checkEmail = false;
        this.checkNotify = false;
        return;
      }
    },

    handleChangeNoti(e) {
      this.checkNotify = e.check;
      this.handleSaveSetting();
    },
    handleChangeEmail(e) {
      this.checkEmail = e.check;
      this.handleSaveSetting();
    },

    async handleSaveSetting() {
      if (!get(this, "notify.key", "")) {
        this.$toasted.error("Lỗi không tồn tại notify_key");
        return;
      }

      let payload = { ...this.payload };
      payload[get(this, "notify.key", "")] = this.handleSetText();
      const res = await this.$store.dispatch("setting/updateSetting", payload);
      this.$store.dispatch(`setting/getSetting`);
      if (get(res, "success", false)) {
        this.$toasted.success("Thành công");
        return;
      }
      this.$toasted.error(get(res, "message", "Có lỗi xảy ra"));
    },

    handleSetText() {
      if (this.checkNotify && this.checkEmail) {
        return "ALL";
      }
      if (this.checkNotify) {
        return "PUSH";
      }
      if (this.checkEmail) {
        return "EMAIL";
      }
      return "NONE";
    },
  },
};
</script>
