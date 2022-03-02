import Vue from "vue";
import {
    DATETIME_HH_MM_a,
    DATETIME_FULL_TEXT,
    DATETIME_HH_MM_DD_MM_YY,
    DATETIME_RECEIVE,
    DATE_BIRTHDAY,
    DATE_FORMAT,
    DATE_YYYY_MM_DD,
    DATETIME_HH_MM,
    DATETIME_HH_MM_A,
    DATETIME_HH_MM_A_DD_MM_YY,
    DATETIME_HH_MM_DD_MM_YY_DASH,
    DATETIME_hh_mm,
    DATETIME_FULL_DATE_TEXT,
    DATETIME_FULL_WEEK_DAY,
    DATETIME_HH_mm,
} from "../utils/config";
const moment = require("moment");
const momenttimezone = require("moment-timezone");

export const fullUTCDateTimeSlash = (_utcDate) => {
    if (!_utcDate) return;
    const ts = moment.utc(_utcDate);
    return ts.format(DATETIME_RECEIVE);
};

export const getLocalOffsetHours = () => {
    const offsetMinutes = moment().utcOffset(); // (-240, -120, -60, 0, 60, 120, 240, etc.)
    return parseInt(Math.floor(offsetMinutes / 60)) || 7;
};

export const getDateBirthDay = (_utcDate) => {
    if (!_utcDate) return;
    // const ts = moment.utc(_utcDate);
    const ts = getLocalDateTime(_utcDate);
    return ts.format(DATE_BIRTHDAY);
};

export const getDateBirthDayUTC = (_utcDate) => {
    if (!_utcDate) return;
    const ts = moment.utc(_utcDate);
    //const ts = getLocalDateTime(_utcDate);
    return ts.format(DATE_BIRTHDAY);
};

export const getDateUpdateProfile = (_utcDate) => {
    if (!_utcDate) return;
    // const ts = moment.utc(_utcDate);
    const ts = getLocalDateTime(_utcDate);
    return ts.format(DATE_YYYY_MM_DD);
};

export const getDateFormat = (_utcDate) => {
    if (!_utcDate) return;
    // const ts = moment.utc(_utcDate);
    const ts = getLocalDateTime(_utcDate);
    return ts.format(DATE_FORMAT);
};

export const isBeforeNow = (_utcDate) => {
    console.log("[isBeforeNow]", _utcDate);
    if (!_utcDate) return false;
    const ts = getLocalDateTime(_utcDate);
    return ts.isBefore(new Date());
};

export const fullDateTimeSlash = (_utcDate) => {
    if (!_utcDate) return "--:--";
    // const ts = moment.utc(_utcDate);
    const ts = getLocalDateTime(_utcDate);
    return ts.format(DATETIME_RECEIVE);
};

export const getDateTimeFullText = (_utcDate) => {
    if (!_utcDate) return;
    // const ts = moment.utc(_utcDate);
    const ts = getLocalDateTime(_utcDate);
    return ts.format(DATETIME_FULL_DATE_TEXT);
};

export const getDateTimeHH_MM_D_M_Y = (_utcDate) => {
    if (!_utcDate) return;
    // const ts = moment.utc(_utcDate);
    const ts = getLocalDateTime(_utcDate);
    return ts.format(DATETIME_HH_MM_DD_MM_YY);
};

export const getDateTimeHH_MM_D_M_Y_DASH = (_utcDate) => {
    if (!_utcDate) return;
    // const ts = moment.utc(_utcDate);
    const ts = getLocalDateTime(_utcDate);
    return ts.format(DATETIME_HH_MM_DD_MM_YY_DASH);
};

export const getDateTimeHH_MM_D_M_Y_DASH_UTC = (_utcDate) => {
    if (!_utcDate) return;
    // const ts = moment.utc(_utcDate);
    const ts = moment.utc(_utcDate);
    return ts.format(DATETIME_HH_MM_DD_MM_YY_DASH);
};

export const getLocalDateTime = (_utcDate) => {
    if (!_utcDate) return new momenttimezone(_utcDate);
    const tz = momenttimezone.tz.guess();
    return momenttimezone.utc(_utcDate).tz(tz);
};

export const getUTCDateTime = (_localDate) => {
    if (!_localDate) return new momenttimezone(_localDate);
    const tz = momenttimezone.tz.guess();
    return momenttimezone.tz(_localDate, DATETIME_RECEIVE, tz).utc();
};

export const getUTCDateTimeReceive = (_localDate) => {
    if (!_localDate) return;
    // const ts = moment.utc(_utcDate);
    const ts = getUTCDateTime(_localDate);
    return ts.format(DATETIME_RECEIVE);
};

export const getUTCDateTimeHH_MM_A = (_localDate) => {
    if (!_localDate) return;
    // const ts = moment.utc(_utcDate);
    const ts = getUTCDateTime(_localDate);
    return ts.lang("en").format(DATETIME_HH_MM_A);
};

