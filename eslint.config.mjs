import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";

export default [
  {files: ["**/*.{js,mjs,cjs,vue}"]},
  {languageOptions: { 
      globals: { 
          ...globals.browser, 
          ...globals.node  // Thêm môi trường Node.js
      }
  }},
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/essential"],
];
