import { GROUP_MEMBER } from "./endpoints";

export const BASE = {
    LIST: "list",
    ADD: "add",
    EDIT: "edit",
    DELETE: "delete",
    DETAIL: "detail",
    EDIT_PAYLOAD: "editPayload",
    DELETE_PAYLOAD: "deletePayload",
    DELETE_PAYLOAD2: "deletePayload2",
    EDIT_FORMDATA: "putWithFormData",
    GET_END: "getEnd",
    PUT_END: "putEnd",
    POST_END: "postEnd",
    PATCH: "patch",
};

export const AUTH = {
    LOGIN: "login",
    LOGIN_FACEBOOK: "loginFacebook",
    LOGIN_GOOGLE: "loginGoogle",
    REGISTER: "register",
    LOGOUT: "logout",
    SENDOTP: "sendotp",
    STATUS: "status",
    FORGOT_PASSWORD: "forgotPassword",
    CHANGE_PASSWORD: "changePassword",
    VERIFY_OTP: "verifiOtp",
    RESET_PASSWORD_REQUEST: "resetPasswordRequest",
    VERIFY_EMAIL: "verifyEmail",
    REFRESH_TOKEN: "refreshToken",
};

export const SOCIAL_NOTIFICATIONS = {
    LIST: "socialNotifications",
    REGISTER_DEVICE: "registerDevice",
    READ_NOTIFICATION: "readNotification",
    GET_NOTI_UNREAD: "getNotiUnread",
};

export const HEADER_NOTIFICATIONS = {
    LIST: "getNotifications",
    LIST_SCROLL: "getNotificationsScroll",
    LIST_COUNT: "getCountNotifications",
    DETAIL_LIST: "getDetailNotifications",
    CHECK_IS_READ_NOTIFICATION: "checkIsReadNotifications",
    CHECK_IS_READ_NOTIFICATION_ALL: "checkIsReadNotificationAll",
    DELETE: "deleteNotifications",
};

export const NEWFEED = {
    GET_FEEDS: "newfeedGetFeeds",
    GET_FEEDS_INFINITE: "newfeedGetFeedsInfinite",
    ADD_POST: "newfeedAddPost",
    EDIT_POST: "newfeedEditPost",
    DELETE_POST: "newfeedDeletePost",
    UPDATE_TAGS_POST: "newfeedUpdateTagsPost",
    UPDATE_TAGS_POST_CHILDREN: "newfeedUpdateTagsPostChildren",
    LIKE_POST: "newfeedLikePost",
    DELETE_LIKE_POST: "deleteLikePost",
    LIKE_COMMENT: "newfeedLikeComment",
    DELETE_LIKE_COMMENT: "newfeedDeleteLikeComment",
    LIKE_CHILD_COMMENT: "newfeedLikeChildComment",
    DELETE_LIKE_CHILD_COMMENT: "newfeedDeleteLikeChildComment",
    GET_COMMENT: "newfeedGetComment",
    ADD_COMMENT: "newfeedAddComment",
    EDIT_COMMENT: "newfeedEditComment",
    DELETE_COMMENT: "newfeedDeleteComment",
    GET_CHILD_COMMENT: "newfeedGetChildComment",
    ADD_CHILD_COMMENT: "newfeedAddChildComment",
    EDIT_CHILD_COMMENT: "newfeedEditChildComment",
    DELETE_CHILD_COMMENT: "newfeedDeleteChildComment",
    EDIT_POST_TAGS: "newfeedEditPostTags",
    EDIT_POST_PRIVACY: "newfeedEditPostPrivacy"
};

export const ACCOUNT_TIMELINE = {
    GET_POSTS: "accountTimelineGetPosts",
    GET_POSTS_INIFINITE: "accountTimelineGetPostsInfinite",
    ADD_POST: "accountTimelineAddPost",
    EDIT_POST: "accountTimelineEditPost",
    DELETE_POST: "accountTimelineDeletePost",
    UPDATE_TAGS_POST: "accountTimelineUpdateTagsPost",
    UPDATE_TAGS_POST_CHILDREN: "accountTimelineUpdateTagsPostChildren",
    LIKE_POST: "accountTimelineLikePost",
    DELETE_LIKE_POST: "deleteLikePost",
    LIKE_COMMENT: "accountTimelineLikeComment",
    DELETE_LIKE_COMMENT: "accountTimelineDeleteLikeComment",
    LIKE_CHILD_COMMENT: "accountTimelineLikeChildComment",
    DELETE_LIKE_CHILD_COMMENT: "accountTimelineDeleteLikeChildComment",
    GET_COMMENT: "accountTimelineGetComment",
    ADD_COMMENT: "accountTimelineAddComment",
    EDIT_COMMENT: "accountTimelineEditComment",
    DELETE_COMMENT: "accountTimelineDeleteComment",
    GET_CHILD_COMMENT: "accountTimelineGetChildComment",
    ADD_CHILD_COMMENT: "accountTimelineAddChildComment",
    EDIT_CHILD_COMMENT: "accountTimelineEditChildComment",
    DELETE_CHILD_COMMENT: "accountTimelineDeleteChildComment",
    EDIT_POST_TAGS: "accountTimelineEditPostTags",
    EDIT_POST_PRIVACY: "accountTimelineEditPostPrivacy"
};

