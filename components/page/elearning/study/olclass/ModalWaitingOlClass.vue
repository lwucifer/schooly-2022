<template>
  <div>
    <app-modal
      centered
      :width="750"
      :component-class="{ 'join-class-modal': true }"
      :footer="false"
      title="Phòng đợi"
      @close="close()"
    >
      <div slot="content" class="text-center">
        <div class="text-left">
          <h6 class="color-primary mb-3">Phòng học online</h6>
          <div class="box12 border mb-4">
            <p class="mb-3">
              Tên phòng:
              <b>{{ get(data, "extra_info.online_class_name", "--") }}</b>
            </p>
            <p class="mb-3" v-if="isCanJoinRoom">
              <span
                >Đang diễn ra:
                <b>Tiết học {{ get(activeSession, "position", "") }}</b
                >:
              </span>
              <a
                class="bold text-decoration-none text-secondary"
                :href="activeSession.join_url"
                @click="handleStartJoin"
                target="_blank"
                >{{ getLocalTimeHH_MM_A(activeSession.start_time, 0) }} -
                {{
                  getLocalEndTime(
                    activeSession.start_time,
                    activeSession.duration,
                    "minutes"
                  )
                }}</a>
                
            </p>
            <p class="mb-3">
              Giáo viên:
              <b>{{ get(data, "extra_info.teacher_name", "--") }}</b>
            </p>
            <p class="mb-3">
              Giờ bắt đầu:
              <b v-if="isCanJoinRoom">{{
                get(data, "extra_info.start_time", "") | fullDateTimeSlash
              }}</b>
              <b v-else>{{
                get(data, "next_time", "") | fullDateTimeSlash
              }}</b>
            </p>
            <p v-if="isCanJoinRoom">
              Thời lượng:
              <b>{{ get(data, "extra_info.duration", 0) | formatHour }}</b>
            </p>

            <p v-if="!isCanJoinRoom">
              <b>Phòng học chưa bắt đầu. Vui lòng quay lại sau.</b>
            </p>
          </div>

          <p class="mb-3" v-if="dataLength > 1">
            <i>
              Chú ý : buổi học này sẽ được chia thành {{ dataLength }} tiết học.
              Sau khi tiết học thứ nhất kết thúc, hãy đợi trong giây lát, hệ
              thống sẽ tự động chuyển sang tiết học tiếp theo. Bạn không nên
              đóng cửa sổ này cho đến khi buổi học kết thúc.
            </i>
          </p>

          <div class="mt-4 text-center">
            <!-- <div class="mb-10">
              Phòng học bắt đầu sau
              <b class="h5 color-blue"> {{ countdown }}</b>
            </div> -->
            <div class="text-center w-100" v-if="contentLoading">
              <app-spin />
            </div>
          </div>

          <div class="mb-4 mt-4 d-flex-center justify-content-center">
            <a
              :href="activeSession.join_url"
              target="_blank"
              class="btn btn--color-primary btn--square mr-4 btn--size-lg"
              @click="handleStartJoin"
              :disabled="!isCanJoinRoom"
              >Vào phòng học</a
            >
            <app-button color="white" size="lg" @click="showModalConfirm = true"
              >Thoát phòng đợi</app-button
            >
          </div>

          <!-- <hr /> -->

          <div style="max-height: 300px; overflow-y: auto; text-align: center;">
            <div class="text-center d-inline-block">
              <div v-for="(item, index) in sessions" :key="index" class="mb-4">
                <p>
                  <span style="color: #222">Tiết học {{ index + 1 }}: </span>
                  <a
                    class="bold text-decoration-none"
                    :class="{
                      'text-secondary': activeSession.join_url == item.join_url
                    }"
                    :href="item.join_url"
                    @click="handleStartJoin"
                    target="_blank"
                    >{{ getLocalTimeHH_MM_A(item.start_time, 0) }} -
                    {{
                      getLocalEndTime(item.start_time, item.duration, "minutes")
                    }}</a
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </app-modal>
    <app-modal-confirm
      v-if="showModalConfirm"
      @ok="close()"
      :width="550"
      @cancel="close()"
      :footer="false"
      :header="false"
      title="Bạn có chắc chắn muốn thoát?"
      description="Việc thoát khỏi phòng đợi sẽ gây ảnh hưởng đến buổi học online của bạn."
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
import { useEffect, getCountdown_HH_MM_SS } from "~/utils/common";
import { LESSION_ONLINE_STATUS } from "~/utils/constants";

