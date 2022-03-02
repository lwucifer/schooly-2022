import Vue from 'vue'
import vSelect from 'vue-select'
import IconCaretDown from '~/assets/svg/icons/caret-down-thin.svg?inline'
import IconClose from "~/assets/svg/icons/close.svg?inline"

// Set the components prop default to return our fresh components
vSelect.props.components.default = () => ({
    Deselect: {
        render: createElement => createElement(IconClose),
    },
    OpenIndicator: {
        render: createElement => createElement(IconCaretDown),
    },
});

//Set indicator icon
vSelect.props.clearable.default = () => false;

if (process.BROWSER_BUILD) {
  Vue.use(vSelect)
}