export const SOCIAL_POST = {
    GET_POST: "socialPostlineGetPost",
    EDIT_POST: "socialPostlineEditPost",
    DELETE_POST: "socialPostlineDeletePost",
    UPDATE_TAGS_POST: "socialPostlineUpdateTagsPost",
    UPDATE_TAGS_POST_CHILDREN: "socialPostlineUpdateTagsPostChildren",
    LIKE_POST: "socialPostlineLikePost",
    DELETE_LIKE_POST: "deleteLikePost",
    LIKE_COMMENT: "socialPostlineLikeComment",
    DELETE_LIKE_COMMENT: "socialPostlineDeleteLikeComment",
    LIKE_CHILD_COMMENT: "socialPostlineLikeChildComment",
    DELETE_LIKE_CHILD_COMMENT: "socialPostlineDeleteLikeChildComment",
    GET_COMMENT: "socialPostlineGetComment",
    GET_COMMENT_BEFORE: "socialPostlineGetCommentBefore",
    CHECK_SHOW_MORE_TOP: "socialPostlineCheckShowMoreTop",
    ADD_COMMENT: "socialPostlineAddComment",
    EDIT_COMMENT: "socialPostlineEditComment",
    DELETE_COMMENT: "socialPostlineDeleteComment",
    GET_CHILD_COMMENT: "socialPostlineGetChildComment",
    ADD_CHILD_COMMENT: "socialPostlineAddChildComment",
    EDIT_CHILD_COMMENT: "socialPostlineEditChildComment",
    DELETE_CHILD_COMMENT: "socialPostlineDeleteChildComment",
    EDIT_POST_TAGS: "socialPostEditPostTags",
    EDIT_POST_PRIVACY: "socialPostEditPostPrivacy"
};

export const SOCIAL_SEARCH = {
    SEARCH_USER_SOCIAL_LIST: "searchUserSocialList",
    SEARCH_POST_SOCIAL_LIST: "searchPostSocialList",
};

export const MODAL_POST_DETAIL = {
    GET_POST: "modalPostDetailGetPost",
    EDIT_POST: "modalPostDetailEditPost",
    DELETE_POST: "modalPostDetailDeletePost",
    LIKE_POST: "modalPostDetailLikePost",
    DELETE_LIKE_POST: "modalPostDetailDeleteLikePost",
    CLEAR_POST: "modalPostDetailClearPost",
    GET_COMMENT: "modalPostDetailGetComment",
    ADD_COMMENT: "modalPostDetailAddComment",
    EDIT_COMMENT: "modalPostDetailEditComment",
    DELETE_COMMENT: "modalPostDetailDeleteComment",
    LIKE_COMMENT: "modalPostDetailLikeComment",
    DELETE_LIKE_COMMENT: "modalPostDetailDeleteLikeComment",
    GET_CHILD_COMMENT: "modalPostDetailGetChildComment",
    ADD_CHILD_COMMENT: "modalPostDetailAddChildComment",
    EDIT_CHILD_COMMENT: "modalPostDetailEditChildComment",
    DELETE_CHILD_COMMENT: "modalPostDetailDeleteChildComment",
    LIKE_CHILD_COMMENT: "modalPostDetailLikeChildComment",
    DELETE_LIKE_CHILD_COMMENT: "modalPostDetailDeleteLikeChildComment",
    EDIT_POST_TAGS: "modalPostDetailEditPostTags"
};

export const SOCIAL_ACCOUNT_PROFILE = {
    GET_ACCOUNT_PROFILE: "getAccountProfile",
    GET_SOCIAL_PROFILE: "getSocialProfile",
    EDIT_ACCOUNT_PRIVACY: "editAccountPrivacy",
    GET_USER_TOTAL_FRIENDS: "getUserTotalFriends",
};

export const SOCIAL_FRIEND_TIMELINE = {
    GET_FRIEND_ONLINE: "getFriendOnline",
    GET_FRIEND_SUGGESTION: "getFriendSuggestion",
    GET_FRIEND_BIRTHDAY: "getFriendBirthday",
    ADD_FRIEND: "addFriend",
    CANCEL_FRIEND: "cancelFriend",
};

export const ACCOUNT_PERSONAL = {
    LIST: "accountPersonalList",
    EDIT: "accountPersonalEdit",
    EDIT_AVATAR: "accountPersonalEditAvatar",
    EDIT_PHONE: "accountPersonalEditPhone",
    EDIT_EMAIL: "accountPersonalEditEmail",
    VERIFY_OTP_EMAIL: "verifyOtpEmail",
    UPDATE_PHONE: "accountPersonalUpdatePhone",
    CHECK_PHONE_NUMBER: "accountCheckPhoneNumber",
};

