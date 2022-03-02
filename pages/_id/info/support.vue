<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <SchoolAccountSide :active="7" v-if="isTeacherRole || isStudentRole" />
        <SchoolAccountCustomerSide v-else/>
      </div>

      <div class="col-md-9">
        <div class="support-wrapper">
          <div class="support">
            <h3 class="support__title">Đặt câu hỏi</h3>

            <div class="support__form bg-white">
              <div class="form-group d-flex d-flex align-items-center">
                <div class="form-name">Email <span>*</span></div>

                <div class="form-input">
                  <app-input
                    class="mb-0"
                    size="md"
                    type="email"
                    placeholder="Nhập email"
                    v-model="email"
                    :validate="validateProps.email"
                    :error="$v.email.$invalid || validate.email"
                    :message="errorMessage.email"
                    @input="handleEmail"
                  />
                </div>
              </div>

              <div class="form-group d-flex d-flex align-items-center">
                <div class="form-name">Chủ đề <span>*</span></div>

                <div class="form-input">
                  <app-input
                    class="mb-0"
                    size="md"
                    type="title"
                    placeholder="Nhập chủ đề"
                    v-model="title"
                    :validate="validateProps.title"
                    :error="$v.title.$invalid || validate.title"
                    :message="errorMessage.title"
                    @input="handleTitle"
                  />
                </div>
              </div>

              <div class="form-group d-flex align-items-start">
                <div class="form-name mt-3">Mô tả chi tiết <span>*</span></div>

                <div class="form-input">
                  <textarea
                    :class="{'content-error' : validate.content, 'content-success' : contentSuccess}"
                    name=""
                    id=""
                    rows="10"
                    placeholder="Nhập mô tả chi tiết"
                    v-model="content"
                    @input="handleContent"
                    @blur="handleContent"
                  ></textarea>
                  <app-error :error="errorMessage.content"></app-error>
                </div>
              </div>

              <div class="form-group d-flex mb-0">
                <div class="form-name"></div>
                <div class="form-input">
                  <div v-if="fileName" style="color: blue">
                    {{ fileName }}
                  </div>
                  <div class="upload d-flex align-items-center">
                    <app-upload
                      accept=".jpg, .png, .pdf, .docx, .xlsx"
                      :showIcon="false"
                      title="+ Attach file"
                      :inputText="false"
                      @change="handleSelectFile"
                    />

                    <span class="font-italic">Các định dạng file được chấp nhận: JPG, PNG, PDF, WORD, EXCEL.</span>
                  </div>

                  <app-button
                    size="md"
                    color="primary"
                    :disabled="disabledBtn"
                    @click.prevent="handleSend"
                    >Gửi câu hỏi</app-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <app-modal-notify
      centered
      v-if="inputCodeSuccess"
      type="success"
      title="Gửi câu hỏi thành công!"
      @ok="inputCodeSuccess = false"
      @close="closeModalNoti"
    />
  </div>
</template>

<script>
import SchoolAccountSide from "~/components/page/school/SchoolAccountSide";
import SchoolAccountCustomerSide from "~/components/page/school/SchoolAccountCustomerSide";
import { mapActions, mapGetters } from "vuex";
import { required } from "vuelidate/lib/validators";
import { validateEmail } from "~/utils/validations";
import { toNumber, get, cloneDeep, trim } from "lodash";
const STORE_INFO = "info/support";

export default {
  components: {
    SchoolAccountSide,
    SchoolAccountCustomerSide
  },

  data() {
    return {
      email: "",
      title: "",
      content: "",
      contentSuccess: false,
      fileUpload: '',
      fileName: '',
      inputCodeSuccess:false,
      errorMessage: {
        email: "",
        title: "",
        content: "",
      },
      validateProps: { email: "", title: "" },
      validate: { email: true, title: true, content: false },
    };
  },

  validations: {
    email: { required },
    title: { required },
    content: { required },
  },

  computed: {
    ...mapGetters("auth", ["isTeacherRole", "isStudentRole"]),
    disabledBtn() {
      const btnDisabled =
        this.$v.$invalid ||
        this.validate.title ||
        this.validate.content;
      return btnDisabled;
    }
  },
  
  methods: {
    ...mapActions(STORE_INFO, ["infoSupport"]),

    handleSend() {
      const body = new FormData();
      body.append("attachment", this.fileUpload);
      body.append("email", this.email);
      body.append("title", this.title);
      body.append("content", this.content);
      console.log("send body", body);
      this.infoSupport(body).then(result => {
        if (result.success == true) {
          this.inputCodeSuccess = true;
          this.clearForm();
        } else {
          this.$toasted.error(result.message);
        }
      });
    },

    handleEmail(_email) {
      this.validate.email = true;
      this.validateProps.email = "";
      if (!this.$v.email.required) {
        this.validateProps.email = 2;
        this.errorMessage.email = "Trường này là bắt buộc";
      } else if (validateEmail(_email)) {
        this.validateProps.email = 1;
        this.validate.email = false;
        this.errorMessage.email = "";
      } else if (!validateEmail(_email)) {
        this.validateProps.email = 2;
        this.errorMessage.email = "Email phải phập đúng định dạng";
      }
    },

    handleTitle(_title) {
      this.validate.title = true;
      this.validateProps.title = "";
      if (!this.$v.title.required) {
        this.validateProps.title = 2;
        this.errorMessage.title = "Trường này là bắt buộc";
      } else if (_title.length > 150) {
        this.validateProps.title = 2;
        this.errorMessage.title = "Chủ đề không được lớn hơn 150 ký tự";
      } else {
        this.validateProps.title = 1;
        this.validate.title = false;
        this.errorMessage.title = "";
      }
    },
    handleContent(_content) {
      let value = _content.target.value;
      if (!this.$v.content.required) {
        this.errorMessage.content = "Trường này là bắt buộc";
        this.validate.content = true;
        this.contentSuccess = false
      } else if (value.length > 1000) {
        this.errorMessage.content = "Chủ đề không được lớn hơn 1000 ký tự";
        this.validate.content = true;
        this.contentSuccess = false;
      } else {
        this.errorMessage.content = "";
        this.validate.content = false;
        this.contentSuccess = true;
      }
    },

    handleSelectFile(files) {
      console.log("files", files[0]);
      this.fileUpload = files[0];
      this.fileName = this.fileUpload.name;
      console.log("this.fileUpload", this.fileUpload);
    },

    selectImage(){
      console.log('selectImage')
    },

    clearForm(){
      this.email = '';
      this.title = '';
      this.content = '';
      this.fileUpload = '';
      this.fileName = '';
      this.validateProps.email = "";
      this.validateProps.title = "";
      this.contentSuccess = false;
    },

    closeModalNoti() {
      this.inputCodeSuccess = false;
    },

  },
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/pages/id/info/_support.scss";
</style>
