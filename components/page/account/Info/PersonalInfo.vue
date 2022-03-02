<template>
  <sub-block-section :hasTitle="false">
    <template v-slot:content>
      <div class="form--normal pt-3 pb-4">
        <div class="row">
          <div id="label-verify-phone"></div>
          <div class="col-md-3">
            <label for class="form--normal__title">Ảnh đại diện</label>
          </div>
          <div class="col-md-9">
            <div class="app-input app-input--size-md">
              <upload-avatar :av-src="filterAvatarSrc"></upload-avatar>
            </div>
            <app-button
              nuxt
              style="position: absolute; right: 0.5rem; bottom: 2rem;"
              size="sm"
              :to="token ? '/' + token.id + '/info/change_pwd' : '/'"
            >
              <span class>Thay đổi mật khẩu</span>
            </app-button>
          </div>
          <div class="col-md-3">
            <label for class="form--normal__title">Họ và tên</label>
          </div>
          <div class="col-md-9">
            <app-input
              v-model="name"
              :validate="validateProps.name"
              :error="$v.name.$invalid"
              :message="errorMessage.name"
              @input="handleName"
              size="md"
            />
          </div>

          <div class="col-md-3">
            <label for class="form--normal__title">Số điện thoại</label>
          </div>
          <template v-if="checkPhone">
            <div class="col-md-9">
              <app-input v-model="filterPhone" disabled size="md" />
            </div>
          </template>
          <template v-else>
            <div class="col-md-9" v-if="!edittingPhone">
              <button v-if="!phone" class="button--pure mb-4 px-0" @click="edittingPhone = true">
                <span class="text-primary">Cập nhật số điện thoại</span>
              </button>
            </div>
            <div class="col-md-7" v-if="edittingPhone">
              <app-input
                v-model="phoneUpdate"
                maxlength="11"
                placeholder="Nhập số điện thoại"
                :validate="validateProps.phoneUpdate"
                :error="$v.phoneUpdate.$invalid"
                :message="errorMessage.phoneUpdate"
                @input="handlePhone"
                :onlyNumber="true"
                size="md"
              />
            </div>
            <div class="col-md-2" v-if="edittingPhone">
              <button class="button--pure" @click="savePhone" :disabled="disabledBtnSavePhone">
                <span :class="disabledBtnSavePhone ? 'text-base' : 'text-primary'">Lưu</span>
              </button>
              <button class="button--pure" @click="cancelEditPhone">
                <span class="text-base">Hủy</span>
              </button>
            </div>
          </template>
          <div class="col-md-3">
            <label for class="form--normal__title">Email</label>
          </div>
          <template v-if="checkEmail">
            <div class="col-md-9">
              <app-input v-model="filterEmail" disabled size="md" />
            </div>
          </template>
          <template v-else>
            <div class="col-md-9" v-if="!edittingEmail">
              <button v-if="!email" class="button--pure mb-4 px-0" @click="edittingEmail = true">
                <span class="text-primary">Cập nhật email</span>
              </button>
              <!-- <app-input v-model="emailUpdate" size="md" disabled /> -->
            </div>
            <div class="col-md-7" v-if="edittingEmail">
              <app-input
                v-model="emailUpdate"
                placeholder="Nhập email"
                :error="$v.emailUpdate.$invalid"
                :message="errorMessage.emailUpdate"
                :validate="validateProps.emailUpdate"
                @input="handleEmail"
                size="md"
              />
            </div>
            <div class="col-md-2" v-if="edittingEmail">
              <button class="button--pure" @click="saveEmail" :disabled="disabledBtnSaveEmail">
                <span :class="disabledBtnSaveEmail ? 'text-base' : 'text-primary'">Lưu</span>
              </button>
              <button class="button--pure" @click="cancelEditEmail">
                <span class="text-base">Hủy</span>
              </button>
            </div>
          </template>
          <div class="col-md-3">
            <label for class="form--normal__title">Giới tính</label>
          </div>
          <div class="col-md-2">
            <app-select
              placeholder="Lựa chọn"
              :options="sexOpts"
              :default-value="personalList && personalList.sex ? personalList.sex : null"
              @change="changeSex"
            />
          </div>

          <div class="col-md-1"></div>
          <div class="col-md-2">
            <label for class="form--normal__title">Ngày sinh</label>
          </div>
          <div class="col-md-3">
            <app-date-picker
              class="schedule-today-date-picker"
              v-model="birthday"
              @input="changeBirthday"
              valueFormat="DD/MM/YYYY"
              placeholder="DD/MM/YYYY"
            ></app-date-picker>
          </div>
          <div class="col-md-1"></div>
          <div class="col-md-3"></div>
          <div class="col-md-9 d-flex mt-4">
            <app-button color="primary" @click="handleUpdateProfile" :disabled="disabledBtnUpdate">
              <span>Lưu thay đổi</span>
            </app-button>
            <app-button
              class="btnAccountLink_account-info ml-auto"
              v-if="!filterLinkList"
              v-on:click="visible.addLink=true"
            >
              <slot name="icon">
                <IconInsertLink24px class="icon icon--btn icon--btn--pre" />
              </slot>
              <span>Liên kết trường học</span>
            </app-button>
          </div>
          <!-- <div class="col-md-9">
          </div>-->
          <!-- <div class="col-md-3" v-if="isTeacherRole">
            <label for class="form--normal__title">Tiểu sử</label>
          </div>
          <div class="col-md-9" v-if="isTeacherRole">
            <div v-if="story == null || story == ''">
              <app-button
                color="transparent"
                flat
                square
                style="box-shadow: none;"
                class="p-0"
                @click="addStory"
              >
                <slot name="icon">
                  <IconPlus
                    class="icon--btn icon--btn--pre fill-opacity-1"
                    style="height: 1.6rem; width: 1.6rem;"
                  />
                </slot>
                <span class="text-primary">Thêm tiểu sử</span>
              </app-button>
            </div>
            <div v-else>
              <div>
                <div class="box-content-fixed-height mb-4" v-if="!editingStory">
                  <div
                    class="overflow-y-scroll"
                    v-html="story"
                    style="max-height: 16rem; overflow-y: auto; margin-right: -5px;"
                  ></div>
                </div>
                <div class="d-flex" v-if="!editingStory">
                  <button class="btn-transparent btn--success mr-4" @click="editStory">
                    <IconEdit class />
                    <span>Chỉnh sửa</span>
                  </button>
                  <button class="btn-transparent btn--danger" @click="handleDeleteStory">
                    <IconTrashAlt class />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            </div>
            <AccountStoryForm
              v-if="editingStory"
              :story="story"
              :edit="checkEdit"
              @cancel="cancel"
              @submit="submitStory"
            ></AccountStoryForm>
          </div>-->
        </div>
      </div>
      <!--<div class="d-flex mt-4">-->
      <!--<app-button class="ml-auto" square>Lưu thay đổi</app-button>-->
      <!--</div>-->

      <AccountChangePasswordModal :visible="showChangePass" @click-close="showChangePass = false" />
      <account-link-modal
        :visible="visible.addLink"
        @cancel="closeLinkModal"
        @handleRefresh="handleRefresh"
        @ok="submitAddLink"
        @close="closeLinkModal"
      />
      <app-modal-notify
        v-if="visible.notify"
        :title="modalMes.notify"
        :type="modalStatus"
        @close="() => { visible.notify = false }"
        @ok="() => { visible.notify = false }"
      />
      <app-modal-otp
        :visible="modalOtp.showModalOTP"
        :error="modalOtp.errorOtp"
        :message="modalOtp.messageErrorOtp"
        @submit="submitOtp"
        @change="hanldeOtp"
        @close="closeModalOtp"
      />
      <app-modal-otp
        :visible="modalOtpPhone.showModalOtpPhone"
        :error="modalOtpPhone.errorOtpPhone"
        :message="modalOtpPhone.messageErrorPhone"
        @submit="submitOtpPhone"
        @change="hanldeOtpPhone"
        @close="closeModalOtpPhone"
      />
    </template>
  </sub-block-section>