export const ACCOUNT_PROFILE = {
    LIST: "accountProfileList",
};

export const ACCOUNT_LINK = {
    LIST: "accountLinkList",
    ADD: "accountLinkAdd",
};

export const ACCOUNT_TRANSACTIONS = {
    LIST: "accountTransactionList",
};

export const ACCOUNT_REVENUE = {
    LIST: "accountRevenueList",
};

export const ACCOUNT_EARNING = {
    LIST: "accountEarningList",
};

export const ACCOUNT_WITHDRAWALS = {
    LIST: "accountWithdrawalsList",
    ADD: "accountWithdrawalsAdd",
};

export const ACCOUNT_SETTING = {
    LIST: "accountSettingList",
    UPDATE: "accountSettingUpdate",
};

export const TEACHER_CLASS_GROUP = {
    LIST: "teacherClassGroupList",
}

export const ELEARNING_PUBLIC_SUMMARY = {
    LIST: "elearningPublicSummaryList",
    STATISTIC: "elearningPublicSummaryStatistic",
};

export const ELEARNING_PUBLIC_CATEGORY = {
    LIST: "elearningPublicCategoryList",
};

export const ELEARNING_PUBLIC_ELEARNING_TEACHER = {
    LIST: "elearningPublicElearningTeacherList",
};

export const ELEARNING_PUBLIC_TEACHER_ELS = {
    LIST: "elearningPublicElearningTeacherElsList",
};

export const ELEARNING_PUBLIC_INFO = {
    LIST: "elearningPublicInfoList",
};

export const ELEARNING_PUBLIC_VOTE = {
    LIST: "elearningPublicVoteList",
};

export const ELEARNING_PUBLIC_PLACE = {
    PROVINCE: "elearningPublicPlaceProvince",
    DISTRICT: "elearningPublicPlaceDistrict",
    WARD: "elearningPublicPlaceWard",
};

export const ELEARNING_PUBLIC_PROGRAM = {
    LIST: "elearningPublicProgramList",
};

export const ELEARNING_PUBLIC_RELATED = {
    LIST: "elearningPublicRelatedList",
};

export const ELEARNING_PUBLIC_SEARCH = {
    DETAIL: "elearningPublicElearningDetail",
};

export const ELEARNING_PUBLIC_VOTED_ELEARNING = {
    LIST: "elearningPublicVotedElearningList",
};

export const ELEARNING_PUBLIC_SCHOOL_YEAR = {
    LIST: "elearningPublicSchoolYearList",
};

export const ELEARNING_PUBLIC_WHAT_NEXTS = {
    LIST: "elearningPublicWhatNextsList",
};

export const ELEARNING_PUBLIC_FOR_YOU = {
    LIST: "elearningPublicForYouList",
};

export const ELEARNING_PUBLIC_VOTED_SUBJECTS = {
    LIST: "elearningPublicVotedSubjectsList",
};

export const ELEARNING_PUBLIC_NEWEST = {
    LIST_LECTURE: "elearningPublicNewestLecture",
    LIST_COURSE: "elearningPublicNewestCourse",
};

export const PUBLIC_CATEGORY = {
    LIST: "publicCategoryList",
};

export const ELEARNING_PUBLIC_HIGHLIGHT_TEACHERS = {
    LIST: "elearningPublicHighlightTeachers",
};

export const ELEARNING_PUBLIC_ELEARNING = {
    LIST: "elearningPublicElearning",
};

export const ELEARNING = {
    INFO: "elearningInfo",
    PROGRAM: "elearningProgram",
    RELATED: "elearningPublicRelated",
    SUBJECT: "elearningPublicSubject",
    LEVEL: "elearningPublicLevel",
};

export const CREATING_ANSWER = {
    LIST: "creatingAnswerList",
    ADD: "creatingAnswerAdd",
    EDIT: "creatingAnswerEdit",
    DELETE: "creatingAnswerDelete",
};

export const TEACHING_OLCLASSES = {
    LIST: "teachingOlclassesList",
    ADD: "teachingOlclassesAdd",
    EDIT: "teachingOlclassesEdit",
    INFO: "teachingOlclassesInfo",
    DELETE: "teachingOlclassesDelete",
    BLOCK: "teachingOlclassesBlock",
    UNBLOCK: "teachingOlclassesUnBlock",
};

export const TEACHING_OLCLASS_INVITES = {
    LIST: "teachingOlclassInvitesList",
    ADD: "teachingOlclassInvitesAdd",
    EDIT: "teachingOlclassInvitesEdit",
};