export const getDateHH_MM_A = (_date) => {
    if (!_date) return;
    return _date.lang("en").format(DATETIME_HH_MM_A);
};

export const getTimeHH_MM_A = (_time) => {
    if (!_time) return;
    const splits = _time.split(" ");
    const hour = splits[0].split(":")[0];
    const minute = splits[0].split(":")[1];
    const hh24 = splits[1] == "pm" ? parseInt(hour) + 12 : hour;
    // let ts = new momenttimezone(new Date('2000-01-01 ' + _time));
    let ts = new momenttimezone(
        `2000-01-01 ${hh24}:${minute}`,
        `YYYY-MM-DD hh:mm A`
    );
    return ts.lang("en").format(DATETIME_HH_MM_A);
};

export const getLocalTimeHH_MM_a = (_time) => {
    if (!_time) return;
    const splits = _time.split(" ");
    const hour = splits[0].split(":")[0];
    const minute = splits[0].split(":")[1];
    const hh24 = splits[1] == "pm" ? parseInt(hour) + 12 : hour;
    // let ts = new momenttimezone(new Date('2000-01-01 ' + _time));
    let ts = getLocalDateTime(
        `2000-01-01 ${hh24}:${minute}`,
        `YYYY-MM-DD hh:mm a`
    );
    return ts.lang("en").format(DATETIME_HH_MM_a);
};

export const getLocalTimeHH_MM_A = (_utcDate) => {
    if (!_utcDate) return;
    let ts = getLocalDateTime(_utcDate);
    return ts.lang("en").format(DATETIME_HH_MM_A);
};

export const getLocalTimeHH_MM = (_utcDate) => {
    if (!_utcDate) return;
    let ts = getLocalDateTime(_utcDate);
    return ts.lang("en").format(DATETIME_HH_MM);
};

export const getLocalEndTime = (_startDate, _duration, type) => {
    if (!_startDate) return;
    let date = getLocalDateTime(_startDate);
    if (_duration) {
        date = date.add(_duration, type);
    }
    return date.lang("en").format(DATETIME_HH_MM_A);
};

export const getEndTime = (_startTime, _duration) => {
    if (!_startTime) return;
    // let date = getLocalDateTime(new Date('2000-01-01 ' + _startTime));
    const splits = _startTime.split(" ");
    const hour = splits[0].split(":")[0];
    const minute = splits[0].split(":")[1];
    const hh24 = splits[1] == "pm" ? parseInt(hour) + 12 : hour;
    let date = new momenttimezone(
        `2000-01-01 ${hh24}:${minute}`,
        `YYYY-MM-DD hh:mm A`
    );
    if (_duration) {
        date = date.add(momenttimezone.duration(_duration).asMinutes(), "minutes");
    }

    return date.lang("en").format(DATETIME_HH_MM_A);
};

export const getEndTime2 = (_startTime, _duration) => {
    if (!_startTime) return;
    // let date = getLocalDateTime(new Date('2000-01-01 ' + _startTime));
    const splits = _startTime.split(" ");
    const hour = splits[0].split(":")[0];
    const minute = splits[0].split(":")[1];
    const hh24 = splits[1] == "pm" ? parseInt(hour) + 12 : hour;
    let date = new momenttimezone(
        `2000-01-01 ${hh24}:${minute}`,
        `YYYY-MM-DD hh:mm A`
    );
    if (_duration) {
        date = date.add(_duration, "minutes");
    }

    return date.lang("en").format(DATETIME_HH_MM_A);
};

export const hoursToMinutes = (_time) => {
    if (!_time) return;
    return momenttimezone.duration(_time).asMinutes();
};

export const minutesToHours = (_time) => {
    if (!_time) return;
    let hour = Math.floor(parseFloat(_time) / 60);
    if (hour < 10) hour = "0" + hour;
    let minute = parseFloat(_time) % 60;
    if (minute < 10) minute = "0" + minute;
    return hour + ":" + minute;
};

/**
 *
 * @param {hh:mm} _time
 * return hh + GMT
 */
export const convertLocalTimeForTimetable = (_time) => {
    if (!_time) return "";
    const splits = _time.split(":");
    const hh = parseInt(splits[0]);
    const mm = splits[1];
    const gmt = getLocalOffsetHours();
    // const localhh = (hh + gmt) >= 24 ? 0 : (hh + gmt);
    // console.log("[convertLocalTimeForTimetable] _time", hh, gmt, mm, _time);
    return `${hh + gmt}:${mm}`;
};

export const addDurationToUTCDate = (_utcDate, _duration, _type) => {
    const ts = moment.utc(_utcDate);
    return ts.add(_duration, _type).format(DATETIME_RECEIVE);
};

