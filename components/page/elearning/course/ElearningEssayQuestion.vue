<template>
  <div>
      <div v-if="!startQuestion">
          <ElearningOpenEssayTest @updateStartQuestion="setStartQuestion"/>
      </div>
      <div v-else>
          <div v-if="!doneQuestion">
              <ElearningDoEssayTest @updateDoneQuestion="setDoneQuestion"/>
          </div>
          <div v-else>
              <div v-if="resultTest">
                  <ElearningPassResultTest/>
              </div>
              <div v-else>
                  <ElearningFailResultTest @updateStartQuestion="setStartQuestion"/>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import ElearningOpenEssayTest from "~/components/page/elearning/course/EssayQuestions/ElearningOpenEssayTest"
import ElearningDoEssayTest from "~/components/page/elearning/course/EssayQuestions/ElearningDoEssayTest"
import ElearningSuccessPost from "~/components/page/elearning/course/EssayQuestions/ElearningSuccessPostTest"
import ElearningPassResultTest from "~/components/page/elearning/course/EssayQuestions/ElearningPassResultTest"
import ElearningFailResultTest from "~/components/page/elearning/course/EssayQuestions/ElearningFailResultTest"
export default { 
    data(){
        return{
            startQuestion:false,
            doneQuestion:false,
            resultTest:false,
        }
    },
    components:{
        ElearningOpenEssayTest,
        ElearningDoEssayTest,
        ElearningSuccessPost,
        ElearningPassResultTest,
        ElearningFailResultTest
    },methods:{
        setStartQuestion(v){
            this.startQuestion=v;
        },
        setDoneQuestion(v){
            this.doneQuestion=v
        }
    }
}
</script>

<style>

</style>