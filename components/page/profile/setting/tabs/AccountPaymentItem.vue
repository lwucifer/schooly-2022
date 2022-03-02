<template>
  <div class="box-bank-card">
    <p class="title">
      Ngân hàng:
      <span class="value">{{ get(this, "bank.bank_name", "") }}</span>
    </p>
    <p class="title">
      Chi nhánh: <span class="value">{{ get(this, "bank.branch", "") }}</span>
    </p>
    <p class="title">
      Tên chủ tài khoản:
      <span class="value">{{ get(this, "bank.account_name", "") }}</span>
    </p>
    <p class="title">
      Số tài khoản:
      <span class="value">{{ get(this, "bank.account_number", "") }}</span>
    </p>
    <div class="action-group">
      <button class="" title="Chỉnh sưả" style="margin-right: 3.7rem;" @click="handleEditBank">
        <IconEditAlt :height="20" :width="20"/>
      </button>
      <button class="" title="Xóa" @click="handleDeleteAccountBank">
        <IconTrashAlt :height="20" :width="20" class="fill-secondary fill-opacity-1" />
      </button>
    </div>
    <app-modal-confirm
      title="Bạn chắc muốn xóa"
      description="It is a long established fat that a reader will be  distracted by the readable content"
      v-if="showModalDelete"
      @ok="handleOk"
      @cancel="handleClose"
    />
  </div>
</template>

<script>
import IconEditAlt from "~/assets/svg/design-icons/edit-alt.svg?inline";
import IconTrashAlt from "~/assets/svg/v2-icons/delete_outline_24px.svg?inline";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
export default {
  components: {
    IconEditAlt,
    IconTrashAlt,
  },
  data(){
    return{
       showModalDelete:false
    }
  },
  props: {
    bank: {
      type: Object,
      default: null,
    },
  },
  methods: {
    get,
    handleDeleteAccountBank() {
      this.showModalDelete = true
    },
    handleRefreshAccountBank() {
      this.$emit("handleRefreshAccountBank");
    },
    handleEditBank() {
      this.$emit("handleEditBank", this.bank);
    },
    async handleOk(){
      const payload = get(this, "bank.user_bank_id", "");
      const result = await this.$store.dispatch(
        `bank/${actionTypes.ACCOUNT_BANKS.DELETE}`,
        payload
      );
      if (get(result, "success", false)) {
        this.$toasted.success(get(result, "message", ""));
        this.$emit("handleRefreshAccountBank");
        this.showModalDelete = false;
        return;
      }
      this.$toasted.error(get(result, "message", ""));
      this.showModalDelete = false;
    },
    handleClose(){
      this.showModalDelete = false;
    }
  },
};
</script>

<style lang="scss">
  svg.fill-secondary {
    path {
      fill: $color-error;
      fill-opacity: 1;
    }
  }
</style>
