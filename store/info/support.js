import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import Support from "~/services/info/Support";

/**
 * initial state
 */
const state = () => ({
  carts: []
});

/**
 * initial getters
 */
const getters = {
    
};

const actions = {
  async [actionTypes.INFO_SUPPORT.ADD]({ commit }, payload) {
    try {
        const result = await new Support(this.$axios)[actionTypes.BASE.ADD](payload);
        console.log("[Support] add", result);
        return result;
    } catch (err) {
        console.log("[Support] add.err", err);
        return err;
    }
},
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.CART.SET_CART_LIST](state, _cartList) {
    // console.log("SET_CART_LIST", _cartList);
    state.carts = _cartList;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
