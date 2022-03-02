<template>
  <div class="exam" v-if="get(exam, 'required', false)">
    <div class="exam-title">
      <span class="exam-title-span">Chi tiết </span>
      <button class="exam-title-button" @click="show = !show">
        <svg
          width="8"
          height="6"
          viewBox="0 0 8 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="vertical-middle"
          v-show="show"
        >
          <path
            d="M0.94 5.46875L4 2.41542L7.06 5.46875L8 4.52875L4 0.52875L-8.21774e-08 4.52875L0.94 5.46875Z"
            fill="black"
            fill-opacity="0.54"
          />
        </svg>
        <svg
          width="8"
          height="6"
          viewBox="0 0 8 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="vertical-middle"
          v-show="!show"
        >
          <path
            d="M7.06 0.53125L4 3.58458L0.94 0.53125L0 1.47125L4 5.47125L8 1.47125L7.06 0.53125Z"
            fill="black"
            fill-opacity="0.54"
          />
        </svg>
      </button>
    </div>
    <div class="exam-content" v-show="show">
      <div class="exam-content-1" style="margin-right: 3rem">
        <div class="exam-item mb-1">
          <span class="mr-3"
            ><svg
              width="5"
              height="5"
              viewBox="0 0 5 5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="vertical-middle"
            >
              <circle cx="2.5" cy="2.5" r="2.5" fill="#E0E0E0" />
            </svg>
          </span>
          <span
            >Loại bài tập:
            {{
              get(exam, "type", "") === "ESSAY" ? "Tự luận" : "Trắc nghiệm"
            }}</span
          >
        </div>
        <div class="exam-item">
          <span class="mr-3"
            ><svg
              width="5"
              height="5"
              viewBox="0 0 5 5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="vertical-middle"
            >
              <circle cx="2.5" cy="2.5" r="2.5" fill="#E0E0E0" />
            </svg>
          </span>
          <span>Cách tính điểm: {{ type_score }}</span>
        </div>
      </div>
      <div class="exam-content-1" style="margin-right: 3rem">
        <div class="exam-item mb-1">
          <span class="mr-3"
            ><svg
              width="5"
              height="5"
              viewBox="0 0 5 5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="vertical-middle"
            >
              <circle cx="2.5" cy="2.5" r="2.5" fill="#E0E0E0" />
            </svg>
          </span>
          <span>Thời gian làm bài: {{ get(exam, "duration", "") }} phút</span>
        </div>
        <div class="exam-item">
          <span class="mr-3"
            ><svg
              width="5"
              height="5"
              viewBox="0 0 5 5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="vertical-middle"
            >
              <circle cx="2.5" cy="2.5" r="2.5" fill="#E0E0E0" />
            </svg>
          </span>
          <span>Điểm đạt: {{ get(exam, "pass_score", 0) }}/10</span>
        </div>
      </div>
      <div class="exam-content-1">
        <div class="exam-item mb-1">
          <span class="mr-3"
            ><svg
              width="5"
              height="5"
              viewBox="0 0 5 5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="vertical-middle"
            >
              <circle cx="2.5" cy="2.5" r="2.5" fill="#E0E0E0" />
            </svg>
          </span>
          <span>Số lần làm bài tối đa: {{ get(exam, "reworks", 0) }} lần</span>
        </div>
        <div class="exam-item">
          <span class="mr-3"
            ><svg
              width="5"
              height="5"
              viewBox="0 0 5 5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="vertical-middle"
            >
              <circle cx="2.5" cy="2.5" r="2.5" fill="#E0E0E0" />
            </svg>
          </span>
          <span
            >Cài đặt thời gian: {{ show_setting_time ? "Có" : "Không" }}</span
          >
          <div class="setting-time" v-if="show_setting_time">
            <div class="setting-title">
              <span>Mở đề</span>:
              {{ open_time }}
            </div>
            <div class="setting-title">
              <span>Đóng đề</span>:
              {{ close_time }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else></div>
</template>

<script>
import { get } from "lodash";
import { getLocalDateTime } from "~/utils/moment";

export default {
  props: {
    exam: {},
  },

  computed: {
    show_setting_time() {
      return (
        get(this, "exam.open_time", "") || get(this, "exam.close_time", "")
      );
    },
    open_time() {
      return get(this, "exam.open_time", "")
        ? getLocalDateTime(get(this, "exam.open_time", "")).format(
            "DD/MM/YYYY - HH:mm"
          )
        : "Không quy định";
    },
    close_time() {
      return get(this, "exam.close_time", "")
        ? getLocalDateTime(get(this, "exam.close_time", "")).format(
            "DD/MM/YYYY - HH:mm"
          )
        : "Không quy định";
    },
    type_score() {
      if (get(this, "exam.coefficient", false)) {
        return `Hệ số ${get(this, "exam.coefficient", "")}`;
      }
      return `Trọng số ${get(this, "exam.weight", "")}%`;
    },
  },

  data() {
    return {
      show: false,
    };
  },

  methods: {
    get,
    getLocalDateTime,
  },
};
</script>

<style scoped>
.exam {
  padding: 0 2rem;
  font-size: 12px;
  padding-bottom: 1rem;
  margin-top: -1rem;
}
.exam .exam-title {
  display: flex;
}
.exam .exam-title .exam-title-span {
  font-style: normal;
  font-weight: normal;
  line-height: 24px;
  color: #656565;
}
.exam .exam-title .exam-title-button {
  margin-left: 1rem;
}
.exam .exam-content {
  display: flex;
  padding: 0 2rem;
}
/* .exam .exam-content .exam-content-1 {
  width: 185px;
} */
.exam .setting-time {
  padding: 0.4rem 4rem 0rem;
  line-height: 1.5rem;
}
.exam .setting-time .setting-title span {
  width: 54px;
  display: inline-block;
  font-size: 11px;
}
</style>
