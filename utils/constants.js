export const POST_TYPES = {
    TEXT: "TEXT",
    MEDIA: "MEDIA",
    SHARE: "SHARE",
    LINK: "LINK",
};

export const APP_INPUT_VALIDATE_STATUS = {
    DEFAULT: 0,
    SUCCESS: 1,
    ERROR: 2,
    WARNING: 3,
};

export const SOCIAL_LINK_SCHEMA = {
    type: "",
    url: "",
    image: "",
    title: "",
    description: "",
    updatedTime: "",
    imageWidth: "",
    imageHeight: "",
    videoUrl: "",
    videoSecureUrl: "",
    videoType: "",
    videoWidth: "",
    videoHeight: "",
    videoTag: "",
    siteName: "",
};

export const LEVEL_QUESTIONS = [{
        name: "Dễ",
        id: "EASY",
    },
    {
        name: "Trung bình",
        id: "MEDIUM",
    },
    {
        name: "Khó",
        id: "HARD",
    },
];

export const POST_PRIVACY = {
    PUBLIC: "PUBLIC",
    FRIENDS: "FRIENDS",
    ONLY_ME: "ONLY_ME",
};

export const POST_PRIVACY_TEXT = {
    PUBLIC: "Công khai",
    FRIENDS: "Bạn bè",
    ONLY_ME: "Chỉ mình tôi",
};

export const POST_LABELS = [{
        key: ":blush:",
        description: "Hài lòng",
    },
    {
        key: ":smiley:",
        description: "Thú vị",
    },
    {
        key: ":heart_eyes:",
        description: "Hào hứng",
    },
    {
        key: ":sweat_smile:",
        description: "Bối rối",
    },
    {
        key: ":disappointed_relieved:",
        description: "Buồn",
    },
    {
        key: ":sob:",
        description: "Muốn khóc",
    },
    {
        key: ":rage:",
        description: "Giận dữ",
    },
    {
        key: ":open_mouth:",
        description: "Ngạc nhiên",
    },
    {
        key: ":kissing_heart:",
        description: "Đáng yêu",
    },
    {
        key: ":sleeping:",
        description: "Buồn ngủ",
    },
    {
        key: ":heart:",
        description: "Hạnh phúc",
    },
    {
        key: ":sunglasses:",
        description: "Ngầu",
    },
];

export const MEDIA_TARGET_TYPES = {
    POST: "post",
    USER: "user",
    COMMENT: "comment",
    ROOM: "room",
};

export const MEDIA_TARGET_SUB_TYPES = {
    COVER: "cover",
    AVATAR: "avatar",
};

export const ATTACHMENT_TYPES = {
    IMAGE: "IMAGE",
    VIDEO: "VIDEO",
    AUDIO: "AUDIO",
};

export const ELEARNING_TYPES = {
    COURSE: "COURSE",
    LECTURE: "LECTURE",
};

export const ELEARNING_TYPES_VALUE = {
    COURSE: "course",
    LECTURE: "lecture",
};

export const ELEARNING_TYPES_TEXT = {
    lecture: "bài giảng",
    course: "khoá học",
};

export const ELEARNING_STATUSES = {
    PASSED: "PASSED",
    FAILED: "FAILED",
    PENDING: "PENDING",
};

export const CHAT = {
    JOIN_ROOM: "join_room",
    MESSAGE: "message",
    LEAVE_ROOM: "leave_room",
    STATUS_HANDLE: "status_handle",
    USER_TYPING: "user_typing",
    READ_MESSAGE: "read_message",
    PUBLIC_GROUP: "PUBLIC_GROUP",
    PRIVATE_GROUP: "PRIVATE",
    CLOSE_GROUP: "CLOSE_GROUP",
    FETCH_PRIVATE_ROOM_BY_FRIEND_ID: "fetch_private_room_by_friend_id",
};

export const SHARE_OPTS = {
    TIMELINE: 0,
    FRIEND: 1,
    MESSAGE: 2,
};

