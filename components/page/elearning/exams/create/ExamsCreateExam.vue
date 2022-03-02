<template>
  <div class="exams-create-exam" v-if="form =='form'">
      <sub-block-section
        title="Đề thi"
      >
        <template v-slot:content>
            <div class="exams-create-exam__content">
                <app-button @click="handleAddExam">
                    <IconAdd24px :height="15"/>
                    Thêm đề thi
                </app-button>
                <app-table
                    :data="list"
                    :loading="loading"
                    :heads="heads"
                    :pagination="pagination"
                    @pagechange="onPageChange"
                    class="exams-create-exam__table"
                    :cols="[30,15,20,15,15,15,15]"
                >
                    <template v-slot:actions="{row}">
                        <div v-if="row.statistic.questions > 0">
                            <button @click="handleEditExam(row.id)">
                                <IconVisibility24px :height="16" class="mr-3 fill-primary"/>
                                Xem chi tiết
                            </button>
                            <button @click="handleEditExam(row.id)">
                                <IconEdit :height="16" class="mr-3 icon-edit"/>
                                Chỉnh sửa
                            </button>
                            <button @click="handleDelete(row.id)">
                                <IconDelete24px :height="16" class="mr-3 fill-secondary"/>
                                Xóa
                            </button>
                        </div>
                        <div v-else>
                            <button @click="handleEditExam(row.id)">
                                <IconVisibility24px :height="16" class="mr-3 fill-primary"/>
                                Xem chi tiết
                            </button>
                            <button @click="handleEditExam(row.id)">
                                <IconAddCircleOutline24px :height="16" class="mr-3 fill-info"/>
                                Thêm câu hỏi
                            </button>
                            <button @click="handleDelete(row.id)">
                                <IconDelete24px :height="16" class="mr-3 fill-secondary"/>
                                Xóa
                            </button>
                        </div>
                    </template>
                    <template v-slot:cell(grade)="{row}">
                        <td>
                            <div class="w-100 text-center">{{row.grade.id}}</div>
                        </td>
                    </template>
                    <template v-slot:cell(number)="{row}">
                        <td>
                            <div class="w-100 text-center">{{row.statistic.questions}}</div>
                        </td>
                    </template>
                    <template v-slot:cell(type)="{row}">
                        <td v-if="row.type == 'MIX'">
                            Kết hợp
                        </td>
                        <td v-else-if="row.type == 'ESSAY'">
                            Tự luận
                        </td>
                        <td v-else-if="row.type == 'CHOICE'">
                            Trắc nghiệm
                        </td>
                        <td v-else>
                        </td>
                    </template>
                    <template v-slot:cell(subject)="{row}">
                        <td>
                            {{row.subject.name}}
                        </td>
                    </template>
                    <template v-slot:cell(created)="{row}">
                        <td>
                            {{getDateBirthDay(row.created)}}
                        </td>
                    </template>
                    <template v-slot:cell(status)="{row}">
                        <td class="d-flex justify-content-center">
                            <IconCreate24px class="icon-create" :height="18" v-if="row.status == 0"/>
                            <IconDoneAll24px class="fill-primary" :height="18" v-if="row.status == 1"/>
                        </td>
                    </template>
                </app-table>
            </div>
        </template>
      </sub-block-section>
      <div class="w-100 text-right">
        <app-button class="btn-confirm" @click="$emit('go-publish')">Xác nhận</app-button>
      </div>

        <!-- <ModalBankExam
        @close="modalBankExam = false"
        v-if="modalBankExam"
        :typeExam="typeExam"
        :statusExam="statusExam"
        :titleExam="getObjBankExamEdit && getObjBankExamEdit.name"
        /> -->
        <app-modal-confirm
        v-if="showModalConfirm"
        :confirmLoading="confirmLoading"
        @ok="handleOk"
        :width="550"
        @cancel="handleCancel"
        title="Bạn muốn xóa đề thi này?"
        description=""
        />
  </div>
  
  <ExamCreateNew 
    v-else-if="form =='add'"
    @go-step2="goStep2"
    @go-form="form = 'form'"
    :edit="edit"
  />
  <!-- <ExamCreateEdit 
    v-else-if="form =='edit'"
  /> -->
  <ExamCreateAddQuestion 
    v-else-if="form =='addQuestion'"
    @back-create="backCreate"
    @go-back="addQuestionBack"
  /> 
</template>

