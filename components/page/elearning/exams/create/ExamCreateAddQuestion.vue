<template>
  <div class="exam-create-add-question" v-if="form == 'edit'">
      <sub-block-section 
        :actionClick="handleBack"
        :title="get(testInfo, 'name', '')"
        has-icon>
          <div slot ="content" class="ecaq__content">
              <div class="row">
                  <div class="col-md-3 mb-3">
                      <label for="time" class="heading-5 font-weight-bold text-dark">Thời gian làm bài</label>
                      <app-input
                        type="number"
                        class="mb-0 ce-input-with-unit mt-3"
                        size="md"
                        style="width: 12rem;"
                        min="0"
                        max="180"
                        id="time"
                        v-model="testPayload.duration"
                       >
                       <div slot="unit">phút</div>
                      </app-input>
                  </div>
                  <div class="col-md-4 mb-3">
                      <label for="count" class="heading-5 font-weight-bold text-dark">Số lần làm bài tối đa</label>
                      <app-input
                        type="number"
                        class="mb-0 ce-input-with-unit mt-3"
                        size="md"
                        style="width: 12rem;"
                        min="0"
                        max="10"
                        id="count"
                        v-model="testPayload.works"
                       >
                       <div slot="unit">lần</div>
                        </app-input>
                  </div>
              </div>
              <p class="heading-5 font-weight-bold text-dark mt-4 mb-4">Cài đặt thời gian (Không bắt buộc)</p>
                <div class="d-flex align-items-center mb-4">
                    <span class="text-left font-weight-normal">Thời gian mở đề</span>
                    <app-date-picker class="mr-4" 
                        v-model="testPayload.start_time"
                        :valueFormat="'YYYY-MM-DD HH:mm:ss'"
                        :type="'datetime'"
                        :disabled="!testPayload.starttime_enable"
                        :clearDate="!testPayload.starttime_enable">
                        <template  v-slot:icon-calendar>
                            <IconCalendarV2/>
                        </template>
                    </app-date-picker>
                    <app-checkbox v-model="testPayload.starttime_enable"
                        label="Áp dụng"
                        class="ml-5"
                    ></app-checkbox>
                </div>
                <div class="d-flex align-items-center">
                    <span class="text-left font-weight-normal">Thời gian đóng đề</span>
                    <app-date-picker class="mr-4" 
                        v-model="testPayload.end_time"
                        :valueFormat="'YYYY-MM-DD HH:mm:ss'"
                        :type="'datetime'"
                        :disabled="!testPayload.endtime_enable"
                        :clearDate="!testPayload.endtime_enable">
                        <template  v-slot:icon-calendar>
                            <IconCalendarV2/>
                        </template>
                    </app-date-picker>
                    <app-checkbox v-model="testPayload.endtime_enable"
                        label="Áp dụng"
                        class="ml-5"
                    ></app-checkbox>
                </div>
                <hr class="mt-5">
                <div class=" w-100 d-flex flex-row align-items-center justify-content-end mt-4" v-if="type == 0">
                    <ButtonSelectQuestion
                        expandable
                        :type="get(testInfo, 'type', '')"
                        @select="handleSelectMenu"
                    />
                </div>

                <ExamQuestions :typeExam="get(testInfo, 'type', '')" v-if="type == 0" :id="get($route,'query.test_id', '')"/>
                
                <div v-else class="no-question" >
                    <div v-if="type == 0">
                        <img src="~/assets/images/elearning/exam-no-question.png"/>
                        <p>Bạn chưa tạo câu hỏi nào.</p>
                    </div>
                    <div class="w-100">
                        <div v-if="type == 'ESSAY'">
                            <h5 class="mb-3">Điểm câu hỏi:</h5>
                            <app-input v-model="payload.points"/>
                        </div>
                        <!-- Đúng sai -->
                        <QuestionType1
                            v-if="type == 'YES_NO'"
                            @handleChangeData="handleChangeData"
                        />
                        <!-- một lựa chọn -->
                        <QuestionType2
                            v-if="type == 'SINGLE_CHOICE'"
                            @handleChangeData="handleChangeData"
                        />
                        <!-- nhiều lựa chọn -->
                        <QuestionType3
                            v-if="type == 'MULTIPLE_CHOICE'"
                            @handleChangeData="handleChangeData"
                        />
                        <!-- ghép đáp án -->
                        <QuestionType4
                            v-if="type == 'WORD_MATCH'"
                            @handleChangeData="handleChangeData"
                        />
                        <!-- điền từ -->
                        <QuestionType5
                            v-if="type == 'FILL_IN_BLANK'"
                            @handleChangeData="handleChangeData"
                        />
                        <!-- chọn từ -->
                        <QuestionType6
                            v-if="type == 'WORD_CHOICE'"
                            @handleChangeData="handleChangeData"
                        />
                        <!-- tự luận -->
                        <QuestionType7
                            v-if="type == 'ESSAY'"
                            @handleChangeData="handleChangeData"
                        />
                        </div>
                </div>

                <div class="text-center mt-5" v-if="type == 0">
                    <app-button 
                        class="mr-4 px-5 text-secondary" 
                        color="white"
                        @click="$emit('go-back')"
                    >
                        Hủy
                    </app-button>
                    <app-button class="px-4" @click="handleUpdate">Hoàn thành</app-button>
                </div>
                <div v-else class="text-center mt-5">
                    <app-button 
                        class="mr-4 px-5 text-secondary" 
                        color="white"
                        @click="type = 0"
                    >
                        Hủy
                    </app-button>
                    <app-button class="px-4" @click="handleAddQuestion">Thêm mới</app-button>
                </div>
          </div>
      </sub-block-section>
      <app-modal-confirm
        v-if="isShowModal"
        @cancel="isShowModal = false"
        @ok="handlUpload"
        :description="description"
    >
    </app-modal-confirm>
  </div>
  <ChooseFromBank v-else-if="form == 'FROM_QUESTION_BANK'" :id="get($route,'query.test_id', '')" :type="type" :grade="get(testInfo, 'grade', {})" :subjects="get(testInfo, 'subjects', [])"/>
