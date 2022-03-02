export const ERRORS = {
    LOGIN: {
        REQUIRED: "SCLCOM_0001",
        EMAIL_INVALID: "SCLU_1004",
        USER_LOCKED: "SCLU_1005",
        BAD_CREDEN: "SCLCOM_1000",
        EMAIL_LEFT: "SCLU_1006",
        USER_INACTIVE: "SCLCOM_1003"
    },
    REGISTER: {
        EMAIL_PHONE_USED: "SCLU_1000",
        PASSWORD_LEAST: "SCLU_1001"
    },
    FORGOT_PASSWORD: {
        USER_NOT_FOUND: "SCLCOM_1001"
    },
    UPDATE_PROFILE: { ADDRESS_REQUIRED: "SCLS_00063" },

    SETTING_LINK: {
        ALREADY_ACCOUNT_LINKED: "SCLU_1007",
        CODE_NOT_FOUND: "SCLU_1008"
    },
    EXERCISE: {
        MUST_COMPLETE_ALL_REQUIRED_EXERCISES: "SCLC_0057"
    },

    CHANGE_PWD: {
        INVALID_CURREN_PASS: 'SCLU_1002'
    },

    CHECK_MAIL: {
        BEEN_TAKENS: 409
    },

    CHECK_PHONE: {
        BEEN_TAKENS: 412
    }

};

const DEFAULT_ERROR_MSG = "Có lỗi xảy ra. Vui lòng thử lại."

function translateGeneralCode({ code, message }) {
    return message
    // return `Mã lỗi dùng chung ${code} - ${message}`
}

/**
 * {
 *      CODE_NAME: {
 *          defaultTransTxt: 'vietnamese text',
 *          trans: function_to_translate (optional)
 *      },
 *      ...
 * }
 */
export const HTTP_CODES = {
    200: {
        defaultTransTxt: 'Thành công',
    },
    201: {
        defaultTransTxt: 'Thành công',
    },
}

export const GENERAL_CODES = {
    SCLCOM_UKN: {
        defaultTransTxt: 'Có lỗi xảy ra. Vui lòng thử lại.', // default text
    },
    SCLCOM_000: {
        defaultTransTxt: 'Có lỗi xảy ra. Vui lòng thử lại!',
    },
    SCLCOM_0001: {
        defaultTransTxt: 'Có lỗi xảy ra. Vui lòng thử lại!',
        trans: translateGeneralCode, // action to translate (optional)
    },
    SCLCOM_0002: {
        defaultTransTxt: 'Vui lòng đăng nhập và thử lại',
    },
    SCLCOM_0003: {
        defaultTransTxt: 'Đã có lỗi xảy ra với tệp excel ',
    },
};

export const AUTH_CODES = {
    SCLCOM_1000: {
        defaultTransTxt: 'Đã có lỗi xảy ra, vui lòng kiểm tra lại các thông tin',
    },
    SCLCOM_1001: {
        defaultTransTxt: 'Vui lòng đăng nhập để sử dụng chức năng này.',
    },
    SCLCOM_1002: {
        defaultTransTxt: 'Người dùng đã bị khoá, vui lòng liên hệ với quản trị viên',
    },
    SCLCOM_1003: {
        defaultTransTxt: 'Người dùng không khả dụng, vui lòng liên hệ quản trị viên',
        trans: translateGeneralCode,
    },
};

export const RECAPTCHA_CODES = {
    SCLCOM_2000: {
        defaultTransTxt: 'Có lỗi xảy ra. Vui lòng reload lại trang và thử lại',
    },
    SCLCOM_2001: {
        defaultTransTxt: 'Có lỗi xảy ra. Vui lòng thử lại!',
    },
};

export const PAGINATION_CODES = {
    SCLCOM_3000: {
        defaultTransTxt: 'Có lỗi xảy ra. Vui lòng thử lại!',
    },
    SCLCOM_3001: {
        defaultTransTxt: 'Có lỗi xảy ra. Vui lòng thử lại!',
        trans: translateGeneralCode,
    },
    SCLC_1064: {
        defaultTransTxt: 'Danh mục bài tập không đúng'
    },
    SCLC_1057: {
        defaultTransTxt: 'Bạn cần nhập thời gian làm bài và số lần cho phép làm bài.'
    },
    SCLC_1058: {
        defaultTransTxt: 'Loại bài tập/bài kiểm tra không đúng.'
    },
    SCLC_1064: {
        defaultTransTxt: 'Danh mục bài tập/bài kiểm tra không đúng.'
    },
    SCLC_1065: {
        defaultTransTxt: 'Bạn cần nhập điểm đạt.'
    },
    SCLC_1100: {
        defaultTransTxt: 'Điểm đạt phải lớn hơn x.'
    },
    SCLC_1117:{
        defaultTransTxt: 'Bạn không thể thay đổi danh mục bài tập hoặc bài kiểm tra.'
    },
    SCLC_1176: {
        defaultTransTxt: 'Bạn cần nhập thời gian làm bài và số lần cho phép làm bài.'
    },
    SCLC_1101: {
        defaultTransTxt: 'Thời gian làm tối thiểu phải lớn hơn x.'
    },
    SCLC_1102: {
        defaultTransTxt: 'Số lần làm bài phải lớn hơn x.'
    },
    SCLC_1116: {
        defaultTransTxt: 'Thời gian mở đề không hợp lệ'
    },
    SCLC_1118: {
        defaultTransTxt: 'Thời gian không đúng định dạng.'
    },
    SCLC_1115: {
        defaultTransTxt: 'Vị trí index đã tồn tại trong khóa học/bài giảng'
    },
    SCLC_1060: {
        defaultTransTxt: 'Vị trí index của bài tập đã tồn tại trong bài học'
    },
    
};