export const TEACHING_OLCLASS_LESSONS = {
    LIST: "teachingOlclassLessonsList",
    INFO: "teachingOlclassLessonInfo",
};
export const TEACHING_OLCLASS_LESSON_ATTENDANCES = {
    LIST: "teachingOlclassLessonAttendancesList",
    EDIT: "teachingOlclassLessonAttendancesEdit",
    SUMMARY: "teachingOlclassLessonAttendancesSummary",
};
export const TEACHING_OLCLASS_LESSON_SESSIONS = {
    LIST: "teachingOlclassLessonSessionsList",
};
export const TEACHING_OLCLASS_STUDENTS = {
    LIST: "teachingOlclassStudentList",
};
export const TEACHING_DOCS = {
    LIST: "teachingDocsList",
};
export const TEACHING_GROUPS = {
    LIST: "teachingGroupsList",
};

export const STUDY_DOCS = {
    LIST: "studyDocsList",
};

export const TEACHING_DOC = {
    INFO: "teachingDocInfo",
    ADD: "teachingDocAdd",
    EDIT: "teachingDocEdit",
    DELETE: "teachingDocDelete",
};

export const CREATING_CHAPTER = {
    LIST: "creatingChapterList",
    ADD: "creatingChapterAdd",
    EDIT: "creatingChapterEdit",
    DELETE: "creatingChapterDelete",
};

export const ELEARNING_CREATING_ANSWER = {
    LIST: "elearningCreatingAnswerList",
    ADD: "elearningCreatingAnswerAdd",
    EDIT: "elearningCreatingAnswerEdit",
    DELETE: "elearningCreatingAnswerDelete",
};

export const ELEARNING_CREATING_PROGRESS = "ELEARNING_CREATING_PROGRESS";

export const ELEARNING_CREATING_CHAPTER = {
    LIST: "elearningCreatingChapterList",
    ADD: "elearningCreatingChapterAdd",
    EDIT: "elearningCreatingChapterEdit",
    DELETE: "elearningCreatingChapterDelete",
};

export const ELEARNING_CREATING_DOC = {
    LIST: "elearningCreatingDocList",
    ADD: "elearningCreatingDocAdd",
    EDIT: "elearningCreatingDocEdit",
    DELETE: "elearningCreatingDocDelete",
};

export const ELEARNING_TEACHING_REPOSITORY_FILE = {
    LIST: "elearningTeachingRepositoryFileList",
    ADD: "elearningTeachingRepositoryFileAdd",
    DELETE: "elearningTeachingRepositoryFileDelete",
};

export const ELEARNING_TEACHING_REPOSITORY = {
    INFO: "elearningTeachingRepositoryFileInfo",
};

export const REPOSITORY = {
    INFO: "info",
};

export const ELEARNING_TEACHING_EXERCISE_ELEARNING = {
    LIST: "elearningTeachingExerciseElearningList",
};

export const ELEARNING_TEACHING_EXERCISE = {
    LIST: "elearningTeachingExerciseList",
    DETAIL: "elearningTeachingExerciseDetail",
    DELETE: "elearningTeachingExerciseDelete"
};

export const ELEARNING_TEACHING_EXERCISE_PARTICIPANT = {
    LIST: "elearningTeachingExerciseParticipantList",
    SUBMISSION_FILES: "elearningTeachingSubmissionFileList"
};

export const ELEARNING_TEACHING_TEST = {
    LIST: "elearningTeachingTestList",
};

export const ELEARNING_TEACHING_TEST_PARTICIPANTS = {
    LIST: "teachingTestParticipantList",
};

export const ELEARNING_TEACHING_TEST_SUBMISSION = {
    LIST: "teachingTestSubmissionList",
};

export const ELEARNING_TEACHING_RESULT = {
    DETAIL: "elearningTeachingResultDetail",
    PUBLISH: "elearningTeachingResultPublish",
    SUBMISSION_QUESTION: "elearningTeachingSubmissionQuestions"
};

export const ELEARNING_TEACHING_EVALUATION = {
    ADD: "elearningTeachingEvaluationAdd",
};

export const ELEARNING_TEACHING_VOTE = {
    LIST: "elearningTeachingVoteList",
};

export const ELEARNING_TEACHING_CLASS = {
    LIST: "elearningTeachingClassList",
    CLASS_ALL: "getClassAll",
};

export const ELEARNING_CREATING_EXERCISES = {
    LIST: "elearningCreatingExercisesList",
    ADD: "elearningCreatingExercisesAdd",
    EDIT: "elearningCreatingExercisesEdit",
    DELETE: "elearningCreatingExercisesDelete",
    DELETE_ONE: "elearningCreatingExercisesDeleteOne",
    DETAIL: "elearningCreatingExercisesDetail",
    UPDATE: "elearningCreatingExercisesUpdate",
};

