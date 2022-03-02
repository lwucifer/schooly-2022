<template>
  <div class="social-account-intro">
    <h2 class="social-account-intro__title">Giới thiệu</h2>

    <!-- EMAIL -->
    <div class="social-account-intro__row" v-if="socialProfile.email">
      <IconEmail24px class="social-account-intro__icon icon fill-opacity-1" />

      <div class="social-account-intro__center">
        <h4 class="social-account-intro__center-title">Email</h4>

        <template v-if="editEmail">
          <app-input v-model="email" class="social-account-intro__control" />
          <app-divider color="disabled" class="social-account-intro__divider" />
          <div class="text-right">
            <app-button
              class="social-account-intro__btn mr-3"
              color="secondary"
              outline
              @click.prevent="setEditEmail(false)"
            >Hủy</app-button>
            <app-button class="social-account-intro__btn">Lưu</app-button>
          </div>
        </template>

        <div
          v-else
        >{{ userAccountProfile && userAccountProfile.social && userAccountProfile.social.email ? userAccountProfile.social.email : '' }}</div>
      </div>

      <div v-if="!editEmail" class="social-account-intro__right">
        <!-- <button class="social-account-intro__btn-edit" @click.prevent="setEditEmail(true)">
          <IconEdit24px class="icon fill-opacity-1" />
        </button>-->
        <AccountIntroPrivacy
          v-if="checkUuidUser"
          name="email"
          @dataPrivacy="dataPrivacy"
          :privacy="privacy_email"
        />
      </div>
    </div>
    <!-- END EMAIL -->

    <!-- PHONE -->
    <div class="social-account-intro__row" v-if="socialProfile.phone_number">
      <IconSmartPhone1 class="social-account-intro__icon phone icon fill-opacity-1" />

      <div class="social-account-intro__center">
        <h4 class="social-account-intro__center-title">Số điện thoại</h4>

        <!-- <template v-if="editPhone">
          <app-input v-model="phone" />
          <app-divider color="disabled" class="social-account-intro__divider" />
          <div class="text-right">
            <app-button color="secondary" outline @click.prevent="setEditPhone(false)">Hủy</app-button>
            <app-button class="ml-3">Lưu</app-button>
          </div>
        </template>-->

        <div>{{ userAccountProfile && userAccountProfile.social && userAccountProfile.social.phone ? userAccountProfile.social.phone : '' }}</div>
      </div>

      <div v-if="!editPhone" class="social-account-intro__right">
        <!-- <button class="social-account-intro__btn-edit" @click.prevent="setEditPhone(true)">
          <IconEdit24px class="icon fill-opacity-1" />
        </button>-->
        <AccountIntroPrivacy
          v-if="checkUuidUser"
          name="phone"
          @dataPrivacy="dataPrivacy"
          :privacy="privacy_phone"
        />
      </div>
    </div>
    <!-- END PHONE -->

    <!-- BIRTHDAY -->
    <div class="social-account-intro__row">
      <IconCalendarToday24px class="social-account-intro__icon icon fill-opacity-1" />

      <div class="social-account-intro__center">
        <h4 class="social-account-intro__center-title">Ngày sinh</h4>

        <template v-if="editBirthday">
          <div>
            <app-select
              v-model="birthdayDate"
              :options="dayOpts"
              class="mr-3"
              placeholder="Ngày"
              bordered
            />
            <app-select
              v-model="birthdayMonth"
              :options="monthOpts"
              class="mr-3"
              placeholder="Tháng"
              bordered
              @change="changeBirthdayMonth"
            />
            <app-select
              v-model="birthdayYear"
              :options="yearOpts"
              placeholder="Năm"
              bordered
              @change="changeBirthdayYear"
            />
          </div>
          <app-divider color="disabled" class="social-account-intro__divider" />
          <div class="text-right">
            <app-button color="secondary" outline @click.prevent="setEditBirthday(false)">Hủy</app-button>
            <app-button class="ml-3" @click.prevent="saveBirthday">Lưu</app-button>
          </div>
        </template>

        <div
          v-else
        >{{ userAccountProfile && userAccountProfile.social && userAccountProfile.social.birthday ? getDateBirthDayUTC(userAccountProfile.social.birthday): ''}}</div>
      </div>

      <div v-if="!editBirthday" class="social-account-intro__right">
        <button
          v-if="checkUuidUser"
          class="social-account-intro__btn-edit"
          @click.prevent="setEditBirthday(true)"
        >
          <IconEdit24px class="icon fill-opacity-1" />
        </button>
        <AccountIntroPrivacy
          v-if="checkUuidUser"
          name="birthday"
          @dataPrivacy="dataPrivacy"
          :privacy="privacy_birthday"
        />
      </div>
    </div>
    <!-- END BIRTHDAY -->

    <!-- SEX -->
    <div class="social-account-intro__row">
      <IconUser2 class="social-account-intro__icon user icon fill-opacity-1" />

      <div class="social-account-intro__center">
        <h4 class="social-account-intro__center-title">Giới tính</h4>

        <template v-if="editSex">
          <app-select v-model="sex" :options="sexOpts" placeholder="Giới tính" />
          <app-divider color="disabled" class="social-account-intro__divider" />
          <div class="text-right">
            <app-button color="secondary" outline @click.prevent="setEditSex(false)">Hủy</app-button>
            <app-button class="ml-3" @click.prevent="saveSex">Lưu</app-button>
          </div>
        </template>

        <div
          v-else
        >{{ userAccountProfile && userAccountProfile.social && userAccountProfile.social.sex ? userAccountProfile.social.sex == 'MALE' ? "Nam" : 'Nữ' : '' }}</div>
      </div>

      <div v-if="!editSex" class="social-account-intro__right">
        <button
          v-if="checkUuidUser"
          class="social-account-intro__btn-edit"
          @click.prevent="setEditSex(true)"
        >
          <IconEdit24px class="icon fill-opacity-1" />
        </button>
        <AccountIntroPrivacy
          v-if="checkUuidUser"
          name="sex"
          @dataPrivacy="dataPrivacy"
          :privacy="privacy_sex"
        />
      </div>
    </div>
    <!-- END SEX -->

    <!-- ADDRESS -->
    <div class="social-account-intro__row">
      <IconMapPin1 class="social-account-intro__icon pin icon fill-opacity-1" />

      <div class="social-account-intro__center">
        <h4 class="social-account-intro__center-title">Địa chỉ</h4>

        <template v-if="editAddress">
          <app-input v-model="address" placeholder="Địa chỉ" />
          <app-divider color="disabled" class="social-account-intro__divider" />
          <div class="text-right">
            <app-button color="secondary" outline @click.prevent="setEditAddress(false)">Hủy</app-button>
            <app-button class="ml-3" @click.prevent="saveAddress">Lưu</app-button>
          </div>
        </template>

        <div
          v-else
        >{{ userAccountProfile && userAccountProfile.social && userAccountProfile.social.address ? userAccountProfile.social.address : '' }}</div>
      </div>

      <div v-if="!editAddress" class="social-account-intro__right">
        <button
          v-if="checkUuidUser"
          class="social-account-intro__btn-edit"
          @click.prevent="setEditAddress(true)"
        >
          <IconEdit24px class="icon fill-opacity-1" />
        </button>
        <AccountIntroPrivacy
          v-if="checkUuidUser"
          name="address"
          @dataPrivacy="dataPrivacy"
          :privacy="privacy_address"
        />
      </div>
    </div>
    <!-- END ADDRESS -->
    <app-modal-confirm
      centered
      v-if="modalConfirmPrivacy"
      title
      :description="modalConfirmDescription"
      @ok="handlePrivacy"
      @cancel="modalConfirmPrivacy = false"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import IconEmail24px from "~/assets/svg/v2-icons/email_24px.svg?inline";
