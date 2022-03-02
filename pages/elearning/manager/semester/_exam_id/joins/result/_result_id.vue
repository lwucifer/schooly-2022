<template>
  <div class="container">
      <div class="row">
           <div class="col-md-3">
                <ElearningManagerSide/>
            </div>
            <div class="col-md-9">
                <sub-block-section
                    title="Kết quả làm bài"
                    has-icon
                >
                    <div slot="content" class="px-2 py-3">
                        <ExamResultChoice :detail="submission" v-if="type =='CHOICE'"/>
                        <ExamResultEssay :detail="submission" v-else-if="type =='ESSAY'"/>
                    </div>
                </sub-block-section>
            </div>
      </div>
  </div>
</template>

<script>
import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
import ExamResultChoice from "~/components/page/elearning/exams/ExamResultChoice";
import ExamResultEssay from "~/components/page/elearning/exams/ExamResultEssay";

import * as actionTypes from "~/utils/action-types";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    components:{
        ElearningManagerSide,
        ExamResultChoice,
        ExamResultEssay
    },

    data(){
        return{
            type:"ESSAY",//"CHOICE","ESSAY"
            payload: {
                test_id: null,
                user_id: null
            }
        }
    },

    created() {
        this.payload.test_id = this.$route.params ? this.$route.params.exam_id : "";
        this.payload.user_id = this.$route.params ? this.$route.params.result_id : "";
        this.getListSubmission()
    },

    computed: {
        ...mapState("elearning/semester/join", ["submission"])
    },

    methods: {
        ...mapActions("elearning/semester/join", ["teachingTestSubmissionList"]),

        getListSubmission() {
            Object.keys(this.payload).map((k) => {
                if (this.payload[k] == null || this.payload[k] == -1) {
                delete this.payload[k];
                }
            });

            this.teachingTestSubmissionList(this.payload)
        },
    }
}
</script>

<style>

</style>