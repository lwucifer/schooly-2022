/********************************
 * AUTH APIs
 *********************************/
export const LOGIN = `/user/public/login`;
export const LOGIN_FACEBOOK = `/user/public/login/facebook`;
export const LOGIN_GOOGLE = `/user/public/login/google`;
export const REGISTER = `/user/public/register`;
export const REGISTER_VALIDATE = `/user/public/validate`;
export const LOGOUT = `/user/account/logout`;
export const AUTH_INFO = `/auth/info`;
export const SEND_OTP = `/auth/otp`;
export const CHECK_PHONE = `/user/public/validate`;
export const FORGOT_PASSWORD = `/user/public/resetpwd`;
export const RESET_PASSWORD_REQUEST = `/user/public/resetpwd/request`;
export const CHANGE_PASSWORD = `/user/account/changepwd`;
export const ACCOUNT_PERSONAL = `/social/profile`;
export const ACCOUNT_PROFILE = `/user/account/profile`;
export const ACCOUNT_LINK = `/user/account/link`;
export const ACCOUNT_PHONE = `/account/phone`;
export const ACCOUNT_SETTING = `/user/account/setting`;
export const ACCOUNT_TRANSACTIONS = `/user/account/transactions`;
export const ACCOUNT_REVENUE = `/user/account/revenue`;
export const ACCOUNT_EARNING = `/user/account/earning`;
export const ACCOUNT_HISTORY_WITHDRAWALS = `/user/account/withdrawals`;
export const VERIFY_EMAIL = `user/public/verify`;
export const REFRESH_TOKEN = `user/public/renew`;
export const UPDATE_AVATAR = `/social/api/user/updateAvatar`;
export const UPDATE_COVER = `/social/api/user/updateCover`;
export const CHECK_EMAIL = `/social/api/user/checkEmail`;
export const VERIFY_OTP_EMAIL = `/social/api/user/verifyOtp`;
export const UPDATE_PHONE = `/social/api/user/updatePhone`;
export const ACCOUNT_PROFILE_BIOGRAPHY = `/user/account/profile/biography`;
export const SOCIAL_OTP = `/social/otp`;
export const SOCIAL_PROFILE_EMAIL = `/social/profile/email`;
export const SOCIAL_PROFILE_PHONE_NUMBER = `/social/profile/phone_number`;
export const SOCIAL_CHECK_PHONE_NUMBER = `/social/profile/check_phone_number`;
export const ACCOUNT_PRIVACY = `/user/account/privacy`;

/**
 * SOCIALS
 */
export const FEED = `/social/news-feed`;
export const POSTS = `/social/posts`;
export const NOTIFICATIONS = `/social/api/notification`;
export const SOCIAL_FOLLOW = `/social/following`;
export const SOCIAL_SCRAPER = `/social/utils/link-preview`;
export const REGISTER_DEVICE = `/notification/devices`;
export const NOTIFICATION_UNREAD = `chat/social/api/notification/unRead`;
export const SOCIAL_USERS = `/social/users`;
export const MEDIA = `media`;
export const SOCIAL_FRIENDS = `/social/friends`;
export const PROFILE_AVATAR = `/social/profile/avatar`;
export const PROFILE_COVER = `/social/profile/cover`;
export const SEARCHING_FRIENDS = `/social/searching/friends`;
export const SEARCHING_NOT_FRIENDS = `/social/searching/users_not_friends`;
export const SOCIAL_FRIENDS_ONLINE = `/social/friends/online/list`;
export const SEARCHING_ROOM = `/chat/rooms/search/room`;

/**
 * NOTIFICATION
 */
export const NOTIFICATIONS_HEADER = `/notification/notifications`;
export const COUNT_NOTIFICATIONS_HEADER = `/notification/notifications/counting`;

/**
 * ELEARNING
 */
