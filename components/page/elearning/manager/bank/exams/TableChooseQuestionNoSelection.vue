<template>
  <div>
    <app-table
      :heads="tableHeads"
      :data="filterData"
      :pagination="pagination"
      @pagechange="onPageChange"
      @selectionChange="selectionChange"
    >
      <td slot="cell(manual.content)" slot-scope="{ row }">
        <div class="d-flex align-items-center">
          <!-- <img
            src="~assets/images/create-course/thumnail-video.png"
            alt=""
            class="mr-3"
          />-->
          <span v-html="(row.manual && row.manual.content) || ''"></span>
        </div>
      </td>
      <td slot="cell(type)" slot-scope="{ row }">
        <span>{{ row.type | exType2TxtTypeQues }}</span>
      </td>
      <td slot="cell(manual.level)" slot-scope="{ row }">
        <span>{{ row.manual && row.manual.level | exType2TxtLevel }}</span>
      </td>
      <td class="text-right" slot="cell(action)" slot-scope="{ row }">
        <button @click="selectItem(row)" class="text-primary">Chọn</button>
      </td>
    </app-table>
  </div>
</template>

<script>
import { BANK_EXAM_TYPE } from "~/utils/constants";

export default {
  props: {
    fillterQuestionToBank: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      tableHeads: [
        {
          name: "manual.content",
          text: "Nội dung",
        },
        {
          name: "type",
          text: "Thể loại",
        },
        {
          name: "manual.level",
          text: "Cấp độ",
        },
        {
          name: "action",
          text: "",
        },
      ],
    };
  },

  computed: {
    filterData() {
      let tmp =
        (this.fillterQuestionToBank && this.fillterQuestionToBank.content) ||
        [];
      let tmpMap = [];
      let typeCheck = this.$route.query ? this.$route.query.type : "";
      if (typeCheck == BANK_EXAM_TYPE.MIX) {
        tmpMap = tmp;
      } else {
        tmpMap = tmp.filter((item) => item.category == typeCheck);
      }
      return tmpMap;
    },
    pagination() {
      const page =
        this.fillterQuestionToBank && this.fillterQuestionToBank.page
          ? this.fillterQuestionToBank.page
          : {};
      return {
        first: page ? page.first : false,
        last: page ? page.last : false,
        number: page ? page.number : 1,
        number_of_elements: page ? page.number_of_elements : 1,
        // page: page ? page.page : 1,
        size: page ? page.size : 1,
        total: page ? page.total : 1,
        total_elements: page ? page.total_elements : 1,
        total_pages: page ? page.total_pages : 1,
      };
    },
  },

  methods: {
    selectionChange(data) {
      console.log("selectionChange", data);
      let arrayId = data.map((item) => {
        return item.id;
      });
      this.$emit("selectionChangeQuestion", arrayId);
    },

    onPageChange(e) {
      console.log("e", e);
      this.$emit("onPageChange", e);
    },
    selectItem(item) {
      console.log("[Select Item]", item);
      this.$emit("selectItem", item);
    },
  },
};
</script>

<style></style>
