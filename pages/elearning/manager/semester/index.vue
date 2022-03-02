<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <ElearningManagerSide :active="15" />
      </div>
      <div class="col-md-9">
        <sub-block-section title="Danh sách kỳ thi">
          <template v-slot:content>
            <div class="px-2">
              <ExamsForm @search="handleSearch" />
              <div class="mt-4" v-if="loading">
                <vcl-table />
              </div>
              <ExamsTable 
                v-else 
                @search="handleSearch" 
                :tab="payload.status"
                @deleteSemester="showModalDelete"
                @changeEnable="handleChangeEnable"
              />
            </div>
          </template>
        </sub-block-section>
        <!-- <ExamsCase :tab="tab" /> -->
      </div>
    </div>
    <app-modal-confirm
        v-if="isConfirmDelete"
        title="Bạn có chắc muốn xóa"
        @cancel="isConfirmDelete = false"
        @ok="handleDeleteSemester"
    />
  </div>
</template>

<script>
import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
import ExamsMenuTab from "~/components/page/elearning/exams/ExamsMenuTab";
import ExamsForm from "~/components/page/elearning/exams/ExamsForm";
import ExamsCase from "~/components/page/elearning/exams/ExamsCase";
import ExamsTable from "~/components/page/elearning/exams/ExamsTable";
import { VclTable } from "vue-content-loading";

import { mapActions, mapGetters, mapState } from "vuex";
import { get } from 'lodash';

export default {
  components: {
    ElearningManagerSide,
    ExamsMenuTab,
    ExamsForm,
    ExamsCase,
    ExamsTable,
    VclTable
  },

  data() {
    return {
      loading: false,
      payload: {
        status: "APPROVED"
      },
      isConfirmDelete: false,
      deleteID:null
    };
  },

  computed: {
    ...mapGetters("elearning/public/public-grades", ["gradesAllOpts", "classessAllOpts"]),
    ...mapGetters("elearning/public/public-subject", ["subjectsAllOpts"]),
    ...mapGetters("elearning/study-group/group",["groupsOtp"]),
    ...mapState("auth", {
      userLogin: "token"
    }),
  },

  created() {
    this.handleSearch(this.payload);

    const payloadClasses = {
      school_id: get(this, "userLogin.organization.id", "")
    };

   
    // get list filter options
    //this.getGradeAll();
    this.getClasses(payloadClasses);
    this.elearningPublicSubject();
    this.getListStudyGroup();
    this.getGrades();
  },

  methods: {
    ...mapActions("elearning/semester/manage-exam", ["getListSemesterExam","deleteSemesterExam","enableSemesterExam"]),
    ...mapActions("elearning/public/public-grades", ["getGradeAll", "getClasses"]),
    ...mapActions("elearning/public/public-subject", ["elearningPublicSubject"]),
    ...mapActions("elearning/study-group/group", ["getListStudyGroup"]),

    async handleSearch(payload) {
      this.payload = {
        ...this.payload,
        ...payload
      };

      console.log("[handleSearch]", this.payload);
      this.loading = true;
      await this.getListSemesterExam(this.payload);
      this.loading = false;
    },
    async handleDeleteSemester(){
      const payload ={
        id : this.deleteID
      }
      console.log(payload,'hello')
      const res = await this.deleteSemesterExam(payload);
      if(get(res,"success",false)){
        this.$toasted.success('Thành công');
        this.handleSearch(this.payload);
        this.isConfirmDelete = false;
        return;
      }
      this.$toasted.error(get(res, "message", "Có lỗi xảy ra"));
      this.isConfirmDelete = false;
    },
    showModalDelete(val){
      this.deleteID = val;
      this.isConfirmDelete = true;
    },
    async handleChangeEnable(val){
      const payload ={
        enable: !val.enable,
        exam_ids:[
          val.id
        ]
      }
      const rs = await this.enableSemesterExam(payload)
      if(get(rs,"success", false)) {
        this.$toasted.success('Thành công')
        this.handleSearch(this.payload);
        return;
      }
      else{
        this.$toasted.error(get(rs, "message", "dsad"))
      }
    },
    getGrades() {
      const params = {
        school_id: get(this, "userLogin.organization.id", ""),
        school_level: get(this, "userLogin.organization.level", ""),
      };
      this.$store.dispatch(`elearning/create/getGrades`, params);
    }
  }
};
</script>

<style></style>