export const ELEARNING_PUBLIC_SUMMARY = `/elearning/public/summary`;
export const ELEARNING_PUBLIC_TEACHER_ELS = `/elearning/public/teacher_els`;
export const ELEARNING_PUBLIC_ELEARNING_TEACHER = `/elearning/public/elearning/teacher`;
export const ELEARNING_PUBLIC_CATEGORY = `/elearning/public/school/categories`;
export const ELEARNING_PUBLIC_INFO = `/elearning/public/info`;
export const ELEARNING_PUBLIC_VOTE = `/elearning/public/votes`;
export const ELEARNING_PUBLIC_PLACE_DISTRICTS = `/elearning/public/place/districts`;
export const ELEARNING_PUBLIC_PLACE_PROVINCES = `/elearning/public/place/provinces`;
export const ELEARNING_PUBLIC_PLACE_WARDS = `/elearning/public/place/wards`;
export const ELEARNING_PUBLIC_PROGRAM = `/elearning/public/program`;
export const ELEARNING_VOTED_ELEARNING = `/elearning/public/voted_elearnings`;
export const ELEARNING_CREATING_ANSWERS = `/elearning/creating/answers`;
export const ELEARNING_CREATING_CHAPTERS = `/elearning/creating/chapters`;
export const ELEARNING_CREATING_DOCS = `/elearning/creating/docs`;
// export const ELEARNING_CREATING_EXERCISES = `/elearning/creating/exercises`;
export const ELEARNING_CREATING_EXERCISES = `/elearning/teaching/tests`;
export const ELEARNING_CREATING_EXERCISE = `/elearning/teaching/test`;
export const ELEARNING_CREATING_TEST = `/elearning/creating/test`;
export const ELEARNING_CREATING_GENERAL = `/elearning/creating/general`;
export const ELEARNING_CREATING_LESSONS = `/elearning/creating/lessons`;
export const ELEARNING_CREATING_QUESTIONS = `/elearning/creating/questions`;
export const ELEARNING_CREATING_QUESTIONS_OF_BANK = `/elearning/teaching/manage/questions`;
export const ELEARNING_PUBLIC_RELATED = `/elearning/public/related`;
export const ELEARNING_PUBLIC_SUBJECT = `/elearning/public/subjects`;
export const ELEARNING_PUBLIC_LEVEL = `/elearning/public/levels`;
export const ELEARNING_PUBLIC_SCHOOL_YEAR = `/elearning/public/schoolyears`;
export const ELEARNING_TEACHING_REPOSITORY_FILE = `/elearning/teaching/repository/files`;
export const ELEARNING_TEACHING_REPOSITORY = `/elearning/teaching/repository`;
// export const ELEARNING_TEACHING_EXERCISE = `/elearning/teaching/tests`;
export const ELEARNING_TEACHING_EXERCISE = `/elearning/teaching/elearning/exercises`;
// export const ELEARNING_TEACHING_TEST = `/elearning/teaching/elearning/exercises`;
export const ELEARNING_TEACHING_VOTE = `/elearning/teaching/votes`;
export const ELEARNING_TEACHING_EXERCISE_ELEARNING = `/elearning/teaching/exercise_elearnings`;
export const ELEARNING_TEACHING_EXERCISE_PARTICIPANT = `/elearning/teaching/test/participants`;
export const ELEARNING_TEACHING_SUBMISSIONS_EXPORT = `/elearning/teaching/submission/export`;
// export const ELEARNING_TEACHING_EXERCISE_PARTICIPANT = `/elearning/teaching/exercise/participants`;
export const ELEARNING_TEACHING_RESULT = `/elearning/teaching/test/submission`;
export const ELEARNING_TEACHING_PUBLISH = `/elearning/teaching/test/publish`;
// export const ELEARNING_TEACHING_RESULT = `/elearning/teaching/exercise/result`;
export const ELEARNING_TEACHING_EVALUATION = `/elearning/teaching/test/mark`;
// export const ELEARNING_TEACHING_EVALUATION = `/elearning/teaching/result/evaluate`;
export const ELEARNING_TEACHING_SUBMISSION_QUESTIONS = `/elearning/teaching/student/questions`;
export const ELEARNING_TEACHING_CLASS = `/elearning/teaching/classes`;
export const ELEARNING_CREATING_SETTING = `/elearning/creating/setting`;
export const ELEARNING_CREATING_PROGRESS = `/elearning/creating/progress`;
export const ELEARNING_PUBLIC_SEARCH = `/elearning/public/search`;
export const ELEARNING_CREATING_PUBLISH = `/elearning/teaching/elearning/publish`;
export const ELEARNING_JOIN = `/elearning/join`;
export const ELEARNING_PUBLIC_WHAT_NEXTS = `/elearning/public/what_nexts`;
export const ELEARNING_PUBLIC_FOR_YOU = `/elearning/public/for_you`;
export const ELEARNING_PUBLIC_VOTED_SUBJECTS = `/elearning/public/voted_subjects`;
export const ELEARNING_PUBLIC_NEWEST = `/elearning/public/newest`;
export const ELEARNING_PUBLIC_HIGHLIGHT_TEACHERS = `/elearning/public/highlight_teachers`;
export const ELEARNING_PUBLIC_ELEARNING = `/elearning/public/list`;
export const ELEARNING_STUDY_TIMETABLE = `/elearning/study/timetable`;
export const ELEARNING_NOTIFICATION = `/elearning/notifications`;
export const PUBLIC_CATEGORY = `/elearning/public/category`;
export const ELEARNING_PUBLIC_STATISTIC = `/elearning/public/statistic`;
export const COMMON_CLASS = `/elearning/school/common/classes`;
export const COMMON_CLASS_ASSIGNMENT = `/elearning/teaching/assignment/clgrs`;
export const ELEARNING_TEACHING_GROUP = "/elearning/teaching/group";
export const ELEARNING_TEACHING_GROUPS = "/elearning/teaching/groups";
export const ELEARNING_TEACHING_GROUP_MEMBER =
  "/elearning/teaching/group/member";
