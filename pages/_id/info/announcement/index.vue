<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <SchoolAccountSide :active="5" />
      </div>
      <div class="col-md-9 cc-panel">
        <block-section title="Elearning">
          <template v-slot:content>
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
              <template class="content-notification">
                <notification-item
                  v-for="(item, index) in notiElearning"
                  :key="index"
                  :dataNoti="item"
                  :isReaded="isReaded"
                  @read="handleReadNotifi"
                  :typeTab="'elearning'"
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
          </template>
        </block-section>
      </div>
    </div>
  </div>
</template>

<script>
import SchoolAccountSide from "~/components/page/school/SchoolAccountSide";
import IconCheck24px from "~/assets/svg/v2-icons/check_24px.svg?inline";
import IconSettings24px from "~/assets/svg/v2-icons/settings_24px.svg?inline";
import { mapState, mapActions } from "vuex";
import { FETCH_SIZE, ELEARNING } from "../../../../utils/config";
import * as actionTypes from "~/utils/action-types";
import Notifications from "~/services/elearning/study/Notifications";
const STORE_NOTIFI = "elearning/study/notifications";
export default {
  components: {
    SchoolAccountSide,
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
    ...mapState(STORE_NOTIFI, ["notiElearning", "notiSocial"]),
    ...mapState("auth", ["token"]),
  },

  mounted() {
    this.getNotifications({
      is_reset: 1,
      fetch_size: FETCH_SIZE,
      service_type: ELEARNING,
    });
    this.getCountNotifications({
      service_type: ELEARNING,
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
      this.fromNotifyId = this.notiElearning[this.notiElearning.length - 1];
      this.getNotificationsScroll({
        fetch_size: FETCH_SIZE,
        service_type: ELEARNING,
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
      // console.log("handleCheckAllRead");
      this.checkIsReadNotifications({
        type: "ALL",
        service_type: ELEARNING,
      }).then((res) => {
        // console.log("res", res);
        if (res.data) {
          this.updateCountElearning();
        }
      });
    },

    updateCountElearning() {
      this.getNotifications({
        is_reset: 1,
        fetch_size: FETCH_SIZE,
        service_type: ELEARNING,
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
