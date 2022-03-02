<template>
  <div class="wrap-notification-item" :class="dataNoti.is_read ? 'readed' : ''">
    <a @click.prevent="checkLinkNoti">
      <app-avatar
        :size="50"
        :src="dataNoti.sender_avatar && dataNoti.sender_avatar.high"
        class="avatar-notifi"
      />
      <div class="wrap-content-item">
        <p class="content-item" v-html="dataNoti.payload.text"></p>
        <span>{{ dataNoti.created_at | moment("from") }}</span>
      </div>
    </a>
    <div class="group-button-item">
      <div
        class="d-flex justify-content-center"
        v-click-outside="handleClickOutMenu"
      >
        <button @click="menuBtn = !menuBtn">
          <IconMoreHoriz24px />
        </button>
        <ul class="menu-dropdown-content" v-if="menuBtn">
          <li @click="handleClickCheck" v-if="!dataNoti.is_read">
            <a> <IconCheck24px />Đánh dấu là đã đọc </a>
          </li>
          <li @click="handleClickCheck" v-else>
            <a> <IconCheck24px />Đánh dấu là chưa đọc </a>
          </li>
          <li>
            <a @click="handleDelete">
              <IconDeleteSweep24px />Xóa thông báo này
            </a>
          </li>
        </ul>
      </div>

      <button v-if="!dataNoti.is_read">
        <IconEllipse2 />
      </button>
    </div>
  </div>
</template>

