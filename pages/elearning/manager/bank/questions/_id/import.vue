<template>
  <div class="container bank-questions import">
    <breadcrumb />

    <div class="row">
      <div class="col-md-3">
        <ElearningManagerSide active="5" />
      </div>

      <div class="col-md-9">
        <sub-block-section title="Import câu hỏi" has-icon>
          <template #content>
            <div class="d-flex-center pb-4 pt-3">
              <strong>
                Tên ngân hàng:
                <span class="color-primary">{{get(stateQuestionBank, 'data.name', '')}}</span>
              </strong>
              <strong class="ml-auto">
                Loại câu hỏi:
                <span class="color-primary">{{getTypeText( get(stateQuestionBank, 'data.type', '') )}}</span>
              </strong>
            </div>
            <hr />

            <div class="d-flex-center justify-content-center mt-6 mb-6">
              <div class="d-flex-center">
                <div class="text-center color-primary">
                  <div class="import-icon active">
                    <IconPaper />
                  </div>
                  1. Chọn tập tin
                </div>

                <div class="d-flex-center import-arrow">
                  <IconArrowsActive v-if="uploaded"/>
                  <IconArrows v-else/>
                </div>
                <div class="text-center" :class="uploaded ? 'color-primary' : ''">
                  <div class="import-icon" :class="uploaded ? 'active' : ''">
                    <IconMark />
                  </div>
                  2. Xác nhận câu hỏi
                </div>
              </div>
            </div>
            <p v-html="getTypeDesc( get(stateQuestionBank, 'data.type', '') )"></p>

            <div v-if="uploaded" class="mt-6">
              <p class="label mb-4">Xác nhận câu hỏi</p>
              <div class="row info-file">
                <div class="col-6 left">
                  <p><span class="text">
                    Tổng số bản ghi:</span>{{get(uploadInfo, 'total_record', '0')}}
                  </p>
                  <p><span class="text">
                    Bản ghi hợp lệ:</span> <span class="color-primary">
                      {{get(uploadInfo, 'total_valid', '0')}}
                    </span>
                  </p>
                  <p><span class="text">Bản ghi không hợp lệ:</span> <span class="color-red">
                    {{get(uploadInfo, 'total_invalid', '0')}}
                  </span></p>
                </div>
                <div class="col-6 right">
                  <div v-if="done" class="ml-auto text-left">
                    <p>
                      <IconCheckCircle class="fill-primary" />
                      <span class="text">Thành công:</span> <span class="color-primary">
                        {{get(importInfo, 'total_success', '0')}}
                      </span>
                    </p>
                    <p>
                      <IconCancel  class="fill-red"/>
                      <span class="text">Không thành công:</span> <span class="color-red">
                        {{get(importInfo, 'total_failed', '0')}}
                      </span>
                    </p>
                  </div>
                </div>
                <app-button color="white" normal class="border-primary" rounded @click="importFile()"
                  :style="{ 'pointer-events': loading ? 'none' : '' }">
                  <app-spin v-if="loading && !done" class="mr-3"/>
                  Xác nhận câu hỏi <IconForward width="16" height="16" class="ml-2"/>
                </app-button>
              </div>

              <div class="buttons d-flex justify-content-center mt-5">
                <app-button color="white" class="mr-4" @click="back()">
                  <IconBack width="16" height="16" class="mr-2"/> Quay lại
                </app-button>
                <app-button :disabled="!done" @click="importComplete()"
                  :style="{ 'pointer-events': loading ? 'none' : '' }">
                  <app-spin v-if="loading && done" class="mr-3"/>
                  Hoàn thành <IconCheck width="16" height="16" class="ml-2"/>
                </app-button>
              </div>
            </div>
            <div v-else>
              <div class="row mt-6">
                <div class="col-4">
                  <p class="label">Tải tập tin mẫu</p>
                </div>
                <div class="col-8">
                  <p class="label">Chọn tập tin</p>
                </div>
              </div>
              <div class="row mt-15 stretch">
                <div class="col-4 left">
                    <a class="item" v-for="(item, index) in stateSamples" :key="index"
                    :href="item.link" download="file-mau" target="_blank">
                      <IconXLS class="mr-2" />
                      <span class="link text-lowercase">file-mau.{{item.format}}</span>
                      <IconSaveAlt class="ml-auto"/>
                    </a>
                </div>
                <div class="col-8">
                  <div class="files">
                    <div v-if="files.length === 0">
                      <p class="text-center mb-4">Click để chọn tập tin hoặc kéo thả tập tin vào đây để tải lên.</p>
                    </div>
                    <div v-else>
                      <p class="text-center mb-4">Đã tải xong {{files.length}} file lên</p>
                      <div class="file mb-3" v-for="(item, index) in files" :key="index">
                        <a class="link">
                          <IconCSV />
                          {{item.name}}
                          <IconCheckCircle class="ml-auto fill-primary" />
                        </a>
                        <button class="delete" @click="deleteFile(item.id)">
                          <IconClose />
                        </button>
                      </div>
                    </div>
                    <div class="text-center mt-4">
                      <file-upload
                        class="btn-upload"
                        accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        post-action="/upload/post"
                        :multiple="false"
                        :drop="true"
                        :drop-directory="true"
                        v-model="files"
                        @input-file="inputFile"
                        @input-filter="inputFilter"
                        ref="upload">
                          <div><IconCloudUp class="mr-2" />Tải lên</div>
                      </file-upload>
                    </div>
                    <div class="d-flex-center justify-content-center mt-4 color-999" v-if="files.length === 0">
                      Xem các định dạng file được chấp nhận 
                      <div class="tool-tip">
                        <IconInfo width="16" height="16"/>
                        <div class="content">
                          xls, xlsx
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="buttons d-flex justify-content-center mt-5">
                <app-button color="white" class="mr-4" @click="back()">
                  <IconBack width="16" height="16" class="mr-2"/> Quay lại
                </app-button>
                <app-button @click="validFile()" :disabled="files.length === 0" 
                  :style="{ 'pointer-events': loading ? 'none' : '' }">
                  <app-spin v-if="loading" class="mr-3"/>
                  Tiếp tục <IconForward width="16" height="16" class="ml-2"/>
                </app-button>
              </div>
            </div>


            <!-- -->
            <app-modal-notify
              :width="550"
              @ok="okNotify"
              @close="okNotify"
              v-if="showNotify"
              :footer="false"
              :header="false"
              title=""
              :description="message"
            >
            </app-modal-notify>
          </template>
        </sub-block-section>
      </div>
    </div>
  </div>
