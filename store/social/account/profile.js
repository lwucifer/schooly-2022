import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import { SOCIAL_USERS as ENDPOINT_SOCIAL_USERS } from "~/utils/endpoints";
import * as APIs from "~/utils/endpoints";

const state = () => ({
  socialProfile: {},
  userAccountProfile: {},
  userTotalFriends: 0
});

const getters = {};

const actions = {
  async [actionTypes.SOCIAL_ACCOUNT_PROFILE.GET_SOCIAL_PROFILE](
    { state, commit },
    { uuid } = {}
  ) {
    try {
      const result = await this.$axios.$get(
        `${ENDPOINT_SOCIAL_USERS}/${uuid}/profile`
      );

      if (!result.error) {
        commit(
          mutationTypes.SOCIAL_ACCOUNT_PROFILE.SET_SOCIAL_PROFILE,
          result.data || {}
        );
      }

      return result;
    } catch (error) {
      return error;
    }
  },

  async [actionTypes.SOCIAL_ACCOUNT_PROFILE.GET_ACCOUNT_PROFILE]({ state, commit }, payload) {
    try {
      return this.$axios
        .get(APIs.ACCOUNT_PROFILE, { params: payload })
        .then((res) => res.data)
        .then((result) => {
          console.log("GET_ACCOUNT_PROFILE", result);
          if (result.success) {
            commit(mutationTypes.SOCIAL_ACCOUNT_PROFILE.SET_USER_ACCOUNT_PROFILE, result.data);
          }
          return result;
        });
    } catch (err) {
      console.log("[GET_ACCOUNT_PROFILE] err", err);
      return err;
    }
  },

  async [actionTypes.SOCIAL_ACCOUNT_PROFILE.EDIT_ACCOUNT_PRIVACY]({ state, commit }, payload) {
    try {
      const { data } = await this.$axios.post(
        APIs.ACCOUNT_PRIVACY,
        payload
      );
      return data;
    } catch (err) {
      console.log("[EDIT_ACCOUNT_PRIVACY] err", err);
      return err;
    }
  },

  async [actionTypes.SOCIAL_ACCOUNT_PROFILE.GET_USER_TOTAL_FRIENDS]({ commit }, payload) {
    try {
      const result = await this.$axios.$get(
        `${ENDPOINT_SOCIAL_USERS}/${payload.uuid}/friends/total`
      );

      if (!result.error) {
        commit(mutationTypes.SOCIAL_ACCOUNT_PROFILE.SET_USER_TOTAL_FRIENDS, result.data || 0);
      };

      return result;
    } catch (error) {
      return error;
    }
  }
};

const mutations = {
  [mutationTypes.SOCIAL_ACCOUNT_PROFILE.SET_SOCIAL_PROFILE](state, profile) {
    state.socialProfile = profile;
  },

  [mutationTypes.SOCIAL_ACCOUNT_PROFILE.SET_USER_ACCOUNT_PROFILE](state, _data) {
    state.userAccountProfile = _data;
  },

  [mutationTypes.SOCIAL_ACCOUNT_PROFILE.SET_USER_TOTAL_FRIENDS](state, total) {
    state.userTotalFriends = total;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
