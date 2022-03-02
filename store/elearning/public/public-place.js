import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import PlaceDistrict from "~/services/elearning/public/PlaceDistrict";
import PlaceProvince from "~/services/elearning/public/PlaceProvince";
import PlaceWard from "~/services/elearning/public/PlaceWard";

/**
 * initial state
 */
const state = () => ({
  provinces: [],
  districts: [],
  wards: []
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  async [actionTypes.ELEARNING_PUBLIC_PLACE.PROVINCE]({ commit }, options) {
    try {
      const result = await new PlaceProvince(this.$axios)[
        actionTypes.BASE.LIST
      ](options);
      commit(
        mutationTypes.ELEARNING_PUBLIC_PLACE
          .SET_ELEARNING_PUBLIC_PLACE_PROVINCE,
        result.data
      );
    } catch (error) {
      //
    }
  },
  async [actionTypes.ELEARNING_PUBLIC_PLACE.DISTRICT]({ commit }, options) {
    try {
      const result = await new PlaceDistrict(this.$axios)[
        actionTypes.BASE.LIST
      ](options);
      commit(
        mutationTypes.ELEARNING_PUBLIC_PLACE
          .SET_ELEARNING_PUBLIC_PLACE_DISTRICT,
        result.data
      );
    } catch (error) {
      commit(
        mutationTypes.ELEARNING_PUBLIC_PLACE
          .SET_ELEARNING_PUBLIC_PLACE_DISTRICT,
        []
      );
      commit(
        mutationTypes.ELEARNING_PUBLIC_PLACE.SET_ELEARNING_PUBLIC_PLACE_WARD,
        []
      );
    }
  },
  async [actionTypes.ELEARNING_PUBLIC_PLACE.WARD]({ commit }, options) {
    try {
      const result = await new PlaceWard(this.$axios)[actionTypes.BASE.LIST](
        options
      );
      commit(
        mutationTypes.ELEARNING_PUBLIC_PLACE.SET_ELEARNING_PUBLIC_PLACE_WARD,
        result.data
      );
    } catch (error) {
      //
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.ELEARNING_PUBLIC_PLACE.SET_ELEARNING_PUBLIC_PLACE_PROVINCE](
    state,
    provinces
  ) {
    state.provinces = provinces;
  },
  [mutationTypes.ELEARNING_PUBLIC_PLACE.SET_ELEARNING_PUBLIC_PLACE_DISTRICT](
    state,
    districts
  ) {
    state.districts = districts;
  },
  [mutationTypes.ELEARNING_PUBLIC_PLACE.SET_ELEARNING_PUBLIC_PLACE_WARD](
    state,
    wards
  ) {
    state.wards = wards;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