export const CREATE_ANSWERS = {
    SCLC_1072: {
        defaultTransTxt: 'Bạn không thể tạo chương cho bài giảng.',
    },
};


export const CREATE_GENERAL = {
    SCLC_1067: {
        defaultTransTxt: 'Bạn không thể thay đổi loại hình học tập.',
    },

    SCLC_1043: {
        defaultTransTxt: 'Bạn không thể sửa bài giảng/khóa học này.',
    },
    SCLC_1066: {
        defaultTransTxt: 'Lợi ích bài giảng/khóa học không đúng định dạng.',
    },
    SCLC_1029:{
        defaultTransTxt: 'Không tìm thấy cấp học này.'
    }
};

export const CREATE_LESSION = {
    SCLC_1094: {
        defaultTransTxt: 'Bài giảng/khóa học đã được phê duyệt, bạn không có quyền chỉnh sửa.',
    },

    SCLC_1044: {
        defaultTransTxt: 'Bài học không đúng định dạng cho phép.',
    },
    SCLC_1048: {
        defaultTransTxt: 'Chương này không thuộc khóa học.',
    },
    SCLC_1042:{
        defaultTransTxt: 'Khóa học/bài giảng chưa đúng quy định.'
    },
    SCLC_1047:{
        defaultTransTxt: 'Yêu cầu tạo bài giảng không nằm trong chương'
    },
    SCLC_1046:{
        defaultTransTxt: 'Một bài giảng chỉ có một bài học duy nhất.'
    },
    SCLC_1049:{
        defaultTransTxt: 'Thứ tự index bài học đã tồn tại trong chương.'
    },
    SCLC_1050:{
        defaultTransTxt: 'Tên bài học đã tồn tại.'
    },
    SCLC_1051:{
        defaultTransTxt: 'Bài giảng không cho phép nhập thứ tự index.'
    },
    SCLC_1177:{
        defaultTransTxt: 'Yêu cầu định dạng SCORM.'
    },
    SCLC_1054:{
        defaultTransTxt: 'Đường dẫn tệp tin không đúng.'
    },
    SCLC_0039:{
        defaultTransTxt: 'Tên bài học đã tồn tại.'
    }
};

export const CREATE_POINT_CALCULATION = {
    SCLC_1073: {
        defaultTransTxt: 'Chỉ cho phép xuất bản Bài giảng/khóa học ở trạng thái PENDING.',
    },
    SCLC_1068: {
        defaultTransTxt: 'Bạn cần hoàn thành nội dung Thông tin chung để xuất bản bài giảng/khóa học này.',
    },
    SCLC_1069: {
        defaultTransTxt: 'Bạn cần hoàn thành Nội dung học tập để xuất bản bài giảng/khóa học này.',
    },
    SCLC_1070: {
        defaultTransTxt: 'Bạn cần hoàn thành các thông số cài đặt để xuất bản bài giảng/khóa học này.',
    },
    SCLC_1104: {
        defaultTransTxt: 'Bạn cần hoàn thành nội dung bài tập để xuất bản bài giảng/khóa học này.',
    },
    SCLC_1105: {
        defaultTransTxt: 'Bạn cần hoàn thành nội dung bài kiểm tra để xuất bản bài giảng/khóa học này.',
    },
    SCLC_1071: {
        defaultTransTxt: 'Bài giảng/khóa học đã được xuất bản trước đó.',
    },
};

