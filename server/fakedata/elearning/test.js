import { EXERCISES, EXERCISE_DETAIL, RESULTS } from "./exercise"
import { SCHEDULES } from "./classroom"


export const LESSON = {
    avatar: "https://picsum.photos/32/32",
    author: "Nguyễn Ngọc Quyên",
    views: 28751,
    stars: 4.5,
    rates: 469,
    price: 0
}

export const AUTH = {
    id: "1",
    name: "Savannah Mckinney",
    avatar: "https://picsum.photos/125/125"
}

export const COMMENTS = [
    {
        id: 1,
        avatar: "https://picsum.photos/60/60",
        name: "Ngọc Quyên",
        content:
            "Từ Bố ơi mình đi đâu thế? đã siêu thích chú Xuân Bắc và bé Bi Béo rồi. Cu Bi lớn rồi, nhưng vẫn mập mạp và rất đáng yêu.",
        time: "20/11/2022",
        likes: 100,
        liked: true,
        parent: true,
        parentId: ""
    },
    {
        id: 2,
        avatar: "https://picsum.photos/55/55",
        name: "Nguyễn Ngọc",
        content:
            "Bố ơi mình đi đâu thế? đã siêu thích chú Xuân Bắc và bé Bi Béo rồi. Cu Bi lớn rồi, nhưng vẫn mập mạp và rất đáng yêu.",
        time: "20/11/2022",
        likes: 100,
        liked: true,
        parent: true,
        parentId: ""
    }
]

export const COURSE_LESSON = [
    {
        id: 1,
        name: "Chương 1: Các bài học chương 1",
        status: "2/5",
        times: "1 giờ 18 phút",
        lessons: [
            {
                id: 1,
                name: "LÀM THẾ NÀO ĐỂ TRỞ THÀNH MỘT VLOGGER YOUTUBER",
                done: true,
                time: "1 giờ 30 phút",
                wait: false
            },
            {
                id: 2,
                name: "LÀM THẾ NÀO ĐỂ TRỞ THÀNH MỘT VLOGGER YOUTUBER",
                done: false,
                time: "1 giờ 30 phút"
            },
            {
                id: 3,
                name: "LÀM THẾ NÀO ĐỂ TRỞ THÀNH MỘT VLOGGER YOUTUBER",
                done: true,
                time: "1 giờ 30 phút"
            }
        ]
    },
    {
        id: 2,
        name: "Chương 1: Các bài học chương 1",
        status: "2/5",
        times: "1 giờ 18 phút",
        lessons: [
            {
                id: 1,
                name: "LÀM THẾ NÀO ĐỂ TRỞ THÀNH MỘT VLOGGER YOUTUBER",
                done: true,
                time: "1 giờ 30 phút"
            },
            {
                id: 2,
                name: "LÀM THẾ NÀO ĐỂ TRỞ THÀNH MỘT VLOGGER YOUTUBER",
                done: false,
                time: "1 giờ 30 phút",
                wait: true
            },
            {
                id: 3,
                name: "LÀM THẾ NÀO ĐỂ TRỞ THÀNH MỘT VLOGGER YOUTUBER",
                done: true,
                time: "1 giờ 30 phút"
            }
        ]
    },
    {
        id: 3,
        name: "Chương 1: Các bài học chương 1",
        status: "2/5",
        times: "1 giờ 18 phút",
        lessons: [
            {
                id: 1,
                name: "LÀM THẾ NÀO ĐỂ TRỞ THÀNH MỘT VLOGGER YOUTUBER",
                done: true,
                time: "1 giờ 30 phút"
            },
            {
                id: 2,
                name: "LÀM THẾ NÀO ĐỂ TRỞ THÀNH MỘT VLOGGER YOUTUBER",
                done: false,
                time: "1 giờ 30 phút"
            },
            {
                id: 3,
                name: "LÀM THẾ NÀO ĐỂ TRỞ THÀNH MỘT VLOGGER YOUTUBER",
                done: true,
                time: "1 giờ 30 phút",
                wait: true
            }
        ]
    }
]

