<template>
  <div class="social-account-intro">
    <h2 class="social-account-intro__title" v-if="isTeacherRole">Nơi công tác</h2>
    <h2 class="social-account-intro__title" v-else>Nơi học tập</h2>
    <div class="social-account-intro__row">
      <IconPersonPin24px class="social-account-intro__icon icon fill-opacity-1" />

      <div class="social-account-intro__center">
        <h4 class="social-account-intro__center-title" v-if="isTeacherRole">Giáo viên chủ nhiệm</h4>
        <h4 class="social-account-intro__center-title" v-else>Học sinh</h4>
        <div>{{userAccountProfile && userAccountProfile.work && userAccountProfile.work.classes ? userAccountProfile.work.classes : ''}}</div>
      </div>

      <div class="social-account-intro__right">
        <!-- <button class="social-account-intro__btn-edit" @click.prevent="setEditEmail(true)">
          <IconEdit24px class="icon fill-opacity-1" />
        </button>-->
        <AccountIntroPrivacy
          v-if="checkUuidUser"
          name="class"
          @dataPrivacy="dataPrivacy"
          :privacy="privacy_class"
        />
      </div>
    </div>
    <div class="social-account-intro__row">
      <IconSocialMenuBuilding class="social-account-intro__icon icon fill-opacity-1" />

      <div class="social-account-intro__center">
        <h4 class="social-account-intro__center-title">Trường học</h4>

        <div>{{userAccountProfile && userAccountProfile.organization && userAccountProfile.organization.name ? userAccountProfile.organization.name : ''}}</div>
        <div>
          <span v-if="!checkAddressUser && checkUuidUser">Địa chỉ:</span>
          <div>{{userAccountProfile && userAccountProfile.organization && userAccountProfile.organization.address ? userAccountProfile.organization.address : ''}}</div>
        </div>
      </div>

      <div class="social-account-intro__right">
        <!-- <button class="social-account-intro__btn-edit" @click.prevent="setEditEmail(true)">
          <IconEdit24px class="icon fill-opacity-1" />
        </button>-->
        <AccountIntroPrivacy
          v-if="checkUuidUser"
          name="organization"
          @dataPrivacy="dataPrivacy"
          :privacy="privacy_address"
        />
      </div>
    </div>
    <app-modal-confirm
      centered
      v-if="modalConfirmPrivacy"
      title
      :description="modalConfirmDescription"
      @ok="handlePrivacy"
      @cancel="modalConfirmPrivacy = false"
    />
  </div>

  <!-- <div class="wrap-account-intro-social">
      <h4 class="mb-4">{{title}}</h4>

      <div class="row">
          <IconPersonPin24px class="col-md-1"/>
          <div class="col-md-10">
              <p class="mb-2">Học sinh</p>
              <p>Lớp {{work.class}}</p>
          </div>
          <div class="col-md-1">
              <AccountIntroPrivacy :size="20"/>
          </div>
      </div>
      <div class="row">
          <IconSocialMenuBuilding class="col-md-1 icon-building"/>
          <div class="col-md-10">
              <p class="mb-2">Trường học</p>
              <p>{{work.school}}</p>
              <p>{{work.address}}</p>
          </div>
          <div class="col-md-1">
              <AccountIntroPrivacy :size="20"/>
          </div>
      </div>
  </div>-->
</template>

<script>
import IconPersonPin24px from "~/assets/svg/v2-icons/person_pin_24px.svg?inline";
import IconSocialMenuBuilding from "~/assets/svg/icons/social-menu-building.svg?inline";
import AccountIntroPrivacy from "~/components/page/social/account/AccountIntroPrivacy";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  components: {
    IconPersonPin24px,
    IconSocialMenuBuilding,
    AccountIntroPrivacy,
  },
  data() {
    return {
      privacy: 0,
      nameRadio: "",
      modalConfirmPrivacy: false,
      modalConfirmDescription: "",
      privacy_class: 0,
      privacy_address: 0,
    };
  },
  computed: {
    ...mapGetters("auth", ["isTeacherRole", "isStudentRole", "uuidUser"]),
    ...mapState("account", {
      profileList: "profileList",
    }),
    ...mapState("social/account/profile", ["userAccountProfile"]),
    checkUuidUser() {
      return this.$route.params.uuid == this.uuidUser;
    },
    checkAddressUser() {
      return this.userAccountProfile &&
        this.userAccountProfile.privacy &&
        this.userAccountProfile.privacy.privacy_address == true
        ? this.userAccountProfile.privacy.privacy_address == true
        : false;
    },
  },
  created() {
    this.privacy_class =
      this.userAccountProfile.privacy &&
      this.userAccountProfile.privacy.privacy_class
        ? this.userAccountProfile.privacy.privacy_class == true
          ? 1
          : 0
        : 0;
    this.privacy_address =
      this.userAccountProfile.privacy &&
      this.userAccountProfile.privacy.privacy_address
        ? this.userAccountProfile.privacy.privacy_address == true
          ? 1
          : 0
        : 0;
  },
  methods: {
    ...mapActions("social/account/profile", ["editAccountPrivacy"]),
    handlePrivacy() {
      // const name = `privacy_${this.nameRadio}`;
      const data = {
        [`privacy_${this.nameRadio}`]: this.privacy == 1 ? true : false,
      };
      this.editAccountPrivacy(data).then((result) => {
        console.log("result", result);
        if (result.success) {
          this.$toasted.success("Thành công");
        } else {
          this.$toasted.error(result.message);
        }
      });
    },
    async dataPrivacy(_privacy, _name) {
      console.log("dataPrivacy", _privacy, _name);
      this.privacy = _privacy;
      this.nameRadio = _name;
      await this.handlePrivacy();
      // this.modalConfirmPrivacy = true;
      // this.modalConfirmDescription = _privacy
      //   ? "Bạn có chắc chắn muốn chuyển trạng thái của thông tin này về chế độ công khai hay không?"
      //   : "Bạn có chắc chắn muốn chuyển trạng thái của thông tin này về chế độ riêng tư hay không?";
    },
  },
};
</script>
