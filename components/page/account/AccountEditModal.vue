<template>
  <div>
    <app-modal
      centered
      :width="606"
      :component-class="{ 'account-edit-modal': true }"
      v-if="visible"
      :footer="false"
      :header="false"
    >
      <!-- @close="$router.push('/')" -->
      <div slot="content">
        <h3>Chỉnh sửa thông tin</h3>
        <app-input disabled labelBold labelFixed type="text" :value="email" label="Email" />
        <div class="row">
          <div class="col-6">
            <app-input
              disabled
              labelBold
              labelFixed
              type="text"
              :value="phone_number"
              label="Số điện thoại"
            />
          </div>
          <div class="col-6">
            <app-input
              labelBold
              labelFixed
              type="date"
              class="input-date"
              v-model="birthday"
              label="Ngày sinh"
            />
          </div>
        </div>
        <app-input
          labelBold
          labelFixed
          type="text"
          v-model="address"
          label="Địa chỉ"
          :error="error"
          :message="messageError"
          :validate="validate"
          @input="hanldeAddress"
        />
        <div class="form-group">
          <label class="app-input__label app-input__label--bold app-input__label--fixed">Giới tính</label>
          <app-select-sex v-model="sex" :sex="sex" class="form-control max-w-170" />
        </div>

        <div class="text-center">
          <app-button size="lg" color="info" class="mr-3" square @click="closeModal">Hủy bỏ</app-button>
          <app-button size="lg" square @click="save()">Cập nhật thông tin</app-button>
        </div>
      </div>
    </app-modal>
    <app-modal-notify
      v-if="notify.showNotify"
      :title="notify.message"
      @close="closeNotify"
      @ok="closeNotify"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import {
  getDateBirthDay,
  getDateUpdateProfile,
  getDateFormat
} from "~/utils/moment";
import { ERRORS } from "~/utils/error-code";
import { APP_INPUT_VALIDATE_STATUS as VALIDATE_STATUS } from "~/utils/constants";
export default {
  components: {},
  props: {
    visible: Boolean
  },
  data() {
    return {
      sex: "",
      email: "",
      phone_number: "",
      address: "",
      birthday: "",
      error: false,
      messageError: "",
      validate: "",
      modalSuccessUpdate: "",
      notify: {
        redirectLink: "",
        message: "",
        showNotify: false
      }
    };
  },
  methods: {
    ...mapActions("account", ["accountPersonalEdit", "accountPersonalList"]),
    save() {
      console.log(this.sex);
      const data = {
        sex: this.sex,
        address: this.address,
        birthday: getDateFormat(this.birthday)
      };
      this.accountPersonalEdit(data).then(result => {
        console.log("[accountPersonalEdit]", result);
        if (result.success == true) {
          this.$emit("click-close");
          const userId = this.personalList.id;
          this.accountPersonalList(userId);
          this.notify = {
            redirectLink: "",
            message: "Bạn đã cập nhật thành công",
            showNotify: true
          };
        } else {
          this.validate = VALIDATE_STATUS.ERROR;
          this.showErrorUpdate(result);
        }
      });
    },
    showErrorUpdate(error) {
      this.error = true;
      let message = "";
      switch (error.code) {
        case ERRORS.UPDATE_PROFILE.ADDRESS_REQUIRED:
          message = "Địa chỉ không được để trống";
          break;
          message = "Đã có lỗi xảy ra. Vui lòng thử lại sau";
          break;
      }
      this.messageError = message;
    },
    hanldeAddress() {
      this.reset();
    },
    closeModal() {
      this.$emit("click-close");
      // this.reset();
    },
    reset() {
      this.error = false;
      this.messageError = "";
      this.validate = VALIDATE_STATUS.DEFAULT;
    },
    closeNotify() {
      this.notify.showNotify = false;
    }
  },

  computed: {
    ...mapState("account", ["personalList"])
  },

  created() {
    this.sex = this.personalList.sex;
    this.email = this.personalList.email || "";
    this.phone_number = this.personalList.phone_number || "";
    this.address = this.personalList.address || "";
    this.birthday = getDateFormat(this.personalList.birthday);
  }
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/account/_account-edit-modal.scss";
</style>