export const ELEARNING_CREATING_GENERAL = {
    LIST: "elearningCreatingGeneralList",
    ADD: "elearningCreatingGeneralAdd",
    EDIT: "elearningCreatingGeneralEdit",
    DELETE: "elearningCreatingGeneralDelete",
};

export const ELEARNING_CREATING_SETTING = {
    LIST: "elearningCreatingSettingList",
    ADD: "elearningCreatingSettingAdd",
};

export const ELEARNING_CREATING_LESSONS = {
    LIST: "elearningCreatingLessonsList",
    ADD: "elearningCreatingLessonsAdd",
    EDIT: "elearningCreatingLessonsEdit",
    DELETE: "elearningCreatingLessonsDelete",
    DETAIL: "elearningCreatingLessonsDetail",
};

export const ELEARNING_CREATING_PUBLISH = {
    POST: "elearningCreatingPublishPost",
};

export const ELEARNING_CREATING_QUESTIONS = {
    LIST: "elearningCreatingQuestionsList",
    ADD: "elearningCreatingQuestionsAdd",
    EDIT: "elearningCreatingQuestionsEdit",
    DELETE: "elearningCreatingQuestionsDelete",
};

export const ELEARNING_CREATING_QUESTIONS_OF_BANK = {
    LIST: "elearningQuestionsOfBankList",
    DELETE: "elearningQuestionsOfBankDelete",
    SORT: 'elearningQuestionsOfBankSort',
    UPDATE_SCORE: 'elearningQuestionsOfBankUpdateScore'
}

export const STUDY = {
    ELEARNING: "studyElearningList",
};

export const STUDY_ELEARNING_OLCLASSES = {
    LIST: "studyElearningOlclassesList",
};


export const STUDY_OLCLASS_SESSION = {
    INFO: "studyOlclassSessionInfo",
};

export const SCHOOL_CLASSES = {
    LIST: "schoolClassesList",
    ADD: "schoolClassesAdd",
    EDIT: "schoolClassesEdit",
    DELETE: "schoolClassesDelete",
};

export const SCHOOL_INFO = {
    INFO: "schoolInfo",
    ANNOUNCEMENT: "schoolAnnouncement",
    ANNOUNCEMENT_DETAIL: "schoolAnnouncementDetail",
    LINK_WEB: "schoolLinkWeb",
    LINK_WEB_DETAIL: "schoolLinkWebDetail",
    NEWS: "schoolNews",
    ORG_INTRO: "schoolOrgIntro",
    PROFESSIONS: "schoolProfessions",
    PROFESSIONS_DETAIL: "schoolProfessionsDetail",
    TIMETABLE: "schoolTimeTable",
    TIMETABLE_DETAIL: "schoolTimeTableDetail",
};

export const SCHOOL_ELEARNING = {
    LIST: "schoolElearning",
};

export const SCHOOL_HIGHTLIGHT_ELEARNING = {
    LIST: "schoolHightlightElearning",
};

export const SCHOOL_ORGANIZATION = {
    LIST: "schoolOrganization",
};

export const SCHOOL_PROFESSIONAL = {
    LIST: "schoolProfessionalList",
    ADD: "schoolProfessionalAdd",
    EDIT: "schoolProfessionalEdit",
    DELETE: "schoolProfessionalDelete",
};

export const SCHOOL_STUDENTS = {
    LIST: "schoolStudentsList",
    ADD: "schoolStudentsAdd",
    EDIT: "schoolStudentsEdit",
    DELETE: "schoolStudentsDelete",
};

export const SCHOOL_STAFFS = {
    LIST: "schoolStaffsList",
};

export const SCHOOL_TEACHERS = {
    LIST: "schoolTeachersList",
    ADD: "schoolTeachersAdd",
    EDIT: "schoolTeachersEdit",
    DELETE: "schoolTeachersDelete",
};

export const SCHOOL_NEWS = {
    LIST: "schoolNewsList",
    DETAIL: "schoolNewsDetail",
};

export const SCHOOL_LINK_WEBSITE = {
    LIST: "schoolLinkWebsiteList",
};

export const SCHOOL_SUBJECTS = {
    LIST: "schoolSubjectList",
};

export const SCHOOL_APPLY_SUBJECTS = {
    LIST: "schoolApplySubjectList",
};

export const ELEARNING_STURY = {
    LIST: "elearningStudyList",
    LIST_TIMETABLE: "elearningStudyListTimetable",
};

export const ELEARNING_STURY_OVERVIEW = {
    LIST: "elearningStudyOverviewList",
    TIME_TABLE: "elearningStudyOverviewTimeTable",
    DEADLINE: "elearningStudyOverviewDeadline",
    OVERVIEW_BASE_SERVICE: "overviewBaseService",
    TIME_TABLE_BASE_SERVICE: "timeViewBaseService",
    DEADLINE_BASE_SERVICE: "deadlineBaseService",
};

export const ELEARNING_STUDY_STUDENT = {
    LIST: "elearningStudyStudentList",
};

