import { forEach, get } from "lodash";
import Fingerprint2 from "fingerprintjs2";
import Cookie from "js-cookie";
import * as constants from "~/utils/constants";
import { setDeviceId, setDeviceOs } from "./auth";
import {
  DESKTOP_VIEW,
  TITLE_PAGE_PREFIX,
  TITLE_PAGE_SEPARATOR,
} from "./config";
import * as mutationTypes from "~/utils/mutation-types";

export function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

export function remove_unicode(str) {
  if (!tr) return "";

  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,
    "-"
  );

  str = str.replace(/-+-/g, "-"); //thay thế 2- thành 1-
  str = str.replace(/^\-+|\-+$/g, "");

  return str;
}

export function useEffect(that, watcher, props, init = true) {
  if (init) watcher();
  const iterator = function (prop) {
    that.$watch(prop, {
      handler: watcher,
      deep: true,
    });
  };
  props.forEach(iterator, that);
}

export function redirectWithParams(params = {}) {
  let currentUrlParams = new URLSearchParams(window.location.search);

  forEach(params, function (value, key) {
    currentUrlParams.set(key, value);
  });

  window.history.replaceState(
    {},
    "",
    window.location.pathname + "?" + currentUrlParams.toString()
  );
}

export function getParamQuery(name) {
  let value = "";
  try {
    let currentUrlParams = new URLSearchParams(window.location.search);
    value = currentUrlParams.get(name);
  } catch (erorr) {
    value = "";
  }
  if (!value) {
    value = get(this, `$route.query.${name}`, "");
  }
  return value;
}

export function isValidUrl(str) {
  const pattern = new RegExp(
    /^(?:http(s):\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
    "gm"
  );
  return !!pattern.test(str);
}

export function testJSON(text) {
  if (typeof text !== "string") {
    return false;
  }
  try {
    JSON.parse(text);
    return true;
  } catch (error) {
    return false;
  }
}

export function getDeviceID() {
  let deviceID = "";
  let deviceOs = "";

  Fingerprint2.get((components) => {
    deviceID = Fingerprint2.x64hash128(
      components
        .map((pair) => {
          // console.log("[pair]", pair);
          // get device name by userAgent
          if (pair.key == "userAgent") {
            deviceOs = pair.value;
          }
          if (constants.FINGERPRINT_PROPS.includes(pair.key)) {
            return pair.value;
          }
        })
        .join(),
      31
    );
    console.log("[setDeviceId]", deviceID);
    setDeviceId(deviceID);
    setDeviceOs(deviceOs);
  });

  // set to cookies

  return deviceID;
}

export function stripHtml(html) {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

export const detectBrowser = () => {
  let browserName = "";
  let isOpera =
    (!!window.opr && !!opr.addons) ||
    !!window.opera ||
    navigator.userAgent.indexOf(" OPR/") >= 0;

  // Firefox 1.0+
  let isFirefox = typeof InstallTrigger !== "undefined";

  // Safari 3.0+ "[object HTMLElementConstructor]"
  let isSafari =
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
      return p.toString() === "[object SafariRemoteNotification]";
    })(
      !window["safari"] ||
      (typeof safari !== "undefined" && safari.pushNotification)
    );

  // Internet Explorer 6-11
  let isIE = /*@cc_on!@*/ false || !!document.documentMode;

  // Edge 20+
  let isEdge = !isIE && !!window.StyleMedia;

  // Chrome 1 - 79
  let isChrome =
    !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

  // Edge (based on chromium) detection
  // let isEdgeChromium = isChrome && navigator.userAgent.indexOf("Edg") != -1;

  // Blink engine detection
  // let isBlink = (isChrome || isOpera) && !!window.CSS;
  if (isOpera) {
    return (browserName = "Opera");
  } else if (isFirefox) {
    return (browserName = "Firefox");
  } else if (isSafari) {
    return (browserName = "Safari");
  } else if (isIE) {
    return (browserName = "IE");
  } else if (isEdge) {
    return (browserName = "Edge");
  } else if (isChrome) {
    return (browserName = "Chrome");
  }
  console.log("browserName", browserName);
  return browserName;
};

export const isCommonElementIn2Array = (arr1, arr2) => {
  if (!arr1 || !arr2) return false;
  return !!arr2.filter((e) => arr1.indexOf(e) > -1).length;
};

/**
 *
 * @param {*} val : number (s)
 * return 00:09:03 (hh:mm:ss)
 */
export function getCountdown_HH_MM_SS(val) {
  const h = Math.floor(val / 60 / 60);
  const m = Math.floor((val - 60 * 60 * h) / 60);
  const s = val - 60 * 60 * h - 60 * m;
  let str = "";
  str += h >= 10 ? `${h}:` : `0${h}:`;
  str += m >= 10 ? `${m}:` : `0${m}:`;
  str += s >= 10 ? `${s}` : `0${s}`;
  // console.log("[getCountdown_HH_MM_SS]", str, h, m, s);
  return str;
}

/**
 *
 * @param {*} val : number (s)
 * return 00:09:03 (hh:mm:ss)
 */
export function getCountdown_MM_SS(val) {
  const m = Math.floor(val / 60);
  const s = val - 60 * m;
  let str = "";
  str += m >= 10 ? `${m}:` : `0${m}:`;
  str += s >= 10 ? `${s}` : `0${s}`;
  // console.log("[getCountdown_MM_SS]", str, m, s);
  return str;
}

export const addAllOptionSelect = (arr) => {
  const allOpt = {
    id: null,
    name: "Tất cả",
    type: "",
  };
  return [allOpt, ...arr];
};

