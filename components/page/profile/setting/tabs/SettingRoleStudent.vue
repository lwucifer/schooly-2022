<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <SchoolAccountSide :active="6" />
      </div>
      <div class="col-md-9 cc-panel">
        <div v-if="loading">
          <vcl-list />
          <vcl-list />
        </div>
        <div v-else>
          <block-section title="Cài đặt chung">
          <template v-slot:content>
              <sub-block-section
                :title-cls="{ 'border-0': true }"
                title="E-learning"
              >
                <template v-slot:content>
                  <div v-if="loading">Loading...</div>
                  <div v-else class="setting-notify-content__account-info">
                    <NotifyItem
                      v-for="notify in notifys"
                      :key="notify.title"
                      :notify="notify"
                      :payload="payload"
                    />
                  </div>
                </template>
              </sub-block-section>
            
              <sub-block-section
                :title-cls="{ 'border-0': true }"
                title="Mạng xã hội"
              >
                <template v-slot:content>
                  <div v-if="loading">Loading...</div>
                  <div v-else class="setting-notify-content__account-info">
                    <NotifyItem
                      v-for="notify in socials"
                      :key="notify.title"
                      :notify="notify"
                      :payload="payload"
                    />
                  </div>
                </template>
              </sub-block-section>
            </template>
          </block-section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SchoolAccountSide from "~/components/page/school/SchoolAccountSide";
import HeadTabs from "~/components/page/elearning/HeadTab";
import { VclList } from "vue-content-loading";
import * as actionTypes from "~/utils/action-types";
import Notify from "~/components/page/profile/setting/tabs/notify";
import NotifyItem from "~/components/page/profile/setting/tabs/NotifyItem";
import PaymentList from "~/components/page/profile/setting/tabs/PaymentList";
import { mapState } from "vuex";
import { get } from "lodash";
import { useEffect } from "~/utils/common";

export default {

  components: {
    VclList,
    SchoolAccountSide,
    Notify,
    PaymentList,
    HeadTabs,
    NotifyItem
  },

  data() {
    return {
      loading: true,
      isAuthenticated: true,
      payload: {
        comment_notify: "",
        friend_notify: "",
        homework_notify: "",
        id: "",
        other_notify: "",
        point_notify: "",
        schedule_notify: "",
        tag_notify: "",
        teacher_notify: "",
        user_id: "",
      },
      notifys: [
        {
          title: "Thông báo từ giáo viên",
          describe:
            "Nhận thông báo nhắc nhở làm bài tập ở bài giảng/khóa học mà bạn tham gia",
          key: "teacher_notify",
        },
        {
          title: "Nhắc nhở làm bài tập",
          describe:
            "Nhận thông báo nhắc nhở làm bài tập ở bài giảng/khóa học mà bạn tham gia",
          key: "homework_notify",
        },
        {
          title: "Thông báo khi có điểm",
          describe:
            "Nhận thông báo nhắc nhở làm bài tập ở bài giảng/khóa học mà bạn tham gia",
          key: "point_notify",
        },
        {
          title: "Thông báo lịch học tại phòng học online",
          describe:
            "Nhận thông báo nhắc nhở làm bài tập ở bài giảng/khóa học mà bạn tham gia",
          key: "schedule_notify",
        },
      ],
      socials: [
        {
          title: "Bình luận",
          describe:
            "Nhận thông báo nhắc nhở làm bài tập ở bài giảng/khóa học mà bạn tham gia",
          key: "comment_notify",
        },
        {
          title: "Gắn thẻ",
          describe:
            "Nhận thông báo nhắc nhở làm bài tập ở bài giảng/khóa học mà bạn tham gia",
          key: "tag_notify",
        },
        {
          title: "Yêu cầu kết bạn",
          describe:
            "Nhận thông báo nhắc nhở làm bài tập ở bài giảng/khóa học mà bạn tham gia",
          key: "friend_notify",
        },
        {
          title: "Các thông báo khác",
          describe:
            "Nhận thông báo nhắc nhở làm bài tập ở bài giảng/khóa học mà bạn tham gia",
          key: "other_notify",
        },
      ],
    };
  },

  async mounted() {
    // this.loading = true;
    // this.loading = false;
    this.loading = true
    await this.$store.dispatch(`setting/getSetting`);
    useEffect(this, this.handleSetpayload.bind(this), ["setting"]);
    this.loading = false
  },

  computed: {
    ...mapState("setting", {
      setting: "setting",
    }),
  },

  methods: {
    handleSetpayload() {
      this.payload.comment_notify = get(this, "setting.comment_notify", "PUSH");
      this.payload.friend_notify = get(this, "setting.friend_notify", "PUSH");
      this.payload.homework_notify = get(
        this,
        "setting.homework_notify",
        "PUSH"
      );
      this.payload.id = get(this, "setting.id", "");
      this.payload.other_notify = get(this, "setting.other_notify", "PUSH");
      this.payload.point_notify = get(this, "setting.point_notify", "PUSH");
      this.payload.schedule_notify = get(
        this,
        "setting.schedule_notify",
        "PUSH"
      );
      this.payload.tag_notify = get(this, "setting.tag_notify", "PUSH");
      this.payload.teacher_notify = get(this, "setting.teacher_notify", "PUSH");
      this.payload.user_id = get(this, "setting.user_id", "");
    },
    get,
  },
};
</script>

<style lang="scss">
  @import "~/assets/scss/components/account/_account-info-setting.scss";
</style>