export const CREATE_QUETIONS= {
    SCLC_1075: {
        defaultTransTxt: 'Bạn cần nhập điểm cho câu hỏi.',
    },
    SCLC_1077: {
        defaultTransTxt: 'Tổng điểm các câu hỏi không được vượt quá 10.',
    },
    SCLC_1078: {
        defaultTransTxt: 'Bạn cần nhập câu trả lời cho câu hỏi.',
    },
    SCLC_1074: {
        defaultTransTxt: 'Thứ tự index yêu cầu tối thiểu là 1.',
    },
    SCLC_1076: {
        defaultTransTxt: 'Điểm phải lớn hơn 0.',
    },
    SCLC_1084: {
        defaultTransTxt: 'Bạn chỉ được nhập một đáp án trong câu hỏi tự luận.',
    },
    
    SCLC_1081: {
        defaultTransTxt: 'Bạn cần nhập nội dung câu trả lời.',
    },
    SCLC_1080: {
        defaultTransTxt: 'Bạn cần nhập đáp án cho câu hỏi.',
    },
    SCLC_1085: {
        defaultTransTxt: 'Yêu cầu không nhập thứ tự index trong câu trả lời',
    },
    SCLC_1082: {
        defaultTransTxt: 'Bạn cần nhập đáp án đúng cho câu hỏi.',
    },
    SCLC_1083: {
        defaultTransTxt: 'Chỉ có một đáp án đúng trong câu hỏi trắc nghiệm một lựa chọn.',
    },
    SCLC_1103: {
        defaultTransTxt: 'Số lượng đáp an vượt quá số lượng cho phép.',
    },
    SCLC_1106: {
        defaultTransTxt: 'Bạn cần nhập tối thiểu 2 đáp án cho câu hỏi trắc nghiệm.',
    },
    SCLC_0023: {
        defaultTransTxt: 'Thứ tự câu hỏi đã tồn tại trong bài tập',
    },
    SCLC_1329: {
        defaultTransTxt: 'Đáp án không đúng định dạng . Yêu cầu định dạng json',
    },
    SCLC_1328: {
        defaultTransTxt: 'Bạn cần nhập tài liệu hoặc ảnh cho câu hỏi.',
    },
};


export const ELEARNING_CODES = {
    SCLC_001: {
        defaultTransTxt: 'Không tìm thấy e-learning hoặc không có quyền sử dụng chức năng này.',
    },
    SCLC_002: {
        defaultTransTxt: 'Không tìm thấy môn học này',
    },
    SCLC_003: {
        defaultTransTxt: 'Level không tồn tại',
    },
    SCLC_004: {
        defaultTransTxt: 'Khóa học/bài giảng chưa đúng quy định.',
    },
    //----------------------------------------------
    SCLC_006: {
        defaultTransTxt: 'Có lỗi xảy ra. Vui lòng thử lại!',
    },
    SCLC_007: {
        defaultTransTxt: 'Chương không tồn tại hoặc ko có quyền truy cập.',
    },
    SCLC_008: {
        defaultTransTxt: 'Có lỗi xảy ra. Vui lòng thử lại!',
    },
    SCLC_009: {
        defaultTransTxt: 'Bài học không tồn tại hoặc bạn k có quyền truy cập',
    },
    SCLC_0010: {
        defaultTransTxt: 'Tệp tin không đúng định dạng.',
    },
    SCLC_0011: {
        defaultTransTxt: 'Tài liệu tải lên không đúng định dạng.',
    },
    SCLC_0012: {
        defaultTransTxt: 'Tải tệp không thành công',
    },
    SCLC_0013: {
        defaultTransTxt: 'Không tìm thấy bài học hoặc không có quyền sử dụng chức năng này.',
    },
    SCLC_0014: {
        defaultTransTxt: 'Bạn không có quyền sử dụng chức năng này.',
    },
    SCLC_0015: {
        defaultTransTxt: 'Bài tập không tồn tại hoặc bạn không có quyền truy cập ',
    },
    SCLC_0016: {
        defaultTransTxt: 'Không tìm thấy câu hỏi hoặc không có quyền sử dụng chức năng này.',
    },
    SCLC_0017: {
        defaultTransTxt: 'Loại câu hỏi không đúng',
    },
    SCLC_0018: {
        defaultTransTxt: 'Yêu cầu không đúng, vui lòng kiểm tra lại thông tin ',
    },
    SCLC_0019: {
        defaultTransTxt: 'Câu trả lời không tồn tại hoặc không có quyền truy cập',
    },
    SCLC_0020: {
        defaultTransTxt: 'Số thứ tự câu trả lời đã tồn tại',
    },
    SCLC_0021: {
        defaultTransTxt: 'Câu hỏi có câu trả lời đúng tồn tại',
    },
    SCLC_0024: {
        defaultTransTxt: 'Chương này đã tồn tại.',
    },
    SCLC_0025: {
        defaultTransTxt: 'Tên chương bạn vừa điền đã tồn tại.',
    },
    SCLC_0026: {
        defaultTransTxt: 'Tên tài liệu đã tồn tại',
    },
    SCLC_0027: {
        defaultTransTxt: 'Tên bài tập đã tổn tại',
    },
    //----------------------------------------------
    SCLC_1052: {
        defaultTransTxt: "Yêu cầu nhập tệp tài liệu hoặc mã tài liệu"
    },

    SCLC_1053: {
        defaultTransTxt: "Tài liệu tải lên không đúng định dạng."
    },

    SCLC_1054: {
        defaultTransTxt: "Mã tệp tài liệu không đúng."
    },

    SCLC_1166: {
        defaultTransTxt: "Tài liệu tải lên vượt quá dung lượng cho phép."
    },

    SCLC_1167: {
        defaultTransTxt: "Số tài liệu tải lên vượt quá số lượng cho phép."
    },

    SCLC_1055: {
        defaultTransTxt: "Vui lòng kiểm tra lại tài liệu tải lên."
    },

    //----------------------------------------------
    SCLC_1116: {
        defaultTransTxt: 'Thời gian mở đề không hợp lệ',
    },
    //----------------------------------------------
    SCLC_1160: {
        defaultTransTxt: 'Tệp dữ liệu đã tồn tại trên hệ thống! Vui lòng tải tệp khác.',
    }
};

