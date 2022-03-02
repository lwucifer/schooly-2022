<template>
    <div class="container">
        <div class="row">
            <div class="col-md-3">
                <MyCourseSide :active="5"/>
            </div>

            <div class="col-md-9">
                <sub-block-section title="Danh sách kỳ thi">
                    <template #content>
                        <ContestFilter @search="handleSearch"/>

                        <ContestTable/>
                    </template>
                </sub-block-section>
            </div>
        </div>
    </div>
</template>

<script>
import MyCourseSide from "~/components/page/elearning/mycourses/MyCourseSide"
import ContestFilter from "~/components/page/elearning/mycourses/forms/ContestFilter"
import ContestTable from "~/components/page/elearning/mycourses/tables/ContestTable"

import { mapActions, mapGetters, mapState } from "vuex";
import { get } from 'lodash';

export default {
    data() {
        return {
            payload: {
                
            },
        }
    },

    components: {
        MyCourseSide,
        ContestFilter,
        ContestTable
    },

    created() {
        this.getGrades();
        this.elearningPublicSubject();
        this.getListStudentExams()
    },

    computed: {
        ...mapState("auth", {
            userLogin: "token"
        }),
    },

    methods: {
        ...mapActions("elearning/public/public-subject", ["elearningPublicSubject"]),
        ...mapActions("elearning/mycourses/my-exams", ["getListStudentExams"]),

        getGrades() {
            const params = {
                school_id: get(this, "userLogin.organization.id", ""),
                school_level: get(this, "userLogin.organization.level", ""),
            };
            
            this.$store.dispatch(`elearning/create/getGrades`, params);
        },

        async handleSearch(payload) {
            this.payload = {...payload};

            Object.keys(this.payload).map((k) => {
                if (this.payload[k] == null || this.payload[k] == -1) {
                    delete this.payload[k];
                }
            });
            
            await this.getListStudentExams(this.payload)
        }
    }
}
</script>

