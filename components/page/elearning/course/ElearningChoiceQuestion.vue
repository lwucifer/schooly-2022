<template>
  <div>
      <div v-if="!startQuestion">
          <ElearningOpenChoiceTest @btnQuestion="setstartQuestion"/>
      </div>
      <div v-else>
          <div v-if="!doneQuestion">
              <ElearningDoChoiceTest @updateTestQuestion="setDoneQuestion"/>
          </div>
          <div v-else>
              <div v-if="checktest">
                <div v-if="resultTest">
                    <ElearningCourseResultTest/>
                </div>
                <div v-else>
                    <ElearningCourseFailResultTest/>
                </div>
              </div>
              <div v-else>
                    <ElearningCourseNotCheckTest/>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import ElearningOpenChoiceTest from "~/components/page/elearning/course/ChoiceQuestions/ElearningOpenChoiceTest"
import ElearningDoChoiceTest from "~/components/page/elearning/course/ChoiceQuestions/ElearningDoChoiceTest"
import ElearningCourseResultTest from "~/components/page/elearning/course/ChoiceQuestions/ElearningCourseResultTest"
import ElearningCourseFailResultTest from "~/components/page/elearning/course/ChoiceQuestions/ElearningCourseFailResultTest"
import ElearningCourseNotCheckTest from "~/components/page/elearning/course/ChoiceQuestions/ElearningCourseNotCheckTest"
export default {
    data(){
        return{
           startQuestion:false,
            doneQuestion:false,
            resultTest:false,
            checktest:true
        }
    },
    components:{
        ElearningOpenChoiceTest,
        ElearningDoChoiceTest,
        ElearningCourseResultTest,
        ElearningCourseFailResultTest,
        ElearningCourseNotCheckTest
    },
    methods:{
        setstartQuestion(startQuestion){
            this.startQuestion=startQuestion;
        },
        setDoneQuestion(doneQuestion){
            this.doneQuestion=doneQuestion;
        }
    }
}
</script>

<style>

</style>