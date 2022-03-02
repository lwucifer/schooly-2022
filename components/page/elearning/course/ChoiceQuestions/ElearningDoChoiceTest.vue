<template>
    <div class="wrapTest">
        <div class="titleChoiceTest">
            <div>
                <strong>1. Bài giảng đại số lớp 10 - Bài tập trắc nhiệm</strong>
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
                    <div>
                        <span>Câu hỏi số</span>
                    </div>
                    <div>
                        <app-select class="wrapselect__ElearningCourse"></app-select>
                    </div>
                </div>
                <div class="col d-flex justify-content-end">
                    <a href="#">Danh sách câu hỏi</a>
                </div>
            </div>
            <div class="answerQuestionChoiceTest__ElearningCourse">
                <div>
                    <strong>Tìm x. Biết 3x+ 4 =10</strong>
                </div>
                <div>
                    <div v-for="answer in answers">
                        <div class="radio">
                            <label><input type="radio" name="optradio" checked>  {{answer}}</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="wrapGroupButton__ElearningCourseCourse">
                <div class="col">
                    <button class="btnbackChoiceTest__ElearningCourse">Quay lại</button>
                    <button class="btncontinueChoiceTest__ElearningCouse">Tiếp tục</button>
                </div>
                <div class="col d-flex justify-content-end">
                    <button class="btnSummitChoiceTest__ElearningCourse" v-on:click="changeDoneQuestion">
                        <IconSend class="iconprint__ElearningCourse"/>
                        <span>Nộp bài</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import IconSend from "~/assets/svg/icons/send.svg?inline"
export default {
    data(){
        return{
            answers:["Đáp án A","Đáp án B","Đáp án C","Đáp án D"],
            options:["1","2","3","4"]
        }
    },
    methods:{
        changeDoneQuestion(){
            console.log('Hello')
            this.$emit('updateTestQuestion',true)
        }
    },
    components:{
        IconSend
    }
}
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/course/choicequestion/_elearning-course-do.scss";
</style>