</template>

<script>
import SchoolAccountSide from "~/components/page/school/SchoolAccountSide";
import AccountInfoStudent from "~/components/page/account/Info/AccountInfoStudent";
import UploadAvatar from "~/components/page/account/Info/UploadAvatar";
import AccountChangePasswordModal from "~/components/page/account/AccountChangePasswordModal";
import AccountLinkModal from "~/components/page/account/Info/AccountLinkModal";
import AccountStoryForm from "~/components/page/account/forms/AddAccountStory";
import * as actionTypes from "~/utils/action-types";
import { mapState, mapActions, mapGetters } from "vuex";
import IconPhoto from "~/assets/svg/icons/photo.svg?inline";
import IconInsertLink24px from "~/assets/svg/v2-icons/insert_link_24px.svg?inline";
import IconPlus from "~/assets/svg/design-icons/plus.svg?inline";
import IconEdit from "~/assets/svg/v2-icons/border_color_24px.svg?inline";
import IconTrashAlt from "~/assets/svg/design-icons/trash-alt.svg?inline";
import { get } from "lodash";
import { getDateBirthDay, getDateFormat } from "~/utils/moment";
import { getDeviceId } from "~/utils/auth";
import { RESPONSE_SUCCESS, TIMEOUT } from "~/utils/config";
import { removeTagHtml } from "~/utils/common";
import { formatPhoneNumber } from "~/utils/validations";
import firebase from "@/services/firebase/FirebaseInit";
import { ERRORS } from "~/utils/error-code";
import result from "../../../../store/elearning/teaching/result";
import moment from "moment";
import {
  required,
  minLength,
  maxLength,
  email,
} from "vuelidate/lib/validators";

