module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    quotes: "off",
    "no-trailing-spaces": "off",
    "eol-last": "off",
    "space-before-function-paren": "off",
    "comma-dangle": "off",
    "no-multiple-empty-lines": "off",
    "vue/html-closing-bracket-spacing": "off",
    "vue/html-self-closing": "off",
    camelcase: "off",
    "no-unused-vars": "warn",
    "brace-style": "off",
    "vue/singleline-html-element-content-newline": "off",
    "import/order": "warn"
  }
}
