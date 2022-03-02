<template>
  <div class="container icons-page">
    <nav class="mb-6 nav">
      <ul>
        <li>
          <a href="#icons">Icons</a>
        </li>
        <li>
          <a href="#v2-icons">V2 Icons</a>
        </li>
        <li>
          <a href="#design-icons">Design Icons</a>
        </li>
        <li>
          <a href="#text-editor">Text Editor Icons</a>
        </li>
      </ul>
    </nav>

    <section class="mb-6" id="icons">
      <h2 class="mb-3 title">Icons from /svg/icons</h2>
      <div class="row">
        <div class="col-2 my-3 text-center" v-for="icon in icons" :key="icon.path">
          <div>
            <component
              :is="get(icon, 'icon.default', icon.icon)"
              class="icon"
              fill="#000"
              @click="handleClick(icon.path, '~/assets/svg/icons')"
            />
          </div>
          <span class="caption">{{ icon.path }}</span>
        </div>
      </div>
    </section>

    <section class="mb-6" id="v2-icons">
      <h2 class="mb-3 title">Icons from /svg/v2-icons</h2>
      <div class="row">
        <div class="col-2 my-3 text-center" v-for="icon in v2Icons" :key="icon.path">
          <div>
            <component
              :is="get(icon, 'icon.default', icon.icon)"
              class="icon"
              fill="#000"
              @click="handleClick(icon.path, '~/assets/svg/v2-icons')"
            />
          </div>
          <span class="caption">{{ icon.path }}</span>
        </div>
      </div>
    </section>

    <section class="mb-6" id="design-icons">
      <h2 class="mb-3 title">Icons from /svg/design-icons</h2>
      <div class="row mb-6">
        <div class="col-2 my-3 text-center" v-for="icon in designIcons" :key="icon.path">
          <div>
            <component
              :is="get(icon, 'icon.default', icon.icon)"
              class="icon"
              fill="#000"
              @click="handleClick(icon.path, '~/assets/svg/design-icons')"
            />
          </div>
          <span class="caption">{{ icon.path }}</span>
        </div>
      </div>
    </section>

    <section class="mb-6 title" id="text-editor">
      <h2 class="mb-3">Icons from /svg/text-editor</h2>
      <div class="row mb-6">
        <div class="col-2 my-3 text-center" v-for="icon in textEditorIcons" :key="icon.path">
          <div>
            <component
              :is="get(icon, 'icon.default', icon.icon)"
              class="icon"
              fill="#000"
              @click="handleClick(icon.path, '~/assets/svg/text-editor')"
            />
          </div>
          <span class="caption">{{ icon.path }}</span>
        </div>
      </div>
    </section>

    <app-modal v-if="modal" @close="hideModal" :width="600" :footer="false" :header="false">
      <div class="modal-content" slot="content">
        <code>
          <div v-text="`<template>`"></div>
          <div>
            &nbsp;
            <span v-text="`<${convertIconComponentName(dataModal.path)} class='icon' />`"></span>
          </div>
          <div v-text="`</template>`"></div>
          <br />
          <div v-text="`<script>`"></div>
          <div>{{ `import ${convertIconComponentName(dataModal.path)} from '${convertIconPath(dataModal)}';` }}</div>
          <br />
          <div>
            export default {
            <br />&nbsp;
            <span>
              components: {
              <br />
              &nbsp;&nbsp;&nbsp;
              {{ convertIconComponentName(dataModal.path) }}
              <br />&nbsp;&nbsp;}
            </span>
            <br />}
          </div>
          <div v-text="`</script>`"></div>
        </code>
      </div>
    </app-modal>
  </div>
</template>

<script>
import { get } from "lodash";

export default {
  data: () => ({
    modal: false,
    dataModal: {},
    icons: [],
    designIcons: [],
    textEditorIcons: [],
    v2Icons: []
  }),

  head() {
    return {
      title: "Icons - Schoolly"
    };
  },

  created() {
    // https://webpack.js.org/guides/dependency-management/#requirecontext
    const req = require.context("~/assets/svg/icons?inline", false, /.*\.svg$/);

    const req2 = require.context(
      "~/assets/svg/design-icons?inline",
      false,
      /.*\.svg$/
    );

    const req3 = require.context(
      "~/assets/svg/text-editor?inline",
      false,
      /.*\.svg$/
    );

    const req4 = require.context(
      "~/assets/svg/v2-icons?inline",
      true,
      /.*\.svg$/
    );

    req.keys().forEach(key => {
      const icon = req(key);
      this.icons.push({ path: key, icon });
    });

    req2.keys().forEach(key => {
      const icon = req2(key);
      this.designIcons.push({ path: key, icon });
    });

    req3.keys().forEach(key => {
      const icon = req3(key);
      this.textEditorIcons.push({ path: key, icon });
    });

    req4.keys().forEach(key => {
      const icon = req4(key);
      this.v2Icons.push({ path: key, icon });
    });
  },

  methods: {
    get,

    handleClick(path, source) {
      this.dataModal = { path, sourcePath: source };
      this.modal = true;
    },

    hideModal() {
      this.modal = false;
      this.dataModal = {};
    },

    convertIconComponentName(path) {
      const fileName = path.replace(/(\.\/|.svg)/g, "");
      const splitedFileName =
        fileName.indexOf("_") > -1 ? fileName.split("_") : fileName.split("-");
      const fileNameConverted = splitedFileName
        .map(
          word => word.slice(0, 1).toUpperCase() + word.slice(1, word.length)
        )
        .join("");
      return `Icon${fileNameConverted}`;
    },

    convertIconPath({ path, sourcePath }) {
      const fileName = path.replace("./", "");
      return `${sourcePath}/${fileName}?inline`;
    }
  }
};
</script>

<style lang="scss" scoped>
.icon {
  font-size: 3rem;
  cursor: pointer;
}

.nav {
  ul {
    list-style-type: none;

    li {
      display: inline-block;
    }

    a {
      text-decoration: none;
      color: inherit;
      font-size: map-get($text-size, "body-1");
      font-weight: 700;
      margin-right: 3rem;

      &:hover {
        color: $color-primary;
      }
    }
  }
}
</style>