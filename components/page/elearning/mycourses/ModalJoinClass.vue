<template>
  <app-modal
    centered
    :width="750"
    :component-class="{ 'join-class-modal': true }"
    :footer="false"
    title="Phòng đợi"
    @close="close()"
  >
    <div slot="content" v-if="loading">Loading...</div>
    <div slot="content" class="text-center" v-else>
      <div class="text-left">
        <h6 class="color-primary mb-3">
          {{ get(data, "extra_info.online_class_name", "") }}
        </h6>
        <div class="box12 border mb-4">
          <p class="mb-3">
            Tên bài giảng:
            <b>{{ get(info, "assignment_name", "") }}</b>
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
              target="_blank"
              >{{ getLocalTimeHH_MM_A(activeSession.start_time, 0) }} -
              {{
                getLocalEndTime(
                  activeSession.start_time,
                  activeSession.duration,
                  "minutes"
                )
              }}</a
            >
          </p>
          <p class="mb-3">
            Giáo viên:
            <b>{{ get(data, "extra_info.teacher_name", "") }}</b>
          </p>
          <!-- <p class="mb-3">
            Giờ bắt đầu:
            <b>{{
              getLocalTimeHH_MM_A(get(data, "extra_info.start_time", ""))
            }}</b>
          </p> -->
          <p class="mb-3">
            Giờ bắt đầu:
            <b v-if="isCanJoinRoom">{{
              getLocalTimeHH_MM_A( get(data, "extra_info.start_time", ""))
            }}</b>
            <b v-else-if="get(data, 'next_time', false)">{{ get(data, "next_time", "") }}</b>
            <b v-else>{{ getLocalTimeHH_MM_A(get(data, "extra_info.start_time", "")) }}</b>
          </p>
          <!-- <p>
            Thời lượng:
            <b>{{ get(data, "extra_info.duration", "") | formatHour }}</b>
          </p> -->
          <p v-if="isCanJoinRoom">
            Thời lượng:
            <b>{{ get(data, "extra_info.duration", 0) | formatHour }}</b>
          </p>

          <p v-if="!isCanJoinRoom">
            <!-- <b>Phòng học chưa bắt đầu. Vui lòng quay lại sau.</b> -->
          </p>
        </div>

        <p class="mb-3" v-if="dataLength === 1 && !data.is_started">
          <b>Chú ý:</b> buổi học sẽ được bắt đầu sau giây lát.
          <b>Bạn không nên đóng cửa sổ này cho đến khi buổi học kết thúc.</b>
        </p>
        <p class="mb-3" v-if="dataLength === 1 && data.is_started">
          <b>Chú ý:</b> buổi học sẽ được bắt đầu sau giây lát. Bạn có thể ấn Vào
          phòng học để vào phòng trước.
          <b>Bạn không nên đóng cửa sổ này cho đến khi buổi học kết thúc.</b>
        </p>

        <p class="mb-3" v-if="dataLength > 1 && !data.is_started">
          <b>Chú ý:</b> buổi học này được chia thành {{ dataLength }} tiết học.
          Sau khi tiết học thứ nhất kết thúc, hãy đợi trong giây lát, hệ thống
          sẽ tự động chuyển sang tiết học tiếp theo.
          <b>Bạn không nên đóng cửa sổ này cho đến khi buổi học kết thúc.</b>
        </p>
        <p class="mb-3" v-if="dataLength > 1 && data.is_started">
          <b>Chú ý:</b> buổi học này được chia thành {{ dataLength }} tiết học.
          Sau khi tiết học thứ nhất kết thúc, hãy đợi trong giây lát, hệ thống
          sẽ tự động chuyển sang tiết học tiếp theo. Bạn phải có trách nhiệm
          thông báo về việc phân chia tiết học cho học sinh.
          <b>Bạn không nên đóng cửa sổ này cho đến khi buổi học kết thúc.</b>
        </p>

        <div class="mt-4 text-center">
          <p>
            Phòng học bắt đầu sau:
            <b class="h5 color-blue"> {{ countdown }}</b>
          </p>
          <div class="mb-4 mt-4 d-flex-center justify-content-center">
            <a
              :href="activeSession.join_url"
              target="_blank"
              class="btn btn--color-primary btn--square mr-4 btn--size-lg"
              >Vào phòng học</a
            >
            <app-button color="white" size="lg" @click="showModalConfirm = true"
              >Thoát phòng đợi</app-button
            >
          </div>
          <div
            style="max-height: 300px; overflow-y: auto"
            v-if="dataLength > 1"
          >
            <div class="text-left d-inline-block">
              <div
                v-for="(item, index) in data.sessions"
                :key="index"
                class="mb-4"
              >
                <p>
                  <span style="color: #222">Tiết học {{ index + 1 }}: </span>
                  <a
                    class="bold text-decoration-none"
                    :class="{
                      'text-secondary':
                        activeSession.join_url == item.join_url
                    }"
                    :href="item.join_url"
                    target="blank"
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

      <!-- <app-modal-confirm
        v-if="showModalConfirm"
        :confirmLoading="confirmLoading"
        @ok="close()"
        :width="550"
        @cancel="showModalConfirm = false"
        :footer="false"
        :header="false"
        title="Bạn có chắc chắn muốn thoát?"
        description="Việc thoát khỏi phòng đợi sẽ gây ảnh hưởng đến buổi học online của bạn."
      /> -->
      <app-modal-confirm
        v-if="showModalConfirm"
        @ok="close()"
        :width="550"
        @cancel="showModalConfirm = false"
        :footer="false"
        :header="false"
        title="Bạn có chắc chắn muốn thoát?"
        description="Việc thoát khỏi phòng đợi sẽ gây ảnh hưởng đến buổi học online của bạn."
      />
    </div>
  </app-modal>
