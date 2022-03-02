<template>
    <div class="container">
        <div class="row">
            <div class="col-md-3">
                <MyCourseSide :active="7"/>
            </div>

            <div class="col-md-9">
                <sub-block-section title="Tài liệu học tập">
                    <template #content>
                        <DocsFilter @search="handleSearch"/>

                        <DocsTable :loading="loading" @pagechange='pagechange'/>
                    </template>
                </sub-block-section>
            </div>
        </div>
    </div>
</template>

<script>
import MyCourseSide from "~/components/page/elearning/mycourses/MyCourseSide"
import DocsFilter from "~/components/page/elearning/mycourses/forms/DocsFilter"
import DocsTable from "~/components/page/elearning/mycourses/tables/DocsTable"

import { mapActions, mapGetters, mapState } from "vuex";
import { get } from 'lodash';

export default {
    data() {
        return {
            payload: {},
            loading: false
        }
    },

    components: {
        MyCourseSide,
        DocsFilter,
        DocsTable
    },

    created() {
        this.studyDocsList()
    },

    computed: {
        ...mapState("auth", {
            userLogin: "token"
        }),
    },

    methods: {
        ...mapActions("elearning/public/public-subject", ["elearningPublicSubject"]),
        ...mapActions("elearning/study/study-documents", ["studyDocsList"]),

        async handleSearch(payload) {
            if (this.loading) return

            try {
                this.loading = true
                this.payload = {...payload};

                Object.keys(this.payload).map((k) => {
                    if (this.payload[k] == null || this.payload[k] == -1) {
                        delete this.payload[k];
                    }
                });
                
                await this.studyDocsList(this.payload)
            } catch (e) {
            } finally {
                this.loading = false;
            }
        },

        async pagechange(e) {
            if (this.loading) return

            try {
                this.loading = true;
                this.payload = {...this.payload, ...e};
                await this.studyDocsList(this.payload)
            } catch (e) {
            } finally {
                this.loading = false;
            }
        }
    }
}
</script>