export const CREATE_SETTING = {
    SCLC_1154: {
        defaultTransTxt: 'Bài giảng/khóa học này đã xuất bản, bạn không thể chỉnh sửa.',
    },
    SCLC_1155: {
        defaultTransTxt: 'Bạn cần nhập giá bán.',
    },
    SCLC_0022: {
        defaultTransTxt: 'Giá bán tối thiểu là 10,000 VNĐ.',
    },
    SCLC_1093: {
        defaultTransTxt: 'Chế độ hiển thị bài giảng/khóa học không đúng.',
    },
    SCLC_1092: {
        defaultTransTxt: 'Chế độ hiển thị bài giảng/khóa học không đúng.',
    },
    SCLC_1200: {
        defaultTransTxt: 'Trợ giúp không tìm thấy',
    },
    SCLC_1201: {
        defaultTransTxt: 'Bạn đã gửi feedback cho trọ giúp này',
    },
    SCLC_1230: {
        defaultTransTxt: 'Bản tin không tìm thấy',
    },
    SCLC_1231: {
        defaultTransTxt: 'Thông báo không tìm thấy',
    },
    SCLC_1232: {
        defaultTransTxt: 'Giới thiệu không tìm thấy',
    },
    SCLC_1233: {
        defaultTransTxt: 'Web liên kết không tìm thấy',
    },
    SCLC_1234: {
        defaultTransTxt: 'Thời khóa biểu không tìm thấy',
    },
    SCLC_1235: {
        defaultTransTxt: 'Thời gian bắt đầu đã được cài đặt trước đó.',
    },
    SCLC_1236: {
        defaultTransTxt: 'Thời gian bắt đầu đã được cài đặt trước đó.',
    },
    SCLC_1237: {
        defaultTransTxt: 'Thời gian kết thúc đã được cài đặt trước đó.',
    },
    SCLC_1238: {
        defaultTransTxt: 'Thời gian kết thúc đã được cài đặt trước đó.',
    },
};

