<template>
  <div class="cc-panel">
    <div class="wrap-notify-account-info">
      <div class="header-content">
        <h4>Danh sách thông báo</h4>
        <div class="ml-auto d-flex">
          <a
            @click.prevent="handleCheckAllRead"
            class="d-flex align-items-center text-primary text-decoration-none"
            to
          >
            <IconCheck24px class="fill-primary mr-3" />
            Đánh dấu tất cả là đã đọc
          </a>
          <n-link
            class="d-flex align-items-center ml-4 text-decoration-none text-gray"
            :to="'/' + token.id + '/info/setting'"
          >
            <IconSettings24px class="mr-3" />
            Cài đặt thông báo
          </n-link>
        </div>
      </div>
      <template>
        <notification-item
          v-for="(item, index) in notiSocial"
          :key="index"
          :dataNoti="item"
          :isReaded="isReaded"
          @read="handleReadNotifi"
          :typeTab="'social'"
        />
      </template>
    </div>
    <client-only>
      <infinite-loading @infinite="infiniteHandler">
        <template slot="no-more">&nbsp;</template>
        <template slot="no-results">{{
          fromNotifyId ? `&nbsp;` : "Không có thông báo nào."
        }}</template>
      </infinite-loading>
    </client-only>
  </div>
</template>

<script>
import IconCheck24px from "~/assets/svg/v2-icons/check_24px.svg?inline";
import IconSettings24px from "~/assets/svg/v2-icons/settings_24px.svg?inline";
import { mapState, mapActions } from "vuex";
import { FETCH_SIZE, SOCIAL } from "../../../../utils/config";
import * as actionTypes from "~/utils/action-types";
import Notifications from "~/services/elearning/study/Notifications";
const STORE_NOTIFI = "elearning/study/notifications";
export default {
  components: {
    IconCheck24px,
    IconSettings24px,
  },
  data() {
    return {
      isReaded: false,
      fromNotifyId: "",
      pagination: {
        total_pages: 2,
        size: 10,
        total_elements: 20,
        first: 1,
        last: 0,
        number: 1,
      },
    };
  },
  computed: {
    ...mapState(STORE_NOTIFI, ["notiSocial"]),
    ...mapState("auth", ["token"]),
  },

  mounted() {
    this.getNotifications({
      is_reset: 1,
      fetch_size: FETCH_SIZE,
      service_type: SOCIAL,
    });
    this.getCountNotifications({
      service_type: SOCIAL,
    });
  },

  methods: {
    ...mapActions(STORE_NOTIFI, [
      "getNotifications",
      "getNotificationsScroll",
      "getCountNotifications",
      "checkIsReadNotifications",
    ]),

    async infiniteHandler($state) {
      this.fromNotifyId = this.notiSocial[this.notiSocial.length - 1];
      this.getNotificationsScroll({
        fetch_size: FETCH_SIZE,
        service_type: SOCIAL,
        from_notification_id: this.fromNotifyId && this.fromNotifyId.id,
      }).then((res) => {
        if (res && res.length) {
          $state.loaded();
        } else {
          $state.complete();
        }
      });
    },
    handleReadNotifi(val) {
      this.isReaded = val;
    },
    onPageChange(e) {
      this.$emit("pagechange", e);
    },
    handleCheckAllRead() {
      this.checkIsReadNotifications({
        type: "ALL",
        service_type: SOCIAL,
      }).then((res) => {
        if (res.data) {
          this.updateCountSocial();
        }
      });
    },

    updateCountSocial() {
      this.getNotifications({
        is_reset: 1,
        fetch_size: FETCH_SIZE,
        service_type: SOCIAL,
      });
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/manager/_elearning-manager-content.scss";
.wrap-notify-account-info {
  background: #ffffff;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.05);
  .header-content {
    display: flex;
    padding: 2rem;
    border: 1px solid #e0e0e0;
  }
  .content-notification {
    padding: 15px 5px;
  }
}
</style>