export const getDateTimeHH_MM_A_DD_MM_YY = (_utcDate, locale = "vi") => {
    if (!_utcDate) return;
    // const ts = moment.utc(_utcDate);
    const ts = getLocalDateTime(_utcDate);
    return ts.locale(locale).format(DATETIME_HH_MM_A_DD_MM_YY);
};

export const getDateTime_hh_mm = (_utcDate) => {
    if (!_utcDate) return;
    // const ts = moment.utc(_utcDate);
    const ts = getLocalDateTime(_utcDate);
    return ts.format(DATETIME_hh_mm);
};

export const getDateTimeFrom = (_utcDate) => {
    if (!_utcDate) return;
    // const ts = moment.utc(_utcDate);
    const ts = getLocalDateTime(_utcDate);
    return ts.format(DATE_FORMAT) + " 00:00:00";
};

export const getDateTimeTo = (_utcDate) => {
    if (!_utcDate) return;
    // const ts = moment.utc(_utcDate);
    const ts = getLocalDateTime(_utcDate);
    return ts.format(DATE_FORMAT) + " 23:59:59";
};

export const getDateTime_HH_mm = (_utcDate) => {
    if (!_utcDate) return;
    // const ts = moment.utc(_utcDate);
    const ts = getLocalDateTime(_utcDate);
    return ts.format(DATETIME_HH_mm);
};

// return current day in week: sun mon ... fri sat
export const getTodayDDD = () => {
    return moment()
        .locale("en")
        .format("ddd")
        .toLowerCase();
};

export const isTodayInRangeDate = (_fromDate, _toDate) => {
    // console.log("[isTodayInRangeDate]", _fromDate, _toDate)
    if (!_fromDate || !_toDate) return false;
    const fDate = moment(_fromDate).format(DATE_YYYY_MM_DD);
    const tDate = moment(_toDate).format(DATE_YYYY_MM_DD);
    return moment().isBetween(fDate, tDate);
};

export const getDateTimeFullWeekDay = (_utcDate) => {
    if (!_utcDate) return;
    // const ts = moment.utc(_utcDate);
    const ts = getLocalDateTime(_utcDate);
    return ts.format(DATETIME_FULL_WEEK_DAY);
};

export const getDateHH_MM_SS = (_date) => {
    if (!_date) return;
    let date = new momenttimezone(_date + `00:00:01`, `DD/MM/YYYY hh:mm:ss`);

    return date.lang("en").format(`YYYY-MM-DD hh:mm:ss`);
};

/**
 * convert minute to text: hh giờ mm phút ss giây
 */
export function formatCountdown(distance = 0) {
    if (!distance) return "00-00-00";
    const h = Math.floor(distance % (60 * 24) / 60);
    const m = Math.floor(distance % 60);
    const s = Math.floor(distance * 60 - h * 60 * 60 - m * 60);
  
    const hh = h < 10 ? `0${h}` : h;
    const mm = m < 10 ? `0${m}` : m;
    const ss = s < 10 ? `0${s}` : s;
  
    let strTime = `${hh}-${mm}-${ss}`;
    // console.log("[strTime]", strTime);
    return strTime;
  }
  
  

Vue.filter("getDateBirthDay", function(_utcDate) {
    return getDateBirthDay(_utcDate);
});

Vue.filter("getDateTimeHH_MM_D_M_Y", function(_utcDate) {
    return getDateTimeHH_MM_D_M_Y(_utcDate);
});

Vue.filter("getDateTimeHH_MM_D_M_Y_DASH", function(_utcDate) {
    return getDateTimeHH_MM_D_M_Y_DASH(_utcDate);
});

Vue.filter("getDateTimeHH_MM_D_M_Y_DASH_UTC", function(_utcDate) {
    return getDateTimeHH_MM_D_M_Y_DASH_UTC(_utcDate);
});

Vue.filter("fullDateTimeSlash", function(_utcDate) {
    return fullDateTimeSlash(_utcDate);
});

Vue.filter("getDateTimeHH_MM_A_DD_MM_YY", function(_utcDate, locale = "vi") {
    return getDateTimeHH_MM_A_DD_MM_YY(_utcDate, locale);
});

Vue.filter("getDateTime_hh_mm", function(_utcDate) {
    return getDateTime_hh_mm(_utcDate);
});

Vue.filter("getDateTimeFromTo", function(_utcDate) {
    return getDateTimeFromTo(_utcDate);
});
Vue.filter("getLocalTimeHH_MM", function(_utcDate) {
    return getLocalTimeHH_MM(_utcDate);
});
Vue.filter("getLocalDateTime", function(_utcDate) {
    return getLocalDateTime(_utcDate);
});
Vue.filter("getDateTimeFullWeekDay", function(_utcDate) {
    return getDateTimeFullWeekDay(_utcDate);
});

Vue.filter("getDateTime_HH_mm", function(_utcDate) {
    return getDateTime_HH_mm(_utcDate);
});