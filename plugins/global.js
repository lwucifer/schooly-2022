// Globally register all base components for convenience, because they
// will be used very frequently. Components are registered using the
// PascalCased version of their file name.
import Vue from "vue";

// https://webpack.js.org/guides/dependency-management/#require-context
const requireComponent = require.context(
    // Look for files in the current directory
    "../components/common/",
    // Do look in subdirectories
    true,
    // Only include "_base-" prefixed .vue files
    /[\w-]+\.vue$/
);

// For each matching file name...
requireComponent.keys().forEach(fileName => {
    // Get the component config
    const componentConfig = requireComponent(fileName);

    // only get Original Component Name
    const arrName = fileName.split("/");
    const originalName = arrName[arrName.length - 1];
    // Get the PascalCase version of the component name
    const componentName = originalName
        // Remove the "./_" from the beginning
        .replace(/^\.\/_/, "")
        // Remove the file extension from the end
        .replace(/\.\w+$/, "")
        // Split up kebabs
        .split("-")
        // Upper case
        .map(kebab => kebab.charAt(0).toUpperCase() + kebab.slice(1))
        // Concatenated
        .join("");

    // Globally register the component
    Vue.component(componentName, componentConfig.default || componentConfig);
});