export const ELEARNING_TEACHING_GROUP_MEMBERS =
  "/elearning/teaching/group/members";
export const ELEARNING_COMMON_STUDENTS = "/elearning/teaching/common/students";
export const ELEARNING_COMMON_PARTICIPANTS =
  "/elearning/teaching/common/participants";
export const COMMON_GRADES = `/elearning/school/common/grades`;

/**
 * ONLINE CLASS
 */
export const TEACHING_OLCLASSES = `/elearning/teaching/olclasses`;
export const TEACHING_OLCLASS = `/elearning/teaching/olclass`;
export const TEACHING_OLCLASS_LESSON_SESSIONS = `/elearning/teaching/olclasses/lesson/sessions`;
export const TEACHING_OLCLASS_INVITES = `/elearning/teaching/olclass/invites`;
export const TEACHING_OLCLASS_BLOCK = `/elearning/teaching/olclass/banned`;
export const TEACHING_OLCLASS_LESSONS = `/elearning/teaching/olclass/lessons`;
export const TEACHING_OLCLASS_LESSON = `/elearning/teaching/olclass/lesson`;
export const TEACHING_OLCLASS_LESSON_ATTENDANCES = `/elearning/teaching/olclass/lesson/attendances`;
export const TEACHING_OLCLASS_STUDENTS = `/elearning/teaching/olclass/students`;
export const TEACHING_ELEARNING_STATISTIC = `/elearning/teaching/elearning/statistic`;
export const TEACHING_SCHEDULES = `/elearning/teaching/olclasses/schedules`;
export const TEACHING_OLCLASS_STAFFS = `/elearning/school/common/staffs`;

/**
 * STUDY
 */
export const STUDY_ELEARNING = `/elearning/study/elearnings`;
export const STUDY_STATISTIC_ELEARNING = `/elearning/study/elearning/statistic`;
export const STUDY_MY_ELEARNING = `/study`;
export const STUDY_FAVOURITE = `/elearning/study/elearning/favourites`;
export const STUDY_VOTE = `/elearning/study/elearning/votes`;
export const STUDY_ARCHIVE = `/elearning/study/elearning/archives`;
export const STUDY_INFO = `/elearning/study/elearning/info`;
export const STUDY_INTERACTIVE_QUESTION = `/elearning/study/interactive/questions`;
export const STUDY_INTERACTIVE_QUESTION_ADD = `/elearning/study/interactive/question`;
export const STUDY_ELEARNING_PROGRESS = `/elearning/study/elearning/progress`;
export const STUDY_QUESTION_LIKE = `/elearning/study/interactive/question/like`;
export const STUDY_QUESTION_ADD_ANSWER = `/elearning/study/interactive/answer`;
export const STUDY_QUESTION_ANSWERS = `/elearning/study/interactive/answers`;
export const STUDY_QUESTION_LIKE_ANSWER = `/elearning/study/interactive/answer/like`;
export const STUDY_LESSON = `/streaming/video`;
export const STUDY_INTERACTIVE_NOTIFICATION = `/elearning/study/interactive/announcements`;
export const STUDY_OVERVIEW = `/elearning/study/overview`;
export const STUDY_OVERVIEW_TIME_TABLE = `/elearning/study/timetable`;
export const STUDY_OVERVIEW_DEADLINE = `/elearning/study/deadline`;
export const STUDY_GROUP_CLASS = `/elearning/study/groups`;

