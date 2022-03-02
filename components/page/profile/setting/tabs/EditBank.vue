<template>
  <app-modal
    centered
    title="Sửa thông tin ngân hàng"
    :footer="false"
    @close="$emit('close')"
  >
    <template v-slot:content>
      <div class="row">
        <div class="col-md-4">
          <label for="" class="form--normal__title">Chọn ngân hàng nhận</label>
        </div>
        <div class="col-md-8">
          <app-select
            class="mb-4"
            v-model="payload.bank_code"
            placeholder="Chọn ngân hàng"
            :options="banks"
          />
        </div>
        <div class="col-md-4">
          <label for="" class="form--normal__title">Chi nhánh</label>
        </div>
        <div class="col-md-8">
          <app-input placeholder="Chi nhánh" v-model="payload.branch" />
        </div>
        <div class="col-md-4">
          <label for="" class="form--normal__title">Tên chủ tài khoản</label>
        </div>
        <div class="col-md-8">
          <app-input
            placeholder="Nhập tên chủ tài khoản"
            v-model="payload.account_name"
          />
        </div>
        <div class="col-md-4">
          <label for="" class="form--normal__title">Số tài khoản</label>
        </div>
        <div class="col-md-8">
          <app-input
            placeholder="Nhập số tài khoản"
            v-model="payload.account_number"
          />
        </div>
        <div class="ml-auto">
          <app-button color="white" size="sm" @click="$emit('close')">
            Hủy
          </app-button>
          <app-button size="sm" class="ml-4" @click="handleAddBank">
            Lưu thay đổi
          </app-button>
        </div>
      </div>
    </template>
  </app-modal>
</template>

<script>
import { get } from "lodash";
import { mapState, mapActions } from "vuex";
import { useEffect } from "~/utils/common";

export default {
  props: {
    bank: {},
  },

  data() {
    return {
      filters: {
        bank: null,
        branch: null,
        owner: null,
        cardId: null,
        amount: null,
      },
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

  mounted() {
    useEffect(this, this.handleChangeBank.bind(this), ["bank"]);
  },

  methods: {
    handleChangeBank() {
      this.payload.account_name = get(this, "bank.account_name", "");
      this.payload.account_number = get(this, "bank.account_number", "");
      this.payload.bank_code = get(this, "bank.bank_code", null);
      this.payload.branch = get(this, "bank.branch", "");
      this.payload.id = get(this, "bank.user_bank_id", "");
    },

    async handleAddBank() {
      let data = { ...this.payload };
      if (!data.id) delete data.id;
      let method = "post";
      if (data.id) method = "put";
      try {
        const res = await this.$axios({
          url: "/user/account/banks",
          method: method,
          data,
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (get(res, "data.success", false)) {
          this.$toasted.success("Sửa tài khoản ngân hàng thành công, bạn vui lòng đăng nhập email để active tài khoản. Xin cảm ơn!");
          this.$emit("close");
          this.$emit('editSuccess')
          this.$store.dispatch("setting/getAccountBanks", {
            params: { status: 'ACTIVE'} 
          });
          return;
        }
        this.$toasted.error(get(res, "data.message", "Có lỗi xảy ra"));
      } catch (error) {
        console.log(error);
        this.$toasted.error("Có lỗi xảy ra");
      }
    },
  },

  computed: {
    ...mapState("setting", {
      banks: "banks",
    }),
  },
};
</script>

<style></style>
