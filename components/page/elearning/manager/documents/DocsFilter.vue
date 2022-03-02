<template>
    <div class="page-filter mb-4 pt-2">
        <div class="d-flex-center">
            <app-search
                class="mb-0 mr-3"
                style="max-width: 36rem; min-width: 30rem;"
                placeholder="Nhập để tìm kiếm"
                bordered
                size="sm"
                v-model="payload.keyword"
                @submit="handleChangeQuery"
                @keyup.enter.native="handleChangeQuery"
            />
            <filter-button
            @click="toggleFilter"
            :color="showFilter ? 'primary': 'white'"
            ></filter-button>

            <app-button size="sm"  class="ml-auto" @click="modalUpload = true">
                <IconPlusCircle class="fill-white mr-2"/>
                Thêm mới tài liệu
            </app-button>
        </div>

        <div v-if="showFilter" class="mt-15 d-flex-center">
            <app-vue-select
                class="mr-4"
                style="width: 13.5rem"
                placeholder="Môn học"
                label="text"
                has-border
                :options="subjectsOpt"
                @input="handleChangeSubject"
                :all-opt="allOpt"
            />

            <app-vue-select
                class="mr-4"
                style="width: 16.9rem"
                placeholder="Bài giảng/khoá học"
                label="text"
                has-border
                :options="elearningsOpt"
                @input="handleChangeElearning"
                :all-opt="allOpt"
            />

            <app-vue-select
                class="w-120 mr-4"
                placeholder="Thời gian"
                label="text"
                has-border
                :options="[allOpt, ...times]"
                @input="handleChangeTimes"
                :all-opt="allOpt"
            />
        </div>


        <ModalUploadFile 
            v-if="modalUpload"
            @close="close"
            :max-capacity="get(capacityInfo, 'data.max_repository_capacity', 0)"
            :used-capacity="get(capacityInfo, 'data.used_repository_capacity', 0)"
        />
    </div>
</template>

<script>
import IconHamberger from "~/assets/svg/icons/hamberger.svg?inline";
import IconPlusCircle from '~/assets/svg/design-icons/plus-circle.svg?inline';
import ModalUploadFile from "~/components/page/elearning/manager/documents/ModalUploadFile.vue"

import { mapActions, mapGetters, mapState } from "vuex";
import { get } from 'lodash';
import * as actionTypes from "~/utils/action-types"

const basePayload = {
    grade_id: null,
    subject_id: null,
    elearning_id: null,
    keyword: null,
    time: null,
    page: 1,
    size: 10,
    group_id: null,
    class_id: null
}

export default {
    data() {
        return {
            modalUpload: false,
            allOpt: {
                value: null,
                text: 'Tất cả'
            },
            times: [
                {value: 'yesterday', text: 'Hôm qua'},
                {value: 'today', text: 'Hôm nay'},
                {value: '7days', text: '7 ngày qua'},
                {value: '30days', text: '30 ngày qua'},
                {value: '90days', text: '90 ngày qua'},
            ],
            showFilter: false,
            payload: {...basePayload},
        }
    },

    components: {
        IconHamberger,
        IconPlusCircle,
        ModalUploadFile
    },

    mounted() {
        const params = {
            school_id: get(this, "userLogin.organization.id", ""),
            size: 9999
        };
        const eParams = {
            page: 1,
            limit: 9999,
            status : "APPROVED",
            hide : false,
        }
        this.$store.dispatch(
            `elearning/teaching/elearning/${actionTypes.TEACHING_ELEARNINGS.LIST}`, eParams
        )
        this.$store.dispatch(`elearning/create/getSubjects`, params);

        this.$store.dispatch(
            `elearning/teaching/repository/${actionTypes.ELEARNING_TEACHING_REPOSITORY.INFO}`, {}
        )
    },

    computed: {
        ...mapState('elearning/teaching/repository', {
            capacityInfo: 'info'
        }),
        ...mapState("auth", {
            userLogin: "token"
        }),
        ...mapState("elearning/teaching/elearning",{
            elearnings: "elearnings"
        }),
        ...mapState("elearning/create", {subjects:"subjects"}),
        ...mapGetters('elearning', {
            currentGroupClsDetail: 'currentGroupClsDetail',
        }),
        groupIsSelecting() {
            return this.currentGroupClsDetail && this.currentGroupClsDetail.type ?
            this.currentGroupClsDetail.type == 'GROUP' : false;
        },
        classIsSelecting() {
            return this.currentGroupClsDetail && this.currentGroupClsDetail.type ?
            this.currentGroupClsDetail.type == 'CLASS' : false;
        },
        elearningsOpt() {
            let data = get(this, 'elearnings.data.content', []).map((item) => ({
            value: item.id,
            text: item.name,
            }));
            return [this.allOpt, ...data]
        },
        subjectsOpt() {
            let data = get(this, 'subjects', []).map((item) => ({
            value: item.id,
            text: item.name,
            }));
            return [this.allOpt, ...data]
        },
    },

    watch: {
        currentGroupClsDetail(newVal, oldVal) {
            if (this.groupIsSelecting) {
                this.payload.group_id = get(newVal, 'id', null);
                this.payload.class_id = null;
            } else if (this.classIsSelecting) {
                this.payload.class_id = get(newVal, 'id', null);
                this.payload.group_id = null;
            } else {
                this.payload.group_id = null;
                this.payload.class_id = null;
            }
            this.$emit("search", this.payload)
        },
    },

    methods: {
        get, 

        close(e) {
            this.modalUpload = false;
            if(e) this.$emit("search", this.payload)
        },
        checkPayload() {
            if (this.payload.subject_id) return true
            if (this.payload.elearning_id) return true
            if (this.payload.time) return true
            return false
        },
        toggleFilter() {
            this.showFilter = !this.showFilter;
            if (this.checkPayload() && !this.showFilter) {
                this.payload = {...this.payload, ...basePayload};
                this.$emit("search", this.payload);
            }
        },

        handleChangeClass(val) {
            this.payload.page = 1;
            this.payload.class_id = val.value;
            this.$emit("search", this.payload)
        },

        handleChangeGroup(val) {
            this.payload.page = 1;
            this.payload.group_id = val.value;
            this.$emit("search", this.payload)
        },
        
        handleChangeTimes(val) {
            this.payload.page = 1;
            this.payload.time = val.value;
            this.$emit("search", this.payload)
        },

        handleChangeSubject(val) {
            this.payload.page = 1;
            this.payload.subject_id = val.value;
            this.$emit("search", this.payload)
        },

        handleChangeElearning(val) {
            this.payload.page = 1;
            this.payload.elearning_id = val.value;
            this.$emit("search", this.payload)
        },

        handleChangeQuery(val) {
            if(val.length > 0) {
                this.payload.page = 1;
                this.payload.keyword = val;
                this.$emit("search", this.payload)
            }
        },

        initParams() {
            this.payload.group_id = this.groupIsSelecting ? get(this, 'currentGroupClsDetail.id', '') : null;
            this.payload.class_id = this.classIsSelecting ? get(this, 'currentGroupClsDetail.id', '') : null;
        },
    },

    created() {
        this.initParams();
    }
}
</script>

<style>

</style>