<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <SchoolAccountSide :active="4"/>
      </div>
      <div class="col-md-9">
        <!--<div class="elearning-history__main">-->
        <div class="">
          <block-section
            title="Lịch sử giao dịch"
          >
            <template v-slot:content>
              <transaction-history />
            </template>
          </block-section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SchoolAccountSide from "~/components/page/school/SchoolAccountSide"
import TransactionHistory from "~/components/page/account/Info/TransactionHistory"
import IconFilter from "~/assets/svg/icons/filter.svg?inline";
import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";

export default {
  name: "E-learning",
  layout: 'account-info',

  components: {
    IconFilter,
    SchoolAccountSide,
    TransactionHistory
  },

  data() {
    return {
  
    };
  },
  computed: {
    ...mapState("auth", ["loggedUser"])
  },

  methods: {
    onPageChange(e) {
      const that = this
      that.pagination = { ...that.pagination, ...e }
      console.log(that.pagination);
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/_elearning-history.scss";
</style>