</template>

<script>
import IconEdit from '~/assets/svg/icons/edit.svg?inline';
import IconKeyboardArrowLeft24px from '~/assets/svg/v2-icons/keyboard_arrow_left_24px.svg?inline';
import IconCalendarV2 from '~/assets/svg/icons/calendar-v2.svg?inline';
import IconAlert from '~/assets/svg/v2-icons/alert/error_outline_24px.svg?inline';
import ExamQuestions from "~/components/page/elearning/exams/create/ExamQuestions"
import ButtonSelectQuestion from "~/components/page/elearning/exams/create/ButtonSelectQuestion";
import ChooseFromBank from "~/components/page/elearning/exams/create/ChooseFromBank";

import QuestionType1 from "~/components/page/elearning/manager/bank/questions/create/QuestionType1";
import QuestionType2 from "~/components/page/elearning/manager/bank/questions/create/QuestionType2";
import QuestionType3 from "~/components/page/elearning/manager/bank/questions/create/QuestionType3";
import QuestionType4 from "~/components/page/elearning/manager/bank/questions/create/QuestionType4";
import QuestionType5 from "~/components/page/elearning/manager/bank/questions/create/QuestionType5";
import QuestionType6 from "~/components/page/elearning/manager/bank/questions/create/QuestionType6";
import QuestionType7 from "~/components/page/elearning/manager/bank/questions/create/QuestionType7";
import { get, cloneDeep, toNumber } from "lodash";
import { mapGetters, mapActions, mapState } from "vuex";
import { useEffect, questionBankTypeArr } from "~/utils/common";
import { RESPONSE_SUCCESS } from "~/utils/config";

