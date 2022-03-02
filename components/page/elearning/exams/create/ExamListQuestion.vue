<template>
  <div class="exam-list-question">
    <div class="text-primary mr-3">Trắc nghiệm (... điểm)</div>
    <div class="px-2 mt-4">
        <!--Table-->
        <app-table
            class="mt-5"
            :loading="loading"
            :heads="heads"
            :pagination="pagination"
            :data="data"
            @pagechange="onPageChange"
        >
            <template v-slot:cell(manual)="{ row }">
                <td>
                    <span v-html="row.manual.level"></span>
                </td>
            </template>
            <template v-slot:cell(content)="{ row }">
                <td>
                    <span v-html="row.manual.content.replace('[]', '[...]')"></span>
                </td>
            </template>
            <template v-slot:cell(setting)="{ row }">
                <td class="wrap-btn-setting" onclick='event.stopPropagation();'>
                <ExamButtonMenu 
                    class="btn-setting"
                    @manageSemester="handleManageSemester(row)"
                    @deleteSemester="$emit('delete-emester',row.id)"
                    @changeEnable="$emit('change-nable',row)"
                    @showReason="showReasonDenied(row)"
                    :tab="tab"
                    :enable="row.enable"
                />
                </td>
            </template>
        </app-table>
        <!--End table-->
        <div>
            <p class="mb-3">
                <span class="heading-5 text-dark">Tổng điểm: </span>
                <span class="heading-5 text-primary">8/10</span>
            </p>
            <p class="elq__note">*Lưu ý: Một bài tập bắt buộc có kèm câu hỏi tự luận được tính là hợp lệ phải có tổng điểm các câu hỏi là 10, trong đó điểm thấp nhất của một câu hỏi là 0,25 *</p>
        </div>
    </div>
    <question-detail-modal
        v-if="isShowQuestionDetailModal"
        :content="showingItem"
        @close="isShowQuestionDetailModal = false"
    >
    </question-detail-modal>
    <app-modal-confirm
        v-if="isShowDelQuestionModal"
        @cancel="isShowDelQuestionModal = false"
        @ok="destroyQuestion"
    >
    </app-modal-confirm>
  </div>
</template>

<script>
import IconAlert from '~/assets/svg/v2-icons/alert/error_outline_24px.svg?inline';
import ButtonCreateQuestion from "~/components/page/course/create/common/ButtonCreateQuestion";
import DropdownSettingMenu from "~/components/page/course/create/common/DropdownSettingMenu";
import EditQuestionFromBank from "~/components/page/course/create/common/EditQuestionFromBank";
import EditQuestionYesNo from "~/components/page/course/create/common/EditQuestionYesNo";
import EditQuestionSingleChoice from "~/components/page/course/create/common/EditQuestionSingleChoice";
import EditQuestionMultiChoice from "~/components/page/course/create/common/EditQuestionMultiChoice";
import EditQuestionFillBlank from "~/components/page/course/create/common/EditQuestionFillBlank";
import EditQuestionWriting from "~/components/page/course/create/common/EditQuestionWriting";
import EditQuestionWordChoice from "~/components/page/course/create/common/EditQuestionWordChoice";
import EditQuestionMatchWord from "~/components/page/course/create/common/EditQuestionMatchWord";
import QuestionDetailModal from "~/components/page/course/create/common/QuestionDetailModal";
import DropdownEditScoreMenu from "~/components/page/course/create/common/DropdownEditScoreMenu";
import ExamButtonMenu from "~/components/page/elearning/exams/ExamButtonMenu";

import draggable from 'vuedraggable'
import {get} from "lodash";
import { EXAM_TYPE_QUESTION } from "~/utils/constants";
export default {
    components:{
        IconAlert,
        ButtonCreateQuestion,
        draggable,
        DropdownSettingMenu,
        EditQuestionFromBank,
        EditQuestionYesNo,
        EditQuestionSingleChoice,
        EditQuestionMultiChoice,
        EditQuestionFillBlank,
        EditQuestionWriting,
        EditQuestionWordChoice,
        EditQuestionMatchWord,
        QuestionDetailModal,
        DropdownEditScoreMenu,
        ExamButtonMenu
    },
    data(){
        return{
            typeQuestion:'CHOICE',
            editingItem: { },
            isShowQuestionDetailModal: false,
            isShowDelQuestionModal: false,
            showingItem: { },
            EXAM_TYPE_QUESTION: Object.freeze(EXAM_TYPE_QUESTION),
            questions: null,
            question_bank: null,
            params: {
                query: null,
                parent: "TEST",
                parent_id: this.$route.query.test_id,
                level: null,
            },
            heads: [
                {
                name: "content",
                text: "Nội dung",
                },
                {
                name: "type",
                text: "Thể loại",
                },
                {
                name: "level",
                text: "Cấp độ",
                },
                {
                name: "index",
                text: "Thứ tự",
                },
                {
                name: "setting",
                text: "",
                },
            ],
        }
    },
    props: {
        data: {
            type: Array,
            default: []
        },
        pagination: {
            type: Object,
            default: {}
        },
        loading: {
            type: Boolean,
            default: false
        },
    },
    computed:{
    },
    methods:{
        get,

        onPageChange(e) {
            this.$emit("pagechange", e);
        },

        showDetail(item) {
            this.showingItem = Object.assign({}, item);
            this.isShowQuestionDetailModal = true;
        },
        editQuestion(item) {
            this.editingItem = Object.assign({}, item);
        },
        sortQuestion(item) {
            console.log('sort question', item);
        },
        deleteQuestion(item) {
            console.log('delete question', item);
        this.isShowDelQuestionModal = true;
        },
            cancelEditQuestion() {
            this.editingItem = {};
        },
        destroyQuestion() {
            console.log('[Handling destroy question]');
        },
        handleSelectMenu(val){
            this.$emit('select',val)
        }
    }
}
</script>

<style lang="scss">
.exam-list-question{
    padding: 1rem .5rem;
    .app-table table th{
        border-top: none;
    }
    .list-question__item{
        border-bottom: 1px solid #E0E0E0;
        padding: 2rem;
        cursor: pointer;
    }
    .elq__note{
        color: #999999;
        font-size: 13px;
    }
}
</style>