// export const STUDY_EXERCISE_QUESTIONS = `/elearning/study/exercise/questions`;
// export const STUDY_EXERCISE_START = `/elearning/study/exercise/start`;
// export const STUDY_EXERCISE_RESULT = `/elearning/study/exercise/result`;
// export const STUDY_EXERCISE_SUBMISSION = `/elearning/study/exercise/submission`;
// export const STUDY_EXERCISE_ELEARNING = `/elearning/study/ex_elearnings`;

export const STUDY_EXERCISE_QUESTIONS = `/elearning/study/test/questions`;
export const STUDY_EXERCISE_START = `/elearning/study/test/start`;
export const STUDY_EXERCISE_SUBMISSION = `/elearning/study/test/submission`;
export const STUDY_EXERCISE_UPLOAD = `/elearning/study/test/upload`;
export const STUDY_EXERCISE_ELEARNING = `/elearning/study/ex_elearnings`;

export const STUDY_ELEARNING_EXERCISE = `/elearning/study/elearning/exercises`;
// export const STUDY_ELEARNING_EXERCISE_2 = `/elearning/study/elearning/exercise_list`;
export const STUDY_ELEARNING_EXERCISE_2 = `/elearning/study/student/tests`;

export const STUDY_OLCLASS_TIMETABLE = `/elearning/study/olclass/timetable`;
export const STUDY_OLCLASS_LESSON_SESSIONS = `/elearning/study/olclasses/lesson/sessions`;
export const STUDY_OLCLASS_LESSION_ATTENDANCE = `/elearning/study/olclass/attendance`;

export const STUDY_ELEARNING_NOTIFICATIONS = `/study/elearning/announcements`;

export const STUDY_ELEARNING_OLCLASSES = `/elearning/study/elearning/olclasses`;
export const STUDY_OLCLASS_SESSION = `/elearning/study/olclass/lesson`;

/**
 * SCHOOL
 */
export const SCHOOL_CLASSES = `/elearning/school/admin/classes`;
export const SCHOOL_SUMMARY = `/elearning/school/summary`;
export const SCHOOL_SEARCH = `/elearning/school/search`;
export const SCHOOL_STANDALONE = `/elearning/school/list`;
export const SCHOOL_INFO = `/elearning/school/info`;
export const SCHOOL_ELEARNING = `/elearning/school/elearnings`;
export const SCHOOL_HIGHTLIGHT_ELEARNING = `/elearning/school/highlight_els`;
export const SCHOOL_PROFESSIONAL = `/elearning/school/admin/professional`;
export const SCHOOL_STUDENT = `/elearning/school/admin/students`;
export const SCHOOL_TEACHER = `/elearning/school/admin/teachers`;
export const SCHOOL_ANNOUCEMENTS = `/elearning/school/announcements`;
export const SCHOOL_LINKWEBS = `/elearning/school/linkwebs`;
export const SCHOOL_NEWS = `/elearning/school/news`;
export const SCHOOL_ORG_INTRO = `/elearning/school/organization`;
export const SCHOOL_PROFESSION = `/elearning/school/professions`;
export const SCHOOL_TIMETABLE = `/elearning/school/timetable`;
export const SCHOOL_STAFFS = `/elearning/school/staffs`;
export const SCHOOL_SUBJECTS = `/elearning/school/subjects`;

export const SCHOOL_APPLY_SUBJECTS = `/elearning/school/common/apply_subs`;
/**
 * MESSAGE
 */
