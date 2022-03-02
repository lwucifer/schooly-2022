<template>
  <no-ssr>
    <div class="app-table">
      <table :class="{ ...tableCls, ...extTableCls, ...gridCls }">
        <thead class="app-table__head" :class="{ ...headerCls, ...headerExtCls }">
          <tr :class="{'d-none': propsHead}">
            <th v-if="multipleSelection" class="checkbox">
              <app-checkbox
                @change="changeSelect"
                :checked="allSelected"
                :disabled="!hasData"
                title="Chọn tất cả"
              />
            </th>
            <th
              v-for="(item, index) in heads"
              :key="index"
              :class="item.classTextCenter ? 'text-center' : ''"
            >
              <div
                class="div-head"
                :class="{
                'ml-auto': item.textRight,
                'w-100': !item.sort
              }"
              >
                <div v-html="item.text"></div>
                <span class="btn-sort" @click="sort(item.name)" v-if="item.sort">
                  <IconDirection height="18" width="18" />
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <!-- Use slot body -->
        <slot v-if="hasDefaultSlot && hasData" :class="bodyCls"></slot>
        <!-- Use data list -->
        <tbody v-if="!hasDefaultSlot && hasData && !loading" :class="bodyCls">
          <tr v-for="(cat, i) in cats" :key="i">
            <td
              v-if="multipleSelection || selectAll"
              class="checkbox"
              @mouseover="mouseOver = false"
              @mouseleave="mouseOver = true"
            >
              <app-checkbox @change="check($event, cat)" :checked="checkSelected(cat)" />
            </td>
            <!--Slot is named by column key-->
            <template>
              <slot
                v-for="(item, j) in heads"
                :item="item"
                :index="i"
                :row="cat"
                :name="'cell(' + item.name + ')'"
              >
                <td
                  v-html="cat[item.name]"
                  v-bind:style="cat[item.css] ? cat[item.css] : ''"
                  v-bind:class="
                    cat[item.name] && cat[item.class] ? cat[item.class] : ''
                  "
                  :key="j"
                ></td>
              </slot>
            </template>

            <!-- Hover actions -->
            <td class="actions" :class="mouseOver ? 'show' : ''" v-if="hasActionsSlot">
              <slot name="actions" :row="cat"></slot>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="text-center w-100 py-5" v-if="!hasData && !loading">{{ noDataTxt }}</div>
      <div class="text-center w-100 py-5" v-if="loading">
        <app-spin />
      </div>
      <div v-if="needPagination" class="pagination mt-3">
        <app-pagination
          v-if="hasData && !loading"
          :pagination="pagination"
          @pagechange="onPageChange"
          :opts="opts"
          class="mt-3"
          :position="get(paginationStyle, 'position', 'center')"
          :ext-cls="get(paginationStyle, 'extCls', {})"
        />
      </div>
    </div>
  </no-ssr>
</template>

<script>
import IconDirection from "~/assets/svg/design-icons/direction.svg?inline";
import { isEqual, get } from "lodash";

