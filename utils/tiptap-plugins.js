import { Extension, Plugin, Node } from "tiptap";
import { Emoji as EmojiMart } from "emoji-mart-vue";
import { getEmojiPosition, getEmojiBackgroundSize } from "~/utils/emoji.js";

export class EnterHandler extends Extension {
  get name() {
    return "enter_handler";
  }

  get defaultOptions() {
    return {
      preventDefault: false,
      onEnter: null,
    };
  }

  get plugins() {
    return [
      new Plugin({
        props: {
          handleKeyDown: (view, event) => {
            const { onEnter, preventDefault } = this.options;
            if (event.key === "Enter" && !event.shiftKey) {
              onEnter && onEnter();

              return !preventDefault;
            }

            return preventDefault;
          },
        },
      }),
    ];
  }
}

export class PasteHandler extends Extension {
  get name() {
    return "paste_handler";
  }

  get defaultOptions() {
    return {
      onPaste: null,
    };
  }

  get plugins() {
    return [
      new Plugin({
        props: {
          handlePaste: (view, event, slice) => {
            // console.log('event', event)
            // console.log('slice', event)
            const { onPaste } = this.options;
            onPaste && onPaste(view, event, slice);
          },
        },
      }),
    ];
  }
}

export class Emoji extends Node {
  get name() {
    return "emoji";
  }

  get schema() {
    return {
      group: 'inline',
      content: 'inline',
      inline: true,
      attrs: {
        emoji: {
          default: '',
          // required: true
        },
        size: {
          type: Number,
          default: 16
        },
        sheetUrl: {
          type: String,
          default: `https://unpkg.com/emoji-datasource-twitter@4.0.4/img/twitter/sheets-256/64.png`
        }
      },
      parseDOM: [{ tag: "span.emoji-mart-emoji" }],
      toDOM: node => node.attrs.emoji
      // toDOM: (node) => {
      //   return [
      //     "span",
      //     {
      //       class: "emoji-mart-emoji",
      //       contenteditable: false,
      //       emoji: node.attrs.emoji,
      //       size: node.attrs.size
      //     }, [
      //       'span', {
      //         style: `display: 'inline-block'; width: ${node.attrs.size + 'px'}; height: ${node.attrs.size + 'px'}; background-image: ${node.attrs.sheetUrl}; background-size: ${getEmojiBackgroundSize()}; background-position: ${getEmojiPosition(emojiData, node.attrs.emoji)}`
      //       }
      //     ]
      //   ]
      // },
    };
  }

  get view() {
    return {
      props: ["node"],
      render(h) {
        return h(EmojiMart, {
          props: { ...this.node.attrs, set: 'twitter' },
        });
      },
    };
  }

  commands({ type }) {
    return (attrs) => (state, dispatch) => dispatch(state.tr.replaceSelectionWith(type.create({ emoji: attrs })), false);
  }
}
