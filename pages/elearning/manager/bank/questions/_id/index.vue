<template>
  <div class="container bank-questions">
    <breadcrumb />

    <div class="row">
      <div class="col-md-3">
        <ElearningManagerSide :group="5" :active="13" />
      </div>

      <div class="col-md-9">
        <sub-block-section
          :actionClick="handleBack"
          :title="get(question_bank, 'name', '')"
          has-icon
        >
          <template #content>
            <div class="d-flex-center">
              <div
                class="filter-form__item ml-0"
                style="max-width: 36rem; min-width: 30rem"
              >
                <app-search
                  class="page-filter__search w-100 mb-0"
                  placeholder="Nhập để tìm kiếm"
                  size="sm"
                  bordered
                  v-model="params.query"
                />
              </div>
              <div class="filter-form__item">
                <app-button
                  :color="showFilter ? 'primary' : 'white'"
                  square
                  :size="'sm'"
                  @click="toggleFilter"
                >
                  <IconHamberger
                    :class="showFilter ? 'fill-white' : 'fill-primary'"
                    class="mr-2"
                  />
                  <span>Lọc kết quả</span>
                </app-button>
              </div>

              <div class="d-flex-center ml-3" v-if="showFilter">
                <div class="filter-form__item">
                  <app-vue-select
                    style="width: 14rem"
                    class="app-vue-select filter-form__item__selection"
                    placeholder="Cấp độ"
                    has-border
                    label="name"
                    :options="levels"
                    :all-opt="allOpt"
                    :reduce="(item) => item.id"
                    @input="handleChangeLevel"
                    :value="params.level"
                  ></app-vue-select>
                </div>
              </div>
            </div>

            <div class="page-btn d-flex-center">
              <app-button
                color="secondary"
                class="mr-4"
                @click="handleDeleteQuestions"
                :disabled="disabledDeleteRows"
              >
                <IconDelete24px />Xóa
              </app-button>

              <app-button @click="handleRedirectAddQuestion">
                <IconPlus2 />Thêm câu hỏi
              </app-button>

              <n-link
                class="ml-auto btn btn--size-md btn--color-white"
                :to="
                  '/elearning/manager/bank/questions/' +
                    $route.params.id +
                    '/import'
                "
              >
                <IconCloud />Import câu hỏi
              </n-link>
            </div>

            <!--Table-->
            <app-table
              class="mt-5"
              :loading="loading"
              :heads="heads"
              :pagination="get(questions, 'page', {})"
              :data="get(questions, 'content', [])"
              multiple-selection
              :cols="cols"
              @selectAll="handleSelectAll"
              @check="handleSelectItem"
            >
              <template v-slot:cell(content)="{ row }">
                <td>
                    <div class="answer-text">
                      <div v-html="row.content.replace('[]', '[...]')"></div>
                    </div>
                </td>
              </template>
              <template v-slot:actions="{ row }">
                <!-- <button @click="preview(row)">
                  <IconEye
                    height="18"
                    width="18"
                    class="fill-primary mr-2"
                  />Xem chi tiết
                </button> -->
                <n-link
                  :to="
                    `/elearning/manager/bank/questions/create?parent_id=${$route.params.id}&question_id=${row.id}`
                  "
                  class="link"
                >
                  <IconEdit
                    class="fill-purple mr-2"
                    height="16"
                    width="16"
                  />Chỉnh sửa
                </n-link>
                <button @click="deleteRows(row.id)">
                  <IconDelete24px
                    height="22"
                    width="22"
                    class="fill-secondary mr-2"
                  />Xóa
                </button>
              </template>
            </app-table>
            <!--End table-->
          </template>
        </sub-block-section>
      </div>
    </div>

    <app-modal-confirm
      centered
      v-if="showModalConfirm"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      title="Bạn có chắc chắn muốn xóa?"
      description=""
    />
  </div>
</template>

<script>
import ElearningManagerSide from "~/components/page/elearning/manager/ElearningManagerSide";
import IconDelete24px from "~/assets/svg/v2-icons/delete_24px.svg?inline";
import IconPlus2 from "~/assets/svg/icons/plus2.svg?inline";
import IconEdit from "~/assets/svg/icons/edit.svg?inline";
import IconEye from "~/assets/svg/v2-icons/remove_red_eye_24px.svg?inline";
import IconHamberger from "~/assets/svg/icons/hamberger.svg?inline";
import IconCloud from "~/assets/svg/v2-icons/cloud_download_24px.svg?inline";
import { get, cloneDeep } from "lodash";
import { useEffect, questionBankTypeArr } from "~/utils/common";
import { LEVEL_QUESTIONS } from "~/utils/constants";