<script>
import IconMoreHoriz24px from "~/assets/svg/v2-icons/more_horiz_24px.svg?inline";
import IconEllipse2 from "~/assets/svg/icons/ellipse2.svg?inline";
import IconCheck24px from "~/assets/svg/v2-icons/check_24px.svg?inline";
import IconDeleteSweep24px from "~/assets/svg/v2-icons/delete_sweep_24px.svg?inline";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { FETCH_SIZE, SOCIAL, ELEARNING } from "~/utils/config";
import { NOTI_TYPE } from "~/utils/constants";
export default {
  components: {
    IconMoreHoriz24px,
    IconEllipse2,
    IconCheck24px,
    IconDeleteSweep24px,
  },
  props: {
    dataNoti: {
      type: Object,
      default: {},
    },
    typeTab: {
      type: String,
      default: "elearning",
    },
  },

  data() {
    return {
      menuBtn: false,
    };
  },

  computed: {
    ...mapState("elearning/study/notifications", [
      "countNotiElearning",
      "countNotiSocial",
    ]),
    ...mapGetters("auth", ["isTeacherRole"])
  },

  methods: {
    ...mapActions("elearning/study/notifications", [
      "getNotifications",
      "getCountNotifications",
      "checkIsReadNotifications",
      "deleteNotifications",
    ]),
    ...mapMutations("elearning/study/notifications", [
      "setCountNotiElearning",
      "setCountNotiSocial",
    ]),

    updateCountElearning() {
      this.getNotifications({
        is_reset: 1,
        fetch_size: FETCH_SIZE,
        service_type: ELEARNING,
      });
    },
    updateCountSocial() {
      this.getNotifications({
        is_reset: 1,
        fetch_size: FETCH_SIZE,
        service_type: SOCIAL,
      });
    },
    handleDelete() {
      this.deleteNotifications({
        notification_id: this.dataNoti.id,
        body: {
          service_type: this.typeTab == "elearning" ? ELEARNING : SOCIAL,
        },
      }).then((res) => {
        if (!res.error) {
          if (this.typeTab == "elearning") {
            this.menuBtn = !this.menuBtn;
            this.updateCountElearning();
          } else {
            this.updateCountSocial();
          }
        }
      });
    },
    handleClickCheck() {
      this.menuBtn = !this.menuBtn;
      this.checkIsReadNotifications({
        type: "ONLY_ONE",
        service_type: this.typeTab == "elearning" ? ELEARNING : SOCIAL,
        notification_id: this.dataNoti.id,
      }).then((res) => {
        if (res.data) {
          console.log("res", res);
          // this.checkIsRead = res.data.is_read;
          if (this.typeTab == "elearning") {
            this.updateCountElearning();
          } else {
            this.updateCountSocial();
          }
        }
      });
    },
    handleClickOutMenu() {
      this.menuBtn = false;
    },

    checkLinkNoti() {
      const type = this.dataNoti.type;
      const source_id = this.dataNoti.payload.source_id;
      const post_id = this.dataNoti.payload.post_id || "";
      const sender_id = this.dataNoti.sender_id;
      !this.dataNoti.is_read &&
        this.checkIsReadNotifications({
          type: "ONLY_ONE",
          service_type: this.typeTab == "elearning" ? ELEARNING : SOCIAL,
          notification_id: this.dataNoti.id,
        });
      this.$emit("hideMenuNotifi", false);
      switch (type) {
        // ELEARNING
        case NOTI_TYPE.EVALUATE_EXERCISE:
          return this.$router.push(this.isTeacherRole ? `/elearning/manager/exams` : `/elearning/mycourses/exercises/list`);
        case NOTI_TYPE.EVALUATE_TEST:
          return this.$router.push(`/elearning/manager/exams?tab=exam`);
        case NOTI_TYPE.SUBMIT_EXERCISE:
          return this.$router.push(`/elearning/manager/exams/${source_id}/results?user_id=&sender_id=${sender_id}&elearning_name=&item_name=&student_name=&student_id=`);
        case NOTI_TYPE.SUBMIT_TEST:
          return this.$router.push(`/elearning/manager/exams/${source_id}/results?user_id=&sender_id=${sender_id}&elearning_name=&item_name=&student_name=&student_id=`);
        case NOTI_TYPE.SEND_REQUEST_JOIN_TO_ELEARNING:
          return this.$router.push(
            `/elearning/manager/courses/students?elearning_id=${source_id}&type=pending`
          );
        case NOTI_TYPE.ACCEPT_REQUEST_JOIN_TO_ELEARNING:
          return this.$router.push(`/elearning/${source_id}`);
        case NOTI_TYPE.INVITE_JOIN_TO_ELEARNING:
          return this.$router.push(`/elearning/${source_id}`);
        case NOTI_TYPE.DELETE_ONLINE_CLASS:
          return this.$router.push(`/elearning/${source_id}/study`);
        case NOTI_TYPE.DELETE_ONLINE_LESSON:
          return this.$router.push(`/elearning/${source_id}/study`);
        case NOTI_TYPE.CREATE_NEW_ONLINE_CLASS:
          return this.$router.push(this.isTeacherRole ? `/elearning/manager/online-class` : `/elearning/mycourses/olclass`);
        case NOTI_TYPE.ADD_NEW_INTERACTIVE_ANNOUNCEMENT:
          return this.$router.push(
            `/elearning/${source_id}/study?type=notification`
          );
        case NOTI_TYPE.SEND_FEEDBACK_TO_ANSWER_OF_TEACHER:
          return this.$router.push(`/elearning/manager/interacts`);
        case NOTI_TYPE.SEND_QUESTION_TO_TEACHER:
          return this.$router.push(`/elearning/manager/interacts`);
        case NOTI_TYPE.SEND_FEEDBACK_TO_QUESTION:
          return this.$router.push(`/elearning/${source_id}/study?type=qa`);
        case NOTI_TYPE.SEND_FEEDBACK_TO_QUESTION_HAD_ONE_ANSWER:
          return this.$router.push(`/elearning/${source_id}/study?type=qa`);
        case NOTI_TYPE.SEND_FEEDBACK_TO_QUESTION_HAD_MANY_ANSWERS:
          return this.$router.push(`/elearning/${source_id}/study?type=qa`);
        case NOTI_TYPE.SEND_CODE_LINK_ACCOUNT:
          return this.$router.push(`${source_id}/info`);
        // SOCIAL
        case NOTI_TYPE.CREATED_COMMENT_OF_POST:
          return this.$router.push(`/social/post/${post_id}?commentId=${source_id}`);
        case NOTI_TYPE.CREATED_COMMENT_OF_COMMENT:
          return this.$router.push(`/social`);
        case NOTI_TYPE.FRIEND_ACCEPTED:
          return this.$router.push(
            `/social/account/${source_id}/friends_recent`
          );
        case NOTI_TYPE.SEND_FRIEND_REQUEST:
          return this.$router.push(
            `/social/account/${source_id}/friends_request`
          );
        default:
          return "";
      }
    },
  },
};
</script>

<style lang="scss">
.content-item {
  color: black;
}
</style>
