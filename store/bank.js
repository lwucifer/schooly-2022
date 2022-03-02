import * as actionTypes from "../utils/action-types";
import * as mutationTypes from "../utils/mutation-types";
import * as APIs from "../utils/endpoints";
import Profile from "../services/account/Profile";
import AccountBank from "../services/bank/account/AccountBank";
import PublicBank from "../services/bank/public/PublicBank";
import result from "./elearning/teaching/result";

const state = () => ({
  bankList: {},
  accountBankList: {},
});

const getters = {
  accountRole(state) {
    return state.profileList ? state.profileList.role : [];
  },
};
const actions = {
  async [actionTypes.ACCOUNT_PROFILE.LIST]({ commit }, payload) {
    try {
      const result = await new Profile(this.$axios)[actionTypes.BASE.LIST](
        payload
      );
      commit(
        mutationTypes.ACCOUNT_PROFILE.SET_ACCOUNT_PROFILE_LIST,
        result.data
      );
    } catch (err) {
      console.log("PROFILE add.err", err);
      return err;
    }
  },
  async [actionTypes.ACCOUNT_BANKS.LIST]({ commit }, payload) {
    try {
      const result = await new AccountBank(this.$axios)[actionTypes.BASE.LIST](
        payload
      );
      commit(mutationTypes.ACCOUNT_BANKS.SET_ACCOUNT_BANKS_LIST, result.data);
    } catch (err) {
      console.log("ACCOUNT_BANK add.err", err);
      return err;
    }
  },
  async [actionTypes.ACCOUNT_BANKS.ADD]({ commit }, payload) {
    try {
      const result = await new AccountBank(this.$axios)[actionTypes.BASE.ADD](
        payload
      );
      console.log("[ACCOUNT_BANKS.ADD]", result);
      return result;
    } catch (err) {
      console.log("ACCOUNT_BANK add.err", err);
      return err;
    }
  },
  async [actionTypes.ACCOUNT_BANKS.DELETE]({ commit }, payload) {
    try {
      const result = await new AccountBank(this.$axios)[
        actionTypes.BASE.DELETE
      ](payload);
      console.log("[ACCOUNT_BANKS.DELETE]", result);
      return result;
    } catch (err) {
      console.log("ACCOUNT_BANK delete.err", err);
      return err;
    }
  },
  async [actionTypes.ACCOUNT_BANKS.EDIT]({ commit }, payload) {
    try {
      const result = await new AccountBank(this.$axios)[actionTypes.BASE.EDIT](
        payload
      );
      console.log("[ACCOUNT_BANKS.EDIT]", result);
      return result;
    } catch (err) {
      console.log("ACCOUNT_BANK EDIT.err", err);
      return err;
    }
  },
  async [actionTypes.PUBLIC_BANK.LIST]({ commit }, payload) {
    try {
      const result = await new PublicBank(this.$axios)[actionTypes.BASE.LIST](
        payload
      );
      commit(mutationTypes.PUBLIC.SET_BANK_LIST, result.data);
    } catch (err) {
      console.log("PUBLIC_BANK list.err", err);
      return err;
    }
  },
};
const mutations = {
  [mutationTypes.ACCOUNT_PROFILE.SET_ACCOUNT_PROFILE_LIST](
    state,
    _profileList
  ) {
    // console.log("SET_ACCOUNT_PROFILE_LIST", _profileList);
    state.profileList = _profileList;
  },
  [mutationTypes.ACCOUNT_BANKS.SET_ACCOUNT_BANKS_LIST](
    state,
    _accountBankList
  ) {
    console.log("SET_ACCOUNT_BANKS_LIST", _accountBankList);
    state.accountBankList = _accountBankList;
  },
  [mutationTypes.PUBLIC.SET_BANK_LIST](state, _bankList) {
    console.log("SET_PUBLIC_BANKS_LIST", _bankList);
    state.bankList = _bankList;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