export default {
  data() {
    return {
      allOpt: {
        value: null,
        text: 'Tất cả'
      },
      showFilter: false,
      cols: [8, 57, 20, 15],
      loading: false,

      showModalConfirm: false,
      confirmLoading: false,

      heads: [
        {
          name: "content",
          text: "Nội dung",
        },
        {
          name: "typeText",
          text: "Thể loại",
        },
        // {
        //   name: "level",
        //   text: "Cấp độ",
        // },
      ],
      payloadDeleteQuestions: {
        ids: [],
      },

      questions: null,
      question_bank: null,
      params: {
        query: null,
        parent: "BANK",
        parent_id: this.$route.params.id,
        level: null,
      },

      levels: [{ name: "Tất cả", id: "" }].concat(LEVEL_QUESTIONS),
    };
  },

  async mounted() {
    useEffect(this, this.getQuestions.bind(this), ["params"]);

    const parent_id = get(this, "$route.params.id", "");
    this.question_bank = await this.getQuestionBank(parent_id);
  },

  watch: {
    showFilter: {
      handler: function() {
        if (!this.showFilter) this.params.level = null;
      },
      deep: true,
    },
  },

  components: {
    ElearningManagerSide,
    IconDelete24px,
    IconPlus2,
    IconEye,
    IconEdit,
    IconHamberger,
    IconCloud,
  },

  computed: {
    disabledDeleteRows() {
      return this.payloadDeleteQuestions.ids.length === 0;
    },
  },

  methods: {
    handleChangeLevel(level) {
      this.params.level = level ? level : null;
    },

    async getQuestionBank(parent_id) {
      const res = await this.$axios({
        url: `/elearning/teaching/manage/question_bank/${parent_id}`,
      });
      if (get(res, "data.success", false)) {
        return get(res, "data.data", null);
      }
      return null;
    },

    handleBack() {
      this.$router.push("/elearning/manager/bank/questions");
    },

    handleDeleteQuestions() {
      this.showModalConfirm = true;
    },

    deleteRows(question_id) {
      this.payloadDeleteQuestions.ids = [question_id];
      this.showModalConfirm = true;
    },

    async handleOk() {
      this.confirmLoading = true;
      const data = {
        ids: this.payloadDeleteQuestions.ids,
      };
      try {
        const res = await this.$axios({
          url: "/elearning/teaching/manage/question",
          method: "DELETE",
          data,
        });
        this.handleCancel();
        if (get(res, "data.success", false)) {
          this.getQuestions();
          this.$toasted.success("Thành công");
          return;
        }
        this.$toasted.error(get(res, "data.message", "Có lỗi xảy ra"));
      } catch (error) {
        this.$toasted.error("Có lỗi xảy ra");
      }
    },

    handleCancel() {
      this.showModalConfirm = false;
      this.confirmLoading = false;
      this.payloadDeleteQuestions.ids = [];
    },

    handleSelectAll(items) {
      let question_ids = [];
      items.map((item) => {
        question_ids.push(item.id);
      });
      this.payloadDeleteQuestions.ids = question_ids;
    },

    handleSelectItem(item, items) {
      let question_ids = [];
      items.map((item) => {
        question_ids.push(item.id);
      });
      this.payloadDeleteQuestions.ids = question_ids;
    },

    async getQuestions() {
      let params = cloneDeep(this.params);
      if (!params.query) params.query = null;
      if (!params.level) params.level = null;
      this.loading = true;
      const res = await this.$axios({
        url: `/elearning/teaching/manage/questions`,
        params,
      });
      this.parseQuestions(res.data.data);
      this.loading = false;
    },

    parseQuestions(questions) {
      this.questions = questions;
      get(this, "questions.content", []).map((question) => {
        question.content = question.manual.content;
        let level = "";

        this.levels.map((item) => {
          if (question.manual.level === item.id) {
            level = item.name;
          }
        });
        question.level = level;

        let typeText = "";
        questionBankTypeArr.map((item) => {
          if (question.type === item.id) {
            typeText = item.name;
          }
        });
        question.typeText = typeText;
      });
    },

    handleRedirectAddQuestion() {
      const url = `/elearning/manager/bank/questions/create?parent_id=${this.$route.params.id}`;
      this.$router.push(url);
    },
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    get,
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/bank/_questions.scss";
</style>