</template>

<script>
import FileUpload from 'vue-upload-component/dist/vue-upload-component.part.js'
import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
import ModalPreview from "~/components/page/elearning/manager/bank/questions/create/ModalPreview";
import IconInfo from "~/assets/svg/v2-icons/info_24px.svg?inline";
import IconCloud from "~/assets/svg/v2-icons/cloud_download_24px.svg?inline";
import IconMark from "~/assets/svg/images/check-mark.svg?inline";
import IconPaper from "~/assets/svg/images/paper.svg?inline";
import IconXLS from "~/assets/svg/v2-icons/xls.svg?inline";
import IconCSV from "~/assets/svg/v2-icons/csv.svg?inline";
import IconPolygon from "~/assets/svg/v2-icons/polygon.svg?inline";
import IconSaveAlt from "~/assets/svg/v2-icons/save_alt_24px.svg?inline";
import IconCheckCircle from "~/assets/svg/v2-icons/check_circle_24px.svg?inline";
import IconClose from "~/assets/svg/v2-icons/close_24px.svg?inline";
import IconCloudUp from "~/assets/svg/v2-icons/cloud_upload_24px.svg?inline";
import IconForward from "~/assets/svg/v2-icons/arrow_forward_24px.svg?inline";
import IconBack from "~/assets/svg/v2-icons/arrow_back_24px.svg?inline";
import IconCancel from "~/assets/svg/v2-icons/cancel_24px.svg?inline";
import IconCheck from "~/assets/svg/v2-icons/check_24px.svg?inline";
import IconArrows from "~/assets/svg/v2-icons/arrows.svg?inline";
import IconArrowsActive from "~/assets/svg/v2-icons/arrows-active.svg?inline";

import { get } from "lodash";
import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";

const STORE_NAMESPACE = "elearning/manager/bank/question/import";
const STORE_QUESTION_BANK = "elearning/manager/bank/question/question-bank";

