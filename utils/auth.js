import Cookie from "js-cookie";
import {
  SCHOOLLY_ACCESS_TOKEN,
  TOKEN_USER_SCHOOLLY,
  UNAUTHORIZE_API,
  DEVICE_ID,
  CLIENT_INFO_API,
  FIREBASE_TOKEN,
  DEVICE_OS,
} from "./config";
import { get } from "lodash";

/**
 * get access_token from local storage
 */
export const getAccessToken = () => {
  if (process.server) return;
  return window.localStorage.getItem(SCHOOLLY_ACCESS_TOKEN);
};

/**
 * get bearer token from local storage
 */
export const getToken = () => {
  if (process.server) return;
  const token = window.localStorage.getItem(TOKEN_USER_SCHOOLLY);
  // console.log("[getToken]", token);
  return token ? JSON.parse(token) : null;
};

/**
 * get device_id from local storage
 */
export const getDeviceId = () => {
  if (process.server) return;
  return window.localStorage.getItem(DEVICE_ID);
};

/**
 * get firebase_token from local storage
 */
export const getFirebaseToken = () => {
  if (process.server) return;
  return window.localStorage.getItem(FIREBASE_TOKEN);
};

/**
 * get device_os from local storage
 */
export const getDeviceOs = () => {
  if (process.server) return;
  return window.localStorage.getItem(DEVICE_OS);
};

/**
 * set bearer token after login success
 */
export const setAccessToken = async (accessToken) => {
  // console.log("[setAccessToken]", accessToken);
  if (!accessToken) return;
  // console.log("[setAccessToken]", accessToken, process.server);
  await Cookie.set(SCHOOLLY_ACCESS_TOKEN, accessToken, {
    expires: parseInt(process.env.SESSION_EXPIRES),
  });
  // console.log("[Cookie.set] setAccessToken", accessToken, Cookie.getJSON(SCHOOLLY_ACCESS_TOKEN));
  if (process.server) return;
  // console.log("[setAccessToken] localStorage", accessToken);
  window.localStorage.setItem(SCHOOLLY_ACCESS_TOKEN, accessToken);
  // console.log("[window.localStorage] setAccessToken", accessToken);
};

export const setToken = async (_token) => {
  // console.log("[setToken]", _token, process.server);
  if (!_token) return;
  // console.log("[setToken] Cookie", _token, Cookie);
  await Cookie.set(TOKEN_USER_SCHOOLLY, _token, {
    expires: parseInt(process.env.SESSION_EXPIRES),
  });
  // console.log("[Cookie.set] setToken", _token, Cookie.getJSON(TOKEN_USER_SCHOOLLY));
  if (process.server) return;
  // console.log("[setToken] localStorage", _token);
  window.localStorage.setItem(TOKEN_USER_SCHOOLLY, JSON.stringify(_token));
  // console.log("[window.localStorage] setToken", _token);
};

export const setDeviceId = async (_deviceId) => {
  console.log("[auth][setDeviceId]", _deviceId);
  if (!_deviceId) return;
  await Cookie.set(DEVICE_ID, _deviceId);
  if (process.server) return;
  window.localStorage.setItem(DEVICE_ID, _deviceId);
};

export const setDeviceOs = async (_deviceOs) => {
  console.log("[auth][setDeviceOs]", _deviceOs);
  if (!_deviceOs) return;
  await Cookie.set(DEVICE_OS, _deviceOs);
  if (process.server) return;
  window.localStorage.setItem(DEVICE_OS, _deviceOs);
};

export const setFirebaseToken = (_fbToken) => {
  console.log("[auth][setFirebaseToken]", _fbToken);
  if (!_fbToken) return;
  window.localStorage.setItem(FIREBASE_TOKEN, _fbToken);
};

export const removeToken = () => {
  console.log("[removeToken]")
  Cookie.remove(SCHOOLLY_ACCESS_TOKEN);
  Cookie.remove(TOKEN_USER_SCHOOLLY);
  Cookie.remove(DEVICE_ID);
  Cookie.remove(DEVICE_OS);
  Cookie.remove(FIREBASE_TOKEN);
  if (process.server) return;
  window.localStorage.removeItem(SCHOOLLY_ACCESS_TOKEN);
  window.localStorage.removeItem(TOKEN_USER_SCHOOLLY);
  window.localStorage.removeItem(DEVICE_ID);
  window.localStorage.removeItem(DEVICE_OS);
  window.localStorage.removeItem(FIREBASE_TOKEN);
};

export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Get raw jwt token from cookie
 */
export const getTokenFromCookie = (req) => {
  if (!req || !req.headers || !req.headers.cookie) return;
  const jwtCookie = req.headers.cookie
    .split(";")
    .find((c) => c.trim().startsWith(TOKEN_USER_SCHOOLLY));
  if (!jwtCookie) return null;
  const userCookie = decodeURIComponent(jwtCookie.split("=")[1]);
  // console.log("[getTokenFromCookie] userCookie", userCookie)
  return typeof userCookie === "string" ? JSON.parse(userCookie) : userCookie;
};

/**
 * get access_token from cookie
 */
export const getAccessTokenFromCookie = (req) => {
  if (!req || !req.headers || !req.headers.cookie) return;
  const jwtCookie = req.headers.cookie
    .split(";")
    .find((c) => c.trim().startsWith(SCHOOLLY_ACCESS_TOKEN));
  if (!jwtCookie) return null;
  const userCookie = jwtCookie.split("=")[1];
  // console.log("[getAccessTokenFromCookie] userCookie", userCookie);
  return userCookie;
};

/**
 * get device_id from cookie
 */
export const getDeviceIdFromCookie = (req) => {
  if (!req || !req.headers || !req.headers.cookie) return;
  const jwtCookie = req.headers.cookie
    .split(";")
    .find((c) => c.trim().startsWith(DEVICE_ID));
  if (!jwtCookie) return null;
  const userCookie = jwtCookie.split("=")[1];
  return userCookie;
};

export const checkRequestAuthorize = (config) => {
  const _url = config.url;
  const urls = _url.split("?");
  // // console.log("urls", urls);

  // if url contain token=true => return true;
  if (get(config, "params.token", "") == "true") return true;

  // public api url
  if (_url.includes("/public")) return false;

  // public api
  if (UNAUTHORIZE_API.includes(urls[0])) {
    return false;
  }

  return true;
};

export const checkRequestClientInfo = (_url) => {
  const urls = _url.split("?");
  let check = false;

  CLIENT_INFO_API.map((item) => {
    if (urls[0].includes(item)) {
      check = true;
    }
  });

  return check;
};
