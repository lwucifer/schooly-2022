import Vue from "vue";
import VueCurrencyInput from "vue-currency-input";

const pluginOptions = {
  /* see config reference */
  globalOptions: { currency: "VND" },
};

Vue.use(VueCurrencyInput, pluginOptions);