export default {
  data() {
    return {
      message: "",
      type: 1,
      files: [],
      showNotify: false,
      success: false,
      done: false,
      uploaded: false,
      showPreview: false,
      showFilter: false,
      cols: [5, 55, 15, 15],
      loading: false,
      pagination: {
        total: 0,
        number: 0,
        size: 10,
        total_elements: 0,
        first: 0,
        last: 0
      },
      uploadInfo: {},
      importInfo: {},
      heads: [
        {
          name: "content",
          text: "Nội dung",
          sort: true
        },
        {
          name: "type",
          text: "Thể loại",
          sort: true
        },
        {
          name: "level",
          text: "Cấp độ",
          sort: true
        }
      ],
      file: '',
      sampleLinks: []
    };
  },

  middleware: ["teacher-role"],

  async mounted() {
    const that = this;

    const info = await this.$store.dispatch(
      `${STORE_QUESTION_BANK}/${actionTypes.BANK_QUESTION.INFO}`,
       get(that.$route, 'params.id', '')
    );

    let params = {
      type: get(info, 'data.type', '')
    }
    const doDown = await that.$store.dispatch(
      `${STORE_NAMESPACE}/${actionTypes.BANK_QUESTION.DOWNLOAD_SAMPLE}`,
      {...params}
    );
  },

  components: {
    FileUpload,
    IconInfo,
    IconCheck,
    IconCancel,
    IconForward,
    IconBack,
    IconMark,
    IconPaper,
    IconXLS,
    IconCSV,
    ModalPreview,
    ElearningManagerSide,
    IconCloud,
    IconPolygon,
    IconSaveAlt,
    IconCheckCircle,
    IconClose,
    IconCloudUp,
    IconArrows,
    IconArrowsActive,
  },

  computed: {
    ...mapState(STORE_QUESTION_BANK, {
      stateQuestionBank: "questionBank",
    }),
    ...mapState(STORE_NAMESPACE, {
      stateSamples: "sampleFile",
    }),
  },

  methods: {
    get,

    okNotify () {
      this.showNotify = false;
      if (this.success) {
        this.uploaded = false;
        this.done = false;
        this.files = [];
        this.file = '';
        this.$router.push('./');
      }
    },

    getTypeText (type) {
      switch (type) {
        case 'YES_NO':
          return 'Đúng/Sai'
          break;
        case 'SINGLE_CHOICE':
          return 'Một lựa chọn'
          break;
        case 'MULTIPLE_CHOICE':
          return 'Nhiều lựa chọn'
          break;
        case 'FILL_IN_BLANK':
          return 'Điền từ'
          break;
        case 'WORD_MATCH':
          return 'Ghép đáp án'
          break;
        case 'WORD_CHOICE':
          return 'Chọn từ'
          break;
        case 'ESSAY':
          return 'Tự luận'
          break;
        default:
          break;
      }
    },

    getTypeDesc (type) {
      switch (type) {
        case 'YES_NO':
          return 'Để thêm nhiều câu hỏi Đúng/Sai cùng 1 lúc, bạn có thể tải một file Excel hoặc CSV lên theo mẫu: Nội dung*, Đáp án đúng (A/B)*, Lựa chọn A*, Lựa chọn B*, Ghi chú.'
          break;
        case 'SINGLE_CHOICE':
          return 'Để thêm nhiều câu hỏi Một lựa chọn cùng 1 lúc, bạn có thể tải một file Excel hoặc CSV lên theo mẫu: Nội dung*, Đáp án đúng(A/B/C/D/...)*, Lựa chọn A*, Lựa chọn B, Lựa chọn C, Lựa chọn D, Lựa chọn E, Ghi chú.'
          break;
        case 'MULTIPLE_CHOICE':
          return 'Để thêm nhiều câu hỏi Nhiều lựa chọn cùng 1 lúc, bạn có thể tải một file Excel hoặc CSV lên theo mẫu: Nội dung*, Đáp án đúng(A/B/C/D/...)*, Lựa chọn A*, Lựa chọn B, Lựa chọn C, Lựa chọn D, Lựa chọn E, Ghi chú.'
          break;
        case 'FILL_IN_BLANK':
          return  "<p class='mb-2'>Để thêm nhiều câu hỏi Điền từ cùng 1 lúc, bạn có thể tải một file Excel hoặc CSV lên theo mẫu: Nội dung*, Ghi chú </p><p>- <b>Lưu ý</b>: Soạn câu hỏi và sử dụng [dấu ngoặc] để đặt vị trí cần điền từ. Ví dụ, Con [rùa] chạy chậm hơn con [thỏ].</p>"
          break;
        case 'WORD_MATCH':
          return 'Để thêm nhiều câu hỏi Ghép đáp án cùng 1 lúc, bạn có thể tải một file Excel hoặc CSV lên theo mẫu: Nội dung*, Câu hỏi 1,Đáp án 1, Câu hỏi 2, Đáp án 2, Câu hỏi 3, Đáp án 3, Câu hỏi 4, Đáp án 4, Ghi chú '
          break;
        case 'WORD_CHOICE':
          return "<p class='mb-2'>Để thêm nhiều câu hỏi Chọn từ cùng 1 lúc, bạn có thể tải một file Excel hoặc CSV lên theo mẫu: Nội dung*, Ghi chú </p><p>- <b>Lưu ý</b>: Soạn câu hỏi và sử dụng [dấu ngoặc] để đặt vị trí cần điền từ. Ví dụ, Con [rùa] chạy chậm hơn con [thỏ]. HOẶC Hành tinh lớn nhất của hệ mặt trời là [sao băng | sao băng | trái đất]. Khi bạn sử dụng | để cung cấp nhiều câu trả lời, trong đó vị trí đầu tiên là đáp án chính xác.</p>"
          break;
        case 'ESSAY':
          return 'Để thêm nhiều câu hỏi Tự luận cùng 1 lúc, bạn có thể tải một file Excel hoặc CSV lên theo mẫu: Nội dung*, Hình thức nộp bài*, Ghi chú'
          break;
        default:
          break;
      }
    },

    async validFile(){
      if (!this.loading){
        try {
          this.uploaded = false;
          this.loading = true;
          const that = this;
          let params = {
            parent: 'BANK',
            parent_id: that.$route.params ? that.$route.params.id : "",
            type: get(that.stateQuestionBank, 'data.type', ''),
            file: that.files[0].file
          }
          const doValid = await this.$store.dispatch(
            `${STORE_NAMESPACE}/${actionTypes.BANK_QUESTION.VALID}`,
            {...params}
          );
          if (doValid.success) {
            this.uploaded = true;
            this.uploadInfo = get(doValid, 'data', '');
          } else if (doValid.message) {
            this.showNotify = true;
            this.message = doValid.message;
          }
        } catch (e) {
        } finally {
          this.loading = false;
        }
      }
    },
    
    async importFile(){
      if (!this.loading){
        try {
          this.done = false;
          this.loading = true;
          const doImport = await this.$store.dispatch(
            `${STORE_NAMESPACE}/${actionTypes.BANK_QUESTION.IMPORT}`,
            {file_id: this.uploadInfo.file_id}
          );
          if (doImport.success) {
            this.done = true;
            this.importInfo = get(doImport, 'data', '');
          } else if (doImport.message) {
            this.showNotify = true;
            this.message = doImport.message;
          }
        } catch (e) {
        } finally {
          this.loading = false;
        }
      }
    },
   
   async importComplete(){
      if (!this.loading){
        try {
          this.loading = true;
          const doComplete = await this.$store.dispatch(
            `${STORE_NAMESPACE}/${actionTypes.BANK_QUESTION.COMPLETE}`,
            {import_id: this.importInfo.import_id}
          );
          if (doComplete.success) {
            this.success = true;
            this.showNotify = true;
            this.message = "Import thành công!"
          } else if (doComplete.message) {
            this.showNotify = true;
            this.message = doComplete.message;
          }
        } catch (e) {
        } finally {
          this.loading = false;
        }
      }
    },

    inputFile: function (e) {
      if(e) this.file = e.blob;
    },
    inputFilter: function (newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Filter file
        if (!/\.(csv|xls|xlsx)$/i.test(newFile.name)) {
          return prevent()
        }
      }

      // Create a blob field
      newFile.blob = ''
      let URL = window.URL || window.webkitURL
      if (URL && URL.createObjectURL) {
        newFile.blob = URL.createObjectURL(newFile.file)
      }
    },

    deleteFile(id){
      this.files = [...this.files].filter((item)=>{
        return item.id != id
      })
      this.file = ''
    },

    back() {
      this.uploaded = false
      this.done = false
    },
  },
};
</script>


<style lang="scss">
@import "~/assets/scss/components/elearning/bank/_questions.scss";
</style>