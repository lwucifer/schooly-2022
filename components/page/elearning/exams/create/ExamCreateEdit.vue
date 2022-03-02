<template>
  <div class="exam-create-add-question" v-if="form == 'edit'">
      <sub-block-section>
          <div slot="title" class="excaq__title-block">
              <button class="d-flex align-items-center">
                  <IconKeyboardArrowLeft24px  class="fill-primary mr-3"/>
              </button>
              Đề thi số 1
              <IconEdit class="ml-3" :height="16"/>
          </div>
          <div slot ="content" class="ecaq__content">
              <div class="row">
                  <div class="col-md-3">
                      <label for="time" class="heading-5 font-weight-bold text-dark">Thời gian làm bài</label>
                      <app-input
                        type="text"
                        class="mb-0 ce-input-with-unit mt-3"
                        size="md"
                        style="width: 12rem;"
                        min="0"
                        max="60"
                        id="time"
                       >
                       <div slot="unit">phút</div>
                      </app-input>
                  </div>
                  <div class="col-md-3">
                      <label for="count" class="heading-5 font-weight-bold text-dark">Số lần làm bài tối đa</label>
                      <app-input
                        type="text"
                        class="mb-0 ce-input-with-unit mt-3"
                        size="md"
                        style="width: 12rem;"
                        min="0"
                        max="60"
                        id="count"
                       >
                       <div slot="unit">lần</div>
                        </app-input>
                  </div>
              </div>
              <p class="heading-5 font-weight-bold text-dark mt-5 mb-4">Cài đặt thời gian (Không bắt buộc)</p>
                <div class="d-flex align-items-center mb-4">
                    <span class="text-left font-weight-normal">Thời gian mở đề</span>
                    <app-date-picker class="mr-4">
                        <template  v-slot:icon-calendar>
                            <IconCalendarV2/>
                        </template>
                    </app-date-picker>
                    <app-checkbox
                        label="Áp dụng"
                        class="ml-5"
                    ></app-checkbox>
                </div>
                <div class="d-flex align-items-center">
                    <span class="text-left font-weight-normal">Thời gian đóng đề</span>
                    <app-date-picker class="mr-4">
                        <template  v-slot:icon-calendar>
                            <IconCalendarV2/>
                        </template>
                    </app-date-picker>
                    <app-checkbox
                        label="Áp dụng"
                        class="ml-5"
                    ></app-checkbox>
                </div>
                <hr class="mt-5">
                <div v-if="hasQuestion">
                    <!-- <div class="d-flex align-items-center mt-4">
                        <h5>Danh sách câu hỏi</h5>
                        <div class=" d-flex  align-items-center justify-content-end mb-4 ml-auto">
                            <div class="d-flex align-items-center mr-4">
                                <IconAlert class="mr-3 fill-yellow" />
                                <span class="color-yellow">Bạn chưa hoàn thiện nội dung đề thi</span>
                            </div>
                            <app-button>Thêm câu hỏi</app-button>
                        </div>
                    </div> -->
                    <ExamListQuestion @select="handleSelectMenu"/>
                </div>
                <div v-else class="no-question">
                    <div class=" w-100 d-flex flex-row align-items-center justify-content-end mb-4">
                        <div class="d-flex align-items-center mr-4">
                            <IconAlert class="mr-3 fill-yellow" />
                            <span class="color-yellow">Bạn chưa hoàn thiện nội dung đề thi</span>
                        </div>
                        <ButtonCreateQuestion
                            expandable
                            @select="handleSelectMenu"
                        />
                    </div>
                    <img src="~/assets/images/elearning/exam-no-question.png"/>
                    <p>Bạn chưa tạo câu hỏi nào.</p>
                </div>
                <div class="text-center mt-5">
                    <app-button 
                        class="mr-4 px-5 text-secondary" 
                        color="white"
                        @click="$emit('close')"
                    >
                        Hủy
                    </app-button>
                    <app-button class="px-4">Xác nhận</app-button>
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
  <ExamCreateUploadFile v-else-if="form == 'upload'"/>
</template>

<script>
import IconEdit from '~/assets/svg/icons/edit.svg?inline';
import IconKeyboardArrowLeft24px from '~/assets/svg/v2-icons/keyboard_arrow_left_24px.svg?inline';
import IconCalendarV2 from '~/assets/svg/icons/calendar-v2.svg?inline';
import IconAlert from '~/assets/svg/v2-icons/alert/error_outline_24px.svg?inline';
import ExamListQuestion from "~/components/page/elearning/exams/create/ExamListQuestion"
import ButtonCreateQuestion from "~/components/page/course/create/common/ButtonCreateQuestion";
import ExamCreateUploadFile from "~/components/page/elearning/exams/create/ExamCreateUploadFile"
export default {
    components:{
        IconEdit,
        IconKeyboardArrowLeft24px,
        IconCalendarV2,
        IconAlert,
        ExamListQuestion,
        ExamCreateUploadFile,
        ButtonCreateQuestion
        
    },
    data(){
        return{
            hasQuestion:true,
            form:'edit',
            isShowModal:false,
             description:'Nếu bạn chọn hình thức upload đề thi, bạn sẽ phải tạo lại câu hỏi và đáp án ngay từ đầu. Những câu hỏi bạn tạo ra trước đó sẽ bị xóa. Bạn có muốn tiếp tục'
        }
    },
    methods:{
        handlUpload(){
            this.form = 'upload'
        },
        handleSelectMenu(val){
            if(val == 'UPLOAD'){
                this.form = 'upload'
            }

        }
    }
}
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/exams/_exams-create-add-question.scss";
</style>