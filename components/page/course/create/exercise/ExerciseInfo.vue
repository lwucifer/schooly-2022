<template>
  <div class="exercise" v-if="get(exercise, 'required', false)">
    <div class="exercise-title">
      <span class="exercise-title-span">Chi tiết </span>
      <button class="exercise-title-button" @click="show = !show">
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
    <div class="exercise-content" v-show="show">
      <div class="exercise-content-1" style="margin-right: 3rem">
        <div class="exercise-item mb-1">
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
            >Bài tập bắt buộc:
            {{ get(exercise, "required", false) ? "Có" : "Không" }}</span
          >
        </div>
        <div class="exercise-item">
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
          <span>Điểm đạt: {{ get(exercise, "pass_score", 0) }}/10</span>
        </div>
      </div>
      <div class="exercise-content-1" style="margin-right: 3rem">
        <div class="exercise-item mb-1">
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
              get(exercise, "type", "") === "ESSAY" ? "Tự luận" : "Trắc nghiệm"
            }}</span
          >
        </div>
        <div class="exercise-item">
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
            >Số lần làm bài tối đa: {{ get(exercise, "reworks", 0) }} lần</span
          >
        </div>
      </div>
      <div class="exercise-content-1">
        <div class="exercise-item mb-1">
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
            >Thời gian làm bài:
            {{ get(exercise, "duration", 0) }} phút</span
          >
        </div>
      </div>
    </div>
  </div>
  <div v-else></div>
</template>

<script>
import { get } from "lodash";

export default {
  props: {
    exercise: {},
  },

  data() {
    return {
      show: false,
    };
  },

  methods: {
    get,
  },
};
</script>

<style scoped>
.exercise {
  padding: 0 2rem;
  font-size: 12px;
  padding-bottom: 1rem;
  margin-top: -1rem;
}
.exercise .exercise-title {
  display: flex;
}
.exercise .exercise-title .exercise-title-span {
  font-style: normal;
  font-weight: normal;
  line-height: 24px;
  color: #656565;
}
.exercise .exercise-title .exercise-title-button {
  margin-left: 1rem;
}
.exercise .exercise-content {
  display: flex;
  padding: 0 2rem;
}
/* .exercise .exercise-content .exercise-content-1 {
  width: 185px;
} */
</style>
