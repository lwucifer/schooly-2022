import emojiData from "emoji-mart-vue/data/twitter.json";

const SHEET_COLUMNS = 52;

export function getEmojiPosition(emojiData, emoji) {
  if (!emoji) return;
  const emojiName = emoji.replace(new RegExp(":", "g"), "");
  const emojiInData = emojiData[emojiName];
  if (!emojiInData) return;
  const multiply = 100 / (SHEET_COLUMNS - 1);
  const x = multiply * emojiInData.k[0];
  const y = multiply * emojiInData.k[1];
  return `${x}% ${y}%`;
}

export const getEmojiBackgroundSize = () => 100 * SHEET_COLUMNS + "%";

/**
 * Replace colons to emoji html
 * Ex: :heart: -> <span class="emoji-mart-emoji">...</span>
 * @param 
 */
export function replaceColons(str) {
  const rx = new RegExp('\:[a-zA-Z0-9-_+]+\:(\:skin-tone-[2-6]\:)?', 'g');

  return str.replace(rx, colons => {
    
  })
}