<template>
  <div class="row">
      <AccountPaymentItem
        v-for="(bank, index) in get(this, 'accountBankList', [])"
        :bank="bank"
       :key="index"
       @handleRefreshAccountBank="handleRefresh"
      />
  </div>
</template>

<script>
import AccountPaymentItem from "~/components/page/account/Info/AccountPaymentItem";

import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";

export default {
    components:{
        AccountPaymentItem
    },
    computed: {
        ...mapState("bank", {
        accountBankList: "accountBankList",
        })
    },
    created(){
        this.fecthAccountBank();
    },
    methods:{
        fecthAccountBank(){
        this.$store.dispatch(`bank/${actionTypes.ACCOUNT_BANKS.LIST}`)
        },
        handleRefresh(){
            this.fecthAccountBank();
        },
        get
    }
}
</script>

<style>

</style>