export default {
    components:{
        IconEdit,
        IconKeyboardArrowLeft24px,
        IconCalendarV2,
        IconAlert,
        ExamQuestions,
        ButtonSelectQuestion,
        ChooseFromBank,
        QuestionType1,
        QuestionType2,
        QuestionType3,
        QuestionType4,
        QuestionType5,
        QuestionType6,
        QuestionType7,
        
    },
    data(){
        return{
            type: 0,
            testInfo: {},
            questions: [],
            pagination: {},
            payload: {
                question_id: "",
                points: 0,
                answers: [
                    {
                        content: "",
                        index: 0,
                        matching: {
                            content: "",
                            index: 1,
                            name: "",
                        },
                        name: "",
                        selected: false,
                    },
                ],
            },
            testPayload: {
                id: '',
                works: 1,
                duration: 60,
                start_time: '',
                starttime_enable: false,
                end_time: '',
                endtime_enable: false,
            },
            hasQuestion:false,
            form:'edit',
            isShowModal:false,
            loading: false,
            description:'Nếu bạn chọn hình thức upload đề thi, bạn sẽ phải tạo lại câu hỏi và đáp án ngay từ đầu. Những câu hỏi bạn tạo ra trước đó sẽ bị xóa. Bạn có muốn tiếp tục'
        }
    },
    methods:{
        ...mapActions("elearning/test/setting", ["getSettingTestList"]),
        ...mapActions("elearning/manager/bank/exam", ["addExamTest"]),

        get,
        toNumber,

        checkUpdate() {
            if (this.testPayload.duration != this.testInfo.settings.duration) return true
            if (this.testPayload.works != this.testInfo.settings.works) return true
            if (this.testPayload.end_time != get(this.testInfo,'settings.end_time', '')) return true
            if (this.testPayload.start_time != get(this.testInfo,'settings.start_time', '')) return true
            if (this.testPayload.starttime_enable != this.testInfo.settings.starttime_enable) return true
            if (this.testPayload.endtime_enable != this.testInfo.settings.endtime_enable) return true
            return false
        },

        async handleUpdate() {
            if (!this.checkUpdate()) {
                this.$emit("go-back");
                return
            }

            this.loading = true;

            this.testPayload.id = get(this.$route, "query.test_id", '' );

            const result = await this.addExamTest(this.testPayload);

            if (result.success == RESPONSE_SUCCESS) {
                this.$toasted.success("Hoàn thành");
                this.$emit("go-back");
            } else {
                this.$toasted.error(get(result, 'message', 'Có lỗi hệ thống'));
            }

            this.loading = false;
        },

        async getTestInfo() {
            const res = await this.$axios({
                url: "/elearning/teaching/test/"+ get(this.$route, "query.test_id", '' ),
                method: "GET"
            });
            if (get(res, "data.success", false)) {
                this.testInfo = get(res, "data.data", {})
                return;
            }
        },
        
        async getSetting() {
            if(get(this, "$route.query.test_id", false )) {
                const res = await this.getSettingTestList({
                    params: { test_id: this.$route.query.test_id }
                });
                this.testPayload = Object.assign({}, this.testPayload, res);
            }
        },

        async handleAddQuestion() {
            this.handleFormatPayload();

            this.payload.index = 0;
            this.payload.status = 1;
            this.payload.points = toNumber(this.payload.points);
            this.payload.parent = 'TEST';
            this.payload.method = 'MANUAL';
            this.payload.parent_id = get(this, "$route.query.test_id", "");
            this.payload.category = this.type == 'ESSAY' ? 'ESSAY' : 'CHOICE';
            this.payload.type = this.type;
            if (this.type == 'ESSAY') {
                this.payload.answers = null;
            }

            const res = await this.$axios({
                url: "/elearning/teaching/manage/question",
                method: "POST",
                data: this.payload,
            });
            if (get(res, "data.success", false)) {
                this.$toasted.success("Thành công");
                this.type = 0;
                return;
            }
            this.$toasted.error(get(res, "data.message", "Có lỗi xảy ra"));
        },

        handleFormatPayload() {
            if (
                get(this, "question_bank.type", "") === questionBankTypeArr[3]["id"]
            ) {
                this.payload.answers = null;
            }
            if (
                get(this, "question_bank.type", "") === questionBankTypeArr[4]["id"]
            ) {
                this.payload.answers = null;
            }
            if (
                get(this, "question_bank.type", "") === questionBankTypeArr[6]["id"]
            ) {
                this.payload.answers = null;
            }
        },
            
        handlUpload(){
            this.form = 'upload'
        },
        handleSelectMenu(val){
            console.log(val)
            this.type = val;
            if(val == 'UPLOAD'){
                this.$router.push('/elearning/manager/semester/create/upload?category=TEST&type='+ this.testInfo.type + '&exam_id='+ get(this.$route, 'query.id', '') +'&parent_id=' + get(this.$route, 'query.test_id', ''));
            }
            if(val == 'FROM_QUESTION_BANK'){
                this.$router.push('/elearning/manager/semester/create/choose-from-bank?category=TEST&type='+ this.testInfo.type + '&exam_id='+ get(this.$route, 'query.id', '') +'&parent_id=' + get(this.$route, 'query.test_id', ''));
            }
        },
        handleBack() {
            this.$emit('go-back')
        },
        handleChangeData(data) {
            this.payload = { ...this.payload, ...data };
        },
    },

    created () {
        this.getTestInfo()
        this.getSetting()
    },

    watch: {
        '$route.query': function(newQuery, oldQuery) {
            this.getTestInfo()
            this.getSetting()
        }
    },
}
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/exams/_exams-create-add-question.scss";
</style>