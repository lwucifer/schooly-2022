<template>
  <div class="app-video" :class="classes" v-on="$listeners">
    <video
      ref="video"
      class="app-video__video"
      v-bind="$attrs"
      v-on="listeners"
      :playsinline="playsinline"
      :src="src"
    ></video>

    <div class="app-video__overlay" @click="play">
      <button type="button" class="app-video__overlay-btn">
        <app-spin v-if="isWaiting" />
        <slot v-else name="play-icon">
          <IconPauseCircleFilled v-if="isPlay" class="icon d-block fill-opacity-1" />
          <IconPlayCircleFilled v-else class="icon d-block fill-opacity-1" />
        </slot>
      </button>
    </div>

    <div v-if="showControls" class="app-video__controls" :class="{ show: manualShowControls }">
      <button
        type="button"
        class="app-video__control-btn app-video__control-btn--play"
        @click="handleClickControlPlay"
      >
        <IconPause v-if="isPlay" class="icon fill-opacity-1" />
        <IconPlayArrow v-else class="icon fill-opacity-1" />
      </button>

      <div class="app-video__timer">{{ timer }}</div>
      <div class="app-video__seek-bar-wrapper" @click="handleClickSeekBar">
        <div class="app-video__seek-bar">
          <div
            class="app-video__seek"
            :style="{ width: `${(((currentTime / duration) * 100) || 0)}%` }"
          />
          <div class="app-video__buffered" :style="{ width: Math.ceil(buffered) + '%' }" />
        </div>
      </div>

      <button type="button" class="app-video__control-btn" @click="handleClickFullScreen">
        <IconFullscreenExit v-if="fullscreen" class="icon fill-opacity-1" />
        <IconFullscreen v-else class="icon fill-opacity-1" />
      </button>
    </div>
  </div>
</template>

<script>
import { openFullscreen, closeFullscreen } from "~/utils/common";
import IconPlayCircleFilled from "~/assets/svg/v2-icons/play_circle_filled_24px.svg?inline";
import IconPauseCircleFilled from '~/assets/svg/v2-icons/pause_circle_filled_24px.svg?inline';
import IconFullscreen from "~/assets/svg/v2-icons/fullscreen_24px.svg?inline";
import IconFullscreenExit from "~/assets/svg/v2-icons/fullscreen_exit_24px.svg?inline";
import IconPause from "~/assets/svg/v2-icons/pause_24px.svg?inline";
import IconPlayArrow from "~/assets/svg/v2-icons/play_arrow_24px.svg?inline";

