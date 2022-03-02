import Vue from 'vue';
import Lazyload from 'vue-lazyload';

Vue.use(Lazyload, {
    preLoad: 1.3,
    error: '/images/default-course-image.png',
    loading: '/images/default-course-image.png',
    attempt: 1,
    listenEvents: ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove']
})