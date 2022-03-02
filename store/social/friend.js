import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import {
  SOCIAL_FRIENDS as API_FRIENDS,
  SOCIAL_FRIENDS_ONLINE
} from "~/utils/endpoints";
import { RESPONSE_SUCCESS } from "~/utils/config";

const state = () => ({
  friendOnlines: [],
  friendSuggestions: [],
  friendBirthdays: []
});

const actions = {
  async [actionTypes.SOCIAL_FRIEND_TIMELINE.GET_FRIEND_ONLINE](
    { commit },
    payload
  ) {
    try {
      const { data } = await this.$axios.get(SOCIAL_FRIENDS_ONLINE, {
        params: payload
      });

      // console.log("[GET_FRIEND_ONLINE]", data);
      if (data.data) {
        commit(
          mutationTypes.SOCIAL_FRIEND_TIMELINE.SET_FRIEND_ONLINE,
          data.data
        );
      }
      return data;
    } catch (err) {
      console.log("[GET_FRIEND_ONLINE] err", err);
      return err;
    }
  },

  async [actionTypes.SOCIAL_FRIEND_TIMELINE.GET_FRIEND_SUGGESTION](
    { commit },
    payload
  ) {
    try {
      const { data } = await this.$axios.get(API_FRIENDS, { params: payload });

      // console.log("[GET_FRIEND_SUGGESTION]", data);
      if (data.data) {
        commit(
          mutationTypes.SOCIAL_FRIEND_TIMELINE.SET_FRIEND_SUGGESTION,
          data.data
        );
      }
      return data;
    } catch (err) {
      console.log("[GET_FRIEND_SUGGESTION] err", err);
      return err;
    }
  },

  async [actionTypes.SOCIAL_FRIEND_TIMELINE.GET_FRIEND_BIRTHDAY](
    { commit },
    payload
  ) {
    try {
      const { data } = await this.$axios.get(API_FRIENDS, { params: payload });

      // console.log("[GET_FRIEND_BIRTHDAY]", data);
      if (data.data) {
        commit(
          mutationTypes.SOCIAL_FRIEND_TIMELINE.SET_FRIEND_BIRTHDAY,
          data.data
        );
      }
      return data;
    } catch (err) {
      console.log("[GET_FRIEND_BIRTHDAY] err", err);
      return err;
    }
  },

  async [actionTypes.SOCIAL_FRIEND_TIMELINE.ADD_FRIEND](
    { commit },
    payload
  ) {
    try {
      const { data } = await this.$axios.post(API_FRIENDS, payload);

      console.log("[ADD_FRIEND]", data);
      return data;
    } catch (err) {
      console.log("[ADD_FRIEND] err", err);
      return err;
    }
  },

  async [actionTypes.SOCIAL_FRIEND_TIMELINE.CANCEL_FRIEND](
    { commit },
    payload
  ) {
    try {
      const { data } = await this.$axios.delete(`${API_FRIENDS}/${payload}`);

      console.log("[CANCEL_FRIEND]", data);
      return data;
    } catch (err) {
      console.log("[CANCEL_FRIEND] err", err);
      return err;
    }
  },
};

const getters = {};

const mutations = {
  [mutationTypes.SOCIAL_FRIEND_TIMELINE.SET_FRIEND_ONLINE](state, _data) {
    state.friendOnlines = _data;
  },
  [mutationTypes.SOCIAL_FRIEND_TIMELINE.SET_FRIEND_SUGGESTION](state, _data) {
    state.friendSuggestions = _data;
  },
  [mutationTypes.SOCIAL_FRIEND_TIMELINE.SET_FRIEND_BIRTHDAY](state, _data) {
    state.friendBirthdays = _data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
