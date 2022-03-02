<template>
  <sub-block-section
      title="Chọn Lớp hoặc Nhóm học tập"
      :content-cls="{ 'py-0': true, 'px-0': true,}"
      :titleCls="{'manager-side-class-menu':true}"
      class="manager-side-menu"
    >
        <template  v-slot:content>
            <div v-if="isLoadingContent" class="px-3 py-3">
                <vcl-list class="bg-white" />
            </div>
            <div v-else class="px-4 py-3">
                <app-vue-select
                    class="app-vue-select form-item__selection w-100"
                    label="text"
                    placeholder="Chọn lớp học/nhóm học tập"
                    :options="groupClsOpts"
                    @input="changeValue"
                    has-border
                ></app-vue-select>
                <p class="text-success mt-3">{{ currentGroupClsSummary.students || 0 }} học sinh <span v-if="currentGroupClsSummary.homeroom && currentGroupClsSummary.type == 'CLASS'"> - Lớp chủ nhiệm</span></p>
            </div>
        </template>
    </sub-block-section>
</template>

<script>
import { VclList } from "vue-content-loading";
import { get } from "lodash";
import { mapGetters, mapActions, mapMutations } from "vuex";
import * as mutationTypes from "~/utils/mutation-types";
import * as actionTypes from "~/utils/action-types";

export default {
    components: {
        VclList
    },
    data() {
        return {
            isLoadingContent: false
        };
    },
    computed: {
        ...mapGetters('elearning', {
            groupClsOpts: 'groupClsOpts',
            currentGroupClsDetail: 'currentGroupClsDetail',
            currentGroupClsSummary: 'currentGroupClsSummary'
        }),
        selectedGroupCls() {
            return this.currentGroupClsDetail;
        }
    },
    methods: {
        ...mapActions('elearning', {
            getClsGroups: actionTypes.TEACHER_CLASS_GROUP.LIST
        }),
        ...mapMutations('elearning', {
            setCurrentGroupCls: mutationTypes.TEACHER_CLASS_GROUP.SET_CURRENT_GROUP_CLASS
        }),
        async getList() {
            try {
                this.isLoadingContent = true;
                const params = {
                    type: null,
                    schoolyear_id: null
                };
                const res = await this.getClsGroups({ params: params });
            } catch (error) {
                this.$toasted.error('Lỗi lấy dữ liệu lớp/nhóm học tập');
            } finally {
                this.isLoadingContent = false;
            }
        },
        changeValue(value) {
            this.setCurrentGroupCls(value);
        },
        get
    },
    async created() {
        await Promise.all([
            this.getList()
        ]);
    }
}
</script>

<style lang="scss">
.manager-side-class-menu{
    h4{
        font-size: 1.6rem;
    }
}
</style>