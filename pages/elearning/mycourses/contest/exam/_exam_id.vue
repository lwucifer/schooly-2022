<template>
    <div class="container">
        <breadcrumb />

        <div class="row">
            <div class="col-md-9">
                <DetailExamIntro class="mb-4" :data="exam"/>
              
                <DetaiExamContent class="mb-4" />
                <CommentAndRateExam :exam_id="payload.exam_id"/>
            </div>

            <div class="col-md-3">
                <ElearningRightSide :exam="exam"/>
            </div>
        </div>
    </div>
</template>

<script>
import {
  initBreadcrumb,
  createPageTitle,
  initPageTitle,
  useEffect,
} from "~/utils/common";
import ElearningRightSide from "~/components/page/elearning/ElearningRightSide";
import DetailExamIntro from "~/components/page/elearning/exams/detail/DetailExamIntro";
import DetaiExamContent from "~/components/page/elearning/exams/detail/DetaiExamContent";
import CommentAndRateExam from "~/components/page/elearning/exams/detail/CommentAndRateExam";

import { mapState, mapActions, mapGetters } from "vuex";
import { get } from "lodash";

export default {
    data() {
        return {
            payload: {
                exam_id: null,
                parent: "EXAM",
                show_result: true
            }
        }
    },

    components: {
        DetailExamIntro,
        DetaiExamContent,
        CommentAndRateExam,
        ElearningRightSide
    },

    created() {
        this.payload.exam_id = this.$route.params ? this.$route.params.exam_id : "";
        this.getExam(this.payload),
        this.getTests(this.payload)
    },

    computed: {
        ...mapState("elearning/exam/exam", ["exam", "tests"]),
    },

    methods: {
        ...mapActions("elearning/exam/exam", ["getExam", "getTests"]),
    },

    mounted() {
        const breadcrumb = [
            {
                title: "Quản lý E-learning",
                to: "/elearning",
            },
            {
                title: "Kỳ thi",
                to: "/elearning/exam/detail",
            },
        ];
        initBreadcrumb(this, breadcrumb);
    },
}
</script>

<style>

</style>