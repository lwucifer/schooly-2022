<template>
  <div class="manager-side">
    <div class="manager-side__avatar">
      <app-avatar :src="school.avatar" :size="125" />
      <app-upload class="cgi-upload-avt change-avatar" @change="handleUploadChange">
        <template>
          <div class="cgi-upload-avt-preview">
            <IconPhoto width="13" height="13" />
          </div>
        </template>
      </app-upload>
    </div>
    <p class="manager-side__name mt-2">{{school.name}}</p>

    <div class="manager-side__links">
      <div
        class="link-gray manager-side__links__item"
        :class="actived == 'profile' ? 'active' : ''"
        @click="selectMenu({ name: 'profile' })"
      >
        <IconUser3 />
        <span>Thông tin tài khoản</span>
      </div>
      <div
        class="link-gray manager-side__links__item"
        :class="actived == 'notification' ? 'active' : ''"
        @click="selectMenu({ name: 'notification' })"
      >
        <IconBell />
        <span>Thông báo</span>
      </div>
      <div
        class="link-gray manager-side__links__item"
        :class="actived == 'transaction' ? 'active' : ''"
        @click="selectMenu({ name: 'transaction' })"
      >
        <IconHistory />
        <span>Lịch sử giao dịch</span>
      </div>
      <div
        class="link-gray manager-side__links__item"
        :class="actived == 'support' ? 'active' : ''"
        @click="selectMenu({ name: 'support' })"
      >
        <IconExclamation />
        <span>Trợ giúp</span>
      </div>
    </div>
  </div>
</template>

<script>
  import IconExclamation from "~/assets/svg/icons/exclamation.svg?inline";
  import IconUser3 from "~/assets/svg/icons/user3.svg?inline";
  import IconHistory from "~/assets/svg/icons/history.svg?inline";
  import IconBell from "~/assets/svg/icons/bell.svg?inline";
  import IconPhoto from "~/assets/svg/icons/photo.svg?inline";
  import IconFilter from "~/assets/svg/icons/filter.svg?inline";
  import IconSearch from "~/assets/svg/icons/search2.svg?inline";
  import IconDollarAlt from '~/assets/svg/design-icons/dollar-alt.svg?inline';

  export default {
    components: {
      IconHistory,
      IconBell,
      IconUser3,
      IconExclamation,
      IconPhoto,
      IconSearch,
      IconFilter,
      IconDollarAlt
    },

    props: {
      school: {
        type: Object,
        required: true,
        default: () => {}
      },
      actived: {
        type: String,
        default: 'profile',
        validator: value => ['profile', 'notification', 'transaction', 'support'].includes(value)
      }
    },

    methods: {
      async handleUploadChange(fileList, event) {
        this.avatar = Array.from(fileList);

        getBase64(this.avatar[0], src => {
          this.avatarSrc = src;
        });
        const body = new FormData();
        body.append("avatar_images", fileList[0]);
        console.log("[avatar_images]", fileList[0]);
        this.accountPersonalEditAvatar(body).then(result => {});
      },
      selectMenu({ name }) {
        this.$emit('selectMenu', name)
      }
    }
  };
</script>

<style lang="scss">
  @import "~/assets/scss/components/district-department/account/_menu-aside.scss";
</style>