export default {
  components: {
    IconDirection,
  },

  props: {
    heads: {
      type: Array,
      required: false,
      default: () => [],
    },
    headerFontweight: {
      type: String,
      default: "semi-bold", // normal | semi-bold | bold
    },
    headerSize: {
      type: String,
      default: "sm", // sm | md | lg
    },
    headerExtCls: {
      type: Object,
      default: () => {},
    },
    headerColor: {
      type: String,
      default: "dark", //primary | secondary | info...
    },
    bodyColor: {
      type: String,
      default: "base", //primary | secondary | info...
    },
    bgTable: {
      type: String,
      default: "transparent", //primary | secondary | info...
    },
    extTableCls: {
      type: Object,
      default: () => {},
    },
    paginationStyle: {
      // { position: '...', extCls: '...' }
      type: Object,
      default: () => {},
    },
    data: {
      type: Array,
      required: false,
      default: () => [],
    },
    sortBy: Array,
    pagination: {
      type: Object,
      required: false,
      default: () => {
        return {
          total_pages: 0,
          size: 10,
          total_elements: 0,
          first: 1,
          last: 1,
          number: 0,
        };
      },
    },
    selectAll: Boolean,
    multipleSelection: {
      type: Boolean,
      default: false,
      required: false,
    },
    opts: {
      type: Array,
      default: () => {
        return [
          { value: 10, text: "10" },
          { value: 20, text: "20" },
          { value: 30, text: "30" },
          { value: 50, text: "50" },
        ];
      },
    },
    noDataTxt: {
      type: String,
      default: "Không tìm thấy dữ liệu",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    needPagination: {
      type: Boolean,
      default: true,
    },
    primaryKey: {
      type: String,
      default: "id",
    },
    orderBy: {
      type: String,
      default: "name",
    },
    order: {
      type: String,
      default: "asc",
    },
    classTextCenter: {
      type: Boolean,
      default: false,
    },
    cols: {
      type: Array,
      required: false,
      default: () => [],
    },

    propsHead: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      allSelected: false,
      mouseOver: true,
      listSortBy: [],
      currentSort: this.orderBy,
      currentSortDir: this.order,
      selectedItems: [], // An array of selected rows
    };
  },
  watch: {
    selectedItems: function (oldVal, newVal) {
      this.$emit("selectionChange", this.selectedItems);
      this.allSelected =
        this.data.length > 0 && this.selectedItems.length == this.data.length;
    },
    loading: function (oldVal, newVal) {
      this.selectedItems.length = 0;
      this.selectAll = false;
    },
    data(newVal) {
      this.selectedItems.length &&
        (this.selectedItems = this.selectedItems.filter(
          // (i) => newVal.findIndex((item) => item.id === i.id) > -1
          (i) => newVal.findIndex((item) => item[this.primaryKey] === i[this.primaryKey]) > -1
        ));
      console.log("this.selectedItems", this.selectedItems, this.data.length);
      this.$nextTick(() => {
        if (
          this.data.length > 0 &&
          this.selectedItems.length == this.data.length
        ) {
          this.allSelected = true;
        } else {
          this.allSelected = false;
        }
      });
    },
  },
  methods: {
    checkSelected(cat) {
      const list = [...this.selectedItems];
      // const data = list.filter((item) => item.id == cat.id);
      const data = list.filter((item) => item[this.primaryKey] == cat[this.primaryKey]);
      return data.length > 0;
    },
    check(checked, item) {
      if (checked) {
        this.pushSelectedIndexes(item);
      } else {
        this.popSelectedIndexes(item);
      }
      this.$emit("check", item, this.selectedItems);
    },

    popSelectedIndexes(item) {
      if (_.some(this.selectedItems, item)) {
        // this.selectedItems include item
        let popId = item[this.primaryKey];
        this.selectedItems = _.reject(
          [...this.selectedItems],
          (i) => i[this.primaryKey] === popId
        );
      }
    },

    pushSelectedIndexes(item) {
      if (!_.some(this.selectedItems, item)) {
        // this.selectedItems include item
        this.selectedItems.push(item);
      }
    },

    changeSelect(checked) {
      // select all
      if (checked) {
        this.selectedItems = this.data;
      } else {
        if (this.selectedItems.length == this.data.length) {
          this.selectedItems = [];
        }
      }
      this.$emit("selectAll", this.selectedItems);
    },

    sort: function (sortBy) {
      if (sortBy === this.currentSort) {
        this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
      }
      this.currentSort = sortBy;
      this.$emit("sort", {
        sortBy: this.currentSort,
        order: this.currentSortDir,
      });
    },
    onPageChange(e) {
      this.$emit("pagechange", e);
    },
    swap(array, i, k) {
      const temp = array[i];
      array[i] = array[k];
      array[k] = temp;
    },
    get,
  },

  computed: {
    hasDefaultSlot() {
      return !!this.$slots.default;
    },
    hasActionsSlot() {
      return !!this.$slots["actions"] || !!this.$scopedSlots["actions"];
    },
    cats: function () {
      return this.data;
    },
    // allSelected: {
    //   set(value) {
    //     this.selectedItems;
    //     return value;
    //   },
    //   get() {
    //     this.selectedItems;
    //     return this.hasData && isEqual(this.selectedItems, this.data);
    //   }
    // },
    hasData() {
      return this.data.length > 0;
    },

    headerCls() {
      const fontWeightCls = {
        "app-table__head--normal": this.headerFontweight === "normal",
        "app-table__head--semi-bold": this.headerFontweight === "semi-bold",
        "app-table__head--bold": this.headerFontweight === "bold",
      };

      const fontSizeCls = {
        "app-table__head--sm": this.headerSize === "sm",
        "app-table__head--md": this.headerSize === "md",
        "app-table__head--lg": this.headerSize === "lg",
      };

      const colorCls = {
        "app-table__head--color-primary": this.headerColor === "primary",
        "app-table__head--color-secondary": this.headerColor === "secondary",
        "app-table__head--color-info": this.headerColor === "info",
        "app-table__head--color-error": this.headerColor === "error",
        "app-table__head--color-warning": this.headerColor === "warning",
        "app-table__head--color-base": this.headerColor === "base",
        "app-table__head--color-sub": this.headerColor === "sub",
        "app-table__head--color-gray": this.headerColor === "gray",
        "app-table__head--color-gray-2": this.headerColor === "gray-2",
        "app-table__head--color-gray-3": this.headerColor === "gray-3",
        "app-table__head--color-black": this.headerColor === "black",
        "app-table__head--color-light": this.headerColor === "light",
        "app-table__head--color-light-2": this.headerColor === "light-2",
        "app-table__head--color-dark": this.headerColor === "dark",
        "app-table__head--color-active": this.headerColor === "active",
      };

      return {
        ...fontWeightCls,
        ...fontSizeCls,
        ...colorCls,
      };
    },
    bodyCls() {
      const colorCls = {
        "app-table__body--color-primary": this.bodyColor === "primary",
        "app-table__body--color-secondary": this.bodyColor === "secondary",
        "app-table__body--color-info": this.bodyColor === "info",
        "app-table__body--color-error": this.bodyColor === "error",
        "app-table__body--color-warning": this.bodyColor === "warning",
        "app-table__body--color-base": this.bodyColor === "base",
        "app-table__body--color-sub": this.bodyColor === "sub",
        "app-table__body--color-gray": this.bodyColor === "gray",
        "app-table__body--color-gray-2": this.bodyColor === "gray-2",
        "app-table__body--color-gray-3": this.bodyColor === "gray-3",
        "app-table__body--color-black": this.bodyColor === "black",
        "app-table__body--color-light": this.bodyColor === "light",
        "app-table__body--color-light-2": this.bodyColor === "light-2",
        "app-table__body--color-dark": this.bodyColor === "dark",
        "app-table__body--color-active": this.bodyColor === "active",
      };
      return {
        ...colorCls,
      };
    },
    tableCls() {
      const bgCls = {
        "app-table__table--bg-transparent": this.bgTable === "transparent",
        "app-table__table--bg-primary": this.bgTable === "primary",
        "app-table__table--bg-secondary": this.bgTable === "secondary",
        "app-table__table--bg-info": this.bgTable === "info",
        "app-table__table--bg-success": this.bgTable === "success",
        "app-table__table--bg-error": this.bgTable === "error",
        "app-table__table--bg-warning": this.bgTable === "warning",
        "app-table__table--bg-gray": this.bgTable === "gray",
        "app-table__table--bg-input-gray": this.bgTable === "input-gray",
        "app-table__table--bg-white": this.bgTable === "white",
        "app-table__table--bg-black": this.bgTable === "black",
        "app-table__table--bg-light-2": this.bgTable === "light-2",
      };
      return {
        ...bgCls,
      };
    },
    gridCls() {
      let gCls = {
        "table-grid": this.cols.length > 0,
      };

      if (this.cols.length > 0) {
        this.cols.forEach((e, index) => {
          let i = index + 1;
          gCls["col-" + i + "--" + e] = true;
        });
      }

      return {
        ...gCls,
      };
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-table.scss";
</style>
