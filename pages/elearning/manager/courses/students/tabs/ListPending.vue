<template>
  <div class="container">
    <student-manager-filter-form 
      @submitFilter="submitSearch" 
      @changedType="changedType" 
      @submitShowFilter="submitShowFilter"
      :showFilter="showFilter"
    />
    <student-manager-table
      :heads="heads"
      :list="filterElearningRequest"
      :pagination="filterPagination"
    />
  </div>
</template>

<script>
import StudentManagerFilterForm from "~/components/page/elearning/manager/student/StudentManagerFilterForm";
import StudentManagerTable from "~/components/page/elearning/manager/student/StudentManagerTable";
import { mapState, mapActions } from "vuex";
const STORE_TEACHING_REQUEST = "elearning/teaching/request";
export default {
  layout: "manage",
  
  components: {
    StudentManagerFilterForm,
    StudentManagerTable
  },
  data() {
    return {
      showFilter:false,
      heads: [
        {
          name: "name",
          text: "Học sinh"
        },
        {
          name: "class",
          text: "Lớp"
        },
        {
          name: "request_date",
          text: "Ngày gửi yêu cầu"
        },
        {
          name: "confirm",
          text: "Thao tác"
        }
      ],
      list: [
        {
          name: "Nguyễn Văn A",
          class: "10B",
          date: "19/10/2021",
          progress: "50",
          question: 0
        }
      ],
      pagination: {
        total_elements: 0,
        last: false,
        total_pages: 1,
        size: 10,
        number: 0,
        first: true,
        number_of_elements: 0
      }
    };
  },
  computed: {
    ...mapState(STORE_TEACHING_REQUEST, ["elearningRequest"]),
    filterElearningRequest() {
      return this.elearningRequest && this.elearningRequest.content
        ? this.elearningRequest.content
        : [];
    },
    filterPagination() {
      return {
        size:
          this.elearningRequest && this.elearningRequest.size
            ? this.elearningRequest.size
            : 10,
        total_pages:
          this.elearningRequest && this.elearningRequest.total_pages
            ? this.elearningRequest.total_pages
            : 1,
        total_elements:
          this.elearningRequest && this.elearningRequest.total_elements
            ? this.elearningRequest.total_elements
            : 0,
        first:
          this.elearningRequest && this.elearningRequest.first
            ? this.elearningRequest.first
            : 1,
        last:
          this.elearningRequest && this.elearningRequest.last
            ? this.elearningRequest.last
            : 1,
        number_of_elements:
          this.elearningRequest && this.elearningRequest.number_of_elements
            ? this.elearningRequest.number_of_elements
            : 0,
        number:
          this.elearningRequest && this.elearningRequest.number
            ? this.elearningRequest.number
            : 0
      };
    }
  },

  methods: {
    ...mapActions(STORE_TEACHING_REQUEST, ["teachingElearningRequestsList"]),
    submitSearch(keyword) {
      const query = {
        params: {
          ...keyword,
          elearning_id: this.$route.query.elearning_id
        }
      };
      this.teachingElearningRequestsList(query);
    },
    changedType(classes) {
      if (classes == "Khác") {
        const query = {
          params: {
            khac: true,
            elearning_id: this.$route.query.elearning_id
          }
        };
        this.teachingElearningRequestsList(query);
      } else {
        const query = {
          params: {
            class_id: classes,
            elearning_id: this.$route.query.elearning_id
          }
        };
        this.teachingElearningRequestsList(query);
      }
    },
    submitShowFilter(val){
      this.showFilter=val
    }
  },

  created () {
     const query = {
      params: {
        khac: true,
        elearning_id: this.$route.query.elearning_id
      }
    };
    this.teachingElearningRequestsList(query);
  },
};
</script>

<style>
</style>