<template>
    <div class="box-bank-card">
      <p class="title">Ngân hàng: <span class="value">{{get(this,"bank.bank_name","")}}</span></p>
      <p class="title">Chi nhánh: <span class="value">{{get(this,"bank.branch","")}}</span></p>
      <p class="title">Tên chủ tài khoản: <span class="value">{{get(this,"bank.account_name","")}}</span></p>
      <p class="title">Số tài khoản: <span class="value">{{get(this,"bank.account_number","")}}</span></p>
      <div class="action-group">
        <button
          class=""
          style="margin-right: 3.7rem;"
          @click="handleRefreshAccountBank"
          title="Chỉnh sưả"
        >
          <IconEditAlt class="icon" />
        </button>
        <button class=""
           @click="handleDeleteAccountBank"
           title="Xóa"
        >
          <IconTrashAlt class="icon fill-secondary" />
        </button>
      </div>
    </div>
</template>

<script>
import IconEditAlt from "~/assets/svg/design-icons/edit-alt.svg?inline";
import IconTrashAlt from "~/assets/svg/design-icons/delete_outline_24px.svg?inline"
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
export default {
  components:{
    IconEditAlt,
    IconTrashAlt
  },
  props:{
    bank: {
      type: Object,
      default: null
    }
  },
  methods:{
    get,
    async handleDeleteAccountBank(){
      const payload = get(this,"bank.user_bank_id","");
      console.log(payload)
      const result = await this.$store.dispatch(`bank/${actionTypes.ACCOUNT_BANKS.DELETE}`,payload)
      if (get(result, "success", false)) {
        this.$toasted.success(get(result, "message", ""));
        this.$emit("handleRefreshAccountBank");
        return;
      }
      this.$toasted.error(get(result, "message", ""));
    },
    handleRefreshAccountBank(){
      this.$emit("handleRefreshAccountBank");
    }
  }
}
</script>

<style lang="scss">
 
</style>