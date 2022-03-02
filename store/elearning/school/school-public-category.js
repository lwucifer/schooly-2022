import * as actionTypes from "../../../utils/action-types";
import * as mutationTypes from "../../../utils/mutation-types";
import * as APIs from "~/utils/endpoints";
import PublicCategory from "~/services/elearning/school/PublicCategory";

const state = () => ({
    categoryList:[]
})

const getters = {};

const actions = {
    async [actionTypes.PUBLIC_CATEGORY.LIST]({ commit }, params) {
      try {
        const options = { params };
        const result = await new PublicCategory(this.$axios)[actionTypes.BASE.LIST](
          options
        );
        if (result.success) {
          commit(mutationTypes.PUBLIC_CATEGORY.SET_CATEGORY_LIST, result.data);
        }
      } catch (error) {
        console.log("CATEGORY_LIST.error", error);
      }
    },
}
const mutations = {
    [mutationTypes.PUBLIC_CATEGORY.SET_CATEGORY_LIST](state, _data) {
      state.categoryList = _data;
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
  };
  