export default {
  components: {
    IconPhoto,
    IconPlus,
    IconInsertLink24px,
    IconEdit,
    IconTrashAlt,
    SchoolAccountSide,
    AccountInfoStudent,
    AccountChangePasswordModal,
    AccountLinkModal,
    UploadAvatar,
    AccountStoryForm,
  },
  data() {
    return {
      isAuthenticated: true,
      name: "",
      phone: null,
      email: null,
      sex: "",
      birthday: "",
      showChangePass: false,
      accountLink: {
        list: "",
      },
      editingStory: false,
      avatar: [],
      avatarSrc: "",
      story: null,
      profileInfo: "",
      visible: {
        notify: false,
        addLink: false,
      },
      modalMes: {
        notify: "",
      },
      modalStatus: "success",
      payload: {
        code: "",
        g_recaptcha_response: "",
      },
      success: false,
      checkEdit: false,
      edittingPhone: false,
      edittingEmail: false,
      otpPhone: "",
      modalOtpPhone: {
        showModalOtpPhone: false,
        errorOtpPhone: false,
        messageErrorPhone: "",
      },
      otp: "",
      modalOtp: {
        showModalOTP: false,
        errorOtp: false,
        messageErrorOtp: "",
      },
      modalConfirmEmail: false,
      verify_token: "",
      phoneUpdate: "",
      emailUpdate: "",
      sexOpts: [
        { value: "male", text: "Nam" },
        { value: "female", text: "Nữ" },
      ],
      checkName: true,
      checkSex: true,
      checkBirthday: true,
      sexVal: null,
      validateProps: { name: "", phoneUpdate: "", emailUpdate: "" },
      validate: { name: true },
      errorMessage: {
        name: "",
        phoneUpdate: "",
        emailUpdate: "",
      },
    };
  },
  validations: {
    name: { required },
    phoneUpdate: {
      required,
      minLength: minLength(10),
      maxLength: maxLength(11),
    },
    emailUpdate: { required, email },
  },
  mounted() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "label-verify-phone",
      {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log("RecaptchaVerifier resolved");
        },
      }
    );
  },
  computed: {
    ...mapState("account", ["personalList", "profileList", "linkList"]),

    ...mapState("auth", ["token"]),
    ...mapGetters("auth", ["isTeacherRole", "isStudentRole"]),
    filterAvatarSrc() {
      return this.personalList &&
        this.personalList.avatar &&
        this.personalList.avatar.low
        ? this.personalList.avatar.low
        : "";
    },
    filterLinkList() {
      return this.linkList.data &&
        this.linkList.data.linked &&
        this.linkList.data.linked == true
        ? true
        : false;
    },
    checkPhone() {
      return this.personalList && this.personalList.phone_number ? true : false;
    },
    checkEmail() {
      return this.personalList && this.personalList.email ? true : false;
    },
    disabledBtnUpdate() {
      return this.edittingPhone || this.edittingEmail || this.checkName;
    },
    disabledBtnSavePhone() {
      const btnDisabled = this.$v.phoneUpdate.$invalid;
      return btnDisabled;
    },
    disabledBtnSaveEmail() {
      const btnDisabled = this.$v.emailUpdate.$invalid;
      return btnDisabled;
    },
    filterEmail() {
      return this.personalList && this.personalList.email
        ? this.personalList.email
        : "";
    },
    filterPhone() {
      return this.personalList && this.personalList.phone_number
        ? this.personalList.phone_number
        : "";
    },
  },
  created() {
    this.fetchProfile();
    // this.avatarSrc =
    //   this.personalList && this.personalList.avatar
    //     ? this.personalList.avatar.low
    //     : "https://picsum.photos/170/170";
  },
  methods: {
    ...mapActions("account", [
      "accountPersonalEditAvatar",
      "accountPersonalList",
      "accountBiographyAdd",
      "accountPersonalEditEmail",
      "verifyOtpEmail",
      "accountPersonalUpdatePhone",
      "accountPersonalEdit",
      "accountCheckPhoneNumber",
    ]),
    ...mapActions("auth", ["logout", "sendotp", "verifiOtp"]),

    handlePhone() {
      this.errorRespon = false;
      this.phoneUpdate = this.phoneUpdate.replace(/\D/g, "");
      this.validateProps.phoneUpdate = "";
      if (!this.$v.phoneUpdate.required) {
        this.validateProps.phoneUpdate = 2;
        this.errorMessage.phoneUpdate = "Trường này là bắt buộc";
      } else if (!this.$v.phoneUpdate.minLength) {
        this.validateProps.phoneUpdate = 2;
        this.errorMessage.phoneUpdate =
          "Số bạn nhập không phải là số điện thoại";
      } else if (!this.$v.phoneUpdate.maxLength) {
        this.validateProps.phoneUpdate = 2;
        this.errorMessage.phoneUpdate =
          "Số bạn nhập không phải là số điện thoại";
      } else {
        this.validateProps.phoneUpdate = 1;
        this.errorMessage.phoneUpdate = "";
      }
    },

    handleEmail() {
      this.errorRespon = false;
      this.validateProps.emailUpdate = "";
      if (!this.$v.emailUpdate.required) {
        this.validateProps.emailUpdate = 2;
        this.errorMessage.emailUpdate = "Trường này là bắt buộc";
      } else if (!this.$v.emailUpdate.email) {
        this.validateProps.emailUpdate = 2;
        this.errorMessage.emailUpdate = "Email không hợp lệ";
      } else {
        this.validateProps.emailUpdate = 1;
        this.errorMessage.emailUpdate = "";
      }
    },

    savePhone() {
      // this.showUpdatePhone = false;
      const dataPhone = {
        phone_number: `+${formatPhoneNumber(this.phoneUpdate)}`,
      };
      this.accountCheckPhoneNumber(dataPhone).then((result) => {
        if (result && result.data == true) {
          const data = {
            phone: `+${formatPhoneNumber(this.phoneUpdate)}`,
            appVerifier: window.recaptchaVerifier,
          };
          this.sendotp(data).then((res) => {
            if (!res.code) {
              this.modalOtpPhone.showModalOtpPhone = true;
            } else {
              this.modalOtpPhone.errorOtpPhone = true;
              this.modalOtpPhone.messageErrorPhone =
                "Đã có lỗi xin vui lòng thử lại.";
            }
          });
        }
        // else if (result && result.data == true) {
        //   this.validateProps.phoneUpdate = 2;
        //   this.errorMessage.phoneUpdate =
        //     "Số điện thoại đã tồn tại trên hệ thống.";
        // }
        else {
          this.showErrorCheckPhone(result.error);
        }
      });
    },

    async acceptOtpPhone() {
      await this.verifiOtp(this.otpPhone).then((result) => {
        console.log("result huydv", result);
        if (result && result.user) {
          this.verify_token = result.user ? result.user._lat : "";
          this.updatePhone();
        } else {
          this.showErrorOtp(result);
        }
      });
    },
    updatePhone() {
      this.accountPersonalUpdatePhone({
        firebase_token: this.verify_token,
      }).then((result) => {
        console.log("[result]", result);
        if (result.data) {
          this.modalOtpPhone.showModalOtpPhone = false;
          this.accountPersonalList();
          this.edittingPhone = false;
          this.$toasted.success("Cập nhật số điện thoại thành công");
          // this.edittingPhone = false;
          // this.notify = {
          //   redirectLink: "",
          //   message: "Bạn đã cập nhật thành công",
          //   showNotify: true,
          // };
          // const userId = this.personalList.id;
          // this.accountPersonalList(userId);
        } else {
          this.validatePhone = true;
          this.showErrorUpdatePhone(result);
        }
      });
    },

    saveEmail() {
      this.accountPersonalEditEmail({
        type: "email",
        value: this.emailUpdate,
      }).then((result) => {
        console.log("result", result);
        if (result.data) {
          this.modalConfirmEmail = true;
          this.modalOtp.showModalOTP = true;
        } else {
          this.showErrorCheckEmail(result.error);
        }
      });
    },
    async acceptOtpEmail() {
      const data = {
        email: this.emailUpdate,
        otp: Number(this.otp),
      };
      await this.verifyOtpEmail(data).then((result) => {
        console.log("[verifyOtpEmail] huydv", result);
        if (result.data) {
          this.edittingEmail = false;
          this.modalOtp.showModalOTP = false;
          this.modalSuccess = true;
          this.$toasted.success("Cập nhật email thành công");
          // const userId = this.personalList.id;
          this.accountPersonalList();
        } else {
          this.modalOtp.errorOtp = true;
          this.modalOtp.messageErrorOtp = "Mã OTP bạn nhập không chính xác";
          // this.showErrorUpdateEmail(result);
        }
      });
    },
    async fetchProfile() {
      await Promise.all([
        this.$store.dispatch(`account/${actionTypes.ACCOUNT_PROFILE.LIST}`),
        // this.$store.dispatch(`account/${actionTypes.ACCOUNT_LINK.LIST}`)
      ]);
    },
    closeNotify() {
      this.notify.showNotify = false;
    },
    closeLinkModal() {
      this.visible.addLink = false;
    },
    async handleRefresh() {
      this.fetchProfile();
    },
    async submitAddLink(code) {
      this.payload.g_recaptcha_response = await this.$recaptcha.execute();
      this.payload.code = code;
      const payload = this.payload;
      const res = await this.$store.dispatch(
        `account/${actionTypes.ACCOUNT_LINK.ADD}`,
        payload
      );
      if (get(res, "success", false)) {
        this.modalStatus = "success";
        this.modalMes.notify = "Liên kết thành công! Vui lòng đăng nhập lại";
        this.$nextTick(() => {
          this.resetCode();
          this.visible.addLink = false;
          this.visible.notify = true;
        });

        setTimeout(() => {
          // logout here
          const device_id = getDeviceId();
          this.logout({ device_id }).then((result) => {
            console.log("[handleLogout] result", result, device_id);
            if (result.success == RESPONSE_SUCCESS) {
              this.$router.push("/auth/signin");
            }
          });
        }, TIMEOUT.NOTIFY);
      } else {
        this.modalStatus = "error";
        this.modalMes.notify = "Liên kết không thành công!";
        this.$nextTick(() => {
          this.resetCode();
          this.visible.addLink = false;
          this.visible.notify = true;
        });
      }
      this.handleRefresh();
    },
    resetCode() {
      this.payload.code = "";
      this.payload.g_recaptcha_response = "";
    },
    addStory() {
      this.editingStory = true;
    },
    editStory() {
      this.editingStory = true;
    },
    submitStory(_data) {
      const data = {
        biography: _data,
      };
      this.accountBiographyAdd(data).then((result) => {
        if (result.success) {
          this.editingStory = false;
          this.$store.dispatch(`account/${actionTypes.ACCOUNT_PROFILE.LIST}`);
        }
      });
    },
    cancel() {
      this.editingStory = false;
    },
    handleDeleteStory() {
      const data = {
        biography: "",
      };
      this.accountBiographyAdd(data).then((result) => {
        if (result.success) {
          this.editingStory = false;
          this.$store.dispatch(`account/${actionTypes.ACCOUNT_PROFILE.LIST}`);
        }
      });
    },
    cancelEditPhone() {
      this.errorMessage.phoneUpdate = "";
      this.validateProps.phoneUpdate = 0;
      this.edittingPhone = false;
      this.phoneUpdate = "";
    },
    cancelEditEmail() {
      this.errorMessage.emailUpdate = "";
      this.validateProps.emailUpdate = 0;
      this.edittingEmail = false;
      this.emailUpdate = "";
    },
    showErrorUpdatePhone(error) {
      this.modalOtpPhone.errorOtpPhone = true;
      let message = "";
      switch (error.code) {
        case 409:
          message = "Số điện thoại đã tồn tại trên hệ thống";
          break;
        default:
          message = "Đã có lỗi xảy ra. Vui lòng thử lại sau";
          break;
      }
      this.modalOtpPhone.messageErrorPhone = message;
    },
    showErrorUpdateEmail(error) {
      this.modalOtp.errorOtp = true;
      let message = "";
      switch (error.code) {
        case ERRORS.REGISTER.REQUIRED:
          message =
            "Invalid parameter. Required: email or phone, g_recaptcha_response, password. verify_token is required if register by phone number";
          break;
        case ERRORS.REGISTER.PASSWORD_LEAST:
          message =
            "Invalid password. Password must at least 8 characters, include lowercase, uppercase and number";
          break;

        default:
          message = "Đã có lỗi xảy ra. Vui lòng thử lại sau";
          break;
      }
      this.modalOtp.messageErrorOtp = message;
    },
    showErrorOtp(error) {
      this.modalOtpPhone.errorOtpPhone = true;
      if (error && error.code == "auth/invalid-verification-code") {
        this.modalOtpPhone.messageErrorPhone = "Mã OTP bạn nhập không đúng";
      } else if (error && error.code == "auth/code-expired") {
        this.modalOtpPhone.messageErrorPhone = "Mã OTP của bạn nhập đã hết hạn";
      } else {
        this.modalOtpPhone.messageErrorPhone = "Có lỗi. Xin vui lòng thử lại";
      }
    },
    showErrorCheckPhone(error) {
      this.validateProps.phoneUpdate = 2;
      let message = "";
      switch (error && error.code) {
        case ERRORS.CHECK_PHONE.BEEN_TAKENS:
          message = "Số điện thoại đã tồn tại trên hệ thống";
          break;
        default:
          message = "Đã có lỗi xảy ra. Vui lòng thử lại sau";
          break;
      }
      this.errorMessage.phoneUpdate = message;
    },
    showErrorCheckEmail(error) {
      this.validateProps.emailUpdate = 2;
      let message = "";
      switch (error && error.code) {
        case ERRORS.CHECK_MAIL.BEEN_TAKENS:
          message = "Email đã tồn tại trên hệ thống";
          break;
        default:
          message = "Đã có lỗi xảy ra. Vui lòng thử lại sau";
          break;
      }
      this.errorMessage.emailUpdate = message;
    },
    submitOtp(_otp) {
      console.log("otp", _otp);
      this.otp = _otp;
      this.acceptOtpEmail();
    },
    submitOtpPhone(_otpPhone) {
      console.log("otpPhone", _otpPhone);
      this.otpPhone = _otpPhone;
      this.acceptOtpPhone();
    },
    hanldeEmail() {
      this.validateEmail = false;
    },
    hanldePhone() {
      this.validatePhone = false;
    },
    hanldeOtpPhone() {
      this.modalOtpPhone.errorOtpPhone = false;
      this.modalOtpPhone.messageErrorPhone = "";
    },
    hanldeOtp() {
      this.modalOtp.errorOtp = false;
      this.modalOtp.messageErrorOtp = "";
    },
    closeModalOtpPhone() {
      this.modalOtpPhone.showModalOtpPhone = false;
      this.otpPhone = "";
      this.modalOtpPhone.messageErrorPhone = "";
    },
    closeModalOtp() {
      this.modalOtp.showModalOTP = false;
      this.otp = "";
      this.modalOtp.messageErrorOtp = "";
    },
    closeNotify() {
      this.notify.showNotify = false;
    },
    handleUpdateProfile() {
      const data = {
        fullname: this.name,
        birthday: this.birthday
          ? moment(this.birthday, "DD/MM/YYYY").format("YYYY-MM-DD")
          : null,
        sex: this.sex ? this.sex : null,
      };
      this.accountPersonalEdit(data).then((result) => {
        if (result.data) {
          this.$toasted.success("Cập nhật thông tin cá nhân thành công");
          this.checkName = true;
          this.accountPersonalList();
        } else {
          this.$toasted.error(result.message);
        }
      });
    },
    handleName() {
      if (this.name) {
        this.checkName = false;
      } else {
        this.checkName = true;
      }
      this.validate.name = true;
      this.validateProps.name = "";
      if (!this.$v.name.required) {
        this.validateProps.name = 2;
        this.errorMessage.name = "Trường này không thể để trống";
      } else {
        this.errorMessage.name = "";
      }
    },
    changeSex(val) {
      this.sex = val;
      console.log("aaa", val);
      if (val && this.name) {
        this.checkName = false;
      }
    },
    changeBirthday() {
      this.checkName = false;
    },
  },
  watch: {
    profileList: {
      handler: function () {
        this.name = get(this, "personalList.fullname", "");
        this.phone = get(this, "personalList.phone_number", "");
        this.email = get(this, "personalList.email", "");
        this.address = get(this, "personalList.address", "");
        this.sex = get(this, "personalList.sex", null);
        this.birthday = getDateBirthDay(get(this, "personalList.birthday", ""));
        this.accountLink.list = get(this, "linkList.data", {});
        this.profileInfo = get(this, "profileList", {});
        this.story = get(this, "profileList.intro", null);
      },
    },
  },
};
</script>

<style lang="scss">
</style>
