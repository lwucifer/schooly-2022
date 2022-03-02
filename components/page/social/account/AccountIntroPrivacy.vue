<template>
  <div class="account-intro-privacy">
    <v-popover popoverClass="tooltip-privacy">
      <button class="account-intro-privacy__btn">
        <IconPublicon v-if="privacyData === 0" class="icon fill-opacity-1" />
        <IconLock v-else class="icon fill-opacity-1" />
      </button>

      <template slot="popover">
        <div class="app-radio-group">
          <app-radio
            class="account-intro-privacy__radio"
            :name="name"
            :value="1"
            :checked="privacyData === 1"
            @change="handleChangePrivacy"
          >
            <IconLock class="icon fill-opacity-1" />
            <span>Chỉ mình tôi</span>
          </app-radio>

          <app-radio
            class="account-intro-privacy__radio"
            :name="name"
            :value="0"
            :checked="privacyData === 0"
            @change="handleChangePrivacy"
          >
            <IconPublicon class="icon fill-opacity-1" />
            <span>Công khai</span>
          </app-radio>
        </div>
      </template>
    </v-popover>
  </div>
</template>

<script>
import IconPublicon from "~/assets/svg/v2-icons/publicon/social/24px.svg?inline";
import IconLock from "~/assets/svg/design-icons/lock.svg?inline";

export default {
  components: {
    IconPublicon,
    IconLock,
  },

  props: {
    name: String,
    privacy: Number,
  },

  data() {
    return {
      privacyData: this.privacy,
    };
  },
  methods: {
    handleChangePrivacy(e) {
      this.privacyData = Number(e.target.value);
      this.$emit("dataPrivacy", e.target.value, this.name);
    },
  },
};
</script>