import IconEdit24px from "~/assets/svg/v2-icons/edit_24px.svg?inline";
import IconCalendarToday24px from "~/assets/svg/v2-icons/calendar_today_24px.svg?inline";
import IconMapPin1 from "~/assets/svg/v2-icons/map-pin-1.svg?inline";
import IconUser2 from "~/assets/svg/v2-icons/user-2.svg?inline";
import IconSmartPhone1 from "~/assets/svg/v2-icons/smart-phone-1.svg?inline";
import AccountIntroPrivacy from "~/components/page/social/account/AccountIntroPrivacy";
import { monthOpts } from "~/utils/constants";
import { getDateBirthDayUTC } from "~/utils/moment";
import moment from "moment";

export default {
  components: {
    IconEmail24px,
    IconEdit24px,
    IconCalendarToday24px,
    IconMapPin1,
    IconUser2,
    IconSmartPhone1,
    AccountIntroPrivacy,
  },

  data() {
    return {
      editEmail: false,
      editPhone: false,
      editBirthday: false,
      editSex: false,
      editAddress: false,
      email: "",
      phone: "",
      birthdayDate: null,
      birthdayMonth: null,
      birthdayYear: null,
      sex: null,
      address: "60A Nguyễn Khang",
      dayOpts: [],
      monthOpts: monthOpts,
      yearOpts: [],
      sexOpts: [
        {
          value: "male",
          text: "Nam",
        },
        {
          value: "female",
          text: "Nữ",
        },
      ],
      modalConfirmPrivacy: false,
      modalConfirmDescription: "",
      privacy_email: 0,
      privacy_sex: 0,
      privacy_address: 0,
      privacy_birthday: 0,
      privacy_phone: 0,
      nameRadio: "",
    };
  },

  computed: {
    ...mapState("social/account/profile", [
      "socialProfile",
      "userAccountProfile",
    ]),
    ...mapState("account", ["profileList"]),
    ...mapGetters("auth", ["isTeacherRole", "isStudentRole", "uuidUser"]),
    checkUuidUser() {
      return this.$route.params.uuid == this.uuidUser;
    },
  },

  created() {
    this.getDayOpts(31);
    this.getYearOpts();
    this.birthdayDate =
      this.socialProfile && this.socialProfile.birthday
        ? moment(this.socialProfile.birthday).date()
        : null;
    this.birthdayMonth =
      this.socialProfile && this.socialProfile.birthday
        ? moment(this.socialProfile.birthday).month() + 1
        : null;
    this.birthdayYear =
      this.socialProfile && this.socialProfile.birthday
        ? moment(this.socialProfile.birthday).year()
        : null;
    this.sex =
      this.socialProfile && this.socialProfile.sex
        ? this.socialProfile.sex
        : null;
    this.privacy_email =
      this.userAccountProfile.privacy &&
      this.userAccountProfile.privacy.privacy_email
        ? this.userAccountProfile.privacy.privacy_email == true
          ? 1
          : 0
        : 0;
    this.privacy_phone =
      this.userAccountProfile.privacy &&
      this.userAccountProfile.privacy.privacy_phone
        ? this.userAccountProfile.privacy.privacy_phone == true
          ? 1
          : 0
        : 0;
    this.privacy_sex =
      this.userAccountProfile.privacy &&
      this.userAccountProfile.privacy.privacy_sex
        ? this.userAccountProfile.privacy.privacy_sex == true
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
    this.privacy_birthday =
      this.userAccountProfile.privacy &&
      this.userAccountProfile.privacy.privacy_birthday
        ? this.userAccountProfile.privacy.privacy_birthday == true
          ? 1
          : 0
        : 0;
  },

  methods: {
    ...mapActions("account", ["accountPersonalEdit", "accountPersonalList"]),
    ...mapActions("social/account/profile", [
      "getAccountProfile",
      "editAccountPrivacy",
    ]),
    async saveBirthday() {
      const data = {
        birthday:
          this.birthdayYear.toString() +
          "-" +
          (this.birthdayMonth < 10
            ? (0 + "" + this.birthdayMonth).toString()
            : this.birthdayMonth.toString()) +
          "-" +
          (this.birthdayDate < 10
            ? (0 + "" + this.birthdayDate).toString()
            : this.birthdayDate.toString()),
      };
      await this.saveProfile(data);
    },
    async saveSex() {
      const data = {
        sex: this.sex,
      };
      await this.saveProfile(data);
    },
    async saveAddress() {
      const data = {
        address: this.address,
      };
      await this.saveProfile(data);
    },
    saveProfile(data) {
      this.accountPersonalEdit(data).then((result) => {
        console.log("result", result);
        if (result.data) {
          this.getAccountProfile({
            uuid:
              this.$route.params.uuid == this.uuidUser
                ? null
                : this.$route.params.uuid,
          });
          this.$nextTick(() => {
            if (this.editBirthday == true) {
              this.$toasted.success("Cập nhật ngày sinh thành công");
              this.editBirthday = false;
            } else if (this.editSex == true) {
              this.$toasted.success("Cập nhật giới tính thành công");
              this.editSex = false;
            } else {
              this.$toasted.success("Cập nhật địa chỉ thành công");
              this.editAddress = false;
            }
          });
        } else {
          this.$toasted.error(result.error.message);
        }
      });
    },
    setEditEmail(isEdit) {
      this.editEmail = isEdit;
      this.email = isEdit ? this.socialProfile.email : "";
    },

    setEditPhone(isEdit) {
      this.editPhone = isEdit;
      this.phone = isEdit ? this.socialProfile.phone_number : "";
    },

    setEditBirthday(isEdit) {
      this.editBirthday = isEdit;
      // this.birthday = isEdit ? this.socialProfile.birthday: "";
    },

    setEditSex(isEdit) {
      this.editSex = isEdit;
    },

    setEditAddress(isEdit) {
      this.editAddress = isEdit;
      this.address = isEdit ? this.socialProfile.address : "";
    },
    changeBirthdayMonth(val) {
      this.dayOpts = [];
      const dayInMonth =
        this.birthdayYear && this.birthdayMonth
          ? moment(
              `'${this.birthdayYear}-${
                this.birthdayMonth < 10
                  ? `0${this.birthdayMonth}`
                  : this.birthdayMonth
              }'`
            ).daysInMonth()
          : null;
      this.birthdayDate =
        dayInMonth <= this.birthdayDate ? dayInMonth : this.birthdayDate;
      // console.log("dayInMonth", dayInMonth);
      if (dayInMonth) {
        this.getDayOpts(dayInMonth);
      } else {
        this.getDayOpts(31);
      }
    },

    changeBirthdayYear() {
      this.dayOpts = [];
      const dayInMonth =
        this.birthdayYear && this.birthdayMonth
          ? moment(
              `'${this.birthdayYear}-${
                this.birthdayMonth < 10
                  ? `0${this.birthdayMonth}`
                  : this.birthdayMonth
              }'`
            ).daysInMonth()
          : null;
      this.birthdayDate =
        dayInMonth <= this.birthdayDate ? dayInMonth : this.birthdayDate;
      console.log("dayInMonth", dayInMonth);
      if (dayInMonth) {
        this.getDayOpts(dayInMonth);
      } else {
        this.getDayOpts(31);
      }
    },

    getDayOpts(endDay) {
      for (let i = 1; i <= endDay; i++) {
        this.dayOpts.push({
          value: i,
          text: i,
        });
      }
    },
    getYearOpts() {
      console.log("moment year", moment().year());
      const year = moment().year();
      for (let i = year; i >= year - 100; i--) {
        this.yearOpts.push({
          value: i,
          text: i,
        });
      }
    },
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
    getDateBirthDayUTC,
  },
  watch: {
    // birthdayMonth(newVal) {
    //   // console.log("newVal", newVal);
    // },
  },
};
</script>
