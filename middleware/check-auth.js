import {
  getAccessTokenFromCookie,
  getAccessToken,
  getTokenFromCookie,
  getToken
} from "../utils/auth";
import { AUTH } from "../utils/mutation-types";

export default async function({ store, req, redirect, route }) {
  // If nuxt generate, pass this middleware
  // if (process.server && !req) return
//   console.log(
//     "[check-auth] 1",
//     process.server,
//     getTokenFromCookie(req),
//     getToken()
//   );
  const loggedToken = process.server ? getTokenFromCookie(req) : getToken();
  const loggedAccessToken = process.server
    ? getAccessTokenFromCookie(req)
    : getAccessToken();

//   console.log("[check-auth] 2", loggedToken, loggedAccessToken, req);
  if (loggedToken) {
    store.commit(`auth/${AUTH.SET_TOKEN}`, loggedToken);
  } else {
    // logout/invalid token case
    store.commit(`auth/${AUTH.REMOVE_TOKEN}`);
  }
  if (loggedAccessToken) {
    store.commit(`auth/${AUTH.SET_ACCESS_TOKEN}`, loggedAccessToken);
  }
}