export const ELEARNING_STURY_FAVOURITE = {
    LIST: "elearningStudyFavouriteList",
    ADD: "elearningStudyFavouriteAdd",
    DELETE: "elearningStudyFavouriteDelete",
};

export const ELEARNING_STURY_VOTE = {
    LIST: "elearningStudyVoteList",
    ADD: "elearningStudyVoteAdd",
};

export const ELEARNING_STURY_ARCHIVE = {
    LIST: "elearningStudyArchiveList",
    ADD: "elearningStudyArchiveAdd",
    DELETE: "elearningStudyArchiveDelete",
};

export const ELEARNING_STUDY_EXERCISE = {
    LIST_QUESTION_START: "elearningSudyExerciseQuestionListStart",
    LIST_QUESTION: "elearningSudyExerciseQuestionList",
    LIST_ELEARNING_EXERCISE: "elearningSudyElearningExerciseList",
    LIST_ELEARNING_EXERCISE_2: "elearningSudyElearningExerciseList2",
    LIST_ELEARNING_EXERCISE_3: "elearningSudyElearningExerciseList3",
    LIST_RESULT: "elearningSudyExerciseResultList",
    LIST_SUBMISTION: "elearningSudyExerciseSubmissionList",
    ADD_SUBMISTION: "elearningSudyExerciseSubmissionAdd",
    UPLOAD_FILE: "elearningSudyExerciseUploadFile",
    SUBMIT_UPLOAD_ANSWER: "elearningStudyExerciseSubmitUploadAnswer",
    GET_DETAIL_EXERCISE: "elearningStudyExerciseGetDetailExercise"
};

export const ELEARNING_STUDY_PROGRESS = {
    LIST: "elearningSudyProgressList",
    LIST_PROGRAM: "elearningSudyProgressProgramList",
};

export const ELEARNING_STUDY_INFO = {
    LIST: "elearningSudyInfoList",
};

export const ELEARNING_STUDY_STATISTIC = {
    LIST: "elearningStudyStatistic",
};

export const ELEARNING_STUDY_OLCLASS_LESSON_SESSIONS = {
    LIST: "elearningStudyOlclassLessonSessionsList",
    ATTENDANCE: "elearningStudyOlclassLessonSessionsAttendance",
};

export const ELEARNING_STUDY_EXERCISE_ELEARNING = {
    LIST: "elearningStudyExerciseElearning",
};

export const ELEARNING_SCHOOL_SUMMARY = {
    LIST: "elearningSchoolSummaryList",
};

export const ELEARNING_SCHOOL_SEARCH = {
    LIST: "elearningSchoolSearchList",
};

export const ELEARNING_SCHOOL_STANDALONE = {
    LIST: "elearningSchoolStandaloneList",
};

export const BANK_EXAM = {
    LIST: "bankExamlist",
    LIST_BANK_QUESTION: "bankQuestionList",
    LIST_QUESTION_TO_BANK: "questionToBankList",
    LIST_EXERCISE: "bankExerciseList",
    DETAIL_EXAM_ESSAY: "bankExamEssayDetail",
    DETAIL_EXAM_CHOISE: "bankExamChoiseDetail",
    DETAIL_EXAM_MIX: "bankExamMixDetail",
    ADD_QUESTION_TO_BANK: "addQuestionToBank",
    ADD_NEW: "bankExamAdd",
    EDIT: "bankExamEdit",
    EDIT_EXAM_NOT_QUESTION: "bankExamNotQuestionEdit",
    EDIT_EXAM_ESSAY: "bankExamEssayEdit",
    EDIT_EXAM_CHOISE: "bankExamChoiseEdit",
    EDIT_EXAM_MIX: "bankExamMixEdit",
    EDIT_POIN_QUESTION_TO_EXAM: "bankExamEditPoinQuestion",
    DELETE: "bankExamDelete",
    DELETE_MULTILE: "bankExamDeleteMultile",
    DETAIL_EXAM: "bankExamDetail",
    DETAIL_EXAM_EDIT: "bankExamDetailEdit",
    DETAIL: "getExamDetail",
    QUESTION_SORT: "questionSort",
    ADD: "addExamTest",
};

export const UPLOAD_EXAM = {
    LIST: "listUploadExam",
    ADD: "addUploadExam",
};

export const BANK_QUESTION = {
    IMPORT: "bankQuestionImport",
    VALID: "bankQuestionValid",
    COMPLETE: "bankQuestionComplete",
    INFO: "bankQuestionInfo",
    DOWNLOAD_SAMPLE: "addUploadExam",
};

