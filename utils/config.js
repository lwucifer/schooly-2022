import { CART_LIST, PAYMENT_HASHKEY } from "./endpoints";
const moment = require('moment');
export const DEFAULT_HEADER_SEARCH_SELECT = "product";
export const TOKEN_KEY = "token_key";
export const TOKEN_USER_SCHOOLLY = "token_user_schoolly";
export const SCHOOLLY_ACCESS_TOKEN = "schoolly_access_token";
export const DEVICE_ID = "Device-Id";
export const DEVICE_OS = "Device-Os";
export const CLIENT_INFO = "client-info";
export const FIREBASE_TOKEN = "firebase_token";

export const RESPONSE_SUCCESS = true;

export const FETCH_SIZE = 50;
export const SOCIAL = "SOCIAL";
export const ELEARNING = "ELEARNING";

export const DATE_BIRTHDAY = "DD/MM/YYYY";
export const DATE_YYYY_MM_DD = "YYYY/MM/DD";
export const DATE_FORMAT = "YYYY-MM-DD";
export const DATETIME_DISPLAY = "HH:mm DD/MM/YYYY";
export const DATETIME_HH_MM = "HH:mm";
export const DATETIME_HH_MM_A = "h:mm A";
export const DATETIME_HH_MM_a = "h:mm a";
export const DATETIME_RECEIVE = "YYYY-MM-DD HH:mm:ss";
export const DATETIME_FULL_TEXT = "LLLL";
export const DATETIME_FULL_DATE_TEXT = "HH:mm dddd, DD [tháng] MM [năm] YYYY";
export const DATETIME_FULL_WEEK_DAY = "dddd, DD/MM/YYYY, HH:mm";
export const DATETIME_HH_MM_DD_MM_YY = "HH:mm DD/MM/YYYY";
export const DATETIME_HH_MM_DD_MM_YY_DASH = "HH:mm - DD/MM/YYYY";
export const DATETIME_HH_MM_A_DD_MM_YY = "hh:mm A DD/MM/YYYY";
export const DATETIME_hh_mm = "hh:mm";
export const DATETIME_HH_mm = "HH:mm";
export const DATE_SHORTCUT = [
  {
    text: 'Hôm nay',
    onClick() {
      const start = new Date();
      const end = new Date();
      return [start, end]
    },
  },
  {
    text: 'Hôm qua',
    onClick() {
      const end = moment().subtract(1, 'day').toDate();
      const start = moment().subtract(1, 'day').toDate();
      //start.setTime(start.getTime() - 3600 * 1000 * 24);
      return [start, end]
    },
  },
  {
    text: 'Tuần này',
    onClick() {
      const end = moment().endOf("week").toDate();
      const start = moment().startOf("week").toDate();
      //start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: 'Tháng này',
    onClick() {
      const end = moment().endOf('month').toDate();
      const start = moment().startOf('month').toDate();
      return [start, end];
    },
  },
  {
    text: 'Tháng trước',
    onClick() {
      const end = moment().subtract(1, 'months').endOf('month').toDate();
      const start = moment().subtract(1, 'months').startOf('month').toDate();
      //start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: 'Tùy chọn',
    onClick() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  }
];

export const UNAUTHORIZE_API = ["user/public/renew", "user/public/login"];
export const CLIENT_INFO_API = [CART_LIST, PAYMENT_HASHKEY];

export const MAX_UPLOADED_REPOSITORY_FILE_SIZE = 4096; // MB
export const CURRENCY = 'đ';

export const TIMEOUT = {
  NOTIFY: 3000,
}


export const PARAM_CHECK = {
  SCHOOL: "/school",
  SCHOOL_SEARCH: "/school/search",
  SOCIAL: "/social",
  SOCIAL_SEARCH: "/social/search",
  ELEARNING_SEARCH: "/elearning/search",
}

export const DESKTOP_VIEW = "schoolly_desktop_view";

/**
 * Page title
 */
export const TITLE_PAGE_PREFIX = "Schoolly"
export const TITLE_PAGE_SEPARATOR = "-"
export const TITLE_PAGE_DEFAULT = "Schoolly - Hệ thống giáo dục và đào tạo trực tuyến toàn diện"

export const EXAM_CONFIG = {
  TIME_TO_START_OPEN_QUESTION: 1 * 24 * 3600 * 1000,
  TIME_TO_START_CLOSE_QUESTION: 1 * 24 * 3600 * 1000,
}

/**
 * Question of exercise/exam
 */

 export const CHOICE_QUESTION_SIZE_MAX = 5; // Max number of options into a question that has multi options
 export const CHOICE_QUESTION_SIZE_MIN = 2; // Min number of options into a question that has multi options
 export const MATCH_WORD_QUESTION_SIZE_MAX = 7; // Max number of options into a question that its type is 'WORD_MATCH'
 export const MATCH_WORD_QUESTION_SIZE_MIN = 2; // Min number of options into a question that its type is 'WORD_MATCH'

 export const QUESTION_ANSWER_INDEX_TEXT = [
   "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"
 ]