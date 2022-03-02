<template>
  <div class="container wrap__study-space">
    <div class="row">
      <div class="col-md-3">
        <MyCourseSide :active="2" />
      </div>

      <div class="col-md-9">
        <div class="mycourses">
          <h4 class="mycourses__title">Bài giảng và khóa học của tôi</h4>

          <div class="mycourses__content">
            <div class="d-flex mb-4">
              <div class="elearning-manager-content__title__nav">
                <!-- <a @click="changeTab(1)" :class="tab === 1 ? 'active' : ''">Tất cả ({{total.elearnings}})</a> -->
                <a @click="changeTab(2)" :class="tab === 2 ? 'active' : ''">
                  Đang theo học ({{
                    numeral(get(statistic, "total_elearnings", 0)).format()
                  }})
                </a>
                <a @click="changeTab(3)" :class="tab === 3 ? 'active' : ''">
                  Đã hoàn thành ({{
                    numeral(get(statistic, "total_completed", 0)).format()
                  }})
                </a>

                <a @click="changeTab(4)" :class="tab === 4 ? 'active' : ''">
                  Yêu thích ({{
                    numeral(get(statistic, "total_favourites", 0)).format()
                  }})
                </a>

                <a @click="changeTab(5)" :class="tab === 5 ? 'active' : ''">
                  Lưu trữ ({{
                    numeral(get(statistic, "total_archieves", 0)).format()
                  }})
                </a>
              </div>
            </div>

            <div class="search-field">
              <div class="d-flex">
                <div class="search__mycourses mr-3">
                  <app-search
                    style="max-width: 36rem; min-width: 30rem;"
                    class="mb-0"
                    size="sm"
                    placeholder="Tìm kiếm"
                    v-model="params.keyword"
                    bordered
                  />
                </div>

                <div class="filter-form__item my-0">
                  <filter-button
                    @click="toggleFilter"
                    :color="showFilter ? 'primary' : 'white'"
                  >
                  </filter-button>
                </div>
              </div>

              <div class="d-flex-center mt-15" v-if="showFilter">
                <div class="filter-form__item my-0 ml-0">
                  <app-vue-select
                    style="width: 11rem"
                    class="app-vue-select filter-form__item__selection"
                    label="text"
                    placeholder="Thể loại"
                    has-border
                    :value="params.type"
                    :reduce="item => item.value"
                    @input="handleChangeType"
                    :options="typeOpts"
                    :all-opt="allOpt"
                  ></app-vue-select>
                </div>
                <div class="filter-form__item my-0">
                  <app-vue-select
                    style="width: 14rem"
                    class="app-vue-select filter-form__item__selection"
                    v-model="selectSubject"
                    label="text"
                    placeholder="Môn học"
                    :value="params.subject"
                    :reduce="item => item.value"
                    @input="handleChangeSubject"
                    :options="subjectsOpt"
                    :all-opt="allOpt"
                    has-border
                  ></app-vue-select>
                </div>
                <div class="filter-form__item my-0">
                  <app-vue-select
                    style="width: 11rem"
                    class="app-vue-select filter-form__item__selection"
                    v-model="selectFree"
                    label="text"
                    placeholder="Học phí"
                    :value="params.free"
                    :reduce="item => item.value"
                    @input="handleChangeFree"
                    :options="freeOpts"
                    has-border
                    :all-opt="allOpt"
                  ></app-vue-select>
                </div>
                <!-- <div class="filter-form__item my-0">
                  <app-vue-select
                    style="width: 11rem"
                    class="app-vue-select filter-form__item__selection"
                    v-model="selectClass"
                    label="text"
                    placeholder="Lớp"
                    :value="params.class"
                    :reduce="(item) => item.value"
                    @input="handleChangeClass"
                    :options="classesOpt"
                    has-border
                    :all-opt="allOpt"
                  ></app-vue-select>
                </div> -->
                <div class="filter-form__item my-0">
                  <app-vue-select
                    style="width: 20rem"
                    class="app-vue-select filter-form__item__selection"
                    v-model="selectGroup"
                    label="text"
                    placeholder="Lớp/ Nhóm học tập"
                    :value="params.group"
                    :reduce="item => item.value"
                    @input="handleChangeGroup"
                    :options="groupClassOpt"
                    has-border
                    :all-opt="allOpt"
                  ></app-vue-select>
                </div>
              </div>
            </div>

            <div v-if="loading" class="mt-4 text-center"><app-spin /></div>
            <div v-else>
              <ElearningList
                :elearningList="get(list, 'content', [])"
                :col="'col-md-4'"
              >
                <ElearningItem
                  slot-scope="{ item }"
                  :elearning="item"
                  :tab="tab"
                  @handleFavourite="handleFavourite"
                  @handleDeleteFavourite="handleDeleteFavourite"
                  @handleDeleteArchive="handleDeleteArchive"
                  @handleArchive="handleArchive"
                  @shareFb="shareFb"
                  @shareSchool="shareSchool"
                ></ElearningItem>
              </ElearningList>

              <app-pagination
                :pagination="get(list, 'page', {})"
                :type="1"
                @pagechange="onPageChange"
              />
            </div>

            <ShareElearningModal
              v-if="checkModalShare"
              @cancel="cancel"
              :dataModal="dataModal"
              @submit="handleShareSchoolly"
            />
            <!-- ModalShare -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MyCourseSide from "~/components/page/elearning/mycourses/MyCourseSide";
