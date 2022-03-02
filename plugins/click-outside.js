import Vue from "vue";

const handleClick = (event, el, binding, vnode) => {
  !(event.target === el || el.contains(event.target)) && vnode.context[binding.expression]();
};

Vue.directive("click-outside", {
  bind: (el, binding, vnode) => {
    window.addEventListener(
      "click",
      event => handleClick(event, el, binding, vnode),
      true
    );
  },

  unbind: (el, binding, vnode) => {
    window.removeEventListener(
      "click",
      event => handleClick(event, el, binding, vnode),
      true
    );
  }
});
