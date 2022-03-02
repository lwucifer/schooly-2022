<template>
  <app-modal
      centered
      :width="750"
      :component-class="{ 'invite-student-modal': true }"
      :footer="false"
      @close="close(false)"
      title="Tải tài liệu"
    >
        <div slot="content">
            <div
            class="upload-repository__box upload-repository__box--upload"
            @drop="handleDrop"
            @dragover="handleDragover"
            @dragenter="handleDragover"
            >
            <!--Upload notification-->
            <div class="upload-alert" v-show="payload.doc">
                <!--Upload fail-->
                <div class="upload-alert--error" v-if="isError">
                <div class="upload-alert--error__info mb-2">
                    <div style="line-height: 100%;">
                    <IconCloseOutline class="icon icon--close-alert"/>
                    </div>
                    <div>
                    <span class="upload-alert--error__mess">{{ get(error, 'message', '') }}</span>
                    </div>
                </div>
            
                <div class="upload-alert--error__status">
                    {{ get(error, 'reason', '') }}
                </div>
                </div>
        
                <!--Upload success-->
                <div class="upload-alert--success">
                <p class="upload-alert--success__title">
                    <IconSuccess class="icon" width="30" height="30" style="height: 1.8rem; width: 1.8rem;"/>
                    <span>
                    Tải lên thành công
                    </span>
                </p>
                <p class="file-name text-center" :title="currentFile.name">{{ currentFile.name | truncStrFilter(35) }}</p>
                </div>
        
                <!--Button continue uploading-->
                <div class="text-center">
                <app-button
                    @click="uploadOther"
                    normal
                    class="btn--other-file font-weight-medium px-4"
                    size="sm"
                >
                    <slot name="icon">
                    <IconUploadFile class="icon--btn icon--btn--pre" style="height: 17px;"/>
                    </slot>
                    <span>Tải lên một file khác</span>
                </app-button>
                </div>
            </div>
        
            <!--Uploading-->
            <div class="py-3" v-if="isUploading">
                <p class="file-name mb-2" :title="currentFile.name"><b>{{ currentFile.name | truncStrFilter(35) }}</b></p>
                <div class="mb-2" style="padding-right: 2.7rem; position: relative">
                <div>
                    <app-progress
                    :percentage="uploadPercentage"
                    rounded
                    size="lg"
                    :inner-options="{ 'background-color': '#6FDA44' }"
                    >
                    </app-progress>
                </div>
                <IconCloseOutline class='icon icon-uploading-cancel' title="Hủy" @click="cancelUpload"/>
                </div>
                <p class="process--upload__status">
                <span>Đang tải lên {{ uploadPercentage }}</span>% - <span>{{ uploadSpeed }}</span> (<span>{{ this.currentFile.size | fileSizeFilter }}</span>)
                </p>
            </div>
        
            <!--Drag & drop file-->
            <div class="text-center" v-if="!payload.doc">
                <p class="mb-3 text-instruction">Click để chọn tập tin hoặc kéo thả tập tin vào đây để tải lên.</p>
                <app-button
                @click="handleUpload"
                normal
                class="font-weight-medium px-4 mb-3"
                size="sm"
                >
                <slot name="icon">
                    <IconUploadFile class="icon--btn icon--btn--pre" style="height: 17px;"/>
                </slot>
                <span>Tải lên</span>
                </app-button>
                <div style="font-size: 1.1rem; opacity: 0.5; line-height: 1.3rem;">
                <span>
                    Xem các định dạng file được chấp nhận
                    <v-popover
                    class="d-inline"
                    offset="10"
                    trigger="hover"
                    placement="top"
                    popover-class="tooltip--available-file"
                    >
                    <IconInfo class="" style="width: 1.3rem; height: 1.3rem; margin-bottom: -2px;"/>
                    <template slot="popover" class="tooltip-detail">
                        <div>
                        <p class="mb-3">
                            Định dạng file văn bản được chấp nhận:
                            <span class="text-dark font-weight-semi-bold">.doc, .docx, .pdf, .rtf , .txt, .csv, .xls, .xlsx, .ppt, .pptx, odt, odp, .ods, .zip</span>
                        </p>
                        <p>
                            Định dạng video được chấp nhận:
                            <span class="text-dark font-weight-semi-bold">.mp4, .f4v, .mov, .m4a, .m4v, .mp4a, .mp4v, .3gp, .3g2, .flv, .smil</span>
                        </p>
                        </div>
                    </template>
                    </v-popover>
                </span>
                </div>
                <!--<div>-->
                <!--<button-->
                    <!--class="btnUploadFile__ElearningManager"-->
                    <!--@click="handleUpload"-->
                <!--&gt;-->
                    <!--<IconUploadFile class="iconUploadFile__ElearningManager"/>-->
                <!--</button>-->
                <!--</div>-->
                <input
                ref="upload-input"
                type="file"
                accept=".m4a, .mp3, .jpeg, .jpg, .png, .gif, .bmp, .docx, .doc, .ppt, .pptx, .pdf, .txt, .mp4, .mov, .f4v, .m4v, .mp4a, .mp4v, .3gp, .3g2, .smil, .flv, .zip"
                @change="handleClick"
                />
            </div>
            <hr class="my-3"/>
            <div>
                <p class="font-weight-medium text-dark">Tài liệu thuộc</p>
                <div class="d-flex mt-3">
                    <app-vue-select
                        class="app-vue-select form-item__selection mr-3"
                        style="width: 19rem"
                        placeholder="Bài giảng/khóa học"
                        has-border
                        :all-opt="nullOpt2"
                        :options="[nullOpt2,...elearingList]"
                        :reduce="item => item.id"
                        label="name"
                        @input="handleSelectCourse"
                    ></app-vue-select>
                    <app-vue-select
                      class="app-vue-select form-item__selection mr-3"
                      style="width: 23rem"
                      label="text"
                      placeholder="Chọn lớp học/nhóm học tập"
                      :all-opt="nullOpt"
                      :options="[nullOpt,...groupClsOpts]"
                      @input="handleSelectCG"
                      has-border
                  ></app-vue-select>
                  <app-vue-select
                      class="app-vue-select form-item__selection"
                      style="width: 18rem"
                      placeholder="Môn học"
                      has-border
                      :all-opt="nullOpt2"
                      :options="[nullOpt2,...subjectList]"
                      label="name"
                      @input="handleSelectSubject"
                  ></app-vue-select>
                </div>
            </div>
            </div>
            <div class="text-center mt-4">
                <app-button 
                    color="white"
                    size="sm"
                    class="mr-3"
                    :disabled="loading"
                    @click="close(false)"
                >
                    Hủy
                </app-button>
                <app-button @click="confirm"
                    :disabled="!payload.doc"
                    :loading="loading"
                    size="sm"
                >
                    Xác nhận
                </app-button>
            </div>
        </div>
    </app-modal>

