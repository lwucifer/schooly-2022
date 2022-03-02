<template>
  <sub-block-section :has-title="false" style="box-shadow: none; margin-left: -1.5rem; margin-right: -1.5rem;">
    <template v-slot:content>
      <div class="form--normal">
        <div class="row">
          <div class="col-md-12">
            <h5 class="mb-4">Thêm tài khoản mới</h5>
          </div>
          <div class="col-md-3"><label for="" class="form--normal__title">Chọn ngân hàng nhận</label></div>
          <div class="col-md-6">
            <app-select
              class="mb-4"
              v-model="filters.bank"
              placeholder="Chọn ngân hàng"
              :options="banks"
              @change="handleChangedBank"
            />
          </div><div class="col-md-3"></div>
          <div class="col-md-3"><label for="" class="form--normal__title">Chi nhánh</label></div>
          <div class="col-md-6">
            <app-input
              placeholder="Chi nhánh"
              v-model="filters.branch"
              @input="handleChangedBranch"
            />
          </div><div class="col-md-3"></div>
          <div class="col-md-3"><label for="" class="form--normal__title">Tên chủ tài khoản</label></div>
          <div class="col-md-6">
            <app-input
              placeholder="Nhập tên chủ tài khoản"
              v-model="filters.owner"
              @input="handleChangedOwner"
            />
          </div><div class="col-md-3"></div>
          <div class="col-md-3"><label for="" class="form--normal__title">Số tài khoản</label></div>
          <div class="col-md-6">
            <app-input
              placeholder="Nhập số tài khoản"
              v-model="filters.cardId"
              @input="handleChangedCardId"
            />
          </div><div class="col-md-3"></div>
          <div class="col-md-3"></div>
          <div class="col-md-6 d-flex align-items-center">
            <app-button
              @click="save"
              color="white"
              size="sm"
              class="mr-3"
            >
              Hủy
            </app-button>
            <app-button
              size="sm"
            >
              Thêm
            </app-button>
          </div><div class="col-md-3"></div>
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
    minLength,
    sameAs,
    maxLength
  } from "vuelidate/lib/validators";
  import { validatePassword } from "~/utils/validations";
  
  export default {
    data() {
      return {
        filters: {
          bank: null,
          branch: null,
          owner: null,
          cardId: null,
          amount: null
        },
        CURRENCY: CURRENCY,
      };
    },
    props: {
      banks: {
        type: Array,
        default: () => []
      }
    },
    validations: {
    
    },
    computed: {
    },
    methods: {
      save() {
        console.log('[Do withdrawals] Submit')
      },
      handleChangedBank(val) {
        console.log('[Do withdrawals] Change bank')
      },
      handleChangedBranch(val) {
        console.log('[Do withdrawals] Change branch')
      },
      handleChangedOwner(val) {
        console.log('[Do withdrawals] Change owner')
      },
      handleChangedAmount(val) {
        console.log('[Do withdrawals] Change amount')
      },
      handleChangedCardId(val) {
        console.log('[Do withdrawals] Change card id')
      },
      getAllMoney() {
        console.log('[Do withdrawals] Get all money')
      }
    },
    watch: {
    
    }
  }
</script>

<style lang="scss">
</style>