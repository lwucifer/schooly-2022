<template>
  <div class="container">
    <ElearningHomeBox title="Lọc kỳ thi" class="mb-4">
      <app-carousel
        class="bg-white px-4"
        :options="{
          slidesPerView: 10,
          spaceBetween: 10,
          preventClicksPropagation: false,
          pagination: {
            el: '.eh-subject-pagination',
            type: 'bullets',
            clickable: true,
          },
        }"
      >
        <template slot-scope="{ classes }">
          <div
            v-for="item in get(public_vote_subjects, 'content', [])"
            :key="item.id"
            :class="classes"
          >
            <ElearningExamSubjectItem
              :title="item.name"
              :to="`/elearning/search?subject=${item.code}&type=&sort=`"
            >
              <img slot="icon" :src="item.icon_url" />
            </ElearningExamSubjectItem>
          </div>
        </template>
      </app-carousel>
    </ElearningHomeBox>

    <ElearningHomeBox>
      <app-carousel
        class="bg-white px-4"
        :options="{
          slidesPerView: 10,
          spaceBetween: 10,
          preventClicksPropagation: false,
          pagination: {
            el: '.eh-subject-pagination',
            type: 'bullets',
            clickable: true,
          },
        }"
      >
        <template slot-scope="{ classes }">
          <div v-for="item in grades" :key="item.id" :class="classes">
            <ElearningExamBlockItem
              :title="item.name"
              :to="`/elearning/search?subject=${item.code}&type=&sort=`"
            />
          </div>
        </template>
      </app-carousel>
    </ElearningHomeBox>

    <ElearningHomeBox title="Danh sách kỳ thi">
      <div class="d-flex justify-content-between align-items-center">
        <ul class="elearning-home-box__tab">
          <li v-for="item in whatNextsTabs" :key="item.value">
            <a
              href="javscript:;"
              :class="{ active: params.criteria === item.value }"
              @click.prevent="handleSelectExamType(item.value)"
              >{{ item.text }}</a
            >
          </li>
        </ul>

        <div class="d-flex align-items-center">
          <IconViewList
            class="mr-3"
            style="cursor: pointer"
            @click="view = 'landspace'"
            :class="{ 'fill-primary': view == 'landspace' }"
          />

          <IconViewModule
            class="mr-3"
            style="cursor: pointer"
            @click="view = 'portrait'"
            :class="{ 'fill-primary': view == 'portrait' }"
          />
          <app-search
            size="sm"
            class="mb-0"
            placeholder="Tìm kiếm kỳ thi"
            v-model="params.keyword"
          />
        </div>
      </div>

      <div v-if="loading">
        Loading...
      </div>

      <div class="row mt-4" v-if="view === 'portrait' && !loading">
        <div
          class="col-md-3"
          v-for="item in get(exams, 'content', [])"
          :key="item.id"
        >
          <ListExamItem :data="item" />
        </div>
      </div>

      <div class="row mt-4" v-if="view == 'landspace' && !loading">
        <div
          class="col-md-6"
          v-for="item in get(exams, 'content', [])"
          :key="item.id"
        >
          <ListExamItem :data="item" :isLandspace="true" />
        </div>
      </div>
    </ElearningHomeBox>
  </div>
</template>

<script>
import ElearningHomeBox from "~/components/page/elearning/home/ElearningHomeBox";
import ElearningExamSubjectItem from "~/components/page/elearning/exams/ElearningExamSubjectItem";
import ElearningExamBlockItem from "~/components/page/elearning/exams/ElearningExamBlockItem";
import ListExamItem from "~/components/page/elearning/exams/ListExamItem";
import IconViewList from "~/assets/svg/v2-icons/view_list_24px.svg?inline";
import IconViewModule from "~/assets/svg/v2-icons/view_module_24px.svg?inline";
import { get } from "lodash";
import { mapState } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { useEffect } from "~/utils/common";

export default {
  components: {
    ElearningHomeBox,
    ElearningExamSubjectItem,
    ElearningExamBlockItem,
    ListExamItem,
    IconViewList,
    IconViewModule,
  },

  data() {
    return {
      view: "portrait", //portrait, landspace

      loading: true,

      whatNextsTabs: [
        {
          value: "highlights",
          text: "NỔI BẬT",
        },
        {
          value: "most",
          text: "THI NHIỀU NHẤT",
        },
        {
          value: "free",
          text: "MIỄN PHÍ",
        },
        {
          value: "paid",
          text: "CÓ PHÍ",
        },
      ],

      params: {
        criteria: "highlights",
        limit: 10,
        page: 1,
        keyword: "",
      },
    };
  },

  mounted() {
    useEffect(this, this.getExams.bind(this), ["params"]);
    this.$store.dispatch("elearning/exam/exams/getPublicVoteSubjects");
    this.$store.dispatch("elearning/exam/exams/getGrades");
  },

  computed: {
    ...mapState("elearning/exam/exams", {
      exams: "exams",
      public_vote_subjects: "public_vote_subjects",
      grades: "grades",
    }),
  },

  methods: {
    async getExams() {
      this.loading = true;
      await this.$store.dispatch("elearning/exam/exams/getExams", this.params);
      this.loading = false;
    },

    handleSelectExamType(criteria) {
      this.params.criteria = criteria;
    },

    get,
  },
};
</script>