export const EXERCISE_TYPES = {
    CHOICE: "CHOICE",
    ESSAY: "ESSAY",
    MIX: "MIX",
};

export const EXAM_TYPES = {
    CHOICE: "CHOICE",
    ESSAY: "ESSAY",
    MIX: "MIX",
};

export const EXAM_LEVEL = {
    EASY: "EASY",
    MEDIUM: "MEDIUM",
    HARD: "HARD",
    BY_FILE: "BY_FILE",
};

export const EXAM_TYPE_QUESTION = {
    ESSAY: "ESSAY",
    SINGLE_CHOICE: "SINGLE_CHOICE",
    MULTIPLE_CHOICE: "MULTIPLE_CHOICE",
    WORD_CHOICE: "WORD_CHOICE",
    WORD_MATCH: "WORD_MATCH",
    YES_NO: "YES_NO",
    FILL_IN_BLANK: "FILL_IN_BLANK",
    BY_FILE: "BY_FILE",
};

export const EXERCISE_CATEGORIES = {
    EXERCISE: "EXERCISE",
    TEST: "TEST",
};

export const STUDY_MODE = {
    DEFAULT: "",
    VIDEO_PLAYING: "VIDEO_PLAYING",
    DOCS: "DOCS",
    ARTICLE: "ARTICLE",
    IMAGE: "IMAGE",
    DO_EXERCISE: "DO_EXERCISE",
    DO_EXERCISE_BEFORE_BEGIN: "DO_EXERCISE_BEFORE_BEGIN",
    DO_EXERCISE_DOING: "DO_EXERCISE_DOING",
    REVIEW_EXERCISE_RESULT: "REVIEW_EXERCISE_RESULT",
    SUBMISSION_SUCCESS: "SUBMISSION_EXERCISE_SUCCESS",
    SCORM: "SCORM",
    AUDIO_PLAYING: "AUDIO_PLAYING",
};

export const DO_EXERCISE_STATUS = {
    DEFAULT: null,
    SUBMISSION_DONE: "SUBMISSION_DONE",
};

export const EXERCISE_STATUS = {
    NONE: "NONE",
    PENDING: "PENDING",
    FAILED: "FAILED",
    PASSED: "PASSED",
};

export const LESSION_STATUS = {
    NOT_COMPLETE: 0,
    COMPLETED: 1,
};

export const LESSION_ONLINE_STATUS = {
    // COMING: 2,
    LIVE: 1,
    FINISH: 0,
};

export const QUESTION_NAV = {
    NEXT: 1,
    BACK: -1,
};

export const SUBMISSION_RESULTS = {
    PASSED: "PASSED",
    FAILED: "FAILED",
    PENDING: "PENDING",
    NONE: "NONE",
};

export const SCALE_MARK = 10;

export const FINGERPRINT_PROPS = [
    "userAgent",
    "brandModel",
    "language",
    "platform",
    "deviceId",
    "deviceMemory",
    "hardwareConcurrency",
    "sessionStorage",
    "localStorage",
    "indexedDb",
    "openDatabase",
];
export const DEVICE_TYPE = {
    WEB: "WEB",
    MOBILE_APP: "MOBILE_APP",
    DESKTOP_APP: "DESKTOP_APP",
};
export const UPDATE_NOTI = {
    ALL: "All",
    ONLY_ONE: "ONLY_ONE",
};

export const USER_ROLES = {
    ROLE_USER: "ROLE_USER",
    ROLE_STUDENT: "ROLE_STUDENT",
    ROLE_TEACHER: "ROLE_TEACHER",
    ROLE_PARENT: "ROLE_PARENT",
    ROLE_SYSTEM_ADMIN: "ROLE_SYSTEM-ADMIN",
    ACCEPT_REQUEST_JOIN_TO_ELEARNING: "ROLE_ORG-ADMIN",
};