export const optionSelectSubject = (arr) => {
  const allOpt = {
    id: null,
    name: "Tất cả",
    type: "",
  };
  return [allOpt, ...arr];
};

export const allOptionSelect = (arr, _typeSelect = "") => {
  const allOpt = {
    id: -1,
    text: `Tất cả ${_typeSelect}`,
    value: null,
  };
  return arr && arr.length ? [allOpt, ...arr] : [];
};

export const limitCharacter = (_val = "", _limit, _numberSlice) => {
  const newString = _val.split(" ");

  if (newString.length > _limit) {
    return newString.slice(0, _numberSlice).join(" ") + "...";
  }
  return _val;
};

/**
 * return: xxxxxx...asas.docx
 * @param {*} _val: string need to limit
 * @param {*} _numberSlice: string with length display
 */
export const limitLetter = (_val = "", _numberSlice = 20) => {
  if (_val.length <= _numberSlice) return _val;
  return `${_val.substring(0, _numberSlice / 2)}...${_val.substring(
    _val.length - _numberSlice / 2 - 3
  )}`;
};

export const removeTagHtml = (_text) => {
  const content = _text.replace(/(<([^>]+)>)/gi, "");
  return content;
};

export const getDesktopView = () => {
  if (process.server) return;
  return window.sessionStorage.getItem(DESKTOP_VIEW);
};

export const getDesktopViewFromCookie = (req) => {
  // return Cookie.get(DESKTOP_VIEW);
  if (!req || !req.headers || !req.headers.cookie) return;
  const view = req.headers.cookie
    .split(";")
    .find((c) => c.trim().startsWith(DESKTOP_VIEW));
  if (!view) return null;
  return view.split("=")[1];
};

export const setDesktopView = (view) => {
  Cookie.set(DESKTOP_VIEW, view);
  if (process.server) return;
  window.sessionStorage.setItem(DESKTOP_VIEW, view);
};

export const initBreadcrumb = (that, data) => {
  that.$store.commit(`common/${mutationTypes.COMMON.SET_BREADCRUMB}`, data);
};

export const initPageTitle = (that, data) => {
  // const notiCount = that.$store.getters["elearning/study/notifications/countSumNoti"] || 0;
  // if(notiCount > 0){
  //   that.$store.commit(`common/${mutationTypes.COMMON.SET_TITLE_PAGE}`, `(${notiCount}) ` + data);
  // }else{
  //   that.$store.commit(`common/${mutationTypes.COMMON.SET_TITLE_PAGE}`, data);
  // }
  that.$store.commit(`common/${mutationTypes.COMMON.SET_TITLE_PAGE}`, data);
};

export const createPageTitle = (content, needPrefix = true) => {
  // if (needPrefix) {
  //   return `${TITLE_PAGE_PREFIX} ${TITLE_PAGE_SEPARATOR} ${content}`;
  // }
  return `${content}`;
};

export const questionBankTypeArr = [
  // 0
  {
    id: "YES_NO",
    name: "Đúng/Sai",
  },
  // 1
  {
    id: "SINGLE_CHOICE",
    name: "Một lựa chọn",
  },
  // 2
  {
    id: "MULTIPLE_CHOICE",
    name: "Nhiều lựa chọn",
  },
  // 3
  {
    id: "FILL_IN_BLANK",
    name: "Điền từ",
  },
  // 4
  {
    id: "WORD_CHOICE",
    name: "Chọn từ",
  },
  // 5
  {
    id: "WORD_MATCH",
    name: "Ghép đáp án",
  },
  // 6
  {
    id: "ESSAY",
    name: "Tự luận",
  },
];

export const questionBankType = {
  YES_NO: "Đúng/Sai",
  SINGLE_CHOICE: "Một lựa chọn",
  MULTIPLE_CHOICE: "Nhiều lựa chọn",
  FILL_IN_BLANK: "Điền từ",
  WORD_CHOICE: "Chọn từ",
  WORD_MATCH: "Ghép đáp án",
  ESSAY: "Tự luận",
};

/**
 * To get feeling text - Ex: :smiley: -> Thú vị
 * @param { String } name - [":smiley:", ...]
 */
export const getEmojiName = (name) => {
  const emojiObj = constants.POST_LABELS.find(item => item.key === name);
  return emojiObj && typeof emojiObj === 'object' ? emojiObj.description : '';
}

/**
 * To get list mention id in post or comment text
 * @param { String | Element }
 */
export const getMentionIds = (html) => {
  const el = document.createElement("div");
  el.innerHTML = html;
  const mentionList = el.querySelectorAll(".mention[data-mention-id]");
  return Array.from(mentionList).map((item) => item.dataset.mentionId);
}

export const converNumberDecs2 = (number) => {
  console.log('number', number)
  const x = number.toString().split('.');
  const x1 = x[0];
  const x2 = x.length > 1 ? x[1].substring(0, 2).includes('0') && x[1].substring(0, 2) % 10 == 0 ? '.' + x[1].substring(0, 2).replace('0', '') : '.' + x[1].substring(0, 2) : '';
  console.log('x1 + x2', x1 + x2)
  return x1 + x2;
}

/* View in fullscreen */
export function openFullscreen(el) {
  // console.log("[openFullscreen]", el);
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.mozRequestFullScreen) {
    /* Firefox */
    el.mozRequestFullScreen();
  } else if (el.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    el.webkitRequestFullscreen();
  } else if (el.msRequestFullscreen) {
    /* IE/Edge */
    el.msRequestFullscreen();
  }
};

/* Close fullscreen */
export function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    document.msExitFullscreen();
  }
};