import {
  getLocalEndTime,
  getLocalTimeHH_MM_A,
  getLocalDateTime
} from "~/utils/moment";

let interval = null;

export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    contentLoading: {
      type: Boolean,
      default: true
    },
    isShowModal: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      countdown: "--:--",
      seconds: null,
      currentZoom: null,
      showModalConfirm: false,
      activeSession: {},
      // activeSession: false
    };
  },

  methods: {
    get,

    getLocalEndTime,
    getLocalTimeHH_MM_A,
    getLocalDateTime,

    ...mapMutations("elearning/study/study-progress", [
      "setStudyProgressCurrentSession"
    ]),
    ...mapActions("elearning/study/study-olclass", [
      "elearningStudyOlclassLessonSessionsAttendance"
    ]),

    setActiveLinkSession() {
      console.log("[setActiveLinkSession]");
      // lessiong is living => open zoom
      // if (this.data.is_started == true) {
      const sessions = get(this, "data.sessions", []);

      // calculate current session base on: start_time + duration vs new Date();
      // let activeSession = null;
      const now = new Date();
      for (let i = 0; i < sessions.length; i++) {
        const endTime = getLocalDateTime(sessions[i].end_time);
        if (now <= new Date(endTime)) {
          // activeSession = sessions[i];
          this.activeSession = sessions[i];
          return;
        }
      }
      // }
    },

    exitRoom() {
      console.log("[exitRoom]", this.data);
    },

    close() {
      console.log("[close]", interval);
      clearInterval(interval);
      this.$emit("close");
      this.showModalConfirm = false;
    },

    setCountdown() {
      let seconds = this.sessions.time_count_down || 0; // in seconds
      const duration = get(this.data, "extra_info.duration", 0);
      if (!duration) return;

      interval = setInterval(() => {
        console.log("[setCountdown]", seconds);
        this.countdown = getCountdown_HH_MM_SS(seconds);
        this.seconds = seconds;

        if (seconds <= 0) {
          clearInterval(interval);
          this.countdown = "ĐÃ BẮT ĐẦU";

          // set active session link
          interval = setInterval(() => {
            this.setActiveLinkSession();
          }, 1000);
        }

        seconds -= 1;
        this.setActiveLinkSession();
      }, 1000);
    },

    // attendance over here
    handleStartJoin() {
      console.log("[handleStartJoin]", this.data);
      const online_lesson_id = get(this.data, "online_lesson_id", null);
      if(!online_lesson_id) return;

      this.elearningStudyOlclassLessonSessionsAttendance({ online_lesson_id });
    }
  },

  computed: {
    ...mapGetters("auth", ["isTeacherRole", "isStudentRole"]),

    sessions() {
      return get(this, "data.sessions", []);
    },

    dataLength() {
      return this.sessions.length || 0;
    },

    is_started() {
      return get(this.data, "is_started", false);
    },

    isCanJoinRoom() {
      return !!this.dataLength;
    }
  },

  updated() {
    console.log("[updated]", this.data);
    clearInterval(interval);

    this.setCountdown();
  },

  watch: {
    seconds(_newVal) {
      console.log("[seconds] _newVal", _newVal);
      if (_newVal <= 0) {
        this.setStudyProgressCurrentSession(this.currentZoom);
      }
    }
  },

  beforeDestroy() {
    clearInterval(interval);
  }
};
</script>