</template>

<script>
import {
  getLocalEndTime,
  getLocalTimeHH_MM_A,
  getLocalDateTime,
  addDurationToUTCDate,
} from "~/utils/moment";
import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
import { useEffect, getCountdown_HH_MM_SS } from "~/utils/common";

const STORE_NAMESPACE = "elearning/study/study-olclass";
let interval = null;

export default {
  components: {},

  props: {
    id: null,
    info: Object
  },

  data() {
    return {
      showModalConfirm: false,
      confirmLoading: true,
      data: [],
      dataLength: 0,
      loading: false,
      countdown: "--:--",
      seconds: null,
      currentZoom: null,
      showModalConfirm: false,
      // activeSessionLink: "#",
      activeSession: {}
    };
  },

  methods: {
    getLocalEndTime,
    getLocalTimeHH_MM_A,
    getLocalDateTime,

    close(invite) {
      console.log("[close]", interval);
      clearInterval(interval);
      this.$emit("close");
      this.showModalConfirm = false;
    },

    async getList() {
      const self = this;
      try {
        self.loading = true;
        await self.$store.dispatch(
          `${STORE_NAMESPACE}/${actionTypes.STUDY_OLCLASS_SESSION.INFO}`,
          self.id
        );

        const data = self.stateClass ? self.stateClass : {};
        const sessionImpl = data.sessions.map(s => {
          return {
            ...s,
            end_time: addDurationToUTCDate(s.start_time, s.duration, "m")
          }
        });
        self.data = { ...data, sessions: sessionImpl };
        self.dataLength = self.get(self.stateClass, "data.sessions", []).length;

        this.setCountdown();
      } catch (e) {
        console.log("[getList] err", e);
      } finally {
        this.loading = false;
      }
    },

    get,

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
          // this.activeSessionLink = activeSession.start_url;
          this.activeSession = sessions[i];
          // console.log("[activeSession]", this.activeSession);
          return;
        }
      }
      // }
    },

    setCountdown() {
      let seconds = this.data.time_count_down || 0; // in seconds
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
    }
  },

  computed: {
    ...mapState("auth", ["loggedUser"]),
    ...mapState(STORE_NAMESPACE, {
      stateClass: "Session"
    }),

    isCanJoinRoom() {
      return !!this.dataLength;
    }
  },

  created() {
    this.getList();
  },

  beforeDestroy() {
    clearInterval(interval);
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/olclass/join-class.scss";
</style>
