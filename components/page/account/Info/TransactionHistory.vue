<template>
  <sub-block-section
    :title-cls="{'border-0': true }"
    :content-cls="{ 'px-0': true, 'pt-0': true }"
    bg-content-color="transparent"
    :outline="false"
  >
    <template v-slot:title>
      <filter-form
        @changeDate="changeDate"
        @changeStatus="changeStatus"
        @changePayment="changePayment"
        @submitFilter="changeFilter"
        :selectDateDefault="DateDefault"
      />
    </template>
    
    <template v-slot:content>
      <transaction-list
        :pagination="filterPagination"
        :list.sync="list"
        :loading="loading"
        @changedPagination="updatePagination"
        @changedSort="handleSortTable"
      />
    </template>
  </sub-block-section>
</template>

<script>
import SchoolAccountSide from "~/components/page/school/SchoolAccountSide";
import UploadAvatar from "~/components/page/account/Info/UploadAvatar";
import FilterForm from "~/components/page/account/forms/TransactionFilter"
import TransactionList from "~/components/page/account/tables/TransactionList"
import * as actionTypes from "~/utils/action-types";
import { mapState, mapActions } from "vuex";
import { get } from "lodash";
import { getDateBirthDay, getDateFormat } from "~/utils/moment";
import moment from "moment";
// Import faked data

export default {
  components: {
    SchoolAccountSide,
    UploadAvatar,
    FilterForm,
    TransactionList
  },
  data() {
    return {
      pagination: {},
      params: {},
      list: [],
      loading: false,
      DateDefault:[]
    }
  },
  watch:{
    transactionsList:{
      handler : function(){
        this.list = get(this,"transactionsList.data.content",[]);
        this.pagination = get(this,"transactionsList.data.page",{});
      }
    },

    forceGetTransactions(_newVal, _oldVal) {
      console.log("[forceGetTransactions] watch", _newVal);
      if(_newVal != _oldVal){
        this.fetchTransaction();
      }
    }
  },
  methods: {
    updatePagination(val) {
      this.params.size = val.size;
      this.params.page = val.number + 1;
      this.fetchTransaction();
    },
    fetchTransaction(){
      const payload = {
        params :{
          to: this.params.to,
          from: this.params.from,
          size: this.params.size,
          page: this.params.page,
          status: this.params.status,
          method:this.params.method,
          sort_by: this.params.sort_by,
          sort_type: this.params.sort_type
        }
      }
      this.$store.dispatch(`account/${actionTypes.ACCOUNT_TRANSACTIONS.LIST}`,payload)
    },
    changeDate(date){
      this.params.from = date[0];
      this.params.to = date[1];
      this.params.page = 1;
      this.fetchTransaction();
    },
    changePayment(e){
      this.params.method = e;
      this.params.page = 1;
      this.fetchTransaction();
    },
    changeStatus(s){
      this.params.status = s;
      this.params.page = 1;
      this.fetchTransaction();
    },
    getDateSelect(){
      const firstday = moment().startOf('month');
      const today = moment();
      this.DateDefault = [firstday,today];
      this.params.from = firstday.format("YYYY-MM-01");
      this.params.to = today.format("YYYY-MM-DD");
    },
    changeFilter(o){
      this.params.status = o.status;
      this.params.method = o.payment;
      this.params.page = 1;
      this.fetchTransaction();
    },
    handleSortTable(val){
      this.params.sort_by = val.sortBy;
      this.params.sort_type = val.order;
      this.fetchTransaction();
    }
  },
  computed: {
    ...mapState("auth", ["loggedUser"]),
    ...mapState("account", [
      "transactionsList",
      "forceGetTransactions",
    ]),
    filterPagination() {
      return {
        size:get(this,"transactionsList.data.page.size",10),
        total_pages:get(this,"transactionsList.data.page.totalPages",0),
        total_elements:get(this,"transactionsList.data.page.totalElements",0),
        first:get(this,"transactionsList.data.page.first",false),
        last:get(this,"transactionsList.data.page.last",false),
        number_of_elements:get(this,"transactionsList.data.page.numberOfElements",0),
        number:get(this,"transactionsList.data.page.number",0)
      };
    }
  },
  created() {
    this.getDateSelect();
    this.fetchTransaction();
  },

};
</script>

<style lang="scss">
</style>
