<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <SchoolAccountSide active="3" />
      </div>
      <div class="col-md-9">
        <block-section
          title="Rút tiền về tài khoản"
          has-icon
        >
          <template v-slot:title>
            <div class="row">
              <div class="col-md-8 d-flex align-items-center">
                <h3 class="block-section__title--main">
                  <span @click="() => { this.$router.go('-1') }" class="d-flex align-items-center">
                    <icon-left-arrow class="block-section__icon-title" title="Quay lại"/>
                  </span>
                  Rút tiền về tài khoản
                </h3>
              </div>
              <div class="col-md-4">
                <div class="text-md-right">
                  <app-button
                    nuxt
                    color="transparent"
                    :disabled="!token"
                    :to="token ? '/' + token.id + '/info/withdrawals' : '/'"
                    style="color: #656565; font-weight: normal; box-shadow: none;"
                    class="px-0"
                  >
                    <slot name="icon">
                      <icon-clock class="icon--btn icon--btn--pre" />
                    </slot>Lịch sử rút tiền
                  </app-button>
                </div>
              </div>
            </div>
          </template>
          <template v-slot:content>
            <do-withdrawals-form
              ref="withdrawForm"
              :banks="accountBankList"
              :balance="get(balance, 'data.available', 0)"
              @submit="submitDoWithdrawal"
            />
          </template>
        </block-section>
      </div>
    </div>
    <app-modal-notify
      v-if="modal.visible"
      :type="modal.type"
      :title="modal.title"
      @ok="modal.visible = false"
      @close="modal.visible = false"
    >
    </app-modal-notify>
  </div>
</template>

<script>
import SchoolAccountSide from "~/components/page/school/SchoolAccountSide"
import DoWithdrawalsForm from "~/components/page/account/forms/DoWithdrawals"
import IconLeftArrow from "~/assets/svg/icons/left-arrow.svg?inline"
import IconClock from "~/assets/svg/design-icons/clock.svg?inline"
import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { createPayloadWithdraw } from "~/models/account/Bank"
import { get } from "lodash";
import { BANK_STATUS } from "~/utils/constants"

export default {
  name: "E-learning",
  layout: 'account-info',

  components: {
    SchoolAccountSide,
    DoWithdrawalsForm,
    IconLeftArrow,
    IconClock
  },
  
  async fetch({ params, query, store, route }) {
    await Promise.all([
      store.dispatch(`bank/${actionTypes.ACCOUNT_BANKS.LIST}`, { params: { status: BANK_STATUS['ACTIVE']}}),
      store.dispatch(`account/${actionTypes.ACCOUNT_BALANCE.LIST}`)
    ]);
  },
  
  data() {
    return {
      modal: {
        visible: false,
        type: 'error',
        message: '',
        title: ''
      }
      
    }
  },
  
  computed: {
    ...mapState("auth", ["token"]),
    ...mapState("auth", ["loggedUser"]),
    ...mapState("bank", {
      accountBankList: "accountBankList",
    }),
    ...mapState("account", {
      balance: "balance",
    }),
  },
  methods: {
    async submitDoWithdrawal(bank, amount) {
      const params = {
        user_bank_id: this.get(bank, 'user_bank_id', ''),
        note: this.get(bank, 'note', ''),
        amount: amount
      }
      const payload = createPayloadWithdraw(params)
      const res = await this.$store.dispatch(`account/${actionTypes.ACCOUNT_WITHDRAW.ADD}`,payload)
      if (this.get(res, 'success', false)) {
        this.modal.title = 'Tạo lệnh rút tiền thành công'
        this.modal.type = 'success'
        this.$refs['withdrawForm'].resetForm()
        await this.getBalance()
        this.$nextTick(() => {
          this.modal.visible = true
        })
      } else {
        this.modal.title = 'Tạo lệnh rút tiền không thành công'
        this.modal.type = 'error'
        this.$nextTick(() => {
          this.modal.visible = true
        })
      }
    },
    async getBalance() {
      await this.$store.dispatch(`account/${actionTypes.ACCOUNT_BALANCE.LIST}`)
    },
    get
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/_elearning-history.scss";
</style>