export const NOTI_TYPE = {
    // Elearning
    EVALUATE_EXERCISE: "EVALUATE_EXERCISE",
    EVALUATE_TEST: "EVALUATE_TEST",
    SUBMIT_EXERCISE: "SUBMIT_EXERCISE",
    SUBMIT_TEST: "SUBMIT_TEST",
    SEND_REQUEST_JOIN_TO_ELEARNING: "SEND_REQUEST_JOIN_TO_ELEARNING",
    ACCEPT_REQUEST_JOIN_TO_ELEARNING: "ACCEPT_REQUEST_JOIN_TO_ELEARNING",
    INVITE_JOIN_TO_ELEARNING: "INVITE_JOIN_TO_ELEARNING",
    DELETE_ONLINE_CLASS: "DELETE_ONLINE_CLASS",
    DELETE_ONLINE_LESSON: "DELETE_ONLINE_LESSON",
    CREATE_NEW_ONLINE_CLASS: "CREATE_NEW_ONLINE_CLASS",
    ADD_NEW_INTERACTIVE_ANNOUNCEMENT: "ADD_NEW_INTERACTIVE_ANNOUNCEMENT",
    SEND_FEEDBACK_TO_ANSWER_OF_TEACHER: "SEND_FEEDBACK_TO_ANSWER_OF_TEACHER",
    SEND_QUESTION_TO_TEACHER: "SEND_QUESTION_TO_TEACHER",
    SEND_FEEDBACK_TO_QUESTION: "SEND_FEEDBACK_TO_QUESTION",
    SEND_FEEDBACK_TO_QUESTION_HAD_ONE_ANSWER: "SEND_FEEDBACK_TO_QUESTION_HAD_ONE_ANSWER",
    SEND_FEEDBACK_TO_QUESTION_HAD_MANY_ANSWERS: "SEND_FEEDBACK_TO_QUESTION_HAD_MANY_ANSWERS",
    SEND_CODE_LINK_ACCOUNT: "SEND_CODE_LINK_ACCOUNT",
    // Social
    CREATED_COMMENT_OF_POST: "CREATED_COMMENT_OF_POST",
    CREATED_COMMENT_OF_COMMENT: "CREATED_COMMENT_OF_COMMENT",
    FRIEND_ACCEPTED: "FRIEND_ACCEPTED",
    SEND_FRIEND_REQUEST: "SEND_FRIEND_REQUEST",
};

export const ELEARNING_SIDE_MENU = {};

export const ACCOUNT_PROFILE_MENU = {
    ELEARNING: 1,
    STUDENT: 2,
    ACCOUNT_INFO: 3,
    REVENUE: 1,
    TRANSACTION: 4,
    NOTIFICATION: 5,
    SETTINGS: 6,
    SUPPORT: 7,
    SIGNOUT: 8,
    ONLINE_CLASS: 9
};

export const WITHDRAWAL_STATUSES = {
    SUCCESS: "SUCCESS",
    FAILED: "FAIL",
    PENDING: "PENDING",
};

export const TRANSACTION_STATUSES = {
    SUCCESS: "1",
    FAILED: "-1",
    PENDING: "0",
    CANCEL: "2",
    CANCEL_SUCCESS: "-2",
};

export const PAGE_SIZE = {
    SHORT_5: 5,
    DEFAULT: 10,
    ELEARNING_12: 12,
    SCHOOL_16: 16,
    MAXIMIZE: 9999,
};

export const SOCIAL_DEFAULT_FETCH_SIZE = 30;
export const SOCIAL_DEFAULT_PHOTO_FETCH_SIZE = 50;

export const SUBJECT_CODE = {
    MUSIC: "AM",
    TECHNOLOGY: "CN",
    MORAL: "DD",
    GEOGPRAPHY: "DL",
    CIVIC_EDUCATION: "GDCD",
    CHEMISTRY: "HH",
    SCIENCE: "KH",
    HISTORY: "LS",
    FINE_ART: "MT",
    FOREIGN_LANGUAGE: "NN",
    LITERATURE: "NV",
    BIOLOGY: "SH",
    PHYSICAL_EDUCATION: "TD",
    VIETNAMESES: "TV",
    INFORMATICS: "TH",
    MATHS: "Toan",
    NATURAL_SOCIAL: "TNXH",
    PHYSICS: "VL",
};

