import * as actionTypes from "~/utils/action-types";
import Setting from "~/services/account/Setting";
import PublicBank from "~/services/bank/public/PublicBank";
import AccountBank from "~/services/bank/account/AccountBank";
import { get } from "lodash";

const state = () => ({
  setting: null,
  banks: null,
  accountBanks: null,
});

const actions = {
  async getAccountBanks({ commit }, options = {}) {
    try {
      const result = await new AccountBank(this.$axios)["list"](options);
      if (get(result, "success", false)) {
        commit("accountBanks", get(result, "data", null));
        return;
      }
      commit("accountBanks", null);
    } catch (err) {
      console.log(err);
      commit("accountBanks", null);
    }
  },

  async getBanks({ commit }, options = {}) {
    try {
      const result = await new PublicBank(this.$axios)["list"](options);
      if (get(result, "success", false)) {
        const banks = [];
        get(result, "data", []).map((bank) => {
          bank.value = bank.code;
          bank.text = bank.name;
          banks.push(bank);
        });
        commit("banks", banks);
        return;
      }
      commit("banks", null);
    } catch (err) {
      commit("banks", null);
    }
  },

  async getSetting({ commit }, payload) {
    try {
      const result = await new Setting(this.$axios)[actionTypes.BASE.LIST](
        payload
      );
      if (result.success) {
        commit("setting", result.data);
        return;
      }
      commit("setting", null);
    } catch (err) {
      commit("setting", null);
    }
  },

  async updateSetting({ commit }, payload) {
    try {
      const result = await new Setting(this.$axios)[actionTypes.BASE.ADD](
        payload
      );
      return result;
    } catch (err) {
      console.log("ACCOUNT SETTING update.err", err);
      return err;
    }
  },
};

const mutations = {
  setting(state, data) {
    state.setting = data;
  },
  banks(state, data) {
    state.banks = data;
  },
  accountBanks(state, data) {
    state.accountBanks = data;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