<script>
import IconAdd24px from '~/assets/svg/v2-icons/add_24px.svg?inline';
import IconEdit from '~/assets/svg/icons/edit.svg?inline';
import IconVisibility24px from '~/assets/svg/v2-icons/visibility_24px.svg?inline';
import IconDelete24px from '~/assets/svg/v2-icons/delete_24px.svg?inline';
import IconAddCircleOutline24px from '~/assets/svg/v2-icons/add_circle_outline_24px.svg?inline';
import IconCreate24px from '~/assets/svg/v2-icons/create_24px.svg?inline';
import IconDoneAll24px from '~/assets/svg/v2-icons/done_all_24px.svg?inline';
import ExamCreateNew from "~/components/page/elearning/exams/create/ExamCreateNew"
import ExamCreateAddQuestion from "~/components/page/elearning/exams/create/ExamCreateAddQuestion"
import ExamCreateEdit from "~/components/page/elearning/exams/create/ExamCreateEdit";
import ModalBankExam from "~/components/page/elearning/manager/bank/exams/ModalBankExam";

import { getDateBirthDay } from "~/utils/moment";
import { mapGetters, mapActions, mapState } from "vuex";
import { get } from "lodash";

export default {
    components:{
        IconAdd24px,
        IconEdit,
        IconVisibility24px,
        IconDelete24px,
        IconAddCircleOutline24px,
        IconCreate24px,
        IconDoneAll24px,
        ExamCreateNew,
        ExamCreateAddQuestion,
        ExamCreateEdit,
        ModalBankExam
    },
    props: {
        edit: {
            type: Boolean,
            default: false
        },
    },

    data(){
        return{
            showModalConfirm: false,
            confirmLoading: false,
            rowId: '',
            loading: false,
            testId: '',
            form:"form", //form,add,edit,addQuestion
            heads:[
                {
                    name: "name",
                    text: "Tên kỳ thi"
                },
                {
                    name: "grade",
                    text: "Khối",
                    classTextCenter: true
                },
                {
                    name: "subject",
                    text: "Môn",
                },
                {
                    name: "type",
                    text: "Thể loại",
                },
                {
                    name: "number",
                    text: "Số câu hỏi",
                    classTextCenter: true
                },
                {
                    name: "status",
                    text: "Trạng thái",
                    classTextCenter: true
                },
                {
                    name: "created",
                    text: "Ngày tạo",
                }
            ],
            list:[],
            pagination: {
                page: 1,
                size: 10
            }
        }
    },
    
    watch: {
        form(newValue, oldValue) {
            if (newValue == 'form') this.getExams();
        },
    },

    methods:{
        get,
        getDateBirthDay,

        ...mapActions("elearning/manager/bank/exam", ["bankExamlist", "bankExamDelete"]),

        backCreate() {
            this.form = 'add'
        },
        goStep2 (id) {
            this.$router.push('?id='+ get(this.$route, 'query.id', '') +'&test_id=' + id);
            this.form = 'addQuestion';
        },
        handleEditExam(id){
            this.$router.push('?id='+ get(this.$route, 'query.id', '') +'&test_id=' + id);
            this.form = 'addQuestion';
        },
        addQuestionBack(){
            this.$router.push('?id='+ get(this.$route, 'query.id', ''));
            this.form = 'form';
        },
        handleAddExam(){
            this.form = 'add'
        },
        async getExams () {
            let params = {
                page: this.pagination.page,
                size: this.pagination.size,
                parent: 'EXAM',
                parent_id: get(this.$route, 'query.id', ''),
                show_statistic: 'true'
            }
            this.loading = true;
            const res = await this.bankExamlist(params);
            if(get(res,"success",false)){
                this.list = get(res, 'data.content', []);
                this.pagination = get(res, 'data.page', {});
                this.loading = false;
                return;
            }
            this.loading = false;
        },

        async handleOk () {
            const res = await this.bankExamDelete(this.rowId);
            if(get(res,"success",false)){
                this.$toasted.success("Đã xóa");
                this.getExams()
            } else {
                this.$toasted.success("Xóa thất bại");
            }
            this.showModalConfirm = false;
            this.rowId = '';
        },

        handleCancel () {
            this.rowId = '',
            this.showModalConfirm = false;
        },
        handleDelete (id) {
            this.rowId = id,
            this.showModalConfirm = true;
        },

        onPageChange(e) {
            this.pagination = { ...this.pagination, ...e };
            this.pagination.page = this.pagination.number + 1;
            this.getExams();
        }
    },

    created() {
        this.getExams();

        if (get(this.$route, 'query.test_id', false) && this.edit) {
            this.form = 'addQuestion'
        }
    }
}
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/exams/_exams-create-exam.scss";
</style>