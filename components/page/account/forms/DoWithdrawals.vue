<template>
  <sub-block-section
    title="Thông tin chuyển khoản"
  >
    <template v-slot:content>
      <div class="form--normal form--do-withdrawl">
        <div class="row">
          <div class="col-md-3"><label for="" class="form--normal__title">Chọn ngân hàng</label></div>
          <div class="col-md-9">
            <div style="width: 19.6rem;">
              <app-vue-select
                :options="banks"
                v-model="$v.bank.$model"
                :placeholder="'Chọn ngân hàng'"
                label="bank_name"
                searchable
                class="app-vue-select mb-4"
                size="sm"
                @input="handleChangedBank"
                has-border
              >
                <template v-slot:option-content="{ option }">
                  <p class="d-inline-block">
                    <span class="d-block text-uppercase font-weight-semi-bold mb-2">{{ get(option, 'bank_name') }} - {{ get(option, 'branch', '') }}</span>
                    <span class="text-body-3">{{ get(option, 'account_number', '') }}</span>
                  </p>
                </template>
              </app-vue-select>
            </div>
            <!--<app-select-->
              <!--class="mb-4"-->
              <!--v-model="filters.bank"-->
              <!--placeholder="Chọn ngân hàng"-->
              <!--:options="banks"-->
              <!--@change="handleChangedBank"-->
            <!--/>-->
          </div>
          <div class="col-md-3"><label for="" class="form--normal__title">Chi nhánh</label></div>
          <div class="col-md-9">
            <app-input
              placeholder="Chi nhánh"
              disabled
              v-model="branch"
              @input="handleChangedBranch"
              class="bg-white"
            />
          </div>
          <div class="col-md-3"><label for="" class="form--normal__title">Tên chủ tài khoản</label></div>
          <div class="col-md-9">
            <app-input
              placeholder="Tên chủ tài khoản"
              disabled
              v-model="owner"
              @input="handleChangedOwner"
            />
          </div>
          <div class="col-md-3"><label for="" class="form--normal__title">Số tài khoản</label></div>
          <div class="col-md-9">
            <app-input
              placeholder="Số tài khoản"
              disabled
              v-model="cardId"
              @input="handleChangedCardId"
            />
          </div>
          <div class="col-md-3"><label for="" class="form--normal__title">Số tiền muốn rút</label></div>
          <div class="col-md-9">
            <app-input
              placeholder="Nhập số tiền muốn rút"
              v-model="$v.amount.$model"
              type="number"
              @input="handleChangedAmount"
              class="mb-3"
              only-number
            >
              <template v-slot:unit>
                <app-button
                  color="transparent"
                  class="px-0 font-weight-normal"
                  style="box-shadow: none;"
                  @click="getAllMoney"
                >
                  Rút hết
                </app-button>
              </template>
            </app-input>
            <div class="form--normal__note mb-3 d-flex justify-content-between">
              <span><i>Rút tối thiểu:</i> <i>{{ minAmount | numeralFormat("0,0") }}</i>{{ CURRENCY }}</span>
              <span>Số dư: <span>{{ balance | numeralFormat("0,0") }}</span>{{ CURRENCY }}</span>
            </div>
          </div>
          
          <div class="col-md-3"></div>
          <div class="col-md-9">
            <app-button
              @click="save"
              :disabled="$v.$invalid"
              size="lg"
            >
              Xác nhận rút tiền
            </app-button>
          </div>
        </div>
      </div>
    </template>
  </sub-block-section>
</template>

<script>
  import { mapState, mapActions } from "vuex";
  import { ERRORS } from "~/utils/error-code";
  import {CURRENCY} from "~/utils/config";
  import {
    required,
    numeric,
    decimal,
    maxValue,
    minValue,
    between
  } from "vuelidate/lib/validators";
  import { get } from "lodash";
  import * as actionTypes from "~/utils/action-types";

  export default {
    data() {
      return {
        bank: null,
        amount: null,
        CURRENCY: CURRENCY,
        minAmount: 50000
      };
    },
    validations() {
      return {
        bank: {
          required
        },
        amount: {
          required,
          decimal,
          between: between(this.minAmount, this.balance)
        },
      }
    },
    props: {
      banks: {
        type: Array,
        default: () => []
      },
      balance: {
        type: Number | String,
        required: true
      }
    },
    computed: {
      branch() {
        return this.get(this, 'bank.branch', '')
      },
      owner() {
        return this.get(this, 'bank.account_name', '')
      },
      cardId() {
        return this.get(this, 'bank.account_number', '')
      }
    },
    methods: {
      save() {
        console.log('[Do withdrawals] Submit')
        this.$emit('submit', this.bank, this.amount)
      },
      handleChangedBank(val) {
        console.log('[Do withdrawals] Change bank', val)
      },
      handleChangedBranch(val) {
        console.log('[Do withdrawals] Change branch')
      },
      handleChangedOwner(val) {
        console.log('[Do withdrawals] Change owner')
      },
      handleChangedAmount(val) {
      },
      handleChangedCardId(val) {
        console.log('[Do withdrawals] Change card id')
      },
      getAllMoney() {
        this.amount = this.balance
        console.log('[Do withdrawals] Get all money')
      },
      resetForm() {
        this.amount = null,
        this.bank = null
      },
      get
    },
    watch: {
    
    }
  }
</script>

<style lang="scss">
  .form--do-withdrawl {
    .app-input.disabled {
      input {
        background-color: #fff;
      }
    }
  }
</style>