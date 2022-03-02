<template>
  <div class="">
    <!--form-->
    <div v-if="showAddPayment">
      <AddBank
        @cancel="showAddPayment = !showAddPayment"
        @addSuccess="addBankDone"
      />
      <hr class="mb-4" />
    </div>

    <!--list-->
    <div class="row mb-4 mt-3" v-if="!showAddPayment">
      <div class="col-md-9">
        <h6 class="mb-3">DANH SÁCH TÀI KHOẢN NHẬN TIỀN</h6>
        <div v-if="notifyMsg">
          <span class="d-flex" :class="msgCls">
            <IconCheck class="icon subheading" />
            {{ notifyMsg }}
          </span>
        </div>
      </div>
      <div class="col-md-3">
        <div class="text-right">
          <app-button @click.prevent="showAddPayment = !showAddPayment">
            <slot name="icon">
              <IconCiclePlus class="icon icon--btn icon--btn--pre" />
            </slot>
            <span>Thêm tài khoản</span>
          </app-button>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6" v-for="(bank, index) in accountBanks" :key="index">
        <AccountPaymentItem
          :bank="bank"
          @handleRefreshAccountBank="refreshDel"
          @handleEditBank="handleEditBank"
        />
      </div>
    </div>
    <EditBank
      v-if="bank"
      @close="closeModal"
      :bank="bank"
      @editSuccess="editBankDone"
    />
    <!-- <p>
      <i style="font-size: 1.3rem;"
        >Để nhận tiền từ việc bán bài giảng/khóa học của bạn, vui lòng cập nhật
        tài khoản ngâng hàng của bạn</i
      >
    </p>
    <EditBank v-if="bank" @close="closeModal"  :bank="bank" @editSuccess="editBankDone" /> -->
  </div>
</template>

<script>
import IconCiclePlus from "~/assets/svg/design-icons/plus-circle.svg?inline";
import IconCheck from "~/assets/svg/design-icons/check.svg?inline";
import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
import AccountEditPaymentModal from "~/components/page/account/Info/AccountEditPaymentModal";
import AddBank from "~/components/page/profile/setting/tabs/AddBank";
import EditBank from "~/components/page/profile/setting/tabs/EditBank";
import AccountPaymentItem from "~/components/page/profile/setting/tabs/AccountPaymentItem";

export default {
  layout: "account-info",

  components: {
    IconCiclePlus,
    IconCheck,
    AccountPaymentItem,
    AccountEditPaymentModal,
    AddBank,
    EditBank,
  },
  data() {
    return {
      showAddPayment: false,
      opts: [],
      bank: null,
      notifyMsg: null,
      notifyType: null,
      params: {
        status: "ACTIVE",
      },
    };
  },
  watch: {
    bankList: {
      handler: function() {
        this.opts = get(this, "bankList", []);
      },
    },
  },
  computed: {
    ...mapState("auth", ["loggedUser"]),
    ...mapState("setting", {
      banks: "banks",
      accountBanks: "accountBanks",
    }),
    msgCls() {
      const colorCls = {
        "text-primary": this.notifyType == "success",
        "text-error": this.notifyType == "error",
      };
      return {
        ...colorCls,
      };
    },
  },
  methods: {
    handleEditBank(bank) {
      this.bank = bank;
    },
    fecthPublicBank() {
      this.$store.dispatch(`bank/${actionTypes.PUBLIC_BANK.LIST}`);
    },
    fetchAccountBank() {
      const payload = {
        params: this.params,
      };
      this.$store.dispatch(`setting/getAccountBanks`, {
        params: { status: "ACTIVE" },
      });
    },
    handleRefresh() {
      this.fetchAccountBank();
    },
    refreshDel() {
      this.handleRefresh();
      this.notifyMsg = "Bạn vừa xóa 1 tài khoản";
      this.notifyType = "success";
      this.$nextTick(() => {
        setTimeout(() => {
          this.notifyMsg = null;
        }, 3000);
      });
    },
    closeModal() {
      this.bank = null;
    },
    addBankDone() {
      this.notifyMsg = "Bạn vừa thêm 1 tài khoản";
      this.notifyType = "success";
      this.$nextTick(() => {
        setTimeout(() => {
          this.notifyMsg = null;
        }, 3000);
      });
    },
    editBankDone() {
      this.notifyMsg = "Chỉnh sửa thành công";
      this.notifyType = "success";
      this.$nextTick(() => {
        setTimeout(() => {
          this.notifyMsg = null;
        }, 3000);
      });
    },
  },
  // created() {
  //   this.fecthPublicBank();
  //   this.fetchAccountBank();
  // },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/account/_account-info-setting.scss";
</style>