export const MESSAGE_GROUP = {
    ADD_MEMBER: "addMember",
    EDIT_AVATAR_GROUP: "editAvatarGroup",
    EDIT_NAME: "editName",
    CREATE_GROUP: "createGroup",
    MEMBER_LIST: "getMemberList",
    GROUP_LIST: "getGroupList",
    GROUP_LEAVE: "groupLeave",
    GROUP_REMOVE_MEMBER: "groupRemoveMember",
    GROUP_NOTIFICATION: "groupNotification",
    MESSAGE_LIST: "getMessageList",
    GROUP_LIST_DETAIL: "getGroupListDetail",
    MESSAGE_SEND_IMG: "messageSendImg",
    LIST_MESSAGE_TYPE: "getListMessageType",
    MESSAGE_SEND_FILE: "messageSendFile",
};

export const SOCIAL_FRIEND = {
    LIST: "socialFriendList",
    // LIST: "socialFriendListInvite",
    INVITE_FRIEND: "inviteFriend",
    LIST_INVITE: "getListInvite",
    DELETE_FRIEND: "deleteFriend",
};

export const SOCIAL_FOLLOW = {
    CREATE_FOLLOW: "createFollow",
    DELETE_FOLLOW: "deleteFollow",
};

export const TEACHING_SUMMARY = {
    INFO: "teachingSummary",
    STATISTIC_REVENUE: "teachingSummaryStatisticRevenue",
};

export const TEACHING_CHART_STATISTIC_REVENUE = {
    INFO: "teachingChartStatisticRevenue",
};

export const TEACHING_CHART_STATISTIC_HIGHLIGHT_ELS = {
    LIST: "teachingChartStatisticHighlightElsList",
};

export const TEACHING_ELEARNINGS = {
    LIST: "teachingElearningsList",
    DELETE: "teachingElearningsDelete",
    HIDE: "teachingElearningsHide",
    OWNER_ELEARNINGS_LIST: "teachingElearningsOfTeacherList"
};
export const TEACHING_ONLINE_CLASS = {
    LIST: "teachingOnlineCLassList",
    DELETE: "teachingOnlineCLassDelete",
};
export const MYTUTOR_OLCLASS = {
    LIST: "onlineClassList",
    LIST_DETAIL: "onlineClassListDetail",
    ADD: "onlineClassAdd",
    EDIT: "onlineClassEdit",
    DELETE: "onlineClassDelete",
};

export const TEACHING_ONLINE_CLASS_MODIFY_SCHEDULE = {
    LIST: "modifyScheduleList",
    LIST_COUTING: "modifyScheduleListCounting",
    LIST_DETAIL: "modifyScheduleListDetail",
    ADD: "modifyScheduleAdd",
    PROCESS: "modifySchedulePeocess",
    EDIT: "modifyScheduleEdit",
    CANCEL: "modifyScheduleCancel",
};
export const TEACHING_INTERACTIVE = {
    LIST: "teachingInteractiveList",
    DELETE: "teachingInteractiveDelete",
};
export const TEACHING_STUDENTS = {
    LIST: "teachingStudentsList",
    DELETE: "teachingStudentsDelete",
};

export const PAYMENT = {
    POST_PAY: "postPay",
    POST_ORDER: "postOder",
    POST_HASHKEY: "postHashKeyGenerate",
    VALIDATE_TRANSACTION: "validateTransaction",
    REPAY: "postRepay",
    CANCEL_PAY: "cancelPay",
};

export const CART = {
    LIST: "cartList",
    ADD: "cartAdd",
    DELETE: "cartDelete",
};

export const TEACHING_STATISTIC_REVENUE = {
    LIST: "teachingStatisticRevenuList",
};

export const ACCOUNT_BANKS = {
    LIST: "accountBanksList",
    ADD: "accountBankAdd",
    EDIT: "accountBankEdit",
    DELETE: "accountBankDelete",
    VALIDATE: "accountBankValidate",
};

export const ACCOUNT_BALANCE = {
    LIST: "accountBalance",
};

export const ACCOUNT_WITHDRAW = {
    ADD: "accountWithdrawAdd",
};

export const PUBLIC_BANK = {
    LIST: "publicBankList",
};

export const TEACHING_ELEARNING_PARTICIPANT = {
    LIST: "teachingElearningList",
};

export const TEACHING_ELEARNING_BANNED = {
    ADD: "teachingElearningBanned",
};

export const TEACHING_STUDENT_PROGRESS = {
    LIST: "teachingStudentProGressList",
};

export const TEACHING_STUDENT_EXERCISES = {
    LIST: "teachingStudentExercisesList",
};

export const TEACHING_ELEARNING_REQUESTS = {
    LIST: "teachingElearningRequestsList",
};

export const TEACHING_ELEARNING_ACCEPT = {
    ADD: "teachingElearningAccept",
};

export const TEACHING_ELEARNING_INVITES = {
    LIST: "teachingElearningInvitesList",
    ADD: "teachingElearningInvitesAdd",
};

export const TEACHING_ELEARNING_STATISTIC = {
    LIST: "teachingElearningStatistic",
};

