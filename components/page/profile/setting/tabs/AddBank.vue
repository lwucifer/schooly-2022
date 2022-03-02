<template>
  <sub-block-section
    :has-title="false"
    style="box-shadow: none; margin-left: -1.5rem; margin-right: -1.5rem;"
  >
    <template v-slot:content>
      <div class="form--normal">
        <div class="row">
          <div class="col-md-12">
            <h5 class="mb-4">Thêm tài khoản mới</h5>
          </div>
          <div class="col-md-3">
            <label for="" class="form--normal__title"
              >Chọn ngân hàng nhận</label
            >
          </div>
          <div class="col-md-6">
            <app-select
              class="mb-4"
              v-model="payload.bank_code"
              placeholder="Chọn ngân hàng"
              :options="banks"
              bordered
            />
          </div>
          <div class="col-md-3"></div>
          <div class="col-md-3">
            <label for="" class="form--normal__title">Chi nhánh</label>
          </div>
          <div class="col-md-6">
            <app-input placeholder="Chi nhánh" v-model="payload.branch" />
          </div>
          <div class="col-md-3"></div>
          <div class="col-md-3">
            <label for="" class="form--normal__title">Tên chủ tài khoản</label>
          </div>
          <div class="col-md-6">
            <app-input
              placeholder="Nhập tên chủ tài khoản"
              v-model="payload.account_name"
            />
          </div>
          <div class="col-md-3"></div>
          <div class="col-md-3">
            <label for="" class="form--normal__title">Số tài khoản</label>
          </div>
          <div class="col-md-6">
            <app-input
              placeholder="Nhập số tài khoản"
              v-model="payload.account_number"
            />
          </div>
          <div class="col-md-3"></div>
          <div class="col-md-3"></div>
          <div class="col-md-6 d-flex align-items-center">
            <app-button
              @click="$emit('cancel')"
              color="white"
              size="sm"
              class="mr-3"
            >
              Hủy
            </app-button>
            <app-button size="sm" @click="handleAddBank">
              Thêm
            </app-button>
          </div>
          <div class="col-md-3"></div>
        </div>
      </div>
    </template>
  </sub-block-section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { ERRORS } from "~/utils/error-code";
import { CURRENCY } from "~/utils/config";
import {
  required,
  minLength,
  sameAs,
  maxLength,
} from "vuelidate/lib/validators";
import { validatePassword } from "~/utils/validations";
import { get } from "lodash";

export default {
  data() {
    return {
      filters: {
        bank: null,
        branch: null,
        owner: null,
        cardId: null,
        amount: null,
      },
      CURRENCY: CURRENCY,
      payload: {
        account_name: "",
        account_number: "",
        bank_code: null,
        branch: "",
        id: "",
        is_testing: false,
      },
    };
  },
  // props: {
  //   banks: {
  //     type: Array,
  //     default: () => [],
  //   },
  // },
  // validations: {},

  computed: {
    ...mapState("setting", {
      banks: "banks",
    }),
  },

  methods: {
    async handleAddBank() {
      let data = { ...this.payload };
      if (!data.id) delete data.id;
      try {
        const res = await this.$axios({
          url: "/user/account/banks",
          method: "post",
          data,
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (get(res, "data.success", false)) {
          this.$emit('addSuccess')
          this.$toasted.success(
            "Thêm tài khoản ngân hàng thành công, bạn vui lòng đăng nhập email để active tài khoản. Xin cảm ơn!"
          );
          this.$emit("cancel");
          this.$store.dispatch("setting/getAccountBanks", {
            params: { status: "ACTIVE" },
          });
          return;
        }
        this.$toasted.error(get(res, "data.message", "Có lỗi xảy ra"));
      } catch (error) {
        console.log(error);
        this.$toasted.error("Có lỗi xảy ra");
      }
    },
    save() {
      console.log("[Do withdrawals] Submit");
    },
    handleChangedBank(val) {
      console.log(val);
    },
    handleChangedBranch(val) {
      console.log("[Do withdrawals] Change branch");
    },
    handleChangedOwner(val) {
      console.log("[Do withdrawals] Change owner");
    },
    handleChangedAmount(val) {
      console.log("[Do withdrawals] Change amount");
    },
    handleChangedCardId(val) {
      console.log("[Do withdrawals] Change card id");
    },
    getAllMoney() {
      console.log("[Do withdrawals] Get all money");
    },
  },
  watch: {},
};
</script>

<style lang="scss"></style>
