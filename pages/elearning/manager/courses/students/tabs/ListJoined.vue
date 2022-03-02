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
      :list="filterDataList.content"
      :pagination="filterPagination"
    />
  </div>
</template>

<script>
import StudentManagerFilterForm from "~/components/page/elearning/manager/student/StudentManagerFilterForm";
import StudentManagerTable from "~/components/page/elearning/manager/student/StudentManagerTable";
import { mapState, mapActions } from "vuex";
const STORE_NAMESPACE = "elearning/teaching/elearning-participant";
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
          name: "date",
          text: "Ngày tham gia"
        },
        {
          name: "progress",
          text: "Tiến độ học tập"
        },
        {
          name: "medium_score",
          text: "Điểm trung bình"
        },
        {
          name: "action",
          text: ""
        }
      ],
      list: [],
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
    ...mapState(STORE_NAMESPACE, ["elearningParti"]),
    filterDataList() {
      return this.elearningParti ? this.elearningParti : {};
    },
    filterPagination() {
      return {
        size:
          this.elearningParti && this.elearningParti.size
            ? this.elearningParti.size
            : 10,
        total_pages:
          this.elearningParti && this.elearningParti.total_pages
            ? this.elearningParti.total_pages
            : 1,
        total_elements:
          this.elearningParti && this.elearningParti.total_elements
            ? this.elearningParti.total_elements
            : 0,
        first:
          this.elearningParti && this.elearningParti.first
            ? this.elearningParti.first
            : 1,
        last:
          this.elearningParti && this.elearningParti.last
            ? this.elearningParti.last
            : 1,
        number_of_elements:
          this.elearningParti && this.elearningParti.number_of_elements
            ? this.elearningParti.number_of_elements
            : 0,
        number:
          this.elearningParti && this.elearningParti.number
            ? this.elearningParti.number
            : 0
      };
    }
  },
  methods: {
    ...mapActions(STORE_NAMESPACE, ["teachingElearningList"]),
    submitSearch(keyword) {
      const query = {
        params: {
          ...keyword,
          elearning_id: this.$route.query.elearning_id
        }
      };
      this.teachingElearningList(query);
    },
    changedType(classes) {
      if (classes == "Khác") {
        const query = {
          params: {
            khac: true,
            elearning_id: this.$route.query.elearning_id
          }
        };
        this.teachingElearningList(query);
      } else {
        const query = {
          params: {
            class_id: classes,
            elearning_id: this.$route.query.elearning_id
          }
        };
        this.teachingElearningList(query);
      }
    },
    submitShowFilter(val){
      this.showFilter=val;
    }
  }
};
</script>

<style>
</style>