const EXERCISES = [
    {
        id: 1,
        name: "Bài tập đại số lớp 10",
        type: "Trắc nghiệm",
        lesson: "Bài tập đại số lớp 10",
        course: "-",
        studentNum: "10",
        createdAt: "10/10/2019"
    },
    {
        id: 2,
        name: "Bài tập đại số lớp 10 kiến thức cơ bản",
        type: "Tự luận",
        lesson: "Bài tập đại số lớp 10",
        course: "Khóa học đại số lớp 10",
        studentNum: "10",
        createdAt: "10/10/2019"
    },
    {
        id: 3,
        name: "Bài tập đại số lớp 10",
        type: "Trắc nghiệm",
        lesson: "Bài tập đại số lớp 10",
        course: "-",
        studentNum: "20",
        createdAt: "10/10/2019"
    },
    {
        id: 4,
        name: "Bài tập đại số lớp 10 kiến thức cơ bản",
        type: "Trắc nghiệm",
        lesson: "Bài tập đại số lớp 10",
        course: "-",
        studentNum: "20",
        createdAt: "10/10/2019"
    },
]

const EXERCISE_DETAIL = [
    {
        id: 1,
        name: 'Trần Văn Nam',
        class: '10B',
        result: '6/20 (Đạt)',
        doNum: 2,
        finishedAt: "10:20 AM 19/12/2019",
        type: 'objective'
    },
    {
        id: 2,
        name: 'Trần Văn Thắng',
        class: '11C',
        result: '9/10 (Đạt)',
        doNum: 1,
        finishedAt: "10:20 AM 19/12/2019",
        type: 'writing'
    },
    {
        id: 3,
        name: 'Trần Văn Nam',
        class: '10B',
        result: '4/10 (Không đạt)',
        doNum: 12,
        finishedAt: "10:20 AM 19/12/2019",
        type: 'writing'
    },
    {
        id: 4,
        name: 'Nguyễn Thị Đào',
        class: 'Khác',
        result: '8/10 (Đạt)',
        doNum: 2,
        finishedAt: "10:20 AM 19/12/2019",
        type: 'objective'
    }
]

const RESULTS = [
    {
        num: 1,
        question: '<b style="color: #666666;">Câu hỏi số 1 chương đại số lớp 10</b>',
        options: [
          '5000',
          '6000',
          '7000',
          '8000'
        ],
        answer: "B",
        key: "C"
    },
    {
        num: 2,
        question: "<b>Câu hỏi 2 what's going on?</b>",
        options: [
            '5000',
            '6000',
            '7000',
            '8000'
        ],
        answer: "A",
        key: "D"
    },
    {
        num: 3,
        question: '<b>Câu hỏi số 3 chương đại số lớp 10,</b>',
        options: [
            '5000',
            '6000',
            '7000',
            '8000'
        ],
        answer: "C",
        key: "C"
    },
    {
        num: 4,
        question: '<b>Câu hỏi số 4 chương đại số lớp 10</b>',
        options: [
            '5000',
            '6000',
            '7000',
            '8000'
        ],
        answer: "B",
        key: "A"
    }
]

export { EXERCISES, EXERCISE_DETAIL, RESULTS }