export const GROUP_ADD_MEMBER = `chat/social/api/room/addMember`;
export const GROUP_AVATAR = `chat/social/api/room/avatar`;
export const GROUP_NAME = `chat/social/api/room/name`;
export const GROUP = `chat/social/api/room`;
export const GROUP_MEMBER = `chat/social/api/room/getMember`;
export const GROUP_LEAVE = `chat/social/api/room/leaveGroup`;
export const GROUP_REMOVE_MEMBER = `chat/social/api/room/removeMember`;
export const GROUP_NOTIFICATION = `chat/social/api/room/settingNotification`;
export const MESSAGE = `chat/social/api/message`;
export const GROUP_DETAIL = `chat/social/api/room/getDetail`;
export const MESSAGE_SEND_IMG = `chat/social/api/message/uploadImg`;
export const LIMIT_MESSAGES = `chat/social/api/message/getLimit`;
export const MESSAGE_TYPE = `chat/social/api/message/getViaRoomType`;
export const MESSAGE_SEND_FILE = `chat/social/api/message/uploadFile`;

export const ROOM = `chat/rooms`;

/**
 * TEACHING
 */
export const TEACHING_SUMMARY = `/elearning/teaching/summary`;
export const TEACHING_ELEARNINGS = `/elearning/teaching/elearnings`;
export const TEACHING_ELEARNING_PROGRAMS = `/elearning/teaching/elearning/programs`;
export const TEACHING_ELEARNING_HIDES = `/elearning/teaching/elearnings/hides`;
export const TEACHING_EXCERCISE = `/elearning/teaching/excercises`;
export const TEACHING_REPOSITORY = `/elearning/teaching/repository`;
export const TEACHING_ONLINE_CLASS = `/elearning/teaching/olclass`;
export const TEACHING_MODIFY_SCHEDULE = `/elearning/teaching/olclass/request`;
export const TEACHING_MODIFY_SCHEDULE_PROCESS = `/elearning/teaching/olclass/request/process`;
export const TEACHING_INTERACTIVE = `/elearning/teaching/interactive/questions`;
export const TEACHING_STUDENTS = `/elearning/teaching/students`;
export const TEACHING_STUDENT_EXPORT = `/elearning/teaching/student/export`;
export const TEACHING_INVITE = `/elearning/teaching/invites`;
export const TEACHING_VOTES = `/elearning/teaching/votes`;
export const TEACHING_ELEARNING_PARTICIPANT = `/elearning/teaching/elearning/participants`;
export const TEACHING_ELEARNING_BANNED = `/elearning/teaching/elearning/banned`;
export const TEACHING_STUDENT_PROGESS = `/elearning/teaching/student/progress`;
export const TEACHING_STUDENT_EXERCISES = `/elearning/teaching/student/tests`;
// export const TEACHING_STUDENT_EXERCISES = `/elearning/teaching/student/exercises`;
export const TEACHING_ELEARNING_REQUESTS = `/elearning/teaching/elearning/requests`;
export const TEACHING_ELEARNING_ACCEPT = `/elearning/teaching/elearning/accept`;
export const TEACHING_ELEARNING_INVITES = `/elearning/teaching/elearning/invite`;
export const TEACHING_INTERACTIVE_LISTQUESTION = `/elearning/teaching/interactive/list-questions`;
export const TEACHING_INTERACTIVE_LISTANSWER = `/elearning/teaching/interactive/answers`;
export const TEACHING_INTERACTIVE_ANSWER = `/elearning/teaching/interactive/answer`;
export const TEACHING_INTERACTIVE_LIKEANSWER = `/elearning/teaching/interactive/answer/like`;
export const TEACHING_INTERACTIVE_ANNOUNCEMENTS = `/elearning/teaching/interactive/announcements`;
export const TEACHING_INTERACTIVE_ADD_ANNOUNCEMENT = `/elearning/teaching/interactive/announcement`;
export const TEACHING_PUBLIC_LIST = `/elearning/public/list`;
export const PUBLIC_CLASSES = `/elearning/public/classes`;
export const TEACHING_SCHOOL_STUDENTS = `/elearning/teaching/school/students`;
export const TEACHING_TEST_PARTICIPANTS = `/elearning/teaching/test/participants`;
export const TEACHING_TEST_SUBMISSION = `/elearning/teaching/test/submission`;
export const TEACHING_ELEARNINGS_OF_TEACHER = `/elearning/teaching/common/elearnings`;
export const TEACHING_TEACHER_CLASS_GROUP = `/elearning/teaching/assignment/clgrs`
export const TEACHING_CLGR_STUDENT = `/elearning/teaching/clgr/students`
export const TEACHING_CLGR_STUDENT_EXPORT = `/elearning/teaching/clgr/students/export`
export const TEACHING_DOCS = `/elearning/teaching/docs`;
export const TEACHING_DOC = `/elearning/teaching/doc`;
export const STUDY_DOCS = `/elearning/study/docs`;
export const ELEARNING_TEACHING_SCHEDULES = `/elearning/teaching/timetable`;
export const TEACHING_ONLINE_SCHEDULES = `/elearning/teaching/schedules`;