export default {
  inheritAttrs: false,

  components: {
    IconPlayCircleFilled,
    IconPauseCircleFilled,
    IconFullscreen,
    IconFullscreenExit,
    IconPause,
    IconPlayArrow,
  },

  props: {
    playsinline: {
      type: Boolean,
      default: true,
    },
    src: String,
    size: {
      type: String,
      default: "sm",
      validator: (value) => ["sm", "md"].includes(value),
    },
    showControls: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      video: null,
      isPlay: false,
      isPlaying: false,
      buffered: 0,
      currentTime: 0,
      duration: 0,
      fullscreen: false,
      manualShowControls: false,
    };
  },

  computed: {
    classes() {
      return {
        "app-video--size-md": this.size === "md",
        play: this.isPlay,
        fullscreen: this.fullscreen,
        waiting: this.isWaiting,
      };
    },

    listeners: function () {
      let result = {};
      for (const key in this.$listeners) {
        if (key.includes("video-")) {
          const newKey = key.replace("video-", "");
          result[newKey] = this.$listeners[key];
        }
      }
      return {
        ...result,
        play: (event) =>
          this.withOverrideMethod(result.play, this.handlePlay, event),
        pause: (event) =>
          this.withOverrideMethod(result.pause, this.handlePause, event),
        ended: (event) =>
          this.withOverrideMethod(result.ended, this.handleEnded, event),
        click: (event) =>
          this.withOverrideMethod(
            result.click,
            this.handleClickControlPlay,
            event
          ),
        playing: (event) =>
          this.withOverrideMethod(result.playing, this.handlePlaying, event),
        waiting: (event) =>
          this.withOverrideMethod(result.waiting, this.handleWaiting, event),
      };
    },

    timer() {
      const seconds = this.duration - this.currentTime;
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const secondsRounded = Math.round(seconds % 60);
      const secondsDisplay =
        secondsRounded >= 10 ? secondsRounded : "0" + secondsRounded;
      const minutesDisplay = minutes < 10 ? "0" + minutes : minutes;
      const hoursDisplay = hours < 10 ? "0" + hours : hours;
      return `${
        hours ? hoursDisplay + ":" : ""
      }${minutesDisplay}:${secondsDisplay}`;
    },

    isWaiting() {
      return this.isPlay && !this.isPlaying;
    },
  },

  mounted() {
    this.video = this.$refs.video;

    this.$nextTick(() => {
      this.video.addEventListener("loadedmetadata", this.handleLoadedMetaData);
      this.video.addEventListener("timeupdate", this.handleTimeUpdate);
      this.video.addEventListener("progress", this.handleProgress);
    });

    window.addEventListener("fullscreenchange", this.handleFullScreenChange);
  },

  beforeDestroy() {
    window.removeEventListener("fullscreenchange", this.handleFullScreenChange);
  },

  methods: {
    withOverrideMethod(overrideMethod, componentMethod, event) {
      const overrideResult =
        typeof overrideMethod === "function" ? overrideMethod(event) : true;
      overrideResult && componentMethod(event);
    },

    play() {
      this.$refs.video.play();
    },

    pause() {
      this.$refs.video.pause();
    },

    seek(seconds) {
      this.$refs.video.currentTime = seconds;
    },

    handlePlay(event) {
      this.isPlay = true;
    },

    handlePause(event) {
      this.isPlay = false;
      this.isPlaying = false;
    },

    handlePlaying(event) {
      this.isPlaying = true;
    },

    handleWaiting(event) {
      this.isPlaying = false;
    },

    handleEnded(event) {
      this.isPlay = false;
      this.isPlaying = false;
    },

    handleLoadedMetaData(event) {
      const myVideo = event.target;
      this.duration = myVideo.duration;
    },

    handleTimeUpdate(event) {
      const myVideo = event.target;
      this.currentTime = myVideo.currentTime;
    },

    handleProgress(event) {
      const myVideo = event.target;
      const duration = myVideo.duration;

      // https://developer.mozilla.org/en-US/Apps/Fundamentals/Audio_and_video_delivery/buffering_seeking_time_ranges#Creating_our_own_Buffering_Feedback
      if (duration > 0) {
        for (let i = 0; i < myVideo.buffered.length; i++) {
          if (
            myVideo.buffered.start(myVideo.buffered.length - 1 - i) <
            myVideo.currentTime
          ) {
            this.buffered =
              (myVideo.buffered.end(myVideo.buffered.length - 1 - i) /
                duration) *
              100;
            // do what you will with it. I.E - store.set({ bufferProgress });
            break;
          }
        }
      }
    },

    handleClickControlPlay(event) {
      if (this.isPlay) {
        this.pause();
      } else {
        this.play();
      }
      this.isPlay != this.isPlay;
    },

    handleClickSeekBar(event) {
      const element = event.target;
      let offset = {
        left: element.offsetLeft,
        top: element.offsetTop,
      };
      let reference = event.target.offsetParent;
      while (reference != null) {
        offset.left += reference.offsetLeft;
        offset.top += reference.offsetTop;
        reference = reference.offsetParent;
      }
      const percent =
        100 -
        ((element.clientWidth - (event.pageX - offset.left)) /
          element.clientWidth) *
          100;
      const currentTime =
        Math.floor((this.duration / 100) * percent) > 0
          ? Math.floor((this.duration / 100) * percent)
          : 0;
      this.seek(currentTime);
    },

    handleClickFullScreen() {
      if (this.fullscreen) {
        if (document.fullscreenElement != null) {
          closeFullscreen();
        }
      } else {
        if (document.fullscreenElement == null) {
          const el = this.$el;
          openFullscreen(el);
        }
      }
    },

    handleFullScreenChange(event) {
      if (document.fullscreenElement) {
        this.fullscreen = true;
        window.addEventListener(
          "mousemove",
          this.handleMouseMoveWhenFullscreen
        );
      } else {
        this.fullscreen = false;
        window.removeEventListener(
          "mousemove",
          this.handleMouseMoveWhenFullscreen
        );
      }
    },

    handleMouseMoveWhenFullscreen(event) {
      if (!this.manualShowControls) {
        this.manualShowControls = true;
        this.$nextTick(() => {
          const timeout = setTimeout(() => {
            this.manualShowControls = false;
            clearTimeout(timeout);
          }, 3000);
        });
      }
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/app/_app-video.scss";
</style>