import ElearningList from "~/components/page/elearning/mycourses/ElearningList";
import ElearningItem from "~/components/page/elearning/mycourses/ElearningItem";
import MenuDropDown from "~/components/page/elearning/mycourses/MenuDropDown";
import ShareElearningModal from "~/components/page/elearning/mycourses/ShareElearningModal";
import { mapState, mapActions, mapGetters } from "vuex";
import * as actionTypes from "~/utils/action-types";
import { get } from "lodash";
const STORE_NAME_FAVOURITE = "elearning/study/study-favourite";
const STORE_NAME_ARCHIVE = "elearning/study/study-archive";
import numeral from "numeral";
import IconHamberger from "~/assets/svg/icons/hamberger.svg?inline";
import { useEffect } from "~/utils/common";

export default {
  middleware: ["authenticated"],

  components: {
    MyCourseSide,
    ElearningList,
    ElearningItem,
    MenuDropDown,
    ShareElearningModal,
    IconHamberger
  },
  data() {
    return {
      loading: false,
      params: {
        size: 12,
        page: 1,
        keyword: null,
        completed: false,
        type: null,
        subject: null,
        free: null,
        is_archive: false,
        is_hidden: true,
        tab: 2,
        class_id: null,
        group_id: null
      },
      tab: 2,
      checkModalShare: false,
      dataModal: {},
      showFilter: false,
      selectType: null,
      selectSubject: null,
      selectFree: null,
      selectClass: null,
      selectGroup: null,
      allOpt: {
        value: null,
        text: "Tất cả"
      },
      types: [
        { text: "Bài giảng", value: "LECTURE" },
        { text: "Khóa học", value: "COURSE" }
      ],
      free: [
        { text: "Miễn phí", value: true },
        { text: "Có phí", value: false }
      ]
    };
  },

  mounted() {
    useEffect(this, this.getData.bind(this), ["params"]);
    this.$store.dispatch("elearning/study-space/getStatistic");
    this.$store.dispatch(
      `elearning/public/public-subject/${actionTypes.ELEARNING.SUBJECT}`
    );
    const payload = {
      size: 999,
      sorted_by: 'OLDEST'
    };
    // this.$store.dispatch(
    //   `elearning/study-group/group/${actionTypes.STUDY_GROUP.LIST}`, payload
    // );
    // this.$store.dispatch("elearning/study-group/group/getClasses", payload);
    this.$store.dispatch("elearning/study-group/group/getListGroupClass", payload);
  },

  computed: {
    ...mapState("elearning/study-space", {
      finished_lecture: "finished_lecture",
      unfinished_lecture: "unfinished_lecture",
      statistic: "statistic",
      archive: "archive",
      favourite: "favourite"
    }),
    ...mapState("elearning/public/public-subject", {
      subjects: "subjects"
    }),
    ...mapState("elearning/study-group/group", ["groupClasses"]),
    ...mapGetters("elearning/study-group/group", ["groupClassOpt"]),

    classesOpt() {
      let data = get(this, "classes.content", []).map(item => ({
        value: item.id,
        text: item.name
      }));
      return [this.allOpt, ...data];
    },
    groupsOpt() {
      let data = get(this, "groups.content", []).map(item => ({
        value: item.id,
        text: item.name
      }));
      return [this.allOpt, ...data];
    },

    subjectsOpt() {
      let data = this.subjects.map(item => ({
        value: item.id,
        text: item.name
      }));
      return [this.allOpt, ...data];
    },

    list() {
      if (this.tab === 2) {
        return this.unfinished_lecture;
      }
      if (this.tab === 3) {
        return this.finished_lecture;
      }
      if (this.tab === 4) {
        return this.favourite;
      }
      if (this.tab === 5) {
        return this.archive;
      }
      return this.unfinished_lecture;
    },
    typeOpts() {
      return [this.allOpt, ...this.types];
    },
    freeOpts() {
      return [this.allOpt, ...this.free];
    }
  },

  methods: {
    handleChangeClass(type) {
      this.params.class_id = type;
    },

    handleChangeGroup(group_id) {
      console.log("[handleChangeGroup]", group_id);
      const groupClasses = get(this, "groupClasses.content", []);
      const groupObj = groupClasses.find(g => g.id == group_id);
      if (groupObj) {
        if (groupObj.type == "CLASS") {
          this.params.group_id = null;
          this.params.class_id = group_id;
        } else if (groupObj.type == "GROUP") {
          this.params.class_id = null;
          this.params.group_id = group_id;
        }
      } else {
        this.params.class_id = null;
        this.params.group_id = null;
      }
    },

    handleChangeType(type) {
      this.params.type = type;
    },

    handleChangeSubject(subject) {
      this.params.subject = subject;
    },

    handleChangeFree(free) {
      this.params.free = free;
    },

    async getData() {
      if (this.loading) return;

      this.loading = true;
      let payload = {
        params: this.params
      };
      if (this.tab === 2) {
        await this.$store.dispatch("elearning/study-space/getUnFinished", payload);
      }
      if (this.tab === 3) {
        await this.$store.dispatch("elearning/study-space/getFinished", payload);
      }
      if (this.tab === 4) {
        await this.$store.dispatch("elearning/study-space/getFavourite", payload);
      }
      if (this.tab === 5) {
        await this.$store.dispatch("elearning/study-space/getArchive", payload);
      }
      this.loading = false;
    },

    ...mapActions(STORE_NAME_FAVOURITE, [
      "elearningStudyFavouriteAdd",
      "elearningStudyFavouriteDelete"
    ]),

    ...mapActions(STORE_NAME_ARCHIVE, [
      "elearningStudyArchiveAdd",
      "elearningStudyArchiveDelete"
    ]),

    changeTab(tab) {
      this.tab = tab;
      // đang theo học
      if (tab == 2) {
        this.params.completed = false;
        this.params.is_archive = false;
      }
      // đã hoàn thành
      if (tab == 3) {
        this.params.completed = true;
        this.params.is_archive = false;
      }
      // yêu thích
      if (tab == 4) {
        this.params.completed = null;
        this.params.is_archive = false;
      }
      // Lưu trữ
      if (tab == 5) {
        this.params.completed = null;
        this.params.is_archive = true;
      }
      this.params.tab = tab;
      this.params.page = 1;
      this.params.keyword = null;
    },

    handleFavourite(id) {
      const query = {
        elearning_id: id
      };
      this.elearningStudyFavouriteAdd(query).then(result => {
        if (result.success == true) {
          this.getData();
          this.$store.dispatch("elearning/study-space/getStatistic");
        }
      });
    },

    handleDeleteFavourite(id) {
      const query = {
        elearning_ids: [id]
      };
      this.elearningStudyFavouriteDelete(query).then(result => {
        const payload = {
          params: {
            type: this.params.type,
            size: 8,
            page: this.params.page
          }
        };
        if (result.success == true) {
          this.getData();
          this.$store.dispatch("elearning/study-space/getStatistic");
        }
      });
    },

    handleArchive(id) {
      const query = {
        elearning_id: id
      };
      this.elearningStudyArchiveAdd(query).then(result => {
        const payload = {
          params: {
            type: this.params.type,
            size: 8,
            page: this.params.page
          }
        };
        if (result.success == true) {
          this.getData();
          this.$store.dispatch("elearning/study-space/getStatistic");
        }
      });
    },

    handleDeleteArchive(id) {
      const query = {
        elearning_ids: [id]
      };
      this.elearningStudyArchiveDelete(query).then(result => {
        const payload = {
          params: {
            type: this.params.type,
            size: 8,
            page: this.params.page
          }
        };
        if (result.success == true) {
          this.getData();
          this.$store.dispatch("elearning/study-space/getStatistic");
        }
      });
    },

    onPageChange(e) {
      this.params.page = get(e, "number", 0) + 1;
    },

    shareFb(id) {
      const url =
        "https://facebook.com/sharer.php?display=popup&u=" +
        window.origin +
        `elearning/${id}`;
      window.open(url, "sharer", "_blank");
    },

    async shareSchool(item) {
      this.checkModalShare = true;
      this.dataModal = item;
    },

    async handleShareSchoolly(_content) {
      const link = window.origin + `/elearning/${this.dataModal.elearning_id}`;
      const doAdd = await this.$store.dispatch(
        `social/newfeed/${actionTypes.NEWFEED.ADD_POST}`,
        { link: link, content: _content }
      );
      if (doAdd.success) {
        this.menuDropdown = false;
        this.$toasted.show("Đã chia sẻ thành công.");
      } else {
        this.$toasted.error(doAdd.message);
      }
    },

    cancel() {
      this.checkModalShare = false;
    },

    toggleFilter() {
      if (this.showFilter) {
        this.selectType = null;
        this.selectSubject = null;
        this.selectFree = null;
        let params = { ...this.params };
        params.type = null;
        params.subject = null;
        params.free = null;
        this.params = params;
      }
      this.showFilter = !this.showFilter;
    },

    handleChangedType() {
      this.params.type = this.selectType.value;
    },
    get,
    numeral
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/manager/_elearning-manager-content.scss";
@import "~/assets/scss/components/elearning/_elearning-my-courses";
</style>