/**
 * PAYMENT
 */
export const PAYMENT_CREATE_ORDER = `/elearning/order`;
export const PAYMENT_HASHKEY = `/elearning/payment/transaction/hashkey/generate`;
export const PAYMENT_VALIDATE_TRANSACTION = `/elearning/payment/transaction/validate`;
export const PAYMENT_REPAY = `/elearning/payment/repay`;
export const PAYMENT_CANCEL = `/elearning/payment/cancel`;

/**
 * CART
 */
export const CART_LIST = `/elearning/cart`;

export const TEACHING_STATISTIC_REVENUE = `/elearning/teaching/statistic/revenue`;
export const TEACHING_CHART_STATISTIC_REVENUE = `/elearning/teaching/summary/revenue_chart`;
export const TEACHING_STATISTIC_HIGHLIGHT_ELS = `/elearning/teaching/summary/highlights`;
/**
 * BANK
 */
export const PUBLIC_BANK = `/user/public/banks`;
export const ACCOUNT_BANK = `/user/account/banks`;
export const ACCOUNT_BANK_VALIDATE = `/user/account/banks/validate`;
export const ACCOUNT_BALANCE = `/user/account/balance`;
export const ACCOUNT_WITHDRAW = `/user/account/withdraw`;
export const INFO_SUPPORT = `user/account/help`;

/**
 * BANK EXAM
 */
export const BANK_EXAM = `/elearning/teaching/tests`;
export const BANK_EXAM_POST = `/elearning/teaching/test`;
export const POINT_QUESTION_EXAM = `/elearning/teaching/question/essay/point`;
export const QUESTION_SORT = `/elearning/teaching/question/sort`;
export const UPLOAD_EXAM = `/elearning/teaching/test/upload`;

/**
 * BANK QUESTION
 */
export const BANK_QUESTION = `/elearning/teaching/manage/questions`;
export const QUESTION_TO_BANK = `/elearning/teaching/manage/question`;
export const BANK_QUESTION_BANK = `/elearning/teaching/manage/question_bank`;
export const BANK_QUESTION_IMPORT = `/elearning/teaching/question/import`;
export const BANK_QUESTION_IMPORT_VALID = `/elearning/teaching/question/import/upload`;
export const BANK_QUESTION_IMPORT_COMPLETE = `/elearning/teaching/question/import/complete`;
export const BANK_QUESTION_DOWNLOAD_SAMPLES = `elearning/teaching/import/samples`;

/**
 * MANAGE EXAMS
 */
export const MANAGE_EXAMS_LIST = `/elearning/teaching/exams`;
export const MANAGE_EXAM = `/elearning/teaching/exam`;
export const MANAGE_EXAM_PUBLISH = `/elearning/teaching/exam/publish`;
export const SETTING_EXAMS_VIEW = `/elearning/teaching/exam/setting`;
export const SETTING_EXAMS_POST = `/elearning/teaching/test/setting`;
export const SETTING_EXAMS_JOIN = `/elearning/teaching/exam/joins`;
export const MANAGE_EXAM_ENABLE = `/elearning/teaching/exam/enable`;

/**
 * STUDY EXAM
 */
export const STUDY_EXAMS = `/elearning/study/exams`;
export const STUDY_EXAM_JOIN = `/elearning/study/exam/join`;
export const STUDY_EXAM_LIKE = `/elearning/study/exam/like`;
export const STUDY_EXAM_TESTS = `/elearning/study/tests`;
export const STUDY_EXAM_VOTE = `/elearning/study/exam/vote`;
export const STUDY_EXAM_VOTES = `/elearning/study/exam/votes`;
export const STUDY_EXAM_COMMENTS = `/elearning/study/exam/comments`;
export const STUDY_EXAM = `/elearning/study/exam`;
export const STUDY_EXAM_TEST = `/elearning/study/test`;


/**
* STUDY STUDENT EXAM
*/
export const STUDY_STUDENT_EXAMS = `/elearning/study/student/exams`;