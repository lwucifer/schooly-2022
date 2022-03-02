import * as mutationTypes from "../utils/mutation-types";
import * as actionTypes from "../utils/action-types";
import auth from "../services/Auth";
import * as APIs from "../utils/endpoints";
import { setToken, setAccessToken, removeToken } from "../utils/auth";
import { authFire } from "../services/firebase/FirebaseInit";
import { USER_ROLES } from "~/utils/constants";

import { v4 as uuidv4 } from "uuid";

/**
 * initial state
 */
const state = () => ({
  accountStatus: "",
  token: null,
  access_token: null,
  firebaseToken: "",
  currentDevice: {},
  phonePass: {}
});

/**
 * initial getters
 */
const getters = {
  isAuthenticated(state, getters, rootState) {
    return !!state.token;
  },
  token(state) {
    return state.token;
  },
  accessToken(state) {
    return state.access_token;
  },
  refreshToken(state) {
    if (!state.token) return null;
    if (typeof state.token == "string") {
      return state.token ? JSON.parse(state.token).refresh_token : null;
    }
    return state.token.refresh_token;
  },
  getSocketURIParam(state) {
    const account = state.token;
    const uuidV4 = uuidv4();

    return `user_id=${account.id}&token=${account.access_token}&unique_id=${uuidV4}`;
  },
  userId(state) {
    return !!state.token ? state.token.id : "";
  },
  fullName(state) {
    return !!state.token ? state.token.fullname : "";
  },
  avatarUser(state) {
    return !!state.token ? state.token.avatar : {};
  },
  roles(state) {
    return !!state.token ? state.token.roles : [];
  },
  roleNames(state) {
    const accountRole = !!state.token ? state.token.roles : [];
    return accountRole.map(r => r.authority);
  },
  isTeacherRole(state) {
    if (!state.token) return false;
    const accountRole = !!state.token ? state.token.roles : [];
    const roleNames = accountRole.map(r => r.authority);
    return roleNames.length > 0 && roleNames.includes(USER_ROLES.ROLE_TEACHER);
  },
  isStudentRole(state) {
    if (!state.token) return false;
    const accountRole = !!state.token ? state.token.roles : [];
    const roleNames = accountRole.map(r => r.authority);
    return roleNames.length > 0 && roleNames.includes(USER_ROLES.ROLE_STUDENT);
  },
  phonePass(state) {
    return state.phonePass;
  },
  uuidUser(state) {
    return !!state.token ? state.token.uuid : "";
  },
  organizationId(state) {
    return !!state.token && state.token.organization
      ? state.token.organization.id
      : "";
  },
  organizationLevel(state) {
    return !!state.token && state.token.organization
      ? state.token.organization.level
      : "";
  },
  organizationName(state) {
    return !!state.token && state.token.organization
      ? state.token.organization.name
      : "";
  },
  assignableCheck(state) {
    return !!state.token
      ? state.token.assignable
      : "";
  }
};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.AUTH.LOGIN](
    { commit },
    { phone, email, password, g_recaptcha_response }
  ) {
    const result = await new auth(this.$axios).login({
      phone,
      email,
      password,
      g_recaptcha_response
    });
    if (result.success) {
      console.log("Login [REPONSE]", result);
      commit(mutationTypes.AUTH.SET_TOKEN, result.data);
      commit(mutationTypes.AUTH.SET_ACCESS_TOKEN, result.data.access_token);
    }
    return result;
  },

  async [actionTypes.AUTH.REGISTER]({ commit }, payload) {
    const result = await new auth(this.$axios).register(payload);
    return result;
  },

  [actionTypes.AUTH.SENDOTP]({ dispatch, commit }, payload) {
    console.log("VERIFY_WITH_PHONE", payload);
    return authFire
      .signInWithPhoneNumber(payload.phone, payload.appVerifier)
      .then(function(confirmationResult) {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        return confirmationResult;
      })
      .catch(function(error) {
        console.log("error", error);
        return error;
      });
  },

  [actionTypes.AUTH.VERIFY_OTP]({ dispatch, commit }, payload) {
    if (window.confirmationResult) {
      return confirmationResult
        .confirm(payload)
        .then(result => {
          // User signed in successfully.
          const user = result.user;
          console.log("user", user);
          commit(mutationTypes.AUTH.SET_FIREBASE_TOKEN, user._lat);
          return result;
          // ...
        })
        .catch(error => {
          // User couldn't sign in (bad verification code?)
          // ...
          console.log("error", error);
          return error;
        });
    }
  },

  async [actionTypes.AUTH.RESET_PASSWORD_REQUEST]({ commit }, payload) {
    const result = await new auth(this.$axios).resetPasswordRequest(payload);
    return result;
  },

  async [actionTypes.AUTH.LOGOUT]({ commit }, payload) {
    const result = await new auth(this.$axios).logout(payload);
    if (result.success) {
      commit(mutationTypes.AUTH.REMOVE_TOKEN);
    }
    return result;
  },

  async [actionTypes.AUTH.STATUS]({ commit }, payload) {
    const result = await new auth(this.$axios).status(payload);
    return result;
  },

  async [actionTypes.AUTH.FORGOT_PASSWORD]({ commit }, payload) {
    const result = await new auth(this.$axios).forgotPassword(payload);
    return result;
  },

  async [actionTypes.AUTH.CHANGE_PASSWORD]({ commit }, payload) {
    const result = await new auth(this.$axios).changePassword(payload);
    return result;
  },
  async [actionTypes.AUTH.VERIFY_EMAIL]({ commit }, payload) {
    const result = await new auth(this.$axios).verifyEmail(payload);
    return result;
  },
  async [actionTypes.AUTH.REFRESH_TOKEN]({ commit, state }, payload) {
    try {
      const { data } = await this.$axios.post(APIs.REFRESH_TOKEN, payload);
      // console.log("payload", payload);
      console.log("[REFRESH_TOKEN] response", data);
      if (data.success == true) {
        // update rewnewToken
        commit(mutationTypes.AUTH.SET_ACCESS_TOKEN, data.data.access_token);
        commit(mutationTypes.AUTH.SET_TOKEN, data.data);
      }
      return data;
    } catch (err) {
      console.log("[REFRESH_TOKEN] err", err);
      return err;
    }
  },

  async [actionTypes.AUTH.LOGIN_FACEBOOK]({ commit }, payload) {
    const { data } = await this.$axios.post(
      `${APIs.LOGIN_FACEBOOK}?code=${payload.code}`
    );
    if (data.success) {
      console.log("AUTH.LOGIN_FACEBOOK", data);
      commit(mutationTypes.AUTH.SET_TOKEN, data.data);
      commit(mutationTypes.AUTH.SET_ACCESS_TOKEN, data.data.access_token);
    }
    return data;
  },

  async [actionTypes.AUTH.LOGIN_GOOGLE]({ commit }, payload) {
    const { data } = await this.$axios.post(
      `${APIs.LOGIN_GOOGLE}?code=${payload.code}`
    );
    if (data.success) {
      console.log("AUTH.LOGIN_GOOGLE", data);
      commit(mutationTypes.AUTH.SET_TOKEN, data.data);
      commit(mutationTypes.AUTH.SET_ACCESS_TOKEN, data.data.access_token);
    }
    return data;
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.AUTH.SET_TOKEN](state, token) {
    // console.log("[SET_TOKEN]", token);
    const renewToken = Object.assign({}, state.token, token);
    state.token = renewToken;
    // console.log("[SET_TOKEN] renewToken", renewToken);
    setToken(renewToken);
  },

  [mutationTypes.AUTH.SET_ACCESS_TOKEN](state, access_token) {
    // console.log("[SET_ACCESS_TOKEN]", access_token);
    state.access_token = access_token;
    setAccessToken(access_token);
  },

  [mutationTypes.AUTH.REMOVE_TOKEN](state) {
    console.log("[AUTH.REMOVE_TOKEN]");
    state.token = null;
    state.access_token = null;
    removeToken();
  },

  [mutationTypes.AUTH.SET_ACCOUNT_STATUS](state, _status) {
    console.log("huydv", _status);
    state.accountStatus = _status;
  },
  [mutationTypes.AUTH.SET_FIREBASE_TOKEN](state, _firebaseToken) {
    console.log("firebase Token", _firebaseToken);
    state.firebaseToken = _firebaseToken;
  },
  [mutationTypes.AUTH.SET_CURRENT_DEVICE](state, _currentdevice) {
    state.currentDevice = _currentdevice;
  },
  [mutationTypes.AUTH.SAVE_PHONE_PASS](state, _phonePass) {
    state.phonePass = _phonePass;
  },
  [mutationTypes.AUTH.SAVE_PHONE_STATE](state, _phoneSave) {
    state.phoneSave = _phoneSave;
  },
  [mutationTypes.AUTH.SET_TOKEN_AVATAR](state, avatar) {
    const renewToken = { ...state.token, avatar };
    state.token = renewToken;
    setToken(renewToken);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