export const LIST_COURSES = [
    {
        id: 1,
        name: "Mua khóa học Đại số 10",
        price: "1290000",
        customer: "Nguyễn Văn A",
        code: "S88HKDKD",
        pay: 2,
        type: 2,
        time: "16:50:30 19-11-2019"
    },
    {
        id: 1,
        name: "Mua khóa học Đại số 10",
        price: "1290000",
        customer: "Nguyễn Văn A",
        code: "S88HKDKD",
        pay: 2,
        type: 2,
        time: "16:50:30 19-11-2019"
    },
    {
        id: 1,
        name: "Mua khóa học Đại số 10",
        price: "1290000",
        customer: "Nguyễn Văn A",
        code: "S88HKDKD",
        pay: 1,
        type: 1,
        time: "16:50:30 19-11-2019"
    },
    {
        id: 1,
        name: "Mua khóa học Đại số 10",
        price: "1290000",
        customer: "Nguyễn Văn A",
        code: "S88HKDKD",
        pay: 1,
        type: 2,
        time: "16:50:30 19-11-2019"
    },
    {
        id: 1,
        name: "Mua khóa học Đại số 10",
        price: "1290000",
        customer: "Nguyễn Văn A",
        code: "S88HKDKD",
        pay: 1,
        type: 1,
        time: "16:50:30 19-11-2019"
    },
    {
        id: 1,
        name: "Mua khóa học Đại số 10",
        price: "1290000",
        customer: "Nguyễn Văn A",
        code: "S88HKDKD",
        pay: 1,
        type: 1,
        time: "16:50:30 19-11-2019"
    },
    {
        id: 1,
        name: "Mua khóa học Đại số 10",
        price: "1290000",
        customer: "Nguyễn Văn A",
        code: "S88HKDKD",
        pay: 1,
        type: 1,
        time: "16:50:30 19-11-2019"
    },
    {
        id: 1,
        name: "Mua khóa học Đại số 10",
        price: "1290000",
        customer: "Nguyễn Văn A",
        code: "S88HKDKD",
        pay: 1,
        type: 1,
        time: "16:50:30 19-11-2019"
    },
    {
        id: 1,
        name: "Mua khóa học Đại số 10",
        price: "1290000",
        customer: "Nguyễn Văn A",
        code: "S88HKDKD",
        pay: 1,
        type: 1,
        time: "16:50:30 19-11-2019"
    }
]

export const COURSES = [
    {
        id: "1",
        name: "Nền tảng tiếng Anh cho người mới bắt đầu",
        image: "https://picsum.photos/259/155",
        tag: "Ngoại ngữ",
        price: "219000",
        off: "70"
    },
    {
        id: "1",
        name: "Nền tảng tiếng Anh cho người mới bắt đầu",
        image: "https://picsum.photos/259/155",
        tag: "Ngoại ngữ",
        price: "219000",
        off: "70"
    },
    {
        id: "1",
        name: "Nền tảng tiếng Anh cho người mới bắt đầu",
        image: "https://picsum.photos/259/155",
        tag: "Ngoại ngữ",
        price: "219000",
        off: "70"
    },
    {
        id: "1",
        name: "Nền tảng tiếng Anh cho người mới bắt đầu",
        image: "https://picsum.photos/259/155",
        tag: "Ngoại ngữ",
        price: "219000",
        off: "70"
    },
    {
        id: "1",
        name: "Nền tảng tiếng Anh cho người mới bắt đầu",
        image: "https://picsum.photos/259/155",
        tag: "Ngoại ngữ",
        price: "219000",
        off: "70"
    },
    {
        id: "1",
        name: "Nền tảng tiếng Anh cho người mới bắt đầu",
        image: "https://picsum.photos/259/155",
        tag: "Ngoại ngữ",
        price: "219000",
        off: "70"
    }
]

export {
    EXERCISES,
    EXERCISE_DETAIL,
    RESULTS,
    SCHEDULES
}