</template>

<script>
  import IconUploadFile from "~/assets/svg/v2-icons/cloud_upload_24px.svg?inline"
  import IconInfo from "~/assets/svg/v2-icons/info_24px.svg?inline"
  import IconCloseOutline from '~/assets/svg/icons/Close-outline.svg?inline'
  import IconClose from '~/assets/svg/icons/close.svg?inline'
  import IconSuccess from '~/assets/svg/icons/success.svg?inline'
  import {createPayloadAddRepository} from "~/models/elearning/Repository"
  import {get} from "lodash"
  import { fileSizeFilter } from "~/plugins/filters";
  import * as yup from "yup";
import * as mutationTypes from "~/utils/mutation-types";
import * as actionTypes from "~/utils/action-types";
  import { MAX_UPLOADED_REPOSITORY_FILE_SIZE } from "~/utils/config"
  import { mapState, mapGetters, mapActions, mapMutations } from "vuex"
  const schema = yup.object().shape({
    name: yup.string().required(),
    // file: yup.object().required()
  });

  const STORE_NAMESPACE = 'elearning/teaching/repository-files'
  const DEFAULT_ERROR_MESSAGE = 'Tải lên không thành công'
  const DEFAULT_ERROR_REASON = 'Xảy ra lỗi'

  const STATUS = {
    INITIAL: 0,
    ERROR: 1,
    SUCCESS: 2,
    UPLOADING: 3
  }

  export default {
    data() {
      return {
        nullOpt: {
          value: null,
          text: 'Bỏ chọn'
        },
        nullOpt2: {
          id: null,
          name: 'Bỏ chọn'
        },
        payload: {
          doc: '',
          elearning_id:null,
          group_id: null,
          class_id: null
        },
        error: {
          message: '',
          reason: ''
        },
        currentFile: {},
        uploadPercentage: 0,
        loadedPayload: 0,
        uploadTimestamp: 0,
        diffTimestamp: 1,
        diffPayload: 0,
        currentStatus: 0,
        cancelUploadToken: null,
        isLoadingContent: false,
        loading: false,
      }
    },
    props: {
      multiple: Boolean,
      beforeUpload: Function, // eslint-disable-line
      onSuccess: Function,// eslint-disable-line,
      maxCapacity: {
        type: Number|String,
        required: true
      },
      usedCapacity: {
        type: Number|String,
        required: true
      }
    },
    components: {
      IconUploadFile,
      IconInfo,
      IconCloseOutline,
      IconClose,
      IconSuccess
    },
    
    computed: {
      ...mapState("auth", {
        userLogin: "token"
      }),
      ...mapState("elearning/teaching/elearning",{
        elearnings: "elearnings"
      }),
      ...mapState("elearning/create", {subjects:"subjects"}),
      ...mapGetters('elearning', {
          groupClsAllOpts: 'groupClsOpts'
      }),
      groupClsOpts() {
        const data = this.groupClsAllOpts.filter(item => item.value)
        return data
      },
      subjectList(){
        return this.subjects ? this.subjects : []
      },
      elearingList(){
        return this.elearnings ? this.elearnings.data.content : []
      },
      capcityPercentage() {
        if (this.maxCapacity) {
          return parseFloat((this.usedCapacity/this.maxCapacity)*100).toFixed(2)
        }
        return 0
      },
      availableCapcity() {
        return this.maxCapacity - this.usedCapacity
      },
      uploadSpeed: function() {
        return `${Number((this.diffPayload / this.diffTimestamp).toFixed(1))} KB/s`
      },
      isInitial: function () {
        return this.currentStatus == STATUS['INITIAL']
      },
      isError: function () {
        return this.currentStatus == STATUS['ERROR']
      },
      isSuccess: function () {
        return this.currentStatus == STATUS['SUCCESS']
      },
      isUploading: function () {
        return this.currentStatus == STATUS['UPLOADING']
      }
    },
    watch: {
      uploadTimestamp: function(newVal, oldVal) {
        this.diffTimestamp = newVal - oldVal
      },
      loadedPayload: function(newVal, oldVal) {
        this.diffPayload = newVal - oldVal
      }
    },
    methods: {
      ...mapActions('elearning', {
          getClsGroups: actionTypes.TEACHER_CLASS_GROUP.LIST
      }),
      close(status) {
        if (this.loading) return
        this.$emit('close', status)
      },
      async getListCG() {
          try {
              this.isLoadingContent = true;
              const params = {
                  type: null,
                  schoolyear_id: null
              };
              const res = await this.getClsGroups({ params: params });
          } catch (error) {
              this.$toasted.error('Lỗi lấy dữ liệu lớp/nhóm học tập');
          } finally {
              this.isLoadingContent = false;
          }
      },
      async confirm() {
        try {
          this.loading = true;
          const that = this;
          let params = {};

          if (this.payload.group_id) params.group_ids = JSON.stringify([{id: get(this.payload, 'group_id', null)}])
          if (this.payload.class_id) params.class_ids = JSON.stringify([{id: get(this.payload, 'class_id', null)}])
          if (this.payload.elearning_id) params.elearning_id = this.payload.elearning_id
          if (this.payload.subject_id) params.subject_id = get(this, 'payload.subject_id.id', '')
          if (this.payload.doc) params.doc = this.payload.doc

          const doUpload = await this.$store.dispatch(
            `elearning/teaching/teaching-documents/${actionTypes.TEACHING_DOC.ADD}`,
            {...params}
          );
          if (doUpload.success) {
            this.$toasted.success("Tải lên thành công");
            this.$emit('close', true)
          } else if (doUpload.message) {
            this.hasError(doUpload.message)
          }
        } catch (e) {
        } finally {
          this.loading = false;
        }
      },

      handleDragover(e) {
        e.stopPropagation()
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
      },
      handleUpload() {
        this.$refs['upload-input'].click()
      },
      async handleClick(e) {
        const files = e.target.files
        const rawFile = files[0] // only use files[0]
        if (!rawFile) return
        if (!this.isValidFile(rawFile)) {
          return
        }
        this.payload.doc = rawFile;
        this.currentFile = rawFile;
      },
       handleDrop(e) {
        e.stopPropagation()
        e.preventDefault()
        if (this.loading) return

        const files = e.dataTransfer.files

        if (files.length !== 1) {
          this.hasError(DEFAULT_ERROR_MESSAGE, 'Chỉ cho phép tải một file tại một thời điểm!')
          return
        }

        const rawFile = files[0] // only use files[0]
        if (!this.isValidFile(rawFile)) {
          return false
        }
        this.payload.doc = rawFile;
        this.currentFile = rawFile;
        e.stopPropagation()
        e.preventDefault()
      },
      isValidFile(file) {
        if (!this.isValidType(file)) {
          this.hasError(DEFAULT_ERROR_MESSAGE, 'File tải lên không đúng định dạng cho phép')
          return false
        }
        if (!this.isValidSize(file)) {
          this.hasError(DEFAULT_ERROR_MESSAGE, `Dung lượng quá giới hạn > ${fileSizeFilter(MAX_UPLOADED_REPOSITORY_FILE_SIZE*1024*1024)}`)
          return false
        }
        if (!this.isAvailableStorage(file)) {
          this.hasError(DEFAULT_ERROR_MESSAGE, `Kho học liệu của bạn không đủ dung lượng trống để tải file`)
          return false
        }
        return true
      },
      isValidType(file) {
        return /\.(m4a|mp3|jpeg|jpg|png|gif|bmp|docx|doc|ppt|pptx|pdf|txt|mp4|mov|f4v|m4v|mp4a|mp4v|3gp|3g2|smil|flv|zip)$/.test(file.name.toLowerCase())
      },
      isValidSize(file) {
        const isLtSize = file.size / 1024 / 1024 < MAX_UPLOADED_REPOSITORY_FILE_SIZE
        return isLtSize
      },
      isAvailableStorage(file) {
        // temp config
        return true;
        // const fileSize = file.size
        // return this.availableCapcity * 1024 * 1024 > fileSize
      },
      async cancelUpload() {
        console.log('[Upload warehouse] Cancal upload')
        if (this.isUploading) {
          await this.cancelUploadToken('Cancel upload file')
          this.resetUpload()
        }
      },
      resetUpload() {
        this.currentStatus = STATUS['INITIAL']
        this.currentFile = {};
        this.payload.doc = null;
        // this.payload = {
        //   elearning_id:null,
        //   class_ids:null,
        //   subject_id:null,
        //   group_ids:null
        // }
      },
      uploadOther() {
        this.resetUpload()
      },
      hasError(message, reason) {
        this.currentStatus = STATUS['ERROR']
        this.error = {
          message: message,
          reason: reason
        }
      },
      async fetchSelectGroup(){
        const params = {
          school_id: get(this, "userLogin.organization.id", ""),
          size: 9999
        };
        const eParams = {
          page: 1,
          limit: 9999,
          status : "APPROVED",
          hide : false,
        }
        await this.$store.dispatch(
            `elearning/teaching/elearning/${actionTypes.TEACHING_ELEARNINGS.LIST}`, eParams
        )
        await this.$store.dispatch(`elearning/create/getSubjects`, params);
      },
      handleSelectCourse(val){
        this.payload.elearning_id = val;
      },
      handleSelectGroup(val){
        this.payload.group_ids = [val];
      },
      handleSelectSubject(val){
        this.payload.subject_id = val;
      },
      handleSelectClass(val){
        this.payload.class_ids = [val];
      },
      handleSelectCG(val){
        if (val.type == 'GROUP') {
          this.payload.group_id = val.id;
          this.payload.class_id = null;
        } else if(val.type == 'CLASS') {
          this.payload.class_id = val.id;
          this.payload.group_id = null;
        } else {
          this.payload.group_id = null;
          this.payload.class_id = null;
        }
      },
      get
    },
    created(){
      this.fetchSelectGroup();
      this.getListCG();
    }
  }
</script>

<style lang="scss">
  @import "~/assets/scss/components/elearning/manager/material/_elearning-uploadfile.scss";
  .app-modal--size-md .app-modal-title {
    margin: 0 auto;
  }
</style>