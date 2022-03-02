<template>
  <div class="page-message">
    <div class="container">
      <div class="row">
        <div class="col-md-3 col-sidebar">
          <TabContact @addMessage="addMessage()" @clickTab="clickTab()" />
        </div>
        <div class="col-md-9 col-content">
          <NuxtChild :key="$route.params.id" :isCreate="isCreate" :isGroup="isGroup" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";

import * as actionTypes from "~/utils/action-types";
import Logo from "~/assets/svg/logo/schoolly.svg?inline";
import IconCaretDown from "~/assets/svg/icons/caret-down.svg?inline";
import IconImage from "~/assets/svg/icons/image.svg?inline";
import TabContact from "~/components/page/chat/TabContact";

import * as constants from "~/utils/constants";

import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

export default {
  components: {
    Logo,
    IconCaretDown,
    IconImage,
    TabContact
  },

  async fetch({ params, query, store, route, redirect }) {
  },

  data() {
    return {
      isGroup: false,
      isCreate: false
    };
  },

  mounted() {},
  created() {},
  computed: {
    ...mapState("message", [
      "messageEmit",
      "closeCreate",
      "isGroupState",
      "isCreated"
    ]),
    ...mapGetters("auth", ["getSocketURIParam", "userId", "fullName"])
  },

  methods: {
    ...mapMutations("message", ["setOnMessage", "setIsCreated"]),
    addMessage() {
      this.isCreate = !this.isCreated;
      this.setIsCreated(this.isCreate);
    },

    clickTab() {
      this.isGroup = !this.isGroup;
    }
  },

  beforeDestroy() {},
  watch: {
    closeCreate(newVal) {
      this.isCreate = newVal;
    },
    isGroupState(newVal) {
      this.isGroup = newVal;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/pages/_page_messages.scss";
</style>