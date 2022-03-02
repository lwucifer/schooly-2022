<template>
  <div class="e-study-tab-notification">
    <TabNotificationItem
      v-for="(notification, index) in get(notifications, 'content', [])"
      :key="index"
      :notification="notification"
    />

    <div
      v-if="!get(notifications, 'content.length', true)"
      class="text-center caption text-gray-2"
    >
      Chưa có nội dung.
    </div>

    <app-pagination
      class="mt-4"
      :pagination="get(notifications, 'page', {})"
      @pagechange="handleChangePage"
    />
  </div>
</template>

<script>
import TabNotificationItem from "~/components/page/elearning/study/tab-notification/TabNotificationItem.vue";
import { useEffect } from "~/utils/common";
import { get } from "lodash";
import { mapState } from "vuex";

export default {
  components: {
    TabNotificationItem,
  },

  data() {
    return {
      params: {
        elearning_id: get(this, "$route.params.id", ""),
        page: 1,
        size: 10,
      },
    };
  },

  watch: {
    "$route.params.id": {
      handler: function() {
        this.params.elearning_id = get(this, "$route.params.id", "");
      },
    },
  },

  computed: {
    ...mapState("elearning/study/detail", {
      notifications: "notifications",
    }),
  },

  mounted() {
    useEffect(this, this.getNotifications.bind(this), ["params"]);
  },

  methods: {
    handleChangePage(page) {
      this.params.page = page;
    },

    getNotifications() {
      const options = {
        params: this.params,
      };
      this.$store.dispatch(
        `elearning/study/detail/getListNotification`,
        options
      );
    },
    get,
  },
};
</script>

<style></style>
