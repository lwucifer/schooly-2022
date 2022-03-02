<template>
    <div class="wrapTest">
        <div class="titleChoiceTest">
            <div>
                <strong>1. Bài giảng đại số lớp 10 - Bài tập tự luận</strong>
            </div>
        </div>
        <div class="timetest_ElearningCourse">
            <div>
                <span>Thời gian làm bài :</span>
                <span>50 phút</span>
            </div>
            <span style="margin-left:20px; margin-right:20px">|</span>
            <div>
                <span>Thời gian còn lại:</span>
                <span>50 phút</span>
            </div>
        </div>
        <div class="contentQuestion__ElearningCourse">
            <div class="d-flex flex-row  titleQuestion__ElearningCourse">
                <div class="d-flex flex-row align-items-center col" >
                    <span>Câu hỏi số</span>
                </div>
                <div class="col d-flex justify-content-end ">
                    <button class="elearning-course-btn-print d-flex align-items-center">
                        <IconPrint class="printQuestion__ElearningCourse"/>
                        <span>In câu hỏi</span>
                    </button>
                </div>
            </div>
            <div class="contentEssayQuestion">
                <span>{{question}}</span>
            </div>
            <div class="d-flex flex-row  titleQuestion__ElearningCourse">
                <div class="d-flex flex-row align-items-center col" >
                    <span>Câu trả lời</span>
                </div>
                <div class="col d-flex justify-content-end align-items-center">
                    <span>Soạn câu trả lời</span>
                    <IconArrowUp class="iconMargin"/>
                </div>
            </div>
            <div class="answerEssayQuestion__ElearningCourse">
                <app-input textarea placeholder="Khung soạn thảo văn bản"></app-input>
            </div>
            <div class="d-flex flex-row groupbtnEssayTest__ElearningCourse">
                <div class="col">
                    <app-button square size="sm" class="elearning-course-uploadfile">
                        <IconUpload class="iconMarginLeft"/>
                        Tải lên câu trả lời
                         <input type="file"/>
                    </app-button>  
                </div>
                <div class="col d-flex justify-content-end">
                    <button class="btnSummitEssayTest__ElearningCourse" v-on:click="changeDoneQuestion">
                        <IconSend/>Nộp bài
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import IconPrint from "~/assets/svg/design-icons/print.svg?inline"
import IconSend from "~/assets/svg/icons/send.svg?inline"
import IconArrowUp from "~/assets/svg/icons/up.svg?inline"
import IconUpload from "~/assets/svg/icons/uploadfile.svg?inline"
export default {
    data(){
        return{
            question:'Để bảo vệ mật khẩu ta phải làm gì'
        }
    },
    methods:{
        changeDoneQuestion(){
            this.$emit('updateDoneQuestion',true)
        }
    },
    components:{
        IconPrint,
        IconSend,
        IconArrowUp,
        IconUpload
    }
}
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/course/essayquestion/_elearning-course-do.scss";
</style>