import Vue from "vue";
import EmojiConvertor from "emoji-js";

const emoji = new EmojiConvertor();
emoji.wrap_native = true;
emoji.use_sheet = true;
emoji.img_sets.apple.sheet = "https://cdn.jsdelivr.net/npm/emoji-datasource@5.0.1/img/apple/sheets/32.png";
emoji.img_sets.apple.sheet_size = 32;

const replaceUnified = text => emoji.replace_unified(text);
const replaceColons = text => emoji.replace_colons(text);

Vue.filter('$emoji_replace_unified', replaceUnified);
Vue.filter('$emoji_replace_colons', replaceColons);

export default (ctx, inject) => {
  inject('emoji', emoji)
}
