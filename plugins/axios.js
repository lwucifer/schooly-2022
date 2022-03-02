import { AUTH as ACTION_AUTH } from "~/utils/action-types";
import {
  checkRequestAuthorize,
  getDeviceId,
  removeToken,
  checkRequestClientInfo,
} from "~/utils/auth";
import { DEVICE_ID, CLIENT_INFO } from "~/utils/config";
import { AUTH as MUTATION_AUTH } from "~/utils/mutation-types";
import { get } from "lodash";
import { translateCode2Txt } from "~/utils/error-code";

let isAlreadyFetchingAccessToken = false;
let subscribers = [];

function onAccessTokenFetched(access_token) {
  subscribers = subscribers.filter((callback) => callback(access_token));
}

function addSubscriber(callback) {
  subscribers.push(callback);
}

export default function ({ store, $axios, redirect }) {
  $axios.onRequest((config) => {
    
    console.log("[onRequest]", config.url);
    // add Device-Id if existed
    if (checkRequestClientInfo(config.url)) {
      const deviceIdFromCookie = getDeviceId();
      const deviceObj = {
        [DEVICE_ID]: deviceIdFromCookie,
      };
      config.headers.common[CLIENT_INFO] = JSON.stringify(deviceObj);
    }

    // add Authorization token if needed
    if (checkRequestAuthorize(config)) {
      if (!store.getters["auth/token"]) return;
      config.headers.common[
        "Authorization"
      ] = `Bearer ${store.state.auth.access_token}`;
    } else {
      delete config.headers.common["Authorization"];
    }
  });

  $axios.onResponse((response) => {
    // console.log("[onResponse]", response);
    const originalRequest = response.config;
    const dataCode = response.data.code;
    const { code, message } = response.data;
    
    if(response.data && response.data.message){
      response.data.message = translateCode2Txt({ code, message });
    }
 
    // console.log("dataCode huydv", dataCode, response.config.url);
    if (dataCode == "SCLCOM_0002") {
      // expire token => renew
      if (!isAlreadyFetchingAccessToken) {
        isAlreadyFetchingAccessToken = true;
        const refreshToken = store.getters["auth/refreshToken"];
        store
          .dispatch(`auth/${ACTION_AUTH.REFRESH_TOKEN}`, {
            refresh_token: refreshToken,
          })
          .then((result) => {
            isAlreadyFetchingAccessToken = false;
            if (result.success == true) {
              // console.log("onAccessTokenFetched", result.data.access_token);
              onAccessTokenFetched(result.data.access_token);
            } else {
              // remove token and redirect to login
              // console.log("[result] else", result);
              store.commit(`auth/${MUTATION_AUTH.REMOVE_TOKEN}`);

              // console.log("[RENEW_TOKEN 1] /login")
              redirect(`/auth/signin`);
            }
          })
          .catch((err) => {
            // store.commit(`auth/${MUTATION_AUTH.REMOVE_TOKEN}`);
            // console.log("[RENEW_TOKEN 2] /login")
            // redirect(`/auth/signin`);
          });
      }

      // resolve origin request
      const retryOriginalRequest = new Promise((resolve) => {
        addSubscriber((access_token) => {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          resolve($axios(originalRequest));
        });
      });
      return retryOriginalRequest;
    }
  });

  $axios.onRequestError((err) => {
    console.log("[onRequestError]", err);
    // console.log("onRequestError", err);
  });

  $axios.onResponseError((error) => {
    console.log("[onResponseError]", error);
    const code = parseInt(error.response && error.response.status);
    if (code === 401) {
      removeToken();
      redirect("/auth/signin");
    } else if (code == 404) {
      // do something on 404 api
    }
    // console.log("[onResponseError]", error.response);
  });

  $axios.onError((error) => {
    console.log("[onError]", error);
    // const code = parseInt(error.response && error.response.status);
    // if (code === 400) {
    //   redirect("/400");
    // }
  });
}
