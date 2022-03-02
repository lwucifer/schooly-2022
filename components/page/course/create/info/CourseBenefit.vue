<template>
  <div class="cgi-form-group mb-4">
    <h2 class="cgi-form-title heading-6 mb-3">
      Lợi ích từ {{ name }}
      <!-- <span class="text-sub caption font-weight-normal"
        >(Tối thiểu tổng 300 ký tự)</span
      > -->
    </h2>

    <div class="row">
      <div
        v-for="(item, index) in benefit"
        class="col-md-12 mb-15"
        :key="index"
      >
        <div
          class="cgi-demo-benefit d-flex justify-content-between align-items-center"
        >
          <div class="cgi-demo-text d-flex align-items-center">
            <IconCheckCircle class="mr-2" />
            <p class="text-benefit" v-html="item" />
          </div>

          <div class="cgi-demo-btn">
            <a
              href
              class="text-decoration-none body-1 ml-2 text-error"
              @click.prevent="removeBenefit(index)"
            >
              <IconTrashAlt class="" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <div v-if="benefit.length < 10">
      <button
        v-if="showBtn"
        class="d-flex align-items-center text-primary mt-2"
        size="sm"
        @click="showInputBenefit"
      >
        <IconAdd class="mr-2" />
        <span class="font-weight-semi-bold">Thêm lợi ích</span>
      </button>

      <app-editor-menu-bubble
        v-if="showBenefit"
        class="bg-white mb-4 flex-grow"
        :placeholder="`Nhập lợi ích từ` + ' ' + name"
        v-model="benefitEditorValue"
      />
      <app-error class="mb-4" :error="error"></app-error>

      <div class="text-right" v-if="showBenefit">
        <app-button
          outline
          color="error"
          class="mr-3"
          size="sm"
          @click="cancelInputBenefit"
          >Hủy</app-button
        >

        <app-button
          @click="addBenefit(benefitEditorValue)"
          class="font-weight-normal body-2"
          :disabled="!submit"
          size="sm"
          >Thêm lợi ích</app-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { useEffect } from "~/utils/common";
const IconCheckCircle = () =>
  import("~/assets/svg/v2-icons/check_green.svg?inline");
const IconTrashAlt = () =>
  import("~/assets/svg/v2-icons/delete_sweep.svg?inline");
import { get } from "lodash";
const IconAdd = () => import("~/assets/svg/v2-icons/add_green.svg?inline");

export default {
  components: {
    IconCheckCircle,
    IconTrashAlt,
    IconAdd,
  },

  props: {
    name: {
      type: String,
      default: "",
    },
    benefit: {
      type: Array,
      default: [],
    },
  },

  computed: {
    error() {
      if (this.benefitEditorValue === "") {
        return "";
      }
      if (get(this, "benefitEditorValue.length", 0) < 27) {
        return "Nhập tối thiểu 20 ký tự";
      }
      if (get(this, "benefitEditorValue.length", 0) > 282) {
        return "Nhập tối đa 255 ký tự";
      }
      return "";
    },
    submit() {
      if (
        get(this, "benefitEditorValue.length", 0) >= 27 &&
        get(this, "benefitEditorValue.length", 0) <= 282
      ) {
        return true;
      }
      return false;
    },
  },

  data() {
    return {
      benefitEditorValue: "",
      showBenefit: false,
      showBtn: true,
    };
  },

  methods: {
    removeBenefit(index) {
      this.$emit("removeBenefit", index);
    },

    showInputBenefit() {
      this.showBenefit = true;
      this.showBtn = false;
    },

    addBenefit(html) {
      if (this.disabled_all) return;
      if (this.benefit.length < 10 && this.benefitEditorValue) {
        this.$emit("addBenefit", html);
        this.benefitEditorValue = "";
      }
    },

    cancelInputBenefit() {
      this.benefitEditorValue = "";
      this.$emit("cancelInputBenefit");
      this.showBenefit = false;
      this.showBtn = true;
    },
  },
};
</script>