export const DAY_SECTION = {
    MORNING: 1,
    AFTERNOON: 2,
    EVENING: 3,
};

export const LESSION_TYPE = {
    VIDEO: "VIDEO",
    DOCS: "DOCS",
    ARTICLE: "ARTICLE",
    PDF: "PDF",
    TXT: "TXT",
    IMAGE: "IMAGE",
    SCORM: "SCORM",
    AUDIO: "AUDIO",
};

export const SORT_ELEARNING = {
    RELATED: "RELATED",
    RATE: "RATE",
    COMMENT: "COMMENT",
    NEWEST: "NEWEST",
    PRICE_ASC: "PRICE_ASC",
    PRICE_DESC: "PRICE_DESC",
};

export const BANK_STATUS = {
    DISABLE: "DISABLE",
    PENDING: "PENDING",
    ACTIVE: "ACTIVE",
};

export const BANK_EXAM_TYPE = {
    CHOICE: "CHOICE",
    ESSAY: "ESSAY",
    MIX: "MIX",
};

export const TYPE_TIME_TABLE = {
    OLCLASS: "OLCLASS",
    ELEARNING: "ELEARNING",
    EXERCISE: "EXERCISE",
    TEST: "TEST",
};

export const PREV_ROUTE = [
    "/",
    "/auth/signup/email",
    "/auth/signup/success",
    "/auth/verify-account",
    "/auth/forgot/success",
    "/auth/forgot",
    "/auth/signup",
    "/error/404",
];

export const FRIENDS_FETCH_TYPE = {
    SUGGESTION: "suggestion",
    RECENTLY_ADDING: "recently_adding",
    BIRTHDAY_TODAY: "birthday_today",
    BIRTHDAY_COMING: "birthday_comming",
    MAKING_FRIEND_PENDING_RESPONSE: "make_friend_pending_response",
    SEARCH: "search"
};

export const CATEGORY_TEST = {
    EXERCISE: "EXERCISE",
    TEST: "TEST",
    EXAM: "EXAM",
};

export const QUESTION_CREATATION_METHODS = {
    MANUAL: "MANUAL",
    SELECT: "SELECT",
    RANDOM: "RANDOM",
    UPLOAD: "UPLOAD",
    IMPORT: "IMPORT",
    IPTEST: "IPTEST",
};

export const SUBMISSION_METHODS = {
    MANUAL: "MANUAL",
    UPLOAD: "UPLOAD",
    BOTH: "BOTH",
};

export const SOCIAL_FRIEND_STATUS = {
    ACTIVE: "ACTIVE",
    NONE: "NONE",
    PENDING: "PENDING",
    INVITING: "INVITING"
};

export const TEST_METHODS = {
    MANUAL: "MANUAL",
    UPLOAD: "UPLOAD",
    IPTEST: "IPTEST",
};

export const monthOpts = [{
        value: 1,
        text: 1,
    },
    {
        value: 2,
        text: 2,
    },
    {
        value: 3,
        text: 3,
    },
    {
        value: 4,
        text: 4,
    },
    {
        value: 5,
        text: 5,
    },
    {
        value: 6,
        text: 6,
    },
    {
        value: 7,
        text: 7,
    },
    {
        value: 8,
        text: 8,
    },
    {
        value: 9,
        text: 9,
    },
    {
        value: 10,
        text: 10,
    },
    {
        value: 11,
        text: 11,
    },

    {
        value: 12,
        text: 12,
    },
];

export const UPLOAD_TEST_SUBMISSION_TYPE = {
    MANUAL: "MANUAL",
    UPLOAD: "UPLOAD"
}