export const TEACHING_SCHEDULES = {
    DELETE: "teachingSchedulesDelete",
};

export const ACCOUNT_BIOGRAPHY = {
    ADD: "accountBiographyAdd",
};

export const TEACHING_INTERACTIVE_LISTQUESTION = {
    LIST: "teachingInteractiveListquestion",
    ADD: "teachingInteractiveListquestionAdd",
};

export const TEACHING_INTERACTIVE_ANSWER = {
    LIST: "teachingInteractiveListqAnswer",
    ADD: "teachingInteractiveAnswer",
    LIKE: "teachingInteractiveLikeAnswer",
};

export const TEACHING_INTERACTIVE_ANNOUNCEMENT = {
    LIST: "teachingInteractiveListAnnouncement",
};

export const TEACHING_INTERACTIVE_ADD_ANNOUNCEMENT = {
    ADD: "teachingInteractiveAnnouncementAdd",
};

export const TEACHING_INTERACTIVE_DELETE_ANNOUNCEMENT = {
    DELETE: "teachingInteractiveAnnouncementDelete",
};

export const TEACHING_PUBLIC_LIST = {
    LIST: "teachingPublicList",
};

export const PUBLIC_CLASSES = {
    LIST: "publicClassesList",
};

export const TEACHING_STUDENTS_PRIVATE = {
    LIST: "teachingStudentsPrivatesList",
    EXPORT: "teachingStudentsPrivatesExport",
};

export const TEACHING_SCHOOL_STUDENTS = {
    LIST: "teachingSchoolStudents",
};

export const INFO_SUPPORT = {
    ADD: "infoSupport",
};

export const CHAT = {
    ROOM_LIST: "getRoomList",
    MEMBER_LIST: "getMemberList",
    MESSAGE_LIST: "getMessageList",
    ROOM_DETAIL: "getRoomDetail",
    MESSAGE_LIST_INFINITE: "getMessageListInfinite",
    CHANGE_ROOM_NAME: "changeRoomName",
    IMAGE_LIST: "getImageList",
    FILE_LIST: "getFileList",
    ROOM_REMOVE_MEMBER: "roomRemoveMember",
    ROOM_ADD_MEMBER: "roomAddMember",
    UPLOAD_MEDIA: "uploadMedia",
    CHANGE_ROOM_AVATAR: "changeRoomAvatar",
    FRIENDS_LIST: "getFriendsList",
    ROOM_LIST_FETCH: "getRoomListFetch",
    MESSAGE_LIST_FETCH: "getMessageListFetch",
    CREATE_ROOM: "createRoom",
    SEARCH_FRIEND_LIST: "searchFriendList",
    SEARCH_ROOM_LIST: "searchRoomList",
    SEARCH_USER_SOCIAL_LIST: "searchUserSocialList"
};

export const TIMETABLE = {
    TIMETABLE_LIST: "getTimeTableList",
};

export const PUBLIC_GRADES = {
    GRADES_ALL: "getGradeAll",
};

export const SEMESTER = {
    LIST: "getListSemesterExam",
    DETAIL: "getDetailSemesterExam",
    EDIT: "editSemesterExam",
    ADD: "addSemesterExam",
    DELETE: "deleteSemesterExam",
    SETTING_VIEW: "viewSemesterExamSetting",
    SETTING_POST: "postSemesterExamSetting",
    GET_STUDENT_JOIN: "getSemesterExamStudentJoin",
    PUBLISH: "publishStudyExam",
    ENABLE: "enableSemesterExam",
};

export const STUDY_EXAM = {
    LIST: "getListStudyExams",
    DETAIL: "getDetailStudyExam",
    JOIN: "joinStudyExam",
    LIKE: "likeStudyExam",
};

export const STUDY_GROUP = {
    LIST: "getListStudyGroup",
    DETAIL: "getDetailGroup",
    EDIT: "editStudyGroup",
    ADD: "addStudyGroup",
    DELETE: "deleteStudyGroup",
    LIST_GROUP_CLASS: "getListGroupClass",
};

export const STUDY_GROUP_MEMBER = {
    LIST: "getListStudyGroupMember",
    DETAIL: "getDetailGroupMember",
    EDIT: "editStudyGroupMember",
    ADD: "addStudyGroupMember",
    DELETE: "deleteStudyGroupMember",
};

export const SETTING_TEST = {
    LIST: "getSettingTestList",
    ADD: "addSettingTest",
};

export const STUDENT_EXAMS = {
    LIST: "getListStudentExams"
};

export const TEACHING_CLGR_STUDENT = {
    GET_TEACHING_CLGR_STUDENT: "getTeachingClgrStudent",
    EXPORT: "exportTeachingClgrStudent",
};

export const SCHEDULE = {
    GET_SCHEDULE_LIST: "getScheduleList"
}

export const TEACHING_ONLINE_SCHEDULES = {
    LIST: "getTeachingSchedules"
}