export const CREATE_TEST = {
    SCLC_1178: {
        defaultTransTxt: 'Bài kiểm tra không đúng danh mục',
    },
    SCLC_1180: {
        defaultTransTxt: 'Yêu cầu cho phép thời gian mở đề',
    },
    SCLC_1179: {
        defaultTransTxt: 'Thời gian đóng đề không đúng định dạng',
    },
    SCLC_1181: {
        defaultTransTxt: 'Yêu cầu cho phép thời gian đóng đề',
    },
    SCLC_1182: {
        defaultTransTxt: 'Thời gian đóng đề yêu cầu lớn hơn thơi gian mở đề',
    },
    SCLC_1183: {
        defaultTransTxt: 'Yêu cầu thời gian mở đề',
    },
    SCLC_1184: {
        defaultTransTxt: 'Yêu cầu thời gian đóng đề',
    },
    SCLC_1185: {
        defaultTransTxt: 'Thời gian mở đề không hợp lệ',
    },
    SCLC_1186: {
        defaultTransTxt: 'Thời gian đóng đề không hợp lệ',
    },
    SCLC_1187: {
        defaultTransTxt: 'Yêu cầu lựa chọn hệ số hoặc trọng số',
    },
    SCLC_1188: {
        defaultTransTxt: 'Bài kiểm tra chỉ cho phép hoặc hệ số hoặc trọng số',
    },
    SCLC_1189: {
        defaultTransTxt: 'Hệ số không đúng định dạng.',
    },
    SCLC_1190: {
        defaultTransTxt: 'Trọng số không đúng định dạng.',
    },
    SCLC_1191: {
        defaultTransTxt: 'Trọng số vượt quá giới hạn cho phép',
    },
    SCLC_1192: {
        defaultTransTxt: 'Bạn đã cài đặt trọng số cho bài kiểm tra này . Không cho phép cài đặt điểm hệ số',
    },
    SCLC_1193: {
        defaultTransTxt: 'Bạn đã cài đặt hệ số cho bài kiểm tra này . Không cho phép cài đặt trọng số',
    },
    SCLC_1194: {
        defaultTransTxt: 'Không cho phép thay đổi thời gian mở đề,  thời gian đóng đề, trọng số hoặc hệ số',
    },
    SCLC_1195: {
        defaultTransTxt: 'Không cho phép thay đổi danh mục ',
    },
    SCLC_1196: {
        defaultTransTxt: 'Thời gian mở đề/ đóng đề hoặc thời gian làm bài kiểm tra không hợp lệ',
    },

    SCLC_1163: {
        defaultTransTxt: 'Bài giảng/khóa học ở trạng thái không được phép tham gia',
    },

    SCLC_1161: {
        defaultTransTxt: 'Chỉ cho phép tham gia các khóa học miễn phí',
    },
    SCLC_1162: {
        defaultTransTxt: 'Không cho phép tham gia khóa học/bài giảng của chính bạn',
    },
    SCLC_1096: {
        defaultTransTxt: 'Bạn không có quyền truy cập',
    },
    SCLC_1245: {
        defaultTransTxt: 'Không cho phép tham gia khóa học bởi vì khóa học chưa bắt đầu',
    },
    SCLC_2020: {
        defaultTransTxt: 'Yêu cầu của bạn đã được gửi đi.',
    },
    SCLC_1031: {
        defaultTransTxt: 'Không tìm thấy học sinh hoặc đã bị xoá',
    },
    SCLC_2018: {
        defaultTransTxt: 'Không tìm thấy người dùng',
    },

    SCLC_1033: {
        defaultTransTxt: 'Giáo viên không tồn tại',
    },

    SCLC_1063: {
        defaultTransTxt: 'Bạn không có quyền truy cập',
    },

    SCLC_1062: {
        defaultTransTxt: 'Không thể lưu trữ khóa học.  Bạn không có quyền hoặc chưa tham gia học khóa này',
    },

    SCLC_1114: {
        defaultTransTxt: 'Bạn đã yêu thích khóa học này trước đó',
    },
    SCLC_1112: {
        defaultTransTxt: 'Bạn không thể bỏ yêu thích vì bạn không có quyền truy cập khóa học này',
    },
    SCLC_1245: {
        defaultTransTxt: 'Bài giảng/khóa học chưa bắt đầu',
    },
    SCLC_0057: {
        defaultTransTxt: 'Chưa hoàn thành các bài tập bắt buộc trong bài học',
    },
    SCLC_1165: {
        defaultTransTxt: 'Không cho phép đánh giá khóa học của chính mình',
    },
    SCLC_0037: {
        defaultTransTxt: 'Bạn đã đánh giá khóa học này trước đó',
    },
    SCLC_2030: {
        defaultTransTxt: 'Bình luận trong kỳ thi không tồn tại',
    },

    SLCL_1501: {
        defaultTransTxt: 'Kì thi không tồn tại hoặc bạn không có quyền truy cập',
    },
    SLCL_1507: {
        defaultTransTxt: 'Kì thi đã được xuất bản , bạn không được quyên thay đổi hoặc xóa',
    },
    SLCL_1528: {
        defaultTransTxt: 'Kì thi chưa xuất bản . Bạn không được phép tham gia',
    },
    SLCL_1522: {
        defaultTransTxt: 'Kì thi này yêu cầu có phí bạn phải mua mới tham gia được',
    },
    SLCL_1503: {
        defaultTransTxt: 'Kì thi này chưa được cấp quyền cho lớp hoặc nhóm',
    },
    SLCL_1523: {
        defaultTransTxt: 'Không thể nhận diện lớp hoặc nhóm',
    },
    SLCL_1525: {
        defaultTransTxt: 'Bạn không được phép tham gia. Vì bạn không thuộc nhóm học tập được chỉ định cho kì thi này ',
    },
    SLCL_1524: {
        defaultTransTxt: 'Bạn không được phép tham gia. Vì bạn không thuộc lớp được chỉ định cho kì thi này',
    },
    
};

export const STUDY_EXERCISE_START = {
    SCLC_0058: {
        defaultTransTxt: 'Bạn đã hết lượt làm bài tập/ bài kiểm tra này',
    },
    SCLC_0059: {
        defaultTransTxt: 'Bài tập đang chờ chấm hoặc đã pass',
    },
    SCLC_0063: {
        defaultTransTxt: 'Bài tập chưa đến giờ mở đề',
    },
    SCLC_0064: {
        defaultTransTxt: 'Bài tập đã quá thời gian làm bài',
    },
    SCLC_1245: {
        defaultTransTxt: 'Bài giảng/khóa học chưa bắt đầu',
    },
    SCLC_1250: {
        defaultTransTxt: 'Bài giảng/khóa học đã kết thúc',
    },
    SCLC_0065: {
        defaultTransTxt: 'Thời gian làm bài vượt quá thời gian làm bài cho phép',
    },

    SCLC_1095: {
        defaultTransTxt: 'Thông báo không tồn tại hoặc bạn không có quyền truy cập',
    },
    SCLC_1091: {
        defaultTransTxt: 'Câu hỏi không tồn tại hoặc bạn không có quyền truy cập',
    },
    SCLC_1248: {
        defaultTransTxt: 'Câu trả lời không tồn tại hoặc bạn không có quyền truy cập',
    },
    SCLC_1249: {
        defaultTransTxt: 'Câu trả lời yêu cầu nhập nội dung hoặc ảnh',
    },
    SCLC_1123: {
        defaultTransTxt: 'Yêu câp nhập ảnh',
    },
    SCLC_1246: {
        defaultTransTxt: 'Không cho phép thay đổi nội dung câu hỏi vì đã có người trả lời',
    },
};

export const TEACHER = {
    SCLC_2006: {
        defaultTransTxt: 'Năm học không tồn tại',
    },
    SLCL_1520: {
        defaultTransTxt: 'Mã giáo viên không cho phép null',
    },
    SLCL_1516: {
        defaultTransTxt: 'Không thể dừng hoặc khôi phục kì thi',
    },
    SCLC_1361: {
        defaultTransTxt: 'Nhóm học tập không tồn tại hoặc bạn không có quyền truy cập',
    },
    SLCL_1508: {
        defaultTransTxt: 'Không thể yêu cầu xuất bản kì thi do tạo kì thi chưa hoàn tất',
    },
    SLCL_1509: {
        defaultTransTxt: 'Không thể yêu cầu xuất bản kì thi do cài đặt kì thi chưa hoàn tất',
    },
    SLCL_1510: {
        defaultTransTxt: 'Không thể yêu cầu xuất bản kì thi do một số đề thi chưa hợp lệ :',
    },
    SLCL_1511: {
        defaultTransTxt: 'Yêu cầu ít nhất một đề thi hợp lệ trong kì thi',
    },
    SLCL_1500: {
        defaultTransTxt: 'Danh sach môn học không đúng định dạng  . Yêu cầu định dạng json',
    },
    SCLC_1360: {
        defaultTransTxt: 'Tên nhóm đã tồn tại',
    },
    SCLC_1362: {
        defaultTransTxt: 'Không thể thêm thành viên vào group, bởi vì một số học sinh không tồn tại',
    },
    SCLC_1363: {
        defaultTransTxt: 'Không có học sinh nào hợp lệ để thêm vào group',
    },
    SCLC_1364: {
        defaultTransTxt: 'Thành viên cảu nhóm học tập không tồn tại',
    },
    SCLC_1365: {
        defaultTransTxt: 'Không thể xóa học sinh trong nhóm, bởi vì một số học sinh không tồn tại',
    },
    SCLC_1372: {
        defaultTransTxt: 'Loại parent chưa được hỗ trợ. Hệ thống đang hỗ trọ : bank, test',
    },
    SCLC_1373: {
        defaultTransTxt: 'Phương thức tạo ngân hàng câu hỏi chưa hỗ trọ. Hệ thống đang hỗ trợ: MANUAL, IMPORT',
    },
    SCLC_1374: {
        defaultTransTxt: 'Danh mục câu hỏi chưa hỗ trợ. Hệ thống đang hỗ trợ: CHOICE | ESSAY',
    },
    SCLC_1375: {
        defaultTransTxt: 'Độ khó câu hỏi chưa được hỗ trợ. Hệ thống đang hỗ trợ: EASY | MEDIUM| HARD',
    },
    SCLC_1376: {
        defaultTransTxt: 'Loại câu hỏi chưa được hỗ trợ. Hệ thống đang hỗ trợ: ESSAY | SINGLE_CHOICE | MULTIPLE_CHOICE | WORD_CHOICE | WORD_MATCH | YES_NO | FILL_IN_BLANK',
    },
    SCLC_1370: {
        defaultTransTxt: 'Không tìm thấy ngân hàng câu hỏi',
    },

    SCLC_1371: {
        defaultTransTxt: 'Loại ngân hàng câu hỏi chưa được hỗ trợ. Hệ thống đang hỗ trợ: ESSAY | SINGLE_CHOICE | MULTIPLE_CHOICE | WORD_CHOICE | WORD_MATCH | YES_NO | FILL_IN_BLANK',
    },
    SCLC_0028: {
        defaultTransTxt: 'Phòng học online không tồn tại',
    },
    SCLC_1089: {
        defaultTransTxt: 'Kho học liệu không tồn tại hoặc không có quyền truy cập',
    },
    SCLC_1086: {
        defaultTransTxt: 'Dung lượng kho học liệu đã bị khóa , vui lòng liên hệ quản trị viên để mở khóa',
    },
    SCLC_1087: {
        defaultTransTxt: 'Dung lượng kho học liệu vượt quá giới hạn . Vui lòng liên hệ quản trị viên để mở khóa',
    },
    SCLC_1088: {
        defaultTransTxt: 'Dung lượng chưa được cấp phát. Vui lòng liên hệ admin để mở khóa',
    },
    SCLC_0041: {
        defaultTransTxt: 'Không thể xóa tệp tin. Do bạn không có quyền truy cập hoặc tệp tin không tồn tại',
    },

    SCLC_0052: {
        defaultTransTxt: 'Giáo viên phải chọn điểm số khi chấm bài',
    },
    SCLC_0053: {
        defaultTransTxt: 'Điểm số không hợp lệ',
    },
    SCLC_0054: {
        defaultTransTxt: 'Bài tập đã được chấm điềm',
    },
    SCLC_0055: {
        defaultTransTxt: 'Học sinh làm bài không tồn tại ',
    },
    SCLC_0056: {
        defaultTransTxt: 'Học sinh chưa nộp bài tập ',
    },
    SLCL_1531: {
        defaultTransTxt: 'Không có bản ghi nào để xuất bản tập tin',
    },
    SLCL_1530: {
        defaultTransTxt: 'Có lỗi trong quá trình xuất bản tập tin . Vui lòng thử lại ',
    },
    SCLC_0128: {
        defaultTransTxt: 'Không tìm thấy lớp học online',
    },
    SCLC_0129: {
        defaultTransTxt: 'Lớp học online cần ít nhất 1 lịch học',
    },
    SCLC_0130: {
        defaultTransTxt: 'Loại tìm kiếm không tồn tại',
    },
    SCLC_0131: {
        defaultTransTxt: 'Không tìm thấy lời mời tham gia lớp học online',
    },
    SCLC_0132: {
        defaultTransTxt: 'Không tìm thấy buổi học',
    },
    SCLC_0133: {
        defaultTransTxt: 'Không tìm thấy trạng thái điểm danh của user',
    },
    SCLC_0134: {
        defaultTransTxt: 'Buổi học đã tồn tại',
    },
    SCLC_0135: {
        defaultTransTxt: 'Đã có lỗi xảy ra với phần mềm zoom. Vui lòng thử lại',
    },
    SCLC_0136: {
        defaultTransTxt: 'Không tìm thấy tiết học',
    },
    SCLC_0137: {
        defaultTransTxt: 'Không tạo được buổi học online vào thời gian này, tất cả các email host đều đang được sử dụng',
    },
    SCLC_0138: {
        defaultTransTxt: 'Học sinh đã bị chặn',
    },
    SCLC_0139: {
        defaultTransTxt: 'Không thể bỏ chặn học sinh. Học sinh này chưa bị chặn',
    },
    SCLC_0140: {
        defaultTransTxt: 'Phòng học đang online, không thể cập nhật',
    },
    SCLC_0141: {
        defaultTransTxt: 'Bạn cần được mời để nhìn được lịch học',
    },
    SCLC_0142: {
        defaultTransTxt: 'Trùng lịch học, kiểm tra lại lịch hợp lệ',
    },
    SCLC_0143: {
        defaultTransTxt: 'Không tìm thấy bất kỳ buổi học online nào',
    },
    SCLC_0144: {
        defaultTransTxt: 'Bạn cần thêm ít nhất 1 học sinh để gửi lời mời',
    },
    SCLC_0145: {
        defaultTransTxt: 'Mỗi bài giảng có nhiều nhất 1 lớp học online',
    },
    SCLC_0146: {
        defaultTransTxt: 'Phòng học đang online, không thể update buổi học',
    },
    SCLC_0147: {
        defaultTransTxt: 'Buổi học đã kết thúc, không thể cập nhật',
    },
    SCLC_0148: {
        defaultTransTxt: 'Phòng học đang online, không thể cập nhật buổi học',
    },
    SCLC_0149: {
        defaultTransTxt: 'Bạn cần tham gia vào bài giản trước đó',
    },
    SCLC_0150: {
        defaultTransTxt: 'Học sinh chưa được mời vào lớp học',
    },
    SCLC_0151: {
        defaultTransTxt: 'Quá thời gian điểm danh',
    },

    SCLC_0152: {
        defaultTransTxt: 'Bạn đã điểm danh trước đó',
    },
    SCLC_0153: {
        defaultTransTxt: 'Lịch học phải có thời gian lớn hơn thời gian hiện tại',
    },
    SCLC_0154: {
        defaultTransTxt: 'Lịch học này không ứng với bất kỳ buổi học nào',
    },
    SCLC_0155: {
        defaultTransTxt: 'Không hỗ trợ loại type để xem thời khóa biểu',
    },

    SCLC_0156: {
        defaultTransTxt: 'Thời gian kết thúc của phòng học online không được vượt quá thời gian kết thúc của bài giảng/khóa học',
    },
    SCLC_0042: {
        defaultTransTxt: 'Bạn đã tham gia bài giảng/khóa học này trước đó',
    },
    SCLC_0043: {
        defaultTransTxt: 'Bạn chưa có bất kỳ item nào trong giỏ hàng. THêm ít nhất 1 item vào giỏ',
    },

    SCLC_0044: {
        defaultTransTxt: 'Bài giảng/ khoá học chưa được thêm vào giỏ trước đỏ hoặc đã bị xóa',
    },
    SCLC_0045: {
        defaultTransTxt: 'Elearning đã được thêm vào giở hoặc đã được mua',
    },
    SCLC_0046: {
        defaultTransTxt: 'Hóa đơn không tìm thấy hoặc đã bị xóa',
    },
    SCLC_0047: {
        defaultTransTxt: 'Elearning đã được thêm vào giỏ hoặc bị mua',
    },

    SCLC_0048: {
        defaultTransTxt: 'Một vài item chưa được thêm vào giỏ trước đó',
    },
    SCLC_0049: {
        defaultTransTxt: 'Yêu cầu thanh toán không đúng',
    },
    SCLC_0050: {
        defaultTransTxt: 'Elearning đã được mua trước đó',
    },
    SCLC_0051: {
        defaultTransTxt: 'Hóa đơn đã được thanh toán',
    },
    SCLC_0060: {
        defaultTransTxt: 'Giỏ hàng trống. ',
    },
    SCLC_0061: {
        defaultTransTxt: 'Bài giảng đã bị ẩn, không thể thêm vào giỏ',
    },
    SCLC_0062: {
        defaultTransTxt: 'Không thể mua bài giảng của bạn',
    },
    SCLC_1119: {
        defaultTransTxt: 'Loại thanh toán không được hỗ trợ',
    },
    SCLC_1120: {
        defaultTransTxt: 'Yêu cầu thanh toán không đúng',
    },
    SCLC_1121: {
        defaultTransTxt: 'Giao dịch không được tìm thấy',
    },
    SCLC_1122: {
        defaultTransTxt: 'Yêu cầu thanh toán không đúng',
    },
    SCLC_1124: {
        defaultTransTxt: 'Không thể cập nhật ví của giáo viên',
    },
    SCLC_1125: {
        defaultTransTxt: 'Không thể cập nhật trạng thái giao dịch',
    },
    SCLC_1126: {
        defaultTransTxt: 'Không có quyền tìm kiểm dữ liệu của trường học',
    },
    SCLC_1129: {
        defaultTransTxt: 'Không thể thêm hoặc sửa lớp học online của bài giảng/ khoá học bị ẩn',
    },
    SCLC_1130: {
        defaultTransTxt: 'THông báo đã bị xóa',
    },
    SCLC_1131: {
        defaultTransTxt: 'Loại file yêu cầu: image, doc',
    },
    SCLC_1132: {
        defaultTransTxt: 'Loại file yêu cầu: image, doc',
    },
    SCLC_1133: {
        defaultTransTxt: 'Loại file yêu cầu: image',
    },
    SCLC_1134: {
        defaultTransTxt: 'Loại file yêu cầu: image',
    },
    SCLC_1135: {
        defaultTransTxt: 'Loại file yêu cầu: image, doc',
    },
    SCLC_1136: {
        defaultTransTxt: 'Loại file yêu cầu: image',
    },
    SCLC_1137: {
        defaultTransTxt: 'Loại file yêu cầu: image',
    },
    SCLC_1138: {
        defaultTransTxt: 'Loại file yêu cầu: image, doc',
    },
    SCLC_1139: {
        defaultTransTxt: 'Loại file yêu cầu: image, doc',
    },
    SCLC_1150: {
        defaultTransTxt: 'Không có bất kỳ service user-service nào được đăng ký',
    },
    SCLC_1151: {
        defaultTransTxt: 'Đã có lỗi xảy ra, vui lòng thử lại sau ',
    },
    SCLC_1152: {
        defaultTransTxt: 'Giao dịch đã thành công, không thể cập nhật',
    },
    SCLC_1153: {
        defaultTransTxt: 'Giao dịch thất bại, không thể cập nhật',
    },
    SCLC_1156: {
        defaultTransTxt: 'Giao dịch đã bị hủy, không thể cập nhật',
    },
    SCLC_1157: {
        defaultTransTxt: 'Hóa đơn đã bị hủy, không thể hủy hoặc thanh toán lại',
    },
    SCLC_1158: {
        defaultTransTxt: 'Hóa đơn đã được thanh toán, không thể hủy hoặc thanh toán lại',
    },
    SCLC_1159: {
        defaultTransTxt: 'Hóa đơn đã thanh toán thất bại trước đó, không thể hủy hoặc thanh toán lại',
    },
    SCLC_1168: {
        defaultTransTxt: 'Cần nhập nội dung note khi huỷ thanh toán',
    },
    
};

export const ALL_CODES = {
    ...HTTP_CODES,
    ...GENERAL_CODES,
    ...AUTH_CODES,
    ...RECAPTCHA_CODES,
    ...PAGINATION_CODES,
    ...ELEARNING_CODES,
    ...CREATE_ANSWERS,
    ...CREATE_GENERAL,
    ...CREATE_LESSION,
    ...CREATE_QUETIONS,
    ...CREATE_SETTING,
    ...CREATE_TEST,
    ...STUDY_EXERCISE_START,
    ...TEACHER
};

/**
 * Translate API_CODE => VIETNAMESE TEXT
 *  
 */
export function translateCode2Txt({ code, message }) {
    const tmpCode = ALL_CODES[code] || false;
    if (tmpCode) {
        if (tmpCode.trans && (typeof tmpCode.trans == 'function')) {
            return tmpCode.trans({ code, message });
        } else {
            return tmpCode.defaultTransTxt || message;
        }
    }
    // console.log('[Undefined Error Code] ', code);
    return message;
}